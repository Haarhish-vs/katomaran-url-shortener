import logger from '../../utils/logger.js';

/**
 * Validates startDate and expiresAt date strings.
 *
 * Rules:
 *  - If provided, each value must parse to a valid Date.
 *  - If only expiresAt is provided, it must be in the future.
 *  - If both are provided, expiresAt must be strictly after startDate.
 *
 * @param {{ startDate?: string, expiresAt?: string }} dates
 * @param {{ userId?: string }} context  — for structured logging
 * @throws Error with statusCode 400 on any violation
 */
export function validateDates({ startDate, expiresAt }, context = {}) {
	const now = new Date();

	let parsedStart = null;
	let parsedExpiry = null;

	// ── Validate startDate ────────────────────────────────────────────────────
	if (startDate !== undefined && startDate !== null && startDate !== '') {
		parsedStart = new Date(startDate);
		if (isNaN(parsedStart.getTime())) {
			logger.warn('[EXPIRY]', 'Invalid startDate format', { ...context, startDate });
			const err = new Error('Invalid startDate. Provide a valid ISO date string.');
			err.statusCode = 400;
			throw err;
		}
	}

	// ── Validate expiresAt ────────────────────────────────────────────────────
	if (expiresAt !== undefined && expiresAt !== null && expiresAt !== '') {
		parsedExpiry = new Date(expiresAt);
		if (isNaN(parsedExpiry.getTime())) {
			logger.warn('[EXPIRY]', 'Invalid expiresAt format', { ...context, expiresAt });
			const err = new Error('Invalid expiresAt. Provide a valid ISO date string.');
			err.statusCode = 400;
			throw err;
		}

		// expiresAt must be in the future at the moment of creation
		if (parsedExpiry <= now) {
			logger.warn('[EXPIRY]', 'expiresAt is in the past', { ...context, expiresAt });
			const err = new Error('expiresAt must be a future date.');
			err.statusCode = 400;
			throw err;
		}

		// If startDate is also set, expiresAt must be strictly after it
		if (parsedStart !== null && parsedExpiry <= parsedStart) {
			logger.warn('[EXPIRY]', 'expiresAt is not after startDate', {
				...context,
				startDate,
				expiresAt,
			});
			const err = new Error('Expiry date must be after start date.');
			err.statusCode = 400;
			throw err;
		}
	}

	logger.info('[EXPIRY]', 'Date validation passed', {
		...context,
		hasStartDate: parsedStart !== null,
		hasExpiresAt: parsedExpiry !== null,
	});

	return { parsedStart, parsedExpiry };
}
