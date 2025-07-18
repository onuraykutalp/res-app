import { useState } from "react";
import { useCompanyRateStore } from "../store/useCompanyRateStore";

export default function CompanyRateForm() {
  const addCompanyRate = useCompanyRateStore((s) => s.addCompanyRate);

  const [company, setCompany] = useState("");
  const [m1, setM1] = useState(0);
  const [m2, setM2] = useState(0);
  const [m3, setM3] = useState(0);
  const [v1, setV1] = useState(0);
  const [v2, setV2] = useState(0);
  const [currency, setCurrency] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    await addCompanyRate({
      company,
      m1,
      m2,
      m3,
      v1,
      v2,
      currency,
      startDate,
      endDate,
      description,
    });

    // Form sıfırla
    setCompany("");
    setM1(0);
    setM2(0);
    setM3(0);
    setV1(0);
    setV2(0);
    setCurrency("");
    setStartDate("");
    setEndDate("");
    setDescription("");
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      <input
        type="text"
        placeholder="Şirket"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        className="border px-3 py-2 rounded"
      />
      <input
        type="number"
        placeholder="M1"
        value={m1}
        onChange={(e) => setM1(parseFloat(e.target.value))}
        className="border px-3 py-2 rounded"
      />
      <input
        type="number"
        placeholder="M2"
        value={m2}
        onChange={(e) => setM2(parseFloat(e.target.value))}
        className="border px-3 py-2 rounded"
      />
      <input
        type="number"
        placeholder="M3"
        value={m3}
        onChange={(e) => setM3(parseFloat(e.target.value))}
        className="border px-3 py-2 rounded"
      />
      <input
        type="number"
        placeholder="V1"
        value={v1}
        onChange={(e) => setV1(parseFloat(e.target.value))}
        className="border px-3 py-2 rounded"
      />
      <input
        type="number"
        placeholder="V2"
        value={v2}
        onChange={(e) => setV2(parseFloat(e.target.value))}
        className="border px-3 py-2 rounded"
      />
      <input
        type="text"
        placeholder="Para Birimi"
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        className="border px-3 py-2 rounded"
      />
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="border px-3 py-2 rounded"
      />
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="border px-3 py-2 rounded"
      />
      <input
        type="text"
        placeholder="Açıklama"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border px-3 py-2 rounded md:col-span-2"
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded md:col-span-2 hover:bg-blue-700"
      >
        Kaydet
      </button>
    </div>
  );
}
