import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reservation, MenuPersonCount } from "../types/Reservation";
import { useCompanyRateStore } from "../store/useCompanyRateStore";
import { useEmployeeStore } from "../store/useEmployeeStore";
import { useTransferPointStore } from "../store/useTransferPointStore";
import { useSaloonStore } from "../store/useSaloonStore";
import { useResTableStore } from "../store/useResTableStore";
import { useReservationStore } from "../store/useReservationStore";

import type { CompanyRate } from "../types/CompanyRate";
import type { Employee } from "../types/Employee";
import type { TransferPoint } from "../types/TransferPoint";
import type { Saloon } from "../types/Saloon";
import type { ResTable } from "../types/ResTable";

interface ReservationEditFormProps {
    reservation: Reservation;
    closeForm: () => void;
}

type MenuCountKeys = "full" | "half" | "infant" | "guide";

const defaultMenuPersonCount: MenuPersonCount = {
    full: 0,
    half: 0,
    infant: 0,
    guide: 0,
};

const ReservationEditForm: React.FC<ReservationEditFormProps> = ({ reservation, closeForm }) => {
    const companyRates = useCompanyRateStore((state) => state.companyRates);
    const employees = useEmployeeStore((state) => state.employees);
    const transferPoints = useTransferPointStore((state) => state.transferPoints);
    const saloons = useSaloonStore((state) => state.saloons);
    const resTables = useResTableStore((state) => state.resTables);

    const updateReservation = useReservationStore((state) => state.updateReservation);

    // Form verisini reservation objesinden başlatıyoruz
    // Menu adetlerini reservation içindeki m1, m2,... alanlardan parse ederek
    // Menüleri person count objesine dönüştürmek gerekebilir, ona dikkat
    // Eğer reservation içinde menü adetleri ayrı nesne şeklinde değilse,
    // formData içinde m1,m2,m3,v1,v2 olarak MenuPersonCount tipinde tutacağız.

    // Burada örnek olarak menü adetlerini reservation'dan almak için:
    const [formData, setFormData] = useState({
        tour: reservation.tour || "",
        date: reservation.date.slice(0, 16), // datetime-local için format (yyyy-MM-ddTHH:mm)
        reservationNo: reservation.reservationNo,
        room: reservation.room || "",
        voucherNo: reservation.voucherNo || "",
        nationality: reservation.nationality || "",
        description: reservation.description || "",
        transferNote: reservation.transferNote || "",
        ship: reservation.ship || "",
        companyRateId: reservation.companyRateId || "",
        resTakerId: reservation.resTakerId || "",
        authorizedId: reservation.authorizedId || "",
        paymentType: reservation.paymentType || "Gemide",
        arrivalTransfer: reservation.arrivalTransfer || "",
        returnTransfer: reservation.returnTransfer || "",
        saloonId: reservation.saloonId || "",
        resTableId: reservation.resTableId || "",
        moneyReceived: reservation.moneyReceived || 0,
        moneyToPayCompany: reservation.moneyToPayCompany || 0,
        fullPrice: reservation.fullPrice || 0,

        m1: {
            full: reservation.m1Full ?? reservation.m1 ?? 0,
            half: reservation.m1Half ?? 0,
            infant: reservation.m1Infant ?? 0,
            guide: reservation.m1Guide ?? 0,
        },
        m2: {
            full: reservation.m2Full ?? reservation.m2 ?? 0,
            half: reservation.m2Half ?? 0,
            infant: reservation.m2Infant ?? 0,
            guide: reservation.m2Guide ?? 0,
        },
        m3: {
            full: reservation.m3Full ?? reservation.m3 ?? 0,
            half: reservation.m3Half ?? 0,
            infant: reservation.m3Infant ?? 0,
            guide: reservation.m3Guide ?? 0,
        },
        v1: {
            full: reservation.v1Full ?? reservation.v1 ?? 0,
            half: reservation.v1Half ?? 0,
            infant: reservation.v1Infant ?? 0,
            guide: reservation.v1Guide ?? 0,
        },
        v2: {
            full: reservation.v2Full ?? reservation.v2 ?? 0,
            half: reservation.v2Half ?? 0,
            infant: reservation.v2Infant ?? 0,
            guide: reservation.v2Guide ?? 0,
        },
});

// Eğer senin Reservation tipi menü adetlerini doğrudan {m1, m2,...} gibi bir yapı olarak tutuyorsa,
// ona göre mapping yapılabilir, bu sadece örnek.

// handleChange fonksiyonu (basit string, number inputlar için)
const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
        ...prev,
        [name]: name === "moneyReceived" || name === "moneyToPayCompany" || name === "fullPrice"
            ? parseFloat(value) || 0
            : value,
    }));
};

