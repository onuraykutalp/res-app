import React, { useState } from 'react';
import { useTransferLocationStore } from '../store/useTransferLocationStore';

const TransferLocationForm = () => {
  const [locationName, setLocationName] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');

  const { addLocation } = useTransferLocationStore(); // ✅ DÜZELTİLDİ

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!locationName || !time) {
      alert('Lokasyon adı ve saat zorunludur');
      return;
    }

    const newLocation = {
      locationName,
      time,
      description,
    };

    try {
      await addLocation(newLocation); // ✅ DÜZELTİLDİ
      setLocationName('');
      setTime('');
      setDescription('');
    } catch (error) {
      console.error('Lokasyon eklenirken hata:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white shadow-md rounded-2xl space-y-4">
      <h2 className="text-xl font-bold text-gray-700">Yeni Transfer Lokasyonu</h2>

      <div>
        <label className="block text-sm font-medium text-gray-600">Lokasyon Adı</label>
        <input
          type="text"
          value={locationName}
          onChange={(e) => setLocationName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600">Saat</label>
        <input
          type="text"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          placeholder="Örn: 14:00"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600">Açıklama (isteğe bağlı)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Kaydet
      </button>
    </form>
  );
};

export default TransferLocationForm;
