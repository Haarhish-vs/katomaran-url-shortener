import prisma from '../../config/db.js';
import logger from '../../utils/logger.js';
import { getAnalyticsSummary } from '../summary/summary.service.js';
import { buildDateFilter } from '../date-filter/date-filter.service.js';
import { getTimeline } from '../chart/chart.service.js';
import { getRecentVisits } from '../recent-visits/recent-visits.service.js';

export async function getUserAnalytics({ userId, range, from, to }) {
	logger.info('[ANALYTICS]', 'User Analytics Requested', { userId, range, from, to });

	// Get global summary
	const summary = await getAnalyticsSummary({ userId, range, from, to });

	// Determine date filter for visits
	const dateFilter = buildDateFilter({ userId, range, from, to });
	const queryWhere = {
		url: { userId },
		...(Object.keys(dateFilter).length > 0 ? { clickedAt: dateFilter } : {})
	};

	// Get Timeline and Recent Visits
	const [timeline, recentActivity] = await Promise.all([
		getTimeline(queryWhere),
		getRecentVisits(queryWhere)
	]);

	// Get Top URLs
	const urlsWithVisitCounts = await prisma.url.findMany({
		where: { userId },
		select: {
			id: true,
			shortCode: true,
			originalUrl: true,
			createdAt: true,
			startDate: true,
			expiresAt: true,
			isPasswordProtected: true,
			_count: {
				select: {
					visits: {
						where: Object.keys(dateFilter).length > 0 ? dateFilter : undefined
					}
				}
			}
		},
		orderBy: {
			visits: {
				_count: 'desc'
			}
		},
		take: 50 // Limit to top 50 for dashboard performance
	});

	const topUrls = urlsWithVisitCounts
		.map(u => ({
			shortCode: u.shortCode,
			originalUrl: u.originalUrl,
			clicks: u._count.visits,
			createdAt: u.createdAt,
			isPasswordProtected: u.isPasswordProtected,
			startDate: u.startDate,
			expiresAt: u.expiresAt,
			status: calculateStatus(u)
		}))
		// Filter out URLs with 0 clicks if we want to show only "top" ones, or keep them to show all. We'll keep them but they are ordered by desc clicks.
		.filter(u => u.clicks > 0);

	// If no URLs have clicks in this range, we might just want to return the most recently created or just the empty list
	// Returning the empty list if no clicks is standard for Top URLs.

	return {
		summary,
		timeline,
		topUrls,
		recentActivity
	};
}

function calculateStatus(url) {
	const now = new Date();
	if (url.expiresAt && now >= url.expiresAt) return 'expired';
	if (url.startDate && now < url.startDate) return 'scheduled';
	return 'active';
}
