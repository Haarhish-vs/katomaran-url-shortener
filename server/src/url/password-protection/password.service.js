import prisma from '../../config/db.js';
import logger from '../../utils/logger.js';
import { comparePassword } from '../../utils/hash.js';
import { recordVisit } from '../../analytics/overview/overview.service.js';

export async function verifyPasswordService(shortCode, password, ip, userAgent, referrer) {
	if (!shortCode) {
		const err = new Error('Short code is required');
		err.statusCode = 400;
		throw err;
	}

	if (!password) {
		const err = new Error('Password is required');
		err.statusCode = 400;
		throw err;
	}

	const url = await prisma.url.findUnique({
		where: { shortCode },
		select: {
			id: true,
			originalUrl: true,
			shortCode: true,
			startDate: true,
			expiresAt: true,
			isPasswordProtected: true,
			passwordHash: true,
		},
	});

	if (!url) {
		logger.warn('[PASSWORD_PROTECTION]', 'Verification Failed — Short code not found', { shortCode });
		const err = new Error('Short code not found');
		err.statusCode = 404;
		throw err;
	}

	const now = new Date();

	// Check Start Date
	if (url.startDate && now < url.startDate) {
		logger.warn('[PASSWORD_PROTECTION]', 'Verification Blocked — Not Yet Active', {
			shortCode,
			urlId: url.id,
			startDate: url.startDate,
			now,
		});
		const err = new Error('Link is not yet active');
		err.statusCode = 404;
		throw err;
	}

	// Check Expiry Date
	if (url.expiresAt && now >= url.expiresAt) {
		logger.warn('[PASSWORD_PROTECTION]', 'Verification Blocked — Link Expired', {
			shortCode,
			urlId: url.id,
			expiresAt: url.expiresAt,
			now,
		});
		const err = new Error('Link has expired');
		err.statusCode = 410;
		throw err;
	}

	if (!url.isPasswordProtected) {
		logger.warn('[PASSWORD_PROTECTION]', 'Verification Blocked — Link not protected', { shortCode, urlId: url.id });
		const err = new Error('Link is not password protected');
		err.statusCode = 400;
		throw err;
	}

	const isMatch = await comparePassword(password, url.passwordHash);
	if (!isMatch) {
		logger.warn('[PASSWORD_PROTECTION]', 'Password Verification Failed', { shortCode, urlId: url.id });
		const err = new Error('Invalid password');
		err.statusCode = 401;
		throw err;
	}

	await recordVisit(url.id, ip, userAgent, referrer);
	logger.success('[PASSWORD_PROTECTION]', 'Password Verification Success', { shortCode, urlId: url.id });

	return {
		originalUrl: url.originalUrl,
	};
}
