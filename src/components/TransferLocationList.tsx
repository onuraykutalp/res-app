import React, { useState, useEffect } from "react";
import { useTransferLocationStore } from "../store/useTransferLocationStore";
import { TransferLocation } from "../types/TransferLocation";

const TransferLocationList = () => {
  const {
    locations,
    fetchTransferLocations,
    deleteLocation,
    updateLocation,
  } = useTransferLocationStore();

  const [editingLocation, setEditingLocation] = useState<TransferLocation | null>(null);
  const [editedName, setEditedName] = useState("");
  const [editedTime, setEditedTime] = useState("");
  const [editedDesc, setEditedDesc] = useState("");

  useEffect(() => {
    fetchTransferLocations();
  }, [fetchTransferLocations]);

  const handleEditClick = (loc: TransferLocation) => {
    setEditingLocation(loc);
    setEditedName(loc.locationName);
    setEditedTime(loc.time);
    setEditedDesc(loc.description || "");
  };

  const handleUpdate = async () => {
    if (!editingLocation) return;

    const updated: TransferLocation = {
      ...editingLocation,
      locationName: editedName,
      time: editedTime,
      description: editedDesc,
    };

    await updateLocation(updated);
    setEditingLocation(null);
  };

  return (
    <div className="max-w-3xl mx-auto mt-6 p-4 bg-white shadow-md rounded-2xl">
      <h2 className="text-xl font-bold text-gray-700 mb-4">Transfer Lokasyonları</h2>

      {editingLocation && (
        <div className="p-4 mb-6 border border-blue-200 rounded-xl bg-blue-50">
          <h3 className="font-semibold text-blue-800 mb-2">Güncelle: {editingLocation.locationName}</h3>

          <div className="space-y-2">
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              placeholder="Lokasyon adı"
              className="w-full px-3 py-2 border rounded-lg"
            />
            <input
              type="text"
              value={editedTime}
              onChange={(e) => setEditedTime(e.target.value)}
              placeholder="Saat"
              className="w-full px-3 py-2 border rounded-lg"
            />
            <textarea
              value={editedDesc}
              onChange={(e) => setEditedDesc(e.target.value)}
              placeholder="Açıklama"
              className="w-full px-3 py-2 border rounded-lg"
            />

            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={handleUpdate}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Kaydet
              </button>
              <button
                onClick={() => setEditingLocation(null)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Vazgeç
              </button>
            </div>
          </div>
        </div>
      )}

      <ul className="divide-y">
        {locations.map((loc) => (
          <li key={loc.id} className="py-4 flex justify-between items-center">
            <div>
              <p className="font-semibold">
                {loc.locationName} <span className="text-sm text-gray-500">({loc.time})</span>
              </p>
              {loc.description && <p className="text-sm text-gray-500">{loc.description}</p>}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleEditClick(loc)}
                className="text-blue-600 hover:underline"
              >
                Düzenle
              </button>
              <button
                onClick={() => deleteLocation(loc.id)}
                className="text-red-600 hover:underline"
              >
                Sil
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransferLocationList;
