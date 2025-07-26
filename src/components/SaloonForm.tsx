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
        <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow space-y-5"
        >
            <h2 className="text-xl font-bold text-gray-700">Salon Ekle</h2>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Gemi Adı */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gemi Adı
                </label>
                <input
                    type="text"
                    value={ship}
                    onChange={(e) => setShip(e.target.value)}
                    placeholder="Gemi Adı"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>

            {/* Salon Adı */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salon Adı
                </label>
                <input
                    type="text"
                    value={saloonName}
                    onChange={(e) => setSaloonName(e.target.value)}
                    placeholder="Salon Adı"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>

            {/* Açıklama */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Açıklama (isteğe bağlı)
                </label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Açıklama"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                    rows={3}
                />
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg shadow transition disabled:opacity-50"
            >
                {loading ? "Ekleniyor..." : "Salon Ekle"}
            </button>
        </form>

    )
};

export default SaloonForm;