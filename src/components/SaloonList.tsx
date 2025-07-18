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
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border border-gray-300">ID</th>
            <th className="p-2 border border-gray-300">Gemi</th>
            <th className="p-2 border border-gray-300">Salon Adı</th>
            <th className="p-2 border border-gray-300">Açıklama</th>
            <th className="p-2 border border-gray-300">İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {saloons.map((saloon) => (
            <tr key={saloon.id} className="hover:bg-gray-100">
              <td className="p-2 border border-gray-300">{saloon.id}</td>
              <td className="p-2 border border-gray-300">{saloon.ship}</td>
              <td className="p-2 border border-gray-300">{saloon.saloonName}</td>
              <td className="p-2 border border-gray-300">{saloon.description || "-"}</td>
              <td className="p-2 border border-gray-300 space-x-2">
                <button
                  className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                  onClick={() => handleEdit(saloon)}
                  disabled={loading}
                >
                  Düzenle
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  onClick={() => deleteSaloon(saloon.id)}
                  disabled={loading}
                >
                  Sil
                </button>
              </td>
            </tr>
          ))}
          {saloons.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center p-4">
                Kayıt bulunamadı.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SaloonList;
