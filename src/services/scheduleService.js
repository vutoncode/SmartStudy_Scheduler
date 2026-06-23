import api from './api';

export const scheduleService = {
  getSessions: async () => {
    const response = await api.get('/sessions');
    return response.data;
  },

  createSession: async (sessionData) => {
    const response = await api.post('/sessions', sessionData);
    return response.data;
  },

  updateSession: async (id, sessionData) => {
    const response = await api.put(`/sessions/${id}`, sessionData);
    return response.data;
  },

  deleteSession: async (id) => {
    const response = await api.delete(`/sessions/${id}`);
    return response.data;
  },

  checkIn: async (id, checkInData) => {
    const response = await api.post(`/sessions/${id}/checkin`, checkInData);
    return response.data;
  }
};

export default scheduleService;
