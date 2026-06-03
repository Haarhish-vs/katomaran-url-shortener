import prisma from '../../config/db.js';
import config from '../../config/env.js';
import logger from '../../utils/logger.js';
import QRCode from 'qrcode';

export async function getUserUrlsService(userId) {
	const urls = await prisma.url.findMany({
		where: { userId },
		select: {
			id: true,
			originalUrl: true,
			shortCode: true,
			startDate: true,
			expiresAt: true,
			isPasswordProtected: true,
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

	const baseUrl = config.baseUrl;
	logger.success('[URL]', 'User URLs Retrieved', { userId, totalUrls: urls.length });

	const urlsWithQr = await Promise.all(
		urls.map(async (url) => {
			const shortUrl = `${baseUrl}/${url.shortCode}`;
			const qrCode = await QRCode.toDataURL(shortUrl);
			return {
				id: url.id,
				originalUrl: url.originalUrl,
				shortCode: url.shortCode,
				shortUrl,
				qrCode,
				startDate: url.startDate ?? null,
				expiresAt: url.expiresAt ?? null,
				isPasswordProtected: url.isPasswordProtected,
				createdAt: url.createdAt,
				totalClicks: url._count.visits,
			};
		})
	);

	return {
		urls: urlsWithQr,
	};
}
