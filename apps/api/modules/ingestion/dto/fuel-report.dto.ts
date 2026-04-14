import { z } from 'zod';

/**
 * Zod schema for fuel report ingestion input validation
 */
export const fuelReportIngestionSchema = z.object({
  vesselCode: z.string().min(1, 'vesselCode is required'),
  reportMonth: z.string().min(1, 'reportMonth is required'),
  routeId: z.string().min(1, 'routeId is required'),
  distanceNm: z.number().positive('distanceNm must be greater than 0'),
  fuelConsumedTons: z.number().positive('fuelConsumedTons must be greater than 0'),
  fuelType: z.string().min(1, 'fuelType is required'),
  weather: z.enum(['Calm', 'Moderate', 'Stormy']),
  engineEfficiency: z.number().min(0).max(100, 'engineEfficiency must be between 0 and 100'),
});

/**
 * Inferred TypeScript type from the schema
 */
export type FuelReportIngestionInput = z.infer<typeof fuelReportIngestionSchema>;
