import { Router } from 'express';
import { fuelReportsController } from './fuel-reports.controller';

const router = Router();

router.post('/', fuelReportsController.create);
router.get('/', fuelReportsController.findAll);
router.get('/:id', fuelReportsController.findById);
router.patch('/:id', fuelReportsController.update);
router.delete('/:id', fuelReportsController.remove);

export default router;
