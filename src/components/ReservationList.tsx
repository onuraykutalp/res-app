import React, { useEffect, useState } from "react";
import { useReservationStore } from "../store/useReservationStore";
import { MenuPersonCount, Reservation, ReservationInput } from "../types/Reservation";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";

const ReservationList: React.FC = () => {
  
  const {
    reservations,
    fetchReservations,
    updateReservation,
    deleteReservation,
  } = useReservationStore();

  const [filterDate, setFilterDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [filterByCompany, setFilterByCompany] = useState<string>("");

  const filteredByCompany = reservations.filter((res) => res.companyRate?.company.includes(filterByCompany));

  const filteredReservations = reservations.filter(
    (res) => res.date.slice(0, 10) === filterDate
  );

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedReservation, setEditedReservation] = useState<Partial<ReservationInput>>({});

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  function convertToMenuPersonCount(value: any): MenuPersonCount {
  // Eğer sayıysa, tüm adetleri sadece full olarak atayabilir ya da uygun şekilde düzenle
  if (typeof value === "number") {
    return { full: value, half: 0, infant: 0, guide: 0 };
  }
  return value; // eğer zaten doğru tipteyse
}

  const handleEdit = (reservation: Reservation) => {
    setEditingId(reservation.id);
    setEditedReservation({
  ...reservation,
  m1: convertToMenuPersonCount(reservation.m1),
  m2: convertToMenuPersonCount(reservation.m2),
  m3: convertToMenuPersonCount(reservation.m3),
  v1: convertToMenuPersonCount(reservation.v1),
  v2: convertToMenuPersonCount(reservation.v2),
});
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Eğer sayı alanı ise parseInt yapabiliriz (isteğe bağlı)
    const numberFields = [
      "m1",
      "m2",
      "m3",
      "v1",
      "v2",
      "full",
      "half",
      "infant",
      "guide",
      "moneyReceived",
      "moneyToPayCompany",
      "fullPrice",
    ];

    setEditedReservation((prev) => ({
      ...prev,
      [name]: numberFields.includes(name) ? parseInt(value) || 0 : value,
    }));
  };

  const handleUpdate = async () => {
    if (editingId) {
      await updateReservation(editingId, editedReservation as ReservationInput);
      setEditingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteReservation(id);
  };

  return (
    <div className="p-4">
  <h1 className="text-2xl font-bold mb-4 text-[#555879] text-center">Rezervasyon Listesi</h1>

  {/* Filtre alanı */}
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
            'Rez. No', 'Rez.Tarih', 'G/D Nokta', 'Müşteri',
            'M1', 'M2', 'M3', 'V1', 'V2',
            'T', 'Y', 'F', 'R', 'TK', 'Oda', 'Uyr',
            'Masa', 'Tur', 'Açıklama', 'Ödeme',
            'Veren', 'Alan', 'Tahsilat', 'Fir. Ücr.', 'Fiyat', 'İşlem'
          ].map((col, idx) => (
            <th key={idx} className="px-4 py-3 whitespace-nowrap text-center border">{col}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100 bg-white">
        {filteredReservations.map((res) => (
          <tr key={res.id} className="hover:bg-gray-50 text-center">
            <td className="px-3 py-2 border">{res.reservationNo}</td>
            <td className="px-3 py-2 border">
              {editingId === res.id ? (
                <input
                  type="datetime-local"
                  value={
                    editedReservation.date
                      ? new Date(editedReservation.date).toISOString().slice(0, 16)
                      : ''
                  }
                  onChange={handleChange}
                  name="date"
                  className="border rounded px-1 py-0.5 w-full"
                />
              ) : new Date(res.date).toLocaleDateString("tr-TR")}
            </td>
            <td className="px-3 py-2 border">{res.arrivalTransfer || "-"}</td>
            <td className="px-3 py-2 border">{res.companyRate?.company || "-"}</td>
            <td className="px-2 py-1 border">{res.m1 || "-"}</td>
            <td className="px-2 py-1 border">{res.m2 || "-"}</td>
            <td className="px-2 py-1 border">{res.m3 || "-"}</td>
            <td className="px-2 py-1 border">{res.v1 || "-"}</td>
            <td className="px-2 py-1 border">{res.v2 || "-"}</td>
            <td className="px-2 py-1 border">{res.full || "-"}</td>
            <td className="px-2 py-1 border">{res.half || "-"}</td>
            <td className="px-2 py-1 border">{res.infant || "-"}</td>
            <td className="px-2 py-1 border">{res.guide || "-"}</td>
            <td className="px-2 py-1 border">{res.totalPerson || "-"}</td>
            <td className="px-2 py-1 border">{res.room || "-"}</td>
            <td className="px-2 py-1 border">{res.nationality || "-"}</td>
            <td className="px-2 py-1 border">{res.resTable?.name || "-"}</td>
            <td className="px-2 py-1 border">{res.tour || "-"}</td>
            <td className="px-2 py-1 border">{res.description || "-"}</td>
            <td className="px-2 py-1 border">{res.paymentType || "-"}</td>
            <td className="px-2 py-1 border">{res.companyRate?.company || "-"}</td>
            <td className="px-2 py-1 border">{res.resTaker?.username || "-"}</td>
            <td className="px-2 py-1 border">{res.moneyReceived || "-"}</td>
            <td className="px-2 py-1 border">{res.moneyToPayCompany || "-"}</td>
            <td className="px-2 py-1 border">{res.fullPrice || "-"}</td>
            <td className="px-2 py-1 border space-x-2">
              {editingId === res.id ? (
                <>
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs"
                    onClick={handleUpdate}
                  >
                    Kaydet
                  </button>
                  <button
                    className="bg-gray-400 hover:bg-gray-500 text-white px-2 py-1 rounded text-xs"
                    onClick={() => setEditingId(null)}
                  >
                    Vazgeç
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
                    onClick={() => handleEdit(res)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                    onClick={() => handleDelete(res.id)}
                  >
                    <MdDeleteForever />
                  </button>
                </>
              )}
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
</div>

  );
};

export default ReservationList;
