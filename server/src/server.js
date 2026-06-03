import express from 'express';
import dotenv from 'dotenv';
import prisma from './config/db.js';
import authRoutes from './auth/auth.routes.js';
import urlRoutes from './url/url.routes.js';
import { redirectUrl } from './url/url.controller.js';

dotenv.config();

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/urls', urlRoutes);

app.get('/:shortCode', redirectUrl);

app.get('/', async (req, res) => {
  try {
    const userCount = await prisma.user.count();

    res.status(200).json({
      success: true,
      database: 'Connected',
      users: userCount,
      message: 'Backend Running Successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});