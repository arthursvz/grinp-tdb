-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "churros_uid" TEXT,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "root" BOOLEAN NOT NULL DEFAULT false,
    "instructor" BOOLEAN NOT NULL DEFAULT false,
    "cotisant_as" BOOLEAN NOT NULL DEFAULT false,
    "cotisant_grinp" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contribution" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'GrINP',
    "startDate" TIMESTAMP(3) NOT NULL,
    "expirationDate" TIMESTAMP(3) NOT NULL,
    "amount" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Contribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Slot" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "starts_at" TIMESTAMP(3) NOT NULL,
    "ends_at" TIMESTAMP(3) NOT NULL,
    "capacity" INTEGER NOT NULL DEFAULT 18,
    "owner_id" TEXT NOT NULL,

    CONSTRAINT "Slot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Slot attendees" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_Slot participants" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_churros_uid_key" ON "User"("churros_uid");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_id_idx" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Contribution_id_key" ON "Contribution"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Session_id_key" ON "Session"("id");

-- CreateIndex
CREATE INDEX "Session_id_idx" ON "Session"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Slot_id_key" ON "Slot"("id");

-- CreateIndex
CREATE INDEX "Slot_id_idx" ON "Slot"("id");

-- CreateIndex
CREATE UNIQUE INDEX "_Slot attendees_AB_unique" ON "_Slot attendees"("A", "B");

-- CreateIndex
CREATE INDEX "_Slot attendees_B_index" ON "_Slot attendees"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Slot participants_AB_unique" ON "_Slot participants"("A", "B");

-- CreateIndex
CREATE INDEX "_Slot participants_B_index" ON "_Slot participants"("B");

-- AddForeignKey
ALTER TABLE "Contribution" ADD CONSTRAINT "Contribution_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Slot" ADD CONSTRAINT "Slot_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Slot attendees" ADD CONSTRAINT "_Slot attendees_A_fkey" FOREIGN KEY ("A") REFERENCES "Slot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Slot attendees" ADD CONSTRAINT "_Slot attendees_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Slot participants" ADD CONSTRAINT "_Slot participants_A_fkey" FOREIGN KEY ("A") REFERENCES "Slot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Slot participants" ADD CONSTRAINT "_Slot participants_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
