import prisma from '../../config/db.js';

export async function getRecentVisits(queryWhere) {
	return prisma.visit.findMany({
		where: queryWhere,
		select: {
			id: true,
			clickedAt: true
		},
		orderBy: {
			clickedAt: 'desc'
		},
		take: 10
	});
}
