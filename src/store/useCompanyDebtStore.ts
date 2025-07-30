import { create } from "zustand";


export interface CompanyDebt {
  id: string;
  name: string;
  companyType: string;
  currency: string;
  tax?: number;
  debt: number;
  credit: number;
  balance: number;
  createdAt: string;
}

interface CompanyDebtState {
  companyDebts: CompanyDebt[];
  fetchCompanyDebts: () => Promise<void>;
  updateCompanyDebt: (id: string, data: Partial<CompanyDebt>) => Promise<void>;
}

export const useCompanyDebtStore = create<CompanyDebtState>((set) => ({
  companyDebts: [],
  fetchCompanyDebts: async () => {
    try {
      const res = await fetch("http://localhost:3001/api/company-debts");
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      set({ companyDebts: data });
    } catch (error) {
      console.error("Failed to fetch company debts:", error);
    }
  },
  updateCompanyDebt: async (id, data) => {
    try {
      const res = await fetch(`http://localhost:3001/api/company-debts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const updatedDebt = await res.json();
      set((state) => ({
        companyDebts: state.companyDebts.map((cd) =>
          cd.id === id ? updatedDebt : cd
        ),
      }));
    } catch (error) {
      console.error("Failed to update company debt:", error);
    }
  },
}));
