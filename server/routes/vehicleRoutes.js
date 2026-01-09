import { Router } from 'express';
import {
  getAllVehicles,
  getUserVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle
} from '../controllers/vehicleController.js';

const router = Router();

router.get('/', getAllVehicles);
router.get('/user/:userId', getUserVehicles);
router.post('/', createVehicle);
router.put('/:id', updateVehicle);
router.delete('/:id', deleteVehicle);

export default router;
