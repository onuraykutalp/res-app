import React, { useEffect, useState } from "react";
import { useReservationStore } from "../store/useReservationStore";
import { MenuPersonCount, Reservation, ReservationInput } from "../types/Reservation";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { useCompanyRateStore } from "../store/useCompanyRateStore";
import { useEmployeeStore } from "../store/useEmployeeStore";
import { useTransferPointStore } from "../store/useTransferPointStore";
import { Saloon } from "../types/Saloon";
import useSaloonStore from "../store/useSaloonStore";
import { useResTableStore } from "../store/useResTableStore";
import { AnimatePresence, motion } from "motion/react";

const ReservationList: React.FC = () => {

  const {
    reservations,
    fetchReservations,
    updateReservation,
    deleteReservation,
  } = useReservationStore();

  const [filterDate, setFilterDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [filterByCompany, setFilterByCompany] = useState<string>("");

  const { companyRates, fetchCompanyRates } = useCompanyRateStore();
  const { employees, fetchEmployees } = useEmployeeStore();
  const { transferPoints, fetchTransferPoints } = useTransferPointStore();
  const { saloons, fetchSaloons } = useSaloonStore();
  const { resTables, fetchResTables } = useResTableStore();

  const filteredByCompany = reservations.filter((res) => res.companyRate?.company.includes(filterByCompany));

  const filteredReservations = reservations.filter(
    (res) => res.date.slice(0, 10) === filterDate
  );

  useEffect(() => {
    fetchReservations();
    fetchCompanyRates();
    fetchEmployees();
  }, [fetchReservations, fetchCompanyRates, fetchEmployees, fetchTransferPoints, fetchSaloons, fetchResTables]);


  // Düzenleme için seçilen rezervasyon
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);

  const emptyMenuPersonCount: MenuPersonCount = {
    full: 0,
    half: 0,
    infant: 0,
    guide: 0,
  };

  // Form verisi state (ReservationInput yapısına uygun)
  const [formData, setFormData] = useState<ReservationInput | null>(null);



  // Rezervasyon nesnesini formData'ya dönüştürmek (MenuPersonCount uyumlu)
  const toMenuPersonCount = (val: number | undefined): MenuPersonCount => ({
    full: val || 0,
    half: 0,
    infant: 0,
    guide: 0,
  });

  const toEditableFormData = (res: Reservation): ReservationInput => ({
    ...res,
    m1: toMenuPersonCount(res.m1),
    m2: toMenuPersonCount(res.m2),
    m3: toMenuPersonCount(res.m3),
    v1: toMenuPersonCount(res.v1),
    v2: toMenuPersonCount(res.v2),
  });

  // Edit butonuna basınca formu aç
  const handleEditClick = (res: Reservation) => {
    setEditingReservation(res);
    setFormData(toEditableFormData(res));
  };


  // Menü adetleri input handler (m1, m2, v1, v2, vb.)
  const handleMenuPersonCountChange = (
    menuKey: "m1" | "m2" | "m3" | "v1" | "v2",
    personType: keyof MenuPersonCount,
    value: number
  ) => {
    setFormData((prev) => {
      if (!prev) return prev;
      const updatedMenu = { ...prev[menuKey], [personType]: value };
      // Güncellenmiş menü adetleri ile fullPrice hesapla
      const updatedForm: ReservationInput = {
        ...prev,
        [menuKey]: updatedMenu,
        date: prev.date, // Ensure date is always present
      };
      const fullPrice = calculateFullPrice(updatedForm);
      return { ...updatedForm, fullPrice };
    });
  };
  // fullPrice hesaplama fonksiyonu (CompanyRate bazlı)
  const calculateFullPrice = (data?: ReservationInput) => {
    const input = data ?? formData;
    if (!input) return 0;
    const rate = companyRates.find((r) => r.id === input.companyRateId);
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
      const menuCount = input[menuKey];
      const basePrice = rate[menuKey] || 0;

      total += menuCount.full * basePrice; // full price
      total += menuCount.half * (basePrice / 2); // half price (yarı)
      // infant ve guide ücret 0
    });

    return total;
  };

  // Input değişimi handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    if (!formData) return;
    const { name, value } = e.target;


    if (name === "companyRateId") {
      const updatedForm = { ...formData, companyRateId: value };
      const fullPrice = calculateFullPrice(updatedForm);
      setFormData({ ...updatedForm, fullPrice });
      return;
    }


    setFormData({
      ...formData,
      [name]: value,
    });
  };



  // Form submit (güncelle)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData || !editingReservation) return;

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

    try {
      await updateReservation(editingReservation.id, payload);
      setEditingReservation(null);
      setFormData(null);
      console.log("Rezervasyon güncellendi:", payload);
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  // Düzenleme iptal
  const handleCancel = () => {
    setEditingReservation(null);
    setFormData(null);
  };

  const handleDelete = async (id: string) => {
    await deleteReservation(id);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-[#555879] text-center">Rezervasyon Listesi</h1>

      {/* Filtre alanı */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="border rounded px-3 py-2 w-full sm:w-1/3"
        />
        <input
          type="text"
          value={filterByCompany}
          onChange={(e) => setFilterByCompany(e.target.value)}
          placeholder="Ara (Müşteri/Firma)"
          className="border rounded px-3 py-2 w-full sm:w-2/3"
        />
      </div>

      {/* Liste */}
      <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
        <table className="min-w-[1200px] w-full table-auto text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 text-xs uppercase">
            <tr>
              {[
                'Rez. No', 'Rez.Tarih', 'G/D Nokta', 'Müşteri',
                'M1', 'M2', 'M3', 'V1', 'V2',
                'T', 'Y', 'F', 'R', 'TK', 'Oda', 'Uyr',
                'Masa', 'Tur', 'Açıklama', 'Ödeme',
                'Veren', 'Alan', 'Tahsilat', 'Fir. Ücr.', 'Fiyat', 'İşlem'
              ].map((col, idx) => (
                <th key={idx} className="px-4 py-3 whitespace-nowrap text-center border">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {filteredReservations.map((res) => (
              <tr key={res.id} className="hover:bg-gray-50 text-center">
                <td className="px-3 py-2 border">{res.reservationNo}</td>
                <td className="px-3 py-2 border">
                  {new Date(res.date).toLocaleDateString("tr-TR")}
                </td>
                <td className="px-3 py-2 border">{res.arrivalTransfer || "-"}</td>
                <td className="px-3 py-2 border">{res.companyRate?.company || "-"}</td>
                <td className="px-2 py-1 border">{res.m1 || "-"}</td>
                <td className="px-2 py-1 border">{res.m2 || "-"}</td>
                <td className="px-2 py-1 border">{res.m3 || "-"}</td>
                <td className="px-2 py-1 border">{res.v1 || "-"}</td>
                <td className="px-2 py-1 border">{res.v2 || "-"}</td>
                <td className="px-2 py-1 border">{res.full || "-"}</td>
                <td className="px-2 py-1 border">{res.half || "-"}</td>
                <td className="px-2 py-1 border">{res.infant || "-"}</td>
                <td className="px-2 py-1 border">{res.guide || "-"}</td>
                <td className="px-2 py-1 border">{res.totalPerson || "-"}</td>
                <td className="px-2 py-1 border">{res.room || "-"}</td>
                <td className="px-2 py-1 border">{res.nationality || "-"}</td>
                <td className="px-2 py-1 border">{res.resTable?.name || "-"}</td>
                <td className="px-2 py-1 border">{res.tour || "-"}</td>
                <td className="px-2 py-1 border">{res.description || "-"}</td>
                <td className="px-2 py-1 border">{res.paymentType || "-"}</td>
                <td className="px-2 py-1 border">{res.companyRate?.company || "-"}</td>
                <td className="px-2 py-1 border">{res.resTaker?.username || "-"}</td>
                <td className="px-2 py-1 border">{res.moneyReceived || "-"}</td>
                <td className="px-2 py-1 border">{res.moneyToPayCompany || "-"}</td>
                <td className="px-2 py-1 border">{res.fullPrice || "-"}</td>
                <td className="px-2 py-1 border space-x-2">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
                    onClick={() => handleEditClick(res)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                    onClick={() => handleDelete(res.id)}
                  >
                    <MdDeleteForever />
                  </button>
                </td>
              </tr>
            ))}
            {filteredReservations.length === 0 && (
              <tr>
                <td colSpan={26} className="text-center p-4 text-gray-500">
                  Kayıt bulunamadı.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    <AnimatePresence>
      {/* Düzenleme formu - sadece editingReservation varsa göster */}
      {editingReservation && formData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 p-10"
        >
          <div className="relative w-full max-w-[1250px] mx-auto bg-white rounded-lg shadow-lg p-6 overflow-y-auto max-h-[90vh]">
            <button
              onClick={handleCancel}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl"
              aria-label="Kapat"
              type="button"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center text-[#555879]">
              Rezervasyon Düzenle
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tarih */}
                <div>
                  <label htmlFor="date" className="block text-sm font-medium mb-1">
                    Tarih
                  </label>
                  <input
                    type="datetime-local"
                    name="date"
                    value={formData.date.toString().slice(0, 16)}
                    onChange={handleChange}
                    className="border px-3 py-2 rounded w-full"
                  />
                </div>
                {/* Müşteri */}
                <div>
                  <label htmlFor="companyRateId" className="block text-sm font-medium mb-1">
                    Müşteri
                  </label>
                  <select
                    name="companyRateId"
                    value={formData.companyRateId || ""}
                    onChange={handleChange}
                    className="border px-3 py-2 rounded w-full"
                  >
                    <option value="">Müşteri Seç</option>
                    {companyRates.map((rate) => (
                      <option key={rate.id} value={rate.id}>
                        {rate.company}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Rez. Alan */}
                <div>
                  <label htmlFor="resTakerId" className="block text-sm font-medium mb-1">
                    Rez. Alan
                  </label>
                  <select
                    name="resTakerId"
                    value={formData.resTakerId || ""}
                    onChange={handleChange}
                    className="border px-3 py-2 rounded w-full"
                  >
                    <option value="">Rez. Alan Seç</option>
                    {employees.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.name} {employee.lastname}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Yetkili */}
                <div>
                  <label htmlFor="resTakerId" className="block text-sm font-medium mb-1">
                    Yetkili
                  </label>
                  <select
                    name="resTakerId"
                    value={formData.resTakerId || ""}
                    onChange={handleChange}
                    className="border px-3 py-2 rounded w-full"
                  >
                    <option value="">Rez. Alan Seç</option>
                    {employees.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.name} {employee.lastname}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Ödeme tipi */}
                <div>
                  <label htmlFor="paymentType" className="block text-sm font-medium mb-1">
                    Ödeme
                  </label>
                  <select
                    name="paymentType"
                    value={formData.paymentType || ""}
                    onChange={handleChange}
                    className="border px-3 py-2 rounded w-full"
                  >
                    <option value="Gemide">Gemide</option>
                    <option value="Cari">Cari</option>
                    <option value="Comp">Comp</option>
                    <option value="Komisyonsuz">Komisyonsuz</option>
                  </select>
                </div>
                {/* Oda */}
                <div>
                  <label htmlFor="room" className="block text-sm font-medium mb-1">
                    Oda
                  </label>
                  <input
                    type="text"
                    name="room"
                    value={formData.room || ""}
                    onChange={handleChange}
                    className="border px-3 py-2 rounded w-full"
                  />
                </div>
                {/* Voucher No */}
                <div>
                  <label htmlFor="voucherNo" className="block text-sm font-medium mb-1">
                    Voucher No
                  </label>
                  <input
                    type="text"
                    name="voucherNo"
                    value={formData.voucherNo || ""}
                    onChange={handleChange}
                    className="border px-3 py-2 rounded w-full"
                  />
                </div>
                {/* Uyruk */}
                <div>
                  <label htmlFor="nationality" className="block text-sm font-medium mb-1">
                    Uyruk
                  </label>
                  <input
                    type="text"
                    name="nationality"
                    value={formData.nationality || ""}
                    onChange={handleChange}
                    className="border px-3 py-2 rounded w-full"
                  />
                </div>
                {/* Geliş Transfer */}
                <div>
                  <label htmlFor="arrivalTransfer" className="block text-sm font-medium mb-1">
                    Geliş Transfer
                  </label>
                  <select
                    name="arrivalTransfer"
                    value={formData.arrivalTransfer || ""}
                    onChange={handleChange}
                    className="border px-3 py-2 rounded w-full"
                  >
                    <option value="">Seçiniz</option>
                    {transferPoints.map((transfer) => (
                      <option key={transfer.id} value={transfer.id}>
                        {transfer.transferPointName}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Dönüş Transfer */}
                <div>
                  <label htmlFor="returnTransfer" className="block text-sm font-medium mb-1">
                    Dönüş Transfer
                  </label>
                  <select
                    name="returnTransfer"
                    value={formData.returnTransfer || ""}
                    onChange={handleChange}
                    className="border px-3 py-2 rounded w-full"
                  >
                    <option value="">Seçiniz</option>
                    {transferPoints.map((transfer) => (
                      <option key={transfer.id} value={transfer.id}>
                        {transfer.transferPointName}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Gemi */}
                <div>
                  <label htmlFor="ship" className="block text-sm font-medium mb-1">
                    Gemi
                  </label>
                  <input
                    type="text"
                    name="ship"
                    value={formData.ship || ""}
                    onChange={handleChange}
                    className="border px-3 py-2 rounded w-full"
                  />
                </div>
                {/* Salon */}
                <div>
                  <label htmlFor="saloon" className="block text-sm font-medium mb-1">
                    Salon
                  </label>
                  <select
                    name="saloon"
                    value={formData.saloonId || ""}
                    onChange={handleChange}
                    className="border px-3 py-2 rounded w-full"
                  >
                    <option value="">Seçiniz</option>
                    {saloons.map((saloon: Saloon) => (
                      <option key={saloon.id} value={saloon.id}>
                        {saloon.saloonName}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Masa */}
                <div>
                  <label htmlFor="resTableId" className="block text-sm font-medium mb-1">
                    Masa
                  </label>
                  <select
                    name="resTableId"
                    value={formData.resTableId || ""}
                    onChange={handleChange}
                    className="border px-3 py-2 rounded w-full"
                  >
                    <option value="">Seçiniz</option>
                    {resTables.map((table) => (
                      <option key={table.id} value={table.id}>
                        {table.name}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Alınan Para */}
                <div>
                  <label htmlFor="moneyReceived" className="block text-sm font-medium mb-1">
                    Alınan Para
                  </label>
                  <input
                    type="number"
                    name="moneyReceived"
                    value={formData.moneyReceived || 0}
                    onChange={handleChange}
                    className="border px-3 py-2 rounded w-full"
                  />
                </div>
                {/* Ödenecek Para */}
                <div>
                  <label htmlFor="moneyToPayCompany" className="block text-sm font-medium mb-1">
                    Ödenecek Para
                  </label>
                  <input
                    type="number"
                    name="moneyToPayCompany"
                    value={formData.moneyToPayCompany || 0}
                    onChange={handleChange}
                    className="border px-3 py-2 rounded w-full"
                  />
                </div>
              </div>
              {/* Açıklama */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">
                  Notlar
                </label>
                <textarea
                  name="description"
                  value={formData.description || ""}
                  onChange={handleChange}
                  className="border px-3 py-2 rounded w-full min-h-[60px]"
                />
              </div>
              {/* Menü adetleri */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(["m1", "m2", "m3", "v1", "v2"] as const).map((menuKey) => (
                  <div key={menuKey} className="bg-gray-50 rounded p-3 flex flex-col gap-2">
                    <span className="font-semibold text-[#555879]">{menuKey.toUpperCase()}</span>
                    <div className="flex gap-2">
                      {(["full", "half", "infant", "guide"] as const).map((type) => {
                        const isDisabled =
                          (menuKey === "m1" || menuKey === "v1") &&
                          (type === "infant" || type === "half");
                        return (
                          <div key={type} className="flex flex-col items-center">
                            <label className="text-xs text-gray-500">{type}</label>
                            <input
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
                              disabled={isDisabled}
                              className={`border px-2 py-1 rounded w-14 text-center ${isDisabled ? "bg-gray-100" : ""}`}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              {/* Toplam Ücret */}
              <div className="flex flex-col items-end mt-2">
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
                  className="border px-2 py-1 rounded bg-gray-100 text-gray-700 w-40 text-right"
                />
              </div>
              {/* Butonlar */}
              <div className="flex gap-4 justify-center mt-6">
                <button
                  type="submit"
                  className="bg-[#98A1BC] hover:bg-blue-700 text-white font-bold rounded px-6 py-2 transition"
                >
                  Güncelle
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-red-400 hover:bg-red-500 text-white font-bold rounded px-6 py-2 transition"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>

  );
};

export default ReservationList;
