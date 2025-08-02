import { useReservationStore } from "../store/useReservationStore";
import { useEffect } from "react";
import { Reservation } from "../types/Reservation";
import { useState } from "react";
import { RegisterForm } from "./RegisterForm";

export default function ReservationPaymentList() {
  const { reservations, fetchReservations } = useReservationStore();
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const gemideReservations = reservations.filter(
    (r) => r.paymentType === "Gemide"
  );

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Rezervasyon Tahsilatları</h2>
      <div className="space-y-2">
        {gemideReservations.map((r) => (
          <div key={r.id} className="border p-4 rounded flex justify-between items-center">
            <div>
              <p><strong>No:</strong> {r.reservationNo}</p>
              <p><strong>Fiyat:</strong> {r.fullPrice} {r.companyRate?.currency}</p>
            </div>
            <button
              className="bg-green-600 text-white px-3 py-1 rounded"
              onClick={() => setSelectedReservation(r)}
            >
              Tahsilat Yap
            </button>
          </div>
        ))}
      </div>

      {selectedReservation && (
        <RegisterForm
          mode="reservation"
          onClose={() => setSelectedReservation(null)}
          reservation={selectedReservation}
        />
      )}
    </div>
  );
}
