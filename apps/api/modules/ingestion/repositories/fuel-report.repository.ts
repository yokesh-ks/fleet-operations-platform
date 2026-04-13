import prisma from '../../../services/prisma';

export interface UpsertFuelReportInput {
  vesselCode: string;
  reportDate: Date;
  fuelConsumedTons: number;
  distanceNm: number;
  ingestionJobId: string;
}

export const fuelReportRepository = {
  async upsert(input: UpsertFuelReportInput) {
    return prisma.fuelReport.upsert({
      where: {
        vesselCode_reportDate: {
          vesselCode: input.vesselCode,
          reportDate: input.reportDate,
        },
      },
      create: {
        vesselCode: input.vesselCode,
        reportDate: input.reportDate,
        fuelConsumedTons: input.fuelConsumedTons,
        distanceNm: input.distanceNm,
        ingestionJobId: input.ingestionJobId,
      },
      update: {
        fuelConsumedTons: input.fuelConsumedTons,
        distanceNm: input.distanceNm,
        ingestionJobId: input.ingestionJobId,
      },
    });
  },
};
