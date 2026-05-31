import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import routes from '../routes/index.js';
import { errorHandler, notFound } from '../middlewares/error.js';
import { success } from '../utils/response.js';

const app = express();

app.use(helmet());

// Trust proxy Railway
app.set('trust proxy', 1);

// cors origin yang diijinkan
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  'http://localhost:3000',
  'https://most-citadel-distill.ngrok-free.dev',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (origin.endsWith('.netlify.app')) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      if (process.env.NODE_ENV === 'development') return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

// membuat limiter keseluruhan request
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Terlalu banyak permintaan. Coba lagi nanti.',
  },
});

// Rate limiting predict endpoint
export const predictLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Terlalu banyak permintaan prediksi. Coba lagi dalam 1 menit.',
  },
});

app.use(limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// HTTP request logger
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health check
app.get('/health', (req, res) => {
  return success(
    res,
    {
      status: 'ok',
      app: 'DepreScan API',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
    },
    'Server is running',
  );
});

// API root info
app.get('/', (req, res) => {
  return success(
    res,
    {
      app: 'DepreScan API',
      version: '1.0.0',
      description:
        'REST API untuk deteksi risiko depresi berbasis gaya hidup (CC26-PSU066)',
      endpoints: {
        health: 'GET /health',
        auth: {
          register: 'POST /api/auth/register',
          login: 'POST /api/auth/login',
          google: 'POST /api/auth/google',
          me: 'GET /api/auth/me',
        },
        screening: {
          predict: 'POST /api/screening/predict',
          list_sessions: 'GET /api/screening/sessions',
          get_session: 'GET /api/screening/sessions/:id',
          delete_session: 'DELETE /api/screening/sessions/:id',
          delete_all: 'DELETE /api/screening/sessions',
          ml_health: 'GET /api/screening/health',
        },
        feedback: {
          create: 'POST /api/feedback',
          list: 'GET /api/feedback',
        },
      },
      disclaimer: 'Bukan pengganti diagnosis klinis.',
    },
    'DepreScan API',
  );
});

// Routes
app.use('/api', routes);

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

export default app;
