import { verifyPasswordService } from './password.service.js';
import logger from '../../utils/logger.js';

export async function verifyPassword(req, res, next) {
	try {
		const { shortCode, password } = req.body || {};
		logger.info('[PASSWORD_PROTECTION]', 'Password Verification Request', { shortCode });

		if (!shortCode || !password) {
			const err = new Error('shortCode and password are required');
			err.statusCode = 400;
			return next(err);
		}

		const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
		const userAgent = req.headers['user-agent'];
		const referrer = req.headers['referer'] || req.headers['referrer'] || null;

		const result = await verifyPasswordService(shortCode, password, ip, userAgent, referrer);

		return res.status(200).json({
			success: true,
			data: {
				originalUrl: result.originalUrl,
			},
		});
	} catch (err) {
		if (err && err.statusCode) {
			return res.status(err.statusCode).json({ success: false, message: err.message });
		}
		return next(err);
	}
}
