import { create } from "zustand";
import { TransferPoint } from "../types/TransferPoint";

interface TransferPointState {
  transferPoints: TransferPoint[];
  fetchTransferPoints: () => Promise<void>;
  createTransferPoint: (data: Omit<TransferPoint, "id" | "createdAt" | "location">) => Promise<void>;
  updateTransferPoint: (id: string, data: Partial<TransferPoint>) => Promise<void>;
  deleteTransferPoint: (id: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const useTransferPointStore = create<TransferPointState>((set) => ({
  transferPoints: [],
  loading: false,
  error: null,

  fetchTransferPoints: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("http://localhost:3001/api/transfer-points");
      const data = await res.json();
      set({ transferPoints: data, loading: false });
    } catch (err: unknown) {
      console.error("Veri alınamadı", err);
      set({ error: "Veriler alınamadı", loading: false });
    }
  },

  createTransferPoint: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("http://localhost:3001/api/transfer-points", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const newItem = await res.json();
      set((state) => ({
        transferPoints: [newItem, ...state.transferPoints],
        loading: false,
      }));
    } catch (err: unknown) {
      console.error("Veri eklenemedi", err);
      set({ error: "Ekleme işlemi başarısız", loading: false });
    }
  },

  updateTransferPoint: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`http://localhost:3001/api/transfer-points/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const updated = await res.json();
      set((state) => ({
        transferPoints: state.transferPoints.map((item) =>
          item.id === id ? updated : item
        ),
        loading: false,
      }));
    } catch (err: unknown) {
      console.error("Veri güncellenemedi", err);
      set({ error: "Güncelleme işlemi başarısız", loading: false });
    }
  },

  deleteTransferPoint: async (id) => {
    set({ loading: true, error: null });
    try {
      await fetch(`http://localhost:3001/api/transfer-points/${id}`, {
        method: "DELETE",
      });
      set((state) => ({
        transferPoints: state.transferPoints.filter((item) => item.id !== id),
        loading: false,
      }));
    } catch (err: unknown) {
      console.error("Veri silinemedi", err);
      set({ error: "Silme işlemi başarısız", loading: false });
    }
  },
}));
