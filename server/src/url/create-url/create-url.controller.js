import { createUrlService } from './create-url.service.js';
import logger from '../../utils/logger.js';

export async function createUrl(req, res, next) {
	try {
		const { originalUrl, customAlias } = req.body || {};
		const user = req.user;
		logger.info('[URL]', 'Create URL Request', { method: req.method, route: req.originalUrl, customAlias, userId: user?.id });

		if (!user || !user.id) {
			const err = new Error('Unauthorized');
			err.statusCode = 401;
			return next(err);
		}

		if (!originalUrl) {
			const err = new Error('Missing originalUrl in request body');
			err.statusCode = 400;
			return next(err);
		}

		const result = await createUrlService({ originalUrl, userId: user.id, customAlias });

		return res.status(201).json({ success: true, data: result });
	} catch (err) {
		if (err && err.statusCode) {
			return res.status(err.statusCode).json({ success: false, message: err.message });
		}
		return next(err);
	}
}
