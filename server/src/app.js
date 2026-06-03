const express = require('express');

const authRoutes = require('./auth/auth.routes');
const urlRoutes = require('./url/url.routes');
const analyticsRoutes = require('./analytics/analytics.routes');
const notFoundMiddleware = require('./middleware/notFound.middleware');
const errorMiddleware = require('./middleware/error.middleware');

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/urls', urlRoutes);
app.use('/api/analytics', analyticsRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
