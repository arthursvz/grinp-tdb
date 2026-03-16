DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'SlotType') THEN
        CREATE TYPE "SlotType" AS ENUM ('CRENEAU', 'EVENEMENT', 'FERMETURE');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'BureauRole') THEN
        CREATE TYPE "BureauRole" AS ENUM ('PRESIDENT', 'VICE_PRESIDENT', 'TRESORIER', 'SECRETAIRE', 'MATERIEL');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'BureauModule') THEN
        CREATE TYPE "BureauModule" AS ENUM ('PRESIDENCE', 'VICE_PRESIDENCE', 'TRESORERIE', 'SECRETAIRE', 'MATERIEL');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'AccessLevel') THEN
        CREATE TYPE "AccessLevel" AS ENUM ('NONE', 'READ', 'WRITE');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'EventStatus') THEN
        CREATE TYPE "EventStatus" AS ENUM ('PLANNED', 'ONGOING', 'DONE', 'CANCELLED');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'FinanceType') THEN
        CREATE TYPE "FinanceType" AS ENUM ('INCOME', 'EXPENSE');
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS "BureauPermission" (
    "id" TEXT NOT NULL,
    "role" "BureauRole" NOT NULL,
    "module" "BureauModule" NOT NULL,
    "access" "AccessLevel" NOT NULL,
    CONSTRAINT "BureauPermission_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "BureauPermission_role_module_key" ON "BureauPermission"("role", "module");

CREATE TABLE IF NOT EXISTS "InventoryItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT,
    "status" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "acquiredYear" INTEGER,
    "manufacturedYear" INTEGER,
    "expirationYear" INTEGER,
    "photoUrl" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "InventoryItem_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "ClubEvent" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" "EventStatus" NOT NULL DEFAULT 'PLANNED',
    "date" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ClubEvent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Meeting" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "attendees" TEXT,
    "minutes" TEXT,
    "fileUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Meeting_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "FinanceEntry" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "amount" DECIMAL(10, 2) NOT NULL,
    "type" "FinanceType" NOT NULL,
    "category" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "justificatifUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FinanceEntry_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "DailyBeta" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "is_special" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DailyBeta_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "GlobalAlert" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GlobalAlert_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Log" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "details" TEXT,
    "target" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "Log_userId_idx" ON "Log"("userId");

CREATE TABLE IF NOT EXISTS "Info" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "link" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" TEXT NOT NULL,
    CONSTRAINT "Info_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "_EventResponsibles" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "_EventResponsibles_AB_unique" ON "_EventResponsibles"("A", "B");
CREATE INDEX IF NOT EXISTS "_EventResponsibles_B_index" ON "_EventResponsibles"("B");

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Log_userId_fkey') THEN
        ALTER TABLE "Log" ADD CONSTRAINT "Log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Info_authorId_fkey') THEN
        ALTER TABLE "Info" ADD CONSTRAINT "Info_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_EventResponsibles_A_fkey') THEN
        ALTER TABLE "_EventResponsibles" ADD CONSTRAINT "_EventResponsibles_A_fkey" FOREIGN KEY ("A") REFERENCES "ClubEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = '_EventResponsibles_B_fkey') THEN
        ALTER TABLE "_EventResponsibles" ADD CONSTRAINT "_EventResponsibles_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
