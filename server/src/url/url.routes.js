import express from 'express';
import createUrlRouter from './create-url/create-url.routes.js';
import listUrlsRouter from './list-urls/list-urls.routes.js';
import deleteUrlRouter from './delete-url/delete-url.routes.js';

const router = express.Router();

router.use('/', createUrlRouter);
router.use('/', listUrlsRouter);
router.use('/', deleteUrlRouter);

export default router;