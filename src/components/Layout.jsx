import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import NotificationCenter from './NotificationCenter';
import TaskModal from './TaskModal';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', position: 'relative' }}>
        <header style={{ 
          height: '64px', background: 'white', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              {user?.email}
            </div>
          </div>
        </header>
        <main className="main-content" style={{ position: 'relative' }}>
          <Outlet />
        </main>
        
        {/* Floating Action Button */}
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{
            position: 'absolute',
            bottom: '2rem',
            right: '2rem',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary)',
            color: 'white',
            fontSize: '2rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: 'none',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
            cursor: 'pointer',
            zIndex: 999,
            transition: 'transform 0.2s',
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          +
        </button>

        <TaskModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onTaskAdded={() => {
            // Optional: You could trigger a re-render of Outlet contents if needed,
            // but relying on individual pages to fetch on mount or polling might be enough for a simple app.
            // Or use a global event/context to trigger refresh. For now, closing the modal is enough.
          }}
        />
      </div>
    </div>
  );
};

export default Layout;
