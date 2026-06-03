import { verifyToken } from '../utils/jwt.js';
import logger from '../utils/logger.js';

export default function authMiddleware(req, res, next) {
	const authorizationHeader = req.headers.authorization;

	if (!authorizationHeader) {
		logger.warn('[JWT]', 'Unauthorized Access', { method: req.method, route: req.originalUrl });
		const err = new Error('Unauthorized');
		err.statusCode = 401;
		return next(err);
	}

	const [scheme, token, ...rest] = authorizationHeader.trim().split(/\s+/);

	if (scheme !== 'Bearer' || !token || rest.length > 0) {
		logger.warn('[JWT]', 'Unauthorized Access', { method: req.method, route: req.originalUrl });
		const err = new Error('Unauthorized');
		err.statusCode = 401;
		return next(err);
	}

	logger.info('[JWT]', 'Token Received', { method: req.method, route: req.originalUrl });

	try {
		const decoded = verifyToken(token);
		req.user = {
			id: decoded.id,
			email: decoded.email
		};
		logger.success('[JWT]', 'Token Verified', { userId: decoded.id, route: req.originalUrl });
		return next();
	} catch (error) {
		if (error && error.name === 'TokenExpiredError') {
			logger.warn('[JWT]', 'Token Expired', { method: req.method, route: req.originalUrl });
		} else {
			logger.warn('[JWT]', 'Unauthorized Access', { method: req.method, route: req.originalUrl });
		}

		const err = new Error('Unauthorized');
		err.statusCode = 401;
		return next(err);
	}
}
