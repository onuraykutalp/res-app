import React, { useEffect, useState } from "react";
import { useGeneralIncomeStore } from "../store/useGeneralIncome";
import { FaRegEdit } from "react-icons/fa";
import { TiCancel } from "react-icons/ti";
import { FaSave } from "react-icons/fa";

const GeneralIncomeList: React.FC = () => {
  const { incomes, fetchIncomes, updateIncome, deleteIncome } = useGeneralIncomeStore();

  const [editId, setEditId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<any>(null);

  useEffect(() => {
    fetchIncomes();
  }, [fetchIncomes]);

  const startEdit = (income: typeof incomes[0]) => {
    setEditId(income.id);
    // Tarihleri YYYY-MM-DD formatına çek
    setEditValues({
      ...income,
      startedAt: income.startedAt?.slice(0, 10) ?? "",
      endedAt: income.endedAt?.slice(0, 10) ?? "",
    });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditValues(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditValues((prev: any) => ({
      ...prev,
      [name]: name.includes("Price") ? Number(value) : value,
    }));
  };

  const saveEdit = async () => {
    if (!editId || !editValues) return;
    await updateIncome(editId, editValues);
    setEditId(null);
    setEditValues(null);
    fetchIncomes();
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Genel Gelir Listesi</h2>

      <div className="overflow-x-auto shadow rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3">Menü Adı</th>
              <th className="px-4 py-3">Para Birimi</th>
              <th className="px-4 py-3">Broşür</th>
              <th className="px-4 py-3">Otel</th>
              <th className="px-4 py-3">5+ Uzak</th>
              <th className="px-4 py-3">Acenta</th>
              <th className="px-4 py-3">Rehber</th>
              <th className="px-4 py-3">Bireysel</th>
              <th className="px-4 py-3">Kurumsal</th>
              <th className="px-4 py-3">Online</th>
              <th className="px-4 py-3">Diğer</th>
              <th className="px-4 py-3">Başlangıç</th>
              <th className="px-4 py-3">Bitiş</th>
              <th className="px-4 py-3">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {incomes.map((income) => {
              const isEditing = editId === income.id;

              return (
                <tr key={income.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2">
                    {isEditing ? (
                      <input
                        type="text"
                        name="menuName"
                        value={editValues.menuName}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-2 py-1"
                      />
                    ) : (
                      income.menuName
                    )}
                  </td>

                  <td className="px-4 py-2">
                    {isEditing ? (
                      <select
                        name="currency"
                        value={editValues.currency}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="₺">₺</option>
                        <option value="$">$</option>
                        <option value="€">€</option>
                      </select>
                    ) : (
                      income.currency
                    )}
                  </td>

                  {/* Fiyat sütunları (input type number step any) */}
                  {[
                    "flierPrice",
                    "otelPrice",
                    "fiveAndFarPrice",
                    "agencyPrice",
                    "guidePrice",
                    "individualPrice",
                    "companyPrice",
                    "onlinePrice",
                    "othersPrice",
                  ].map((key) => (
                    <td key={key} className="px-4 py-2">
                      {isEditing ? (
                        <input
                          type="number"
                          step="any"
                          name={key}
                          value={editValues[key]}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded px-2 py-1"
                        />
                      ) : (
                        (income as any)[key]
                      )}
                    </td>
                  ))}

                  {/* Tarihler */}
                  <td className="px-4 py-2">
                    {isEditing ? (
                      <input
                        type="date"
                        name="startedAt"
                        value={editValues.startedAt}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-2 py-1"
                      />
                    ) : (
                      income.startedAt?.slice(0, 10)
                    )}
                  </td>

                  <td className="px-4 py-2">
                    {isEditing ? (
                      <input
                        type="date"
                        name="endedAt"
                        value={editValues.endedAt}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-2 py-1"
                      />
                    ) : (
                      income.endedAt?.slice(0, 10)
                    )}
                  </td>

                  {/* İşlem butonları */}
                  <td className="px-4 py-2 space-x-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={saveEdit}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                          <FaSave />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                        >
                          <TiCancel />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(income)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          <FaRegEdit />
                        </button>
                        <button
                          onClick={() => deleteIncome(income.id)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Sil
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}

            {incomes.length === 0 && (
              <tr>
                <td colSpan={15} className="text-center py-4 text-gray-500">
                  Kayıt bulunamadı.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GeneralIncomeList;
