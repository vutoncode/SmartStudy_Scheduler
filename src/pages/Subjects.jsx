import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../lib/api';

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({ id: null, name: '', color: '#3b82f6' });

  const loadSubjects = async () => {
    try {
      setLoading(true);
      const data = await fetchWithAuth('/api/subjects');
      setSubjects(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = formData.id ? 'PUT' : 'POST';
      await fetchWithAuth('/api/subjects', {
        method,
        body: JSON.stringify(formData),
      });
      setFormData({ id: null, name: '', color: '#3b82f6' });
      setShowForm(false);
      loadSubjects();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa môn học này?')) return;
    try {
      await fetchWithAuth(`/api/subjects?id=${id}`, { method: 'DELETE' });
      loadSubjects();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Môn học</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Đóng' : '+ Thêm môn học'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label>Tên môn học</label>
            <input 
              type="text" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              required 
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
            />
          </div>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label>Màu sắc</label>
            <input 
              type="color" 
              value={formData.color} 
              onChange={e => setFormData({...formData, color: e.target.value})} 
              style={{ display: 'block', marginTop: '0.5rem' }}
            />
          </div>
          <button type="submit" className="btn btn-primary">Lưu môn học</button>
        </form>
      )}

      {loading ? (
        <p>Đang tải...</p>
      ) : error ? (
        <p style={{color: 'red'}}>{error}</p>
      ) : subjects.length === 0 ? (
        <p>Chưa có môn học nào.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
          {subjects.map(subject => (
            <div key={subject.id} style={{ 
              background: 'white', 
              padding: '1.5rem', 
              borderRadius: '8px',
              borderTop: `4px solid ${subject.color}`,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <h3>{subject.name}</h3>
              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                <button className="btn" onClick={() => { setFormData(subject); setShowForm(true); }}>Sửa</button>
                <button className="btn" style={{ color: 'red' }} onClick={() => handleDelete(subject.id)}>Xóa</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Subjects;
