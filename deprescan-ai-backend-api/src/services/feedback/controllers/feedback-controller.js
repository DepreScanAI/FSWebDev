import FeedbackRepositories from '../repositories/feedback-repositories.js';
// eslint-disable-next-line no-unused-vars
import { success, created, error } from '../../../utils/response.js';
import NotFoundError from '../../../exceptions/not-found-error.js';
import InvariantError from '../../../exceptions/invariant-error.js';

// POST /api/feedback
export const createFeedback = async (req, res, next) => {
  try {
    const { session_id, is_helpful, name_label } = req.validated;
    const userId = req.user.id;

    if (session_id) {
      const sessionValid = await FeedbackRepositories.verifySessionOwner({
        sessionId: session_id,
        userId,
      });
      if (!sessionValid) {
        return next(new NotFoundError('Sesi tidak ditemukan atau bukan milik Anda.'));
      }

      const alreadySent = await FeedbackRepositories.feedbackExists({
        userId,
        sessionId: session_id,
      });
      if (alreadySent) {
        return next(new InvariantError(
          'Anda sudah mengirim feedback untuk sesi ini. Hanya 1 feedback yang diperbolehkan per sesi.',
        ));
      }
    }

    const feedback = await FeedbackRepositories.createFeedback({
      sessionId: session_id,
      userId,
      isHelpful: is_helpful,
      nameLabel: name_label,
    });

    return created(res, { feedback }, 'Terima kasih atas feedback Anda!');
  } catch (err) {
    if (err.code === '23505' && err.constraint === 'idx_feedbacks_user_session_unique') {
      return next(new InvariantError('Anda sudah mengirim feedback untuk sesi ini.'));
    }
    next(err);
  }
};

// GET /api/feedback
export const getFeedbacks = async (req, res, next) => {
  try {
    const data = await FeedbackRepositories.getFeedbacks();
    return success(res, data, 'Data feedback');
  } catch (err) {
    next(err);
  }
};
