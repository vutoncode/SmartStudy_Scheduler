import React, { useState } from 'react';
import { Plus, Target, CheckSquare, Square, Trash2, Trophy } from 'lucide-react';
import useGoals from '../hooks/useGoals';
import SubjectCard from '../components/goals/SubjectCard';
import GoalForm from '../components/goals/GoalForm';
import DeadlineBadge from '../components/goals/DeadlineBadge';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { SUBJECTS } from '../utils/constants';

export const GoalsPage = () => {
  const {
    goals,
    subjects,
    addGoal,
    deleteGoal,
    toggleGoalTask,
    totalGoals,
    completedGoals,
    inProgressGoals,
    completedTasks,
    totalTasks,
    taskCompletionPercentage
  } = useGoals();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreateGoal = async (payload) => {
    setLoading(true);
    const success = await addGoal(payload);
    setLoading(false);
    if (success) {
      setIsAddModalOpen(false);
    }
  };

  const handleDelete = (id, title) => {
    if (confirm(`Bạn có chắc chắn muốn xóa mục tiêu học tập "${title}" không?`)) {
      deleteGoal(id);
    }
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* Subjects section */}
      <div className="d-flex flex-column gap-3">
        <div className="d-flex flex-wrap align-items-end justify-content-between gap-3">
          <div>
            <h5 className="font-weight-bold text-dark mb-0" style={{ fontSize: '15px' }}>Quản lý mục tiêu Môn học</h5>
            <small className="text-muted" style={{ fontSize: '11px' }}>Cấu hình giờ học mục tiêu tuần và theo dõi tiến độ hoàn thành</small>
          </div>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => setIsAddModalOpen(true)}
            icon={Plus}
          >
            Thêm mục tiêu
          </Button>
        </div>
        
        {/* Subject Grid */}
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-3">
          {subjects.map((sub) => (
            <div key={sub.id} className="col">
              <SubjectCard subject={sub} />
            </div>
          ))}
        </div>
      </div>

      {/* Main goals section */}
      <div className="row g-4 mt-1">
        {/* Active Goals checklist */}
        <div className="col-12 col-lg-8 d-flex flex-column gap-3">
          <div>
            <h5 className="font-weight-bold text-dark mb-0" style={{ fontSize: '15px' }}>Mục tiêu đang thực hiện & Checklist</h5>
            <small className="text-muted" style={{ fontSize: '11px' }}>Chia nhỏ các mục tiêu lớn và tích hoàn thành các phần việc con</small>
          </div>

          <div className="d-flex flex-column gap-3">
            {inProgressGoals.length === 0 ? (
              <div className="p-5 text-center text-muted d-flex flex-column align-items-center justify-content-center gap-2 border border-dashed border-light rounded bg-white">
                <Target size={30} className="text-muted opacity-50" />
                <span style={{ fontSize: '12px' }}>Bạn chưa có mục tiêu hoạt động nào. Hãy tạo một mục tiêu mới để bám sát nhé!</span>
              </div>
            ) : (
              inProgressGoals.map((goal) => {
                const subject = SUBJECTS.find((s) => s.id === goal.subjectId) || { name: 'Tổng quát', color: '#cbd5e1' };
                const tasks = goal.tasks || [];
                const tasksDone = tasks.filter((t) => t.completed).length;
                const progressPct = tasks.length > 0 ? Math.round((tasksDone / tasks.length) * 100) : 0;

                return (
                  <div key={goal.id} className="card shadow-sm border border-light p-4 bg-white" style={{ borderRadius: '10px' }}>
                    {/* Goal Header */}
                    <div className="d-flex items-start justify-content-between gap-3 pb-2.5 mb-3 border-bottom border-light">
                      <div className="d-flex flex-column leading-tight min-width-0">
                        <small className="font-weight-bold text-uppercase tracking-wider" style={{ color: subject.color, fontSize: '9px' }}>
                          {subject.name}
                        </small>
                        <h6 className="font-weight-bold text-dark mb-0 text-truncate" style={{ fontSize: '13px' }}>{goal.title}</h6>
                      </div>
                      
                      <div className="d-flex align-items-center gap-2 flex-shrink-0">
                        <DeadlineBadge dueDate={goal.dueDate} />
                        <button
                          onClick={() => handleDelete(goal.id, goal.title)}
                          className="btn btn-link p-0 text-muted hover:text-danger d-flex align-items-center cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Subtasks checklist */}
                    <div className="d-flex flex-column gap-2 mb-2">
                      <small className="text-muted text-uppercase tracking-wider font-weight-bold" style={{ fontSize: '9px' }}>Checklist công việc con</small>
                      <div className="d-flex flex-column gap-1.5 mt-1">
                        {tasks.length === 0 ? (
                          <small className="text-muted italic pl-1" style={{ fontSize: '11px' }}>Không có công việc con.</small>
                        ) : (
                          tasks.map((task) => (
                            <div 
                              key={task.id}
                              onClick={() => toggleGoalTask(goal.id, task.id)}
                              className="d-flex align-items-start gap-2.5 p-2 rounded bg-light border border-light cursor-pointer select-none transition-colors"
                              style={{ fontSize: '12px' }}
                            >
                              <button
                                type="button"
                                className="btn btn-link p-0 text-muted hover:text-primary mt-0.5 cursor-pointer"
                              >
                                {task.completed ? (
                                  <CheckSquare size={14} className="text-primary" />
                                ) : (
                                  <Square size={14} />
                                )}
                              </button>
                              <span className={task.completed ? 'text-decoration-line-through text-muted' : 'text-dark'}>
                                {task.title}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Progress details */}
                    <div className="d-flex align-items-center gap-3 mt-3 pt-2.5 border-top border-light">
                      <div className="progress flex-grow-1" style={{ height: '5px', borderRadius: '2.5px' }}>
                        <div 
                          className="progress-bar" 
                          role="progressbar"
                          style={{ width: `${progressPct}%`, backgroundColor: subject.color }}
                        />
                      </div>
                      <span className="text-muted font-weight-bold" style={{ fontSize: '11px' }}>{progressPct}%</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right column: Stats & Completed */}
        <div className="col-12 col-lg-4 d-flex flex-column gap-4">
          {/* Goals Stats */}
          <div className="card shadow-sm border border-light p-4 bg-white" style={{ borderRadius: '10px' }}>
            <div className="pb-2 mb-3 border-bottom border-light">
              <h5 className="font-weight-bold text-dark mb-0" style={{ fontSize: '14px' }}>Tổng quan mục tiêu</h5>
              <small className="text-muted" style={{ fontSize: '11px' }}>Thống kê mức độ hoàn thành</small>
            </div>

            <div className="d-flex flex-column gap-3 py-1" style={{ fontSize: '12px' }}>
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-muted">Tổng số mục tiêu:</span>
                <strong className="text-dark">{totalGoals}</strong>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-muted">Đã hoàn thành:</span>
                <strong className="text-success">{completedGoals}</strong>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-muted">Nhiệm vụ con hoàn thành:</span>
                <strong className="text-dark">
                  {completedTasks} <span className="text-muted">/ {totalTasks}</span>
                </strong>
              </div>

              {/* Progress gauge */}
              <div className="flex-column gap-1.5 mt-2 pt-3 border-top border-light">
                <div className="d-flex justify-content-between font-weight-bold text-muted mb-1.5">
                  <span>Tiến độ hoàn thành</span>
                  <span>{taskCompletionPercentage}%</span>
                </div>
                <div className="progress" style={{ height: '6px', borderRadius: '3px' }}>
                  <div 
                    className="progress-bar bg-primary" 
                    role="progressbar"
                    style={{ width: `${taskCompletionPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Recently Completed Goals */}
          <div className="card shadow-sm border border-light p-4 bg-white" style={{ borderRadius: '10px' }}>
            <div className="pb-2 mb-3 border-bottom border-light">
              <h5 className="font-weight-bold text-dark mb-0" style={{ fontSize: '14px' }}>Mục tiêu đã hoàn thành</h5>
              <small className="text-muted" style={{ fontSize: '11px' }}>Cột mốc vinh danh</small>
            </div>

            <div className="d-flex flex-column gap-2 overflow-auto" style={{ maxHeight: '200px' }}>
              {goals.filter(g => g.status === 'completed').length === 0 ? (
                <small className="text-muted italic text-center p-3">Các mục tiêu đã hoàn thành sẽ xuất hiện tại đây.</small>
              ) : (
                goals.filter(g => g.status === 'completed').map((goal) => (
                  <div 
                    key={goal.id} 
                    className="p-2.5 rounded border border-light bg-light d-flex align-items-center justify-content-between gap-3"
                    style={{ fontSize: '12px' }}
                  >
                    <div className="min-width-0">
                      <h6 className="font-weight-bold text-dark mb-0 text-truncate" style={{ fontSize: '12px' }}>{goal.title}</h6>
                      <small className="text-success font-weight-bold d-flex align-items-center gap-0.5 mt-0.5">
                        <Trophy size={9} /> Đã hoàn thành
                      </small>
                    </div>
                    <button
                      onClick={() => handleDelete(goal.id, goal.title)}
                      className="btn btn-link p-0 text-muted hover:text-danger cursor-pointer"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Goal Form Modal Overlay */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Tạo mục tiêu học tập mới"
          size="md"
        >
          <GoalForm 
            onSubmit={handleCreateGoal} 
            loading={loading}
          />
        </Modal>
      )}
    </div>
  );
};

export default GoalsPage;
