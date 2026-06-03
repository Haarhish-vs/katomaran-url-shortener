import { getUrlAnalytics } from './overview.service.js';
import logger from '../../utils/logger.js';

export async function getAnalytics(req, res, next) {
	try {
		const { shortCode } = req.params || {};
		const { range, from, to } = req.query || {};
		const user = req.user;
		logger.info('[ANALYTICS]', 'Analytics Request', { method: req.method, route: req.originalUrl, shortCode, range, from, to, userId: user?.id });

		if (!user || !user.id) {
			const err = new Error('Unauthorized');
			err.statusCode = 401;
			return next(err);
		}

		const result = await getUrlAnalytics({ shortCode, userId: user.id, range, from, to });

		return res.status(200).json({ success: true, data: result });
	} catch (err) {
		if (err && err.statusCode) {
			return res.status(err.statusCode).json({ success: false, message: err.message });
		}
		return next(err);
	}
}
