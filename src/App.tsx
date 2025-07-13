import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';

import { LoginPage } from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ReservationPage from './pages/ReservationPage';
import ClientPage from './pages/ClientPage';
import EmployeePage from './pages/EmployeePage';
import EmployeeGroupPage from './pages/EmployeeGroupPage';
import MainLayout from './pages/MainLayout';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Main Layout */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="reservations" element={<ReservationPage />} />
          <Route path="clients" element={<ClientPage />} />
          <Route path="employees" element={<EmployeePage />} />
          <Route path="employee-groups" element={<EmployeeGroupPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
