import { Router } from 'express';
import { authController } from '../controllers/auth_controller.js';
import { validateRegister } from '../middlewares/validation.js';

const router = Router();

router.post('/register', validateRegister, authController.register);

export default router;

