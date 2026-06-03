import prisma from '../config/db.js';

export async function recordVisit(urlId) {
	return prisma.visit.create({
		data: {
			urlId
		}
	});
}