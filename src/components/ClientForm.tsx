import React from 'react'
import { useState } from "react";
import { useClientStore } from "../store/useClientStore";
import { IoIosCloseCircle } from "react-icons/io";
import { AnimatePresence, motion } from "motion/react"


interface ClientFormProps {
    whoCreatedId: string;
}

const ClientForm: React.FC<ClientFormProps> = ({ whoCreatedId }) => {
    const [company, setCompany] = useState("");
    const [clientType, setClientType] = useState("");
    const [currency, setCurrency] = useState("");
    const [tax, setTax] = useState("");
    const [limit, setLimit] = useState(0);

    const [isAdding, setIsAdding] = useState(false);

    const addClient = useClientStore((state) => state.addClient);

    const openForm = () => {
        setIsAdding(true);
    }

    const closeForm = () => {
        setIsAdding(false);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!company || !clientType || !currency) {
            return alert("Lütfen bütün gerekli alanları doldurunuz.");
        }
        await addClient({
            company,
            clientType,
            currency,
            tax,
            limit,
            whoCreatedId
        });
        setCompany("");
        setClientType("");
        setCurrency("");
        setTax("");
        setLimit(0);
    }

    return (
        <div className="relative mx-auto">
            <button
                onClick={openForm}
                className="bg-blue-600 hover:bg-blue-400 p-3 rounded text-white absolute z-20 -top-16 right-0 mb-3"
            >Yeni Müşteri Ekle</button>
            <AnimatePresence>
                {
                    isAdding && (

                        <motion.div initial={{ opacity: 0, scale: 0 }} className='absolute w-full'
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}>
                            <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4 bg-gray-100 rounded shadow relative py-10">
                                <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Firma Adı" className="input p-3" />
                                <input value={clientType} onChange={(e) => setClientType(e.target.value)} placeholder="Müşteri Tipi" className="input p-3" />
                                <input value={currency} onChange={(e) => setCurrency(e.target.value)} placeholder="Para Birimi" className="input p-3" />
                                <input value={tax} onChange={(e) => setTax(e.target.value)} placeholder="Vergi No (opsiyonel)" className="input p-3" />
                                <input
                                    type="number"
                                    value={limit}
                                    onChange={(e) => setLimit(Number(e.target.value))}
                                    placeholder="Limit"
                                    className="input p-3"
                                />
                                <button type='submit' className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Müşteri Ekle</button>
                                <a onClick={closeForm} className="absolute top-0 right-4 text-red-500 cursor-pointer"><IoIosCloseCircle className='size-7 mt-1' /></a>
                            </form>
                        </motion.div>

                    )
                }
            </AnimatePresence>
        </div>
    )
}

export default ClientForm