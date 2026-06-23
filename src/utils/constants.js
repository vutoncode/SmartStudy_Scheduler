export const SUBJECTS = [
  { id: 'math', name: 'Toán học', color: '#6366f1', icon: 'Calculator' },
  { id: 'physics', name: 'Vật lý', color: '#06b6d4', icon: 'Atom' },
  { id: 'chemistry', name: 'Hóa học', color: '#10b981', icon: 'FlaskConical' },
  { id: 'english', name: 'Tiếng Anh', color: '#a855f7', icon: 'Languages' },
  { id: 'cs', name: 'Tin học', color: '#ec4899', icon: 'Cpu' },
  { id: 'literature', name: 'Ngữ văn', color: '#f59e0b', icon: 'BookOpen' },
  { id: 'biology', name: 'Sinh học', color: '#14b8a6', icon: 'Dna' },
  { id: 'history', name: 'Lịch sử', color: '#f43f5e', icon: 'Hourglass' }
];

export const SESSION_STATUS = {
  SCHEDULED: 'scheduled',
  COMPLETED: 'completed',
  MISSED: 'missed'
};

export const GOAL_STATUS = {
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  OVERDUE: 'overdue'
};

export const LOCAL_STORAGE_KEYS = {
  AUTH_USER: 'smart_study_user',
  AUTH_TOKEN: 'smart_study_token',
  SESSIONS: 'smart_study_sessions',
  GOALS: 'smart_study_goals',
  SUBJECTS: 'smart_study_subjects',
  SETTINGS: 'smart_study_settings',
  NOTIFICATIONS: 'smart_study_notifications'
};

export const DEFAULT_SETTINGS = {
  theme: 'light', // Default to light theme as requested in redesign
  dailyTargetHours: 4,
  weeklyTargetHours: 24,
  defaultSessionDuration: 60, // in minutes
  enableReminders: true,
  reminderMinutesBefore: 15,
  soundEnabled: true
};
