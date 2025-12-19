import api from './api.js';

export const authService = {
  async register(email, password, confirmPassword) {
    const response = await api.post('/auth/register', {
      email,
      password,
      confirmPassword,
    });
    return response.data;
  },
};

