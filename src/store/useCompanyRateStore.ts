import { create } from "zustand";
import { CompanyRate } from "../types/CompanyRate";

type CreateCompanyRate = Omit<CompanyRate, "id" | "createdAt">;

interface CompanyRateState {
  companyRates: CompanyRate[];
  fetchCompanyRates: () => Promise<void>;
  addCompanyRate: (rate: CreateCompanyRate) => Promise<void>;
  updateCompanyRate: (id: string, data: Partial<CompanyRate>) => Promise<void>;
  deleteCompanyRate: (id: string) => Promise<void>;
}

export const useCompanyRateStore = create<CompanyRateState>((set) => ({
  companyRates: [],

  fetchCompanyRates: async () => {
    const res = await fetch("http://localhost:3001/api/company-rates");
    if (!res.ok) throw new Error("API hata verdi: " + res.status);
    const data = await res.json();
    set({ companyRates: data });
  },

  addCompanyRate: async (rate) => {
    const res = await fetch("http://localhost:3001/api/company-rates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rate),
    });
    const newRate = await res.json();
    set((state) => ({
      companyRates: [...state.companyRates, newRate],
    }));
  },

  updateCompanyRate: async (id, data) => {
    const res = await fetch(`http://localhost:3001/api/company-rates/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const updated = await res.json();
    set((state) => ({
      companyRates: state.companyRates.map((r) => (r.id === id ? updated : r)),
    }));
  },

  deleteCompanyRate: async (id) => {
    await fetch(`http://localhost:3001/api/company-rates/${id}`, {
      method: "DELETE",
    });
    set((state) => ({
      companyRates: state.companyRates.filter((r) => r.id !== id),
    }));
  },
}));
