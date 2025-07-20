import { useEffect, useState } from "react";
import { CompanyRate } from "../types/CompanyRate";
import { useCompanyRateStore } from "../store/useCompanyRateStore";

const CompanyRateList = () => {
  const {
    companyRates,
    fetchCompanyRates,
    updateCompanyRate,
    deleteCompanyRate,
  } = useCompanyRateStore();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [formState, setFormState] = useState<Partial<CompanyRate>>({});

  useEffect(() => {
    fetchCompanyRates();
  }, []);

  const handleEdit = (rate: CompanyRate) => {
    setEditingId(rate.id);
    setFormState(rate);
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormState({});
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: ["m1", "m2", "m3", "v1", "v2"].includes(name)
        ? parseFloat(value)
        : value,
    }));
  };

  const handleSave = async () => {
    if (!editingId) return;
    await updateCompanyRate(editingId, formState);
    setEditingId(null);
    setFormState({});
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Şirket Fiyat Listesi</h2>
      <div className="overflow-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100 text-sm text-left">
              <th className="p-2 border">Şirket</th>
              <th className="p-2 border">M1</th>
              <th className="p-2 border">M2</th>
              <th className="p-2 border">M3</th>
              <th className="p-2 border">V1</th>
              <th className="p-2 border">V2</th>
              <th className="p-2 border">Döviz</th>
              <th className="p-2 border">Başlangıç</th>
              <th className="p-2 border">Bitiş</th>
              <th className="p-2 border">Açıklama</th>
              <th className="p-2 border">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {companyRates.map((rate) => (
              <tr key={rate.id} className="text-sm">
                {editingId === rate.id ? (
                  <>
                    <td className="p-2 border">
                      <input
                        name="company"
                        value={formState.company || ""}
                        onChange={handleChange}
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    {["m1", "m2", "m3", "v1", "v2"].map((field) => (
                      <td key={field} className="p-2 border">
                        <input
                          name={field}
                          type="number"
                          value={formState[field as keyof CompanyRate] ?? ""}
                          onChange={handleChange}
                          className="w-full p-1 border rounded"
                        />
                      </td>
                    ))}
                    <td className="p-2 border">
                      <input
                        name="currency"
                        value={formState.currency || ""}
                        onChange={handleChange}
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="p-2 border">
                      <input
                        name="startDate"
                        type="date"
                        value={
                          formState.startDate
                            ? formState.startDate.slice(0, 10)
                            : ""
                        }
                        onChange={handleChange}
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="p-2 border">
                      <input
                        name="endDate"
                        type="date"
                        value={
                          formState.endDate
                            ? formState.endDate.slice(0, 10)
                            : ""
                        }
                        onChange={handleChange}
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="p-2 border">
                      <input
                        name="description"
                        value={formState.description || ""}
                        onChange={handleChange}
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="p-2 border flex gap-2">
                      <button
                        onClick={handleSave}
                        className="bg-green-500 text-white px-2 py-1 rounded"
                      >
                        Kaydet
                      </button>
                      <button
                        onClick={handleCancel}
                        className="bg-gray-400 text-white px-2 py-1 rounded"
                      >
                        İptal
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-2 border">{rate.company}</td>
                    <td className="p-2 border">{rate.m1}</td>
                    <td className="p-2 border">{rate.m2}</td>
                    <td className="p-2 border">{rate.m3}</td>
                    <td className="p-2 border">{rate.v1}</td>
                    <td className="p-2 border">{rate.v2}</td>
                    <td className="p-2 border">{rate.currency}</td>
                    <td className="p-2 border">
                      {rate.startDate?.slice(0, 10) || "-"}
                    </td>
                    <td className="p-2 border">
                      {rate.endDate?.slice(0, 10) || "-"}
                    </td>
                    <td className="p-2 border">{rate.description}</td>
                    <td className="p-2 border flex gap-2">
                      <button
                        onClick={() => handleEdit(rate)}
                        className="bg-blue-500 text-white px-2 py-1 rounded"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => deleteCompanyRate(rate.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Sil
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompanyRateList;
