import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../lib/api';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTasks = async () => {
    try {
      const data = await fetchWithAuth('/api/tasks');
      setTasks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const toggleStatus = async (task) => {
    const newStatus = task.status === 'done' ? 'todo' : 'done';
    try {
      setTasks(tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
      await fetchWithAuth('/api/tasks', { method: 'PUT', body: JSON.stringify({ id: task.id, status: newStatus }) });
    } catch (err) {
      alert(err.message);
      loadTasks(); // revert on error
    }
  };

  // --- Statistics Logic ---
  const totalTasks = tasks.length;
  const doneTasksCount = tasks.filter(t => t.status === 'done').length;
  
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

  // --- Task Lists Logic ---
  const activeTasks = tasks.filter(t => t.status !== 'done');
  const doneTasks = tasks.filter(t => t.status === 'done');
  
  const now = new Date();
  const overdueTasks = activeTasks.filter(t => t.deadline && new Date(t.deadline) < now);
  const upcomingTasks = activeTasks.filter(t => !t.deadline || new Date(t.deadline) >= now);

  const renderTask = (task, borderColor) => (
    <div key={task.id} style={{ 
      display: 'flex', alignItems: 'center', padding: '1rem', 
      borderLeft: `4px solid ${borderColor}`,
      background: 'white', borderRadius: '6px', marginBottom: '0.5rem',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
    }}>
      <input type="checkbox" checked={task.status === 'done'} onChange={() => toggleStatus(task)} style={{ transform: 'scale(1.5)', marginRight: '1rem', cursor: 'pointer' }} />
      <div style={{ flex: 1 }}>
        <h4 style={{ margin: 0, textDecoration: task.status === 'done' ? 'line-through' : 'none' }}>{task.title}</h4>
        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'flex', gap: '1rem' }}>
          {task.subjects?.name && <span style={{ color: task.subjects.color }}>• {task.subjects.name}</span>}
          {task.deadline && <span>⏰ {new Date(task.deadline).toLocaleString()}</span>}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Quản lý</h1>
      </div>

      {loading ? <p>Đang tải dữ liệu...</p> : (
        <>
          {/* Statistics Section (Pie Chart) */}
          <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0 }}>Thống kê tổng quan</h2>
            </div>
            
            {tasks.length === 0 ? (
              <p>Chưa có dữ liệu thống kê.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ position: 'relative', width: '250px', height: '250px' }}>
                  <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                    {/* Active/Todo portion (Gray) */}
                    <circle cx="18" cy="18" r="15.91549431" fill="transparent" stroke="#94a3b8" strokeWidth="6" />
                    
                    {/* Done portion (Green) */}
                    <circle cx="18" cy="18" r="15.91549431" fill="transparent" stroke="#22c55e" strokeWidth="6"
                      strokeDasharray={`${doneTasks.length === 0 && activeTasks.length === 0 ? 0 : (doneTasks.length / tasks.length) * 100} 100`}
                      strokeDashoffset="0" 
                      style={{ transition: 'stroke-dasharray 1s ease-out' }}
                    />
                  </svg>
                  <div style={{ 
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' 
                  }}>
                    <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b' }}>
                      {tasks.length > 0 ? Math.round((doneTasks.length / tasks.length) * 100) : 0}%
                    </span>
                    <span style={{ fontSize: '1rem', color: '#64748b' }}>Hoàn thành</span>
                  </div>
                </div>

                {/* Legend */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '20px', height: '20px', background: '#22c55e', borderRadius: '50%' }}></div>
                    <span style={{ fontSize: '14px' }}>Hoàn thành ({doneTasks.length})</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '20px', height: '20px', background: '#94a3b8', borderRadius: '50%' }}></div>
                    <span style={{ fontSize: '14px' }}>Chưa làm ({activeTasks.length})</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Task Lists Section */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {/* Upcoming Tasks */}
            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ marginTop: 0, marginBottom: '1rem', color: '#334155', display: 'flex', justifyContent: 'space-between' }}>
                <span>Sắp tới</span>
                <span style={{ background: '#cbd5e1', padding: '0.1rem 0.5rem', borderRadius: '12px', fontSize: '0.875rem' }}>{upcomingTasks.length}</span>
              </h3>
              <div>
                {upcomingTasks.length === 0 ? <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Không có nhiệm vụ sắp tới.</p> : upcomingTasks.map(t => renderTask(t, '#3b82f6'))}
              </div>
            </div>

            {/* Overdue Tasks */}
            <div style={{ background: '#fef2f2', padding: '1.5rem', borderRadius: '8px', border: '1px solid #fee2e2' }}>
              <h3 style={{ marginTop: 0, marginBottom: '1rem', color: '#991b1b', display: 'flex', justifyContent: 'space-between' }}>
                <span>Quá hạn</span>
                <span style={{ background: '#fca5a5', padding: '0.1rem 0.5rem', borderRadius: '12px', fontSize: '0.875rem', color: 'white' }}>{overdueTasks.length}</span>
              </h3>
              <div>
                {overdueTasks.length === 0 ? <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Không có nhiệm vụ quá hạn.</p> : overdueTasks.map(t => renderTask(t, '#ef4444'))}
              </div>
            </div>

            {/* Done Tasks */}
            <div style={{ background: '#f0fdf4', padding: '1.5rem', borderRadius: '8px', border: '1px solid #dcfce3' }}>
              <h3 style={{ marginTop: 0, marginBottom: '1rem', color: '#166534', display: 'flex', justifyContent: 'space-between' }}>
                <span>Đã hoàn thành</span>
                <span style={{ background: '#86efac', padding: '0.1rem 0.5rem', borderRadius: '12px', fontSize: '0.875rem', color: 'white' }}>{doneTasks.length}</span>
              </h3>
              <div>
                {doneTasks.length === 0 ? <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Chưa có nhiệm vụ hoàn thành.</p> : doneTasks.map(t => renderTask(t, '#22c55e'))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
