import api from './api.js';

export const authService = {
  async register(email, password) {
    const response = await api.post('/auth/register', {
      email,
      password,
    });
    return response;
  },

  async login(email, password) {
    const response = await api.post('/auth/login', {
      email,
      password,
    });
    return response;
  },
};

