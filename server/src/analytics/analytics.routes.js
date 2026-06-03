import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { getAnalytics } from './analytics.controller.js';

const router = express.Router();

router.get('/:shortCode', authMiddleware, getAnalytics);

export default router;