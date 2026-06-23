import React, { useState } from 'react';
import WeekCalendar from '../components/schedule/WeekCalendar';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import CheckInModal from '../components/schedule/CheckInModal';
import { SUBJECTS } from '../utils/constants';
import { validateSessionTime } from '../utils/validators';
import { hasOverlap, suggestStudySlot } from '../utils/scheduleUtils';
import useSchedule from '../hooks/useSchedule';
import useUiStore from '../store/uiStore';
import { AlertCircle, CalendarDays, Clock, Sparkles } from 'lucide-react';

export const SchedulePage = () => {
  const { sessions, addSession, updateSession } = useSchedule();
  const { activeModal, closeModal } = useUiStore();

  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState(SUBJECTS[0].id);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [duration, setDuration] = useState(60);
  
  const [overlapWarning, setOverlapWarning] = useState(false);
  const [suggestedSlot, setSuggestedSlot] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleOpenAddModal = (initialDate = '') => {
    setTitle('');
    setSubjectId(SUBJECTS[0].id);
    setDate(initialDate || new Date().toISOString().split('T')[0]);
    setStartTime('09:00');
    setDuration(60);
    setOverlapWarning(false);
    setSuggestedSlot(null);
    setErrors({});
  };

  const handleOpenEditModal = (session) => {
    setTitle(session.title);
    setSubjectId(session.subjectId);
    setDate(session.date);
    setStartTime(session.startTime);
    setDuration(session.duration);
    setOverlapWarning(false);
    setSuggestedSlot(null);
    setErrors({});
  };

  const runOverlapCheck = (candidate) => {
    const isOverlapping = hasOverlap(candidate, sessions);
    setOverlapWarning(isOverlapping);

    if (isOverlapping) {
      const suggested = suggestStudySlot(candidate.date, candidate.duration, sessions);
      setSuggestedSlot(suggested);
    } else {
      setSuggestedSlot(null);
    }
  };

  const handleFieldChange = (field, value) => {
    const candidate = {
      id: activeModal?.data?.id || null,
      title: field === 'title' ? value : title,
      subjectId: field === 'subjectId' ? value : subjectId,
      date: field === 'date' ? value : date,
      startTime: field === 'startTime' ? value : startTime,
      duration: field === 'duration' ? parseInt(value, 10) : duration
    };

    if (field === 'title') setTitle(value);
    if (field === 'subjectId') setSubjectId(value);
    if (field === 'date') setDate(value);
    if (field === 'startTime') setStartTime(value);
    if (field === 'duration') setDuration(parseInt(value, 10));

    setErrors({});

    if (['date', 'startTime', 'duration'].includes(field)) {
      runOverlapCheck(candidate);
    }
  };

  const handleApplySuggestedSlot = () => {
    if (suggestedSlot) {
      setStartTime(suggestedSlot);
      setOverlapWarning(false);
      setSuggestedSlot(null);
    }
  };

  const handleSaveSession = async (e) => {
    e.preventDefault();
    setErrors({});

    const timeErr = validateSessionTime(startTime, duration);
    if (timeErr) {
      setErrors({ duration: timeErr });
      return;
    }

    if (!title.trim()) {
      setErrors({ title: 'Tên phiên học không được để trống' });
      return;
    }

    const payload = {
      title: title.trim(),
      subjectId,
      date,
      startTime,
      duration: parseInt(duration, 10),
      status: 'scheduled'
    };

    if (hasOverlap({ ...payload, id: activeModal.data?.id }, sessions)) {
      setOverlapWarning(true);
      return;
    }

    setLoading(true);
    let success = false;

    if (activeModal.type === 'addSession') {
      success = await addSession(payload);
    } else if (activeModal.type === 'editSession') {
      success = await updateSession(activeModal.data.id, payload);
    }

    setLoading(false);
    if (success) {
      closeModal();
    }
  };

  const isAddOpen = activeModal?.type === 'addSession';
  const isEditOpen = activeModal?.type === 'editSession';
  const isCheckInOpen = activeModal?.type === 'checkIn';

  React.useEffect(() => {
    if (isAddOpen) {
      handleOpenAddModal(activeModal.data?.date);
    } else if (isEditOpen) {
      handleOpenEditModal(activeModal.data);
    }
  }, [activeModal]);

  return (
    <div className="d-flex flex-column gap-3">
      {/* Week Calendar */}
      <WeekCalendar />

      {/* Check In Overlay */}
      {isCheckInOpen && (
        <CheckInModal
          isOpen={isCheckInOpen}
          onClose={closeModal}
          session={activeModal.data}
        />
      )}

      {/* Add / Edit Overlay */}
      {(isAddOpen || isEditOpen) && (
        <Modal
          isOpen={isAddOpen || isEditOpen}
          onClose={closeModal}
          title={isAddOpen ? 'Lên lịch phiên học mới' : 'Điều chỉnh chi tiết phiên học'}
          size="md"
          footer={
            <>
              <Button variant="ghost" onClick={closeModal} disabled={loading}>
                Hủy bỏ
              </Button>
              <Button 
                variant="primary" 
                onClick={handleSaveSession} 
                loading={loading}
              >
                {isAddOpen ? 'Lên lịch học' : 'Lưu thay đổi'}
              </Button>
            </>
          }
        >
          <form onSubmit={handleSaveSession} className="d-flex flex-column gap-3 text-secondary">
            {/* Overlap warnings banner */}
            {overlapWarning && (
              <div className="alert alert-warning p-3 d-flex flex-column gap-2 mb-2" style={{ borderRadius: '8px', fontSize: '12px' }}>
                <div className="d-flex gap-2 align-items-start">
                  <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-dark">Phát hiện trùng lịch học!</strong>
                    <p className="mb-0 text-muted mt-0.5 leading-normal" style={{ fontSize: '11px' }}>
                      Thời gian này trùng với một phiên học khác đã lên lịch. Vui lòng kiểm tra lại ngày và giờ bắt đầu.
                    </p>
                  </div>
                </div>
                {suggestedSlot && (
                  <div className="d-flex align-items-center justify-content-between pt-2 border-top border-warning-subtle">
                    <span className="text-dark d-flex align-items-center gap-1">
                      <Sparkles size={11} className="text-warning" />
                      Khung giờ trống khả dụng: <strong className="text-primary">{suggestedSlot}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={handleApplySuggestedSlot}
                      className="btn btn-xs btn-warning font-weight-bold px-2 py-0.5 cursor-pointer text-dark border-0"
                      style={{ fontSize: '10px' }}
                    >
                      Áp dụng
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Session Title */}
            <div className="form-group">
              <label htmlFor="sessionTitle" className="form-label font-weight-bold text-dark text-xs mb-1">Tên phiên học / Hoạt động cụ thể</label>
              <input
                id="sessionTitle"
                type="text"
                value={title}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                placeholder="Ví dụ: Đọc Hồi 2 Romeo & Juliet, Làm bài tập giới hạn tích phân"
                className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                required
              />
              {errors.title && <div className="invalid-feedback d-block">{errors.title}</div>}
            </div>

            {/* Subject Link */}
            <div className="form-group">
              <label htmlFor="sessionSubject" className="form-label font-weight-bold text-dark text-xs mb-1">Liên kết môn học</label>
              <select
                id="sessionSubject"
                value={subjectId}
                onChange={(e) => handleFieldChange('subjectId', e.target.value)}
                className="form-select"
              >
                {SUBJECTS.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div className="form-group">
              <label htmlFor="sessionDate" className="form-label d-flex align-items-center gap-1.5 font-weight-bold text-dark text-xs mb-1">
                <CalendarDays size={13} className="text-primary" /> Ngày học
              </label>
              <input
                id="sessionDate"
                type="date"
                value={date}
                onChange={(e) => handleFieldChange('date', e.target.value)}
                className="form-control"
                required
              />
            </div>

            {/* Row start and duration */}
            <div className="row g-3">
              <div className="col-6 form-group">
                <label htmlFor="sessionStart" className="form-label d-flex align-items-center gap-1.5 font-weight-bold text-dark text-xs mb-1">
                  <Clock size={13} className="text-primary" /> Giờ bắt đầu
                </label>
                <input
                  id="sessionStart"
                  type="time"
                  value={startTime}
                  onChange={(e) => handleFieldChange('startTime', e.target.value)}
                  className="form-control"
                  required
                />
              </div>

              <div className="col-6 form-group">
                <label htmlFor="sessionDuration" className="form-label font-weight-bold text-dark text-xs mb-1">Thời lượng (Phút)</label>
                <input
                  id="sessionDuration"
                  type="number"
                  min="5"
                  max="480"
                  step="5"
                  value={duration}
                  onChange={(e) => handleFieldChange('duration', e.target.value)}
                  className={`form-control ${errors.duration ? 'is-invalid' : ''}`}
                  required
                />
                {errors.duration && <div className="invalid-feedback d-block">{errors.duration}</div>}
              </div>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default SchedulePage;
