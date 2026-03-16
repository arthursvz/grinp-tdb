CREATE TABLE IF NOT EXISTS "ActionPermission" (
    "id" TEXT NOT NULL,
    "role" "BureauRole" NOT NULL,
    "action" TEXT NOT NULL,
    "access" "AccessLevel" NOT NULL,
    CONSTRAINT "ActionPermission_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "ActionPermission_role_action_key" ON "ActionPermission"("role", "action");
