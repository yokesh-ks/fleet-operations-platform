import { Request, Response, NextFunction } from 'express';
import { fuelReportsService } from './fuel-reports.service';

export const fuelReportsController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const record = await fuelReportsService.create(req.body);
      res.status(201).json(record);
    } catch (error: any) {
      if (error.code === 'P2002') {
        return res.status(409).json({ message: 'Report already exists (vesselCode + reportMonth + routeId)' });
      }
      next(error);
    }
  },

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const skip = parseInt(req.query.skip as string, 10) || 0;
      const take = parseInt(req.query.take as string, 10) || 50;
      const records = await fuelReportsService.findAll({ skip, take });
      res.json(records);
    } catch (error) {
      next(error);
    }
  },

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const record = await fuelReportsService.findById(req.params.id!);
      if (!record) return res.status(404).json({ message: 'Not found' });
      res.json(record);
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const record = await fuelReportsService.update(req.params.id!, req.body);
      res.json(record);
    } catch (error: any) {
      if (error.code === 'P2025') return res.status(404).json({ message: 'Not found' });
      next(error);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await fuelReportsService.remove(req.params.id!);
      res.status(204).send();
    } catch (error: any) {
      if (error.code === 'P2025') return res.status(404).json({ message: 'Not found' });
      next(error);
    }
  },
};
