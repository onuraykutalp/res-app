import React, { useEffect, useState } from 'react';
import { useReservationStore } from '../store/useReservationStore';
import type { Reservation } from '../types/Reservation';

const ReservationList: React.FC = () => {
  const reservations = useReservationStore(state => state.reservations);
  const removeReservation = useReservationStore(state => state.removeReservation);
  const editReservation = useReservationStore(state => state.editReservation);
  const setReservations = useReservationStore(state => state.setReservations);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [edited, setEdited] = useState<Partial<Reservation>>({});

  useEffect(() => {
    async function fetchReservations() {
      try {
        const res = await fetch('http://localhost:3001/api/reservations');
        if (!res.ok) throw new Error('Failed to fetch reservations');
        const data = await res.json();
        setReservations(data);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    }
    fetchReservations();
  }, [setReservations]);

  const handleClick = (r: Reservation) => {
    setEditingId(r.id);
    setEdited({ ...r });
  };

  const handleSave = async () => {
    if (!editingId) return;

    try {
      const response = await fetch(`http://localhost:3001/api/reservations/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(edited),
      });

      if (!response.ok) throw new Error("Update failed");

      const updated = await response.json();
      editReservation(updated);
      setEditingId(null);
      setEdited({});
    } catch (error) {
      console.error(error);
      alert("Failed to update reservation");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/reservations/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Delete failed");
      removeReservation(id);
    } catch (error) {
      console.error(error);
      alert("Failed to delete reservation");
    }
  };

  const renderCell = (key: keyof Reservation, value: any) => {
    if (editingId) {
      // Edit modundaysa, inputa sadece string veya number verilmeli
      let inputValue: string | number = '';

      if (value === null || value === undefined) {
        inputValue = '';
      } else if (typeof value === 'object') {
        // Eğer obje ise, isim alanını kullan (örnek: fromWho.name, resTaker.name)
        inputValue = value.name ?? JSON.stringify(value);
      } else {
        inputValue = value;
      }

      return (
        <input
          className="border p-1 w-full"
          value={inputValue}
          onChange={(e) =>
            setEdited({
              ...edited,
              [key]: typeof value === 'number' ? Number(e.target.value) : e.target.value,
            })
          }
        />
      );
    } else {
      // Düzenleme modunda değilsek, obje ise anlamlı string göster
      if (value && typeof value === 'object') {
        return <span>{value.name ?? JSON.stringify(value)}</span>;
      }
      return <span>{value}</span>;
    }
  };

  const headers: { key: keyof Reservation; label: string }[] = [
    { key: 'id', label: 'Rez. No' },
    { key: 'name', label: 'İsim' },
    { key: 'date', label: 'Tarih' },
    { key: 'fromWho', label: 'Kimden' },
    { key: 'resTable', label: 'Masa' },
    { key: 'price', label: 'Fiyat' },
    { key: 'companyPrice', label: 'Şirket Fiyatı' },
    { key: 'agency', label: 'Acenta' },
    { key: 'm1', label: 'M1' },
    { key: 'm2', label: 'M2' },
    { key: 'm3', label: 'M3' },
    { key: 'v1', label: 'V1' },
    { key: 'v2', label: 'V2' },
    { key: 'total', label: 'Toplam' },
    { key: 'room', label: 'Oda' },
    { key: 'description', label: 'Açıklama' },
    { key: 'payment', label: 'Ödeme Şekli' },
    { key: 'resTaker', label: 'Alan Kişi' },
  ];

  return (
    <div className="mt-10 overflow-auto max-w-full">
      <table className="min-w-full bg-white border rounded shadow text-sm">
        <thead className="bg-[#4682A9] text-white">
          <tr>
            {headers.map(h => (
              <th key={h.key} className="p-2 text-left">{h.label}</th>
            ))}
            <th className="p-2 text-left">İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((r) => (
            <tr key={r.id} className="border-b">
              {headers.map(({ key }) => (
                <td key={key} className="p-2">{renderCell(key, r[key])}</td>
              ))}
              <td className="p-2 space-x-2">
                {editingId === r.id ? (
                  <>
                    <button onClick={handleSave} className="bg-green-500 text-white px-3 py-1 rounded">Save</button>
                    <button onClick={() => setEditingId(null)} className="bg-gray-500 text-white px-3 py-1 rounded">Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleClick(r)} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
                    <button onClick={() => handleDelete(r.id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
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
