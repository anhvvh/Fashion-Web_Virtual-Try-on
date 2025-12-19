import { Router } from 'express';
import { profileController } from '../controllers/profile_controller.js';
import { authenticate } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';

const router = Router();

router.get('/profile', authenticate, profileController.getProfile);

router.put('/profile', authenticate, upload.single('image'), profileController.updateProfile);

export default router;

