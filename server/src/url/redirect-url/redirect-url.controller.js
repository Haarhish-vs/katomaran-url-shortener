import { redirectUrlService } from './redirect-url.service.js';
import logger from '../../utils/logger.js';

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
