import { getAnalyticsSummary } from './summary.service.js';
import logger from '../../utils/logger.js';

export async function getSummary(req, res, next) {
	try {
		const { range, from, to } = req.query || {};
		const user = req.user;

		if (!user || !user.id) {
			const err = new Error('Unauthorized');
			err.statusCode = 401;
			return next(err);
		}

		logger.info('[ANALYTICS]', 'Summary Requested', {
			method: req.method,
			route: req.originalUrl,
			userId: user.id,
			range,
			from,
			to,
		});

		const summary = await getAnalyticsSummary({
			userId: user.id,
			range,
			from,
			to,
		});

		logger.info('[ANALYTICS]', 'Summary Generated', {
			userId: user.id,
			totalClicks: summary.totalClicks,
			totalUrls: summary.totalUrls,
			activeUrls: summary.activeUrls,
		});

		return res.status(200).json({ success: true, data: summary });
	} catch (err) {
		logger.warn('[ANALYTICS]', 'Summary Failed', {
			userId: req.user?.id,
			message: err.message,
		});

		if (err && err.statusCode) {
			return res.status(err.statusCode).json({ success: false, message: err.message });
		}
		return next(err);
	}
}
