import { create } from "zustand";
import { Reservation, ReservationInput } from "../types/Reservation";

interface ReservationStore {
  reservations: Reservation[];
  fetchReservations: () => Promise<void>;
  editingReservation: Reservation | null;
  setEditingReservation: (res: Reservation | null) => void;
  createReservation: (data: ReservationInput) => Promise<void>;
  updateReservation: (id: string, data: ReservationInput) => Promise<void>;
  deleteReservation: (id: string) => Promise<void>;
}

export const useReservationStore = create<ReservationStore>((set) => ({
  reservations: [],

  editingReservation: null,

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

  setEditingReservation: (res) => set({ editingReservation: res }),

  createReservation: async (data: ReservationInput) => {
    try {
      const res = await fetch("http://localhost:3001/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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
    const { m1, m2, m3, v1, v2, ...rest } = data;

    const getSafe = (val?: number) => val ?? 0;

    const formattedDate = new Date(data.date).toISOString();

    const m1Full = getSafe(m1?.full);
    const m1Half = getSafe(m1?.half);
    const m1Infant = getSafe(m1?.infant);
    const m1Guide = getSafe(m1?.guide);

    const m2Full = getSafe(m2?.full);
    const m2Half = getSafe(m2?.half);
    const m2Infant = getSafe(m2?.infant);
    const m2Guide = getSafe(m2?.guide);

    const m3Full = getSafe(m3?.full);
    const m3Half = getSafe(m3?.half);
    const m3Infant = getSafe(m3?.infant);
    const m3Guide = getSafe(m3?.guide);

    const v1Full = getSafe(v1?.full);
    const v1Half = getSafe(v1?.half);
    const v1Infant = getSafe(v1?.infant);
    const v1Guide = getSafe(v1?.guide);

    const v2Full = getSafe(v2?.full);
    const v2Half = getSafe(v2?.half);
    const v2Infant = getSafe(v2?.infant);
    const v2Guide = getSafe(v2?.guide);

    // Toplam kişi türlerine göre toplamlar
    const full = m1Full + m2Full + m3Full + v1Full + v2Full;
    const half = m1Half + m2Half + m3Half + v1Half + v2Half;
    const infant = m1Infant + m2Infant + m3Infant + v1Infant + v2Infant;
    const guide = m1Guide + m2Guide + m3Guide + v1Guide + v2Guide;

    const m1Total = m1Full + m1Half + m1Infant + m1Guide;
    const m2Total = m2Full + m2Half + m2Infant + m2Guide;
    const m3Total = m3Full + m3Half + m3Infant + m3Guide;
    const v1Total = v1Full + v1Half + v1Infant + v1Guide;
    const v2Total = v2Full + v2Half + v2Infant + v2Guide;

    const totalPerson = full + half + infant + guide;

    const menuMap: Record<string, string> = {
      m1: "M1",
      m2: "M2",
      m3: "M3",
      v1: "V1",
      v2: "V2",
    };

    const counts = { m1: m1Total, m2: m2Total, m3: m3Total, v1: v1Total, v2: v2Total };
    const tourParts = Object.entries(counts)
      .filter(([_, val]) => val > 0)
      .map(([key, val]) => `${val}-${menuMap[key]}`);
    const tour = tourParts.join(", ");

    const payload = {
      ...rest,
      date: formattedDate,
      m1: m1Total,
      m2: m2Total,
      m3: m3Total,
      v1: v1Total,
      v2: v2Total,
      full,
      half,
      infant,
      guide,
      totalPerson,
      tour,
    };

    const res = await fetch(`http://localhost:3001/api/reservations/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
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
