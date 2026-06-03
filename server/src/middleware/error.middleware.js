import logger from '../utils/logger.js';

export default function errorMiddleware(err, req, res, next) {
  logger.error('[ERROR]', err.message || 'Internal Server Error', {
    method: req.method,
    route: req.originalUrl,
    stack: err.stack || null
  });

  return res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
}
