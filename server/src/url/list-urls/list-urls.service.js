import prisma from '../../config/db.js';
import logger from '../../utils/logger.js';

export async function getUserUrlsService(userId) {
	const urls = await prisma.url.findMany({
		where: { userId },
		select: {
			id: true,
			originalUrl: true,
			shortCode: true,
			startDate: true,
			expiresAt: true,
			createdAt: true,
			_count: {
				select: {
					visits: true,
				},
			},
		},
		orderBy: {
			createdAt: 'desc',
		},
	});

	const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
	logger.success('[URL]', 'User URLs Retrieved', { userId, totalUrls: urls.length });

	return {
		urls: urls.map((url) => ({
			id: url.id,
			originalUrl: url.originalUrl,
			shortCode: url.shortCode,
			shortUrl: `${baseUrl}/${url.shortCode}`,
			startDate: url.startDate ?? null,
			expiresAt: url.expiresAt ?? null,
			createdAt: url.createdAt,
			totalClicks: url._count.visits,
		})),
	};
}
