import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header'; // Yol doğruysa böyle

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;