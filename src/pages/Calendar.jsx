import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../lib/api';

const Calendar = () => {
  const [tasks, setTasks] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    fetchWithAuth('/api/tasks').then(setTasks).catch(console.error);
  }, []);

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const blanks = Array(firstDay).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Lịch học</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button className="btn" onClick={prevMonth}>&lt;</button>
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Tháng {month + 1}, {year}</h2>
          <button className="btn" onClick={nextMonth}>&gt;</button>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
          {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(d => (
            <div key={d} style={{ padding: '1rem', textAlign: 'center', fontWeight: 'bold', color: '#64748b' }}>{d}</div>
          ))}
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridAutoRows: 'minmax(120px, auto)' }}>
          {blanks.map((_, i) => (
            <div key={`blank-${i}`} style={{ borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', background: '#fdfdfd' }}></div>
          ))}
          {days.map(day => {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            // Lọc task có deadline rơi vào ngày này
            const dayTasks = tasks.filter(t => t.deadline && t.deadline.startsWith(dateStr));

            return (
              <div key={day} style={{ borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '0.5rem' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: '#0f172a' }}>{day}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  {dayTasks.map(t => (
                    <div key={t.id} style={{ 
                      fontSize: '0.75rem', 
                      padding: '0.25rem 0.5rem', 
                      background: t.subjects?.color ? `${t.subjects.color}20` : '#e2e8f0',
                      borderLeft: `3px solid ${t.subjects?.color || '#94a3b8'}`,
                      borderRadius: '4px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      textDecoration: t.status === 'done' ? 'line-through' : 'none'
                    }}>
                      {t.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
