import React, { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import useAuth from '../../hooks/useAuth';
import useSchedule from '../../hooks/useSchedule';
import useNotifications from '../../hooks/useNotifications';

export const AppLayout = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { fetchInitialData } = useSchedule();
  const { checkUpcomingSessions, requestDesktopPermission } = useNotifications();

  useEffect(() => {
    if (isAuthenticated) {
      fetchInitialData();
      requestDesktopPermission();
    }
  }, [isAuthenticated, fetchInitialData, requestDesktopPermission]);

  useEffect(() => {
    if (!isAuthenticated) return;
    checkUpcomingSessions();

    const interval = setInterval(() => {
      checkUpcomingSessions();
    }, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated, checkUpcomingSessions]);

  if (!isAuthenticated && !authLoading) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="d-flex h-screen w-screen overflow-hidden" style={{ backgroundColor: 'var(--bg-base)' }}>
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Container */}
      <div className="flex-grow-1 d-flex flex-column min-width-0 overflow-hidden">
        {/* Topbar Header */}
        <Topbar />

        {/* Dynamic Page Content */}
        <main className="flex-grow-1 overflow-auto p-4 custom-scrollbar">
          <div className="container-fluid max-width-7xl mx-auto w-100 animate-fadeIn">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
