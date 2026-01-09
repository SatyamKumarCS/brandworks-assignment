import { Router } from 'express';
import {
  getAllDrivers,
  getPendingDrivers,
  createDriverRequest,
  approveDriver,
  rejectDriver,
  createDriver
} from '../controllers/driverController.js';

const router = Router();

router.get('/', getAllDrivers);
router.get('/pending', getPendingDrivers);
router.post('/request', createDriverRequest);
router.post('/approve/:id', approveDriver);
router.delete('/reject/:id', rejectDriver);
router.post('/', createDriver);

export default router;
