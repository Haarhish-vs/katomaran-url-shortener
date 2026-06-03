import prisma from '../../config/db.js';
import logger from '../../utils/logger.js';

export async function deleteUrlService({ id, userId }) {
	if (!id || typeof id !== 'string') {
		logger.warn('[URL]', 'URL Deleted', { userId, id, reason: 'URL ID not found' });
		const err = new Error('URL not found');
		err.statusCode = 404;
		throw err;
	}

	const url = await prisma.url.findUnique({
		where: { id },
		select: {
			id: true,
			userId: true,
			shortCode: true
		}
	});

	if (!url) {
		logger.warn('[URL]', 'URL Deleted', { userId, id, reason: 'URL not found' });
		const err = new Error('URL not found');
		err.statusCode = 404;
		throw err;
	}

	if (url.userId !== userId) {
		logger.warn('[URL]', 'URL Deleted', { userId, id, reason: 'Forbidden' });
		const err = new Error('Forbidden');
		err.statusCode = 403;
		throw err;
	}

	await prisma.$transaction([
		prisma.visit.deleteMany({
			where: { urlId: url.id }
		}),
		prisma.url.delete({
			where: { id: url.id }
		})
	]);

	logger.success('[URL]', 'URL Deleted', { userId, id, shortCode: url.shortCode });

	return {
		id,
		shortCode: url.shortCode
	};
}
