import { create } from 'zustand';
import { ResTable } from '../types/ResTable';
import { Saloon } from '../types/Saloon';

const API_BASE = 'http://localhost:3001/api';

interface ResTableState {
  resTables: ResTable[];
  saloons: Saloon[];
  fetchResTables: () => Promise<void>;
  fetchResTablesBySaloonId: (saloonId: string) => Promise<void>;
  fetchSaloons: () => Promise<void>;
  addResTable: (table: { name: string; capacity: number; saloonId: string }) => Promise<void>;
  updateResTable: (id: string, table: { name: string; capacity: number; saloonId: string }) => Promise<void>;
  deleteResTable: (id: string) => Promise<void>;
}

export const useResTableStore = create<ResTableState>((set, get) => ({
  resTables: [],
  saloons: [],

  fetchResTables: async () => {
    try {
      const res = await fetch(`${API_BASE}/restables`);
      if (!res.ok) throw new Error('Failed to fetch restables');
      const data = await res.json();
      set({ resTables: data });
    } catch (error) {
      console.error('Error fetching resTables:', error);
    }
  },

  fetchResTablesBySaloonId: async (saloonId: string) => {
  try {
    const res = await fetch(`${API_BASE}/restables/saloon/${saloonId}`);
    if (!res.ok) throw new Error('Belirtilen salona ait masalar getirilemedi');
    const data = await res.json();
    set({ resTables: data });
  } catch (error) {
    console.error('Salona göre masa çekme hatası:', error);
  }
},

  fetchSaloons: async () => {
    try {
      const res = await fetch(`${API_BASE}/saloons`);
      if (!res.ok) throw new Error('Failed to fetch saloons');
      const data = await res.json();
      set({ saloons: data });
    } catch (error) {
      console.error('Error fetching saloons:', error);
    }
  },

  addResTable: async ({ name, capacity, saloonId }) => {
  try {
    const res = await fetch('http://localhost:3001/api/restables', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, capacity, saloonId }),
    });
    const newTable = await res.json();
    console.log("Yeni masa:", newTable);  // buraya ekle
    set(state => ({ resTables: [...state.resTables, newTable] }));
  } catch (error) {
    console.error('Error adding resTable:', error);
  }
},

  updateResTable: async (id, { name, capacity, saloonId }) => {
    try {
      const res = await fetch(`${API_BASE}/restables/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, capacity, saloonId }),
      });
      if (!res.ok) throw new Error('Failed to update resTable');
      const updatedTable = await res.json();
      set(state => ({
        resTables: state.resTables.map(t => (t.id === id ? updatedTable : t))
      }));
    } catch (error) {
      console.error('Error updating resTable:', error);
    }
  },

  deleteResTable: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/restables/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete resTable');
      set(state => ({ resTables: state.resTables.filter(t => t.id !== id) }));
    } catch (error) {
      console.error('Error deleting resTable:', error);
    }
  }
}));
