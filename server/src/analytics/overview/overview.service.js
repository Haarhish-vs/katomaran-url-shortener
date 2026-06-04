import prisma from '../../config/db.js';
import logger from '../../utils/logger.js';
import geoip from 'geoip-lite';
import UAParser from 'ua-parser-js';
import { buildDateFilter } from '../date-filter/date-filter.service.js';
import { getClickCount } from '../click-count/click-count.service.js';
import { getRecentVisits } from '../recent-visits/recent-visits.service.js';
import { getLastVisitTime } from '../last-visit/last-visit.service.js';
import { getTimeline } from '../chart/chart.service.js';

export async function recordVisit(urlId, ip, userAgent) {
	let deviceType = 'Unknown';
	let browser = 'Unknown';
	let operatingSystem = 'Unknown';
	let country = null;
	let region = null;
	let city = null;

	if (userAgent) {
		const parser = new UAParser(userAgent);
		const uaResult = parser.getResult();
		
		if (uaResult.device && uaResult.device.type) {
			deviceType = uaResult.device.type.charAt(0).toUpperCase() + uaResult.device.type.slice(1);
			if (deviceType !== 'Mobile' && deviceType !== 'Tablet') {
				deviceType = 'Desktop'; // normalize smarttv/console
			}
		} else if (uaResult.os && uaResult.os.name) {
			deviceType = 'Desktop';
		}

		if (uaResult.browser && uaResult.browser.name) {
			browser = uaResult.browser.name;
		}
		if (uaResult.os && uaResult.os.name) {
			operatingSystem = uaResult.os.name;
		}

		logger.info('[ANALYTICS]', 'Device Classified', { deviceType });
		logger.info('[ANALYTICS]', 'Browser Classified', { browser });
	}

	if (ip) {
		// Clean ip format for local/ipv6
		const cleanIp = ip.split(',')[0].trim();
		const geo = geoip.lookup(cleanIp);
		if (geo) {
			country = geo.country || null;
			region = geo.region || null;
			city = geo.city || null;
			logger.info('[ANALYTICS]', 'Location Captured', { country, city });
		}
	}

	logger.info('[ANALYTICS]', 'Visit Captured', { urlId });

	return prisma.visit.create({
		data: {
			urlId,
			deviceType,
			browser,
			operatingSystem,
			country,
			region,
			city
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

	const [totalClickCount, recentVisitHistory, timeline] = await Promise.all([
		getClickCount(queryWhere),
		getRecentVisits(queryWhere),
		getTimeline(queryWhere)
	]);

	return {
		totalClickCount,
		lastVisitedTime: getLastVisitTime(recentVisitHistory),
		recentVisitHistory,
		timeline
	};
}
