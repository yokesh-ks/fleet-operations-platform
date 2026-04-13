import { Request, Response, NextFunction } from 'express';
import { ingestionService } from './ingestion.service';

/**
 * Controller for fuel report ingestion
 * Handles HTTP layer only - business logic is delegated to the service
 */
export async function ingestFuelReport(req: Request, res: Response, next: NextFunction) {
  const payload = req.body;

  try {
    const result = await ingestionService.ingestFuelReport(payload);

    return res.status(200).json({
      jobId: result.jobId,
      status: 'COMPLETED',
      fuelReportId: result.fuelReportId,
      ...(result.anomaly && {
        anomaly: {
          detected: result.anomaly.detected,
          severity: result.anomaly.severity,
          variancePercent: result.anomaly.variancePercent,
        },
      }),
    });
  } catch (error) {
    // Pass errors to Express error handler
    return next(error);
  }
}
