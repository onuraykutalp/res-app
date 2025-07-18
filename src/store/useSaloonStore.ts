import React from 'react'
import { create } from 'zustand'
import type { Saloon } from '../types/Saloon'

interface SaloonState {
    saloons: Saloon[],
    loading: boolean,
    error: string | null,
    fetchSaloons: () => Promise<void>,
    addSaloon: (data: Omit<Saloon, "id" | "createdAt">) => Promise<void>,
    updateSaloon: (id: string, data: Partial<Omit<Saloon, "id" | "createdAt">>) => Promise<void>,
    deleteSaloon: (id: string) => Promise<void>,
}

export const useSaloonStore = create<SaloonState>((set) => ({
    saloons: [],
    loading: false,
    error: null,
    
    fetchSaloons: async () => {
        set({ loading: true, error: null });
        try {
            const res = await fetch('http://localhost:3001/api/saloons');
            if(!res.ok) throw new Error("Salonlar yüklenirken hata oluştu");
            const data: Saloon[] = await res.json();
            set({ saloons: data, loading: false });
        } catch (err: any) {
            set({ error: err.message, loading: false });
        }
    },

    addSaloon: async (data) => {
        set ({ loading: true, error: null });
        try {
            const res = await fetch('http://localhost:3001/api/saloons', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
        } catch (err: any) {
            set({ error: err.message, loading: false });
        }
    },

    updateSaloon: async (id, data) => {
        set({ loading:true, error: null});
        try {
            const res = await fetch(`http://localhost:3001/api/saloons/${id}`, {
                method: "PUT",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if(!res.ok) throw new Error('Salon güncellenemedi');
            const updated = await res.json();
            set((state) => ({
                saloons: state.saloons.map((s) => (s.id === id ? updated: s)),
                loading: false,
            }));
        } catch (err: any) {
             set({ error: err.message, loading: false });
        }
    },

    deleteSaloon: async (id) => {
        set({ loading: true, error: null });
        try {
            const res = await fetch(`http://localhost:3001/api/saloons/${id}`, {
                method: "DELETE",
            });
            if(!res.ok) throw new Error("Salon silinemedi");
            await res.json();
            set((state) => ({
                saloons: state.saloons.filter((s) => s.id !== id),
                loading: false,
            }));
        } catch (err: any) {
             set({ error: err.message, loading: false });
        }
    }
}));

export default useSaloonStore