// Menü adetleri için özel handler
const handleMenuPersonCountChange = (
    menuKey: "m1" | "m2" | "m3" | "v1" | "v2",
    type: MenuCountKeys,
    value: number
) => {
    setFormData((prev) => ({
        ...prev,
        [menuKey]: {
            ...prev[menuKey],
            [type]: value,
        },
    }));
};

// fullPrice otomatik hesaplama örneği (isteğe bağlı)
useEffect(() => {
    // Burada companyRates'den fiyat çekip toplam hesaplayabilirsin
    const rate = companyRates.find(r => r.id === formData.companyRateId);
    if (!rate) return;

    const totalPrice =
        (formData.m1.full + formData.m1.half + formData.m1.infant + formData.m1.guide) * rate.m1 +
        (formData.m2.full + formData.m2.half + formData.m2.infant + formData.m2.guide) * rate.m2 +
        (formData.m3.full + formData.m3.half + formData.m3.infant + formData.m3.guide) * rate.m3 +
        (formData.v1.full + formData.v1.half + formData.v1.infant + formData.v1.guide) * rate.v1 +
        (formData.v2.full + formData.v2.half + formData.v2.infant + formData.v2.guide) * rate.v2;

    setFormData(prev => ({ ...prev, fullPrice: totalPrice }));
}, [formData.companyRateId, formData.m1, formData.m2, formData.m3, formData.v1, formData.v2, companyRates]);

// Form submit
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Burada reservation güncelleme işlemi için updateReservation çağır
    // Backend bekliyorsa uygun şekle çevir

    const updatedData = {
        ...formData,
        tour: formData.tour,
        m1Full: formData.m1.full,
        m1Half: formData.m1.half,
        m1Infant: formData.m1.infant,
        m1Guide: formData.m1.guide,
        m2Full: formData.m2.full,
        m2Half: formData.m2.half,
        m2Infant: formData.m2.infant,
        m2Guide: formData.m2.guide,
        m3Full: formData.m3.full,
        m3Half: formData.m3.half,
        m3Infant: formData.m3.infant,
        m3Guide: formData.m3.guide,
        v1Full: formData.v1.full,
        v1Half: formData.v1.half,
        v1Infant: formData.v1.infant,
        v1Guide: formData.v1.guide,
        v2Full: formData.v2.full,
        v2Half: formData.v2.half,
        v2Infant: formData.v2.infant,
        v2Guide: formData.v2.guide,
    };

    try {
        await updateReservation(reservation.id, updatedData);
        closeForm();
    } catch (error) {
        console.error("Güncelleme hatası:", error);
    }
};

