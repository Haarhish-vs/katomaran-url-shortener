import prisma from '../../config/db.js';
import logger from '../../utils/logger.js';
import { recordVisit } from '../../analytics/overview/overview.service.js';

function validateShortCode(shortCode) {
	return typeof shortCode === 'string' && /^[A-Za-z0-9]+$/.test(shortCode);
}

export async function redirectUrlService(shortCode) {
	if (!validateShortCode(shortCode)) {
		logger.warn('[URL]', 'Redirect Failed', { shortCode, reason: 'Invalid short code format' });
		const err = new Error('Short code not found');
		err.statusCode = 404;
		throw err;
	}

	logger.info('[URL]', 'ShortCode Lookup', { shortCode });

	const url = await prisma.url.findUnique({
		where: { shortCode },
		select: {
			id: true,
			originalUrl: true,
			shortCode: true
		}
	});

	if (!url) {
		logger.warn('[URL]', 'Redirect Failed', { shortCode, reason: 'Short code not found' });
		const err = new Error('Short code not found');
		err.statusCode = 404;
		throw err;
	}

	await recordVisit(url.id);
	logger.success('[URL]', 'Redirect Success', { shortCode, urlId: url.id });

	return {
		originalUrl: url.originalUrl,
		shortCode: url.shortCode
	};
}
