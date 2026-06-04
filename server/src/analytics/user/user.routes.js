import express from 'express';
import authMiddleware from '../../middleware/auth.middleware.js';
import { getGlobalUserAnalytics } from './user.controller.js';

const router = express.Router();

router.get('/', authMiddleware, getGlobalUserAnalytics);

export default router;
