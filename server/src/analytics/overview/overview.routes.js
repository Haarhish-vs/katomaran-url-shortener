import express from 'express';
import authMiddleware from '../../middleware/auth.middleware.js';
import { getSummary } from '../summary/summary.controller.js';
import { getAnalytics } from './overview.controller.js';

const router = express.Router();

router.get('/summary', authMiddleware, getSummary);
router.get('/:shortCode', authMiddleware, getAnalytics);

export default router;
