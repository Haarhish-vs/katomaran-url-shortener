import { getUserUrlsService } from './list-urls.service.js';
import logger from '../../utils/logger.js';

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
