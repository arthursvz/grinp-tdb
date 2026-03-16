DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'BureauRole') THEN
        CREATE TYPE "BureauRole" AS ENUM ('PRESIDENT', 'VICE_PRESIDENT', 'TRESORIER', 'SECRETAIRE', 'MATERIEL');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'BureauModule') THEN
        CREATE TYPE "BureauModule" AS ENUM ('PRESIDENCE', 'VICE_PRESIDENCE', 'TRESORERIE', 'SECRETAIRE', 'MATERIEL');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'AccessLevel') THEN
        CREATE TYPE "AccessLevel" AS ENUM ('NONE', 'READ', 'WRITE');
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
