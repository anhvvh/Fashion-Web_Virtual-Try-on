import { authService } from '../services/auth_service.js';
import { sendSuccess } from '../utils/response.js';
import { HTTP_STATUS } from '../config/constants.js';

export const authController = {
  async register(req, res, next) {
    try {
      const { email, password, confirmPassword } = req.body;

      const newUser = await authService.register({
        email,
        password,
        confirmPassword,
      });

      return sendSuccess(res, newUser, HTTP_STATUS.CREATED);
    } catch (error) {
      return next(error);
    }
  },
};

