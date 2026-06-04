import express from 'express';
import prisma from '../../config/db.js';
import logger from '../../utils/logger.js';

const router = express.Router();

// PATCH /api/analytics/visit/:visitId/location
// Called client-side from the HTML redirect page after GPS permission is granted
router.patch('/:visitId/location', async (req, res) => {
	try {
		const { visitId } = req.params;
		const { country, city, region } = req.body || {};

		if (!visitId) {
			return res.status(400).json({ success: false, message: 'Visit ID required' });
		}

		// Only update if at least one location field is present
		if (!country && !city && !region) {
			return res.status(200).json({ success: false, message: 'No location data provided' });
		}

		await prisma.visit.update({
			where: { id: visitId },
			data: {
				...(country ? { country } : {}),
				...(city    ? { city }    : {}),
				...(region  ? { region }  : {})
			}
		});

		logger.info('[ANALYTICS]', 'Location Updated via Browser GPS', { visitId, country, city });

		return res.status(200).json({ success: true });
	} catch (err) {
		// Swallow silently – a failed geo update should never error the redirect flow
		logger.info('[ANALYTICS]', 'Location Update Skipped', { error: err.message });
		return res.status(200).json({ success: false });
	}
});

export default router;
