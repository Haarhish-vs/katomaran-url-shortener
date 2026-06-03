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

	const url = await prisma.url.findFirst({
		where: {
			shortCode,
			userId
		},
		select: {
			id: true,
			originalUrl: true,
			shortCode: true,
			createdAt: true,
			visits: {
				select: {
					id: true,
					clickedAt: true
				},
				orderBy: {
					clickedAt: 'desc'
				}
			}
		}
	});

	if (!url) {
		const err = new Error('Analytics not found');
		err.statusCode = 404;
		throw err;
	}

	return {
		url: {
			id: url.id,
			originalUrl: url.originalUrl,
			shortCode: url.shortCode,
			createdAt: url.createdAt
		},
		totalClicks: url.visits.length,
		visits: url.visits
	};
}