import api from './api';

export const authService = {
  async signup(data: any) {
    const response = await api.post('/auth/signup', data);
    return response.data.data;
  },

  async login(data: any) {
    const response = await api.post('/auth/login', data);
    return response.data.data;
  },

  async getMe() {
    const response = await api.get('/me');
    return response.data.data;
  },
};
