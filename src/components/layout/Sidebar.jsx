import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Target, 
  BarChart3, 
  Settings, 
  LogOut, 
  Flame, 
  ExternalLink,
  Search,
  Languages,
  CalendarDays,
  FolderOpen,
  StickyNote
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useProgress from '../../hooks/useProgress';

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const { streakCount } = useProgress();

  const navItems = [
    { to: '/', name: 'Bảng điều khiển', icon: LayoutDashboard },
    { to: '/schedule', name: 'Lịch học tập', icon: Calendar },
    { to: '/goals', name: 'Mục tiêu & Môn học', icon: Target },
    { to: '/progress', name: 'Phân tích hiệu suất', icon: BarChart3 },
    { to: '/settings', name: 'Cài đặt hệ thống', icon: Settings },
  ];

  const googleTools = [
    { name: 'Tìm kiếm Google', url: 'https://www.google.com', icon: Search },
    { name: 'Google Dịch', url: 'https://translate.google.com', icon: Languages },
    { name: 'Lịch Google', url: 'https://calendar.google.com', icon: CalendarDays },
    { name: 'Lưu trữ Google Drive', url: 'https://drive.google.com', icon: FolderOpen },
    { name: 'Ghi chú Google Keep', url: 'https://keep.google.com', icon: StickyNote }
  ];

  return (
    <aside 
      className="w-64 border-end border-light flex flex-col h-screen overflow-auto"
      style={{
        background: '#ffffff'
      }}
    >
      {/* Brand Header with bear logo */}
      <div className="d-flex align-items-center gap-3 px-4 py-3 border-bottom border-light">
        <img 
          src="/logo.jpg" 
          alt="Smart Study Bear Logo" 
          className="rounded-circle bg-light border border-light-subtle p-0.5"
          style={{ width: '42px', height: '42px', objectFit: 'cover' }}
        />
        <div>
          <h1 className="h6 font-weight-bold text-dark mb-0 tracking-wider">
            SmartStudy
          </h1>
          <small className="text-muted tracking-widest uppercase font-weight-bold" style={{ fontSize: '9px' }}>
            Hệ thống học thông minh
          </small>
        </div>
      </div>

      {/* User Info Profile Widget */}
      {user && (
        <div className="px-4 py-3 border-bottom border-light">
          <div className="d-flex align-items-center gap-3">
            <img 
              src={user.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=user'} 
              alt="avatar" 
              className="rounded bg-light border border-light"
              style={{ width: '38px', height: '38px' }}
            />
            <div className="min-width-0 flex-grow-1">
              <h4 className="text-sm font-weight-bold text-dark mb-0 text-truncate" style={{ fontSize: '13px' }}>
                {user.name}
              </h4>
              <small className="text-muted text-truncate d-block" style={{ fontSize: '11px' }}>
                {user.email}
              </small>
            </div>
          </div>
          
          {/* Streak Indicator */}
          <div className="mt-2.5 d-flex align-items-center justify-content-between p-2 rounded" style={{ background: '#f0f9ff', border: '1px solid #e0f2fe' }}>
            <span className="text-muted d-flex align-items-center gap-1.5" style={{ fontSize: '11px' }}>
              <Flame size={12} className="text-warning fill-warning" /> Chuỗi liên tục:
            </span>
            <span className="font-weight-bold text-primary" style={{ fontSize: '11px' }}>
              {streakCount} {streakCount === 1 ? 'ngày' : 'ngày'}
            </span>
          </div>
        </div>
      )}

      {/* Nav Links */}
      <div className="flex-grow-1 px-3 py-4 d-flex flex-col gap-4">
        <div>
          <span className="text-muted font-weight-bold uppercase px-3 d-block mb-2" style={{ fontSize: '9px', tracking: '1px' }}>
            Không gian học tập
          </span>
          <nav className="d-flex flex-column gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}
                >
                  <Icon size={16} className="flex-shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Google Study shortcuts list */}
        <div>
          <span className="text-muted font-weight-bold uppercase px-3 d-block mb-2" style={{ fontSize: '9px', tracking: '1px' }}>
            Công cụ hỗ trợ Google
          </span>
          <nav className="d-flex flex-column gap-1">
            {googleTools.map((tool) => {
              const ToolIcon = tool.icon;
              return (
                <a
                  key={tool.name}
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-link-custom d-flex align-items-center justify-content-between"
                  style={{ fontSize: '13px' }}
                >
                  <div className="d-flex align-items-center gap-2.5">
                    <ToolIcon size={14} className="text-primary opacity-75" />
                    <span>{tool.name}</span>
                  </div>
                  <ExternalLink size={10} className="text-muted opacity-50" />
                </a>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Logout Footer */}
      <div className="p-3 border-top border-light">
        <button
          onClick={logout}
          className="btn btn-outline-danger btn-sm w-full d-flex align-items-center justify-content-center gap-2 py-2 cursor-pointer"
          style={{ fontSize: '13px', borderRadius: '8px' }}
        >
          <LogOut size={14} />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
