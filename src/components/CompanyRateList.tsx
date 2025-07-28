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
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRates = async () => {
      setLoading(true);
      setError(null);
      try {
        await fetchCompanyRates();
      } catch (err: unknown) {
        setError("Şirket fiyatları yüklenirken hata oluştu.");
      } finally {
        setLoading(false);
      }
    };
    loadRates();
  }, [fetchCompanyRates]);

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
        ? value === ""
          ? undefined
          : parseFloat(value)
        : value,
    }));
  };

  async function handleSave() {
    if (!editingId) return;
    try {
      await updateCompanyRate(editingId, formState);
      setEditingId(null);
      setFormState({});
    } catch {
      alert("Güncelleme sırasında hata oluştu.");
    }
  }

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-600">
        Şirket fiyatları yükleniyor...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">
        {error}
      </div>
    );
  }

  if (!Array.isArray(companyRates)) {
    return (
      <div className="p-4 text-center text-red-600">
        Şirket fiyatları listesi boş veya geçersiz formatta.
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-center text-[#555879]">
        Şirket Fiyat Listesi
      </h2>

      <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
        <table className="min-w-[1000px] w-full table-auto text-sm text-left divide-y divide-gray-200">
          <thead className="bg-gray-100 text-gray-700 text-xs uppercase">
            <tr>
              <th className="px-4 py-3 text-center">Şirket</th>
              <th className="px-4 py-3 text-center">M1</th>
              <th className="px-4 py-3 text-center">M2</th>
              <th className="px-4 py-3 text-center">M3</th>
              <th className="px-4 py-3 text-center">V1</th>
              <th className="px-4 py-3 text-center">V2</th>
              <th className="px-4 py-3 text-center">Döviz</th>
              <th className="px-4 py-3 text-center">Başlangıç</th>
              <th className="px-4 py-3 text-center">Bitiş</th>
              <th className="px-4 py-3 text-center">Açıklama</th>
              <th className="px-4 py-3 text-center">İşlem</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-100">
            {companyRates.length === 0 ? (
              <tr>
                <td colSpan={11} className="text-center py-4 text-gray-500">
                  Kayıt bulunamadı.
                </td>
              </tr>
            ) : (
              companyRates.map((rate) => {
                const isEditing = editingId === rate.id;

                return (
                  <tr
                    key={rate.id}
                    className="text-center hover:bg-gray-50 transition-colors duration-200"
                  >
                    {isEditing ? (
                      <>
                        <td className="px-4 py-2">
                          <input
                            name="companyName"
                            value={formState.companyName ?? ""}
                            onChange={handleChange}
                            className="w-full p-1 border rounded"
                          />
                        </td>

                        {["m1", "m2", "m3", "v1", "v2"].map((field) => {
                          const value = formState[field as keyof CompanyRate];
                          const inputValue =
                            typeof value === "number"
                              ? value
                              : value === undefined || value === null
                              ? ""
                              : String(value);
                          return (
                            <td key={field} className="px-4 py-2">
                              <input
                                name={field}
                                type="number"
                                value={inputValue}
                                onChange={handleChange}
                                className="w-full p-1 border rounded"
                              />
                            </td>
                          );
                        })}

                        <td className="px-4 py-2">
                          <input
                            name="currency"
                            value={formState.currency ?? ""}
                            onChange={handleChange}
                            className="w-full p-1 border rounded"
                          />
                        </td>

                        <td className="px-4 py-2">
                          <input
                            name="startDate"
                            type="date"
                            value={
                              formState.startDate
                                ? String(formState.startDate).slice(0, 10)
                                : ""
                            }
                            onChange={handleChange}
                            className="w-full p-1 border rounded"
                          />
                        </td>

                        <td className="px-4 py-2">
                          <input
                            name="endDate"
                            type="date"
                            value={
                              formState.endDate
                                ? String(formState.endDate).slice(0, 10)
                                : ""
                            }
                            onChange={handleChange}
                            className="w-full p-1 border rounded"
                          />
                        </td>

                        <td className="px-4 py-2">
                          <input
                            name="description"
                            value={formState.description ?? ""}
                            onChange={handleChange}
                            className="w-full p-1 border rounded"
                          />
                        </td>

                        <td className="px-4 py-2 flex gap-2 justify-center">
                          <button
                            onClick={handleSave}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
                          >
                            Kaydet
                          </button>
                          <button
                            onClick={handleCancel}
                            className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded text-xs"
                          >
                            İptal
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-2">{rate.companyName}</td>
                        <td className="px-4 py-2">{rate.m1}</td>
                        <td className="px-4 py-2">{rate.m2}</td>
                        <td className="px-4 py-2">{rate.m3}</td>
                        <td className="px-4 py-2">{rate.v1}</td>
                        <td className="px-4 py-2">{rate.v2}</td>
                        <td className="px-4 py-2">{rate.currency}</td>
                        <td className="px-4 py-2">
                          {rate.startDate ? String(rate.startDate).slice(0, 10) : "-"}
                        </td>
                        <td className="px-4 py-2">
                          {rate.endDate ? String(rate.endDate).slice(0, 10) : "-"}
                        </td>
                        <td
                          className="px-4 py-2 max-w-xs truncate"
                          title={rate.description ?? "-"}
                        >
                          {rate.description ?? "-"}
                        </td>
                        <td className="px-4 py-2 flex gap-2 justify-center">
                          <button
                            onClick={() => handleEdit(rate)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                          >
                            Düzenle
                          </button>
                          <button
                            onClick={() => deleteCompanyRate(rate.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                          >
                            Sil
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompanyRateList;
