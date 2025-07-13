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
        <div>
            <div>
                <h1>Personel Grubu Ekle</h1>
                <form onSubmit={(e) => { e.preventDefault(); handleAddGroup(); }}>
                    <input onChange={(e) => setNewGroupName(e.target.value)} type='text' placeholder='Personel Grubu Adı Giriniz.' />
                    <button type='submit'
                        className="bg-blue-300 p-3 rounded">Grup Ekle</button>
                </form>
            </div>

            <div>
                <h2>Personel Grupları</h2>
                <ul>
                    {groups.map((group) => (
                        <li key={group.id}>{group.groupName}</li>
                    ))}
                </ul>
            </div>

        </div>
    )
}

export default EmployeeGroupPage