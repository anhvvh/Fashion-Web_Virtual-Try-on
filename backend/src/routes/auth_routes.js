import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middlewares/validation.js';
import { authController } from '../controllers/auth_controller.js';

const router = Router();

const registerSchema = z.object({
  email: z
    .string()
    .email('Email không hợp lệ')
    .toLowerCase()
    .min(1, 'Email là bắt buộc'),
  password: z
    .string()
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
});

const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ').toLowerCase().min(1, 'Email là bắt buộc'),
  password: z.string().min(1, 'Mật khẩu là bắt buộc'),
});

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);

export default router;

