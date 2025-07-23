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
    <div className="mx-auto p-4 justify-center items-center flex flex-col overflow-hidden">
      <h1 className='font-bold text-3xl mb-4 text-[#555879]'>Transfer Listesi</h1>
      <div className="flex flex-col sm:flex-row justify-between gap-2 w-full">
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="border rounded px-2 py-1 mb-4"
        />
        <input
          type="text"
          value={filterByCompany}
          onChange={(e) => setFilterByCompany(e.target.value)}
          placeholder="Ara (Müşteri/Firma)"
          className="border rounded px-2 py-1 mb-4"
        />
      </div>
      <div className="w-full overflow-x-auto">
        <div className="w-full overflow-x-auto">
          <table className="min-w-[900px] w-full table-auto border border-collapse">
            <thead>
              <tr className="bg-gray-100 text-center">
                <th className="border px-2 py-1">Rez. No</th>
                <th className="border px-2 py-1">Rez.Tarih</th>
                <th className="border px-2 py-1">G/D Transfer Noktası</th>
                <th className="border px-2 py-1">Müşteri (Firma)</th>
                <th className="border px-2 py-1">M1</th>
                <th className="border px-2 py-1">M2</th>
                <th className="border px-2 py-1">M3</th>
                <th className="border px-2 py-1">V1</th>
                <th className="border px-2 py-1">V2</th>
                <th className="border px-2 py-1">T</th>
                <th className="border px-2 py-1">Y</th>
                <th className="border px-2 py-1">F</th>
                <th className="border px-2 py-1">R</th>
                <th className="border px-2 py-1">TK</th>
                <th className="border px-2 py-1">Oda</th>
                <th className="border px-2 py-1">Uyr</th>
                <th className="border px-2 py-1">Masa</th>
                <th className="border px-2 py-1">Tur</th>
                <th className="border px-2 py-1">Açıklama</th>
                <th className="border px-2 py-1">Ödeme</th>
                <th className="border px-2 py-1">Rez. Veren</th>
                <th className="border px-2 py-1">Rez. Alan</th>
                <th className="border px-2 py-1">Tahsilat</th>
                <th className="border px-2 py-1">Fir. Ücr.</th>
                <th className="border px-2 py-1">Rez. Fiyat</th>
                <th className="border px-2 py-1">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.map((res) => (
                filteredByCompany.length > 0 && !filteredByCompany.includes(res) ? null : (
                  <tr key={res.id} className="text-center">
                    <td className="border px-2 py-1">
                      {res.reservationNo}
                    </td>
                    <td className="border px-2 py-1">
                      {editingId === res.id ? (
                        <textarea
                          name="description"
                          value={
                            editedReservation.date
                              ? new Date(editedReservation.date).toISOString().slice(0, 16)
                              : ""
                          }
                          onChange={handleChange}
                          className="border rounded px-1 py-0.5 w-full"
                          rows={2}
                        />
                      ) : (
                        new Date(res.date).toLocaleDateString("tr-TR")
                      )}
                    </td>
                    <td className="border px-2 py-1">{res.arrivalTransfer || "-"}</td>
                    <td className="border px-2 py-1">{res.companyRate?.company || "-"}</td>
                    <td className="border px-2 py-1">{res.m1 || "-"}</td>
                    <td className="border px-2 py-1">{res.m2 || "-"}</td>
                    <td className="border px-2 py-1">{res.m3 || "-"}</td>
                    <td className="border px-2 py-1">{res.v1 || "-"}</td>
                    <td className="border px-2 py-1">{res.v2 || "-"}</td>
                    <td className="border px-2 py-1">{res.full || "-"}</td>
                    <td className="border px-2 py-1">{res.half || "-"}</td>
                    <td className="border px-2 py-1">{res.infant || "-"}</td>
                    <td className="border px-2 py-1">{res.guide || "-"}</td>
                    <td className="border px-2 py-1">{res.totalPerson || "-"}</td>
                    <td className="border px-2 py-1">{res.room || "-"}</td>
                    <td className="border px-2 py-1">{res.nationality || "-"}</td>
                    <td className="border px-2 py-1">{res.resTable?.name || "-"}</td>
                    <td className="border px-2 py-1">{res.tour || "-"}</td>
                    <td className="border px-2 py-1">{res.description || "-"}</td>
                    <td className="border px-2 py-1">{res.paymentType || "-"}</td>
                    <td className="border px-2 py-1">{res.companyRate?.company || "-"}</td>
                    <td className="border px-2 py-1">{res.resTaker?.username || "-"}</td>
                    <td className="border px-2 py-1">{res.moneyReceived || "-"}</td>
                    <td className="border px-2 py-1">{res.moneyToPayCompany || "-"}</td>
                    <td className="border px-2 py-1">{res.fullPrice || "-"}</td>
                    <td className="border px-2 py-1 space-x-2">
                      {editingId === res.id ? (
                        <>
                          <button
                            className="bg-green-500 text-white px-2 py-1 rounded"
                            onClick={handleUpdate}
                          >
                            Kaydet
                          </button>
                          <button
                            className="bg-gray-400 text-white px-2 py-1 rounded"
                            onClick={() => setEditingId(null)}
                          >
                            Vazgeç
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="bg-blue-500 text-white px-2 py-1 rounded"
                            onClick={() => handleEdit(res)}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="bg-red-500 text-white px-2 py-1 rounded"
                            onClick={() => handleDelete(res.id)}
                          >
                            <MdDeleteForever />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                )
              ))}
              {reservations.length === 0 && (
                <tr>
                  <td colSpan={26} className="text-center p-4">
                    Kayıt bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReservationList;
