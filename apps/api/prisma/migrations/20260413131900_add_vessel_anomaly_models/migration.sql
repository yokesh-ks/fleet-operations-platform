-- CreateEnum
CREATE TYPE "AnomalyType" AS ENUM ('FUEL_VARIANCE');

-- CreateEnum
CREATE TYPE "AnomalySeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "AnomalyStatus" AS ENUM ('OPEN', 'INVESTIGATING', 'RESOLVED', 'FALSE_POSITIVE');

-- CreateTable
CREATE TABLE "vessels" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "fuelEfficiencyBenchmark" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vessels_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "anomalies" (
    "id" TEXT NOT NULL,
    "type" "AnomalyType" NOT NULL,
    "severity" "AnomalySeverity" NOT NULL,
    "vesselCode" TEXT NOT NULL,
    "fuelReportId" TEXT NOT NULL,
    "expectedValue" DOUBLE PRECISION NOT NULL,
    "actualValue" DOUBLE PRECISION NOT NULL,
    "variancePercent" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "status" "AnomalyStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "anomalies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "anomalies_vesselCode_status_idx" ON "anomalies"("vesselCode", "status");

-- AddForeignKey
ALTER TABLE "fuel_reports" ADD CONSTRAINT "fuel_reports_vesselCode_fkey" FOREIGN KEY ("vesselCode") REFERENCES "vessels"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anomalies" ADD CONSTRAINT "anomalies_vesselCode_fkey" FOREIGN KEY ("vesselCode") REFERENCES "vessels"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anomalies" ADD CONSTRAINT "anomalies_fuelReportId_fkey" FOREIGN KEY ("fuelReportId") REFERENCES "fuel_reports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
