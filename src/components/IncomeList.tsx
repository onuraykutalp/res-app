import React, { useEffect, useState } from 'react'
import { useIncomeStore } from '../store/useIncomeStore'
import { Income } from '../types/Income';

const IncomeList = () => {

  const incomes = useIncomeStore((set) => set.incomes);
  const fetchIncomes = useIncomeStore((set) => set.fetchIncomes);
  const updateIncomes = useIncomeStore((set) => set.updateIncome);
  const deleteIncome = useIncomeStore((set) => set.deleteIncome);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedData, setEditedData] = useState({
    name: '',
    tax: 0,
    ship: false,
    accountant: false,
  });

  useEffect(() => {
    fetchIncomes();
  }, [fetchIncomes]);

  const startEditing = (income: Income) => {
    setEditingId(income.id);
    setEditedData({
      name: income.name,
      tax: income.tax,
      ship: income.ship,
      accountant: income.accountant,
    });
  }

  const cancelEditing = () => {
    setEditingId(null);
    setEditedData({
      name: '',
      tax: 0,
      ship: false,
      accountant: false,
    });
  }

  const saveEditing = async () => {
    if (!editingId) return;
    await updateIncomes(editingId, editedData);
    cancelEditing();
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4 text-[#555879]">Gelir Listesi</h2>
      <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 text-xs uppercase">
            <tr>
              <th className="px-6 py-3">Gelir Adı</th>
              <th className="px-6 py-3">KDV</th>
              <th className="px-6 py-3 text-center">Gemi</th>
              <th className="px-6 py-3 text-center">Muhasebe</th>
              <th className="px-6 py-3 text-center">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {
              incomes.map((income: Income) => {
                const isEditing = editingId === income.id;
                return (
                  <tr key={income.id}>
                    <td className="px-6 py-4">
                      {
                        isEditing ? (
                          <input type='text'
                            className="border p-1 rounded" value={editedData.name} onChange={(e) => setEditedData({ ...editedData, name: e.target.value })} />
                        ) : (
                          income.name
                        )
                      }
                    </td>
                    <td className="px-6 py-4">
                      {
                        isEditing ? (
                          <input className="border p-1 rounded " type='number' placeholder='0' value={editedData.tax} onChange={(e) => setEditedData({ ...editedData, tax: Number(e.target.value) })} />
                        ): (
                          income.tax
                        )
                      }
                    </td>

                    <td className="px-6 py-4 text-center">
                      {
                        isEditing ? (
                          <input type='checkbox' className="border p-1 rounded w-full" checked={editedData.ship} onChange={(e) => setEditedData({ ...editedData, ship: e.target.checked})} />
                        ) : (
                           <input type="checkbox" checked={income.ship} readOnly />
                        )
                      }
                    </td>

                    <td className="px-6 py-4 text-center">
                      {
                        isEditing ? (
                          <input type='checkbox' className="border p-1 rounded w-full" checked={editedData.accountant} onChange={(e) => setEditedData({ ...editedData, accountant: e.target.checked})} />
                        ) : (
                          <input type="checkbox" checked={income.accountant} readOnly />
                        )
                      }
                    </td>

                    <td className="px-6 py-4 flex gap-2 justify-center">
                      {
                        isEditing ? (
                          <>
                        <button
                          onClick={saveEditing}
                          className="bg-[#555879] hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
                        >
                          Kaydet
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded text-xs"
                        >
                          İptal
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEditing(income)}
                          className="bg-[#555879] hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                        >
                          Düzenle
                        </button>
                        <button
                          onClick={() => deleteIncome(income.id)}
                          className="bg-red-400 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                        >
                          Sil
                        </button>
                      </>
                        )
                      }
                    </td>
                  </tr>
                )
              })

            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default IncomeList