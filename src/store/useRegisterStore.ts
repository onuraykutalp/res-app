import { create } from "zustand";
import { Register, RegisterInput } from "../types/Register";
import { AccountType, Currency } from "../types/Enums";

interface RegisterStore {
  registers: Register[];
  loading: boolean;
  fetchRegisters: () => Promise<void>;
  createRegister: (data: RegisterInput) => Promise<void>;
  
}

export const useRegisterStore = create<RegisterStore>((set) => ({
  registers: [],
  loading: false,

  fetchRegisters: async () => {
    set({ loading: true });
    try {
      const res = await fetch("http://localhost:3001/api/register");
      const data = await res.json();
      set({ registers: data });
    } catch (error) {
      console.error("Failed to fetch registers", error);
    } finally {
      set({ loading: false });
    }
  },

  createRegister: async (data: RegisterInput) => {
    try {
      const res = await fetch("http://localhost:3001/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.error || "Register create failed");
      }

      const newRegister: Register = await res.json();
      set((state) => ({
        registers: [...state.registers, newRegister],
      }));
    } catch (error) {
      console.error("Failed to create register:", error);
    }
  },
}));
