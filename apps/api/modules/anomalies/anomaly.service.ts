import { vesselRepository } from './repository/vessel.repository';
import { anomalyRepository } from './repository/anomaly.repository';
import { checkFuelVariance, type FuelVarianceCheckInput, type FuelVarianceResult } from './rules/fuel-variance.rule';

export interface FuelAnomalyCheckInput {
  vesselCode: string;
  fuelReportId: string;
  fuelConsumedTons: number;
  distanceNm: number;
}

export const anomalyService = {
  /**
   * Validate that a vessel exists in the system
   * Returns the vessel record if found, null otherwise
   */
  async validateVesselExists(vesselCode: string) {
    return vesselRepository.findByCode(vesselCode);
  },

  /**
   * Run fuel anomaly detection on a processed fuel report
   * Calculates expected fuel based on vessel benchmark and distance,
   * flags anomaly if variance exceeds threshold
   */
  async checkFuelAnomaly(input: FuelAnomalyCheckInput): Promise<FuelVarianceResult | null> {
    // Fetch vessel to get its fuel efficiency benchmark
    const vessel = await vesselRepository.findByCode(input.vesselCode);

    if (!vessel) {
      // This shouldn't happen if vessel validation runs first, but guard anyway
      return null;
    }

    const checkInput: FuelVarianceCheckInput = {
      vesselCode: input.vesselCode,
      fuelReportId: input.fuelReportId,
      fuelConsumedTons: input.fuelConsumedTons,
      distanceNm: input.distanceNm,
      fuelEfficiencyBenchmark: vessel.fuelEfficiencyBenchmark,
    };

    return checkFuelVariance(checkInput);
  },

  /**
   * Get open anomalies for a vessel
   */
  async getOpenAnomalies(vesselCode: string) {
    return anomalyRepository.findByVesselAndStatus(vesselCode, 'OPEN');
  },

  /**
   * Get all anomalies for a vessel
   */
  async getVesselAnomalies(vesselCode: string) {
    return anomalyRepository.findAllByVessel(vesselCode);
  },
};
