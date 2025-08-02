import { useEffect, useRef, useState } from "react";
import { RegisterForm } from "./RegisterForm";
import { useRegisterStore } from "../store/useRegisterStore";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { AccountType } from "../types/Enums";
import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa";
import RegisterDaily from "./RegisterDaily";


const accountTypeLabels: Record<AccountType, string> = {
  [AccountType.GEMI_KASA_TRY]: "Gemi Kasa (TRY)",
  [AccountType.GEMI_KASA_USD]: "Gemi Kasa (USD)",
  [AccountType.GEMI_KASA_EUR]: "Gemi Kasa (EUR)",
  [AccountType.GEMI_KASA_GBP]: "Gemi Kasa (GBP)",
  [AccountType.ISBANK_POS_TRY]: "İşbank POS (TRY)",
  [AccountType.ISBANK_POS_EUR]: "İşbank POS (EUR)",
  [AccountType.ISBANK_POS_USD]: "İşbank POS (USD)"
};

export default function RegisterList() {
  const [openForm, setOpenForm] = useState<null | "reservation" | "income" | "outcome" | "company">(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { registers, fetchRegisters } = useRegisterStore();

  const dropdownRef = useRef<HTMLDivElement>(null);

  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date().toISOString().slice(0, 10);
    return today;
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);


  useEffect(() => {
    fetchRegisters();
  }, [fetchRegisters]);

  return (
    <div className="p-4">
      <RegisterDaily />
      <div className="flex gap-3 mb-6 items-center">
        <div className="relative" ref={dropdownRef}>
          <button
            className="btn bg-[#555879] hover:bg-[#444a6b] text-white p-3 rounded flex items-center gap-2"
            onClick={() => setDropdownOpen((prev) => !prev)}
            type="button"
          >
            İşlemler
            <svg width="16" height="16" fill="currentColor" className="ml-1">
              <path d="M4 6l4 4 4-4" />
            </svg>
          </button>
          {dropdownOpen && (
            <div className="absolute left-0 mt-2 w-[250px] bg-white border rounded shadow-lg z-10">
              <button
                onClick={() => { setOpenForm("reservation"); setDropdownOpen(false); }}
                className="w-full flex text-left px-4 py-4 bg-[#555879] text-white hover:bg-[#444a6b] items-center gap-2 justify-between rounded-tl-lg rounded-tr-lg"
              >
                Rezervasyon Tahsilat <FaPlus />
              </button>
              <button
                onClick={() => { setOpenForm("income"); setDropdownOpen(false); }}
                className="flex w-full text-left px-4 py-4 bg-[#555879] text-white hover:bg-[#444a6b] items-center gap-2 justify-between"
              >
                Satış Fişi <FaPlus className="ml-1" />
              </button>
              <button
                onClick={() => { setOpenForm("outcome"); setDropdownOpen(false); }}
                className="flex w-full text-left px-4 py-4 bg-[#555879] text-white hover:bg-[#444a6b] items-center gap-2 justify-between"
              >
                Gider Fişi <FaMinus className="ml-1" />
              </button>
              <button
                onClick={() => { setOpenForm("company"); setDropdownOpen(false); }}
                className="flex w-full text-left px-4 py-4 bg-[#555879] text-white hover:bg-[#444a6b] items-center gap-2 justify-between rounded-bl-lg rounded-br-lg"
              >
                Cari Tahsilat <FaPlus className="ml-1" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Kasa Kayıtları</h2>
        <div>
          <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="border px-2 py-1 rounded mb-4" />
        </div>
        <div className="overflow-x-auto shadow rounded-lg border border-gray-200">
          <table className="min-w-full bg-white text-sm text-left">
            <thead className="bg-gray-100 font-medium text-gray-700">
              <tr>
                <th className="px-4 py-2">Gemi</th>
                <th className="px-4 py-2">Grup</th>
                <th className="px-4 py-2">Giriş (Para)</th>
                <th className="px-4 py-2">Çıkış (Para)</th>
                <th className="px-4 py-2">Para Birimi</th>
                <th className="px-4 py-2">Hesap</th>
                <th className="px-4 py-2">Açıklama</th>
                <th className="px-4 py-2">Fiş Tarihi</th>
                <th className="px-4 py-2">Kaydı Yapan</th>
              </tr>
            </thead>
            <tbody>
              {registers
                .slice()
                .sort((a, b) => new Date(b.receiptDate).getTime() - new Date(a.receiptDate).getTime())
                .map((reg) => (
                  selectedDate && reg.createdAt.slice(0, 10) === selectedDate && (
                    <tr key={reg.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2">{reg.ship || "-"}</td>
                      <td className="px-4 py-2">{reg.groupName || "-"}</td>
                      <td className="px-4 py-2 font-semibold text-green-600">{reg.entry !== undefined ? reg.entry.toFixed(2) : "-"}</td>
                      <td className="px-4 py-2 font-semibold text-red-600">{reg.out !== undefined ? reg.out.toFixed(2) : "-"}</td>
                      <td className="px-4 py-2">{reg.currency}</td>
                      <td className="px-4 py-2">{accountTypeLabels[reg.accountType as AccountType] || reg.accountType}</td>
                      <td className="px-4 py-2">{reg.description || "-"}</td>
                      <td className="px-4 py-2">
                        {format(new Date(reg.receiptDate), "dd.MM.yyyy", { locale: tr })}
                      </td>
                      <td className="px-4 py-2">{reg.createdBy?.username}</td>
                    </tr>
                  )
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Burada kasa kayıtlarını listeleyebilirsiniz */}
      {/* Kasa kayıtları için liste kısmı da ekleyebiliriz */}

      {openForm && (
        <RegisterForm
          mode={openForm}
          onClose={() => setOpenForm(null)}
        // Rezervasyon modunda seçilen rezervasyonu da props olarak vereceğiz,
        // Diğer modlarda gerek yok veya farklı props olabilir.
        />
      )}
    </div>
  );
}
