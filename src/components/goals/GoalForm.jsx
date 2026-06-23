import React, { useState } from 'react';
import { Plus, Trash2, Milestone, Calendar, BookOpen, Layers } from 'lucide-react';
import Button from '../ui/Button';
import { SUBJECTS } from '../../utils/constants';
import { validateGoalForm } from '../../utils/validators';

export const GoalForm = ({ onSubmit, initialData = null, loading = false }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [subjectId, setSubjectId] = useState(initialData?.subjectId || SUBJECTS[0].id);
  const [targetHours, setTargetHours] = useState(initialData?.targetHours || 5);
  const [dueDate, setDueDate] = useState(initialData?.dueDate || '');
  const [subtasks, setSubtasks] = useState(initialData?.tasks || []);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [errors, setErrors] = useState({});

  const handleAddSubtask = () => {
    if (newSubtaskTitle.trim() === '') return;
    const taskObj = {
      id: 't-' + Date.now() + Math.random().toString(36).substr(2, 5),
      title: newSubtaskTitle.trim(),
      completed: false
    };
    setSubtasks([...subtasks, taskObj]);
    setNewSubtaskTitle('');
  };

  const handleRemoveSubtask = (id) => {
    setSubtasks(subtasks.filter((t) => t.id !== id));
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    const formErrors = validateGoalForm(title, subjectId, targetHours, dueDate);
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const payload = {
      title: title.trim(),
      subjectId,
      targetHours: parseFloat(targetHours),
      dueDate,
      tasks: subtasks
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmitForm} className="d-flex flex-column gap-3 text-secondary">
      {/* Title */}
      <div className="form-group">
        <label htmlFor="goalTitle" className="form-label d-flex align-items-center gap-1.5 font-weight-bold text-dark text-xs mb-1.5">
          <Milestone size={13} className="text-primary" /> Tiêu đề mục tiêu
        </label>
        <input
          id="goalTitle"
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
          }}
          placeholder="Ví dụ: Làm chủ Tích phân xác định, Đọc 3 bài nghiên cứu khoa học"
          className={`form-control ${errors.title ? 'is-invalid' : ''}`}
          required
        />
        {errors.title && <div className="invalid-feedback d-block">{errors.title}</div>}
      </div>

      {/* Grid */}
      <div className="row g-3">
        {/* Subject */}
        <div className="col-12 col-md-6 form-group">
          <label htmlFor="goalSubject" className="form-label d-flex align-items-center gap-1.5 font-weight-bold text-dark text-xs mb-1.5">
            <BookOpen size={13} className="text-primary" /> Liên kết môn học
          </label>
          <select
            id="goalSubject"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            className="form-select"
          >
            {SUBJECTS.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>

        {/* Due Date */}
        <div className="col-12 col-md-6 form-group">
          <label htmlFor="goalDueDate" className="form-label d-flex align-items-center gap-1.5 font-weight-bold text-dark text-xs mb-1.5">
            <Calendar size={13} className="text-primary" /> Hạn chót hoàn thành (Deadline)
          </label>
          <input
            id="goalDueDate"
            type="date"
            value={dueDate}
            onChange={(e) => {
              setDueDate(e.target.value);
              if (errors.dueDate) setErrors((prev) => ({ ...prev, dueDate: '' }));
            }}
            className={`form-control ${errors.dueDate ? 'is-invalid' : ''}`}
            required
          />
          {errors.dueDate && <div className="invalid-feedback d-block">{errors.dueDate}</div>}
        </div>
      </div>

      {/* Checklist tasks */}
      <div className="form-group">
        <label className="form-label d-flex align-items-center gap-1.5 font-weight-bold text-dark text-xs mb-1.5">
          <Layers size={13} className="text-primary" /> Danh sách công việc con (Checklist)
        </label>
        
        <div className="input-group">
          <input
            type="text"
            value={newSubtaskTitle}
            onChange={(e) => setNewSubtaskTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddSubtask();
              }
            }}
            placeholder="Nhập nội dung công việc và ấn nút '+' hoặc nhấn Enter..."
            className="form-control"
          />
          <button 
            type="button" 
            className="btn btn-outline-primary d-flex align-items-center justify-content-center cursor-pointer" 
            onClick={handleAddSubtask}
          >
            <Plus size={16} />
          </button>
        </div>

        {/* List of subtasks */}
        <div className="mt-2.5 overflow-auto custom-scrollbar list-group" style={{ maxHeight: '150px' }}>
          {subtasks.length === 0 ? (
            <p className="text-center text-muted italic p-3 border rounded bg-light" style={{ fontSize: '11px' }}>
              Chưa có công việc nào được thêm. Hãy chia nhỏ mục tiêu của bạn để dễ theo dõi tiến độ.
            </p>
          ) : (
            subtasks.map((task) => (
              <div 
                key={task.id} 
                className="list-group-item d-flex align-items-center justify-content-between p-2"
                style={{ fontSize: '12px' }}
              >
                <span className="text-dark">{task.title}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSubtask(task.id)}
                  className="btn btn-link p-0 text-danger text-decoration-none cursor-pointer"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-3">
        <Button type="submit" variant="primary" loading={loading} className="w-100 py-2.5 font-weight-bold">
          {initialData ? 'Lưu thay đổi mục tiêu' : 'Tạo mục tiêu học tập'}
        </Button>
      </div>
    </form>
  );
};

export default GoalForm;
