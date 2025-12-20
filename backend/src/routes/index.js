import { Router } from 'express';
import authRoutes from './auth_routes.js';
import userRoutes from './user_routes.js';
import categoriesRoutes from './categories_routes.js';

const router = Router();

// Health check endpoint
router.get('/health', (_req, res) => {
  res.json({
    success: true,
    data: {
      status: 'OK',
      timestamp: new Date().toISOString(),
    },
  });
});

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/categories', categoriesRoutes);

export default router;

