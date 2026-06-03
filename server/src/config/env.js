import dotenv from 'dotenv';
dotenv.config();

/**
 * Sanitize an environment variable by stripping surrounding quotes,
 * carriage returns, and newlines. Render passes env values literally,
 * so values like  "https://example.com"  include the quote characters.
 */
function sanitize(raw) {
  return (raw || '').replace(/['"\r\n]/g, '').trim();
}

const config = {
  port: process.env.PORT || 5000,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  redisUrl: process.env.REDIS_URL,

  /** Sanitized frontend URL — safe for HTTP headers and redirects */
  frontendUrl: sanitize(process.env.FRONTEND_URL) || 'http://localhost:5173',

  /** Sanitized base URL for building short link URLs */
  baseUrl: sanitize(process.env.BASE_URL) || `http://localhost:${process.env.PORT || 5000}`,
};

export default config;
