import { Router } from 'express';
import { authController } from '../controllers/auth_controller.js';
import { validateRegister, validateLogin } from '../middlewares/validation.js';

const router = Router();

router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);

export default router;

