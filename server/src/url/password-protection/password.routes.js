import { Router } from 'express';
import { verifyPassword } from './password.controller.js';

const router = Router();

router.post('/verify-password', verifyPassword);

export default router;
