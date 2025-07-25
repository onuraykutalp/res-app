import React, { useEffect, useState } from 'react'
import { useEmployeeGroupStore } from '../store/useEmployeeGroupStore'

const EmployeeGroupPage: React.FC = () => {

    const groups = useEmployeeGroupStore((state) => state.groups);
    const fetchGroups = useEmployeeGroupStore((state) => state.fetchGroups);
    const addGroup = useEmployeeGroupStore((state) => state.addGroup);

    const [newGroupName, setNewGroupName] = useState("");

    useEffect(() => {
        fetchGroups();
    }, [fetchGroups]);

    const handleAddGroup = () => {
        if (newGroupName.trim()) {
            addGroup(newGroupName);
            setNewGroupName('');
        }
    }


    return (
        <div className="p-6 max-w-2xl mx-auto space-y-8">

            {/* Grup Ekleme Formu */}
            <div className="bg-white rounded-lg shadow p-6">
                <h1 className="text-xl font-semibold text-[#555879] mb-4">Personel Grubu Ekle</h1>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleAddGroup();
                    }}
                    className="flex flex-col sm:flex-row gap-4"
                >
                    <input
                        onChange={(e) => setNewGroupName(e.target.value)}
                        type="text"
                        placeholder="Personel Grubu Adı Giriniz"
                        className="flex-1 border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="bg-[#555879] hover:bg-[#44466a] text-white px-6 py-2 rounded transition"
                    >
                        Grup Ekle
                    </button>
                </form>
            </div>

            {/* Grup Listesi */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-[#555879] mb-4">Personel Grupları</h2>
                {groups.length === 0 ? (
                    <p className="text-gray-500 italic">Henüz grup eklenmemiş.</p>
                ) : (
                    <ul className="space-y-2 list-disc list-inside text-gray-700">
                        {groups.map((group) => (
                            <li key={group.id}>{group.groupName}</li>
                        ))}
                    </ul>
                )}
            </div>

        </div>

    )
}

export default EmployeeGroupPage