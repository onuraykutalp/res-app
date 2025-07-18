// components/ResTableList.tsx
import React, { useEffect, useState } from "react";
import { useResTableStore } from "../store/useResTableStore";
import { ResTable } from "../types/ResTable";

const ResTableList: React.FC = () => {
  const { resTables, fetchResTables, deleteResTable, updateResTable } = useResTableStore();
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", capacity: 1, saloonId: "" });

  useEffect(() => {
    fetchResTables();
  }, []);

  const handleEdit = (tableId: string, name: string, capacity: number, saloonId: string) => {
    setEditId(tableId);
    setForm({ name, capacity, saloonId });
  };

  const handleUpdate = async () => {
    if (editId) {
      await updateResTable(editId, form);
      setEditId(null);
      // Güncelleme sonrası listeyi yenilemek için fetch çağrısı ekleyebilirsin:
      await fetchResTables();
    }
  };

  if (!resTables) return <p>Yükleniyor...</p>;
  if (resTables.length === 0) return <p>Kayıtlı masa yok.</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Masalar</h2>
      <ul className="space-y-2">
        {resTables.map((table: ResTable) => (
          <li key={table.id} className="border p-2 rounded flex justify-between items-center">
            {editId === table.id ? (
              <div className="flex gap-2 items-center w-full">
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="border px-2 py-1"
                  placeholder="Masa Adı"
                />
                <input
                  type="number"
                  min={1}
                  value={form.capacity}
                  onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
                  className="border px-2 py-1 w-16"
                  placeholder="Kapasite"
                />
                <select
                  value={form.saloonId}
                  onChange={(e) => setForm({ ...form, saloonId: e.target.value })}
                  className="border px-2 py-1"
                >
                  <option value="">Salon Seçiniz</option>
                  {/** Burada salonları store'dan almalısın. useResTableStore'a eklemen gerek **/}
                </select>
                <button onClick={handleUpdate} className="bg-green-500 text-white px-2 py-1 rounded">
                  Kaydet
                </button>
                <button onClick={() => setEditId(null)} className="text-gray-500 px-2">
                  İptal
                </button>
              </div>
            ) : (
              <div className="flex justify-between items-center w-full">
                <span>
                  {table.name} - {table.capacity} kişi -{" "}
                  {table.saloon?.saloonName ?? "Salon bilgisi yok"}
                </span>
                <div className="space-x-2">
                  <button
                    onClick={() =>
                      handleEdit(table.id, table.name, table.capacity, table.saloon?.id ?? "")
                    }
                    className="text-blue-500"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => deleteResTable(table.id)}
                    className="text-red-500"
                  >
                    Sil
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
      <div className="grid grid-cols-10 items-center mt-6 gap-2">
        {resTables.map((table: ResTable) => (
          <div key={table.id} className="border border-solid rounded">
            <div className="flex flex-col gap-2 items-center justify-center bg-orange-400 font-semibold p-2">
              <p>{table.name}</p>
            </div>
            <div className="bg-gray-400 flex justify-center items-center px-2 py-4">
              <p className="font-semibold text-xl">{table.capacity}</p>
            </div>
            <div className="bg-white flex justify-center items-center p-2">
              <p>{table.saloon?.saloonName ?? "Salon bilgisi yok"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResTableList;
