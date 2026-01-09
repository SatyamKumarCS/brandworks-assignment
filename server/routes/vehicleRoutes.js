const { Router } = require('express');
const {
  getAllVehicles,
  getUserVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle
} = require('../controllers/vehicleController');

const router = Router();

router.get('/', getAllVehicles);
router.get('/user/:userId', getUserVehicles);
router.post('/', createVehicle);
router.put('/:id', updateVehicle);
router.delete('/:id', deleteVehicle);

module.exports = router;
