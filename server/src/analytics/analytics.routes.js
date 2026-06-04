import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { getSummary } from './summary/summary.controller.js';
import overviewRouter from './overview/overview.routes.js';

const router = express.Router();

// Literal route must be registered before /:shortCode in overviewRouter
router.get('/summary', authMiddleware, getSummary);
router.use('/', overviewRouter);

export default router;
