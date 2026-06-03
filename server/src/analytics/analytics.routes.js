import express from 'express';
import overviewRouter from './overview/overview.routes.js';

const router = express.Router();

router.use('/', overviewRouter);

export default router;