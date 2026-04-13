import { processFuelReportIngestion, type FuelReportProcessingResult } from './processors/fuel-report.processor';
import { ingestionJobRepository } from './repositories/ingestion-job.repository';

/**
 * Ingestion service orchestrates the fuel report ingestion pipeline
 * Provides a clean API for controllers to trigger ingestion
 */
export const ingestionService = {
  /**
   * Ingest a fuel report payload
   * Returns job ID and fuel report ID on success
   */
  async ingestFuelReport(payload: unknown): Promise<FuelReportProcessingResult> {
    return processFuelReportIngestion(payload);
  },

  /**
   * Get ingestion job details by ID
   */
  async getJobStatus(jobId: string) {
    return ingestionJobRepository.findById(jobId);
  },
};
