import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { createUrl, deleteUrl, getUserUrls } from './url.controller.js';

const router = express.Router();

// Create a new short URL (protected)
router.post('/', authMiddleware, createUrl);

// Get logged-in user's URLs (protected)
router.get('/', authMiddleware, getUserUrls);

// Delete a URL owned by the logged-in user (protected)
router.delete('/:id', authMiddleware, deleteUrl);

export default router;