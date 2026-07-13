import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../lib/api';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const initialForm = { id: null, title: '', description: '', subject_id: '', deadline: '', priority: 'medium', status: 'todo' };
  const [formData, setFormData] = useState(initialForm);
  const [filterSubject, setFilterSubject] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [tasksData, subjectsData] = await Promise.all([
        fetchWithAuth('/api/tasks'),
        fetchWithAuth('/api/subjects')
      ]);
      setTasks(tasksData);
      setSubjects(subjectsData);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = formData.id ? 'PUT' : 'POST';
      const payload = { ...formData };
      if (!payload.subject_id) payload.subject_id = null;
      if (!payload.deadline) payload.deadline = null;

      await fetchWithAuth('/api/tasks', {
        method,
        body: JSON.stringify(payload),
      });
      setFormData(initialForm);
      setShowForm(false);
      loadData(); // Refetch
    } catch (err) {
      alert(err.message);
    }
  };

  const toggleStatus = async (task) => {
    const newStatus = task.status === 'done' ? 'todo' : 'done';
    try {
      // Optimistic update
      setTasks(tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
      await fetchWithAuth('/api/tasks', {
        method: 'PUT',
        body: JSON.stringify({ id: task.id, status: newStatus })
      });
    } catch (err) {
      alert(err.message);
      loadData(); // Revert
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa nhiệm vụ này?')) return;
    try {
      await fetchWithAuth(`/api/tasks?id=${id}`, { method: 'DELETE' });
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredTasks = tasks.filter(t => {
    if (filterSubject && t.subject_id !== filterSubject) return false;
    if (filterStatus && t.status !== filterStatus) return false;
    return true;
  });

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Nhiệm vụ học tập</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Đóng' : '+ Thêm nhiệm vụ'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label>Tiêu đề</label>
              <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }} />
            </div>
            <div>
              <label>Môn học</label>
              <select value={formData.subject_id || ''} onChange={e => setFormData({...formData, subject_id: e.target.value})} style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}>
                <option value="">Không có</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label>Hạn chót (Deadline)</label>
              <input type="datetime-local" value={formData.deadline ? new Date(formData.deadline).toISOString().slice(0, 16) : ''} onChange={e => setFormData({...formData, deadline: e.target.value})} style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }} />
            </div>
            <div>
              <label>Mức độ ưu tiên</label>
              <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})} style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}>
                <option value="low">Thấp</option>
                <option value="medium">Trung bình</option>
                <option value="high">Cao</option>
              </select>
            </div>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label>Mô tả</label>
            <textarea value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem', minHeight: '80px' }} />
          </div>
          <button type="submit" className="btn btn-primary">Lưu nhiệm vụ</button>
        </form>
      )}

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <select value={filterSubject} onChange={e => setFilterSubject(e.target.value)} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}>
          <option value="">Tất cả môn học</option>
          {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}>
          <option value="">Tất cả trạng thái</option>
          <option value="todo">Chưa làm</option>
          <option value="in_progress">Đang làm</option>
          <option value="done">Hoàn thành</option>
        </select>
      </div>

      {loading ? <p>Đang tải...</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filteredTasks.length === 0 ? <p>Không có nhiệm vụ nào.</p> : null}
          {filteredTasks.map(task => (
            <div key={task.id} style={{ 
              display: 'flex', alignItems: 'center', background: 'white', padding: '1rem', borderRadius: '8px',
              borderLeft: `4px solid ${task.subjects?.color || '#ccc'}`,
              opacity: task.status === 'done' ? 0.6 : 1,
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}>
              <input type="checkbox" checked={task.status === 'done'} onChange={() => toggleStatus(task)} style={{ transform: 'scale(1.5)', marginRight: '1rem', cursor: 'pointer' }} />
              <div style={{ flex: 1 }}>
                <h3 style={{ textDecoration: task.status === 'done' ? 'line-through' : 'none', margin: 0, fontSize: '1.1rem' }}>{task.title}</h3>
                <div style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.25rem', display: 'flex', gap: '1rem' }}>
                  {task.subjects?.name && <span>🏷 {task.subjects.name}</span>}
                  {task.deadline && <span>⏰ {new Date(task.deadline).toLocaleString()}</span>}
                  <span>⭐ {task.priority}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn" onClick={() => { setFormData({...task, subject_id: task.subject_id || ''}); setShowForm(true); }}>Sửa</button>
                <button className="btn" style={{ color: 'red' }} onClick={() => handleDelete(task.id)}>Xóa</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tasks;
