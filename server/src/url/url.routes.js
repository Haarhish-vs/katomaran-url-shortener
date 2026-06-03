import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { createUrl, getUserUrls } from './url.controller.js';

const router = express.Router();

// Create a new short URL (protected)
router.post('/', authMiddleware, createUrl);

// Get logged-in user's URLs (protected)
router.get('/', authMiddleware, getUserUrls);

export default router;