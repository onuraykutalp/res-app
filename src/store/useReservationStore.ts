import { create } from "zustand";
import type { Reservation, ReservationInput, TransferInput } from "../types/Reservation"; // doğru yolu kullan

interface ReservationState {
  reservations: Reservation[];
  fetchReservations: () => Promise<void>;
  createReservation: (data: ReservationInput & { transfers?: TransferInput[] }) => Promise<void>;
  updateReservation: (
    id: string,
    input: Partial<ReservationInput> & { transfers?: TransferInput[]; deletedTransferIds?: string[] }
  ) => Promise<void>;
  deleteReservation: (id: string) => Promise<void>;
}

export const useReservationStore = create<ReservationState>((set, get) => ({
  reservations: [],

  fetchReservations: async () => {
    try {
      const res = await fetch("http://localhost:3001/api/reservations");
      const data = await res.json();
      set({ reservations: data });
    } catch (error) {
      console.error("Fetch reservations error:", error);
    }
  },

  createReservation: async (data) => {
    try {
      const res = await fetch("http://localhost:3001/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const created = await res.json();
      set((state) => ({ reservations: [...state.reservations, created] }));
    } catch (error) {
      console.error("Create reservation error:", error);
    }
  },

  updateReservation: async (id, data) => {
    try {
      const res = await fetch(`http://localhost:3001/api/reservations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const updated = await res.json();

      set((state) => ({
        reservations: state.reservations.map((r) => (r.id === id ? updated : r)),
      }));
    } catch (error) {
      console.error("Update reservation error:", error);
    }
  },

  deleteReservation: async (id) => {
    try {
      await fetch(`http://localhost:3001/api/reservations/${id}`, { method: "DELETE" });
      set((state) => ({
        reservations: state.reservations.filter((r) => r.id !== id),
      }));
    } catch (error) {
      console.error("Delete reservation error:", error);
    }
  },
}));
