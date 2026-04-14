import prisma from '../../../services/prisma';

export interface UpsertFuelReportInput {
  vesselCode: string;
  reportMonth: string;
  routeId: string;
  distanceNm: number;
  fuelConsumedTons: number;
  fuelType: string;
  weather: string;
  engineEfficiency: number;
  ingestionJobId: string;
}

export const fuelReportRepository = {
  async upsert(input: UpsertFuelReportInput) {
    return prisma.fuelReport.upsert({
      where: {
        vesselCode_reportMonth_routeId: {
          vesselCode: input.vesselCode,
          reportMonth: input.reportMonth,
          routeId: input.routeId,
        },
      },
      create: {
        vesselCode: input.vesselCode,
        reportMonth: input.reportMonth,
        routeId: input.routeId,
        distanceNm: input.distanceNm,
        fuelConsumedTons: input.fuelConsumedTons,
        fuelType: input.fuelType,
        weather: input.weather,
        engineEfficiency: input.engineEfficiency,
        ingestionJobId: input.ingestionJobId,
      },
      update: {
        distanceNm: input.distanceNm,
        fuelConsumedTons: input.fuelConsumedTons,
        fuelType: input.fuelType,
        weather: input.weather,
        engineEfficiency: input.engineEfficiency,
        ingestionJobId: input.ingestionJobId,
      },
    });
  },
};
