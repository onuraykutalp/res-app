import React, { useEffect, useState } from 'react'
import { useEmployeeStore } from '../store/useEmployeeStore'
import { useEmployeeGroupStore } from '../store/useEmployeeGroupStore'
import { AnimatePresence, motion } from 'motion/react';
import { GiCancel } from "react-icons/gi";

const EmployeeForm: React.FC = () => {

    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [username, setUserame] = useState("");
    const [groupId, setGroupId] = useState("");

    const [openForm, setOpenForm] = useState(false);

    const openFormHandler = () => {
        setOpenForm(true);
    }

    const closeFormHandler = () => {
        setOpenForm(false);
    }

    const addEmployee = useEmployeeStore((state) => state.addEmployee);
    const groups = useEmployeeGroupStore((state) => state.groups);
    const fetchGroups = useEmployeeGroupStore((state) => state.fetchGroups);

    useEffect(() => {
        fetchGroups();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !lastName || !phone || !username || !groupId) {
            return alert("Tüm zorunlu alanları doldurun.");
        }
        addEmployee({ name, lastname: lastName, phone: Number(phone), username, groupId, password: null });
        setName('');
        setLastName('');
        setPhone('');
        setUserame('');
        setGroupId('');
    };

    return (
        <div className="p-6 flex justify-center items-center">
            <div className='flex flex-col'>
                <button onClick={openFormHandler} className='bg-[#555879] text-white p-3 rounded'>Yeni Personel Ekle</button>
            </div>
            <AnimatePresence>
                {
                    openForm && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="fixed z-50 inset-0 flex items-center justify-center  bg-black/40 backdrop-blur-sm">
                            <form
                                onSubmit={handleSubmit}
                                className="w-full max-w-lg bg-white rounded-xl shadow-md p-6 grid grid-cols-1 gap-5 relative"
                            >
                                <button onClick={closeFormHandler} type='reset' className='absolute top-4 right-4'><GiCancel className='text-red-400 size-6' /></button>
                                <h2 className="text-2xl font-semibold text-center text-[#555879]">Yeni Personel Ekle</h2>

                                {/* Ad */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Ad
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        placeholder="Ad"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Soyad */}
                                <div>
                                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                                        Soyad
                                    </label>
                                    <input
                                        id="lastName"
                                        type="text"
                                        placeholder="Soyad"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Telefon */}
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                        Telefon
                                    </label>
                                    <input
                                        id="phone"
                                        type="text"
                                        placeholder="Telefon"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Kullanıcı Adı */}
                                <div>
                                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                        Kullanıcı Adı
                                    </label>
                                    <input
                                        id="username"
                                        type="text"
                                        placeholder="Kullanıcı Adı"
                                        value={username}
                                        onChange={(e) => setUserame(e.target.value)}
                                        className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Grup Seçimi */}
                                <div>
                                    <label htmlFor="group" className="block text-sm font-medium text-gray-700 mb-1">
                                        Personel Grubu
                                    </label>
                                    <select
                                        id="group"
                                        value={groupId}
                                        onChange={(e) => setGroupId(e.target.value)}
                                        className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Grup Seçin</option>
                                        {groups.map((group) => (
                                            <option key={group.id} value={group.id}>
                                                {group.groupName}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Buton */}
                                <div className="flex justify-center">
                                    <button
                                        type="submit"
                                        className="bg-[#555879] hover:bg-[#44466a] text-white px-6 py-2 rounded shadow transition"
                                    >
                                        Ekle
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )
                }
            </AnimatePresence>
        </div>

    )
}

export default EmployeeForm