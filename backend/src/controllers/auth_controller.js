import { sendSuccess } from '../utils/response.js';
import { HTTP_STATUS } from '../config/constants.js';
import { authService } from '../services/auth_service.js';

export const authController = {
  async register(req, res, next) {
    try {
      const { email, password } = req.validatedData;

      const result = await authService.register({ email, password });

      return sendSuccess(res, result, HTTP_STATUS.CREATED);
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.validatedData;

      const user = await authService.login({ email, password });

      return sendSuccess(res, user);
    } catch (error) {
      next(error);
    }
  },
};

