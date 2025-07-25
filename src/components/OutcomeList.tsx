import React, { useEffect, useState } from 'react';
import { useOutcomeStore } from '../store/useOutcomeStore';
import { useOutcomeGroupStore } from '../store/useOutcomeGroupStore';
import { Outcome } from '../types/Outcome';

const OutcomeList: React.FC = () => {
  const outcomes = useOutcomeStore((s) => s.outcomes);
  const fetchOutcomes = useOutcomeStore((s) => s.fetchOutcomes);
  const deleteOutcome = useOutcomeStore((s) => s.deleteOutcome);
  const updateOutcome = useOutcomeStore((s) => s.updateOutcome);

  const outcomeGroups = useOutcomeGroupStore((s) => s.outcomeGroups);
  const fetchOutcomeGroups = useOutcomeGroupStore((s) => s.fetchOutcomeGroups);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedData, setEditedData] = useState({
    name: '',
    groupId: '',
    ship: false,
    accountant: false,
  });

  useEffect(() => {
    fetchOutcomes();
    fetchOutcomeGroups();
  }, [fetchOutcomes, fetchOutcomeGroups]);

  const startEditing = (outcome: Outcome) => {
    setEditingId(outcome.id);
    setEditedData({
      name: outcome.name,
      groupId: outcome.group?.id || '',
      ship: outcome.ship,
      accountant: outcome.accountant,
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditedData({
      name: '',
      groupId: '',
      ship: false,
      accountant: false,
    });
  };

  const saveEditing = async () => {
    if (!editingId) return;
    await updateOutcome(editingId, editedData);
    cancelEditing();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4 text-[#555879]">Gider Listesi</h2>
      <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 text-xs uppercase">
            <tr>
              <th className="px-6 py-3">Gider Adı</th>
              <th className="px-6 py-3">Grup</th>
              <th className="px-6 py-3 text-center">Gemi</th>
              <th className="px-6 py-3 text-center">Muhasebe</th>
              <th className="px-6 py-3 text-center">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {outcomes.map((outcome: Outcome) => {
              const isEditing = editingId === outcome.id;

              return (
                <tr key={outcome.id}>
                  <td className="px-6 py-4">
                    {isEditing ? (
                      <input
                        className="border p-1 rounded w-full"
                        value={editedData.name}
                        onChange={(e) =>
                          setEditedData({ ...editedData, name: e.target.value })
                        }
                      />
                    ) : (
                      outcome.name
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {isEditing ? (
                      <select
                        className="border p-1 rounded w-full"
                        value={editedData.groupId}
                        onChange={(e) =>
                          setEditedData({ ...editedData, groupId: e.target.value })
                        }
                      >
                        <option value="">Seçiniz...</option>
                        {outcomeGroups.map((group) => (
                          <option key={group.id} value={group.id}>
                            {group.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      outcome.group?.name || '-'
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {isEditing ? (
                      <input
                        type="checkbox"
                        checked={editedData.ship}
                        onChange={(e) =>
                          setEditedData({ ...editedData, ship: e.target.checked })
                        }
                      />
                    ) : (
                      <input type="checkbox" checked={outcome.ship} readOnly />
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {isEditing ? (
                      <input
                        type="checkbox"
                        checked={editedData.accountant}
                        onChange={(e) =>
                          setEditedData({ ...editedData, accountant: e.target.checked })
                        }
                      />
                    ) : (
                      <input type="checkbox" checked={outcome.accountant} readOnly />
                    )}
                  </td>
                  <td className="px-6 py-4 flex gap-2 justify-center">
                    {isEditing ? (
                      <>
                        <button
                          onClick={saveEditing}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
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
                          onClick={() => startEditing(outcome)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                        >
                          Düzenle
                        </button>
                        <button
                          onClick={() => deleteOutcome(outcome.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                        >
                          Sil
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OutcomeList;
