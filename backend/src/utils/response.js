export const sendSuccess = (res, data = null, statusCode = 200) => {
  const response = {
    success: true,
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

export const sendError = (res, error) => {
  const statusCode = error.statusCode || 500;
  const response = {
    success: false,
    error: {
      code: error.code || 'INTERNAL_ERROR',
      message: error.message || 'An unexpected error occurred',
    },
  };

  if (error.details) {
    response.error.details = error.details;
  }

  return res.status(statusCode).json(response);
};

