import React, { useEffect, useState } from "react";
import { useReservationStore } from "../store/useReservationStore";

const TransferList = () => {
  const { reservations, fetchReservations } = useReservationStore();
  const [filteredByDate, setFilteredByDate] = useState<string>(new Date().toISOString().slice(0, 10) );
  const [filterByClient, setFilterByClient] = useState<string>("");

  // Filter by client name
  const filteredByClient = filterByClient ? 
  reservations.filter(reservation => reservation.companyRate?.company.toLowerCase().includes(filterByClient.toLowerCase())) : reservations;

  const filterDate = filteredByDate || new Date().toISOString().slice(0, 10);

   const filteredReservations = reservations.filter(
    (res) => res.date.slice(0, 10) === filterDate
  );

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  return (
    <div className="p-4">
      <div className="flex justify-center items-center mb-4 gap-2">
        <input type="date"
          value={filteredByDate}
          onChange={(e) => setFilteredByDate(e.target.value)}
          className="border rounded px-2 py-1 mb-4"
        />
        
        <input type="text" placeholder="Ara (Şirket Adı)"
        value={filterByClient}
        onChange={(e) => setFilterByClient(e.target.value)}
        className="border rounded px-2 py-1 mb-4"
        />

      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                "Rez. No",
                "Geliş Bölge",
                "Geliş Noktası",
                "Dönüş Bölgesi",
                "Dönüş Noktası",
                "Kişi",
                "Acenta",
                "Rez. Açıklama",
                "Transfer Açıklama",
              ].map((header) => (
                <th
                  key={header}
                  className="text-left px-4 py-3 text-gray-700 font-medium text-sm whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {reservations.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  className="text-center py-6 text-gray-500 italic text-sm"
                >
                  Kayıt bulunamadı.
                </td>
              </tr>
            )}

            {filteredReservations.map((reservation) => (
              filteredByClient.includes(reservation) && (
              <tr
                key={reservation.id}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="px-4 py-2 whitespace-nowrap">{reservation.reservationNo}</td>
                <td className="px-4 py-2 whitespace-nowrap">{reservation.arrivalLocation}</td>
                <td className="px-4 py-2 whitespace-nowrap">{reservation.arrivalTransfer}</td>
                <td className="px-4 py-2 whitespace-nowrap">{reservation.returnLocation}</td>
                <td className="px-4 py-2 whitespace-nowrap">{reservation.returnTransfer}</td>
                <td className="px-4 py-2 whitespace-nowrap">{reservation.totalPerson}</td>
                <td className="px-4 py-2 whitespace-nowrap">{reservation.companyRate?.company}</td>
                <td className="px-4 py-2 max-w-xs truncate" title={reservation.description || '-'}>
                  {reservation.description || '-'}
                </td>
                <td className="px-4 py-2 max-w-xs truncate" title={reservation.description || '-'}>
                  {reservation.description || '-'}
                </td>
              </tr>
              )
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransferList;
