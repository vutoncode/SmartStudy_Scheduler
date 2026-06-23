import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, CalendarDays } from 'lucide-react';
import { getCurrentWeekDates, formatDateString, formatShortDate } from '../../utils/dateUtils';
import useSchedule from '../../hooks/useSchedule';
import useUiStore from '../../store/uiStore';
import SessionCard from './SessionCard';

export const WeekCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { sessions } = useSchedule();
  const { openModal } = useUiStore();

  const weekDates = getCurrentWeekDates(currentDate);
  const startOfWeek = weekDates[0];
  const endOfWeek = weekDates[6];

  const handlePrevWeek = () => {
    const prev = new Date(currentDate);
    prev.setDate(currentDate.getDate() - 7);
    setCurrentDate(prev);
  };

  const handleNextWeek = () => {
    const next = new Date(currentDate);
    next.setDate(currentDate.getDate() + 7);
    setCurrentDate(next);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const dayAbbrs = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'];
  const todayStr = formatDateString(new Date());

  return (
    <div className="d-flex flex-column gap-3 mb-4">
      {/* Calendar Header & Controls */}
      <div className="card shadow-sm border border-light p-3 bg-white" style={{ borderRadius: '10px' }}>
        <div className="d-flex flex-wrap items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-2.5">
            <div className="p-2 rounded bg-light text-primary">
              <CalendarDays size={20} />
            </div>
            <div>
              <h5 className="mb-0 font-weight-bold text-dark" style={{ fontSize: '15px' }}>
                Tuần: {formatShortDate(startOfWeek)} — {formatShortDate(endOfWeek)}, năm {currentDate.getFullYear()}
              </h5>
              <small className="text-muted" style={{ fontSize: '11px' }}>Quản lý và phân bổ thời gian học tập của bạn</small>
            </div>
          </div>

          {/* Controls */}
          <div className="d-flex align-items-center gap-2">
            <div className="btn-group">
              <button
                onClick={handlePrevWeek}
                className="btn btn-sm btn-outline-secondary d-flex align-items-center cursor-pointer"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={handleToday}
                className="btn btn-sm btn-outline-secondary font-weight-semibold cursor-pointer"
                style={{ fontSize: '12px' }}
              >
                Hôm nay
              </button>
              <button
                onClick={handleNextWeek}
                className="btn btn-sm btn-outline-secondary d-flex align-items-center cursor-pointer"
              >
                <ChevronRight size={14} />
              </button>
            </div>
            
            <button
              onClick={() => openModal('addSession', { date: formatDateString(new Date()) })}
              className="btn btn-sm btn-primary d-flex align-items-center gap-1.5 cursor-pointer ml-1"
              style={{ fontSize: '12px', borderRadius: '8px' }}
            >
              <Plus size={14} /> Lên lịch phiên học
            </button>
          </div>
        </div>
      </div>

      {/* Weekly Grid */}
      <div className="row g-2.5 align-items-stretch">
        {weekDates.map((date, index) => {
          const dateStr = formatDateString(date);
          const isTodayDate = dateStr === todayStr;
          const daySessions = sessions
            .filter((s) => s.date === dateStr)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));

          return (
            <div key={dateStr} className="col-12 col-md">
              <div
                className="card h-100 shadow-sm border border-light p-2.5 bg-white"
                style={{
                  minHeight: '250px',
                  borderRadius: '10px',
                  borderTop: isTodayDate ? '3px solid var(--color-primary)' : '1px solid #e2e8f0'
                }}
              >
                {/* Header info */}
                <div className="d-flex align-items-center justify-content-between pb-1.5 mb-2 border-bottom border-light">
                  <div className="d-flex flex-column leading-none">
                    <span 
                      className={`text-uppercase font-weight-bold ${isTodayDate ? 'text-primary' : 'text-muted'}`}
                      style={{ fontSize: '10px', tracking: '0.5px' }}
                    >
                      {dayAbbrs[index]}
                    </span>
                    <span 
                      className="font-weight-black text-dark" 
                      style={{ fontSize: '17px', fontWeight: '700' }}
                    >
                      {date.getDate()}
                    </span>
                  </div>

                  <button
                    onClick={() => openModal('addSession', { date: dateStr })}
                    className="btn btn-link p-0 text-muted hover:text-primary d-flex align-items-center cursor-pointer"
                    title="Lên lịch học cho ngày này"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Day sessions */}
                <div className="d-flex flex-column gap-2 overflow-auto" style={{ maxHeight: '350px' }}>
                  {daySessions.length === 0 ? (
                    <div className="d-flex flex-column align-items-center justify-content-center py-4 rounded bg-light border border-dashed border-light opacity-50">
                      <span className="text-muted" style={{ fontSize: '10px' }}>Nghỉ ngơi</span>
                    </div>
                  ) : (
                    daySessions.map((session) => (
                      <SessionCard key={session.id} session={session} />
                    ))
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeekCalendar;
