import express from 'express';
import authMiddleware from '../../middleware/auth.middleware.js';
import { getUserUrls } from './list-urls.controller.js';

const router = express.Router();

// Get logged-in user's URLs (protected)
router.get('/', authMiddleware, getUserUrls);

export default router;
