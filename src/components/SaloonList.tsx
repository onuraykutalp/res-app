import React, { useEffect } from 'react';
import useSaloonStore from '../store/useSaloonStore';
import { Saloon } from '../types/Saloon';

interface SaloonListProps {
  refreshFlag: boolean;
}

const SaloonList: React.FC<SaloonListProps> = ({ refreshFlag }) => {
  const { saloons, fetchSaloons, loading, deleteSaloon, updateSaloon } = useSaloonStore();

  useEffect(() => {
    fetchSaloons();
  }, [refreshFlag]);

  // Düzenleme için fonksiyon
  const handleEdit = async (saloon: Saloon) => {
    const newSaloonName = prompt("Yeni salon adını girin:", saloon.saloonName);
    if (!newSaloonName || newSaloonName.trim() === "" || newSaloonName === saloon.saloonName) return;

    try {
      await updateSaloon(saloon.id, { saloonName: newSaloonName.trim() });
      await fetchSaloons(); // Güncel listeyi çek
    } catch (error) {
      alert("Salon güncellenirken hata oluştu.");
    }
  };

  return (
    <div className="overflow-x-auto bg-white shadow rounded-lg p-4">
  <h2 className="text-xl font-semibold text-gray-700 mb-4">Salon Listesi</h2>
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gray-100">
      <tr>
        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Gemi</th>
        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Salon Adı</th>
        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Açıklama</th>
        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">İşlemler</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-200 text-sm">
      {saloons.length === 0 ? (
        <tr>
          <td colSpan={5} className="text-center py-6 text-gray-500 italic">
            Kayıt bulunamadı.
          </td>
        </tr>
      ) : (
        saloons.map((saloon) => (
          <tr key={saloon.id} className="hover:bg-gray-50 transition">
            <td className="px-4 py-2">{saloon.ship}</td>
            <td className="px-4 py-2">{saloon.saloonName}</td>
            <td className="px-4 py-2">{saloon.description || "-"}</td>
            <td className="px-4 py-2 space-x-2 whitespace-nowrap">
              <button
                onClick={() => handleEdit(saloon)}
                className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                disabled={loading}
              >
                Düzenle
              </button>
              <button
                onClick={() => deleteSaloon(saloon.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                disabled={loading}
              >
                Sil
              </button>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>

  );
};

export default SaloonList;
