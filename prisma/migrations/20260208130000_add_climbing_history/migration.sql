CREATE TABLE IF NOT EXISTS "ClimbingRoute" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "relay" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ClimbingRoute_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "ClimbingSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "slotId" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "durationMinutes" INTEGER,
    "feeling" TEXT,
    "isExternal" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ClimbingSession_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "ClimbingAttempt" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "routeId" TEXT NOT NULL,
    "success" BOOLEAN NOT NULL DEFAULT false,
    "completion" INTEGER NOT NULL DEFAULT 100,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ClimbingAttempt_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "ClimbingSession_userId_idx" ON "ClimbingSession"("userId");
CREATE INDEX IF NOT EXISTS "ClimbingSession_slotId_idx" ON "ClimbingSession"("slotId");
CREATE INDEX IF NOT EXISTS "ClimbingAttempt_sessionId_idx" ON "ClimbingAttempt"("sessionId");
CREATE INDEX IF NOT EXISTS "ClimbingAttempt_routeId_idx" ON "ClimbingAttempt"("routeId");

ALTER TABLE "ClimbingSession"
    ADD CONSTRAINT "ClimbingSession_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ClimbingSession"
    ADD CONSTRAINT "ClimbingSession_slotId_fkey"
    FOREIGN KEY ("slotId") REFERENCES "Slot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ClimbingAttempt"
    ADD CONSTRAINT "ClimbingAttempt_sessionId_fkey"
    FOREIGN KEY ("sessionId") REFERENCES "ClimbingSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ClimbingAttempt"
    ADD CONSTRAINT "ClimbingAttempt_routeId_fkey"
    FOREIGN KEY ("routeId") REFERENCES "ClimbingRoute"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
