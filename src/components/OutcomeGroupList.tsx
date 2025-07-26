import React, { useEffect, useState } from 'react'
import { useOutcomeGroupStore } from '../store/useOutcomeGroupStore';
import { OutcomeGroup } from '../types/OutcomeGroup';

const OutcomeGroupList = () => {
  const {
    outcomeGroups,
    fetchOutcomeGroups,
    updateOutcomeGroup,
    deleteOutcomeGroup,
  } = useOutcomeGroupStore();

  useEffect(() => {
    fetchOutcomeGroups();
  }, [fetchOutcomeGroups]);

    const [editingId, setEditingId] = useState<string | null>(null);
    const [formState, setFormState] = useState<Partial<OutcomeGroup>>({});

    if (!outcomeGroups) {
        return <div>Loading...</div>;
    }

    const handleEdit = (group: OutcomeGroup) => {
        setEditingId(group.id);
        setFormState({ name: group.name });
    }

    const handleCancel = () => {
        setEditingId(null);
        setFormState({});
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormState((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    const handleSave = async () => {
        if(!editingId) return;
        await updateOutcomeGroup(editingId, formState);
        setEditingId(null);
        setFormState({});
    }

  return (
    <div className="p-4">
  <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
    <table className="min-w-full bg-white divide-y divide-gray-200 text-sm">
      <thead className="bg-gray-100 text-gray-700 text-xs font-semibold uppercase tracking-wide">
        <tr>
          <th className="px-4 py-3 text-center w-1/2">Grup Adı</th>
          <th className="px-4 py-3 text-center w-1/2">İşlemler</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {outcomeGroups.length === 0 ? (
          <tr>
            <td
              colSpan={2}
              className="px-4 py-4 text-center text-gray-500 text-sm"
            >
              No outcome groups found
            </td>
          </tr>
        ) : (
          outcomeGroups.map((group) => {
            const isEditing = editingId === group.id;

            return (
              <tr
                key={group.id}
                className="hover:bg-gray-50 transition duration-200"
              >
                <td className="px-4 py-3 text-center align-middle">
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formState.name || group.name}
                      onChange={handleChange}
                      className="border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <span className="text-gray-800 font-medium">
                      {group.name}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
                    {isEditing ? (
                      <>
                        <button
                          className="w-full sm:w-auto bg-[#555879] hover:bg-[#44455e] text-white px-4 py-2 rounded-md text-sm transition"
                          onClick={handleSave}
                        >
                          Kaydet
                        </button>
                        <button
                          className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm transition"
                          onClick={handleCancel}
                        >
                          İptal
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="w-full sm:w-auto bg-[#555879] hover:bg-[#44455e] text-white px-4 py-2 rounded-md text-sm transition"
                          onClick={() => handleEdit(group)}
                        >
                          Düzenle
                        </button>
                        <button
                          className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm transition"
                          onClick={() => deleteOutcomeGroup(group.id)}
                        >
                          Sil
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  </div>
</div>


  )
}

export default OutcomeGroupList