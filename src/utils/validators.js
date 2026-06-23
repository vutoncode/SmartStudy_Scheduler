export const validateEmail = (email) => {
  if (!email) return 'Email là bắt buộc';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Định dạng địa chỉ email không hợp lệ';
  return '';
};

export const validatePassword = (password) => {
  if (!password) return 'Mật khẩu là bắt buộc';
  if (password.length < 6) return 'Mật khẩu phải dài ít nhất 6 ký tự';
  return '';
};

export const validateNotEmpty = (field, fieldName) => {
  if (!field || (typeof field === 'string' && field.trim() === '')) {
    return `${fieldName} không được để trống`;
  }
  return '';
};

export const validateSessionTime = (startTime, duration) => {
  if (!startTime) return 'Thời gian bắt đầu là bắt buộc';
  
  const parsedDuration = parseInt(duration, 10);
  if (isNaN(parsedDuration) || parsedDuration <= 0) {
    return 'Thời lượng phải là số phút dương';
  }
  
  if (parsedDuration > 480) {
    return 'Phiên học không được kéo dài quá 8 giờ (480 phút)';
  }
  
  return '';
};

export const validateGoalForm = (title, subjectId, targetHours, dueDate) => {
  const errors = {};
  
  if (!title || title.trim() === '') errors.title = 'Tiêu đề mục tiêu là bắt buộc';
  if (!subjectId) errors.subjectId = 'Vui lòng chọn môn học';
  
  const hours = parseFloat(targetHours);
  if (isNaN(hours) || hours <= 0) {
    errors.targetHours = 'Số giờ mục tiêu phải là số dương';
  }
  
  if (!dueDate) {
    errors.dueDate = 'Ngày hoàn thành là bắt buộc';
  } else {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(dueDate);
    selected.setHours(0, 0, 0, 0);
    if (selected < today) {
      errors.dueDate = 'Ngày hoàn thành không được ở quá khứ';
    }
  }
  
  return errors;
};
