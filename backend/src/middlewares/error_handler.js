import { sendError } from '../utils/response.js';
import { env } from '../config/env.js';
import { ValidationError } from '../utils/app_error.js';

export const errorHandler = (err, _req, res, _next) => {
  if (env.nodeEnv === 'development') {
    console.error('Error:', err);
  }

  if (err.isOperational) {
    return sendError(res, err);
  }

  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return sendError(res, new ValidationError('Kích thước file không được vượt quá 5MB'));
    }
    return sendError(res, new ValidationError(err.message || 'Lỗi khi upload file'));
  }

  if (err.message && err.message.includes('Chỉ chấp nhận file ảnh')) {
    return sendError(res, new ValidationError(err.message));
  }

  const internalError = {
    statusCode: 500,
    code: 'INTERNAL_ERROR',
    message: env.nodeEnv === 'production' ? 'An unexpected error occurred' : err.message,
  };

  return sendError(res, internalError);
};

export const notFoundHandler = (_req, res) => {
  return res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'The requested resource was not found',
    },
  });
};

