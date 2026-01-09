import { Router } from 'express';
import {
  getAllSessions,
  getActiveSessions,
  getParkingHistory,
  getActiveTicket,
  createSession,
  updateSessionStatus,
  completeSession
} from '../controllers/sessionController.js';

const router = Router();

router.get('/', getAllSessions);
router.get('/active', getActiveSessions);
router.get('/history', getParkingHistory);
router.get('/active-ticket', getActiveTicket);
router.post('/', createSession);
router.patch('/:id/status', updateSessionStatus);
router.patch('/:id/complete', completeSession);

export default router;
