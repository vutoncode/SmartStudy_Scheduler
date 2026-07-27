import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../lib/api';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Client-side logic for notifications
    const checkNotifications = async () => {
      try {
        const tasks = await fetchWithAuth('/api/tasks');
        const now = new Date();
        const activeTasks = tasks.filter(t => t.status !== 'done' && t.deadline);
        
        const notifs = [];
        activeTasks.forEach(task => {
          const deadline = new Date(task.deadline);
          const hoursToDeadline = (deadline - now) / (1000 * 60 * 60);
          
          if (hoursToDeadline < 0) {
            notifs.push({ id: task.id, type: 'danger', message: `Quá hạn: ${task.title}` });
          } else if (hoursToDeadline <= 24) {
            notifs.push({ id: task.id, type: 'warning', message: `Sắp đến hạn (24h): ${task.title}` });
          }
        });
        
        setNotifications(notifs);
      } catch (err) {
        console.error("Lỗi lấy thông báo:", err);
      }
    };

    checkNotifications();
    const interval = setInterval(checkNotifications, 1000 * 60 * 15); // check 15p 1 lần
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', position: 'relative' }}
      >
        🔔
        {notifications.length > 0 && (
          <span style={{ 
            position: 'absolute', top: 0, right: 0, 
            background: 'red', color: 'white', 
            borderRadius: '50%', padding: '2px 6px', 
            fontSize: '0.75rem', fontWeight: 'bold' 
          }}>
            {notifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div style={{ 
          position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem',
          width: '300px', background: 'white', border: '1px solid #e2e8f0',
          borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
          zIndex: 50, maxHeight: '400px', overflowY: 'auto'
        }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', fontWeight: 'bold' }}>Thông báo</div>
          {notifications.map(notif => (
            <div key={notif.id} style={{ 
              padding: '1rem', borderBottom: '1px solid #e2e8f0', 
              borderLeft: `4px solid ${notif.type === 'danger' ? 'red' : 'orange'}`,
              fontSize: '0.875rem'
            }}>
              {notif.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
