import { useEffect, useState } from "react";
import { useClientStore } from "../store/useClientStore";
import { useEmployeeStore } from "../store/useEmployeeStore";
import { useSaloonStore } from "../store/useSaloonStore";
import { useResTableStore } from "../store/useResTableStore";
import { useTransferPointStore } from "../store/useTransferPointStore";
import { useReservationStore } from "../store/useReservationStore";
import { ReservationInput, MenuPersonCount } from "../types/Reservation";
import { CompanyRate } from "../types/CompanyRate";
import { AnimatePresence, motion } from "motion/react";

export default function ReservationForm() {
  const [openForm, setOpenForm] = useState(false);
  const openFormHandler = () => setOpenForm(!openForm);
  const closeFormHandler = () => setOpenForm(false);

  const [companyRates, setCompanyRates] = useState<CompanyRate[]>([]);

  const emptyMenuPersonCount: MenuPersonCount = {
    full: 0,
    half: 0,
    infant: 0,
    guide: 0,
  };

  // Burada companyDebtId yokken hata veriyordu, undefined yaparak çözüyoruz.
  const [formData, setFormData] = useState<ReservationInput>({
    date: new Date().toISOString().slice(0, 16),
    room: "",
    voucherNo: "",
    nationality: "",
    description: "",
    transferNote: undefined,
    ship: "",
    companyRateId: "",
    companyDebtId: undefined,  // burayı böyle yapmalısın
    resTakerId: "",
    authorizedId: "",
    arrivalTransfer: "",
    returnTransfer: "",
    arrivalLocation: "",
    returnLocation: "",
    saloonId: "",
    resTableId: "",
    m1: { ...emptyMenuPersonCount },
    m2: { ...emptyMenuPersonCount },
    m3: { ...emptyMenuPersonCount },
    v1: { ...emptyMenuPersonCount },
    v2: { ...emptyMenuPersonCount },
    tour: [],
    paymentType: "Gemide",
    moneyReceived: 0,
    moneyToPayCompany: 0,
    fullPrice: 0,
  });

  useEffect(() => {
    if (formData.companyRateId) {
      fetch(`http://localhost:3001/api/company-debts/${formData.companyRateId}`)
        .then((res) => res.json())
        .then((debt) => {
          if (debt?.id) {
            setFormData((prev) => ({ ...prev, companyDebtId: debt.id }));
          } else {
            setFormData((prev) => ({ ...prev, companyDebtId: undefined }));
          }
        })
        .catch(console.error);
    } else {
      // Eğer companyRateId boş ise companyDebtId de sıfırlansın
      setFormData((prev) => ({ ...prev, companyDebtId: undefined }));
    }
  }, [formData.companyRateId]);

  const { clients, fetchClients } = useClientStore();
  const { employees, fetchEmployees } = useEmployeeStore();
  const { saloons, fetchSaloons } = useSaloonStore();
  const { resTables, fetchResTables } = useResTableStore();
  const { transferPoints, fetchTransferPoints } = useTransferPointStore();
  const { createReservation } = useReservationStore();

  useEffect(() => {
    fetchClients();
    fetchEmployees();
    fetchSaloons();
    fetchTransferPoints();
    fetchResTables();

    fetch("http://localhost:3001/api/company-rates")
      .then((res) => res.json())
      .then((data: CompanyRate[]) => setCompanyRates(data))
      .catch((err) => console.error("CompanyRates fetch error:", err));
  }, []);

  // Menü için kişi sayısı güncelleme fonksiyonu
  const handleMenuPersonCountChange = (
    menuKey: "m1" | "m2" | "m3" | "v1" | "v2",
    personType: keyof MenuPersonCount,
    value: number
  ) => {
    setFormData((prev) => {
      const updatedMenu = { ...prev[menuKey], [personType]: value };
      // Güncellenmiş menü adetleri ile fullPrice hesapla
      const updatedForm = { ...prev, [menuKey]: updatedMenu };
      const fullPrice = calculateFullPrice(updatedForm);
      return { ...updatedForm, fullPrice };
    });
  };

  // Diğer inputlar için handleChange
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "companyRateId") {
      const updatedForm = { ...formData, companyRateId: value };
      const fullPrice = calculateFullPrice(updatedForm);
      setFormData({ ...updatedForm, fullPrice });
      return;
    }

    if (name === "arrivalTransfer") {
      const selected = transferPoints.find((p) => p.id === value);
      setFormData((prev) => ({
        ...prev,
        arrivalTransfer: value,
        arrivalLocation: selected?.location?.locationName || "",
      }));
      return;
    }

    if (name === "returnTransfer") {
      const selected = transferPoints.find((p) => p.id === value);
      setFormData((prev) => ({
        ...prev,
        returnTransfer: value,
        returnLocation: selected?.location?.locationName || "",
      }));
      return;
    }

    // Normal string/number input
    setFormData((prev) => ({
      ...prev,
      [name]:
        e.target.type === "number"
          ? parseInt(value) || 0
          : value,
    }));
  };

  // fullPrice hesaplama fonksiyonu (CompanyRate bazlı)
  const calculateFullPrice = (data: ReservationInput = formData) => {
    const rate = companyRates.find((r) => r.id === data.companyRateId);
    if (!rate) return 0;

    const menus: ("m1" | "m2" | "m3" | "v1" | "v2")[] = [
      "m1",
      "m2",
      "m3",
      "v1",
      "v2",
    ];
    let total = 0;

    menus.forEach((menuKey) => {
      const menuCount = data[menuKey];
      const basePrice = rate[menuKey] || 0;

      total += menuCount.full * basePrice; // full price
      total += menuCount.half * (basePrice / 2); // half price (yarı)
      // infant ve guide ücret 0
    });

    return total;
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const tour: string[] = [];
  let totalFull = 0;
  let totalHalf = 0;
  let totalInfant = 0;
  let totalGuide = 0;

  (["m1", "m2", "m3", "v1", "v2"] as const).forEach((menuKey) => {
    const count = formData[menuKey];
    const totalCount = count.full + count.half + count.infant + count.guide;

    totalFull += count.full;
    totalHalf += count.half;
    totalInfant += count.infant;
    totalGuide += count.guide;

    if (totalCount > 0) tour.push(`${totalCount}-${menuKey.toUpperCase()}`);
  });

  const totalPerson = totalFull + totalHalf + totalInfant + totalGuide;

  const selectedArrival = transferPoints.find(p => p.id === formData.arrivalTransfer);
  const selectedReturn = transferPoints.find(p => p.id === formData.returnTransfer);

  const payload = {
    ...formData,
    tour,
    description: formData.description || "",
    nationality: formData.nationality || "",
    arrivalTransfer: selectedArrival?.transferPointName || undefined,
    returnTransfer: selectedReturn?.transferPointName || undefined,
    arrivalLocation: selectedArrival?.location?.locationName || undefined,
    returnLocation: selectedReturn?.location?.locationName || undefined,
    m1Count: formData.m1.full,
    m2Count: formData.m2.full,
    m3Count: formData.m3.full,
    v1Count: formData.v1.full,
    v2Count: formData.v2.full,
    full: totalFull,
    half: totalHalf,
    infant: totalInfant,
    guide: totalGuide,
    totalPerson,
  };

  await createReservation(payload);

  // Reset form:
  setFormData({
    date: new Date().toISOString().slice(0, 16),
    room: "",
    voucherNo: "",
    nationality: "",
    description: "",
    transferNote: undefined,
    ship: "",
    companyRateId: "",
    companyDebtId: "",
    resTakerId: "",
    authorizedId: "",
    arrivalTransfer: "",
    returnTransfer: "",
    arrivalLocation: "",
    returnLocation: "",
    saloonId: "",
    resTableId: "",
    m1: { ...emptyMenuPersonCount },
    m2: { ...emptyMenuPersonCount },
    m3: { ...emptyMenuPersonCount },
    v1: { ...emptyMenuPersonCount },
    v2: { ...emptyMenuPersonCount },
    tour: [],
    paymentType: "Gemide",
    moneyReceived: 0,
    moneyToPayCompany: 0,
    fullPrice: 0,
  });

  closeFormHandler();
  console.log("Gönderilen payload:", payload); // <-- formData değil, payload loglanmalı
};

  return (
    <div className="relative flex flex-col items-center p-4 bg-gray-50 rounded-lg shadow-md">
      <div>
        <button
          onClick={openFormHandler}
          className="bg-[#555879] hover:bg-[#4a4c68] text-white font-bold py-2 px-4 rounded"
        >
          {openForm ? "Formu Kapat" : "Yeni Rezervasyon Ekle"}
        </button> 
      </div>

      <AnimatePresence>
        {openForm && (
          <motion.div
            className="absolute top-0 left-0 w-full bg-gray-100 bg-opacity-75 flex items-center justify-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <form onSubmit={handleSubmit} className="p-6 bg-white shadow rounded-lg w-full flex flex-col gap-6">
              <div className="flex flex-row gap-6">
                {/* SOL BLOK */}
                <div className="w-1/2 flex flex-row gap-4">
                  {/* Rezervasyon Bilgileri (w-1/2) */}
                  <div className="w-1/2 border rounded p-4">
                    <h2 className="text-lg font-bold mb-4">Rezervasyon Bilgileri</h2>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <label htmlFor="date" className="w-32">Tarih</label>
                        <input type="datetime-local" name="date" value={formData.date} onChange={handleChange} className="border px-3 py-2 rounded flex-1" />
                      </div>
                      <div className="flex items-center gap-2">
                        <label htmlFor="companyRateId" className="w-32">Müşteri</label>
                        <select name="companyRateId" value={formData.companyRateId} onChange={handleChange} className="border px-3 py-2 rounded flex-1">
                          <option value="">Müşteri Seç</option>
                          {companyRates.map((rate) => (
                            <option key={rate.id} value={rate.id}>{rate.company}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        <label htmlFor="resTakerId" className="w-32">Rez. Alan</label>
                        <select name="resTakerId" value={formData.resTakerId} onChange={handleChange} className="border px-3 py-2 rounded flex-1">
                          <option value="">Seçiniz</option>
                          {employees.map((e) => (
                            <option key={e.id} value={e.id}>{e.name} {e.lastname}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        <label htmlFor="authorizedId" className="w-32">Yetkili</label>
                        <select name="authorizedId" value={formData.authorizedId} onChange={handleChange} className="border px-3 py-2 rounded flex-1">
                          <option value="">Seçiniz</option>
                          {employees.map((e) => (
                            <option key={e.id} value={e.id}>{e.name} {e.lastname}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        <label htmlFor="paymentType" className="w-32">Ödeme</label>
                        <select name="paymentType" value={formData.paymentType} onChange={handleChange} className="border px-3 py-2 rounded flex-1">
                          <option value="Gemide">Gemide</option>
                          <option value="Cari">Cari</option>
                          <option value="Comp">Comp</option>
                          <option value="Komisyonsuz">Komisyonsuz</option>
                        </select>
                      </div>

                      
                      <div className="flex items-center gap-2">
                        <label htmlFor="room" className="w-32">Oda</label>
                        <input type="text" name="room" value={formData.room || ""} onChange={handleChange} className="border px-3 py-2 rounded flex-1" />
                      </div>

                      <div className="flex items-center gap-2">
                        <label htmlFor="voucherNo" className="w-32">Voucher No</label>
                        <input type="text" name="voucherNo" value={formData.voucherNo || ""} onChange={handleChange} className="border px-3 py-2 rounded flex-1" />
                      </div>

                      <div className="flex items-center gap-2">
                        <label htmlFor="nationality" className="w-32">Uyruk</label>
                        <input type="text" name="nationality" value={formData.nationality || ""} onChange={handleChange} className="border px-3 py-2 rounded flex-1" />
                      </div>

                      <div className="flex items-center gap-2">
                        <label htmlFor="description" className="w-32">Notlar</label>
                        <textarea name="description" value={formData.description || ""} onChange={handleChange} className="border px-3 py-2 rounded flex-1" />
                      </div>

                      <div className="flex items-center gap-2">
                        <label htmlFor="transferNote" className="w-32">Transfer Notu</label>
                        <textarea name="transferNote" value={formData.transferNote || ""} onChange={handleChange} className="border px-3 py-2 rounded flex-1" />
                      </div>


                    </div>
                  </div>

                  {/* Transfer ve Masa Bilgileri */}
                  <div className="w-1/2 border rounded p-4">
                    <h2 className="text-lg font-bold mb-4">Transfer ve Masa Bilgileri</h2>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <label htmlFor="arrivalTransfer" className="w-32">Geliş Transfer</label>
                        <select name="arrivalTransfer" value={formData.arrivalTransfer} onChange={handleChange} className="border px-3 py-2 rounded flex-1">
                          <option value="">Seçiniz</option>
                          {transferPoints.map((t) => (
                            <option key={t.id} value={t.id}>{t.transferPointName}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        <label htmlFor="returnTransfer" className="w-32">Dönüş Transfer</label>
                        <select name="returnTransfer" value={formData.returnTransfer} onChange={handleChange} className="border px-3 py-2 rounded flex-1">
                          <option value="">Seçiniz</option>
                          {transferPoints.map((t) => (
                            <option key={t.id} value={t.id}>{t.transferPointName}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        <label htmlFor="ship" className="w-32">Gemi</label>
                        <input type="text" name="ship" value={formData.ship} onChange={handleChange} className="border px-3 py-2 rounded flex-1" />
                      </div>

                      <div className="flex items-center gap-2">
                        <label htmlFor="saloonId" className="w-32">Salon</label>
                        <select name="saloonId" value={formData.saloonId} onChange={handleChange} className="border px-3 py-2 rounded flex-1">
                          <option value="">Salon Seç</option>
                          {saloons.map((s) => (
                            <option key={s.id} value={s.id}>{s.saloonName}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        <label htmlFor="resTableId" className="w-32">Masa</label>
                        <select name="resTableId" value={formData.resTableId} onChange={handleChange} disabled={!formData.saloonId} className="border px-3 py-2 rounded flex-1">
                          <option value="">Masa Seçiniz</option>
                          {resTables.filter((t) => t.saloon?.id === formData.saloonId).map((t) => (
                            <option key={t.id} value={t.id}>{t.name} (Kapasite: {t.capacity})</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                {/* SAĞ BLOK - Menü Adetleri */}
                <div className="w-1/3 h-[275px] border rounded p-4 flex flex-col justify-between text-sm">
                  {/* Menü Girişleri: M1–V2 */}
                  <div className="flex flex-col gap-1">
                    {(["m1", "m2", "m3", "v1", "v2"] as const).map((menuKey) => (
                      <div
                        key={menuKey}
                        className="flex items-center justify-start gap-3"
                      >
                        <span className="font-semibold w-10">{menuKey.toUpperCase()}</span>
                        {(["full", "half", "infant", "guide"] as const).map((type) => {
                          // Disable "infant" and "half" for m1 and v2
                          const isDisabled =
                            (menuKey === "m1" || menuKey === "v1") &&
                            (type === "infant" || type === "half");
                          return (
                            <div key={type} className="flex items-center gap-1">
                              <label htmlFor={`${menuKey}-${type}`} className="w-12 text-right">
                                {type}
                              </label>
                              <input
                                id={`${menuKey}-${type}`}
                                type="number"
                                min={0}
                                value={formData[menuKey][type]}
                                onChange={(e) =>
                                  handleMenuPersonCountChange(
                                    menuKey,
                                    type,
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                className="border px-2 py-[2px] rounded w-16"
                                disabled={isDisabled}
                              />
                            </div>
                          );
                        })}
                        {/* Show price for this menuKey */}
                        <span className="ml-2 text-xs text-gray-600 w-1/4">
                          {(() => {
                            const rate = companyRates.find(r => r.id === formData.companyRateId);
                            if(rate?.currency === "TL") {
                              return `${rate[menuKey]} TL`;
                            }
                            if(rate?.currency === "USD") {
                              return `${rate[menuKey]} $`;
                            }
                            if(rate?.currency === "EUR") {
                              return `${rate[menuKey]} €`;
                            }
                           else{
                            return "-";
                           }
                          })()}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Finansal Bilgiler */}
                  <div className="grid grid-cols-3 gap-4 mt-2">
                    <div className="flex flex-col">
                      <label htmlFor="moneyReceived" className="font-semibold mb-1">
                        Alınan Para
                      </label>
                      <input
                        id="moneyReceived"
                        type="number"
                        name="moneyReceived"
                        min={0}
                        step={0.01}
                        value={formData.moneyReceived}
                        onChange={handleChange}
                        className="border px-2 py-1 rounded"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="moneyToPayCompany" className="font-semibold mb-1">
                        Acenta Para
                      </label>
                      <input
                        id="moneyToPayCompany"
                        type="number"
                        name="moneyToPayCompany"
                        min={0}
                        step={0.01}
                        value={formData.moneyToPayCompany}
                        onChange={handleChange}
                        className="border px-2 py-1 rounded"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="fullPrice" className="font-semibold mb-1">
                        Toplam Ücret
                      </label>
                      <input
                        id="fullPrice"
                        type="number"
                        name="fullPrice"
                        min={0}
                        step={0.01}
                        value={formData.fullPrice}
                        readOnly
                        className="border px-2 py-1 rounded bg-gray-100 text-gray-700"
                      />
                    </div>
                  </div>
                </div>

              </div>
              <div className="gap-4 flex justify-center">
                <button type="submit" className="bg-[#98A1BC] hover:bg-blue-700 text-white font-bold rounded mt-6 px-4 py-2 w-fit self-center">
                  Kaydet
                </button>
                <button type="button" className="bg-red-400 hover:bg-red-500 text-white font-bold rounded mt-6 px-4 py-2 w-fit self-center" onClick={closeFormHandler}>
                  İptal
                </button>
              </div>

            </form>




          </motion.div>
        )}
      </AnimatePresence>
    </div >
  )
}

  
  
