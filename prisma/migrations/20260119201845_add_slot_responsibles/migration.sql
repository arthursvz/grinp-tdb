-- CreateTable
CREATE TABLE "_Slot responsibles" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Slot responsibles_AB_unique" ON "_Slot responsibles"("A", "B");

-- CreateIndex
CREATE INDEX "_Slot responsibles_B_index" ON "_Slot responsibles"("B");

-- AddForeignKey
ALTER TABLE "_Slot responsibles" ADD CONSTRAINT "_Slot responsibles_A_fkey" FOREIGN KEY ("A") REFERENCES "Slot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Slot responsibles" ADD CONSTRAINT "_Slot responsibles_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
