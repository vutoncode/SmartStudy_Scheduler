import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../lib/api';

const TaskModal = ({ isOpen, onClose, onTaskAdded }) => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const initialForm = { title: '', description: '', subject_id: '', deadline: '', priority: 'medium', status: 'todo' };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (isOpen) {
      // Fetch subjects when modal opens
      fetchWithAuth('/api/subjects')
        .then(data => setSubjects(data))
        .catch(err => console.error("Error fetching subjects:", err));
      
      // Reset form
      setFormData(initialForm);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = { ...formData };
      if (!payload.subject_id) payload.subject_id = null;
      if (!payload.deadline) payload.deadline = null;

      await fetchWithAuth('/api/tasks', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      
      if (onTaskAdded) onTaskAdded();
      onClose();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'white', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '600px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)', position: 'relative'
      }}>
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#666' }}
        >
          &times;
        </button>
        <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: 'var(--text)' }}>Thêm nhiệm vụ mới</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold' }}>Tiêu đề</label>
              <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ccc' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold' }}>Môn học</label>
              <select value={formData.subject_id || ''} onChange={e => setFormData({...formData, subject_id: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ccc' }}>
                <option value="">Không có</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold' }}>Hạn chót</label>
              <input type="datetime-local" value={formData.deadline ? new Date(formData.deadline).toISOString().slice(0, 16) : ''} onChange={e => setFormData({...formData, deadline: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ccc' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold' }}>Mức độ ưu tiên (Màu sắc)</label>
              <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ccc' }}>
                <option value="low">Thấp (Xanh dương)</option>
                <option value="medium">Trung bình (Vàng)</option>
                <option value="high">Cao (Đỏ)</option>
              </select>
            </div>
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold' }}>Mô tả chi tiết</label>
            <textarea value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ccc', minHeight: '80px' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button type="button" onClick={onClose} style={{ padding: '0.75rem 1.5rem', borderRadius: '6px', border: '1px solid #ccc', background: 'white', cursor: 'pointer' }}>Hủy</button>
            <button type="submit" disabled={loading} style={{ padding: '0.75rem 1.5rem', borderRadius: '6px', border: 'none', background: 'var(--primary)', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>
              {loading ? 'Đang lưu...' : 'Lưu nhiệm vụ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
