import { Router } from 'express';
import { getManagerStats, getAdminStats } from '../controllers/statsController.js';

const router = Router();

router.get('/manager', getManagerStats);
router.get('/admin', getAdminStats);

export default router;
