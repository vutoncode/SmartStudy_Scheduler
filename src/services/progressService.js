import api from './api';

export const progressService = {
  getProgressStats: async () => {
    // In a real app: const response = await api.get('/progress/stats'); return response.data;
    // For local operations, scheduleStore computes from the session list directly.
    return {
      success: true,
      message: 'Stats sync successful'
    };
  }
};

export default progressService;
