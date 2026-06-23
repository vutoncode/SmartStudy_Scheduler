import React, { useState } from 'react';
import { User, Bell, Settings, Eye, CheckCircle2, Moon, Sun, Volume2, VolumeX } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import useUiStore from '../store/uiStore';
import Button from '../components/ui/Button';

export const SettingsPage = () => {
  const { user, updateProfile } = useAuth();
  const { settings, updateSettings, addNotification } = useUiStore();

  const [name, setName] = useState(user?.name || '');
  const [avatarSeed, setAvatarSeed] = useState(
    user?.avatar?.split('seed=')[1] || 'defaultSeed'
  );

  const [dailyTargetHours, setDailyTargetHours] = useState(settings.dailyTargetHours || 4);
  const [weeklyTargetHours, setWeeklyTargetHours] = useState(settings.weeklyTargetHours || 24);
  const [defaultSessionDuration, setDefaultSessionDuration] = useState(
    settings.defaultSessionDuration || 60
  );
  
  const [enableReminders, setEnableReminders] = useState(
    settings.enableReminders !== false
  );
  const [reminderMinutesBefore, setReminderMinutesBefore] = useState(
    settings.reminderMinutesBefore || 15
  );
  const [soundEnabled, setSoundEnabled] = useState(settings.soundEnabled !== false);
  const [loading, setLoading] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setLoading(true);
    
    const updatedUser = {
      ...user,
      name: name.trim(),
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${avatarSeed.trim()}`
    };

    updateProfile(updatedUser);
    setLoading(false);
    addNotification('Cập nhật cài đặt hồ sơ thành công!', 'success');
  };

  const handleSavePreferences = (e) => {
    e.preventDefault();
    
    updateSettings({
      dailyTargetHours: parseFloat(dailyTargetHours),
      weeklyTargetHours: parseFloat(weeklyTargetHours),
      defaultSessionDuration: parseInt(defaultSessionDuration, 10),
      enableReminders,
      reminderMinutesBefore: parseInt(reminderMinutesBefore, 10),
      soundEnabled
    });

    addNotification('Cập nhật tùy chọn học tập thành công!', 'success');
  };

  const handleToggleTheme = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    updateSettings({ theme: nextTheme });
    addNotification(`Đã chuyển sang Chế độ ${nextTheme === 'dark' ? 'Tối' : 'Sáng'}`, 'info');
  };

  return (
    <div className="row g-4">
      {/* Forms column (Spans 8 cols on large screens) */}
      <div className="col-12 col-lg-8 d-flex flex-column gap-4">
        
        {/* Profile Settings */}
        <div className="card shadow-sm border border-light p-4 bg-white" style={{ borderRadius: '10px' }}>
          <div className="pb-2 mb-3 border-bottom border-light d-flex align-items-center gap-2">
            <User size={18} className="text-primary" />
            <h5 className="font-weight-bold text-dark mb-0" style={{ fontSize: '14px' }}>Cài đặt Hồ sơ Cá nhân</h5>
          </div>

          <form onSubmit={handleSaveProfile} className="d-flex flex-column gap-3 text-secondary">
            <div className="d-flex flex-wrap align-items-center gap-3 pb-2">
              <img 
                src={`https://api.dicebear.com/7.x/bottts/svg?seed=${avatarSeed}`} 
                alt="Avatar Preview" 
                className="rounded bg-light border border-light p-1"
                style={{ width: '64px', height: '64px' }}
              />
              <div className="flex-grow-1 min-width-[200px] form-group">
                <label htmlFor="avatarSeed" className="form-label font-weight-bold text-dark text-xs mb-1">Từ khóa ảnh đại diện (Tự tạo)</label>
                <input
                  id="avatarSeed"
                  type="text"
                  value={avatarSeed}
                  onChange={(e) => setAvatarSeed(e.target.value)}
                  placeholder="Nhập ký tự để tạo ảnh đại diện ngẫu nhiên"
                  className="form-control"
                />
              </div>
            </div>

            <div className="row g-3">
              <div className="col-12 col-sm-6 form-group">
                <label htmlFor="profileName" className="form-label font-weight-bold text-dark text-xs mb-1">Họ và Tên hiển thị</label>
                <input
                  id="profileName"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-control"
                  required
                />
              </div>

              <div className="col-12 col-sm-6 form-group">
                <label htmlFor="profileEmail" className="form-label font-weight-bold text-dark text-xs mb-1">Địa chỉ Email (Đã khóa)</label>
                <input
                  id="profileEmail"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="form-control bg-light text-muted cursor-not-allowed opacity-75"
                />
              </div>
            </div>

            <div className="d-flex justify-content-end mt-2">
              <Button type="submit" variant="primary" loading={loading} icon={CheckCircle2}>
                Lưu Hồ sơ
              </Button>
            </div>
          </form>
        </div>

        {/* Study Target Preferences */}
        <div className="card shadow-sm border border-light p-4 bg-white" style={{ borderRadius: '10px' }}>
          <div className="pb-2 mb-3 border-bottom border-light d-flex align-items-center gap-2">
            <Settings size={18} className="text-primary" />
            <h5 className="font-weight-bold text-dark mb-0" style={{ fontSize: '14px' }}>Tùy chọn Học tập</h5>
          </div>

          <form onSubmit={handleSavePreferences} className="d-flex flex-column gap-3 text-secondary">
            <div className="row g-3">
              <div className="col-12 col-sm-4 form-group">
                <label htmlFor="dailyTarget" className="form-label font-weight-bold text-dark text-xs mb-1">Mục tiêu ngày (Giờ)</label>
                <input
                  id="dailyTarget"
                  type="number"
                  min="0.5"
                  max="24"
                  step="0.5"
                  value={dailyTargetHours}
                  onChange={(e) => setDailyTargetHours(e.target.value)}
                  className="form-control"
                  required
                />
              </div>

              <div className="col-12 col-sm-4 form-group">
                <label htmlFor="weeklyTarget" className="form-label font-weight-bold text-dark text-xs mb-1">Mục tiêu tuần (Giờ)</label>
                <input
                  id="weeklyTarget"
                  type="number"
                  min="1"
                  max="168"
                  value={weeklyTargetHours}
                  onChange={(e) => setWeeklyTargetHours(e.target.value)}
                  className="form-control"
                  required
                />
              </div>

              <div className="col-12 col-sm-4 form-group">
                <label htmlFor="defDuration" className="form-label font-weight-bold text-dark text-xs mb-1">Thời lượng mặc định (Phút)</label>
                <input
                  id="defDuration"
                  type="number"
                  min="10"
                  max="240"
                  step="5"
                  value={defaultSessionDuration}
                  onChange={(e) => setDefaultSessionDuration(e.target.value)}
                  className="form-control"
                  required
                />
              </div>
            </div>

            {/* Notification settings checklist */}
            <div className="flex-column gap-3 mt-3 pt-3 border-top border-light">
              <h6 className="font-weight-bold text-dark tracking-wide mb-3 d-flex align-items-center gap-1.5" style={{ fontSize: '12px' }}>
                <Bell size={14} className="text-primary" /> Thông báo & Âm thanh
              </h6>
              
              <div className="row g-3 mb-3">
                {/* Reminders check */}
                <div className="col-12 col-sm-6">
                  <label className="card p-2.5 border border-light bg-light hover-bg-white d-flex flex-row align-items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={enableReminders}
                      onChange={(e) => setEnableReminders(e.target.checked)}
                      className="form-check-input mt-0 cursor-pointer"
                    />
                    <div className="d-flex flex-column leading-tight">
                      <span className="text-xs font-weight-bold text-dark">Bật nhắc nhở</span>
                      <small className="text-muted" style={{ fontSize: '10px' }}>Hiển thị cảnh báo trước khi buổi học bắt đầu</small>
                    </div>
                  </label>
                </div>

                {/* Sound alerts check */}
                <div className="col-12 col-sm-6">
                  <label className="card p-2.5 border border-light bg-light hover-bg-white d-flex flex-row align-items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={soundEnabled}
                      onChange={(e) => setSoundEnabled(e.target.checked)}
                      className="form-check-input mt-0 cursor-pointer"
                    />
                    <div className="d-flex flex-column leading-tight">
                      <span className="text-xs font-weight-bold text-dark">Âm thanh thông báo</span>
                      <small className="text-muted" style={{ fontSize: '10px' }}>Phát âm thanh khi hoàn thành học tập</small>
                    </div>
                  </label>
                </div>
              </div>

              {enableReminders && (
                <div className="form-group max-w-xs" style={{ maxWidth: '280px' }}>
                  <label htmlFor="reminderMins" className="form-label font-weight-bold text-dark text-xs mb-1">Thời gian nhắc nhở</label>
                  <div className="input-group">
                    <input
                      id="reminderMins"
                      type="number"
                      min="1"
                      max="60"
                      value={reminderMinutesBefore}
                      onChange={(e) => setReminderMinutesBefore(e.target.value)}
                      className="form-control"
                      required
                    />
                    <span className="input-group-text bg-light text-muted" style={{ fontSize: '12px' }}>phút trước</span>
                  </div>
                </div>
              )}
            </div>

            <div className="d-flex justify-content-end mt-2">
              <Button type="submit" variant="secondary" icon={CheckCircle2}>
                Lưu Tùy chọn
              </Button>
            </div>
          </form>
        </div>

      </div>

      {/* Visual overrides controls */}
      <div className="col-12 col-lg-4 d-flex flex-column gap-4">
        <div className="card shadow-sm border border-light p-4 bg-white" style={{ borderRadius: '10px' }}>
          <div className="pb-2 mb-3 border-bottom border-light d-flex align-items-center gap-2">
            <Eye size={18} className="text-primary" />
            <h5 className="font-weight-bold text-dark mb-0" style={{ fontSize: '14px' }}>Tùy chỉnh Giao diện</h5>
          </div>

          <div className="d-flex flex-column gap-3 py-1" style={{ fontSize: '12px' }}>
            <div className="d-flex justify-content-between align-items-center">
              <span className="text-muted">Giao diện hiện tại:</span>
              <strong className="text-dark text-uppercase tracking-wider">Chế độ {settings.theme === 'dark' ? 'Tối' : 'Sáng'}</strong>
            </div>

            <button
              onClick={handleToggleTheme}
              className="btn btn-outline-secondary d-flex align-items-center justify-content-center gap-2 py-2 cursor-pointer font-weight-bold"
              style={{ fontSize: '12px', borderRadius: '8px' }}
            >
              {settings.theme === 'dark' ? (
                <>
                  <Sun size={14} className="text-warning fill-warning" /> Chuyển sang Chế độ Sáng
                </>
              ) : (
                <>
                  <Moon size={14} className="text-primary fill-primary" /> Chuyển sang Chế độ Tối
                </>
              )}
            </button>

            {/* Quick sound alert trigger */}
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                updateSettings({ soundEnabled: !soundEnabled });
                addNotification(
                  `Thông báo âm thanh đã được ${!soundEnabled ? 'BẬT' : 'TẮT'}`,
                  'info'
                );
              }}
              className="btn btn-outline-secondary d-flex align-items-center justify-content-center gap-2 py-2 cursor-pointer font-weight-bold"
              style={{ fontSize: '12px', borderRadius: '8px' }}
            >
              {soundEnabled ? (
                <>
                  <VolumeX size={14} className="text-danger" /> Tắt âm thanh thông báo
                </>
              ) : (
                <>
                  <Volume2 size={14} className="text-success" /> Bật âm thanh thông báo
                </>
              )}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default SettingsPage;
