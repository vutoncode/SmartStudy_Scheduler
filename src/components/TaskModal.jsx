import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../lib/api';

const ScrollColumn = ({ options, value, onChange }) => {
  const ref = React.useRef();
  
  React.useEffect(() => {
    if (ref.current) {
      const idx = options.indexOf(value);
      if (idx !== -1) ref.current.scrollTop = idx * 40;
    }
  }, []);

  const handleScroll = (e) => {
    const idx = Math.round(e.target.scrollTop / 40);
    if (options[idx] && options[idx] !== value) {
      onChange(options[idx]);
    }
  };

  return (
    <div 
      ref={ref}
      onScroll={handleScroll}
      style={{ 
        height: '120px', width: '60px', overflowY: 'auto', scrollSnapType: 'y mandatory',
        scrollbarWidth: 'none', msOverflowStyle: 'none', background: '#f8fafc', borderRadius: '8px',
        border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column'
      }}
    >
      <div style={{ height: '40px', flexShrink: 0 }}></div>
      {options.map(opt => (
        <div key={opt} onClick={() => {
          if (ref.current) ref.current.scrollTo({ top: options.indexOf(opt) * 40, behavior: 'smooth' });
          onChange(opt);
        }} style={{ 
          height: '40px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          scrollSnapAlign: 'center', fontSize: value === opt ? '1.25rem' : '1rem',
          fontWeight: value === opt ? 'bold' : 'normal',
          color: value === opt ? 'white' : '#64748b',
          background: value === opt ? '#3b82f6' : 'transparent',
          cursor: 'pointer', transition: 'all 0.2s'
        }}>
          {opt}
        </div>
      ))}
      <div style={{ height: '40px', flexShrink: 0 }}></div>
    </div>
  );
};

const hours = Array.from({length: 12}, (_, i) => String(i === 0 ? 12 : i).padStart(2, '0'));
const minutes = Array.from({length: 60}, (_, i) => String(i).padStart(2, '0'));
const ampms = ['SA', 'CH'];

const TaskModal = ({ isOpen, onClose, onTaskAdded }) => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const initialForm = { title: '', description: '', subject_id: '', priority: 'medium', status: 'todo' };
  const [formData, setFormData] = useState(initialForm);
  
  const [dateStr, setDateStr] = useState('');
  const [hour, setHour] = useState('12');
  const [minute, setMinute] = useState('00');
  const [ampm, setAmpm] = useState('SA');

  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [newSubject, setNewSubject] = useState({ name: '', color: '#3b82f6' });

  useEffect(() => {
    if (isOpen) {
      fetchWithAuth('/api/subjects')
        .then(data => setSubjects(data))
        .catch(err => console.error("Error fetching subjects:", err));
      
      setFormData(initialForm);
      setDateStr('');
      setHour('12');
      setMinute('00');
      setAmpm('SA');
      setIsAddingSubject(false);
      setNewSubject({ name: '', color: '#3b82f6' });
    }
  }, [isOpen]);

  const handleSaveNewSubject = async () => {
    if (!newSubject.name.trim()) return;
    try {
      setLoading(true);
      await fetchWithAuth('/api/subjects', {
        method: 'POST',
        body: JSON.stringify(newSubject)
      });
      const data = await fetchWithAuth('/api/subjects');
      setSubjects(data);
      const added = data.find(s => s.name === newSubject.name);
      if (added) {
        setFormData({...formData, subject_id: added.id});
      }
      setIsAddingSubject(false);
      setNewSubject({ name: '', color: '#3b82f6' });
    } catch (err) {
      alert("Lỗi thêm môn học: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = { ...formData };
      if (!payload.subject_id) payload.subject_id = null;
      
      let finalDeadline = null;
      if (dateStr) {
         let h = parseInt(hour, 10);
         if (ampm === 'CH' && h !== 12) h += 12;
         if (ampm === 'SA' && h === 12) h = 0;
         const d = new Date(dateStr);
         d.setHours(h, parseInt(minute, 10), 0);
         finalDeadline = d.toISOString();
      }
      payload.deadline = finalDeadline;

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
              {isAddingSubject ? (
                <div style={{ display: 'flex', gap: '0.5rem', height: '42px' }}>
                  <input type="text" placeholder="Tên môn..." value={newSubject.name} onChange={e => setNewSubject({...newSubject, name: e.target.value})} style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc', minWidth: 0 }} />
                  <input type="color" value={newSubject.color} onChange={e => setNewSubject({...newSubject, color: e.target.value})} style={{ width: '30px', padding: '0', height: '100%', borderRadius: '4px', border: 'none', background: 'none', cursor: 'pointer' }} />
                  <button type="button" onClick={handleSaveNewSubject} style={{ padding: '0 0.5rem', background: 'var(--primary)', color: 'white', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>✓</button>
                  <button type="button" onClick={() => setIsAddingSubject(false)} style={{ padding: '0 0.5rem', background: '#e2e8f0', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>✕</button>
                </div>
              ) : (
                <select value={formData.subject_id || ''} onChange={e => {
                  if (e.target.value === 'NEW') setIsAddingSubject(true);
                  else setFormData({...formData, subject_id: e.target.value});
                }} style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ccc' }}>
                  <option value="">Không có</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  <option value="NEW" style={{ fontWeight: 'bold', color: '#2563eb' }}>+ Thêm môn học mới</option>
                </select>
              )}
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold' }}>Mức độ ưu tiên</label>
              <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ccc' }}>
                <option value="low">Thấp (Xanh dương)</option>
                <option value="medium">Trung bình (Vàng)</option>
                <option value="high">Cao (Đỏ)</option>
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1', background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Hạn chót</label>
              <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <input type="date" value={dateStr} onChange={e => setDateStr(e.target.value)} style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #ccc' }} />
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <ScrollColumn options={hours} value={hour} onChange={setHour} />
                  <ScrollColumn options={minutes} value={minute} onChange={setMinute} />
                  <ScrollColumn options={ampms} value={ampm} onChange={setAmpm} />
                </div>
              </div>
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
