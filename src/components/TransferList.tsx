import React, { useEffect, useState } from "react";
import { useReservationStore } from "../store/useReservationStore";

const TransferList = () => {
  const { reservations, fetchReservations } = useReservationStore();
  const [filteredByDate, setFilteredByDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [filterByClient, setFilterByClient] = useState<string>("");

  // Filter by client name
  const filteredByClient = filterByClient ?
    reservations.filter(reservation => reservation.companyRate?.companyName.toLowerCase().includes(filterByClient.toLowerCase())) : reservations;

  const filterDate = filteredByDate || new Date().toISOString().slice(0, 10);

  const filteredReservations = reservations.filter(
    (res) => res.date.slice(0, 10) === filterDate
  );

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  return (
    <div className="p-4">

      <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4 mb-4">
        <input
          type="date"
          value={filteredByDate}
          onChange={(e) => setFilteredByDate(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-sm w-full sm:w-auto"
        />
        <input
          type="text"
          placeholder="Ara (Şirket Adı)"
          value={filterByClient}
          onChange={(e) => setFilterByClient(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-sm w-full sm:w-auto"
        />
      </div>

      <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
        <table className="min-w-[1000px] w-full table-auto text-sm text-left divide-y divide-gray-200">
          <thead className="bg-gray-100 text-gray-700 text-xs uppercase">
            <tr>
              <th className="px-4 py-3 text-center">Rez. No</th>
              <th className="px-4 py-3 text-center">Geliş Bölge</th>
              <th className="px-4 py-3 text-center">Geliş Noktası</th>
              <th className="px-4 py-3 text-center">Dönüş Bölge</th>
              <th className="px-4 py-3 text-center">Dönüş Noktası</th>
              <th className="px-4 py-3 text-center">Kişi</th>
              <th className="px-4 py-3 text-center">Acenta</th>
              <th className="px-4 py-3 text-center">Rez. Açıklama</th>
              <th className="px-4 py-3 text-center">Transfer Açıklama</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-100">
            {reservations.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-6 text-gray-500 italic text-sm">
                  Kayıt bulunamadı.
                </td>
              </tr>
            ) : (
              filteredReservations.map((reservation) => {
                const company = reservation.companyRate?.companyName?.toLowerCase() || "";
                const filterMatch = company.includes(filterByClient.toLowerCase());

                return filterMatch ? (
                  <tr
                    key={reservation.id}
                    className="hover:bg-gray-50 transition-colors duration-200 text-center"
                  >
                    <td className="px-4 py-2">{reservation.reservationNo || "-"}</td>
                    <td className="px-4 py-2">{reservation.arrivalLocation || "-"}</td>
                    <td className="px-4 py-2">{reservation.arrivalTransfer || "-"}</td>
                    <td className="px-4 py-2">{reservation.returnLocation || "-"}</td>
                    <td className="px-4 py-2">{reservation.returnTransfer || "-"}</td>
                    <td className="px-4 py-2">{reservation.totalPerson || "-"}</td>
                    <td className="px-4 py-2">{reservation.companyRate?.companyName || "-"}</td>
                    <td
                      className="px-4 py-2 max-w-xs truncate"
                      title={reservation.description || "-"}
                    >
                      {reservation.description || "-"}
                    </td>
                    <td
                      className="px-4 py-2 max-w-xs truncate"
                      title={reservation.description || "-"}
                    >
                      {reservation.description || "-"}
                    </td>
                  </tr>
                ) : null;
              })
            )}
          </tbody>
        </table>
      </div>
    </div>

  );
};

export default TransferList;
