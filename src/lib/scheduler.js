// scheduler.js
// Thuật toán sắp xếp thứ tự ưu tiên các task

/**
 * Tính điểm ưu tiên (priority score) cho mỗi task.
 * Điểm càng cao, task càng quan trọng.
 * - Quá hạn: +1000
 * - Priority: High (+300), Medium (+200), Low (+100)
 * - Deadline: Càng gần điểm càng cao.
 */
export const calculatePriority = (task) => {
  if (task.status === 'done') return -1; // Đã xong thì điểm thấp nhất

  let score = 0;
  const now = new Date();
  const deadline = task.deadline ? new Date(task.deadline) : null;

  // Tính điểm theo priority
  if (task.priority === 'high') score += 300;
  else if (task.priority === 'medium') score += 200;
  else if (task.priority === 'low') score += 100;

  if (deadline) {
    const hoursToDeadline = (deadline - now) / (1000 * 60 * 60);

    if (hoursToDeadline < 0) {
      // Đã quá hạn
      score += 1000;
    } else if (hoursToDeadline <= 24) {
      // Trong vòng 24h
      score += 500;
    } else if (hoursToDeadline <= 72) {
      // Trong vòng 3 ngày
      score += 200;
    } else {
      // Càng gần deadline càng cộng nhiều điểm (tối đa 100)
      score += Math.max(0, 100 - hoursToDeadline);
    }
  }

  return score;
};

/**
 * Nhận vào danh sách task và trả về danh sách đã được sắp xếp kèm nhãn ưu tiên.
 */
export const scheduleTasks = (tasks) => {
  const scoredTasks = tasks.map((task) => {
    const score = calculatePriority(task);
    
    let label = 'Có thể để sau';
    if (score >= 1000) label = 'Quá hạn!';
    else if (score >= 600) label = 'Khẩn cấp';
    else if (score >= 300) label = 'Nên làm sớm';

    return { ...task, _priorityScore: score, _priorityLabel: label };
  });

  // Sắp xếp giảm dần theo điểm
  return scoredTasks.sort((a, b) => b._priorityScore - a._priorityScore);
};
