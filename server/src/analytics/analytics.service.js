import prisma from '../config/db.js';
import logger from '../utils/logger.js';

export async function recordVisit(urlId) {
	return prisma.visit.create({
		data: {
			urlId
		}
	});
}

function validateShortCode(shortCode) {
	return typeof shortCode === 'string' && /^[A-Za-z0-9]+$/.test(shortCode);
}

export async function getUrlAnalytics({ shortCode, userId }) {
	if (!validateShortCode(shortCode)) {
		logger.warn('[ANALYTICS]', 'Analytics Retrieval Failed', { shortCode, userId, reason: 'Invalid short code' });
		const err = new Error('Analytics not found');
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
		logger.warn('[ANALYTICS]', 'Analytics Retrieval Failed', { shortCode, userId, reason: 'URL not found' });
		const err = new Error('Analytics not found');
		err.statusCode = 404;
		throw err;
	}

	if (url.userId !== userId) {
		logger.warn('[ANALYTICS]', 'Analytics Retrieval Failed', { shortCode, userId, reason: 'Forbidden' });
		const err = new Error('Forbidden');
		err.statusCode = 403;
		throw err;
	}

	logger.success('[ANALYTICS]', 'Ownership Verified', { shortCode, userId, urlId: url.id });

	const [totalClickCount, recentVisitHistory] = await Promise.all([
		prisma.visit.count({
			where: { urlId: url.id }
		}),
		prisma.visit.findMany({
			where: { urlId: url.id },
			select: {
				id: true,
				clickedAt: true
			},
			orderBy: {
				clickedAt: 'desc'
			},
			take: 10
		})
	]);

	return {
		totalClickCount,
		lastVisitedTime: recentVisitHistory[0]?.clickedAt || null,
		recentVisitHistory
	};
}