import { Router } from 'express';

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

// TODO: Add auth routes
// router.use('/auth', authRoutes);

// TODO: Add user routes
// router.use('/user', userRoutes);

export default router;

