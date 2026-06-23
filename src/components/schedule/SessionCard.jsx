import React from 'react';
import { Play, Check, Trash2, Clock, Edit } from 'lucide-react';
import { formatTimeRange, formatDuration } from '../../utils/dateUtils';
import { SUBJECTS } from '../../utils/constants';
import useUiStore from '../../store/uiStore';
import useSchedule from '../../hooks/useSchedule';

export const SessionCard = ({ session }) => {
  const { openModal } = useUiStore();
  const { deleteSession } = useSchedule();

  const subject = SUBJECTS.find((s) => s.id === session.subjectId) || {
    name: 'Tổng quát',
    color: '#94a3b8'
  };

  const isCompleted = session.status === 'completed';

  const handleDelete = (e) => {
    e.stopPropagation();
    if (confirm(`Bạn có chắc chắn muốn xóa phiên học "${session.title}" không?`)) {
      deleteSession(session.id);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    openModal('editSession', session);
  };

  const handleCheckIn = (e) => {
    e.stopPropagation();
    openModal('checkIn', session);
  };

  return (
    <div
      onClick={() => !isCompleted && openModal('editSession', session)}
      className="card p-2 border border-light bg-light hover-bg-white cursor-pointer select-none transition-all"
      style={{
        borderLeft: `3px solid ${subject.color} !important`,
        borderRadius: '8px',
        fontSize: '11px'
      }}
    >
      {/* Session Title */}
      <h5 className="font-weight-bold text-dark mb-0 leading-tight text-truncate" style={{ fontSize: '11px' }}>
        {session.title}
      </h5>

      {/* Subject Tag */}
      <span className="font-weight-semibold text-xxs mt-0.5" style={{ color: subject.color, fontSize: '9px' }}>
        {subject.name}
      </span>

      {/* Time & Duration */}
      <div className="d-flex align-items-center gap-1 mt-1.5 text-muted" style={{ fontSize: '9px' }}>
        <Clock size={10} className="stroke-[1.8]" />
        <span>{formatTimeRange(session.startTime, session.duration)}</span>
      </div>

      {/* Completed Status / Rating */}
      {isCompleted ? (
        <div className="d-flex align-items-center justify-content-between mt-2 pt-1 border-top border-light">
          <span className="text-success font-weight-bold d-flex align-items-center gap-0.5" style={{ fontSize: '9px' }}>
            <Check size={9} className="stroke-[2.5]" /> Đã xong
          </span>
          {session.focusRating > 0 && (
            <div className="d-flex align-items-center text-warning" style={{ gap: '1px' }}>
              {Array.from({ length: session.focusRating }).map((_, i) => (
                <span key={i} style={{ fontSize: '9px' }}>★</span>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Action buttons */
        <div className="d-flex align-items-center justify-content-end gap-1.5 mt-2 pt-1.5 border-top border-light">
          <button
            onClick={handleDelete}
            className="btn btn-link p-0 text-muted hover:text-danger d-flex align-items-center cursor-pointer"
            title="Xóa phiên học"
          >
            <Trash2 size={11} />
          </button>
          <button
            onClick={handleEdit}
            className="btn btn-link p-0 text-muted hover:text-primary d-flex align-items-center cursor-pointer"
            title="Chỉnh sửa chi tiết"
          >
            <Edit size={11} />
          </button>
          <button
            onClick={handleCheckIn}
            className="btn btn-xs btn-primary font-weight-bold d-flex align-items-center justify-content-center px-1.5 py-0.5 cursor-pointer text-white"
            style={{ fontSize: '8px', borderRadius: '4px' }}
            title="Báo cáo hoàn thành phiên học"
          >
            <Play size={6} className="fill-white mr-0.5" /> Báo cáo
          </button>
        </div>
      )}
    </div>
  );
};

export default SessionCard;
