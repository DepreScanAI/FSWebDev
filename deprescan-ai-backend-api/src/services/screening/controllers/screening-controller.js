import mlService from '../../mlService.js';
import ScreeningRepositories from '../repositories/screening-repositories.js';
import { success, error } from '../../../utils/response.js';
import NotFoundError from '../../../exceptions/not-found-error.js';

// POST /api/screening/predict
export const predict = async (req, res, next) => {
  try {
    const { include_ai_insight = false, name_label, ...inputData } = req.body;

    let prediction;
    try {
      prediction = await mlService.predict(inputData, include_ai_insight);
    } catch (mlErr) {
      const detail = mlErr.response?.data?.detail || mlErr.message;
      return error(res, `AI backend tidak tersedia: ${detail}`, 503);
    }

    const session = await ScreeningRepositories.createSession({
      userId: req.user.id,
      nameLabel: name_label || req.user.name || 'Anonim',
      prediction,
      inputData,
    });

    return success(
      res,
      { prediction, session },
      'Prediksi berhasil dan tersimpan di riwayat',
    );
  } catch (err) {
    next(err);
  }
};

// GET /api/screening/sessions
export const getSessions = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const { sessions, total } = await ScreeningRepositories.getSessions({
      userId: req.user.id,
      page,
      limit,
    });

    return success(
      res,
      {
        sessions,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          total_pages: Math.ceil(total / parseInt(limit)),
        },
      },
      'Riwayat screening',
    );
  } catch (err) {
    next(err);
  }
};

// GET /api/screening/sessions/:id
export const getSessionById = async (req, res, next) => {
  try {
    const session = await ScreeningRepositories.getSessionById({
      id: req.params.id,
      userId: req.user.id,
    });

    if (!session) return next(new NotFoundError('Sesi tidak ditemukan.'));

    if (typeof session.input_data === 'string') {
      try {
        session.input_data = JSON.parse(session.input_data);
      } catch {
        console.warn('Gagal memproses JSON input_data');
      }
    }

    return success(res, { session }, 'Detail sesi screening');
  } catch (err) {
    next(err);
  }
};

// GET /api/screening/sessions/code/:session_code
export const getSessionByCode = async (req, res, next) => {
  try {
    const session = await ScreeningRepositories.getSessionByCode({
      sessionCode: req.params.session_code,
      userId: req.user.id,
    });

    if (!session) return next(new NotFoundError('Sesi tidak ditemukan.'));

    if (typeof session.input_data === 'string') {
      try {
        session.input_data = JSON.parse(session.input_data);
      } catch {
        console.warn('Gagal memproses JSON input_data');
      }
    }

    return success(res, { session }, 'Detail sesi screening');
  } catch (err) {
    next(err);
  }
};

// DELETE /api/screening/sessions/:id
export const deleteSession = async (req, res, next) => {
  try {
    const deleted = await ScreeningRepositories.deleteSession({
      id: req.params.id,
      userId: req.user.id,
    });

    if (!deleted) return next(new NotFoundError('Sesi tidak ditemukan.'));

    return success(res, null, 'Sesi berhasil dihapus.');
  } catch (err) {
    next(err);
  }
};

// DELETE /api/screening/sessions
export const deleteAllSessions = async (req, res, next) => {
  try {
    const deleted = await ScreeningRepositories.deleteAllSessions(req.user.id);
    return success(
      res,
      { deleted },
      'Semua riwayat screening berhasil dihapus.',
    );
  } catch (err) {
    next(err);
  }
};

// POST /api/screening/sessions/:id/ai-insight - on request insight untuk sesi yang sudah ada
export const requestAiInsight = async (req, res, next) => {
  try {
    const session = await ScreeningRepositories.getSessionById({
      id: req.params.id,
      userId: req.user.id,
    });

    if (!session) return next(new NotFoundError('Sesi tidak ditemukan.'));

    if (session.ai_insight) {
      return success(
        res,
        { ai_insight: session.ai_insight },
        'AI Insight sudah tersedia.',
      );
    }

    let inputData = session.input_data;
    if (typeof inputData === 'string') {
      try {
        inputData = JSON.parse(inputData);
      } catch {
        inputData = {};
      }
    }

    let prediction;
    try {
      prediction = await mlService.predict(inputData, true);
    } catch (mlErr) {
      const detail = mlErr.response?.data?.detail || mlErr.message;
      return error(res, `AI backend tidak tersedia: ${detail}`, 503);
    }

    const aiInsight = prediction.ai_insight || null;

    const updated = await ScreeningRepositories.updateAiInsight({
      id: req.params.id,
      userId: req.user.id,
      aiInsight,
    });

    if (!updated) return next(new NotFoundError('Sesi tidak ditemukan.'));

    return success(
      res,
      { ai_insight: aiInsight },
      'AI Insight berhasil diaktifkan.',
    );
  } catch (err) {
    next(err);
  }
};

// GET /api/screening/health
// eslint-disable-next-line no-unused-vars
export const mlHealth = async (req, res, next) => {
  try {
    const health = await mlService.healthCheck();
    return success(res, { ml_backend: health }, 'ML backend status');
  } catch {
    return error(res, 'ML backend tidak tersedia.', 503);
  }
};
