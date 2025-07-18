import React, { useEffect, useState } from 'react';
import { useResTableStore } from '../store/useResTableStore';
import { Saloon } from '../types/Saloon';

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
}

const ResTableForm: React.FC<Props> = ({ onSuccess, onCancel }) => {
  const { addResTable, saloons, fetchSaloons } = useResTableStore();

  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState(1);
  const [saloonId, setSaloonId] = useState('');

  useEffect(() => {
    fetchSaloons();
  }, [fetchSaloons]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !capacity || !saloonId) {
      alert('Lütfen tüm alanları doldurun');
      return;
    }

    await addResTable({ name, capacity, saloonId });
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md w-full max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Yeni Masa Ekle</h2>

      <label className="block mb-2">
        Masa Adı
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="mt-1 w-full border border-gray-300 rounded p-2"
          required
        />
      </label>

      <label className="block mb-2">
        Kapasite
        <input
          type="number"
          value={capacity}
          min={1}
          onChange={e => setCapacity(Number(e.target.value))}
          className="mt-1 w-full border border-gray-300 rounded p-2"
          required
        />
      </label>

      <label className="block mb-4">
        Salon
        <select
          value={saloonId}
          onChange={e => setSaloonId(e.target.value)}
          className="mt-1 w-full border border-gray-300 rounded p-2"
          required
        >
          <option value="">-- Salon Seçiniz --</option>
          {saloons.map((saloon: Saloon) => (
            <option key={saloon.id} value={saloon.id}>
              {saloon.saloonName}
            </option>
          ))}
        </select>
      </label>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
        >
          İptal
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Ekle
        </button>
      </div>
    </form>
  );
};

export default ResTableForm;
