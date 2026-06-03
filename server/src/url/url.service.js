import prisma from '../config/db.js';
import { encodeBuffer } from '../utils/base62.js';
import { recordVisit } from '../analytics/analytics.service.js';
import logger from '../utils/logger.js';

function validateUrlFormat(value) {
	try {
		const url = new URL(value);
		return url.protocol === 'http:' || url.protocol === 'https:';
	} catch (e) {
		return false;
	}
}

export async function createUrlService({ originalUrl, userId }) {
	if (!validateUrlFormat(originalUrl)) {
		logger.warn('[URL]', 'URL Creation Failed', { userId, reason: 'Invalid URL format' });
		const err = new Error('Invalid URL format');
		err.statusCode = 400;
		throw err;
	}

	logger.success('[URL]', 'URL Validation Passed', { userId });

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

export async function getUserUrlsService(userId) {
	const urls = await prisma.url.findMany({
		where: { userId },
		select: {
			id: true,
			originalUrl: true,
			shortCode: true,
			createdAt: true,
			_count: {
				select: {
					visits: true
				}
			}
		},
		orderBy: {
			createdAt: 'desc'
		}
	});

	const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
	logger.success('[URL]', 'User URLs Retrieved', { userId, totalUrls: urls.length });

	return {
		urls: urls.map((url) => ({
			id: url.id,
			originalUrl: url.originalUrl,
			shortCode: url.shortCode,
			shortUrl: `${baseUrl}/${url.shortCode}`,
			createdAt: url.createdAt,
			totalClicks: url._count.visits
		}))
	};
}

export async function deleteUrlService({ shortCode, userId }) {
	if (!shortCode || typeof shortCode !== 'string') {
		logger.warn('[URL]', 'URL Deleted', { userId, shortCode, reason: 'Short code not found' });
		const err = new Error('Short code not found');
		err.statusCode = 404;
		throw err;
	}

	const url = await prisma.url.findUnique({
		where: { shortCode },
		select: {
			id: true,
			userId: true
		}
	});

	if (!url) {
		logger.warn('[URL]', 'URL Deleted', { userId, shortCode, reason: 'URL not found' });
		const err = new Error('Short code not found');
		err.statusCode = 404;
		throw err;
	}

	if (url.userId !== userId) {
		logger.warn('[URL]', 'URL Deleted', { userId, shortCode, reason: 'Forbidden' });
		const err = new Error('Forbidden');
		err.statusCode = 403;
		throw err;
	}

	await prisma.$transaction([
		prisma.visit.deleteMany({
			where: { urlId: url.id }
		}),
		prisma.url.delete({
			where: { id: url.id }
		})
	]);

	logger.success('[URL]', 'URL Deleted', { userId, shortCode, urlId: url.id });

	return {
		shortCode
	};
}