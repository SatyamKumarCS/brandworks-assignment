const { Router } = require('express');
const {
  getAllDrivers,
  getPendingDrivers,
  createDriverRequest,
  approveDriver,
  rejectDriver,
  createDriver
} = require('../controllers/driverController');

const router = Router();

router.get('/', getAllDrivers);
router.get('/pending', getPendingDrivers);
router.post('/request', createDriverRequest);
router.post('/approve/:id', approveDriver);
router.delete('/reject/:id', rejectDriver);
router.post('/', createDriver);

module.exports = router;
