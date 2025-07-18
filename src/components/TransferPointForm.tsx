import { useState, useEffect } from "react";
import { TransferLocation } from "../types/TransferLocation";
import { useTransferPointStore } from "../store/useTransferPointStore";
import { useTransferLocationStore } from "../store/useTransferLocationStore";

const TransferPointForm = () => {
  const { createTransferPoint, loading } = useTransferPointStore();
  const { locations, fetchTransferLocations } = useTransferLocationStore();

  const [form, setForm] = useState({
    transferPointName: "",
    time: "",
    description: "",
    locationId: "",
  });

  useEffect(() => {
    fetchTransferLocations();
  }, [fetchTransferLocations]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.locationId) {
      alert("Lütfen bir lokasyon seçin.");
      return;
    }
    await createTransferPoint(form);
    setForm({ transferPointName: "", time: "", description: "", locationId: "" });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white rounded shadow space-y-4"
    >
      <h2 className="text-xl font-semibold mb-4">Yeni Transfer Noktası Ekle</h2>

      <div>
        <label htmlFor="transferPointName" className="block mb-1 font-medium">
          Transfer Nokta Adı
        </label>
        <input
          id="transferPointName"
          name="transferPointName"
          type="text"
          value={form.transferPointName}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded p-2"
          placeholder="Örn: Havalimanı Terminal 1"
        />
      </div>

      <div>
        <label htmlFor="time" className="block mb-1 font-medium">
          Zaman
        </label>
        <input
          id="time"
          name="time"
          type="time"
          value={form.time}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded p-2"
        />
      </div>

      <div>
        <label htmlFor="description" className="block mb-1 font-medium">
          Açıklama (Opsiyonel)
        </label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          className="w-full border border-gray-300 rounded p-2"
          placeholder="Ekstra bilgiler..."
        />
      </div>

      <div>
        <label htmlFor="locationId" className="block mb-1 font-medium">
          Lokasyon
        </label>
        <select
          id="locationId"
          name="locationId"
          value={form.locationId}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded p-2"
        >
          <option value="">Lokasyon Seçiniz</option>
          {locations.map((loc: TransferLocation) => (
            <option key={loc.id} value={loc.id}>
              {loc.locationName}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 rounded text-white ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Ekleniyor..." : "Ekle"}
      </button>
    </form>
  );
};

export default TransferPointForm;
