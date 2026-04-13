import { anomalyRepository } from '../repository/anomaly.repository';

export interface FuelVarianceCheckInput {
  vesselCode: string;
  fuelReportId: string;
  fuelConsumedTons: number;
  distanceNm: number;
  fuelEfficiencyBenchmark: number;
}

export interface FuelVarianceResult {
  hasAnomaly: boolean;
  expectedFuel: number;
  variancePercent: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | null;
}

// Thresholds for severity classification
const VARIANCE_THRESHOLDS = {
  LOW: 15,       // 15% - flag as low severity
  MEDIUM: 25,    // 25% - medium
  HIGH: 40,      // 40% - high
  CRITICAL: 60,  // 60%+ - critical
};

/**
 * Calculates expected fuel and variance, creates anomaly if threshold breached
 */
export async function checkFuelVariance(input: FuelVarianceCheckInput): Promise<FuelVarianceResult> {
  const expectedFuel = input.distanceNm * input.fuelEfficiencyBenchmark;
  const variance = input.fuelConsumedTons - expectedFuel;
  const variancePercent = (variance / expectedFuel) * 100;
  const absVariancePercent = Math.abs(variancePercent);

  // Determine severity based on thresholds
  let severity: FuelVarianceResult['severity'] = null;

  if (absVariancePercent >= VARIANCE_THRESHOLDS.CRITICAL) {
    severity = 'CRITICAL';
  } else if (absVariancePercent >= VARIANCE_THRESHOLDS.HIGH) {
    severity = 'HIGH';
  } else if (absVariancePercent >= VARIANCE_THRESHOLDS.MEDIUM) {
    severity = 'MEDIUM';
  } else if (absVariancePercent >= VARIANCE_THRESHOLDS.LOW) {
    severity = 'LOW';
  }

  // Only create anomaly if variance exceeds the lowest threshold
  if (severity) {
    const direction = variance > 0 ? 'over-consumption' : 'under-consumption';
    const description = `Fuel ${direction} detected: ${variancePercent.toFixed(1)}% variance from benchmark ` +
      `(expected: ${expectedFuel.toFixed(1)} tons, actual: ${input.fuelConsumedTons.toFixed(1)} tons)`;

    await anomalyRepository.create({
      type: 'FUEL_VARIANCE',
      severity,
      vesselCode: input.vesselCode,
      fuelReportId: input.fuelReportId,
      expectedValue: expectedFuel,
      actualValue: input.fuelConsumedTons,
      variancePercent,
      description,
    });
  }

  return {
    hasAnomaly: severity !== null,
    expectedFuel,
    variancePercent,
    severity,
  };
}
