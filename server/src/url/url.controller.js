import { createUrlService } from './url.service.js';

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