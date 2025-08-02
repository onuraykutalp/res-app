import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

export const LoginForm = () => {
  const login = useAuthStore((state) => state.login);
  const error = useAuthStore((state) => state.error);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn());
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(username, password);
      navigate('/app/dashboard');
    } catch {
      // Hata zaten error state’te var
    } finally {
      setLoading(false);
    }
  };

  if (isLoggedIn) {
    return <div>Giriş başarılı! Hoşgeldin.</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-4 border rounded">
      <div>
        <label>Kullanıcı Adı</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />
      </div>
      <div className="mt-2">
        <label>Şifre</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />
      </div>
      {error && <p className="text-red-600 mt-2">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="mt-4 bg-[#555879] text-white px-4 py-2 rounded hover:bg-[#6f74a0]"
      >
        {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
      </button>
    </form>
  );
};
