import { create } from 'zustand';
import authService from '../services/authService';
import { LOCAL_STORAGE_KEYS } from '../utils/constants';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_USER)) || null,
  token: localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN) || null,
  isAuthenticated: !!localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN),
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await authService.login(email, password);
      localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN, response.token);
      localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_USER, JSON.stringify(response.user));
      set({ 
        user: response.user, 
        token: response.token, 
        isAuthenticated: true, 
        loading: false 
      });
      return true;
    } catch (err) {
      set({ 
        error: err.response?.data?.message || 'Login failed. Please check your credentials.', 
        loading: false 
      });
      return false;
    }
  },

  register: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await authService.register(name, email, password);
      localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN, response.token);
      localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_USER, JSON.stringify(response.user));
      set({ 
        user: response.user, 
        token: response.token, 
        isAuthenticated: true, 
        loading: false 
      });
      return true;
    } catch (err) {
      set({ 
        error: err.response?.data?.message || 'Registration failed. Try again.', 
        loading: false 
      });
      return false;
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout service call error:', err);
    } finally {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_USER);
      set({ 
        user: null, 
        token: null, 
        isAuthenticated: false,
        error: null 
      });
    }
  },

  updateProfile: (updatedUser) => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_USER, JSON.stringify(updatedUser));
    set({ user: updatedUser });
  },

  clearError: () => set({ error: null })
}));
export default useAuthStore;
