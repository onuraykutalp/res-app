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
    <div>
        <table className='min-w-full border'>
            <thead className='bg-gray-100 text-sm text-left'>
                <tr className='border-b'>
                    <th>Grup Adı</th>
                    <th>İşlemler</th>
                </tr>
            </thead>
            <tbody>
                { outcomeGroups.length < 0 ? (
                    <tr><td colSpan={2}>No outcome groups found</td></tr>
                ) : (
                    outcomeGroups.map((group) => (
                        <tr key={group.id} className="border-b">
                            <td>
                                {
                                    editingId === group.id ? (
                                        <input
                                            type="text"
                                            name="name"
                                            value={formState.name || group.name}
                                            onChange={handleChange}
                                            className="border px-3 py-2 rounded"
                                        />
                                    ) : (
                                        group.name
                                    )
                                }
                            </td>
                            <td>
                                {
                                    editingId === group.id ? (
                                        <>
                                        <button className='bg-[#555879] text-white px-4 py-2 rounded' onClick={handleSave}>Kaydet</button>
                                        <button className='bg-[#f44336] text-white px-4 py-2 rounded' onClick={handleCancel}>İptal</button>
                                        </>
                                    ) : (
                                        <>
                                        <button className='bg-[#555879] text-white px-4 py-2 rounded' onClick={() => handleEdit(group)}>Düzenle</button>
                                        <button className='bg-[#f44336] text-white px-4 py-2 rounded' onClick={() => deleteOutcomeGroup(group.id)}>Sil</button>
                                        </>
                                    )
                                }
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    </div>
  )
}

export default OutcomeGroupList