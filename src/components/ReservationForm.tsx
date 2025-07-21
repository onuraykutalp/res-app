import { useEffect, useState } from "react";
import { useClientStore } from "../store/useClientStore";
import { useEmployeeStore } from "../store/useEmployeeStore";
import { useSaloonStore } from "../store/useSaloonStore";
import { useResTableStore } from "../store/useResTableStore";
import { useTransferPointStore } from "../store/useTransferPointStore";
import { useReservationStore } from "../store/useReservationStore";
import { ReservationInput } from "../types/Reservation";
import { CompanyRate } from "../types/CompanyRate";
import { AnimatePresence, motion } from "motion/react"

export default function ReservationForm() {

  const [openForm, setopenForm] = useState(false);
  const openFormHandler = () => {
    setopenForm(!openForm); // Toggle form visibility
  }

  const [companyRates, setCompanyRates] = useState<CompanyRate[]>([]);
  const [formData, setFormData] = useState<ReservationInput>({
    date: new Date().toISOString().slice(0, 16), // datetime-local format için
    room: undefined,
    voucherNo: undefined,
    nationality: undefined,
    description: undefined,
    transferNote: undefined,
    ship: "",
    companyRateId: "", // client id
    resTakerId: "",
    authorizedId: "",
    arrivalTransfer: "",
    returnTransfer: "",
    arrivalLocation: "",
    returnLocation: "",
    saloonId: "",
    resTableId: "",
    m1: 0,
    m2: 0,
    m3: 0,
    v1: 0,
    v2: 0,
    full: 0,
    half: 0,
    infant: 0,
    guide: 0,
    tour: [],
    paymentType: "Gemide",
    moneyReceived: 0,
    moneyToPayCompany: 0,
    fullPrice: 0,
  });

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
      .then(res => res.json())
      .then((data: CompanyRate[]) => setCompanyRates(data))
      .catch(err => console.error("CompanyRates fetch error:", err));
  }, []);

  // calculateFullPrice fonksiyonu
