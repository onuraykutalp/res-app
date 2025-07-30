import { create } from "zustand";
import { Register } from "../types/Register"; // type'ı birazdan birlikte tanımlarız

interface RegisterStore {
  registers: Register[];
  editingRegister: Register | null;

  fetchRegisters: () => Promise<void>;
  createRegister: (data: Omit<Register, "id" | "createdAt">) => Promise<void>;
  updateRegister: (id: string, data: Partial<Register>) => Promise<void>;
  deleteRegister: (id: string) => Promise<void>;

  setEditingRegister: (register: Register) => void;
  clearEditingRegister: () => void;
}

export const useRegisterStore = create<RegisterStore>((set) => ({
  registers: [],
  editingRegister: null,

  fetchRegisters: async () => {
    const res = await fetch("/register");
    const data = await res.json();
    set({ registers: data });
  },

  createRegister: async (data) => {
    const res = await fetch("/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      await set((state) => ({
        registers: [...state.registers], // isteğe bağlı, fetch tekrar çağırılabilir
      }));
    }
  },

  updateRegister: async (id, data) => {
    const res = await fetch(`/register/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      await set((state) => ({
        editingRegister: null,
      }));
    }
  },

  deleteRegister: async (id) => {
    const res = await fetch(`/register/${id}`, { method: "DELETE" });
    if (res.ok) {
      set((state) => ({
        registers: state.registers.filter((r) => r.id !== id),
      }));
    }
  },

  setEditingRegister: (register) => set({ editingRegister: register }),
  clearEditingRegister: () => set({ editingRegister: null }),
}));
