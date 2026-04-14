import prisma from '../../services/prisma';

export const voyageTelemetryService = {
  async create(data: {
    vesselTrackingId: string;
    timestamp: string;
    latitude: number;
    longitude: number;
    speedOverGround: number;
    courseOverGround?: number | null;
    heading?: number | null;
    vesselName?: string | null;
    imoNumber?: string | null;
    navigationStatus: string;
  }) {
    const timestamp = new Date(data.timestamp);
    return prisma.voyageTelemetry.create({
      data: {
        vesselTrackingId: data.vesselTrackingId,
        timestamp,
        latitude: data.latitude,
        longitude: data.longitude,
        speedOverGround: data.speedOverGround,
        courseOverGround: data.courseOverGround ?? null,
        heading: data.heading ?? null,
        vesselName: data.vesselName ?? null,
        imoNumber: data.imoNumber ?? null,
        navigationStatus: data.navigationStatus,
      },
    });
  },

  async findAll(params: { skip?: number; take?: number }) {
    return prisma.voyageTelemetry.findMany({
      skip: params.skip,
      take: params.take ?? 50,
      orderBy: { timestamp: 'desc' },
    });
  },

  async findById(id: string) {
    return prisma.voyageTelemetry.findUnique({
      where: { id },
    });
  },

  async update(id: string, data: Partial<{
    latitude: number;
    longitude: number;
    speedOverGround: number;
    courseOverGround: number | null;
    heading: number | null;
    vesselName: string | null;
    imoNumber: string | null;
    navigationStatus: string;
  }>) {
    return prisma.voyageTelemetry.update({
      where: { id },
      data,
    });
  },

  async remove(id: string) {
    return prisma.voyageTelemetry.delete({
      where: { id },
    });
  },
};
