import { Router } from 'express';
import { voyageTelemetryController } from './voyage-telemetry.controller';

const router = Router();

router.post('/', voyageTelemetryController.create);
router.get('/', voyageTelemetryController.findAll);
router.get('/:id', voyageTelemetryController.findById);
router.patch('/:id', voyageTelemetryController.update);
router.delete('/:id', voyageTelemetryController.remove);

export default router;
