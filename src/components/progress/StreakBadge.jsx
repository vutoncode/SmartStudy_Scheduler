import React from 'react';
import { Flame, Trophy } from 'lucide-react';
import useProgress from '../../hooks/useProgress';

export const StreakBadge = () => {
  const { streakCount } = useProgress();

  const getStreakMessage = () => {
    if (streakCount === 0) return 'Hãy bắt đầu học hôm nay để kích hoạt chuỗi học tập nhé!';
    if (streakCount <= 2) return 'Khởi đầu tuyệt vời! Hãy duy trì đà tiến bộ này nhé!';
    if (streakCount <= 5) return 'Kiên trì & Kỷ luật! Hãy tiếp tục nỗ lực mỗi ngày nhé!';
    return 'Trạng thái học cực đỉnh! Hiệu suất tuyệt vời không thể cản phá!';
  };

  return (
    <div className="card shadow-sm border border-light p-3 bg-white" style={{ borderRadius: '10px' }}>
      <div className="d-flex align-items-center justify-content-between gap-3">
        <div className="d-flex align-items-center gap-3">
          {/* Flame Icon */}
          <div 
            className={`
              p-2.5 rounded d-flex align-items-center justify-content-center
              ${streakCount > 0 
                ? 'bg-warning text-white shadow-sm' 
                : 'bg-light text-muted border border-light'}
            `}
            style={{ width: '42px', height: '42px' }}
          >
            <Flame size={20} className={streakCount > 0 ? 'fill-white' : ''} />
          </div>

          <div className="d-flex flex-column leading-snug">
            <span className="text-muted text-uppercase tracking-wider font-weight-bold" style={{ fontSize: '9px' }}>Chuỗi học tập liên tục</span>
            <h4 className="text-dark mb-0 font-weight-bold" style={{ fontSize: '15px' }}>
              {streakCount} ngày
            </h4>
            <small className="text-muted mt-0.5" style={{ fontSize: '11px' }}>{getStreakMessage()}</small>
          </div>
        </div>

        {streakCount >= 5 && (
          <div 
            className="p-2 rounded bg-success text-white"
            title="Đã đạt cột mốc xuất sắc!"
          >
            <Trophy size={14} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StreakBadge;
