import { ValidationError } from '../utils/app_error.js';

export const validateRegister = (req, _res, next) => {
  const { email, password, confirmPassword } = req.body;

  if (!email || !password || !confirmPassword) {
    return next(new ValidationError('Email, mật khẩu và xác nhận mật khẩu là bắt buộc'));
  }

  if (typeof email !== 'string' || typeof password !== 'string' || typeof confirmPassword !== 'string') {
    return next(new ValidationError('Dữ liệu đầu vào không hợp lệ'));
  }

  next();
};

export const validateLogin = (req, _res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ValidationError('Email và mật khẩu là bắt buộc'));
  }

  if (typeof email !== 'string' || typeof password !== 'string') {
    return next(new ValidationError('Dữ liệu đầu vào không hợp lệ'));
  }

  next();
};

