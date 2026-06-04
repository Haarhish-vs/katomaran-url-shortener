import prisma from '../../config/db.js';
import logger from '../../utils/logger.js';
import { recordVisit } from '../../analytics/overview/overview.service.js';

function validateShortCode(shortCode) {
	return typeof shortCode === 'string' && /^[A-Za-z0-9\-_]+$/.test(shortCode);
}

export async function redirectUrlService(shortCode, ip, userAgent, referrer) {
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
			shortCode: true,
			startDate: true,
			expiresAt: true,
			isPasswordProtected: true,
		},
	});

	if (!url) {
		logger.warn('[URL]', 'Redirect Failed', { shortCode, reason: 'Short code not found' });
		const err = new Error('Short code not found');
		err.statusCode = 404;
		throw err;
	}

	const now = new Date();

	// ── Case 2 / Case 3: Check Start Date ────────────────────────────────────
	if (url.startDate && now < url.startDate) {
		logger.warn('[URL]', 'Redirect Blocked — Not Yet Active', {
			shortCode,
			urlId: url.id,
			startDate: url.startDate,
			now,
		});
		const err = new Error('Link is not yet active');
		err.statusCode = 404;
		throw err;
	}

	// ── Case 4: Check Expiry Date ─────────────────────────────────────────────
	if (url.expiresAt && now >= url.expiresAt) {
		logger.warn('[URL]', 'Redirect Blocked — Link Expired', {
			shortCode,
			urlId: url.id,
			expiresAt: url.expiresAt,
			now,
		});
		const err = new Error('Link has expired');
		err.statusCode = 410;
		throw err;
	}

	// ── Password Protection Check ──────────────────────────────────────────────
	if (url.isPasswordProtected) {
		logger.info('[PASSWORD_PROTECTION]', 'Redirect Gated — Password Required', { shortCode, urlId: url.id });
		return {
			passwordRequired: true,
			shortCode: url.shortCode,
		};
	}

	const visit = await recordVisit(url.id, ip, userAgent, referrer);
	logger.success('[URL]', 'Redirect Success', { shortCode, urlId: url.id });

	return {
		originalUrl: url.originalUrl,
		shortCode: url.shortCode,
		visitId: visit.id
	};
}