const calculateFullPrice = () => {
  const rate = companyRates.find((r) => r.id === formData.companyRateId);
  if (!rate) return 0;
  return (
    formData.m1 * rate.m1 +
    formData.m2 * rate.m2 +
    formData.m3 * rate.m3 +
    formData.v1 * rate.v1 +
    formData.v2 * rate.v2
  );
};

 const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target;

  // Sayısal alanlar
  const numericFields = ["m1", "m2", "m3", "v1", "v2", "full", "half", "infant", "guide", "moneyReceived", "moneyToPayCompany"];

  if (numericFields.includes(name)) {
    const parsedValue = parseInt(value) || 0;
    const updatedForm = { ...formData, [name]: parsedValue };

    const rate = companyRates.find((r) => r.id === updatedForm.companyRateId);
    const fullPrice = rate
      ? updatedForm.m1 * rate.m1 +
        updatedForm.m2 * rate.m2 +
        updatedForm.m3 * rate.m3 +
        updatedForm.v1 * rate.v1 +
        updatedForm.v2 * rate.v2
      : 0;

    setFormData({
      ...updatedForm,
      fullPrice,
    });
  }
  // companyRate değişirse fullPrice tekrar hesaplanmalı
  else if (name === "companyRateId") {
    const updatedForm = { ...formData, companyRateId: value };
    const rate = companyRates.find((r) => r.id === value);
    const fullPrice = rate
      ? formData.m1 * rate.m1 +
        formData.m2 * rate.m2 +
        formData.m3 * rate.m3 +
        formData.v1 * rate.v1 +
        formData.v2 * rate.v2
      : 0;

    setFormData({
      ...updatedForm,
      fullPrice,
    });
  }
  // transfer noktaları
  else if (name === "arrivalTransfer") {
    const selected = transferPoints.find((p) => p.id === value);
    setFormData((prev) => ({
      ...prev,
      arrivalTransfer: value,
      arrivalLocation: selected?.location?.locationName || "",
    }));
  } else if (name === "returnTransfer") {
    const selected = transferPoints.find((p) => p.id === value);
    setFormData((prev) => ({
      ...prev,
      returnTransfer: value,
      returnLocation: selected?.location?.locationName || "",
    }));
  }
  // diğer tüm alanlar
  else {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // tour dizisi oluşturuluyor (örneğin ["2-M1", "3-M2"])
    const tour: string[] = [];
    if (formData.m1 > 0) tour.push(`${formData.m1}-M1`);
    if (formData.m2 > 0) tour.push(`${formData.m2}-M2`);
    if (formData.m3 > 0) tour.push(`${formData.m3}-M3`);
    if (formData.v1 > 0) tour.push(`${formData.v1}-V1`);
    if (formData.v2 > 0) tour.push(`${formData.v2}-V2`);

    // toplam kişi sayısı (totalPerson) 
    const totalPerson = formData.full + formData.half + formData.infant + formData.guide;

    // basit fullPrice hesaplama (şimdilik sabit, ileride CompanyRate bazlı yapabilirsin)
    const fullPrice =
      formData.m1 * 10 +
      formData.m2 * 20 +
      formData.m3 * 30 +
      formData.v1 * 40 +
      formData.v2 * 50;

    const selectedArrival = transferPoints.find(p => p.id === formData.arrivalTransfer);
    const selectedReturn = transferPoints.find(p => p.id === formData.returnTransfer);

    const payload: ReservationInput = {
      ...formData,
      tour,
      fullPrice,
      arrivalTransfer: selectedArrival?.transferPointName || undefined,
      returnTransfer: selectedReturn?.transferPointName || undefined,
      // arrivalLocation: selectedArrival?.location?.locationName || undefined,
      // returnLocation: selectedReturn?.location?.locationName || undefined,
    };

    await createReservation(payload);

    // formu resetle
    setFormData({
      date: new Date().toISOString().slice(0, 16),
      room: undefined,
      voucherNo: undefined,
      nationality: undefined,
      description: undefined,
      transferNote: undefined,
      ship: "",
      companyRateId: "",
      resTakerId: "",
      authorizedId: "",
      arrivalTransfer: "",
      returnTransfer: "",
      saloonId: "",
      resTableId: "",
      m1: 0,
      m2: 0,
      m3: 0,
      v1: 0,
      v2: 0,
      full: 0,
      half: 0,
      infant: 0,
      guide: 0,
      tour: [],
      paymentType: "Gemide",
      moneyReceived: 0,
      moneyToPayCompany: 0,
      fullPrice: 0,
    });
  };

  return (
    <div className="relative">
      <div>
        <button
          onClick={openFormHandler}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {openForm ? "Formu Kapat" : "Yeni Rezervasyon Ekle"}
        </button>
      </div>
      <AnimatePresence>
        {
          openForm &&
          <motion.div className="absolute top-10 left-0 w-full bg-gray-100 bg-opacity-75 flex items-center justify-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Rezervasyon Tarihi */}
              <div>
                <label htmlFor="date" className="block mb-1 font-semibold">Rezervasyon Tarihi</label>
                <input
                  id="date"
                  type="datetime-local"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="input border rounded px-3 py-2 w-full"
                />
              </div>

              {/* Gemi */}
              <div>
                <label htmlFor="ship" className="block mb-1 font-semibold">Gemi</label>
                <input
                  id="ship"
                  type="text"
                  name="ship"
                  value={formData.ship}
                  onChange={handleChange}
                  required
                  className="input border rounded px-3 py-2 w-full"
                />
              </div>

              {/* Müşteri (Client) */}
              <div>
                <label htmlFor="companyRateId" className="block mb-1 font-semibold">Müşteri</label>
                <select
                  id="companyRateId"
                  name="companyRateId"
                  value={formData.companyRateId || ""}
                  onChange={handleChange}
                  required
                  className="input border rounded px-3 py-2 w-full"
                >
                  <option value="">Müşteri Seçiniz</option>
                  {companyRates.map((rate) => (
                    <option key={rate.id} value={rate.id}>
                      {rate.company} - {rate.currency} ({rate.startDate.slice(0, 10)} - {rate.endDate.slice(0, 10)})
                    </option>
                  ))}
                </select>
              </div>

              {/* Rezervasyonu Alan (Employee) */}
              <div>
                <label htmlFor="resTakerId" className="block mb-1 font-semibold">Rezervasyonu Alan</label>
                <select
                  id="resTakerId"
                  name="resTakerId"
                  value={formData.resTakerId}
                  onChange={handleChange}
                  required
                  className="input border rounded px-3 py-2 w-full"
                >
                  <option value="">Personel Seçiniz</option>
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name} {e.lastname}
                    </option>
                  ))}
                </select>
              </div>

              {/* Yetkili (Employee) */}
              <div>
                <label htmlFor="authorizedId" className="block mb-1 font-semibold">Yetkili</label>
                <select
                  id="authorizedId"
                  name="authorizedId"
                  value={formData.authorizedId}
                  onChange={handleChange}
                  required
                  className="input border rounded px-3 py-2 w-full"
                >
                  <option value="">Yetkili Seçiniz</option>
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name} {e.lastname}
                    </option>
                  ))}
                </select>
              </div>

              {/* Salon */}
              <div>
                <label htmlFor="saloonId" className="block mb-1 font-semibold">Salon</label>
                <select
                  id="saloonId"
                  name="saloonId"
                  value={formData.saloonId}
                  onChange={handleChange}
                  required
                  className="input border rounded px-3 py-2 w-full"
                >
                  <option value="">Salon Seçiniz</option>
                  {saloons.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.saloonName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Masa */}
              <div>
                <label htmlFor="resTableId" className="block mb-1 font-semibold">Masa</label>
                <select
                  id="resTableId"
                  name="resTableId"
                  value={formData.resTableId}
                  onChange={handleChange}
                  disabled={!formData.saloonId}
                  required
                  className="input border rounded px-3 py-2 w-full"
                >
                  <option value="">Masa Seçiniz</option>
                  {resTables
                    .filter((t) => t.saloon?.id === formData.saloonId)
                    .map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} (Kapasite: {t.capacity})
                      </option>
                    ))}
                </select>
              </div>

              <div className="md:col-span-5">
                <label htmlFor="arrivalTransfer" className="block mb-1 font-semibold">Geliş</label>
                <select
                  id="arrivalTransfer"
                  name="arrivalTransfer"
                  value={formData.arrivalTransfer}
                  onChange={handleChange}
                  className="input border rounded px-3 py-2 w-full"
                >
                  <option value="">Geliş Transfer</option>
                  {transferPoints
                    .map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.transferPointName}
                      </option>
                    ))}
                </select>
              </div>

              <div className="md:col-span-5">
                <label htmlFor="returnTransfer" className="block mb-1 font-semibold">Dönüş</label>
                <select
                  id="returnTransfer"
                  name="returnTransfer"
                  value={formData.returnTransfer}
                  onChange={handleChange}
                  className="input border rounded px-3 py-2 w-full"
                >
                  <option value="">Dönüş Transfer</option>
                  {transferPoints
                    .map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.transferPointName}
                      </option>
                    ))}
                </select>
              </div>

              {/* Notlar */}
              <div className="md:col-span-5">
                <label htmlFor="description" className="block mb-1 font-semibold">Notlar</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description || ""}
                  onChange={handleChange}
                  className="input border rounded px-3 py-2 w-full"
                  rows={3}
                />
              </div>

              {/* Ödeme Tipi */}
              <div className="md:col-span-5">
                <label htmlFor="paymentType" className="block mb-1 font-semibold">Ödeme Tipi</label>
                <select
                  id="paymentType"
                  name="paymentType"
                  value={formData.paymentType}
                  onChange={handleChange}
                  required
                  className="input border rounded px-3 py-2 w-full"
                >
                  <option value="Gemide">Gemide</option>
                  <option value="Cari">Cari</option>
                  <option value="Comp">Comp</option>
                  <option value="Komisyonsuz">Komisyonsuz</option>
                </select>
              </div>

              {/* Menü Adetleri */}
              {["m1", "m2", "m3", "v1", "v2"].map((key) => (
                <div className="md:col-span-1" key={key}>
                  <label htmlFor={key} className="block mb-1 font-semibold">{key.toUpperCase()}</label>
                  <input
                    id={key}
                    type="number"
                    name={key}
                    min={0}
                    value={formData[key as keyof typeof formData] as number}
                    onChange={handleChange}
                    className="input border rounded px-3 py-2 w-full"
                  />
                </div>
              ))}

              {/* Kişi Sayıları */}
              {["full", "half", "infant", "guide"].map((key) => (
                <div key={key}>
                  <label htmlFor={key} className="block mb-1 font-semibold">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                  <input
                    id={key}
                    type="number"
                    name={key}
                    min={0}
                    value={formData[key as keyof typeof formData] as number}
                    onChange={handleChange}
                    className="input border rounded px-3 py-2 w-full"
                  />
                </div>
              ))}

              {/* Finansal Alanlar */}
              <div>
                <label htmlFor="moneyReceived" className="block mb-1 font-semibold">Alınan Para</label>
                <input
                  id="moneyReceived"
                  type="number"
                  name="moneyReceived"
                  min={0}
                  step={0.01}
                  value={formData.moneyReceived}
                  onChange={handleChange}
                  className="input border rounded px-3 py-2 w-full"
                />
              </div>

              <div>
                <label htmlFor="moneyToPayCompany" className="block mb-1 font-semibold">Acenta Para</label>
                <input
                  id="moneyToPayCompany"
                  type="number"
                  name="moneyToPayCompany"
                  min={0}
                  step={0.01}
                  value={formData.moneyToPayCompany}
                  onChange={handleChange}
                  className="input border rounded px-3 py-2 w-full"
                />
              </div>

              <div>
                <label htmlFor="fullPrice" className="block mb-1 font-semibold">Toplam Ücret</label>
                <input
                  id="fullPrice"
                  type="number"
                  name="fullPrice"
                  min={0}
                  step={0.01}
                  value={formData.fullPrice}
                  readOnly
                  className="input border rounded px-3 py-2 w-full"
                />
              </div>

              <button
                type="submit"
                className="md:col-span-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded mt-6 px-4 py-2"
              >
                Kaydet
              </button>
            </form>
          </motion.div>
        }
      </AnimatePresence>
    </div>
  );
}
