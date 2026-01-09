const { Router } = require('express');
const { getManagerStats, getAdminStats } = require('../controllers/statsController');

const router = Router();

router.get('/manager', getManagerStats);
router.get('/admin', getAdminStats);

module.exports = router;
