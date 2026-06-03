import logger from '../../utils/logger.js';

export function buildDateFilter({ userId, range, from, to }) {
	let dateFilter = {};

	if (range) {
		const now = new Date();
		if (range === 'today') {
			const start = new Date(now.toISOString().split('T')[0] + 'T00:00:00.000Z');
			dateFilter = { gte: start };
		} else if (range === '7d') {
			const start = new Date();
			start.setDate(now.getDate() - 7);
			dateFilter = { gte: start };
		} else if (range === '30d') {
			const start = new Date();
			start.setDate(now.getDate() - 30);
			dateFilter = { gte: start };
		} else {
			logger.warn('[ANALYTICS]', 'Analytics Retrieval Failed', { userId, range, reason: 'Invalid range option' });
			const err = new Error('Invalid range filter. Expected today, 7d, or 30d');
			err.statusCode = 400;
			throw err;
		}
	} else if (from || to) {
		if (!from || !to) {
			logger.warn('[ANALYTICS]', 'Analytics Retrieval Failed', { userId, from, to, reason: 'Missing partial custom dates' });
			const err = new Error('Both from and to query parameters are required for custom range filtering');
			err.statusCode = 400;
			throw err;
		}

		const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
		if (!dateRegex.test(from) || !dateRegex.test(to)) {
			logger.warn('[ANALYTICS]', 'Analytics Retrieval Failed', { userId, from, to, reason: 'Invalid custom dates format' });
			const err = new Error('Invalid date format. Expected YYYY-MM-DD');
			err.statusCode = 400;
			throw err;
		}

		const start = new Date(from + 'T00:00:00.000Z');
		const end = new Date(to + 'T23:59:59.999Z');

		if (isNaN(start.getTime()) || isNaN(end.getTime())) {
			logger.warn('[ANALYTICS]', 'Analytics Retrieval Failed', { userId, from, to, reason: 'Invalid date values' });
			const err = new Error('Invalid date values');
			err.statusCode = 400;
			throw err;
		}

		if (start > end) {
			logger.warn('[ANALYTICS]', 'Analytics Retrieval Failed', { userId, from, to, reason: 'Start date exceeds end date' });
			const err = new Error('Start date (from) must be before or equal to end date (to)');
			err.statusCode = 400;
			throw err;
		}

		dateFilter = {
			gte: start,
			lte: end
		};
	}

	return dateFilter;
}
