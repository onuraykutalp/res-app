import { useEffect, useState } from "react";
import { useTransferPointStore } from "../store/useTransferPointStore";
import { useTransferLocationStore } from "../store/useTransferLocationStore";

interface EditableRow {
  id: string;
  transferPointName: string;
  time: string;
  description?: string;
  locationId: string;
}

const TransferPointList = () => {
  const {
    transferPoints,
    fetchTransferPoints,
    updateTransferPoint,
    deleteTransferPoint,
    loading,
  } = useTransferPointStore();

  // Store'daki isimler: locations, fetchTransferLocations
  const { locations, fetchTransferLocations } = useTransferLocationStore();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditableRow>({
    id: "",
    transferPointName: "",
    time: "",
    description: "",
    locationId: "",
  });

  useEffect(() => {
    fetchTransferPoints();
    fetchTransferLocations();
  }, []);

  const startEditing = (item: EditableRow) => {
    setEditingId(item.id);
    setEditForm(item);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!editingId) return;
    await updateTransferPoint(editingId, editForm);
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  // locationName için yardımcı fonksiyon
  const getLocationName = (id: string) => {
    return locations.find((loc) => loc.id === id)?.locationName || id;
  };

  return (
    <div className="max-w-5xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Transfer Noktaları</h2>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2 text-left">Adı</th>
            <th className="border border-gray-300 p-2 text-left">Zaman</th>
            <th className="border border-gray-300 p-2 text-left">Açıklama</th>
            <th className="border border-gray-300 p-2 text-left">Lokasyon</th>
            <th className="border border-gray-300 p-2 text-center">İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {transferPoints.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center p-4">
                Kayıt bulunamadı.
              </td>
            </tr>
          ) : (
            transferPoints.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                {editingId === item.id ? (
                  <>
                    <td className="border border-gray-300 p-2">
                      <input
                        name="transferPointName"
                        value={editForm.transferPointName}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded p-1"
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <input
                        type="time"
                        name="time"
                        value={editForm.time}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded p-1"
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <textarea
                        name="description"
                        value={editForm.description || ""}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded p-1"
                        rows={2}
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <select
                        name="locationId"
                        value={editForm.locationId}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded p-1"
                      >
                        <option value="">Seçiniz</option>
                        {locations.map((loc) => (
                          <option key={loc.id} value={loc.id}>
                            {loc.locationName}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="border border-gray-300 p-2 text-center space-x-2">
                      <button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 disabled:opacity-50"
                      >
                        Kaydet
                      </button>
                      <button
                        onClick={handleCancel}
                        disabled={loading}
                        className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500 disabled:opacity-50"
                      >
                        İptal
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="border border-gray-300 p-2">{item.transferPointName}</td>
                    <td className="border border-gray-300 p-2">{item.time}</td>
                    <td className="border border-gray-300 p-2">{item.description || "-"}</td>
                    <td className="border border-gray-300 p-2">{getLocationName(item.locationId)}</td>
                    <td className="border border-gray-300 p-2 text-center space-x-2">
                      <button
                        onClick={() => startEditing(item)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => deleteTransferPoint(item.id)}
                        disabled={loading}
                        className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 disabled:opacity-50"
                      >
                        Sil
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TransferPointList;
