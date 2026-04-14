-- CreateTable
CREATE TABLE "voyage_telemetry" (
    "id" TEXT NOT NULL,
    "vesselTrackingId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "speedOverGround" DOUBLE PRECISION NOT NULL,
    "courseOverGround" DOUBLE PRECISION,
    "heading" DOUBLE PRECISION,
    "vesselName" TEXT,
    "imoNumber" TEXT,
    "navigationStatus" TEXT NOT NULL,
    "ingestionJobId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "voyage_telemetry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "port_benchmarks" (
    "id" TEXT NOT NULL,
    "economyLabel" TEXT NOT NULL,
    "marketType" TEXT NOT NULL,
    "medianPortStayDays" DOUBLE PRECISION NOT NULL,
    "avgVesselAgeYears" DOUBLE PRECISION NOT NULL,
    "avgVesselSizeGt" DOUBLE PRECISION NOT NULL,
    "period" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "port_benchmarks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "voyage_telemetry_ingestionJobId_key" ON "voyage_telemetry"("ingestionJobId");

-- CreateIndex
CREATE UNIQUE INDEX "voyage_telemetry_vesselTrackingId_timestamp_key" ON "voyage_telemetry"("vesselTrackingId", "timestamp");

-- AddForeignKey
ALTER TABLE "voyage_telemetry" ADD CONSTRAINT "voyage_telemetry_ingestionJobId_fkey" FOREIGN KEY ("ingestionJobId") REFERENCES "ingestion_jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
