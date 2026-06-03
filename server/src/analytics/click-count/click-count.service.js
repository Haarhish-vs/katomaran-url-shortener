import prisma from '../../config/db.js';

export async function getClickCount(queryWhere) {
	return prisma.visit.count({
		where: queryWhere
	});
}
