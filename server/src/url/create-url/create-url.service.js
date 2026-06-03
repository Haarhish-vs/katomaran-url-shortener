import prisma from '../../config/db.js';
import { encodeBuffer } from '../../utils/base62.js';
import logger from '../../utils/logger.js';
import { handleCustomAlias } from '../custom-alias/custom-alias.service.js';
import { validateDates } from '../expiry/expiry.service.js';
import { hashPassword } from '../../utils/hash.js';

function validateUrlFormat(value) {
	try {
		const url = new URL(value);
		return url.protocol === 'http:' || url.protocol === 'https:';
	} catch {
		return false;
	}
}

export async function createUrlService({ originalUrl, userId, customAlias, startDate, expiresAt, password }) {
	if (!validateUrlFormat(originalUrl)) {
		logger.warn('[URL]', 'URL Creation Failed', { userId, reason: 'Invalid URL format' });
		const err = new Error('Invalid URL format');
		err.statusCode = 400;
		throw err;
	}

	logger.success('[URL]', 'URL Validation Passed', { userId });

	// ── Date Validation ───────────────────────────────────────────────────────
	const { parsedStart, parsedExpiry } = validateDates({ startDate, expiresAt }, { userId });

	// ── Password Validation ───────────────────────────────────────────────────
	let hashedPassword = null;
	if (password !== undefined && password !== null) {
		if (typeof password !== 'string' || password.trim() === '') {
			logger.warn('[PASSWORD_PROTECTION]', 'URL Creation Failed', { userId, reason: 'Password cannot be empty' });
			const err = new Error('Password cannot be empty');
			err.statusCode = 400;
			throw err;
		}
		hashedPassword = await hashPassword(password);
	}

	// ── Custom Alias Flow ─────────────────────────────────────────────────────
	if (customAlias) {
		return handleCustomAlias({ originalUrl, userId, customAlias, startDate, expiresAt, password });
	}

	// ── Step 1: Create database record — DB generates the unique ID ───────────
	const created = await prisma.url.create({
		data: {
			originalUrl,
			userId,
			...(parsedStart ? { startDate: parsedStart } : {}),
			...(parsedExpiry ? { expiresAt: parsedExpiry } : {}),
			...(hashedPassword ? { isPasswordProtected: true, passwordHash: hashedPassword } : {}),
		},
	});

	if (hashedPassword) {
		logger.info('[PASSWORD_PROTECTION]', 'Protected URL Created', { userId, urlId: created.id });
	}

	// ── Step 2: Derive shortCode by Base62-encoding the DB-generated ID ───────
	let shortCode = encodeBuffer(Buffer.from(created.id)).slice(0, 8);
	logger.success('[URL]', 'Short Code Generated', { userId, shortCode });

	// ── Step 3: Update record with shortCode — retry on unique constraint ─────
	const maxAttempts = 5;
	for (let attempt = 0; attempt < maxAttempts; attempt++) {
		try {
			const updated = await prisma.url.update({
				where: { id: created.id },
				data: { shortCode },
			});

			const base = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
			logger.success('[URL]', 'URL Stored', {
				userId,
				shortCode: updated.shortCode,
				urlId: updated.id,
				hasStartDate: Boolean(updated.startDate),
				hasExpiresAt: Boolean(updated.expiresAt),
				isPasswordProtected: updated.isPasswordProtected,
			});

			return {
				id: updated.id,
				originalUrl: updated.originalUrl,
				shortCode: updated.shortCode,
				shortUrl: `${base}/${updated.shortCode}`,
				isPasswordProtected: updated.isPasswordProtected,
				...(updated.startDate ? { startDate: updated.startDate } : {}),
				...(updated.expiresAt ? { expiresAt: updated.expiresAt } : {}),
			};
		} catch (error) {
			logger.error('[URL]', 'Prisma update failed in loop', { error: error.message, stack: error.stack });
			// Unique constraint collision — vary the input and retry
			shortCode = encodeBuffer(Buffer.from(attempt + created.id)).slice(0, 8);
			logger.warn('[URL]', 'Short Code Collision, Retrying', { userId, attempt: attempt + 1 });
		}
	}

	logger.error('[URL]', 'URL Creation Failed', {
		userId,
		reason: 'Failed to generate unique short code',
	});
	const err = new Error('Failed to generate unique short code');
	err.statusCode = 500;
	throw err;
}
