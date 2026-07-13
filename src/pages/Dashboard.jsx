import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../lib/api';
import { scheduleTasks } from '../lib/scheduler';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    loadTasks();
  }, []);

  const toggleStatus = async (task) => {
    const newStatus = task.status === 'done' ? 'todo' : 'done';
    try {
      setTasks(tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
      await fetchWithAuth('/api/tasks', { method: 'PUT', body: JSON.stringify({ id: task.id, status: newStatus }) });
    } catch (err) {
      alert(err.message);
    }
  };

  const activeTasks = tasks.filter(t => t.status !== 'done');
  const doneTasks = tasks.filter(t => t.status === 'done');
  
  // Áp dụng thuật toán sắp xếp
  const suggestedTasks = scheduleTasks(activeTasks);
  const topTasks = suggestedTasks.slice(0, 5); // Lấy 5 task ưu tiên nhất

  // Tính số lượng quá hạn
  const overdueCount = activeTasks.filter(t => t.deadline && new Date(t.deadline) < new Date()).length;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
      </div>

      {loading ? <p>Đang tải dữ liệu...</p> : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: '4px solid var(--primary)' }}>
              <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Tổng nhiệm vụ</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{tasks.length}</p>
            </div>
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: '4px solid var(--success)' }}>
              <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Đã hoàn thành</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{doneTasks.length}</p>
            </div>
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: '4px solid var(--danger)' }}>
              <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Quá hạn</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{overdueCount}</p>
            </div>
          </div>

          <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Gợi ý hôm nay nên làm gì</span>
              <Link to="/tasks" style={{ fontSize: '0.875rem', fontWeight: 'normal' }}>Xem tất cả</Link>
            </h2>

            {topTasks.length === 0 ? <p>Tuyệt vời, bạn đã hoàn thành hết nhiệm vụ!</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {topTasks.map(task => (
                  <div key={task.id} style={{ display: 'flex', alignItems: 'center', padding: '1rem', border: '1px solid var(--border)', borderRadius: '6px' }}>
                    <input type="checkbox" checked={false} onChange={() => toggleStatus(task)} style={{ transform: 'scale(1.5)', marginRight: '1rem', cursor: 'pointer' }} />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: 0 }}>{task.title}</h4>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'flex', gap: '1rem' }}>
                        {task.subjects?.name && <span style={{ color: task.subjects.color }}>• {task.subjects.name}</span>}
                        {task.deadline && <span>⏰ {new Date(task.deadline).toLocaleString()}</span>}
                      </div>
                    </div>
                    <div>
                      <span style={{ 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '999px', 
                        fontSize: '0.75rem', 
                        fontWeight: 'bold',
                        backgroundColor: task._priorityScore >= 1000 ? '#fee2e2' : task._priorityScore >= 600 ? '#fef3c7' : '#dbeafe',
                        color: task._priorityScore >= 1000 ? '#b91c1c' : task._priorityScore >= 600 ? '#d97706' : '#1d4ed8'
                      }}>
                        {task._priorityLabel}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
