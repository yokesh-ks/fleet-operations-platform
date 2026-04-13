import prisma from '../../../services/prisma';
import type { AnomalyType, AnomalySeverity, AnomalyStatus } from '@prisma/client';

export interface CreateAnomalyInput {
  type: AnomalyType;
  severity: AnomalySeverity;
  vesselCode: string;
  fuelReportId: string;
  expectedValue: number;
  actualValue: number;
  variancePercent: number;
  description: string;
  status?: AnomalyStatus;
}

export const anomalyRepository = {
  async create(input: CreateAnomalyInput) {
    return prisma.anomaly.create({
      data: {
        type: input.type,
        severity: input.severity,
        vesselCode: input.vesselCode,
        fuelReportId: input.fuelReportId,
        expectedValue: input.expectedValue,
        actualValue: input.actualValue,
        variancePercent: input.variancePercent,
        description: input.description,
        status: input.status || 'OPEN',
      },
    });
  },

  async findByVesselAndStatus(vesselCode: string, status: AnomalyStatus) {
    return prisma.anomaly.findMany({
      where: { vesselCode, status },
      orderBy: { createdAt: 'desc' },
    });
  },

  async findAllByVessel(vesselCode: string) {
    return prisma.anomaly.findMany({
      where: { vesselCode },
      orderBy: { createdAt: 'desc' },
      include: { fuelReport: true },
    });
  },
};
