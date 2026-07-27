import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { signOut } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1.5rem 1rem' }}>
        <img src="/logo.png" alt="Smart Study Logo" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '50%' }} />
        <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Smart Study</h2>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink to="/" className={({isActive}) => isActive ? 'active' : ''}>
              Quản lý
            </NavLink>
          </li>
          <li>
            <NavLink to="/tasks" className={({isActive}) => isActive ? 'active' : ''}>
              Nhiệm vụ
            </NavLink>
          </li>
          <li>
            <NavLink to="/calendar" className={({isActive}) => isActive ? 'active' : ''}>
              Lịch học
            </NavLink>
          </li>
          <li>
            <NavLink to="/subjects" className={({isActive}) => isActive ? 'active' : ''}>
              Môn học
            </NavLink>
          </li>
          <li>
            <NavLink to="/statistics" className={({isActive}) => isActive ? 'active' : ''}>
              Thống kê
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button onClick={signOut} className="btn-logout">Đăng xuất</button>
      </div>
    </aside>
  );
};

export default Sidebar;
