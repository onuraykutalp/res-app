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
    <div className="max-w-3xl mx-auto mt-6 px-4 sm:px-6 lg:px-8 py-6 bg-white shadow-lg rounded-2xl">
  <h2 className="text-2xl font-bold text-gray-700 mb-6">Transfer Lokasyonları</h2>

  {editingLocation && (
    <div className="mb-6 p-4 border border-blue-200 bg-blue-50 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold text-blue-700 mb-3">
        Güncelle: {editingLocation.locationName}
      </h3>

      <div className="grid gap-3">
        <input
          type="text"
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
          placeholder="Lokasyon adı"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          value={editedTime}
          onChange={(e) => setEditedTime(e.target.value)}
          placeholder="Saat"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <textarea
          value={editedDesc}
          onChange={(e) => setEditedDesc(e.target.value)}
          placeholder="Açıklama"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
        />

        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={handleUpdate}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Kaydet
          </button>
          <button
            onClick={() => setEditingLocation(null)}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
          >
            Vazgeç
          </button>
        </div>
      </div>
    </div>
  )}

  <ul className="divide-y divide-gray-200">
    {locations.map((loc) => (
      <li
        key={loc.id}
        className="py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2"
      >
        <div>
          <p className="font-semibold text-gray-800">
            {loc.locationName}
            <span className="ml-2 text-sm text-gray-500">({loc.time})</span>
          </p>
          {loc.description && (
            <p className="text-sm text-gray-500 mt-1">{loc.description}</p>
          )}
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => handleEditClick(loc)}
            className="text-blue-600 font-medium hover:underline transition"
          >
            Düzenle
          </button>
          <button
            onClick={() => deleteLocation(loc.id)}
            className="text-red-600 font-medium hover:underline transition"
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
