import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import authentications from '../services/authentications/routes/index.js';
import screening from '../services/screening/routes/index.js';
import feedback from '../services/feedback/routes/index.js';
import { success } from '../utils/response.js';

const router = Router();

// membuat limiter khusus untuk endpoint prediksi dengan batas 10 request per menit
const predictLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Terlalu banyak permintaan prediksi. Coba lagi dalam 1 menit.',
  },
});

router.get('/', (req, res) => {
  return success(
    res,
    {
      gateway: 'DepreScan API Gateway',
      version: '1.0.0',
      base_url: '/api',
      docs: 'GET /',
    },
    'Selamat datang di DepreScan API Gateway!',
  );
});
router.use('/auth', authentications);
router.use('/screening', predictLimiter, screening);
router.use('/feedback', feedback);

export default router;
