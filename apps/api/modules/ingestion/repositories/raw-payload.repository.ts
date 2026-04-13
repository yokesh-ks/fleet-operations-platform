import prisma from '../../../services/prisma';

export const rawPayloadRepository = {
  async create(ingestionJobId: string, payload: unknown) {
    return prisma.rawPayload.create({
      data: {
        ingestionJobId,
        payload: payload as any,
      },
    });
  },
};
