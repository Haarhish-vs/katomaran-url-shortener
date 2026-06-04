import express from 'express';
import summaryRouter from './summary/summary.routes.js';
import overviewRouter from './overview/overview.routes.js';

const router = express.Router();

router.use('/', summaryRouter);
router.use('/', overviewRouter);

export default router;