import { useScheduleStore } from '../store/scheduleStore';
import { useUiStore } from '../store/uiStore';
import { getCurrentWeekDates, formatDateString } from '../utils/dateUtils';

export const useProgress = () => {
  const { sessions, subjects } = useScheduleStore();
  const { settings } = useUiStore();

  // 1. Calculate Streak
  const getStreak = () => {
    const completedDates = sessions
      .filter((s) => s.status === 'completed')
      .map((s) => s.date);
    
    if (completedDates.length === 0) return 0;

    const uniqueDates = Array.from(new Set(completedDates)).sort(
      (a, b) => new Date(b) - new Date(a)
    ); // Descending order (newest first)

    const todayStr = formatDateString(new Date());
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = formatDateString(yesterday);

    // If today is not studied and yesterday is not studied, streak is broken/0
    if (!uniqueDates.includes(todayStr) && !uniqueDates.includes(yesterdayStr)) {
      return 0;
    }

    let streak = 0;
    let currentCheck = new Date(uniqueDates.includes(todayStr) ? todayStr : yesterdayStr);

    while (true) {
      const checkStr = formatDateString(currentCheck);
      if (uniqueDates.includes(checkStr)) {
        streak++;
        // Go back one day
        currentCheck.setDate(currentCheck.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  };

  const streakCount = getStreak();

  // 2. Weekly Chart Data (Target vs Actual)
  const getWeeklyChartData = () => {
    const weekDates = getCurrentWeekDates();
    const completed = sessions.filter((s) => s.status === 'completed');
    const scheduled = sessions.filter((s) => s.status === 'scheduled');

    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return weekDates.map((dateObj, index) => {
      const dateStr = formatDateString(dateObj);
      const isTodayDate = dateStr === formatDateString(new Date());

      // Sum actual completed duration
      const dayCompletedMinutes = completed
        .filter((s) => s.date === dateStr)
        .reduce((sum, s) => sum + (s.actualDuration || s.duration), 0);

      // Sum scheduled duration
      const dayScheduledMinutes = scheduled
        .filter((s) => s.date === dateStr)
        .reduce((sum, s) => sum + s.duration, 0);

      return {
        name: dayNames[index],
        fullDate: dateStr,
        // Convert to hours
        Actual: parseFloat((dayCompletedMinutes / 60).toFixed(1)),
        Scheduled: parseFloat((dayScheduledMinutes / 60).toFixed(1)),
        Target: parseFloat((settings.dailyTargetHours || 4).toFixed(1)),
        isToday: isTodayDate
      };
    });
  };

  // 3. Subject Distribution Data (Pie Chart format)
  const getSubjectPieData = () => {
    const completed = sessions.filter((s) => s.status === 'completed');
    const totals = {};

    completed.forEach((s) => {
      if (!totals[s.subjectId]) totals[s.subjectId] = 0;
      totals[s.subjectId] += s.actualDuration || s.duration;
    });

    return Object.keys(totals).map((subId) => {
      const subjectObj = subjects.find((sub) => sub.id === subId);
      return {
        name: subjectObj ? subjectObj.name : subId,
        value: parseFloat((totals[subId] / 60).toFixed(1)), // Hours
        color: subjectObj ? subjectObj.color : '#cbd5e1'
      };
    }).filter(item => item.value > 0);
  };

  // 4. Learning efficiency metrics
  const completed = sessions.filter((s) => s.status === 'completed');
  const rated = completed.filter((s) => s.focusRating > 0);
  const avgFocusRating = rated.length > 0
    ? parseFloat((rated.reduce((sum, s) => sum + s.focusRating, 0) / rated.length).toFixed(1))
    : 0;

  const totalStudyMinutes = completed.reduce((sum, s) => sum + (s.actualDuration || s.duration), 0);
  const totalStudyHours = parseFloat((totalStudyMinutes / 60).toFixed(1));

  return {
    streakCount,
    weeklyChartData: getWeeklyChartData(),
    subjectPieData: getSubjectPieData(),
    totalStudyHours,
    avgFocusRating,
    completedSessionsCount: completed.length
  };
};

export default useProgress;
