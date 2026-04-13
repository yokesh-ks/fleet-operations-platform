import type { FuelReportIngestionInput } from '../dto/fuel-report.dto';

export interface TransformedFuelReport {
  vesselCode: string;
  reportDate: Date;
  fuelConsumedTons: number;
  distanceNm: number;
}

/**
 * Transforms validated ingestion input into the format required for persistence
 * - Parses reportDate string into Date object
 * - Normalizes field names (fuelConsumed -> fuelConsumedTons)
 */
export function transformFuelReportPayload(input: FuelReportIngestionInput): TransformedFuelReport {
  const reportDateObj = new Date(input.reportDate);
  reportDateObj.setHours(0, 0, 0, 0);

  return {
    vesselCode: input.vesselCode,
    reportDate: reportDateObj,
    fuelConsumedTons: input.fuelConsumed,
    distanceNm: input.distanceNm,
  };
}
