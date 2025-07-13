import React from 'react'
import { useState } from "react";
import { useClientStore } from "../store/useClientStore";

interface ClientFormProps {
    whoCreatedId: string;
}

const ClientForm: React.FC<ClientFormProps> = ({ whoCreatedId }) => {
    const [company, setCompany] = useState("");
    const [clientType, setClientType] = useState("");
    const [currency, setCurrency] = useState("");
    const [tax, setTax] = useState("");
    const [limit, setLimit] = useState(0);

    const addClient = useClientStore((state) => state.addClient);

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
        <div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4 bg-gray-100 rounded shadow">
                <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Firma Adı" className="input" />
                <input value={clientType} onChange={(e) => setClientType(e.target.value)} placeholder="Müşteri Tipi" className="input" />
                <input value={currency} onChange={(e) => setCurrency(e.target.value)} placeholder="Para Birimi" className="input" />
                <input value={tax} onChange={(e) => setTax(e.target.value)} placeholder="Vergi No (opsiyonel)" className="input" />
                <input
                    type="number"
                    value={limit}
                    onChange={(e) => setLimit(Number(e.target.value))}
                    placeholder="Limit"
                    className="input"
                />
                <button type='submit' className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Müşteri Ekle</button>
            </form>
        </div>
    )
}

export default ClientForm