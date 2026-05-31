import { Router } from 'express';
import {
  predict,
  getSessions,
  getSessionById,
  getSessionByCode,
  deleteSession,
  deleteAllSessions,
  mlHealth,
  requestAiInsight,
} from '../controllers/screening-controller.js';
import { authenticate } from '../../../middlewares/auth.js';

const router = Router();

// GET /api/screening/health
router.get('/health', mlHealth);

// POST /api/screening/predict
router.post('/predict', authenticate, predict);

// GET /api/screening/sessions
router.get('/sessions', authenticate, getSessions);

// DELETE /api/screening/sessions
router.delete('/sessions', authenticate, deleteAllSessions);

// GET /api/screening/sessions/code/:session_code
router.get('/sessions/code/:session_code', authenticate, getSessionByCode);

// POST /api/screening/sessions/:id/ai-insight
router.post('/sessions/:id/ai-insight', authenticate, requestAiInsight);

// GET /api/screening/sessions/:id
router.get('/sessions/:id', authenticate, getSessionById);

// DELETE /api/screening/sessions/:id
router.delete('/sessions/:id', authenticate, deleteSession);

export default router;
