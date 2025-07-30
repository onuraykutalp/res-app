import { useEffect, useState } from "react";
import { useCompanyDebtStore } from "../store/useCompanyDebtStore";
import { CompanyDebt } from "../types/CompanyDebt";

const CompanyDebtList = () => {
  const {
    companyDebts,
    fetchCompanyDebts,
    updateCompanyDebt,
  } = useCompanyDebtStore();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [formState, setFormState] = useState<Partial<CompanyDebt>>({});

  useEffect(() => {
    fetchCompanyDebts();
  }, []);

  const handleEdit = (debt: CompanyDebt) => {
    setEditingId(debt.id);
    setFormState(debt);
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
      [name]: ["debt", "credit", "balance", "tax"].includes(name)
        ? parseFloat(value)
        : value,
    }));
  };

  const handleSave = async () => {
    if (!editingId) return;
    await updateCompanyDebt(editingId, formState);
    setEditingId(null);
    setFormState({});
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-center text-[#555879]">
        Şirket Borç/Kredi Listesi
      </h2>

      <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
        <table className="min-w-[900px] w-full table-auto text-sm text-left divide-y divide-gray-200">
          <thead className="bg-gray-100 text-gray-700 text-xs uppercase">
            <tr className="text-center">
              <th className="px-4 py-3">Şirket</th>
              <th className="px-4 py-3">Tür</th>
              <th className="px-4 py-3">Döviz</th>
              <th className="px-4 py-3">KDV</th>
              <th className="px-4 py-3">Borç</th>
              <th className="px-4 py-3">Alacak</th>
              <th className="px-4 py-3">Bakiye</th>
              <th className="px-4 py-3">Oluşturulma Tarihi</th>
              <th className="px-4 py-3">İşlem</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-100 text-center">
            {companyDebts.map((debt) => (
              <tr
                key={debt.id}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                {editingId === debt.id ? (
                  <>
                    <td className="px-4 py-2">{debt.name}</td>
                    <td className="px-4 py-2">
                      <input
                        name="companyType"
                        value={formState.companyType || ""}
                        onChange={handleChange}
                        className="w-full p-1 border rounded text-center"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        name="currency"
                        value={formState.currency || ""}
                        onChange={handleChange}
                        className="w-full p-1 border rounded text-center"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        name="tax"
                        type="number"
                        value={formState.tax ?? ""}
                        onChange={handleChange}
                        className="w-full p-1 border rounded text-center"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        name="debt"
                        type="number"
                        value={formState.debt ?? ""}
                        onChange={handleChange}
                        className="w-full p-1 border rounded text-center"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        name="credit"
                        type="number"
                        value={formState.credit ?? ""}
                        onChange={handleChange}
                        className="w-full p-1 border rounded text-center"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        name="balance"
                        type="number"
                        value={formState.balance ?? ""}
                        onChange={handleChange}
                        className="w-full p-1 border rounded text-center"
                      />
                    </td>
                    <td className="px-4 py-2">
                      {new Date(debt.createdAt).toLocaleDateString()}
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
                    <td className="px-4 py-2">{debt.name}</td>
                    <td className="px-4 py-2">{debt.companyType}</td>
                    <td className="px-4 py-2">{debt.currency}</td>
                    <td className="px-4 py-2">{debt.tax ?? "-"}</td>
                    <td className="px-4 py-2">{debt.debt}</td>
                    <td className="px-4 py-2">{debt.credit}</td>
                    <td className="px-4 py-2">{debt.balance}</td>
                    <td className="px-4 py-2">
                      {new Date(debt.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 flex gap-2 justify-center">
                      <button
                        onClick={() => handleEdit(debt)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                      >
                        Düzenle
                      </button>
                      {/* Şimdilik silme yok */}
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

export default CompanyDebtList;
