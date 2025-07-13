import { create } from "zustand";
import { Client } from "../types/Client";


interface ClientStore {
  clients: Client[];
  fetchClients: () => Promise<void>;
  addClient: (client: Omit<Client, "id" | "createdAt" | "whoCreated" | "whoUpdated" | "lastUpdate"> & { whoCreatedId: string }) => Promise<void>;
  updateClient: (id: string, client: Omit<Client, "id" | "createdAt" | "whoCreated" | "whoUpdated" | "lastUpdate"> & { whoUpdatedId: string }) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
}

export const useClientStore = create<ClientStore>((set, get) => ({
  clients: [],
  fetchClients: async () => {
    try {
      const res = await fetch("http://localhost:3001/api/clients");
      if (!res.ok) throw new Error("Failed to fetch clients");
      const data: Client[] = await res.json();
      set({ clients: data });
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  },
  addClient: async (client) => {
    try {
      const res = await fetch("http://localhost:3001/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(client),
      });
      if (!res.ok) throw new Error("Failed to add client");
      await get().fetchClients();
    } catch (error) {
      console.error("Error adding client:", error);
    }
  },
  updateClient: async (id, client) => {
    try {
      const res = await fetch(`http://localhost:3001/api/clients/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(client),
      });
      if (!res.ok) throw new Error("Failed to update client");
      await get().fetchClients();
    } catch (error) {
      console.error("Error updating client:", error);
    }
  },
  deleteClient: async (id) => {
    try {
      const res = await fetch(`http://localhost:3001/api/clients/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete client");
      await get().fetchClients();
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  },
}));