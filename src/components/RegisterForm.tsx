import React, { useEffect, useState } from "react";
import { useRegisterStore } from "../store/useRegisterStore";
import { useEmployeeStore } from "../store/useEmployeeStore";
import { useIncomeStore } from "../store/useIncomeStore";
import { useOutcomeStore } from "../store/useOutcomeStore";
import { useReservationStore } from "../store/useReservationStore";
import { useCompanyDebtStore } from "../store/useCompanyDebtStore";
import { AccountType, Currency } from "../types/Enums";
import { Reservation } from "../types/Reservation";
import { AnimatePresence, motion } from "motion/react";

const accountTypeLabels: Record<AccountType, string> = {
  [AccountType.GEMI_KASA_TRY]: "Gemi Kasa (TRY)",
  [AccountType.GEMI_KASA_USD]: "Gemi Kasa (USD)",
  [AccountType.GEMI_KASA_EUR]: "Gemi Kasa (EUR)",
  [AccountType.GEMI_KASA_GBP]: "Gemi Kasa (GBP)",
  [AccountType.ISBANK_POS_TRY]: "İşbank POS (TRY)",
  [AccountType.ISBANK_POS_EUR]: "İşbank POS (EUR)",
  [AccountType.ISBANK_POS_USD]: "İşbank POS (USD)"
};

interface Props {
  mode: "income" | "outcome" | "reservation" | "company";
  reservation?: Reservation | null; // Rezervasyon modunda kullanılacak
  onClose: () => void;
}

export const RegisterForm: React.FC<Props> = ({ mode, onClose }) => {
  const { createRegister } = useRegisterStore();
  const { employees } = useEmployeeStore();
  const { incomes, fetchIncomes } = useIncomeStore();
  const { outcomes, fetchOutcomes } = useOutcomeStore();
  const { reservations, fetchReservations } = useReservationStore();
  const { companyDebts, fetchCompanyDebts } = useCompanyDebtStore();

  const [formData, setFormData] = useState({
    ship: "",
    reservationId: undefined,
    clientId: undefined,
    companyDebtId: undefined,
    groupName: "",
    accountType: AccountType.GEMI_KASA_TRY,
    currency: Currency.TRY,
    amount: 0,
    out: 0,
    description: "",
    receiptDate: new Date().toISOString().slice(0, 10),
    createdByUsername: "onur",
  });

  useEffect(() => {
    fetchIncomes();
    fetchOutcomes();
    fetchReservations();
    fetchCompanyDebts();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value } = e.target;

  const parsedValue = name === "amount" ? parseFloat(value) : value;

  setFormData((prev) => {
    const updated = {
      ...prev,
      [name]: parsedValue,
    };

    // Eğer Gider Fişi modundaysa, amount değişince out alanını da güncelle
    if (name === "amount" && mode === "outcome") {
      updated.out = typeof parsedValue === "number" ? parsedValue : parseFloat(parsedValue);
    }

    return updated;
  });
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      entry: mode === "income" || mode === "reservation" || mode === "company" ? formData.amount : 0,
      out: mode === "outcome" ? formData.out : 0,
      createdById: employees[0]?.id, // Add this line to include createdById
    };
    await createRegister(payload);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50"
      >
        <form onSubmit={handleSubmit} className="space-y-4 px-10 py-5 bg-white rounded shadow w-full max-w-md">
          <h2 className="text-lg font-semibold text-gray-700">
            {mode === "income" && "Satış Fişi"}
            {mode === "outcome" && "Gider Fişi"}
            {mode === "reservation" && "Rezervasyon Tahsilat"}
        {mode === "company" && "Cari Tahsilat"}
      </h2>

      {mode === "income" && (
        <>
          <label className="block">
            Satış Grubu:
            <select
              name="groupName"
              value={formData.groupName}
              onChange={handleChange}
              className="mt-1 block w-full border rounded px-2 py-1"
              required
            >
              <option value="">Seçiniz</option>
              {incomes.map((i) => (
                <option key={i.id} value={i.name}>
                  {i.name}
                </option>
              ))}
            </select>
          </label>
        </>
      )}

      {mode === "outcome" && (
        <>
          <label className="block">
            Gider Tipi:
            <select
              name="groupName"
              value={formData.groupName}
              onChange={handleChange}
              className="mt-1 block w-full border rounded px-2 py-1"
              required
            >
              <option value="">Seçiniz</option>
              {outcomes.map((o) => (
                <option key={o.id} value={o.name}>
                  {o.name}
                </option>
              ))}
            </select>
          </label>
        </>
      )}

      {mode === "reservation" && (
        <>
          <label className="block">
            Rezervasyon No:
            <select
              name="reservationId"
              value={formData.reservationId || ""}
              onChange={handleChange}
              className="mt-1 block w-full border rounded px-2 py-1"
              required
            >
              <option value="">Seçiniz</option>
              {reservations
                .filter((r) => r.paymentType === "Gemide")
                .map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.reservationNo} - {r.companyRate?.company} - {r.fullPrice.toFixed(2)} {r.companyRate?.currency}
                  </option>
                ))}
            </select>
          </label>
        </>
      )}

      {mode === "company" && (
        <>
          <label className="block">
            Müşteri (Acenta/Otel):
            <select
              name="companyDebtId"
              value={formData.companyDebtId || ""}
              onChange={handleChange}
              className="mt-1 block w-full border rounded px-2 py-1"
              required
            >
              <option value="">Seçiniz</option>
              {companyDebts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
        </>
      )}

      <label className="block">
        Tutar:
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          className="mt-1 block w-full border rounded px-2 py-1"
          required
        />
      </label>

      <label className="block">
        Hesap Tipi:
        <select
          name="accountType"
          value={formData.accountType}
          onChange={handleChange}
          className="mt-1 block w-full border rounded px-2 py-1"
          required
        >
          {Object.values(AccountType).map((type) => (
            <option key={type} value={type}>
              {accountTypeLabels[type]}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        Döviz:
        <select
          name="currency"
          value={formData.currency}
          onChange={handleChange}
          className="mt-1 block w-full border rounded px-2 py-1"
          required
        >
          {Object.values(Currency).map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        Açıklama:
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full border rounded px-2 py-1"
        />
      </label>

      <label className="block">
        Fiş Tarihi:
        <input
          type="date"
          name="receiptDate"
          value={formData.receiptDate}
          onChange={handleChange}
          className="mt-1 block w-full border rounded px-2 py-1"
          required
        />
      </label>

      <div className="flex gap-4 mt-4">
        <button type="submit" className="bg-[#555879] hover:bg-[#444b5a] text-white px-4 py-2 rounded">
          Kaydet
        </button>
        <button type="button" onClick={onClose} className="text-white bg-red-400 hover:bg-[#c53030] underline rounded py-2 px-4">
          Vazgeç
        </button>
      </div>
    </form>
    </motion.div>
      </AnimatePresence>
  );
};
