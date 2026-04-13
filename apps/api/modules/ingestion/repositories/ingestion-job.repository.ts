import prisma from '../../../services/prisma';
import type { IngestionJob } from '@prisma/client';

export interface CreateIngestionJobInput {
  sourceType?: string;
}

export interface UpdateIngestionJobInput {
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  errorMessage?: string;
}

export const ingestionJobRepository = {
  async create(input: CreateIngestionJobInput = {}) {
    return prisma.ingestionJob.create({
      data: {
        status: 'PENDING',
        sourceType: input.sourceType || 'api',
      },
    });
  },

  async update(id: string, input: UpdateIngestionJobInput) {
    return prisma.ingestionJob.update({
      where: { id },
      data: {
        status: input.status,
        errorMessage: input.errorMessage,
      },
    });
  },

  async findById(id: string) {
    return prisma.ingestionJob.findUnique({
      where: { id },
      include: {
        rawPayload: true,
        fuelReport: true,
      },
    });
  },
};
