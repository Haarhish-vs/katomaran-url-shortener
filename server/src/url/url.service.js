import prisma from '../config/db.js';
import { generateRandomBase62 } from '../utils/base62.js';

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