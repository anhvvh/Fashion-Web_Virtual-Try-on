import { AuthorizationError } from '../utils/app_error.js';

export const isAdmin = (req, _res, next) => {
  try {
    if (!req.user) {
      throw new AuthorizationError('Authentication required');
    }

    const userRole = req.user.role;

    if (!userRole || userRole !== 'admin') {
      throw new AuthorizationError('Admin access required');
    }

    next();
  } catch (error) {
    next(error);
  }
};

