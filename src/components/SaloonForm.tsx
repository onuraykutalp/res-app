import React, { useState } from 'react';
import useSaloonStore from '../store/useSaloonStore';

interface SaloonFormProps {
    onSuccess: () => void,
}

const SaloonForm: React.FC<SaloonFormProps> = ({ onSuccess }) => {
    const { addSaloon, loading } = useSaloonStore();

    const [ship, setShip] = useState("");
    const [saloonName, setSaloonName] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!ship.trim() || !saloonName.trim()) {
            setError("Gemi ve Salon adı zorunludur");
            return;
        }

        try {
            await addSaloon({ ship, saloonName, description });
            setShip('');
            setSaloonName('');
            setDescription('');
            if (onSuccess) {
                onSuccess();
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Bilinmeyen bir hata oluştu");
            }
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded shadow">
            {error && <p className="text-red-500">{error}</p>}
            <div>
                <label>Gemi Adı:</label>
                <input type="text" value={ship} onChange={(e) => setShip(e.target.value)} placeholder='Gemi Adı' className="p-2 w-full border rounded" />
            </div>
            <div>
                <label>Salon Adı:</label>
                <input type="text" value={saloonName} onChange={(e) => setSaloonName(e.target.value)} placeholder='Salon Adı' className="p-2 w-full border rounded" />
            </div>

            <div>
                <label>Açıklama: </label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border p-2 rounded" />
            </div>

            <button
                type='submit' disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >Salon Ekle</button>
        </form>
    )
};

export default SaloonForm;