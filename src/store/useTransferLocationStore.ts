import { create } from "zustand";
import { TransferLocation } from "../types/TransferLocation";

interface TransferLocationState {
  locations: TransferLocation[];
  fetchTransferLocations: () => Promise<void>;
  addLocation: (location: Omit<TransferLocation, "id">) => Promise<void>;
  deleteLocation: (id: string) => Promise<void>;
  updateLocation: (location: TransferLocation) => Promise<void>;
}

export const useTransferLocationStore = create<TransferLocationState>((set) => ({
  locations: [],

  fetchTransferLocations: async () => {
    try {
      const res = await fetch("http://localhost:3001/api/transfer-locations");
      if (!res.ok) throw new Error("Failed to fetch transfer locations");
      const data: TransferLocation[] = await res.json();
      set({ locations: data });
    } catch (error) {
      console.error("Transfer Locations fetch error", error);
      set({ locations: [] });
    }
  },

  addLocation: async (location) => {
    try {
      const res = await fetch("http://localhost:3001/api/transfer-locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(location),
      });
      if (!res.ok) throw new Error("Failed to add transfer location");
      const newLoc: TransferLocation = await res.json();
      set((state) => ({ locations: [...state.locations, newLoc] }));
    } catch (error) {
      console.error("Add Transfer Location error", error);
    }
  },

  deleteLocation: async (id) => {
    try {
      const res = await fetch(`http://localhost:3001/api/transfer-locations/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete transfer location");
      set((state) => ({
        locations: state.locations.filter((loc) => loc.id !== id),
      }));
    } catch (error) {
      console.error("Delete Transfer Location error", error);
    }
  },

  updateLocation: async (updatedLoc) => {
    try {
      const res = await fetch(`http://localhost:3001/api/transfer-locations/${updatedLoc.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedLoc),
      });
      if (!res.ok) throw new Error("Failed to update transfer location");
      const newLoc: TransferLocation = await res.json();
      set((state) => ({
        locations: state.locations.map((loc) => (loc.id === newLoc.id ? newLoc : loc)),
      }));
    } catch (error) {
      console.error("Update Transfer Location error", error);
    }
  },
}));
