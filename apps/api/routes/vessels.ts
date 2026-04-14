import express, { Request, Response, NextFunction } from 'express';
import prisma from '../services/prisma';

const router = express.Router();

/**
 * GET /api/vessels
 * Get all vessels
 */
router.get('/', async function(req: Request, res: Response, next: NextFunction) {
  try {
    const vessels = await prisma.vessel.findMany();
    res.json(vessels);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/vessels
 * Create a new vessel
 */
router.post('/', async function(req: Request, res: Response, next: NextFunction) {
  try {
    const { code, name, fuelEfficiencyBenchmark } = req.body;

    // Validate required fields
    if (!code) {
      return res.status(400).json({ message: 'Vessel code is required' });
    }

    // Check for existing vessel with same code
    const existing = await prisma.vessel.findUnique({
      where: { code }
    });

    if (existing) {
      return res.status(409).json({ message: `Vessel with code ${code} already exists`, code: existing.code });
    }

    const vessel = await prisma.vessel.create({
      data: {
        code,
        name: name || code,
        fuelEfficiencyBenchmark: fuelEfficiencyBenchmark || 24.5
      }
    });

    res.status(201).json(vessel);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/vessels/:code
 * Get vessel by code
 */
router.get('/:code', async function(req: Request, res: Response, next: NextFunction) {
  try {
    const code = req.params.code;
    if (!code) {
      return res.status(400).json({ message: 'Vessel code is required' });
    }

    const vessel = await prisma.vessel.findUnique({
      where: { code }
    });

    if (!vessel) {
      return res.status(404).json({ message: 'Vessel not found' });
    }

    res.json(vessel);
  } catch (error) {
    next(error);
  }
});

export default router;
