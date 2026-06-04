import prisma from '../../config/db.js';
import logger from '../../utils/logger.js';

export async function getTimeline(queryWhere) {
	try {
		logger.info('[ANALYTICS]', 'Timeline Requested');
		
		const visits = await prisma.visit.findMany({
			where: queryWhere,
			select: { clickedAt: true },
			orderBy: { clickedAt: 'asc' }
		});

		if (visits.length === 0) {
			logger.info('[ANALYTICS]', 'Timeline Generated (Empty)');
			return [];
		}

		// Determine start and end dates based on the queryWhere if available, else first and last visit
		let startDate;
		let endDate;

		if (queryWhere.clickedAt && queryWhere.clickedAt.gte) {
			startDate = new Date(queryWhere.clickedAt.gte);
		} else {
			startDate = new Date(visits[0].clickedAt);
		}
        startDate.setUTCHours(0, 0, 0, 0);

		if (queryWhere.clickedAt && queryWhere.clickedAt.lte) {
			endDate = new Date(queryWhere.clickedAt.lte);
		} else {
			endDate = new Date();
		}
		endDate.setUTCHours(23, 59, 59, 999);

		const timelineMap = new Map();

		// Initialize all days in the range with 0 clicks
		let current = new Date(startDate);
		while (current <= endDate) {
			const dateStr = current.toISOString().split('T')[0];
			timelineMap.set(dateStr, 0);
			current.setUTCDate(current.getUTCDate() + 1);
		}

		// Fill in the actual clicks
		for (const visit of visits) {
			const dateStr = visit.clickedAt.toISOString().split('T')[0];
			if (timelineMap.has(dateStr)) {
				timelineMap.set(dateStr, timelineMap.get(dateStr) + 1);
			}
		}

		const timeline = Array.from(timelineMap.entries()).map(([date, clicks]) => ({
			date,
			clicks
		}));

		logger.info('[ANALYTICS]', 'Timeline Generated');
		return timeline;
	} catch (err) {
		logger.error('[ANALYTICS]', 'Timeline Failed', { error: err.message });
		throw err;
	}
}
