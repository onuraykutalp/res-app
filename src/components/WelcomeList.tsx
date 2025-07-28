import React, { useEffect } from "react";
import { useReservationStore } from "../store/useReservationStore";

const WelcomeList = () => {

  const { reservations, fetchReservations } = useReservationStore();

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);


  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-[#555879] text-center">Karşılama Listesi</h2>

      <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
        <table className="min-w-[900px] w-full table-auto text-sm text-left divide-y divide-gray-200">
          <thead className="bg-gray-100 text-gray-700 text-xs uppercase">
            <tr>
              {[
                "G/D Transfer Noktası",
                "Acenta / Otel / Rehber",
                "T", "Y", "F", "R", "TK",
                "Masa", "Tur", "Ödeme", "Açıklama"
              ].map((header, idx) => (
                <th
                  key={idx}
                  className="px-4 py-3 text-center border whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {reservations.length === 0 ? (
              <tr>
                <td
                  colSpan={11}
                  className="text-center py-6 text-gray-500 italic text-sm"
                >
                  Kayıt bulunamadı.
                </td>
              </tr>
            ) : (
              reservations.map((reservation) => (
                <tr
                  key={reservation.id}
                  className="hover:bg-gray-50 transition-colors duration-200 text-center"
                >
                  <td className="px-3 py-2 border whitespace-nowrap">
                    {reservation.arrivalTransfer || '-'} / {reservation.returnTransfer || '-'}
                  </td>
                  <td className="px-3 py-2 border whitespace-nowrap">
                    {reservation.companyRate?.companyName || '-'}
                  </td>
                  <td className="px-2 py-1 border">{reservation.full || '-'}</td>
                  <td className="px-2 py-1 border">{reservation.half || '-'}</td>
                  <td className="px-2 py-1 border">{reservation.infant || '-'}</td>
                  <td className="px-2 py-1 border">{reservation.guide || '-'}</td>
                  <td className="px-2 py-1 border">{reservation.totalPerson || '-'}</td>
                  <td className="px-2 py-1 border">{reservation.resTable?.name || '-'}</td>
                  <td className="px-2 py-1 border">{reservation.tour || '-'}</td>
                  <td className="px-2 py-1 border">{reservation.paymentType || '-'}</td>
                  <td
                    className="px-3 py-2 border max-w-xs truncate"
                    title={reservation.description || '-'}
                  >
                    {reservation.description || '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>

  )
}

export default WelcomeList