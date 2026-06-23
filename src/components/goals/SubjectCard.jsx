import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { Edit2, Check, Clock } from 'lucide-react';
import useGoals from '../../hooks/useGoals';
import useSchedule from '../../hooks/useSchedule';

export const SubjectCard = ({ subject }) => {
  const { updateSubjectTarget } = useGoals();
  const { sessions } = useSchedule();
  const [isEditing, setIsEditing] = useState(false);
  const [newTarget, setNewTarget] = useState(subject.weeklyTargetHours || 0);

  const IconComponent = Icons[subject.icon] || Icons.BookOpen;

  const getSubjectCompletedHours = () => {
    const completed = sessions.filter(
      (s) => s.subjectId === subject.id && s.status === 'completed'
    );
    const mins = completed.reduce((sum, s) => sum + (s.actualDuration || s.duration), 0);
    return parseFloat((mins / 60).toFixed(1));
  };

  const completedHours = getSubjectCompletedHours();
  const targetHours = subject.weeklyTargetHours || 0;
  
  const progressPercent = targetHours > 0 
    ? Math.min(Math.round((completedHours / targetHours) * 100), 100) 
    : 0;

  const handleSaveTarget = () => {
    const val = parseFloat(newTarget);
    if (!isNaN(val) && val >= 0) {
      updateSubjectTarget(subject.id, val);
      setIsEditing(false);
    }
  };

  return (
    <div className="card shadow-sm border border-light p-3 bg-white" style={{ borderRadius: '10px' }}>
      {/* Header Info */}
      <div className="d-flex items-center justify-content-between">
        <div className="d-flex align-items-center gap-2.5">
          <div 
            className="p-2 rounded d-flex align-items-center justify-content-center"
            style={{ backgroundColor: `${subject.color}15`, border: `1px solid ${subject.color}30` }}
          >
            <IconComponent size={18} style={{ color: subject.color }} />
          </div>
          <div>
            <h5 className="mb-0 font-weight-bold text-dark" style={{ fontSize: '13px' }}>{subject.name}</h5>
            <span className="text-muted tracking-wider text-uppercase" style={{ fontSize: '9px' }}>Môn học tuần</span>
          </div>
        </div>

        {/* Target Editing */}
        {isEditing ? (
          <div className="d-flex align-items-center gap-1">
            <input
              type="number"
              min="0"
              max="168"
              step="0.5"
              value={newTarget}
              onChange={(e) => setNewTarget(e.target.value)}
              className="form-control px-2 py-0.5"
              style={{ width: '60px', height: '24px', fontSize: '11px' }}
              autoFocus
            />
            <button
              onClick={handleSaveTarget}
              className="btn btn-sm btn-success p-0.5 d-flex align-items-center justify-content-center cursor-pointer text-white"
              style={{ width: '20px', height: '20px' }}
            >
              <Check size={10} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="btn btn-link p-0 text-muted hover:text-primary transition-colors cursor-pointer"
            title="Sửa số giờ mục tiêu tuần"
          >
            <Edit2 size={11} />
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="d-flex align-items-center justify-content-between text-xs mt-3 mb-1.5" style={{ fontSize: '12px' }}>
        <span className="text-muted d-flex align-items-center gap-1">
          <Clock size={12} /> Tích lũy:
        </span>
        <span className="font-weight-bold text-dark">
          {completedHours} giờ <span className="text-muted">/ {targetHours} giờ</span>
        </span>
      </div>

      {/* Bootstrap Progress Bar */}
      <div className="progress" style={{ height: '6px', borderRadius: '4px' }}>
        <div
          className="progress-bar"
          role="progressbar"
          style={{
            width: `${progressPercent}%`,
            backgroundColor: subject.color
          }}
          aria-valuenow={progressPercent}
          aria-valuemin="0"
          aria-valuemax="100"
        />
      </div>

      {/* Progress label */}
      <div className="d-flex justify-content-between items-center mt-1 text-muted" style={{ fontSize: '10px' }}>
        <span>Độ hoàn thành</span>
        <span className="font-weight-bold">{progressPercent}%</span>
      </div>
    </div>
  );
};

export default SubjectCard;
