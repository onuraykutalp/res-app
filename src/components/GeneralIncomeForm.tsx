import React, { useState } from "react";
import { useGeneralIncomeStore } from "../store/useGeneralIncome";

const GeneralIncomeForm: React.FC = () => {
  const { addIncome } = useGeneralIncomeStore();

  const [formValues, setFormValues] = useState({
    menuName: "",
    currency: "₺",
    flierPrice: "" as string | number,
    otelPrice: "" as string | number,
    fiveAndFarPrice: "" as string | number,
    agencyPrice: "" as string | number,
    guidePrice: "" as string | number,
    individualPrice: "" as string | number,
    companyPrice: "" as string | number,
    onlinePrice: "" as string | number,
    othersPrice: "" as string | number,
    startedAt: "",
    endedAt: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "number") {
      setFormValues((prev) => ({
        ...prev,
        [name]: value === "" ? "" : Number(value),
      }));
    } else {
      setFormValues((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Boş string olan fiyat alanlarını 0 yap
    const preparedValues = {
      ...formValues,
      flierPrice: Number(formValues.flierPrice) || 0,
      otelPrice: Number(formValues.otelPrice) || 0,
      fiveAndFarPrice: Number(formValues.fiveAndFarPrice) || 0,
      agencyPrice: Number(formValues.agencyPrice) || 0,
      guidePrice: Number(formValues.guidePrice) || 0,
      individualPrice: Number(formValues.individualPrice) || 0,
      companyPrice: Number(formValues.companyPrice) || 0,
      onlinePrice: Number(formValues.onlinePrice) || 0,
      othersPrice: Number(formValues.othersPrice) || 0,
    };

    await addIncome({ ...preparedValues, createdAt: new Date().toISOString() });

    setFormValues({
      menuName: "",
      currency: "₺",
      flierPrice: "",
      otelPrice: "",
      fiveAndFarPrice: "",
      agencyPrice: "",
      guidePrice: "",
      individualPrice: "",
      companyPrice: "",
      onlinePrice: "",
      othersPrice: "",
      startedAt: "",
      endedAt: "",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-xl space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-800">Genel Gelir Ekle</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Menü Adı</label>
          <input
            type="text"
            name="menuName"
            value={formValues.menuName}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Para Birimi</label>
          <select
            name="currency"
            value={formValues.currency}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="₺">₺</option>
            <option value="$">$</option>
            <option value="€">€</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Broşür</label>
          <input
            type="number"
            step="any"
            name="flierPrice"
            value={formValues.flierPrice}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        {/* Diğer fiyat inputları */}
        {[
          ["otelPrice", "Otel"],
          ["fiveAndFarPrice", "5+ Uzak"],
          ["agencyPrice", "Acenta"],
          ["guidePrice", "Rehber"],
          ["individualPrice", "Bireysel"],
          ["companyPrice", "Kurumsal"],
          ["onlinePrice", "Online"],
          ["othersPrice", "Diğer"],
        ].map(([key, label]) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <input
              type="number"
              step="any"
              name={key}
              value={(formValues as any)[key]}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium text-gray-700">Başlangıç Tarihi</label>
          <input
            type="date"
            name="startedAt"
            value={formValues.startedAt}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Bitiş Tarihi</label>
          <input
            type="date"
            name="endedAt"
            value={formValues.endedAt}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
      >
        Kaydet
      </button>
    </form>
  );
};

export default GeneralIncomeForm;
