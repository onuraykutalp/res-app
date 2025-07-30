import { create } from "zustand";
import { Reservation, ReservationInput, MenuPersonCount } from "../types/Reservation";

// Menu toplam kişi sayısını hesaplayan yardımcı fonksiyon
function countMenuPersons(menu: MenuPersonCount): number {
  return (
    (menu.full || 0) +
    (menu.half || 0) +
    (menu.infant || 0) +
    (menu.guide || 0)
  );
}

// ReservationInput'tan backend'e uygun formatta veri üreten dönüştürücü
function transformReservationInput(data: ReservationInput): any {
  return {
    ...data,
    m1: countMenuPersons(data.m1),
    m2: countMenuPersons(data.m2),
    m3: countMenuPersons(data.m3),
    v1: countMenuPersons(data.v1),
    v2: countMenuPersons(data.v2),
    totalPerson:
      countMenuPersons(data.m1) +
      countMenuPersons(data.m2) +
      countMenuPersons(data.m3) +
      countMenuPersons(data.v1) +
      countMenuPersons(data.v2),
  };
}

interface ReservationStore {
  reservations: Reservation[];
  fetchReservations: () => Promise<void>;
  createReservation: (data: ReservationInput) => Promise<void>;
  updateReservation: (id: string, data: ReservationInput) => Promise<void>;
  deleteReservation: (id: string) => Promise<void>;
}

export const useReservationStore = create<ReservationStore>((set) => ({
  reservations: [],

  fetchReservations: async () => {
    try {
      const res = await fetch("http://localhost:3001/api/reservations");
      const data = await res.json();
      if (!Array.isArray(data)) {
        console.error("API response is not an array:", data);
        return;
      }
      set({ reservations: data });
    } catch (error) {
      console.error("Fetch error:", error);
    }
  },

  createReservation: async (data: ReservationInput) => {
    try {
      const transformedData = transformReservationInput(data);
      const res = await fetch("http://localhost:3001/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transformedData),
      });
      if (!res.ok) throw new Error("Create failed");
      const newReservation: Reservation = await res.json();
      set((state) => ({
        reservations: [...state.reservations, newReservation],
      }));
    } catch (error) {
      console.error("Create error:", error);
    }
  },

  updateReservation: async (id: string, data: ReservationInput) => {
    try {
      const transformedData = transformReservationInput(data);
      const res = await fetch(`http://localhost:3001/api/reservations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transformedData),
      });
      if (!res.ok) throw new Error("Update failed");
      const updatedReservation: Reservation = await res.json();
      set((state) => ({
        reservations: state.reservations.map((r) =>
          r.id === id ? updatedReservation : r
        ),
      }));
    } catch (error) {
      console.error("Update error:", error);
    }
  },

  deleteReservation: async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3001/api/reservations/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      set((state) => ({
        reservations: state.reservations.filter((r) => r.id !== id),
      }));
    } catch (error) {
      console.error("Delete error:", error);
    }
  },
}));
