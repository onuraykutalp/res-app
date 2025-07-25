import { OutcomeGroup } from '../types/OutcomeGroup';
import { create } from 'zustand';

type createOutcomeGroup = Omit<OutcomeGroup, "id" | "createdAt">;

interface OutcomeGroupProps {
    outcomeGroups: OutcomeGroup[];
    fetchOutcomeGroups: () => Promise<void>;
    addOutcomeGroup: (group: createOutcomeGroup) => Promise<void>;
    updateOutcomeGroup: (id: string, data: Partial<OutcomeGroup>) => Promise<void>;
    deleteOutcomeGroup: (id: string) => Promise<void>;
}

export const useOutcomeGroupStore = create<OutcomeGroupProps>((set) => ({
  outcomeGroups: [],
  fetchOutcomeGroups: async () => {
    // Fetch logic here
    const res = await fetch("http://localhost:3001/api/outcome-groups");
    const data = await res.json();
    set({ outcomeGroups: data });
  },
  addOutcomeGroup: async (group: createOutcomeGroup) => {
    // Add logic here
    const res = await fetch("http://localhost:3001/api/outcome-groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(group),
    });
    const newGroup = await res.json();
    set((state) => ({
        outcomeGroups: [...state.outcomeGroups, newGroup],
    }));
  },
  updateOutcomeGroup: async (id, data) => {
    // Update logic here
    const res = await fetch(`http://localhost:3001/api/outcome-groups/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const updateGroup = await res.json();
    set((state) => ({
        outcomeGroups: state.outcomeGroups.map((g) => (g.id ===id ? updateGroup : g))
    }));
  },
  deleteOutcomeGroup: async (id) => {
    // Delete logic here
    await fetch(`http://localhost:3001/api/outcome-groups/${id}`, {
      method: "DELETE",
    });
    set((state) => ({
        outcomeGroups: state.outcomeGroups.filter((g) => g.id !== id),
    }))
  },
}));