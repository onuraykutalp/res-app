// src/pages/LoginPage.tsx
import React from 'react';
import { LoginForm } from '../components/LoginForm';

export const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded shadow">
        <div className="text-center mb-6">
          <img src="../public/img/bizkit-thin.png" alt="Bizkit" className="w-40 mx-auto mb-4" />
        </div>
        <h1 className="text-2xl font-bold mb-6 text-center">Giriş Yap</h1>
        <LoginForm />
      </div>
    </div>
  );
};