return (
    <div className="relative flex flex-col items-center p-4 bg-gray-50 rounded-lg shadow-md z-50">
        <div>
            <button
                onClick={closeForm}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mb-4"
            >
                Düzenlemeyi Kapat
            </button>
        </div>

        <AnimatePresence>
            <motion.div
                className="w-full bg-gray-100 bg-opacity-75 flex items-center justify-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
            >
                <form
                    onSubmit={handleSubmit}
                    className="p-6 bg-white shadow rounded-lg w-full flex flex-col gap-6"
                >
                    <div className="flex flex-row gap-6">
                        {/* SOL BLOK */}
                        <div className="w-1/2 flex flex-row gap-4">
                            {/* Rezervasyon Bilgileri */}
                            <div className="w-1/2 border rounded p-4">
                                <h2 className="text-lg font-bold mb-4">Rezervasyon Bilgileri</h2>
                                <div className="flex flex-col gap-2">
                                    {/* Tarih */}
                                    <div className="flex items-center gap-2">
                                        <label htmlFor="date" className="w-32">
                                            Tarih
                                        </label>
                                        <input
                                            type="datetime-local"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleChange}
                                            className="border px-3 py-2 rounded flex-1"
                                        />
                                    </div>
                                    {/* Müşteri */}
                                    <div className="flex items-center gap-2">
                                        <label htmlFor="companyRateId" className="w-32">
                                            Müşteri
                                        </label>
                                        <select
                                            name="companyRateId"
                                            value={formData.companyRateId}
                                            onChange={handleChange}
                                            className="border px-3 py-2 rounded flex-1"
                                        >
                                            <option value="">Müşteri Seç</option>
                                            {companyRates.map((rate) => (
                                                <option key={rate.id} value={rate.id}>
                                                    {rate.companyName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* Rez. Alan */}
                                    <div className="flex items-center gap-2">
                                        <label htmlFor="resTakerId" className="w-32">
                                            Rez. Alan
                                        </label>
                                        <select
                                            name="resTakerId"
                                            value={formData.resTakerId}
                                            onChange={handleChange}
                                            className="border px-3 py-2 rounded flex-1"
                                        >
                                            <option value="">Seçiniz</option>
                                            {employees.map((e) => (
                                                <option key={e.id} value={e.id}>
                                                    {e.name} {e.lastname}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* Yetkili */}
                                    <div className="flex items-center gap-2">
                                        <label htmlFor="authorizedId" className="w-32">
                                            Yetkili
                                        </label>
                                        <select
                                            name="authorizedId"
                                            value={formData.authorizedId}
                                            onChange={handleChange}
                                            className="border px-3 py-2 rounded flex-1"
                                        >
                                            <option value="">Seçiniz</option>
                                            {employees.map((e) => (
                                                <option key={e.id} value={e.id}>
                                                    {e.name} {e.lastname}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* Ödeme */}
                                    <div className="flex items-center gap-2">
                                        <label htmlFor="paymentType" className="w-32">
                                            Ödeme
                                        </label>
                                        <select
                                            name="paymentType"
                                            value={formData.paymentType}
                                            onChange={handleChange}
                                            className="border px-3 py-2 rounded flex-1"
                                        >
                                            <option value="Gemide">Gemide</option>
                                            <option value="Cari">Cari</option>
                                            <option value="Comp">Comp</option>
                                            <option value="Komisyonsuz">Komisyonsuz</option>
                                        </select>
                                    </div>
                                    {/* Oda */}
                                    <div className="flex items-center gap-2">
                                        <label htmlFor="room" className="w-32">
                                            Oda
                                        </label>
                                        <input
                                            type="text"
                                            name="room"
                                            value={formData.room}
                                            onChange={handleChange}
                                            className="border px-3 py-2 rounded flex-1"
                                        />
                                    </div>
                                    {/* Voucher No */}
                                    <div className="flex items-center gap-2">
                                        <label htmlFor="voucherNo" className="w-32">
                                            Voucher No
                                        </label>
                                        <input
                                            type="text"
                                            name="voucherNo"
                                            value={formData.voucherNo}
                                            onChange={handleChange}
                                            className="border px-3 py-2 rounded flex-1"
                                        />
                                    </div>
                                    {/* Uyruk */}
                                    <div className="flex items-center gap-2">
                                        <label htmlFor="nationality" className="w-32">
                                            Uyruk
                                        </label>
                                        <input
                                            type="text"
                                            name="nationality"
                                            value={formData.nationality}
                                            onChange={handleChange}
                                            className="border px-3 py-2 rounded flex-1"
                                        />
                                    </div>
                                    {/* Notlar */}
                                    <div className="flex items-center gap-2">
                                        <label htmlFor="description" className="w-32">
                                            Notlar
                                        </label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            className="border px-3 py-2 rounded flex-1"
                                        />
                                    </div>
                                    {/* Transfer Notu */}
                                    <div className="flex items-center gap-2">
                                        <label htmlFor="transferNote" className="w-32">
                                            Transfer Notu
                                        </label>
                                        <textarea
                                            name="transferNote"
                                            value={formData.transferNote}
                                            onChange={handleChange}
                                            className="border px-3 py-2 rounded flex-1"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Transfer ve Masa Bilgileri */}
                            <div className="w-1/2 border rounded p-4">
                                <h2 className="text-lg font-bold mb-4">Transfer ve Masa Bilgileri</h2>
                                <div className="flex flex-col gap-2">
                                    {/* Geliş Transfer */}
                                    <div className="flex items-center gap-2">
                                        <label htmlFor="arrivalTransfer" className="w-32">
                                            Geliş Transfer
                                        </label>
                                        <select
                                            name="arrivalTransfer"
                                            value={formData.arrivalTransfer}
                                            onChange={handleChange}
                                            className="border px-3 py-2 rounded flex-1"
                                        >
                                            <option value="">Seçiniz</option>
                                            {transferPoints.map((t) => (
                                                <option key={t.id} value={t.id}>
                                                    {t.transferPointName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* Dönüş Transfer */}
                                    <div className="flex items-center gap-2">
                                        <label htmlFor="returnTransfer" className="w-32">
                                            Dönüş Transfer
                                        </label>
                                        <select
                                            name="returnTransfer"
                                            value={formData.returnTransfer}
                                            onChange={handleChange}
                                            className="border px-3 py-2 rounded flex-1"
                                        >
                                            <option value="">Seçiniz</option>
                                            {transferPoints.map((t) => (
                                                <option key={t.id} value={t.id}>
                                                    {t.transferPointName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* Gemi */}
                                    <div className="flex items-center gap-2">
                                        <label htmlFor="ship" className="w-32">
                                            Gemi
                                        </label>
                                        <input
                                            type="text"
                                            name="ship"
                                            value={formData.ship}
                                            onChange={handleChange}
                                            className="border px-3 py-2 rounded flex-1"
                                        />
                                    </div>
                                    {/* Salon */}
                                    <div className="flex items-center gap-2">
                                        <label htmlFor="saloonId" className="w-32">
                                            Salon
                                        </label>
                                        <select
                                            name="saloonId"
                                            value={formData.saloonId}
                                            onChange={handleChange}
                                            className="border px-3 py-2 rounded flex-1"
                                        >
                                            <option value="">Seçiniz</option>
                                            {saloons.map((s) => (
                                                <option key={s.id} value={s.id}>
                                                    {s.saloonName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* Masa */}
                                    <div className="flex items-center gap-2">
                                        <label htmlFor="resTableId" className="w-32">
                                            Masa
                                        </label>
                                        <select
                                            name="resTableId"
                                            value={formData.resTableId}
                                            onChange={handleChange}
                                            className="border px-3 py-2 rounded flex-1"
                                        >
                                            <option value="">Seçiniz</option>
                                            {resTables
                                                .filter((table) => table.id === formData.saloonId)
                                                .map((table) => (
                                                    <option key={table.id} value={table.id}>
                                                        {table.name}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                    {/* Tahsilat */}
                                    <div className="flex items-center gap-2">
                                        <label htmlFor="moneyReceived" className="w-32">
                                            Tahsilat
                                        </label>
                                        <input
                                            type="number"
                                            min={0}
                                            name="moneyReceived"
                                            value={formData.moneyReceived}
                                            onChange={handleChange}
                                            className="border px-3 py-2 rounded flex-1"
                                        />
                                    </div>
                                    {/* Fir. Ücr. */}
                                    <div className="flex items-center gap-2">
                                        <label htmlFor="moneyToPayCompany" className="w-32">
                                            Fir. Ücr.
                                        </label>
                                        <input
                                            type="number"
                                            min={0}
                                            name="moneyToPayCompany"
                                            value={formData.moneyToPayCompany}
                                            onChange={handleChange}
                                            className="border px-3 py-2 rounded flex-1"
                                        />
                                    </div>
                                    {/* Toplam Fiyat */}
                                    <div className="flex items-center gap-2">
                                        <label htmlFor="fullPrice" className="w-32">
                                            Toplam Fiyat
                                        </label>
                                        <input
                                            type="number"
                                            min={0}
                                            name="fullPrice"
                                            value={formData.fullPrice}
                                            onChange={handleChange}
                                            className="border px-3 py-2 rounded flex-1"
                                            readOnly
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SAĞ BLOK: Menü adetleri (m1, m2, m3, v1, v2) */}
                        <div className="w-1/2 flex flex-col gap-4">
                            {(["m1", "m2", "m3", "v1", "v2"] as const).map((menuKey) => (
                                <div key={menuKey} className="border rounded p-4">
                                    <h3 className="font-semibold mb-3 text-center uppercase">{menuKey.toUpperCase()}</h3>
                                    <div className="grid grid-cols-4 gap-2 text-center">
                                        {(["full", "half", "infant", "guide"] as MenuCountKeys[]).map((type) => (
                                            <div key={type} className="flex flex-col items-center">
                                                <label className="text-sm font-medium">{type.charAt(0).toUpperCase()}</label>
                                                <input
                                                    type="number"
                                                    min={0}
                                                    value={formData[menuKey][type]}
                                                    onChange={(e) => handleMenuPersonCountChange(menuKey, type, parseInt(e.target.value) || 0)}
                                                    className="border rounded px-2 py-1 text-center w-16"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-center gap-4 mt-4">
                        <button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded"
                        >
                            Güncelle
                        </button>
                        <button
                            type="button"
                            onClick={closeForm}
                            className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded"
                        >
                            İptal
                        </button>
                    </div>
                </form>
            </motion.div>
        </AnimatePresence>
    </div>
);
};

export default ReservationEditForm;
