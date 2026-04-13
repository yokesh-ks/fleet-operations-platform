import { z } from 'zod';

/**
 * Zod schema for fuel report ingestion input validation
 */
export const fuelReportIngestionSchema = z.object({
  vesselCode: z.string().min(1, 'vesselCode is required'),
  reportDate: z.string().date('reportDate must be a valid date (YYYY-MM-DD)'),
  fuelConsumed: z.number().positive('fuelConsumed must be greater than 0'),
  distanceNm: z.number().positive('distanceNm must be greater than 0'),
});

/**
 * Inferred TypeScript type from the schema
 */
export type FuelReportIngestionInput = z.infer<typeof fuelReportIngestionSchema>;
