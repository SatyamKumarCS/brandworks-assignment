const { Router } = require('express');
const {
  getAllSessions,
  getActiveSessions,
  getParkingHistory,
  getActiveTicket,
  createSession,
  updateSessionStatus,
  completeSession
} = require('../controllers/sessionController');

const router = Router();

router.get('/', getAllSessions);
router.get('/active', getActiveSessions);
router.get('/history', getParkingHistory);
router.get('/active-ticket', getActiveTicket);
router.post('/', createSession);
router.patch('/:id/status', updateSessionStatus);
router.patch('/:id/complete', completeSession);

module.exports = router;
