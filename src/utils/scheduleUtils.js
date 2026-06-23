import { combineDateAndTime } from './dateUtils';

// Checks if two sessions overlap on the same day
export const checkOverlap = (session1, session2) => {
  if (session1.date !== session2.date) return false;
  if (session1.id && session2.id && session1.id === session2.id) return false; // same session

  const start1 = combineDateAndTime(session1.date, session1.startTime).getTime();
  const end1 = start1 + session1.duration * 60000;

  const start2 = combineDateAndTime(session2.date, session2.startTime).getTime();
  const end2 = start2 + session2.duration * 60000;

  return start1 < end2 && start2 < end1;
};

// Validates whether a proposed session overlaps with any existing sessions
export const hasOverlap = (newSession, existingSessions) => {
  return existingSessions.some(session => checkOverlap(newSession, session));
};

// Suggest an available study slot of a specific duration on a given date
// Scans from 08:00 to 22:00 to find the first slot that does not overlap with existing sessions
export const suggestStudySlot = (date, durationMinutes, existingSessions) => {
  const daySessions = existingSessions.filter(s => s.date === date);
  
  // Potential start hours to scan (from 08:00 to 20:00)
  const scanTimes = [
    '08:00', '09:00', '10:00', '11:00', '13:00', '14:00', 
    '15:00', '16:00', '17:00', '19:00', '20:00', '21:00'
  ];

  for (const time of scanTimes) {
    const candidate = { date, startTime: time, duration: durationMinutes };
    if (!hasOverlap(candidate, daySessions)) {
      return time;
    }
  }
  return '08:00'; // Fallback to 8 AM
};

// Calculate learning metrics based on completed sessions
export const calculateStats = (sessions, goals = [], targetWeeklyHours = 24) => {
  const completed = sessions.filter(s => s.status === 'completed');
  
  const totalMinutes = completed.reduce((sum, s) => sum + (s.actualDuration || s.duration), 0);
  const totalHours = parseFloat((totalMinutes / 60).toFixed(1));
  
  // Calculate average focus rating (efficiency index)
  const ratedSessions = completed.filter(s => s.focusRating > 0);
  const avgFocus = ratedSessions.length > 0 
    ? parseFloat((ratedSessions.reduce((sum, s) => sum + s.focusRating, 0) / ratedSessions.length).toFixed(1))
    : 0;

  // Calculate subject breakdown
  const subjectBreakdown = {};
  completed.forEach(s => {
    if (!subjectBreakdown[s.subjectId]) {
      subjectBreakdown[s.subjectId] = 0;
    }
    subjectBreakdown[s.subjectId] += (s.actualDuration || s.duration);
  });

  // Convert breakdown to hours
  Object.keys(subjectBreakdown).forEach(subId => {
    subjectBreakdown[subId] = parseFloat((subjectBreakdown[subId] / 60).toFixed(1));
  });

  // Target completion percent
  const completionRate = targetWeeklyHours > 0 
    ? Math.min(Math.round((totalHours / targetWeeklyHours) * 100), 100) 
    : 0;

  return {
    totalHours,
    avgFocus,
    subjectBreakdown,
    completionRate,
    completedCount: completed.length,
    scheduledCount: sessions.filter(s => s.status === 'scheduled').length
  };
};

// Recommend the next study session from a list of sessions
export const getNextSession = (sessions) => {
  const today = new Date();
  const scheduled = sessions.filter(s => s.status === 'scheduled');
  
  if (scheduled.length === 0) return null;

  // Sort by date and startTime
  return [...scheduled].sort((a, b) => {
    const timeA = combineDateAndTime(a.date, a.startTime).getTime();
    const timeB = combineDateAndTime(b.date, b.startTime).getTime();
    return timeA - timeB;
  })[0];
};
