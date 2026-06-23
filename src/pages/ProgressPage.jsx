import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip,
} from 'recharts';
import { Award, Clock, Star, Calendar, BookOpen, MessageSquareQuote } from 'lucide-react';
import useProgress from '../hooks/useProgress';
import useSchedule from '../hooks/useSchedule';
import WeeklyChart from '../components/progress/WeeklyChart';
import { SUBJECTS } from '../utils/constants';
import { formatDuration, formatFriendlyDate } from '../utils/dateUtils';

export const ProgressPage = () => {
  const { 
    totalStudyHours, 
    avgFocusRating, 
    subjectPieData, 
    completedSessionsCount 
  } = useProgress();

  const { sessions } = useSchedule();

  const completedSessions = [...sessions]
    .filter((s) => s.status === 'completed')
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const getMostFocusedSubject = () => {
    if (subjectPieData.length === 0) return 'Chưa có';
    const sorted = [...subjectPieData].sort((a, b) => b.value - a.value);
    return sorted[0].name;
  };

  const mostFocusedSub = getMostFocusedSubject();

  const getAvgSessionDuration = () => {
    const completed = sessions.filter((s) => s.status === 'completed');
    if (completed.length === 0) return '0 phút';
    
    const sum = completed.reduce((acc, s) => acc + (s.actualDuration || s.duration), 0);
    return formatDuration(Math.round(sum / completed.length));
  };

  const avgDuration = getAvgSessionDuration();

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div 
          className="p-2.5 rounded border border-light shadow flex flex-col gap-0.5 text-xs"
          style={{ background: '#ffffff' }}
        >
          <span className="font-weight-bold text-dark">{data.name}</span>
          <span className="text-primary font-weight-semibold">{data.value} giờ học</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* Analytics stats row */}
      <div className="row g-3">
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card shadow-sm border border-light p-3 bg-white d-flex flex-row align-items-center gap-3" style={{ borderRadius: '10px' }}>
            <div className="p-2.5 rounded bg-primary-subtle text-primary"><Clock size={18} /></div>
            <div>
              <small className="text-muted text-uppercase tracking-wider font-weight-bold" style={{ fontSize: '9px' }}>Tổng giờ tự học</small>
              <h5 className="font-weight-bold text-dark mb-0">{totalStudyHours} giờ</h5>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card shadow-sm border border-light p-3 bg-white d-flex flex-row align-items-center gap-3" style={{ borderRadius: '10px' }}>
            <div className="p-2.5 rounded bg-info-subtle text-info"><Star size={18} className="fill-info" /></div>
            <div>
              <small className="text-muted text-uppercase tracking-wider font-weight-bold" style={{ fontSize: '9px' }}>Độ tập trung</small>
              <h5 className="font-weight-bold text-dark mb-0">{avgFocusRating} / 5</h5>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card shadow-sm border border-light p-3 bg-white d-flex flex-row align-items-center gap-3" style={{ borderRadius: '10px' }}>
            <div className="p-2.5 rounded bg-warning-subtle text-warning"><BookOpen size={18} /></div>
            <div>
              <small className="text-muted text-uppercase tracking-wider font-weight-bold" style={{ fontSize: '9px' }}>Môn học ưu tiên</small>
              <h5 className="font-weight-bold text-dark mb-0 text-truncate" style={{ maxWidth: '140px' }}>{mostFocusedSub}</h5>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card shadow-sm border border-light p-3 bg-white d-flex flex-row align-items-center gap-3" style={{ borderRadius: '10px' }}>
            <div className="p-2.5 rounded bg-success-subtle text-success"><Award size={18} /></div>
            <div>
              <small className="text-muted text-uppercase tracking-wider font-weight-bold" style={{ fontSize: '9px' }}>Thời lượng trung bình</small>
              <h5 className="font-weight-bold text-dark mb-0">{avgDuration}</h5>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="row g-4">
        {/* Weekly Analysis */}
        <div className="col-12 col-lg-8">
          <div className="card shadow-sm border border-light p-4 bg-white" style={{ borderRadius: '10px' }}>
            <div className="pb-2 mb-3 border-bottom border-light">
              <h5 className="font-weight-bold text-dark mb-0" style={{ fontSize: '14px' }}>Phân tích thời gian tự học</h5>
              <small className="text-muted" style={{ fontSize: '11px' }}>Biểu đồ so sánh số giờ học thực tế hàng tuần</small>
            </div>
            <WeeklyChart />
          </div>
        </div>

        {/* Pie chart subject allocation */}
        <div className="col-12 col-lg-4">
          <div className="card shadow-sm border border-light p-4 bg-white h-100 d-flex flex-column" style={{ borderRadius: '10px' }}>
            <div className="pb-2 mb-3 border-bottom border-light">
              <h5 className="font-weight-bold text-dark mb-0" style={{ fontSize: '14px' }}>Phân bổ thời gian môn học</h5>
              <small className="text-muted" style={{ fontSize: '11px' }}>Tỷ lệ phần trăm thời gian tự học</small>
            </div>

            <div className="flex-grow-1 d-flex flex-column justify-content-center min-h-[220px]">
              {subjectPieData.length === 0 ? (
                <small className="text-center text-muted italic p-3">Chưa có nhật ký ghi nhận để thống kê tỷ lệ.</small>
              ) : (
                <div className="w-100 h-56 relative d-flex align-items-center justify-content-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={subjectPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {subjectPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomPieTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center stats */}
                  <div className="position-absolute d-flex flex-column align-items-center justify-content-center">
                    <span className="h4 font-weight-black text-dark mb-0" style={{ fontWeight: '700' }}>{completedSessionsCount}</span>
                    <span className="text-muted uppercase font-weight-bold" style={{ fontSize: '9px', tracking: '1px' }}>Phiên học</span>
                  </div>
                </div>
              )}
            </div>

            {/* simple legend */}
            <div className="d-flex flex-wrap gap-2.5 mt-2 justify-content-center text-muted" style={{ fontSize: '10px' }}>
              {subjectPieData.map((entry, idx) => (
                <div key={idx} className="d-flex align-items-center gap-1">
                  <div className="rounded-circle" style={{ width: '6px', height: '6px', backgroundColor: entry.color }} />
                  <span>{entry.name} ({entry.value}h)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Completed session reflection logs */}
      <div className="card shadow-sm border border-light p-4 bg-white" style={{ borderRadius: '10px' }}>
        <div className="pb-2 mb-3 border-bottom border-light">
          <h5 className="font-weight-bold text-dark mb-0" style={{ fontSize: '14px' }}>Nhật ký & Phản hồi hoạt động</h5>
          <small className="text-muted" style={{ fontSize: '11px' }}>Nhật ký và ý kiến đóng góp từ các phiên học đã hoàn thành</small>
        </div>

        <div className="d-flex flex-column gap-3 overflow-auto pr-1" style={{ maxHeight: '350px' }}>
          {completedSessions.length === 0 ? (
            <small className="text-center text-muted italic p-4 border rounded bg-light">
              Chưa có nhật ký học tập nào được ghi nhận. Hãy báo cáo hoàn thành phiên học tại lịch tuần.
            </small>
          ) : (
            completedSessions.map((session) => {
              const subjectObj = SUBJECTS.find(s => s.id === session.subjectId) || { name: 'Tổng quát', color: '#cbd5e1' };
              return (
                <div 
                  key={session.id} 
                  className="p-3 border border-light bg-light rounded d-flex flex-column gap-2"
                >
                  <div className="d-flex align-items-start justify-content-between flex-wrap gap-2">
                    <div className="d-flex flex-column">
                      <h6 className="font-weight-bold text-dark mb-0" style={{ fontSize: '12px' }}>{session.title}</h6>
                      <span className="font-weight-bold" style={{ color: subjectObj.color, fontSize: '9px' }}>
                        {subjectObj.name}
                      </span>
                    </div>
                    
                    {/* Log details */}
                    <div className="d-flex align-items-center gap-3 text-muted" style={{ fontSize: '11px' }}>
                      <span className="d-flex align-items-center gap-1">
                        <Calendar size={11} /> {formatFriendlyDate(session.date)}
                      </span>
                      <span className="badge bg-white text-secondary border border-light-subtle">
                        {formatDuration(session.actualDuration || session.duration)}
                      </span>
                      {session.focusRating > 0 && (
                        <div className="d-flex align-items-center text-warning" style={{ gap: '1px' }}>
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <span 
                              key={idx} 
                              style={{ 
                                fontSize: '12px',
                                color: idx < session.focusRating ? 'var(--color-warning)' : '#cbd5e1'
                              }}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Notes reflection paragraph */}
                  {session.notes ? (
                    <div 
                      className="p-2.5 rounded bg-white border border-light-subtle text-secondary d-flex items-start gap-2 leading-relaxed" 
                      style={{ fontSize: '11px' }}
                    >
                      <MessageSquareQuote size={13} className="text-primary mt-0.5 flex-shrink-0" />
                      <p className="mb-0 italic">"{session.notes}"</p>
                    </div>
                  ) : (
                    <small className="text-muted italic" style={{ fontSize: '10px' }}>Chưa lưu ghi chú nào cho phiên học này.</small>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
