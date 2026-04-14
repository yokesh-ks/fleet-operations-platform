import { Router } from 'express';
import { portBenchmarksController } from './port-benchmarks.controller';

const router = Router();

router.post('/', portBenchmarksController.create);
router.get('/', portBenchmarksController.findAll);
router.get('/:id', portBenchmarksController.findById);
router.patch('/:id', portBenchmarksController.update);
router.delete('/:id', portBenchmarksController.remove);

export default router;
