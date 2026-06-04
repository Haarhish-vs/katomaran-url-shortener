import express from 'express';
import authMiddleware from '../../middleware/auth.middleware.js';
import { getSummary } from './summary.controller.js';

const router = express.Router();

router.get('/summary', authMiddleware, getSummary);

export default router;
