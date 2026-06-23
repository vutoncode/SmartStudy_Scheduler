import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

// Layout & Route Guards
import AppLayout from '../components/layout/AppLayout';
import ProtectedRoute from './ProtectedRoute';

// Pages
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import SchedulePage from '../pages/SchedulePage';
import GoalsPage from '../pages/GoalsPage';
import ProgressPage from '../pages/ProgressPage';
import SettingsPage from '../pages/SettingsPage';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />
      },
      {
        path: 'schedule',
        element: <SchedulePage />
      },
      {
        path: 'goals',
        element: <GoalsPage />
      },
      {
        path: 'progress',
        element: <ProgressPage />
      },
      {
        path: 'settings',
        element: <SettingsPage />
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
