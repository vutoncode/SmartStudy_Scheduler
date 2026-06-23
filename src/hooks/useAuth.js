import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const { user, token, isAuthenticated, loading, error, login, register, logout, updateProfile, clearError } = useAuthStore();

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    clearError
  };
};

export default useAuth;
