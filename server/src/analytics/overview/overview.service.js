import prisma from '../../config/db.js';
import logger from '../../utils/logger.js';
import { buildDateFilter } from '../date-filter/date-filter.service.js';
import { getClickCount } from '../click-count/click-count.service.js';
import { getRecentVisits } from '../recent-visits/recent-visits.service.js';
import { getLastVisitTime } from '../last-visit/last-visit.service.js';

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

export async function getUrlAnalytics({ shortCode, userId, range, from, to }) {
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

	const dateFilter = buildDateFilter({ userId, range, from, to });

	const queryWhere = {
		urlId: url.id,
		...(Object.keys(dateFilter).length > 0 ? { clickedAt: dateFilter } : {})
	};

	const [totalClickCount, recentVisitHistory] = await Promise.all([
		getClickCount(queryWhere),
		getRecentVisits(queryWhere)
	]);

	return {
		totalClickCount,
		lastVisitedTime: getLastVisitTime(recentVisitHistory),
		recentVisitHistory
	};
}
