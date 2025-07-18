import { create } from "zustand";
import { GeneralIncome } from "../types/GeneralIncome";


interface GeneralIncomeState {
    incomes: GeneralIncome[],
    fetchIncomes: () => Promise<void>,
    addIncome: (income: Omit<GeneralIncome, 'id' | 'createdAT'>) => Promise<void>,
    updateIncome: (id: string, income: Omit<GeneralIncome, 'id' | 'createdAt'>) => Promise<void>;
    deleteIncome: (id: string) => Promise<void>,
}

export const useGeneralIncomeStore = create<GeneralIncomeState>((set) => ({
    incomes: [],

    fetchIncomes: async () => {
        const res = await fetch('http://localhost:3001/api/general-incomes');
        const data = await res.json();
        set({ incomes: data });
    },

    addIncome: async (income) => {
        const res = await fetch('http://localhost:3001/api/general-incomes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(income),
        });
        const newIncome = await res.json();
        set((state) => ({ incomes: [...state.incomes, newIncome] }));
    },

    updateIncome: async (id, updatedData) => {
        const res = await fetch(`http://localhost:3001/api/general-incomes/:${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData),
        });
        if (!res.ok) throw new Error('Veriler güncellenemedi');

        const updatedIncome = await res.json();

        set((state) => ({
            incomes: state.incomes.map((income) => income.id === id ? updatedIncome : income),
        }));
    },

    deleteIncome: async (id) => {
        await fetch(`http://localhost:3001/api/general-incomes/:${id}`, {
            method: 'DELETE',
        });
        set((state) => ({
            incomes: state.incomes.filter((i) => i.id !== id),
        }));
    }

}))