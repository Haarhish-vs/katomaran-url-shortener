// Force nodemon reload 2
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from './config/db.js';
import authRoutes from './auth/auth.routes.js';
import analyticsRoutes from './analytics/analytics.routes.js';
import errorMiddleware from './middleware/error.middleware.js';
import urlRoutes from './url/url.routes.js';
import { redirectUrl } from './url/redirect-url/redirect-url.controller.js';
import logger from './utils/logger.js';

dotenv.config();

const app = express();

const rawFrontendUrl = (process.env.FRONTEND_URL || '').replace(/['"\r\n]/g, '').trim();
const allowedOrigins = rawFrontendUrl ? rawFrontendUrl.split(',').map(o => o.trim()) : [];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or postman)
      if (!origin) {
        return callback(null, true);
      }

      // Check if origin matches whitelisted hosts, or matches wildcard, or matches Vercel project subdomains
      const isAllowed =
        allowedOrigins.length === 0 ||
        allowedOrigins.includes('*') ||
        allowedOrigins.includes(origin) ||
        /^https:\/\/katomaran-url-shortener.*\.vercel\.app$/.test(origin);

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/urls', urlRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/:shortCode', redirectUrl);

app.get('/', async (req, res) => {
  try {
    const userCount = await prisma.user.count();

    res.status(200).json({
      success: true,
      database: 'Connected',
      users: userCount,
      message: 'Backend Running Successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.use((req, res, next) => {
  const err = new Error('Route not found');
  err.statusCode = 404;
  return next(err);
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.success('[SERVER]', 'Server Running', { port: PORT });
});