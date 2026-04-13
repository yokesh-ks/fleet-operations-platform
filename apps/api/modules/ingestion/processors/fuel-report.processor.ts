import createHttpError from 'http-errors';
import { ingestionJobRepository } from '../repositories/ingestion-job.repository';
import { rawPayloadRepository } from '../repositories/raw-payload.repository';
import { fuelReportRepository } from '../repositories/fuel-report.repository';
import { validateFuelReportPayload } from '../validators/fuel-report.validator';
import { transformFuelReportPayload } from '../transformers/fuel-report.transformer';
import { anomalyService } from '../../anomalies/anomaly.service';
import type { IngestionJob } from '@prisma/client';

export interface FuelReportProcessingResult {
  jobId: string;
  fuelReportId: string;
  anomaly?: {
    detected: boolean;
    severity: string | null;
    variancePercent: number;
  };
}

/**
 * Processes fuel report ingestion payload
 * Handles the full pipeline: job creation → raw storage → validation → transformation → upsert
 */
export async function processFuelReportIngestion(
  payload: unknown,
): Promise<FuelReportProcessingResult> {
  let job: IngestionJob | undefined;

  try {
    // Step 1: Create ingestion job
    job = await ingestionJobRepository.create({ sourceType: 'api' });

    // Step 2: Store raw payload for audit
    await rawPayloadRepository.create(job.id, payload);

    // Step 3: Validate payload
    const validation = validateFuelReportPayload(payload);

    if (!validation.success) {
      const errorMessages = validation.error!.issues.map((issue) => issue.message).join(', ');

      await ingestionJobRepository.update(job.id, {
        status: 'FAILED',
        errorMessage: `Validation failed: ${errorMessages}`,
      });

      throw createHttpError(400, errorMessages);
    }

    // Step 4: Transform payload (validation.data is guaranteed to exist when success is true)
    const transformedData = transformFuelReportPayload(validation.data!);

    // Step 5: Domain validation - vessel must exist in system
    const vessel = await anomalyService.validateVesselExists(transformedData.vesselCode);

    if (!vessel) {
      await ingestionJobRepository.update(job.id, {
        status: 'FAILED',
        errorMessage: `Vessel '${transformedData.vesselCode}' not found in vessel_master`,
      });

      throw createHttpError(400, `Vessel '${transformedData.vesselCode}' not found in vessel_master`);
    }

    // Step 6: Domain validation - reportDate must not be in the future
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (transformedData.reportDate > now) {
      await ingestionJobRepository.update(job.id, {
        status: 'FAILED',
        errorMessage: 'reportDate must not be in the future',
      });

      throw createHttpError(400, 'reportDate must not be in the future');
    }

    // Step 7: Update job to PROCESSING
    await ingestionJobRepository.update(job.id, { status: 'PROCESSING' });

    // Step 8: Normalize and upsert fuel report (deduplication by vesselCode + reportDate)
    const fuelReport = await fuelReportRepository.upsert({
      ...transformedData,
      ingestionJobId: job.id,
    });

    // Step 9: Run fuel anomaly detection
    const anomalyResult = await anomalyService.checkFuelAnomaly({
      vesselCode: fuelReport.vesselCode,
      fuelReportId: fuelReport.id,
      fuelConsumedTons: fuelReport.fuelConsumedTons,
      distanceNm: fuelReport.distanceNm,
    });

    // Step 10: Mark job as COMPLETED
    await ingestionJobRepository.update(job.id, { status: 'COMPLETED' });

    return {
      jobId: job.id,
      fuelReportId: fuelReport.id,
      anomaly: anomalyResult ? {
        detected: anomalyResult.hasAnomaly,
        severity: anomalyResult.severity,
        variancePercent: anomalyResult.variancePercent,
      } : undefined,
    };
  } catch (error) {
    // If job was created but failed, ensure it's marked as FAILED
    if (job) {
      const isHttpError = error instanceof Error && 'status' in error && typeof (error as any).status === 'number';
      
      // Don't double-mark validation errors that already set FAILED status
      if (!isHttpError || (error as any).status !== 400) {
        try {
          await ingestionJobRepository.update(job.id, {
            status: 'FAILED',
            errorMessage: error instanceof Error ? error.message : 'Unknown error occurred',
          });
        } catch (updateError) {
          // Silently ignore update errors during error handling
        }
      }
    }

    throw error;
  }
}
