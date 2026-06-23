import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Trash2, AlertTriangle, Info, CheckCircle2, X } from 'lucide-react';
import useNotifications from '../../hooks/useNotifications';

export const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications
  } = useNotifications();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={15} className="text-success mt-1 flex-shrink-0" />;
      case 'warning':
        return <AlertTriangle size={15} className="text-warning mt-1 flex-shrink-0" />;
      case 'error':
        return <X size={15} className="text-danger mt-1 flex-shrink-0" />;
      default:
        return <Info size={15} className="text-primary mt-1 flex-shrink-0" />;
    }
  };

  const formatTime = (isoString) => {
    const diff = Date.now() - new Date(isoString).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} giờ trước`;
    return new Date(isoString).toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="position-relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center border-0 cursor-pointer"
        style={{ width: '38px', height: '38px', position: 'relative' }}
      >
        <Bell size={18} className={`text-muted ${unreadCount > 0 ? 'text-primary' : ''}`} />
        {unreadCount > 0 && (
          <span 
            className="position-absolute translate-middle badge rounded-pill bg-danger border border-white"
            style={{ top: '8px', right: '-8px', fontSize: '9px', padding: '3px 6px' }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div 
          className="position-absolute end-0 mt-2 card shadow-lg border border-light overflow-hidden z-3"
          style={{ width: '300px', borderRadius: '10px' }}
        >
          {/* Header */}
          <div className="card-header bg-light d-flex align-items-center justify-content-between p-3 border-0">
            <span className="font-weight-bold text-dark text-xs mb-0" style={{ fontSize: '13px' }}>Thông báo</span>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="btn btn-link p-0 text-decoration-none text-primary font-weight-bold"
                style={{ fontSize: '11px' }}
              >
                <Check size={11} className="mr-1" /> Đọc tất cả
              </button>
            )}
          </div>

          {/* List group */}
          <div className="list-group list-group-flush overflow-auto" style={{ maxHeight: '250px' }}>
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-muted" style={{ fontSize: '11px' }}>
                <Bell size={20} className="d-block mx-auto mb-2 text-muted opacity-50" />
                Chưa có thông báo nào mới.
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => !notif.read && markAsRead(notif.id)}
                  className={`
                    list-group-item list-group-item-action d-flex gap-2.5 p-3 cursor-pointer
                    ${notif.read ? 'opacity-75' : 'bg-light'}
                  `}
                  style={{ fontSize: '12px' }}
                >
                  {getIcon(notif.type)}
                  <div className="flex-grow-1 min-width-0">
                    <p className="mb-0 text-dark font-weight-normal leading-normal">{notif.message}</p>
                    <small className="text-muted d-block mt-1">
                      {formatTime(notif.timestamp)}
                    </small>
                  </div>
                  {!notif.read && (
                    <div className="align-self-center rounded-circle bg-primary" style={{ width: '6px', height: '6px' }} />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="card-footer bg-light p-2 text-center border-0">
              <button
                onClick={clearNotifications}
                className="btn btn-link p-0 text-decoration-none text-danger font-weight-bold"
                style={{ fontSize: '11px' }}
              >
                <Trash2 size={11} className="mr-1" /> Xóa tất cả thông báo
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
