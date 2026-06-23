import React from 'react';
import { useLocation } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import NotificationBell from '../ui/NotificationBell';

export const Topbar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Bảng điều khiển';
      case '/schedule':
        return 'Lịch học tập';
      case '/goals':
        return 'Quản lý mục tiêu & Môn học';
      case '/progress':
        return 'Phân tích hiệu suất học tập';
      case '/settings':
        return 'Cấu hình & Cài đặt hệ thống';
      default:
        return 'Hệ thống lên lịch học tập thông minh';
    }
  };

  const getGreeting = () => {
    if (!user) return 'Chào mừng bạn quay trở lại!';
    const hour = new Date().getHours();
    if (hour < 12) return `Chào buổi sáng, ${user.name}!`;
    if (hour < 18) return `Chào buổi chiều, ${user.name}!`;
    return `Chào buổi tối, ${user.name}!`;
  };

  return (
    <header 
      className="h-16 border-bottom border-light flex-shrink-0 z-3 d-flex align-items-center justify-content-between px-4"
      style={{
        background: '#ffffff'
      }}
    >
      {/* Title & Greeting */}
      <div className="d-flex flex-column">
        <h2 className="h6 font-weight-bold text-dark mb-0" style={{ fontSize: '14px' }}>
          {getPageTitle()}
        </h2>
        <small className="text-muted d-flex align-items-center gap-1.5" style={{ fontSize: '11px' }}>
          <Sparkles size={11} className="text-warning" />
          {getGreeting()} Sẵn sàng tối ưu hiệu suất hôm nay chưa?
        </small>
      </div>

      {/* Right-side Controls */}
      <div className="d-flex align-items-center gap-3">
        {/* Notification Bell */}
        <NotificationBell />

        {/* Mini Profile Indicator */}
        {user && (
          <div className="d-flex align-items-center gap-2.5 pl-3 border-left border-light">
            <div className="d-flex flex-column align-items-end">
              <span className="text-xs font-weight-bold text-dark leading-none" style={{ fontSize: '12px' }}>{user.name}</span>
              <span className="text-muted font-weight-bold" style={{ fontSize: '9px' }}>HỌC VIÊN</span>
            </div>
            <div className="rounded overflow-hidden bg-light border border-light" style={{ width: '32px', height: '32px' }}>
              <img 
                src={user.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=user'} 
                alt="Avatar" 
                className="w-100 h-100 object-cover"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Topbar;
