import { Router } from 'express';
import { createFeedback, getFeedbacks } from '../controllers/feedback-controller.js';
import { authenticate } from '../../../middlewares/auth.js';
import validate from '../../../middlewares/validate.js';
import { createFeedbackPayloadSchema } from '../validator/schema.js';

const router = Router();

// POST /api/feedback
router.post('/', authenticate, validate(createFeedbackPayloadSchema), createFeedback);

// GET /api/feedback
router.get('/', authenticate, getFeedbacks);

export default router;
