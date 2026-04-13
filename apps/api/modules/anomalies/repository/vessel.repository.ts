import prisma from '../../../services/prisma';

export const vesselRepository = {
  async findByCode(code: string) {
    return prisma.vessel.findUnique({
      where: { code },
    });
  },

  async findAll() {
    return prisma.vessel.findMany({
      orderBy: { code: 'asc' },
    });
  },

  async create(data: { code: string; name: string; fuelEfficiencyBenchmark: number }) {
    return prisma.vessel.create({ data });
  },
};
