/*
  Warnings:

  - You are about to drop the column `amount` on the `ActivityData` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `ActivityData` table. All the data in the column will be lost.
  - Added the required column `category` to the `ActivityData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usage` to the `ActivityData` table without a default value. This is not possible if the table is not empty.
  - Made the column `emissionFactorId` on table `ActivityData` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ActivityData" DROP CONSTRAINT "ActivityData_emissionFactorId_fkey";

-- AlterTable
ALTER TABLE "ActivityData" DROP COLUMN "amount",
DROP COLUMN "type",
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "usage" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "emissionFactorId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "ActivityData" ADD CONSTRAINT "ActivityData_emissionFactorId_fkey" FOREIGN KEY ("emissionFactorId") REFERENCES "EmissionFactor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
