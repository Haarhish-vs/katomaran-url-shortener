import express from 'express';
import authMiddleware from '../../middleware/auth.middleware.js';
import { deleteUrl } from './delete-url.controller.js';

const router = express.Router();

// Delete a URL owned by the logged-in user (protected)
router.delete('/:id', authMiddleware, deleteUrl);

export default router;
