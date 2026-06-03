import prisma from '../config/db.js';

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
		const err = new Error('Analytics not found');
		err.statusCode = 404;
		throw err;
	}

	if (url.userId !== userId) {
		const err = new Error('Forbidden');
		err.statusCode = 403;
		throw err;
	}

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