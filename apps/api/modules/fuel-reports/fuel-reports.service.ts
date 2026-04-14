import prisma from '../../services/prisma';

// const prisma = new PrismaClient();

export const fuelReportsService = {
  async create(data: {
    vesselCode: string;
    reportMonth: string;
    routeId: string;
    distanceNm: number;
    fuelConsumedTons: number;
    fuelType: string;
    weather: string;
    engineEfficiency: number;
    ingestionJobId: string;
  }) {
    return prisma.fuelReport.create({
      data: {
        vesselCode: data.vesselCode,
        reportMonth: data.reportMonth,
        routeId: data.routeId,
        distanceNm: data.distanceNm,
        fuelConsumedTons: data.fuelConsumedTons,
        fuelType: data.fuelType,
        weather: data.weather,
        engineEfficiency: data.engineEfficiency,
        ingestionJobId: data.ingestionJobId,
      },
    });
  },

  async findAll(params: { skip?: number; take?: number }) {
    return prisma.fuelReport.findMany({
      skip: params.skip,
      take: params.take ?? 50,
      include: { vessel: true },
      orderBy: { createdAt: 'desc' },
    });
  },

  async findById(id: string) {
    return prisma.fuelReport.findUnique({
      where: { id },
      include: { vessel: true, anomalies: true },
    });
  },

  async update(id: string, data: Partial<{
    distanceNm: number;
    fuelConsumedTons: number;
    fuelType: string;
    weather: string;
    engineEfficiency: number;
  }>) {
    return prisma.fuelReport.update({
      where: { id },
      data,
    });
  },

  async remove(id: string) {
    return prisma.fuelReport.delete({
      where: { id },
    });
  },
};
