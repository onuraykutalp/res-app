import React, { useEffect, useState } from "react";
import { useReservationStore } from "../store/useReservationStore";
import { Reservation } from "../types/Reservation";

const ReservationList: React.FC = () => {
  const {
    reservations,
    fetchReservations,
    updateReservation,
    deleteReservation,
  } = useReservationStore();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedReservation, setEditedReservation] = useState<Partial<Reservation>>({});

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const handleEdit = (reservation: Reservation) => {
    setEditingId(reservation.id);
    setEditedReservation({ ...reservation });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedReservation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    if (editingId) {
      await updateReservation(editingId, editedReservation as Reservation);
      setEditingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteReservation(id);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Rezervasyon Listesi</h2>
      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2">Tarih</th>
            <th className="border px-2">Ad Soyad</th>
            <th className="border px-2">Ülke</th>
            <th className="border px-2">Gemi</th>
            <th className="border px-2">Müşteri</th>
            <th className="border px-2">Alan</th>
            <th className="border px-2">Yetkili</th>
            <th className="border px-2">Salon</th>
            <th className="border px-2">Masa</th>
            <th className="border px-2">Geliş Transfer</th>
            <th className="border px-2">Dönüş Transfer</th>
            <th className="border px-2">Açıklama</th>
            <th className="border px-2">İşlem</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((res) => (
            <tr key={res.id} className="text-center">
              <td className="border px-2">
                {editingId === res.id ? (
                  <input name="date" value={editedReservation.date || ""} onChange={handleChange} />
                ) : (
                  res.date
                )}
              </td>
              <td className="border px-2">
                {editingId === res.id ? (
                  <input name="description" value={editedReservation.description || ""} onChange={handleChange} />
                ) : (
                  res.description
                )}
              </td>
              <td className="border px-2">{res.nationality}</td>
              <td className="border px-2">{res.ship}</td>
              <td className="border px-2">{res.fromWho?.company}</td>
              <td className="border px-2">{res.resTaker?.name}</td>
              <td className="border px-2">{res.authorized?.name}</td>
              <td className="border px-2">{res.saloon?.saloonName}</td>
              <td className="border px-2">{res.resTable?.name}</td>
              <td className="border px-2">{res.arrivalTransfer?.transferPointName}</td>
              <td className="border px-2">{res.returnTransfer?.transferPointName}</td>
              <td className="border px-2">{res.transferNote}</td>
              <td className="border px-2 space-x-2">
                {editingId === res.id ? (
                  <>
                    <button className="bg-green-500 text-white px-2 py-1 rounded" onClick={handleUpdate}>
                      Kaydet
                    </button>
                    <button className="bg-gray-400 text-white px-2 py-1 rounded" onClick={() => setEditingId(null)}>
                      Vazgeç
                    </button>
                  </>
                ) : (
                  <>
                    <button className="bg-blue-500 text-white px-2 py-1 rounded" onClick={() => handleEdit(res)}>
                      Düzenle
                    </button>
                    <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDelete(res.id)}>
                      Sil
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReservationList;
