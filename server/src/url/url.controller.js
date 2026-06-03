import { createUrlService, deleteUrlService, getUserUrlsService, redirectUrlService } from './url.service.js';
import logger from '../utils/logger.js';

export async function createUrl(req, res, next) {
	try {
		const { originalUrl } = req.body || {};
		const user = req.user;
		logger.info('[URL]', 'Create URL Request', { method: req.method, route: req.originalUrl, userId: user?.id });

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

		const result = await createUrlService({ originalUrl, userId: user.id });

		return res.status(201).json({ success: true, data: result });
	} catch (err) {
		if (err && err.statusCode) {
			return res.status(err.statusCode).json({ success: false, message: err.message });
		}
		return next(err);
	}
}

export async function redirectUrl(req, res, next) {
	try {
		const { shortCode } = req.params || {};
		logger.info('[URL]', 'Redirect Request', { method: req.method, route: req.originalUrl, shortCode });

		if (!shortCode) {
			const err = new Error('Not Found');
			err.statusCode = 404;
			return next(err);
		}

		const result = await redirectUrlService(shortCode);

		return res.redirect(302, result.originalUrl);
	} catch (err) {
		if (err && err.statusCode) {
			return res.status(err.statusCode).json({ success: false, message: err.message });
		}
		return next(err);
	}
}

export async function getUserUrls(req, res, next) {
	try {
		const user = req.user;
		logger.info('[URL]', 'Get User URLs Request', { method: req.method, route: req.originalUrl, userId: user?.id });

		if (!user || !user.id) {
			const err = new Error('Unauthorized');
			err.statusCode = 401;
			return next(err);
		}

		const result = await getUserUrlsService(user.id);

		return res.status(200).json({ success: true, data: result });
	} catch (err) {
		if (err && err.statusCode) {
			return res.status(err.statusCode).json({ success: false, message: err.message });
		}
		return next(err);
	}
}

export async function deleteUrl(req, res, next) {
	try {
		const { id } = req.params || {};
		const user = req.user;
		logger.info('[URL]', 'Delete URL Request', { method: req.method, route: req.originalUrl, id, userId: user?.id });

		if (!user || !user.id) {
			const err = new Error('Unauthorized');
			err.statusCode = 401;
			return next(err);
		}

		const result = await deleteUrlService({ id, userId: user.id });

		return res.status(200).json({ success: true, message: 'URL deleted successfully', data: result });
	} catch (err) {
		if (err && err.statusCode) {
			return res.status(err.statusCode).json({ success: false, message: err.message });
		}
		return next(err);
	}
}