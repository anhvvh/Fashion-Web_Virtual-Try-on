import { Router } from 'express';
import authRoutes from './auth_routes.js';

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

// TODO: Add user routes
// router.use('/user', userRoutes);

export default router;

