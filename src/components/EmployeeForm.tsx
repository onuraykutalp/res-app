import React, { useEffect, useState } from 'react'
import { useEmployeeStore } from '../store/useEmployeeStore'
import { useEmployeeGroupStore } from '../store/useEmployeeGroupStore'

const EmployeeForm: React.FC = () => {

    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [username, setUserame] = useState("");
    const [groupId, setGroupId] = useState("");

    const addEmployee = useEmployeeStore((state) => state.addEmployee);
    const groups = useEmployeeGroupStore((state) => state.groups);
    const fetchGroups = useEmployeeGroupStore((state) => state.fetchGroups);

    useEffect(() => {
        fetchGroups();
    }, []);

    const handleSubmit =  (e: React.FormEvent) => {
        e.preventDefault();
        if(!name || !lastName || !phone ||  !username || !groupId){
            return alert("Tüm zorunlu alanları doldurun.");
        }
        addEmployee({ name, lastname: lastName, phone: Number(phone), username, groupId });
        setName('');
        setLastName('');
        setPhone('');
        setUserame('');
        setGroupId('');
    };

  return (
    <div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 border rounded shadow max-w-md">
            <h2 className="text-lg font-semibold">Yeni Personel Ekle</h2>
            <input type="text" placeholder="Ad" value={name} onChange={(e) => setName(e.target.value)} className="border p-2 rounded" />
            <input type="text" placeholder="Soyad" value={lastName} onChange={(e) => setLastName(e.target.value)} className="border p-2 rounded" />
            <input type="text" placeholder="Telefon" value={phone} onChange={(e) => setPhone(e.target.value)} className="border p-2 rounded" />
            <input type="text" placeholder="Kullanıcı Adı" value={username} onChange={(e) => setUserame(e.target.value)} className="border p-2 rounded" />
            <select value={groupId} onChange={(e) => setGroupId(e.target.value)} className="border p-2 rounded">
                <option value="">Grup Seçin</option>
                {
                    groups.map((group) => (
                        <option key={group.id} value={group.id}>{group.groupName}</option>
                    ))
                }
            </select>
            <button type='submit' className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Ekle</button>
        </form>
    </div>
  )
}

export default EmployeeForm