import express from 'express';
import createUrlRouter from './create-url/create-url.routes.js';
import listUrlsRouter from './list-urls/list-urls.routes.js';
import deleteUrlRouter from './delete-url/delete-url.routes.js';
import passwordRouter from './password-protection/password.routes.js';

const router = express.Router();

router.use('/', createUrlRouter);
router.use('/', listUrlsRouter);
router.use('/', deleteUrlRouter);
router.use('/', passwordRouter);

export default router;