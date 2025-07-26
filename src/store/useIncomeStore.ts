import { create } from "zustand";
import { Income } from "../types/Income";


interface IncomeInput {
    name: string,
    tax: number,
    ship: boolean,
    accountant: boolean,
}

interface IncomeProps {
    incomes: Income[],
    editingIncome: Income | null,
    fetchIncomes: () => Promise<void>,
    addIncome: (income: IncomeInput) => Promise<void>,
    updateIncome: (id: string, income: Partial<IncomeInput>) => Promise<void>,
    deleteIncome: (id: string) => Promise<void>,
    setEditingIncome: (income: Income | null) => Promise<void>,
}

export const useIncomeStore = create<IncomeProps>((set) => ({
    incomes: [],

    editingIncome: null,

    fetchIncomes: async () => {
        const res = await fetch("http://localhost:3001/api/incomes");
        if (!res.ok) throw new Error("Gelirler alınamadı.");
        const data = await res.json();
        set({ incomes: data });
    },

    addIncome: async (income) => {
        const res = await fetch("http://localhost:3001/api/incomes", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(income),
        });
        const newIncome = await res.json();
        set((state) => ({
            incomes: [...state.incomes, newIncome],
        }));
    },

    updateIncome: async (id, income) => {
        const res = await fetch(`http://localhost:3001/api/incomes/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(income),
        });
        const updatedIncome = await res.json();
        set((state) => ({
            incomes: state.incomes.map((i) => i.id === id ? updatedIncome : i),
            editingOutcome: null,
        }));
    },

    deleteIncome: async (id) => {
        await fetch(`http://localhost:3001/api/incomes/${id}`, {
            method: 'DELETE',
        });
        set((state) => ({
            incomes: state.incomes.filter((i) => i.id !== id),
        }))
    },

    setEditingIncome: async (income) => set({editingIncome: income}),
}));