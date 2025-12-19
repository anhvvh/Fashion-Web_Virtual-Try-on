import { ValidationError } from '../utils/app_error.js';

export const validate = (schema) => {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      throw new ValidationError('Validation failed', errors);
    }

    req.validatedData = result.data;
    next();
  };
};

