import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Clock, 
  Flame, 
  Target, 
  CalendarDays, 
  Plus, 
  Sparkles, 
  ChevronRight, 
  GraduationCap,
  ExternalLink,
  Search,
  Languages,
  CalendarDays as GoogleCalendarIcon,
  FolderOpen
} from 'lucide-react';
import useAuth from '../hooks/useAuth';
import useSchedule from '../hooks/useSchedule';
import useProgress from '../hooks/useProgress';
import useGoals from '../hooks/useGoals';
import StatCard from '../components/progress/StatCard';
import StreakBadge from '../components/progress/StreakBadge';
import DeadlineBadge from '../components/goals/DeadlineBadge';
import Button from '../components/ui/Button';
import { getNextSession } from '../utils/scheduleUtils';
import { SUBJECTS } from '../utils/constants';
import { formatTimeRange } from '../utils/dateUtils';
import useUiStore from '../store/uiStore';

export const DashboardPage = () => {
  const { user } = useAuth();
  const { sessions } = useSchedule();
  const { totalStudyHours, avgFocusRating } = useProgress();
  const { goals } = useGoals();
  const navigate = useNavigate();
  const { openModal } = useUiStore();

  const nextSession = getNextSession(sessions);
  const nextSessionSubject = nextSession 
    ? SUBJECTS.find((s) => s.id === nextSession.subjectId) 
    : null;

  const upcomingGoals = [...goals]
    .filter((g) => g.status === 'in_progress')
    .slice(0, 3);

  const googleStudyAids = [
    { name: 'Tìm kiếm Google', desc: 'Tra cứu nhanh khái niệm và tài liệu học tập', url: 'https://www.google.com', icon: Search, color: 'text-primary' },
    { name: 'Lịch Google', desc: 'Đồng bộ bài tập, lịch kiểm tra & phiên học', url: 'https://calendar.google.com', icon: GoogleCalendarIcon, color: 'text-success' },
    { name: 'Ghi chú Google Keep', desc: 'Phác thảo ý tưởng & tạo ghi chú nhắc nhở nhanh', url: 'https://keep.google.com', icon: Sparkles, color: 'text-warning' },
    { name: 'Google Dịch', desc: 'Hỗ trợ dịch thuật văn bản & tra cứu từ vựng ngoại ngữ', url: 'https://translate.google.com', icon: Languages, color: 'text-info' },
    { name: 'Google Drive', desc: 'Truy cập tài liệu học tập & slide bài giảng', url: 'https://drive.google.com', icon: FolderOpen, color: 'text-danger' }
  ];

  return (
    <div className="d-flex flex-column gap-4">
      {/* Welcome Banner */}
      <div 
        className="card shadow-sm border-0 p-4 bg-primary text-white"
        style={{
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #0284c7 0%, #0284c7 100%)'
        }}
      >
        <div className="d-flex align-items-center gap-1.5 text-uppercase tracking-wider font-weight-bold" style={{ fontSize: '10px' }}>
          <Sparkles size={13} className="text-warning fill-warning" />
          Không gian học tập thông minh
        </div>
        <h3 className="h5 font-weight-bold mt-2 mb-1">
          Chào mừng quay trở lại, {user?.name || 'Học viên'}!
        </h3>
        <p className="mb-0 opacity-90" style={{ fontSize: '12px', maxWidth: '650px', lineHeight: '1.5' }}>
          Hệ thống lên lịch học tập thông minh phân tích thời khóa biểu cá nhân, ghi nhận thói quen tập trung và đồng hành cùng bạn đạt được mọi mục tiêu học tập. Tuần này bạn đã tích lũy được <strong className="text-white">{totalStudyHours} giờ học</strong>.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="row g-3">
        <div className="col-12 col-sm-6 col-lg-3">
          <StatCard
            title="Tổng giờ tự học"
            value={`${totalStudyHours}h`}
            subtext="Tổng thời gian học đã ghi nhận"
            icon="Clock"
            color="primary"
          />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <StatCard
            title="Điểm tập trung"
            value={`${avgFocusRating}/5`}
            subtext="Chỉ số tập trung trung bình"
            icon="Star"
            color="accent"
          />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <StatCard
            title="Mục tiêu hoạt động"
            value={goals.filter(g => g.status === 'in_progress').length}
            subtext="Cột mốc đang bám sát"
            icon="Target"
            color="warning"
          />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <StatCard
            title="Hoàn thành tuần"
            value={`${Math.min(Math.round((totalStudyHours / 24) * 100), 100)}%`}
            subtext="So với mục tiêu chuẩn 24h"
            icon="Percent"
            color="success"
          />
        </div>
      </div>

      {/* Layout Grid */}
      <div className="row g-4">
        {/* Left column */}
        <div className="col-12 col-lg-8 d-flex flex-column gap-4">
          {/* Streak Badge */}
          <StreakBadge />

          {/* Next Recommended Session */}
          <div className="card shadow-sm border border-light p-4 bg-white" style={{ borderRadius: '10px' }}>
            <div className="d-flex items-center justify-content-between pb-2 mb-3 border-bottom border-light">
              <div>
                <h5 className="font-weight-bold text-dark mb-0" style={{ fontSize: '14px' }}>Gợi ý phiên học tiếp theo</h5>
                <small className="text-muted" style={{ fontSize: '11px' }}>Phân bổ lịch học thông minh từ trợ lý AI</small>
              </div>
              <Link 
                to="/schedule" 
                className="text-primary hover-text-dark text-decoration-none font-weight-bold d-flex align-items-center gap-0.5"
                style={{ fontSize: '12px' }}
              >
                Xem lịch học <ChevronRight size={14} />
              </Link>
            </div>

            {nextSession ? (
              <div 
                className="card p-3 border border-light flex-row justify-content-between align-items-center flex-wrap gap-3 bg-light"
                style={{
                  borderLeft: `4px solid ${nextSessionSubject?.color || '#a5b4fc'} !important`,
                  borderRadius: '8px'
                }}
              >
                <div className="d-flex flex-column gap-1">
                  <small 
                    className="font-weight-bold text-uppercase tracking-wider" 
                    style={{ color: nextSessionSubject?.color || '#a5b4fc', fontSize: '9px' }}
                  >
                    {nextSessionSubject?.name || 'Tổng quát'}
                  </small>
                  <h6 className="font-weight-bold text-dark mb-0" style={{ fontSize: '13px' }}>{nextSession.title}</h6>
                  <small className="text-muted d-flex align-items-center gap-1.5 mt-1" style={{ fontSize: '11px' }}>
                    <Clock size={11} className="text-muted" />
                    Hôm nay lúc {nextSession.startTime} ({nextSession.duration} phút)
                  </small>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openModal('editSession', nextSession)}
                  >
                    Sửa lịch
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => openModal('checkIn', nextSession)}
                    icon={GraduationCap}
                  >
                    Bắt đầu học
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-5 text-center text-muted d-flex flex-column align-items-center justify-content-center gap-2 border border-dashed border-light rounded">
                <CalendarDays size={24} className="text-muted opacity-50" />
                <span style={{ fontSize: '12px' }}>Không có phiên học nào được lên lịch cho hôm nay. Hãy thêm lịch mới nhé!</span>
                <Button 
                  variant="primary" 
                  size="sm" 
                  onClick={() => openModal('addSession', { date: new Date().toISOString().split('T')[0] })}
                  icon={Plus}
                >
                  Lên lịch ngay
                </Button>
              </div>
            )}
          </div>

          {/* Google Study Tools */}
          <div className="card shadow-sm border border-light p-4 bg-white" style={{ borderRadius: '10px' }}>
            <div className="pb-2 mb-3 border-bottom border-light">
              <h5 className="font-weight-bold text-dark mb-0" style={{ fontSize: '14px' }}>Công cụ hỗ trợ Google</h5>
              <small className="text-muted" style={{ fontSize: '11px' }}>Mở nhanh các công cụ Google ở tab phụ để phục vụ quá trình tự học</small>
            </div>

            <div className="row g-2">
              {googleStudyAids.map((aid) => {
                const AidIcon = aid.icon;
                return (
                  <div key={aid.name} className="col-12 col-md-6">
                    <a
                      href={aid.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="card p-2.5 border border-light bg-light hover-bg-white text-decoration-none d-flex flex-row align-items-start gap-3 h-100 cursor-pointer transition-colors"
                      style={{ borderRadius: '8px' }}
                    >
                      <div className={`p-2 rounded bg-white ${aid.color} d-flex align-items-center justify-content-center`}>
                        <AidIcon size={16} />
                      </div>
                      <div className="min-width-0 flex-grow-1">
                        <div className="d-flex align-items-center justify-content-between">
                          <h6 className="font-weight-bold text-dark mb-0" style={{ fontSize: '12px' }}>{aid.name}</h6>
                          <ExternalLink size={10} className="text-muted opacity-50" />
                        </div>
                        <small className="text-muted text-xxs d-block leading-tight mt-0.5" style={{ fontSize: '10px' }}>{aid.desc}</small>
                      </div>
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column: Goals */}
        <div className="col-12 col-lg-4">
          <div className="card shadow-sm border border-light p-4 bg-white h-100" style={{ borderRadius: '10px' }}>
            <div className="d-flex items-center justify-content-between pb-2 mb-3 border-bottom border-light">
              <div>
                <h5 className="font-weight-bold text-dark mb-0" style={{ fontSize: '14px' }}>Cột mốc học tập</h5>
                <small className="text-muted" style={{ fontSize: '11px' }}>Các mục tiêu gần tới hạn</small>
              </div>
              <Link 
                to="/goals" 
                className="text-primary hover-text-dark text-decoration-none font-weight-bold d-flex align-items-center gap-0.5"
                style={{ fontSize: '12px' }}
              >
                Tất cả <ChevronRight size={14} />
              </Link>
            </div>

            <div className="d-flex flex-column gap-2 overflow-auto" style={{ maxHeight: '450px' }}>
              {upcomingGoals.length === 0 ? (
                <div className="p-4 text-center text-muted d-flex flex-column align-items-center justify-content-center gap-2 border border-dashed border-light rounded">
                  <Target size={20} className="text-muted opacity-50" />
                  <span style={{ fontSize: '11px' }}>Chưa có mục tiêu hoạt động. Hãy tạo mục tiêu mới!</span>
                </div>
              ) : (
                upcomingGoals.map((goal) => {
                  const subject = SUBJECTS.find((s) => s.id === goal.subjectId) || { name: 'Tổng quát', color: '#cbd5e1' };
                  const completed = goal.tasks?.filter((t) => t.completed).length || 0;
                  const total = goal.tasks?.length || 0;
                  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

                  return (
                    <div 
                      key={goal.id} 
                      className="card p-2.5 border border-light bg-light hover-bg-white transition-colors cursor-pointer"
                      onClick={() => navigate('/goals')}
                      style={{ borderRadius: '8px' }}
                    >
                      <div className="d-flex align-items-start justify-content-between gap-2 mb-2">
                        <div className="min-width-0 flex-grow-1">
                          <h6 className="font-weight-bold text-dark mb-0 text-truncate" style={{ fontSize: '12px' }}>{goal.title}</h6>
                          <small className="font-weight-bold" style={{ color: subject.color, fontSize: '9px' }}>
                            {subject.name}
                          </small>
                        </div>
                        <DeadlineBadge dueDate={goal.dueDate} />
                      </div>

                      {/* checklist progress bar */}
                      <div className="d-flex align-items-center gap-2">
                        <div className="progress flex-grow-1" style={{ height: '4px', borderRadius: '2px' }}>
                          <div 
                            className="progress-bar" 
                            role="progressbar"
                            style={{ 
                              width: `${pct}%`, 
                              backgroundColor: subject.color 
                            }}
                          />
                        </div>
                        <span className="text-muted font-weight-bold" style={{ fontSize: '9px' }}>{pct}%</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
