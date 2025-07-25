import { create } from "zustand";
import { Outcome } from "../types/Outcome";

interface OutcomeInput {
  name: string;
  groupId: string;
  ship: boolean;
  accountant: boolean;
}

interface OutcomeProps {
  outcomes: Outcome[];
  editingOutcome: Outcome | null;
  fetchOutcomes: () => Promise<void>;
  addOutCome: (data: OutcomeInput) => Promise<void>;
  updateOutcome: (id: string, data: Partial<OutcomeInput>) => Promise<void>;
  deleteOutcome: (id: string) => Promise<void>;
  setEditingOutcome: (outcome: Outcome | null) => void;
}

export const useOutcomeStore = create<OutcomeProps>((set) => ({
  outcomes: [],
  editingOutcome: null,

  fetchOutcomes: async () => {
    const res = await fetch("http://localhost:3001/api/outcomes");
    if (!res.ok) throw new Error("Giderler alınamadı.");
    const data = await res.json();
    set({ outcomes: data });
  },

  addOutCome: async (data) => {
    const res = await fetch("http://localhost:3001/api/outcomes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const newOutcome = await res.json();
    set((state) => ({
      outcomes: [...state.outcomes, newOutcome],
    }));
  },

  updateOutcome: async (id, data) => {
    const res = await fetch(`http://localhost:3001/api/outcomes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const updatedOutcome = await res.json();

    set((state) => ({
      outcomes: state.outcomes.map((o) => (o.id === id ? updatedOutcome : o)),
      editingOutcome: null, // güncelleme sonrası edit modu kapansın
    }));
  },

  deleteOutcome: async (id) => {
    await fetch(`http://localhost:3001/api/outcomes/${id}`, {
      method: "DELETE",
    });
    set((state) => ({
      outcomes: state.outcomes.filter((o) => o.id !== id),
    }));
  },

  setEditingOutcome: (outcome) => set({ editingOutcome: outcome }),
}));
