import prisma from '../../services/prisma';

export const portBenchmarksService = {
  async create(data: {
    economyLabel: string;
    marketType: string;
    medianPortStayDays: number | null;
    avgVesselAgeYears: number;
    avgVesselSizeGt: number;
    period: string;
  }) {
    return prisma.portBenchmark.create({
      data: {
        economyLabel: data.economyLabel,
        marketType: data.marketType,
        medianPortStayDays: data.medianPortStayDays ?? 0,
        avgVesselAgeYears: data.avgVesselAgeYears,
        avgVesselSizeGt: data.avgVesselSizeGt,
        period: data.period,
      },
    });
  },

  async findAll(params: { skip?: number; take?: number }) {
    return prisma.portBenchmark.findMany({
      skip: params.skip,
      take: params.take ?? 50,
      orderBy: { period: 'desc' },
    });
  },

  async findById(id: string) {
    return prisma.portBenchmark.findUnique({
      where: { id },
    });
  },

  async update(id: string, data: Partial<{
    economyLabel: string;
    marketType: string;
    medianPortStayDays: number | null;
    avgVesselAgeYears: number;
    avgVesselSizeGt: number;
    period: string;
  }>) {
    return prisma.portBenchmark.update({
      where: { id },
      data: {
        ...data,
        medianPortStayDays: data.medianPortStayDays ?? undefined
      },
    });
  },

  async remove(id: string) {
    return prisma.portBenchmark.delete({
      where: { id },
    });
  },
};
