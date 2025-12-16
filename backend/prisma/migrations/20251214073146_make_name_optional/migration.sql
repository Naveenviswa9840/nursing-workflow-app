-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_patientId_fkey";

-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "staffId" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "name" TEXT,
ADD COLUMN     "password" TEXT,
ADD COLUMN     "role" TEXT;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
