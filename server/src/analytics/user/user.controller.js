import { getUserAnalytics } from './user.service.js';
import logger from '../../../utils/logger.js';

export async function getGlobalUserAnalytics(req, res, next) {
	try {
		const { range, from, to } = req.query || {};
		const user = req.user;
		
		if (!user || !user.id) {
			const err = new Error('Unauthorized');
			err.statusCode = 401;
			return next(err);
		}

		const result = await getUserAnalytics({ userId: user.id, range, from, to });

		return res.status(200).json({ success: true, data: result });
	} catch (err) {
		if (err && err.statusCode) {
			return res.status(err.statusCode).json({ success: false, message: err.message });
		}
		return next(err);
	}
}
