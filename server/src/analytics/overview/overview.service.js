import prisma from '../../config/db.js';
import logger from '../../utils/logger.js';
import { buildDateFilter } from '../date-filter/date-filter.service.js';
import { getClickCount } from '../click-count/click-count.service.js';
import { getRecentVisits } from '../recent-visits/recent-visits.service.js';
import { getLastVisitTime } from '../last-visit/last-visit.service.js';
import { getTimeline } from '../chart/chart.service.js';
import geoip from 'geoip-lite';


function parseUserAgent(ua) {
	if (!ua) return { deviceType: 'Unknown', browser: 'Unknown', operatingSystem: 'Unknown' };

	// Device
	let deviceType = 'Desktop';
	if (/ipad|tablet|kindle|playbook|silk|(android(?!.*mobile))/i.test(ua)) {
		deviceType = 'Tablet';
	} else if (/mobile|android|iphone|ipod|blackberry|opera mini|iemobile|windows phone/i.test(ua)) {
		deviceType = 'Mobile';
	}

	// Browser — order matters (Edge before Chrome, Opera before Chrome)
	let browser = 'Unknown';
	if (/edg\//i.test(ua)) browser = 'Edge';
	else if (/opr\/|opera/i.test(ua)) browser = 'Opera';
	else if (/samsungbrowser/i.test(ua)) browser = 'Samsung';
	else if (/chrome\/\d/i.test(ua)) browser = 'Chrome';
	else if (/firefox\/\d/i.test(ua)) browser = 'Firefox';
	else if (/safari\/\d/i.test(ua) && !/chrome/i.test(ua)) browser = 'Safari';

	// OS
	let operatingSystem = 'Unknown';
	if (/windows nt/i.test(ua)) operatingSystem = 'Windows';
	else if (/(iphone|ipad|ipod)/i.test(ua)) operatingSystem = 'iOS';
	else if (/android/i.test(ua)) operatingSystem = 'Android';
	else if (/mac os x/i.test(ua)) operatingSystem = 'macOS';
	else if (/linux/i.test(ua)) operatingSystem = 'Linux';

	return { deviceType, browser, operatingSystem };
}

export async function recordVisit(urlId, ip, userAgent, referrer) {
	const { deviceType, browser, operatingSystem } = parseUserAgent(userAgent);

	// Clean the raw IP for storage
	let cleanIp = (ip || '').split(',')[0].trim().replace(/^::ffff:/, '') || null;

	// In development, if IP is loopback/local, fallback to a public IP to make geolocation testing interactive
	if (process.env.NODE_ENV !== 'production' && (!cleanIp || /^(127\.|::1|localhost)/i.test(cleanIp))) {
		cleanIp = '103.208.69.1'; // Pune, India IP
	}

	let country = null;
	let region = null;
	let city = null;

	if (cleanIp) {
		try {
			const geo = geoip.lookup(cleanIp);
			if (geo) {
				country = geo.country || null;
				region = geo.region || null;
				city = geo.city || null;
			}
		} catch (err) {
			logger.warn('[ANALYTICS]', 'Geoip Lookup Failed', { error: err.message });
		}
	}

	logger.info('[ANALYTICS]', 'Device Classified', { deviceType, browser, operatingSystem });
	logger.info('[ANALYTICS]', 'Visit Captured', { urlId, ip: cleanIp, referrer, country, city });

	const visit = await prisma.visit.create({
		data: {
			urlId,
			deviceType,
			browser,
			operatingSystem,
			ipAddress: cleanIp,
			referrer: referrer || null,
			country,
			region,
			city
		}
	});

	return visit;
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

	const [totalClickCount, recentVisitHistory, timeline, deviceGroups, browserGroups, countryGroups] = await Promise.all([
		getClickCount(queryWhere),
		getRecentVisits(queryWhere),
		getTimeline(queryWhere),
		prisma.visit.groupBy({
			by: ['deviceType'],
			where: queryWhere,
			_count: { _all: true },
			orderBy: { _count: { deviceType: 'desc' } }
		}),
		prisma.visit.groupBy({
			by: ['browser'],
			where: queryWhere,
			_count: { _all: true },
			orderBy: { _count: { browser: 'desc' } }
		}),
		prisma.visit.groupBy({
			by: ['country'],
			where: queryWhere,
			_count: { _all: true },
			orderBy: { _count: { country: 'desc' } },
			take: 10
		})
	]);

	const deviceSummary = {};
	for (const g of deviceGroups) {
		deviceSummary[g.deviceType || 'Unknown'] = g._count._all;
	}

	const browserSummary = {};
	for (const g of browserGroups) {
		browserSummary[g.browser || 'Unknown'] = g._count._all;
	}

	const locationSummary = {
		countries: countryGroups
			.filter(g => g.country)
			.map(g => ({ name: g.country, count: g._count._all }))
	};

	return {
		totalClickCount,
		lastVisitedTime: getLastVisitTime(recentVisitHistory),
		recentVisitHistory,
		timeline,
		deviceSummary,
		browserSummary,
		locationSummary
	};
}
