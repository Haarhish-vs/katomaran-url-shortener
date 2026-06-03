import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { createUrl } from './url.controller.js';

const router = express.Router();

// Create a new short URL (protected)
router.post('/', authMiddleware, createUrl);

export default router;