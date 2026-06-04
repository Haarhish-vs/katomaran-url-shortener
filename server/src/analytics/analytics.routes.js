import express from 'express';
import overviewRouter from './overview/overview.routes.js';
import userRouter from './user/user.routes.js';

const router = express.Router();

router.use('/user', userRouter);
router.use('/', overviewRouter);

export default router;
