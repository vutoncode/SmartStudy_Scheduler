import { create } from 'zustand';
import { LOCAL_STORAGE_KEYS, DEFAULT_SETTINGS } from '../utils/constants';

const loadStoredSettings = () => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
};

export const useUiStore = create((set, get) => ({
  settings: loadStoredSettings(),
  notifications: JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.NOTIFICATIONS)) || [],
  sidebarOpen: true,
  activeModal: null, // { type, data }

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  
  setSidebarOpen: (isOpen) => set({ sidebarOpen: isOpen }),

  updateSettings: (newSettings) => {
    const updated = { ...get().settings, ...newSettings };
    localStorage.setItem(LOCAL_STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    
    // Apply theme class to HTML element
    if (newSettings.theme) {
      if (newSettings.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    
    set({ settings: updated });
  },

  // Modals management
  openModal: (type, data = null) => set({ activeModal: { type, data } }),
  closeModal: () => set({ activeModal: null }),

  // Notifications management
  addNotification: (message, type = 'info') => {
    const newNotif = {
      id: Date.now().toString(),
      message,
      type, // 'info', 'success', 'warning', 'error'
      timestamp: new Date().toISOString(),
      read: false
    };
    
    const updated = [newNotif, ...get().notifications].slice(0, 50); // limit to 50
    localStorage.setItem(LOCAL_STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
    set({ notifications: updated });
  },

  markAsRead: (id) => {
    const updated = get().notifications.map((n) => 
      n.id === id ? { ...n, read: true } : n
    );
    localStorage.setItem(LOCAL_STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
    set({ notifications: updated });
  },

  markAllAsRead: () => {
    const updated = get().notifications.map((n) => ({ ...n, read: true }));
    localStorage.setItem(LOCAL_STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
    set({ notifications: updated });
  },

  clearNotifications: () => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));
    set({ notifications: [] });
  }
}));

// Apply theme on module load
const initialSettings = loadStoredSettings();
if (initialSettings.theme === 'dark') {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

export default useUiStore;
