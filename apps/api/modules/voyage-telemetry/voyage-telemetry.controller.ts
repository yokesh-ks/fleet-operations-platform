import { Request, Response, NextFunction } from 'express';
import { voyageTelemetryService } from './voyage-telemetry.service';

export const voyageTelemetryController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const record = await voyageTelemetryService.create(req.body);
      res.status(201).json(record);
    } catch (error: any) {
      if (error.code === 'P2002') {
        return res.status(409).json({ message: 'Record already exists (vesselTrackingId + timestamp)' });
      }
      next(error);
    }
  },

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const skip = parseInt(req.query.skip as string, 10) || 0;
      const take = parseInt(req.query.take as string, 10) || 50;
      const records = await voyageTelemetryService.findAll({ skip, take });
      res.json(records);
    } catch (error) {
      next(error);
    }
  },

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const record = await voyageTelemetryService.findById(req.params.id!);
      if (!record) return res.status(404).json({ message: 'Not found' });
      res.json(record);
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const record = await voyageTelemetryService.update(req.params.id!, req.body);
      res.json(record);
    } catch (error: any) {
      if (error.code === 'P2025') return res.status(404).json({ message: 'Not found' });
      next(error);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await voyageTelemetryService.remove(req.params.id!);
      res.status(204).send();
    } catch (error: any) {
      if (error.code === 'P2025') return res.status(404).json({ message: 'Not found' });
      next(error);
    }
  },
};
