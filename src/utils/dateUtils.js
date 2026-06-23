// Format Date to standard YYYY-MM-DD
export const formatDateString = (date) => {
  const d = new Date(date);
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
};

// Format Date to user-friendly Vietnamese or standard string (e.g., "Thứ Hai, 21/06")
export const formatFriendlyDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const options = { weekday: 'long', day: '2-digit', month: '2-digit' };
  return date.toLocaleDateString('vi-VN', options);
};

// Format Date to short string (e.g., "21 Jun")
export const formatShortDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
};

// Get list of dates in the current week (Monday to Sunday) relative to a given date
export const getCurrentWeekDates = (currentDate = new Date()) => {
  const startOfWeek = new Date(currentDate);
  // Get day index (0 for Sun, 1 for Mon, ..., 6 for Sat)
  const day = startOfWeek.getDay();
  // Adjust to make Monday the first day (1)
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); 
  
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0);

  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const nextDate = new Date(startOfWeek);
    nextDate.setDate(startOfWeek.getDate() + i);
    weekDates.push(nextDate);
  }
  return weekDates;
};

// Format minutes to custom format (e.g., 90 -> "1h 30m" or "1.5h")
export const formatDuration = (minutes) => {
  if (!minutes || isNaN(minutes)) return '0m';
  const hrs = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  if (hrs > 0) {
    return `${hrs}h${mins > 0 ? ` ${mins}m` : ''}`;
  }
  return `${mins}m`;
};

// Calculate number of days remaining until a deadline
export const getDaysRemaining = (dueDateString) => {
  if (!dueDateString) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDateString);
  due.setHours(0, 0, 0, 0);
  
  const diffTime = due - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Combine a Date object and time string ("HH:MM") to a full Date object
export const combineDateAndTime = (dateString, timeString) => {
  const [hours, minutes] = timeString.split(':').map(Number);
  const date = new Date(dateString);
  date.setHours(hours, minutes, 0, 0);
  return date;
};

// Format time range (e.g. "08:00 - 09:30")
export const formatTimeRange = (startTime, durationMinutes) => {
  if (!startTime) return '';
  const [hours, minutes] = startTime.split(':').map(Number);
  const startDate = new Date();
  startDate.setHours(hours, minutes, 0, 0);
  
  const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
  const endHours = String(endDate.getHours()).padStart(2, '0');
  const endMinutes = String(endDate.getMinutes()).padStart(2, '0');
  
  return `${startTime} - ${endHours}:${endMinutes}`;
};

// Checks if a given date string is today
export const isToday = (dateString) => {
  const today = formatDateString(new Date());
  return dateString === today;
};
