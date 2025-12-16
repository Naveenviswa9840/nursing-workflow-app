/*
  Warnings:

  - You are about to drop the column `staffName` on the `Note` table. All the data in the column will be lost.
  - Made the column `staffId` on table `Note` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `gender` on the `Patient` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_staffId_fkey";

-- AlterTable
ALTER TABLE "Note" DROP COLUMN "staffName",
ALTER COLUMN "staffId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Patient" ALTER COLUMN "age" DROP NOT NULL,
DROP COLUMN "gender",
ADD COLUMN     "gender" "Gender" NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'Nurse';

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
