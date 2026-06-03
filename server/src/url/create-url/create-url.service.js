import prisma from '../../config/db.js';
import { encodeBuffer } from '../../utils/base62.js';
import logger from '../../utils/logger.js';
import { handleCustomAlias } from '../custom-alias/custom-alias.service.js';

function validateUrlFormat(value) {
	try {
		const url = new URL(value);
		return url.protocol === 'http:' || url.protocol === 'https:';
	} catch (e) {
		return false;
	}
}

export async function createUrlService({ originalUrl, userId, customAlias }) {
	if (!validateUrlFormat(originalUrl)) {
		logger.warn('[URL]', 'URL Creation Failed', { userId, reason: 'Invalid URL format' });
		const err = new Error('Invalid URL format');
		err.statusCode = 400;
		throw err;
	}

	logger.success('[URL]', 'URL Validation Passed', { userId });

	// Custom Alias Flow
	if (customAlias) {
		return handleCustomAlias({ originalUrl, userId, customAlias });
	}

	// Step 1: Create database record — DB generates the unique ID
	const created = await prisma.url.create({
		data: {
			originalUrl,
			userId
		}
	});

	// Step 2: Derive shortCode by Base62-encoding the DB-generated ID (per diagram)
	let shortCode = encodeBuffer(Buffer.from(created.id)).slice(0, 8);
	logger.success('[URL]', 'Short Code Generated', { userId, shortCode });

	// Step 3: Update the record with the shortCode — retry on unique constraint collision
	const maxAttempts = 5;
	for (let attempt = 0; attempt < maxAttempts; attempt++) {
		try {
			const updated = await prisma.url.update({
				where: { id: created.id },
				data: { shortCode }
			});
			const base = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
			logger.success('[URL]', 'URL Stored', { userId, shortCode: updated.shortCode, urlId: updated.id });
			return {
				id: updated.id,
				originalUrl: updated.originalUrl,
				shortCode: updated.shortCode,
				shortUrl: `${base}/${updated.shortCode}`
			};
		} catch (e) {
			// Unique constraint collision — vary the input and retry
			shortCode = encodeBuffer(Buffer.from(created.id + attempt)).slice(0, 8);
			logger.warn('[URL]', 'Short Code Collision, Retrying', { userId, attempt: attempt + 1 });
		}
	}

	logger.error('[URL]', 'URL Creation Failed', { userId, reason: 'Failed to generate unique short code' });
	const err = new Error('Failed to generate unique short code');
	err.statusCode = 500;
	throw err;
}
