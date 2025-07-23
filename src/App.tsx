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
import ResTablePage from './pages/ResTablePage';
import TransferLocationPage from './pages/TransferLocationPage';
import SaloonPage from './pages/SaloonPage';
import GeneralIncomePage from './pages/GeneralIncomePage';
import TransferPointPage from './pages/TransferPointPage';
import CompanyRatePage from './pages/CompanyRatePage';
import TransferListPage from './pages/TransferListPage';
import WelcomeListPage from './pages/WelcomeListPage';
import TableLayoutPage from './pages/TableLayoutPage';

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
          <Route path="transfer-list" element={<TransferListPage />} />
          <Route path="welcome-list" element={<WelcomeListPage />} />
          <Route path="table-layout" element={<TableLayoutPage />} />
          <Route path="clients" element={<ClientPage />} />
          <Route path="transfer-locations" element={<TransferLocationPage />} />
          <Route path="employees" element={<EmployeePage />} />
          <Route path="employee-groups" element={<EmployeeGroupPage />} />
          <Route path="tables" element={<ResTablePage />} />
          <Route path="transfer-points" element={<TransferPointPage />} />
          <Route path="transfer-locations" element={<TransferLocationPage />} />
          <Route path="saloons" element={<SaloonPage />} />
          <Route path="company-rates" element={<CompanyRatePage />} />
          <Route path="general-income" element={<GeneralIncomePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
