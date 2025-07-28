import React, { useEffect, useState } from "react";
import { useReservationStore } from "../store/useReservationStore";
import { Reservation } from "../types/Reservation";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import ReservationEditForm from "./ReservationEditForm"; // Yeni oluşturacağımız edit form

const ReservationList: React.FC = () => {
  const {
    reservations,
    fetchReservations,
    deleteReservation,
  } = useReservationStore();

  const [filterDate, setFilterDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [filterByCompany, setFilterByCompany] = useState<string>("");

  // Yeni: edit form açma kontrolü ve edit edilen rezervasyon
  const [openEditForm, setOpenEditForm] = useState(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);


  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const filteredReservations = reservations
    .filter((res) => res.date.slice(0, 10) === filterDate)
    .filter((res) =>
      res.companyRate?.companyName
        ?.toLowerCase()
        .includes(filterByCompany.toLowerCase())
    );

  const handleDelete = async (id: string) => {
    await deleteReservation(id);
  };

  // Edit butonuna tıklayınca
  const handleEditClick = (res: Reservation) => {
    setEditingReservation(res);
    setOpenEditForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeEditForm = () => {
    setOpenEditForm(false);
    setEditingReservation(null);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-[#555879] text-center">
        Rezervasyon Listesi
      </h1>

      {/* Filtreler */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="border rounded px-3 py-2 w-full sm:w-1/3"
        />
        <input
          type="text"
          value={filterByCompany}
          onChange={(e) => setFilterByCompany(e.target.value)}
          placeholder="Ara (Müşteri/Firma)"
          className="border rounded px-3 py-2 w-full sm:w-2/3"
        />
      </div>

      {/* Liste */}
      <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
        <table className="min-w-[1200px] w-full table-auto text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 text-xs uppercase">
            <tr>
              {[
                "Rez. No", "Tarih", "G/D Nokta", "Müşteri",
                "M1", "M2", "M3", "V1", "V2",
                "T", "Y", "F", "R", "TK", "Oda", "Uyr",
                "Masa", "Tur", "Açıklama", "Ödeme",
                "Veren", "Alan", "Tahsilat", "Fir. Ücr.", "Fiyat", "İşlem",
              ].map((col, idx) => (
                <th
                  key={idx}
                  className="px-4 py-3 whitespace-nowrap text-center border"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {filteredReservations.map((res) => (
              <tr key={res.id} className="hover:bg-gray-50 text-center">
                <td className="px-3 py-2 border">{res.reservationNo}</td>
                <td className="px-3 py-2 border">
                  {new Date(res.date).toLocaleDateString("tr-TR")}
                </td>
                <td className="px-3 py-2 border">{res.arrivalTransfer || "-"}</td>
                <td className="px-3 py-2 border">{res.companyRate?.companyName || "-"}</td>
                <td className="px-2 py-1 border">{res.m1}</td>
                <td className="px-2 py-1 border">{res.m2}</td>
                <td className="px-2 py-1 border">{res.m3}</td>
                <td className="px-2 py-1 border">{res.v1}</td>
                <td className="px-2 py-1 border">{res.v2}</td>
                <td className="px-2 py-1 border">{res.full}</td>
                <td className="px-2 py-1 border">{res.half}</td>
                <td className="px-2 py-1 border">{res.infant}</td>
                <td className="px-2 py-1 border">{res.guide}</td>
                <td className="px-2 py-1 border">{res.totalPerson}</td>
                <td className="px-2 py-1 border">{res.room || "-"}</td>
                <td className="px-2 py-1 border">{res.nationality || "-"}</td>
                <td className="px-2 py-1 border">{res.resTable?.name || "-"}</td>
                <td className="px-2 py-1 border">{res.tour}</td>
                <td className="px-2 py-1 border">{res.description || "-"}</td>
                <td className="px-2 py-1 border">{res.paymentType}</td>
                <td className="px-2 py-1 border">{res.companyRate?.companyName || "-"}</td>
                <td className="px-2 py-1 border">{res.resTaker?.username || "-"}</td>
                <td className="px-2 py-1 border">{res.moneyReceived}</td>
                <td className="px-2 py-1 border">{res.moneyToPayCompany}</td>
                <td className="px-2 py-1 border">{res.fullPrice}</td>
                <td className="px-2 py-1 border space-x-2">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
                    onClick={() => handleEditClick(res)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                    onClick={() => handleDelete(res.id)}
                  >
                    <MdDeleteForever />
                  </button>
                </td>
              </tr>
            ))}
            {filteredReservations.length === 0 && (
              <tr>
                <td colSpan={26} className="text-center p-4 text-gray-500">
                  Kayıt bulunamadı.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>


      {/* Edit için ayrı form */}
      {openEditForm && editingReservation && (
        <ReservationEditForm
          reservation={editingReservation}
          closeForm={closeEditForm}
        />
      )}
    </div>
  );
};

export default ReservationList;
