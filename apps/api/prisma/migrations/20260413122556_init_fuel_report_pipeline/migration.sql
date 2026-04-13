-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "ingestion_jobs" (
    "id" TEXT NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'PENDING',
    "sourceType" TEXT NOT NULL DEFAULT 'api',
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ingestion_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "raw_payloads" (
    "id" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "ingestionJobId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "raw_payloads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fuel_reports" (
    "id" TEXT NOT NULL,
    "vesselCode" TEXT NOT NULL,
    "reportDate" TIMESTAMP(3) NOT NULL,
    "fuelConsumedTons" DOUBLE PRECISION NOT NULL,
    "distanceNm" DOUBLE PRECISION NOT NULL,
    "ingestionJobId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fuel_reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "raw_payloads_ingestionJobId_key" ON "raw_payloads"("ingestionJobId");

-- CreateIndex
CREATE UNIQUE INDEX "fuel_reports_ingestionJobId_key" ON "fuel_reports"("ingestionJobId");

-- CreateIndex
CREATE UNIQUE INDEX "fuel_reports_vesselCode_reportDate_key" ON "fuel_reports"("vesselCode", "reportDate");

-- AddForeignKey
ALTER TABLE "raw_payloads" ADD CONSTRAINT "raw_payloads_ingestionJobId_fkey" FOREIGN KEY ("ingestionJobId") REFERENCES "ingestion_jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fuel_reports" ADD CONSTRAINT "fuel_reports_ingestionJobId_fkey" FOREIGN KEY ("ingestionJobId") REFERENCES "ingestion_jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
