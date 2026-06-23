import { useUiStore } from '../store/uiStore';
import { useScheduleStore } from '../store/scheduleStore';
import { combineDateAndTime, formatDateString } from '../utils/dateUtils';

export const useNotifications = () => {
  const { notifications, settings, addNotification, markAsRead, markAllAsRead, clearNotifications } = useUiStore();
  const { sessions } = useScheduleStore();

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Scan for upcoming sessions to trigger notifications
  const checkUpcomingSessions = () => {
    if (!settings.enableReminders) return;

    const now = new Date();
    const todayStr = formatDateString(now);
    const todaySessions = sessions.filter(
      (s) => s.date === todayStr && s.status === 'scheduled'
    );

    todaySessions.forEach((session) => {
      const sessionStart = combineDateAndTime(session.date, session.startTime);
      const diffMs = sessionStart - now;
      const diffMins = Math.floor(diffMs / 60000);

      // Check if session starts within reminder minutes (e.g. exactly 15 mins or near)
      const minutesThreshold = settings.reminderMinutesBefore || 15;
      
      // We check if session is upcoming in the next few minutes and hasn't been notified
      const notificationIdKey = `notified_session_${session.id}`;
      const alreadyNotified = localStorage.getItem(notificationIdKey);

      if (diffMins > 0 && diffMins <= minutesThreshold && !alreadyNotified) {
        addNotification(
          `Phiên học sắp tới: "${session.title}" sẽ bắt đầu sau ${diffMins} phút!`,
          'warning'
        );
        localStorage.setItem(notificationIdKey, 'true');

        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Smart Study Scheduler', {
            body: `"${session.title}" sắp bắt đầu sau ${diffMins} phút. Chuẩn bị học nhé!`,
            icon: '/logo.jpg'
          });
        }
      }
    });
  };

  // Request browser desktop notification permissions
  const requestDesktopPermission = async () => {
    if (!('Notification' in window)) return false;
    if (Notification.permission === 'granted') return true;
    
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  };

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    checkUpcomingSessions,
    requestDesktopPermission,
    desktopPermissionStatus: typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'unsupported'
  };
};

export default useNotifications;
