import prisma from '../config/db.js';
import { generateRandomBase62 } from '../utils/base62.js';
import { recordVisit } from '../analytics/analytics.service.js';

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
		const err = new Error('Invalid URL format');
		err.statusCode = 400;
		throw err;
	}

	// Create initial record without shortCode
	const created = await prisma.url.create({
		data: {
			originalUrl,
			userId
		}
	});

	// Generate unique shortCode and update the record
	let shortCode;
	const maxAttempts = 5;
	let attempt = 0;
	while (attempt < maxAttempts) {
		shortCode = generateRandomBase62(8);
		try {
			const updated = await prisma.url.update({
				where: { id: created.id },
				data: { shortCode }
			});
			// Success
			const base = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
			return {
				id: updated.id,
				originalUrl: updated.originalUrl,
				shortCode: updated.shortCode,
				shortUrl: `${base}/${updated.shortCode}`
			};
		} catch (e) {
			// If shortCode unique constraint failed, retry
			attempt += 1;
			if (attempt >= maxAttempts) {
				const err = new Error('Failed to generate unique short code');
				err.statusCode = 500;
				throw err;
			}
		}
	}

	// If we exit loop without return, throw
	const err = new Error('Failed to generate short code');
	err.statusCode = 500;
	throw err;
}

function validateShortCode(shortCode) {
	return typeof shortCode === 'string' && /^[A-Za-z0-9]+$/.test(shortCode);
}

export async function redirectUrlService(shortCode) {
	if (!validateShortCode(shortCode)) {
		const err = new Error('Short code not found');
		err.statusCode = 404;
		throw err;
	}

	const url = await prisma.url.findUnique({
		where: { shortCode },
		select: {
			id: true,
			originalUrl: true,
			shortCode: true
		}
	});

	if (!url) {
		const err = new Error('Short code not found');
		err.statusCode = 404;
		throw err;
	}

	await recordVisit(url.id);

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
		const err = new Error('Short code not found');
		err.statusCode = 404;
		throw err;
	}

	if (url.userId !== userId) {
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

	return {
		shortCode
	};
}