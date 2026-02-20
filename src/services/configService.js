import api from './api';

export const configService = {
  // Get all configs
  getAllConfigs: async () => {
    const response = await api.get('/configs');
    return response.data;
  },

  // Get config for specific service and environment
  getConfig: async (serviceName, environment) => {
    const response = await api.get(`/configs/${serviceName}/${environment}`);
    return response.data;
  },

  // Get version history for service and environment
  getConfigHistory: async (serviceName, environment) => {
    const response = await api.get(`/configs/${serviceName}/${environment}/history`);
    return response.data;
  },

  // Upload new config
  uploadConfig: async (formData) => {
    const response = await api.post('/configs/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Activate a config version
  activateConfig: async (configId) => {
    const response = await api.put(`/configs/${configId}/activate`);
    return response.data;
  },

  // Delete a config version
  deleteConfig: async (configId) => {
    const response = await api.delete(`/configs/${configId}`);
    return response.data;
  },

  // Get dashboard stats
  getDashboardStats: async () => {
    const response = await api.get('/configs/stats');
    return response.data;
  },
  // configService.js
  getConfigById: async (id) => {
    const response = await api.get(`/configs/${id}`);
    return response.data;
  }
};

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  signup: async (name, email, password) => {
    const response = await api.post('/auth/saveUser', {
      name,
      email,
      password
    });
    return response.data;
  },
};