import axios from 'axios';
import { LOCAL_STORAGE_KEYS, SUBJECTS } from '../utils/constants';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const getStored = (key) => JSON.parse(localStorage.getItem(key));
const setStored = (key, data) => localStorage.setItem(key, JSON.stringify(data));

const initMockDB = () => {
  // Clear old records once to reset database to empty
  if (!localStorage.getItem('smart_study_empty_v1')) {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.SUBJECTS);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.SESSIONS);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.GOALS);
    localStorage.setItem('smart_study_empty_v1', 'true');
  }

  // 1. Subjects Setup
  if (!localStorage.getItem(LOCAL_STORAGE_KEYS.SUBJECTS)) {
    const subjectsWithTargets = SUBJECTS.map(s => ({
      ...s,
      weeklyTargetHours: 2
    }));
    setStored(LOCAL_STORAGE_KEYS.SUBJECTS, subjectsWithTargets);
  }

  // 2. Scheduled Sessions Setup
  if (!localStorage.getItem(LOCAL_STORAGE_KEYS.SESSIONS)) {
    setStored(LOCAL_STORAGE_KEYS.SESSIONS, []);
  }

  // 3. Goals Setup
  if (!localStorage.getItem(LOCAL_STORAGE_KEYS.GOALS)) {
    setStored(LOCAL_STORAGE_KEYS.GOALS, []);
  }
};

initMockDB();

const createMockResponse = (data, status = 200) => {
  return {
    data,
    status,
    statusText: 'OK',
    headers: {},
    config: {}
  };
};

api.defaults.adapter = async (config) => {
  await new Promise(resolve => setTimeout(resolve, 250));

  const { url, method, data: rawData } = config;
  const parsedData = rawData ? JSON.parse(rawData) : null;

  try {
    // AUTH LOGIC
    if (url.includes('/auth/login')) {
      const { email } = parsedData;
      const user = {
        id: 'user-1',
        name: email.split('@')[0].toUpperCase(),
        email: email,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`
      };
      return createMockResponse({
        token: 'mock-jwt-token-string',
        user
      });
    }

    if (url.includes('/auth/register')) {
      const { name, email } = parsedData;
      const user = {
        id: 'user-' + Date.now(),
        name,
        email,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`
      };
      return createMockResponse({
        token: 'mock-jwt-token-string',
        user
      });
    }

    if (url.includes('/auth/logout')) {
      return createMockResponse({ message: 'Success' });
    }

    // SESSIONS LOGIC
    if (url.match(/\/sessions$/)) {
      if (method === 'get') {
        return createMockResponse(getStored(LOCAL_STORAGE_KEYS.SESSIONS) || []);
      }
      if (method === 'post') {
        const list = getStored(LOCAL_STORAGE_KEYS.SESSIONS) || [];
        const newSession = {
          ...parsedData,
          id: 's-' + Date.now(),
          status: 'scheduled'
        };
        list.push(newSession);
        setStored(LOCAL_STORAGE_KEYS.SESSIONS, list);
        return createMockResponse(newSession, 21);
      }
    }

    const sessionDetailMatch = url.match(/\/sessions\/([a-zA-Z0-9\-]+)$/);
    if (sessionDetailMatch) {
      const id = sessionDetailMatch[1];
      const list = getStored(LOCAL_STORAGE_KEYS.SESSIONS) || [];
      const index = list.findIndex(s => s.id === id);

      if (method === 'put') {
        if (index === -1) return Promise.reject({ response: { status: 404 } });
        const updated = { ...list[index], ...parsedData };
        list[index] = updated;
        setStored(LOCAL_STORAGE_KEYS.SESSIONS, list);
        return createMockResponse(updated);
      }

      if (method === 'delete') {
        if (index === -1) return Promise.reject({ response: { status: 404 } });
        const filtered = list.filter(s => s.id !== id);
        setStored(LOCAL_STORAGE_KEYS.SESSIONS, filtered);
        return createMockResponse({ id, deleted: true });
      }
    }

    const checkinMatch = url.match(/\/sessions\/([a-zA-Z0-9\-]+)\/checkin$/);
    if (checkinMatch) {
      const id = checkinMatch[1];
      const list = getStored(LOCAL_STORAGE_KEYS.SESSIONS) || [];
      const index = list.findIndex(s => s.id === id);
      if (index === -1) return Promise.reject({ response: { status: 404 } });

      const updated = {
        ...list[index],
        status: 'completed',
        focusRating: parsedData.focusRating,
        actualDuration: parsedData.actualDuration || list[index].duration,
        notes: parsedData.notes || ''
      };

      list[index] = updated;
      setStored(LOCAL_STORAGE_KEYS.SESSIONS, list);
      return createMockResponse(updated);
    }

    // GOALS LOGIC
    if (url.match(/\/goals$/)) {
      if (method === 'get') {
        return createMockResponse(getStored(LOCAL_STORAGE_KEYS.GOALS) || []);
      }
      if (method === 'post') {
        const list = getStored(LOCAL_STORAGE_KEYS.GOALS) || [];
        const newGoal = {
          ...parsedData,
          id: 'g-' + Date.now(),
          status: 'in_progress',
          tasks: parsedData.tasks || []
        };
        list.push(newGoal);
        setStored(LOCAL_STORAGE_KEYS.GOALS, list);
        return createMockResponse(newGoal, 201);
      }
    }

    const goalDetailMatch = url.match(/\/goals\/([a-zA-Z0-9\-]+)$/);
    if (goalDetailMatch) {
      const id = goalDetailMatch[1];
      const list = getStored(LOCAL_STORAGE_KEYS.GOALS) || [];
      const index = list.findIndex(g => g.id === id);

      if (method === 'put') {
        if (index === -1) return Promise.reject({ response: { status: 404 } });
        const updated = { ...list[index], ...parsedData };
        list[index] = updated;
        setStored(LOCAL_STORAGE_KEYS.GOALS, list);
        return createMockResponse(updated);
      }

      if (method === 'delete') {
        if (index === -1) return Promise.reject({ response: { status: 404 } });
        const filtered = list.filter(g => g.id !== id);
        setStored(LOCAL_STORAGE_KEYS.GOALS, filtered);
        return createMockResponse({ id, deleted: true });
      }
    }

    // SUBJECTS LOGIC
    if (url.match(/\/subjects$/)) {
      if (method === 'get') {
        return createMockResponse(getStored(LOCAL_STORAGE_KEYS.SUBJECTS) || []);
      }
    }

    const subjectDetailMatch = url.match(/\/subjects\/([a-zA-Z0-9\-]+)$/);
    if (subjectDetailMatch) {
      const id = subjectDetailMatch[1];
      const list = getStored(LOCAL_STORAGE_KEYS.SUBJECTS) || [];
      const index = list.findIndex(s => s.id === id);

      if (method === 'put') {
        if (index === -1) return Promise.reject({ response: { status: 404 } });
        const updated = { ...list[index], ...parsedData };
        list[index] = updated;
        setStored(LOCAL_STORAGE_KEYS.SUBJECTS, list);
        return createMockResponse(updated);
      }
    }

    console.warn(`Simulated backend unhandled route: [${method}] ${url}`);
    return Promise.reject({ response: { status: 404, statusText: 'Not Found' } });

  } catch (error) {
    console.error('Simulated Mock DB Error', error);
    return Promise.reject(error);
  }
};

export default api;
