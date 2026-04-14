import type { FuelReportIngestionInput } from '../dto/fuel-report.dto';

export interface TransformedFuelReport {
  vesselCode: string;
  reportMonth: string;
  routeId: string;
  distanceNm: number;
  fuelConsumedTons: number;
  fuelType: string;
  weather: string;
  engineEfficiency: number;
}

/**
 * Transforms validated ingestion input into the format required for persistence
 */
export function transformFuelReportPayload(input: FuelReportIngestionInput): TransformedFuelReport {
  return {
    vesselCode: input.vesselCode,
    reportMonth: input.reportMonth,
    routeId: input.routeId,
    distanceNm: input.distanceNm,
    fuelConsumedTons: input.fuelConsumedTons,
    fuelType: input.fuelType,
    weather: input.weather,
    engineEfficiency: input.engineEfficiency,
  };
}
