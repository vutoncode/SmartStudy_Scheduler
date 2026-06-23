import { useScheduleStore } from '../store/scheduleStore';
import { getDaysRemaining } from '../utils/dateUtils';

export const useGoals = () => {
  const {
    goals,
    subjects,
    loading,
    error,
    addGoal,
    updateGoal,
    deleteGoal,
    toggleGoalTask,
    updateSubjectTarget
  } = useScheduleStore();

  // Aggregate completion status
  const totalGoals = goals.length;
  const completedGoals = goals.filter(g => g.status === 'completed').length;
  const inProgressGoals = goals.filter(g => g.status === 'in_progress');
  
  // Overdue check
  const overdueGoals = goals.filter(g => {
    if (g.status === 'completed') return false;
    return getDaysRemaining(g.dueDate) < 0;
  });

  // Calculate task completions overall
  const totalTasks = goals.reduce((acc, g) => acc + (g.tasks?.length || 0), 0);
  const completedTasks = goals.reduce((acc, g) => acc + (g.tasks?.filter(t => t.completed).length || 0), 0);
  const taskCompletionPercentage = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100) 
    : 0;

  return {
    goals,
    subjects,
    loading,
    error,
    addGoal,
    updateGoal,
    deleteGoal,
    toggleGoalTask,
    updateSubjectTarget,
    // Analytics
    totalGoals,
    completedGoals,
    inProgressGoals,
    overdueGoals,
    taskCompletionPercentage,
    completedTasks,
    totalTasks
  };
};

export default useGoals;
