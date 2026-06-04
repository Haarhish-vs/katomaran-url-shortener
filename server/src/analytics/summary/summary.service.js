import prisma from '../../config/db.js';
import { buildDateFilter } from '../date-filter/date-filter.service.js';

function isUrlActive(url, now) {
	const notExpired = !url.expiresAt || now < url.expiresAt;
	const isStarted = !url.startDate || now >= url.startDate;
	return notExpired && isStarted;
}

function isUrlExpired(url, now) {
	return Boolean(url.expiresAt && now >= url.expiresAt);
}

export async function getAnalyticsSummary({ userId, range, from, to }) {
	const dateFilter = buildDateFilter({ userId, range, from, to });
	const now = new Date();

	const visitWhere = {
		url: { userId },
		...(Object.keys(dateFilter).length > 0 ? { clickedAt: dateFilter } : {}),
	};

	const [totalClicks, lastVisit, urls] = await Promise.all([
		prisma.visit.count({ where: visitWhere }),
		prisma.visit.findFirst({
			where: visitWhere,
			orderBy: { clickedAt: 'desc' },
			select: { clickedAt: true },
		}),
		prisma.url.findMany({
			where: { userId },
			select: {
				id: true,
				startDate: true,
				expiresAt: true,
				isPasswordProtected: true,
			},
		}),
	]);

	const totalUrls = urls.length;
	let activeUrls = 0;
	let protectedUrls = 0;
	let expiredUrls = 0;

	for (const url of urls) {
		if (url.isPasswordProtected) {
			protectedUrls += 1;
		}
		if (isUrlExpired(url, now)) {
			expiredUrls += 1;
		}
		if (isUrlActive(url, now)) {
			activeUrls += 1;
		}
	}

	return {
		totalClicks,
		totalUrls,
		activeUrls,
		protectedUrls,
		expiredUrls,
		lastVisit: lastVisit?.clickedAt ?? null,
	};
}
