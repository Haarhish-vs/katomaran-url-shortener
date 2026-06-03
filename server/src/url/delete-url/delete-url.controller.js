import { deleteUrlService } from './delete-url.service.js';
import logger from '../../utils/logger.js';

export async function deleteUrl(req, res, next) {
	try {
		const { id } = req.params || {};
		const user = req.user;
		logger.info('[URL]', 'Delete URL Request', { method: req.method, route: req.originalUrl, id, userId: user?.id });

		if (!user || !user.id) {
			const err = new Error('Unauthorized');
			err.statusCode = 401;
			return next(err);
		}

		const result = await deleteUrlService({ id, userId: user.id });

		return res.status(200).json({ success: true, message: 'URL deleted successfully', data: result });
	} catch (err) {
		if (err && err.statusCode) {
			return res.status(err.statusCode).json({ success: false, message: err.message });
		}
		return next(err);
	}
}
