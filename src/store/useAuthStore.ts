import { create } from "zustand";
import { Employee } from "../types/Employee";


interface AuthState {
  user: Employee | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoggedIn: () => boolean; // fonksiyon olarak tanımla
  error: string | null;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  error: null,
  login: async (username, password) => {
    try {
      const res = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Login failed');
      }

      const data = await res.json();
      set({ user: data.user, error: null });
    } catch (error: any) {
      set({ error: error.message });
    }
  },
  logout: () => set({ user: null, error: null }),
  isLoggedIn: () => {
    return get().user !== null;
  }
}));
