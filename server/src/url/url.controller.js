import { createUrlService, deleteUrlService, getUserUrlsService, redirectUrlService } from './url.service.js';

export async function createUrl(req, res, next) {
	try {
		const { originalUrl } = req.body || {};
		const user = req.user;

		if (!user || !user.id) {
			return res.status(401).json({ success: false, message: 'Unauthorized' });
		}

		if (!originalUrl) {
			return res.status(400).json({ success: false, message: 'Missing originalUrl in request body' });
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

		if (!shortCode) {
			return res.status(404).json({ success: false, message: 'Not Found' });
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

		if (!user || !user.id) {
			return res.status(401).json({ success: false, message: 'Unauthorized' });
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
		const { shortCode } = req.params || {};
		const user = req.user;

		if (!user || !user.id) {
			return res.status(401).json({ success: false, message: 'Unauthorized' });
		}

		const result = await deleteUrlService({ shortCode, userId: user.id });

		return res.status(200).json({ success: true, message: 'URL deleted successfully', data: result });
	} catch (err) {
		if (err && err.statusCode) {
			return res.status(err.statusCode).json({ success: false, message: err.message });
		}
		return next(err);
	}
}