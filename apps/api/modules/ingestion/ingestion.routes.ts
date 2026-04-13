import express, { Request, Response, NextFunction } from 'express';
import { ingestFuelReport } from './ingestion.controller';

const router = express.Router();

/* GET ingestion health check */
router.get('/', function(req: Request, res: Response, next: NextFunction) {
  res.json({ status: 'ok', service: 'ingestion-pipeline' });
});

/* POST fuel report ingestion */
router.post('/fuel-report', ingestFuelReport);

export default router;
