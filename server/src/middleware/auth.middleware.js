import { verifyToken } from '../utils/jwt.js';

export default function authMiddleware(req, res, next) {
	const authorizationHeader = req.headers.authorization;

	if (!authorizationHeader) {
		return res.status(401).json({ success: false, message: 'Unauthorized' });
	}

	const [scheme, token, ...rest] = authorizationHeader.trim().split(/\s+/);

	if (scheme !== 'Bearer' || !token || rest.length > 0) {
		return res.status(401).json({ success: false, message: 'Unauthorized' });
	}

	try {
		const decoded = verifyToken(token);
		req.user = {
			id: decoded.id,
			email: decoded.email
		};
		return next();
	} catch (error) {
		return res.status(401).json({ success: false, message: 'Unauthorized' });
	}
}
