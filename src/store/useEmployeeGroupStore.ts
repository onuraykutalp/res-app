
import { create } from "zustand";
import type { EmployeeGroup } from "../types/EmployeeGroup";

interface EmployeeGroupStore {
    groups: EmployeeGroup[],
    fetchGroups: () => Promise<void>;
    addGroup: (groupName: string) => Promise<void>;
}

export const useEmployeeGroupStore = create<EmployeeGroupStore>((set, get) => ({
  groups: [],
  fetchGroups: async () => {
    try {
      const res = await fetch('http://localhost:3001/api/employee-groups');
      if (!res.ok) throw new Error('Failed to fetch groups');
      const data: EmployeeGroup[] = await res.json();
      set({ groups: data });
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  },
  addGroup: async (groupName: string) => {
    try {
      const res = await fetch('http://localhost:3001/api/employee-groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupName }),
      });
      if (!res.ok) throw new Error('Failed to add group');
      await get().fetchGroups();  // Eklemeden sonra listeyi güncelle
    } catch (error) {
      console.error('Error adding group:', error);
    }
  },
}));

