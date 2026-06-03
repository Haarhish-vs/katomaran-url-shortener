import prisma from '../../config/db.js';
import logger from '../../utils/logger.js';

export function validateCustomAlias(alias) {
	if (typeof alias !== 'string') return false;
	// Alphanumeric, hyphens, and underscores only
	if (!/^[A-Za-z0-9\-_]+$/.test(alias)) return false;
	// Length limits (3 to 30 characters)
	if (alias.length < 3 || alias.length > 30) return false;
	// Reserved keywords to prevent path conflicts
	const reserved = ['api', 'login', 'signup', 'analytics', 'assets', 'dashboard'];
	if (reserved.includes(alias.toLowerCase())) return false;
	return true;
}

export async function handleCustomAlias({ originalUrl, userId, customAlias }) {
	const trimmedAlias = customAlias.trim();
	if (!validateCustomAlias(trimmedAlias)) {
		logger.warn('[URL]', 'URL Creation Failed', { userId, reason: 'Invalid custom alias format', customAlias });
		const err = new Error('Invalid custom alias format. Only letters, numbers, hyphens, and underscores are allowed (3-30 chars).');
		err.statusCode = 400;
		throw err;
	}

	// Check if customAlias is already taken
	const existing = await prisma.url.findUnique({
		where: { shortCode: trimmedAlias }
	});
	if (existing) {
		logger.warn('[URL]', 'URL Creation Failed', { userId, reason: 'Custom alias taken', customAlias: trimmedAlias });
		const err = new Error('Custom alias is already taken');
		err.statusCode = 409; // Conflict status code preferred for existing resource conflicts
		throw err;
	}

	const created = await prisma.url.create({
		data: {
			originalUrl,
			userId,
			shortCode: trimmedAlias
		}
	});

	const base = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
	logger.success('[URL]', 'URL Stored with Custom Alias', { userId, shortCode: created.shortCode, urlId: created.id });
	return {
		id: created.id,
		originalUrl: created.originalUrl,
		shortCode: created.shortCode,
		shortUrl: `${base}/${created.shortCode}`
	};
}
