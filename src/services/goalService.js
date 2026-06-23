import api from './api';

export const goalService = {
  getGoals: async () => {
    const response = await api.get('/goals');
    return response.data;
  },

  createGoal: async (goalData) => {
    const response = await api.post('/goals', goalData);
    return response.data;
  },

  updateGoal: async (id, goalData) => {
    const response = await api.put(`/goals/${id}`, goalData);
    return response.data;
  },

  deleteGoal: async (id) => {
    const response = await api.delete(`/goals/${id}`);
    return response.data;
  },

  getSubjects: async () => {
    const response = await api.get('/subjects');
    return response.data;
  },

  updateSubject: async (id, subjectData) => {
    const response = await api.put(`/subjects/${id}`, subjectData);
    return response.data;
  }
};

export default goalService;
