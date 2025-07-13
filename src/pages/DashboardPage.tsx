import React from 'react';
import { useAuthStore } from '../store/useAuthStore';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {user ? (
        <>
          <p className="mb-4 text-lg">
            Hoşgeldin, <strong>{user.name} {user.lastname}</strong>!
          </p>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Çıkış Yap
          </button>
        </>
      ) : (
        <p>Giriş yapılmamış.</p>
      )}
    </div>
  );
};

export default DashboardPage;
