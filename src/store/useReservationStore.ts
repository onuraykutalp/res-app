import { create } from 'zustand';
import type { Reservation } from '../types/Reservation';

type ReservationStore = {
    reservations: Reservation[];
    addReservation: ( reservation: Reservation ) => void;
    removeReservation: (id: string) => void;
    editReservation: (reservation: Reservation) => void; 
    setReservations: (reservations: Reservation[]) => void;
}

export const useReservationStore = create<ReservationStore>((set) => ({
    reservations: [],
    addReservation: (reservation) => 
        set((state) => ({
            reservations: [...state.reservations, reservation],
        })),
    removeReservation: (id) => 
        set((state) => ({
            reservations: state.reservations.filter((r) => r.id !== id),
        })),
    editReservation: (updatedReservation) => 
        set((state) => ({
            reservations: state.reservations.map((r) => 
            r.id === updatedReservation.id ? updatedReservation : r
            ),
        })),
    setReservations: (reservations) => set({reservations}),
}))