-- DropForeignKey
ALTER TABLE "fuel_reports" DROP CONSTRAINT "fuel_reports_ingestionJobId_fkey";

-- DropForeignKey
ALTER TABLE "voyage_telemetry" DROP CONSTRAINT "voyage_telemetry_ingestionJobId_fkey";

-- AlterTable
ALTER TABLE "fuel_reports" ALTER COLUMN "ingestionJobId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "voyage_telemetry" ALTER COLUMN "ingestionJobId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "fuel_reports" ADD CONSTRAINT "fuel_reports_ingestionJobId_fkey" FOREIGN KEY ("ingestionJobId") REFERENCES "ingestion_jobs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voyage_telemetry" ADD CONSTRAINT "voyage_telemetry_ingestionJobId_fkey" FOREIGN KEY ("ingestionJobId") REFERENCES "ingestion_jobs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
