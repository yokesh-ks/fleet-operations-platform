/*
  Warnings:

  - You are about to drop the column `reportDate` on the `fuel_reports` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[vesselCode,reportMonth,routeId]` on the table `fuel_reports` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fuelType` to the `fuel_reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reportMonth` to the `fuel_reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `routeId` to the `fuel_reports` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "fuel_reports_vesselCode_reportDate_key";

-- AlterTable
ALTER TABLE "fuel_reports" DROP COLUMN "reportDate",
ADD COLUMN     "engineEfficiency" DOUBLE PRECISION,
ADD COLUMN     "fuelType" TEXT NOT NULL,
ADD COLUMN     "reportMonth" TEXT NOT NULL,
ADD COLUMN     "routeId" TEXT NOT NULL,
ADD COLUMN     "weather" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "fuel_reports_vesselCode_reportMonth_routeId_key" ON "fuel_reports"("vesselCode", "reportMonth", "routeId");
