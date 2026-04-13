import { fuelReportIngestionSchema, type FuelReportIngestionInput } from '../dto/fuel-report.dto';

export interface ValidationResult {
  success: boolean;
  data?: FuelReportIngestionInput;
  error?: { issues: { message: string }[] };
}

/**
 * Validates fuel report payload against the ingestion schema
 */
export function validateFuelReportPayload(payload: unknown): ValidationResult {
  const result = fuelReportIngestionSchema.safeParse(payload);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  return {
    success: false,
    error: { issues: result.error.issues.map(issue => ({ message: issue.message })) },
  };
}
