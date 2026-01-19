-- CreateEnum
CREATE TYPE "SlotType" AS ENUM ('CRENEAU', 'EVENEMENT', 'FERMETURE');

-- AlterTable
ALTER TABLE "Slot" ADD COLUMN     "slot_type" "SlotType" NOT NULL DEFAULT 'CRENEAU';
