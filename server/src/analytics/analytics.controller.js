import { getUrlAnalytics } from './analytics.service.js';

export async function getAnalytics(req, res, next) {
	try {
		const { shortCode } = req.params || {};
		const user = req.user;

		if (!user || !user.id) {
			return res.status(401).json({ success: false, message: 'Unauthorized' });
		}

		const result = await getUrlAnalytics({ shortCode, userId: user.id });

		return res.status(200).json({ success: true, data: result });
	} catch (err) {
		if (err && err.statusCode) {
			return res.status(err.statusCode).json({ success: false, message: err.message });
		}
		return next(err);
	}
}