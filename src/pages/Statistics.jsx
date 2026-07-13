import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../lib/api';

const Statistics = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWithAuth('/api/tasks').then(setTasks).finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Đang tải thống kê...</p>;
  if (tasks.length === 0) return <p>Chưa có dữ liệu để thống kê.</p>;

  // 1. Tỷ lệ hoàn thành tổng thể
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter(t => t.status === 'done').length;
  const completionRate = Math.round((doneTasks / totalTasks) * 100);

  // 2. Thống kê theo môn học
  const subjectStats = {};
  tasks.forEach(t => {
    const subName = t.subjects?.name || 'Không phân loại';
    const subColor = t.subjects?.color || '#cbd5e1';
    
    if (!subjectStats[subName]) {
      subjectStats[subName] = { total: 0, done: 0, color: subColor };
    }
    subjectStats[subName].total += 1;
    if (t.status === 'done') subjectStats[subName].done += 1;
  });

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Thống kê tiến độ</h1>
      </div>

      <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
        <h2>Tỷ lệ hoàn thành tổng thể: {completionRate}%</h2>
        <div style={{ width: '100%', background: '#e2e8f0', height: '24px', borderRadius: '12px', overflow: 'hidden', marginTop: '1rem' }}>
          <div style={{ width: `${completionRate}%`, background: 'var(--success)', height: '100%', transition: 'width 0.5s' }}></div>
        </div>
        <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>{doneTasks} / {totalTasks} nhiệm vụ đã hoàn thành.</p>
      </div>

      <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Tiến độ theo môn học</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {Object.keys(subjectStats).map(subName => {
            const stat = subjectStats[subName];
            const rate = Math.round((stat.done / stat.total) * 100);
            return (
              <div key={subName}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <strong>{subName}</strong>
                  <span>{stat.done}/{stat.total} ({rate}%)</span>
                </div>
                <div style={{ width: '100%', background: '#e2e8f0', height: '12px', borderRadius: '6px', overflow: 'hidden' }}>
                  <div style={{ width: `${rate}%`, background: stat.color, height: '100%', transition: 'width 0.5s' }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Statistics;
