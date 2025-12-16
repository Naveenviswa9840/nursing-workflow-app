-- CreateEnum
CREATE TYPE "InvestigationStatus" AS ENUM ('PENDING', 'COMPLETED');

-- CreateTable
CREATE TABLE "Investigation" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "testName" TEXT NOT NULL,
    "status" "InvestigationStatus" NOT NULL DEFAULT 'PENDING',
    "reportFile" TEXT,
    "comments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Investigation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Investigation" ADD CONSTRAINT "Investigation_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;
