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
    <form
  onSubmit={handleSubmit}
  className="max-w-xl mx-auto bg-white shadow-xl rounded-2xl p-6 space-y-6"
>
  <h2 className="text-2xl font-semibold text-[#555879] text-center">Yeni Transfer Lokasyonu</h2>

  {/* Lokasyon Adı */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Lokasyon Adı
    </label>
    <input
      type="text"
      value={locationName}
      onChange={(e) => setLocationName(e.target.value)}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  {/* Saat */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Saat</label>
    <input
      type="text"
      value={time}
      onChange={(e) => setTime(e.target.value)}
      placeholder="Örn: 14:00"
      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  {/* Açıklama */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Açıklama <span className="text-gray-400">(isteğe bağlı)</span>
    </label>
    <textarea
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      rows={3}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
    />
  </div>

  {/* Submit Button */}
  <div className="pt-2">
    <button
      type="submit"
      className="w-full bg-[#555879] hover:bg-[#44466a] text-white py-2 rounded-lg shadow transition-all"
    >
      Kaydet
    </button>
  </div>
</form>

  );
};

export default TransferLocationForm;
