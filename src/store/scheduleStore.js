import { create } from 'zustand';
import scheduleService from '../services/scheduleService';
import goalService from '../services/goalService';
import progressService from '../services/progressService';
import { calculateStats } from '../utils/scheduleUtils';

export const useScheduleStore = create((set, get) => ({
  sessions: [],
  goals: [],
  subjects: [],
  loading: false,
  error: null,
  stats: {
    totalHours: 0,
    avgFocus: 0,
    subjectBreakdown: {},
    completionRate: 0,
    completedCount: 0,
    scheduledCount: 0
  },

  fetchInitialData: async () => {
    set({ loading: true, error: null });
    try {
      const [sessionsData, goalsData, subjectsData] = await Promise.all([
        scheduleService.getSessions(),
        goalService.getGoals(),
        goalService.getSubjects()
      ]);
      
      const stats = calculateStats(sessionsData, goalsData);

      set({
        sessions: sessionsData,
        goals: goalsData,
        subjects: subjectsData,
        stats,
        loading: false
      });
    } catch (err) {
      set({ error: 'Failed to load scheduler data', loading: false });
    }
  },

  // Sessions Actions
  addSession: async (sessionData) => {
    set({ loading: true });
    try {
      const newSession = await scheduleService.createSession(sessionData);
      const updatedSessions = [...get().sessions, newSession];
      set({ 
        sessions: updatedSessions,
        stats: calculateStats(updatedSessions, get().goals),
        loading: false 
      });
      return true;
    } catch (err) {
      set({ error: 'Failed to schedule study session', loading: false });
      return false;
    }
  },

  updateSession: async (id, sessionData) => {
    set({ loading: true });
    try {
      const updated = await scheduleService.updateSession(id, sessionData);
      const updatedSessions = get().sessions.map(s => s.id === id ? updated : s);
      set({ 
        sessions: updatedSessions,
        stats: calculateStats(updatedSessions, get().goals),
        loading: false 
      });
      return true;
    } catch (err) {
      set({ error: 'Failed to update study session', loading: false });
      return false;
    }
  },

  deleteSession: async (id) => {
    set({ loading: true });
    try {
      await scheduleService.deleteSession(id);
      const updatedSessions = get().sessions.filter(s => s.id !== id);
      set({ 
        sessions: updatedSessions,
        stats: calculateStats(updatedSessions, get().goals),
        loading: false 
      });
      return true;
    } catch (err) {
      set({ error: 'Failed to delete study session', loading: false });
      return false;
    }
  },

  checkInSession: async (id, checkInData) => {
    set({ loading: true });
    try {
      const updated = await scheduleService.checkIn(id, checkInData);
      const updatedSessions = get().sessions.map(s => s.id === id ? updated : s);
      set({ 
        sessions: updatedSessions,
        stats: calculateStats(updatedSessions, get().goals),
        loading: false 
      });
      return true;
    } catch (err) {
      set({ error: 'Check-in failed', loading: false });
      return false;
    }
  },

  // Goals Actions
  addGoal: async (goalData) => {
    set({ loading: true });
    try {
      const newGoal = await goalService.createGoal(goalData);
      const updatedGoals = [...get().goals, newGoal];
      set({ 
        goals: updatedGoals,
        stats: calculateStats(get().sessions, updatedGoals),
        loading: false 
      });
      return true;
    } catch (err) {
      set({ error: 'Failed to add study goal', loading: false });
      return false;
    }
  },

  updateGoal: async (id, goalData) => {
    set({ loading: true });
    try {
      const updated = await goalService.updateGoal(id, goalData);
      const updatedGoals = get().goals.map(g => g.id === id ? updated : g);
      set({ 
        goals: updatedGoals,
        stats: calculateStats(get().sessions, updatedGoals),
        loading: false 
      });
      return true;
    } catch (err) {
      set({ error: 'Failed to update goal', loading: false });
      return false;
    }
  },

  deleteGoal: async (id) => {
    set({ loading: true });
    try {
      await goalService.deleteGoal(id);
      const updatedGoals = get().goals.filter(g => g.id !== id);
      set({ 
        goals: updatedGoals,
        stats: calculateStats(get().sessions, updatedGoals),
        loading: false 
      });
      return true;
    } catch (err) {
      set({ error: 'Failed to delete goal', loading: false });
      return false;
    }
  },

  toggleGoalTask: async (goalId, taskId) => {
    const goal = get().goals.find(g => g.id === goalId);
    if (!goal) return;

    const updatedTasks = goal.tasks.map(t => 
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    
    // Check if all subtasks are complete
    const isCompleted = updatedTasks.every(t => t.completed);
    const status = isCompleted ? 'completed' : 'in_progress';

    await get().updateGoal(goalId, { tasks: updatedTasks, status });
  },

  // Subject target updating
  updateSubjectTarget: async (subjectId, weeklyTargetHours) => {
    set({ loading: true });
    try {
      const updatedSubject = await goalService.updateSubject(subjectId, { weeklyTargetHours });
      const updatedSubjects = get().subjects.map(s => s.id === subjectId ? updatedSubject : s);
      set({ 
        subjects: updatedSubjects,
        loading: false 
      });
      return true;
    } catch (err) {
      set({ error: 'Failed to update subject settings', loading: false });
      return false;
    }
  }
}));
export default useScheduleStore;
