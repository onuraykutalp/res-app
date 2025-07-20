import { useEffect, useState } from "react";
import { useClientStore } from "../store/useClientStore";
import { useEmployeeStore } from "../store/useEmployeeStore";
import { useSaloonStore } from "../store/useSaloonStore";
import { useResTableStore } from "../store/useResTableStore";
import { useTransferPointStore } from "../store/useTransferPointStore";
import { useReservationStore } from "../store/useReservationStore";
import { ReservationInput } from "../types/Reservation";

export default function ReservationForm() {
  const [formData, setFormData] = useState<ReservationInput>({
  date: new Date().toISOString(), // ya da kullanıcıdan seçilen geçerli tarih
  room: undefined,
  voucherNo: undefined,
  nationality: undefined,
  description: undefined,
  transferNote: undefined,
  ship: "",
  fromWhoId: undefined,
  resTakerId: "some-valid-uuid", // boş string yerine gerçek id ya da undefined/null
  authorizedId: "some-valid-uuid",
  arrivalTransferId: undefined,
  returnTransferId: undefined,
  saloonId: "some-valid-uuid",
  resTableId: "some-valid-uuid",
  m1: 0,
  m2: 0,
  m3: 0,
  v1: 0,
  v2: 0,
  full: 0,
  half: 0,
  infant: 0,
  guide: 0,
  tour: {}, // boş obje
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
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (
      [
        "m1", "m2", "m3", "v1", "v2",
        "full", "half", "infant", "guide",
        "moneyReceived", "moneyToPayCompany", "fullPrice",
      ].includes(name)
    ) {
      const parsedValue = parseInt(value);
      setFormData((prev) => ({
        ...prev,
        [name]: isNaN(parsedValue) ? 0 : parsedValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // tour dizisini oluştur
    const tour: string[] = [];
    if (formData.m1 > 0) tour.push(`${formData.m1}-M1`);
    if (formData.m2 > 0) tour.push(`${formData.m2}-M2`);
    if (formData.m3 > 0) tour.push(`${formData.m3}-M3`);
    if (formData.v1 > 0) tour.push(`${formData.v1}-V1`);
    if (formData.v2 > 0) tour.push(`${formData.v2}-V2`);

    // toplam kişi sayısı
    const totalPerson = formData.full + formData.half + formData.infant + formData.guide;

    // fullPrice basit örnek olarak:
    // Burada şirket fiyatları vs. farklı olabilir, bunu güncelleyebilirsin
    const fullPrice =
      formData.m1 * 10 +
      formData.m2 * 20 +
      formData.m3 * 30 +
      formData.v1 * 40 +
      formData.v2 * 50;

    const payload: ReservationInput = {
      ...formData,
      tour,
      fullPrice,
    };

    await createReservation(payload);

    // form reset
    setFormData({
      date: "",
      room: undefined,
      voucherNo: undefined,
      nationality: undefined,
      description: undefined,
      transferNote: undefined,
      ship: "",
      fromWhoId: undefined,
      resTakerId: "",
      authorizedId: "",
      arrivalTransferId: undefined,
      returnTransferId: undefined,
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
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4">
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

      <div>
        <label htmlFor="client" className="block mb-1 font-semibold">Müşteri</label>
        <select
          id="client"
          name="fromWhoId"
          value={formData.fromWhoId || ""}
          onChange={handleChange}
          required
          className="input border rounded px-3 py-2 w-full"
        >
          <option value="">Müşteri Seçiniz</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.company|| c.id}
            </option>
          ))}
        </select>
      </div>

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

      <div className="md:col-span-2">
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

      <div>
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

      {/* Menü adetleri */}
      {["m1", "m2", "m3", "v1", "v2"].map((key) => (
        <div key={key}>
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

      {/* Kişi sayıları */}
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

      {/* Finansal alanlar */}
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
        <label htmlFor="moneyToPayCompany" className="block mb-1 font-semibold">Şirkete Ödenecek Para</label>
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
          onChange={handleChange}
          className="input border rounded px-3 py-2 w-full"
          readOnly
        />
      </div>

      <button
        type="submit"
        className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded mt-4"
      >
        Kaydet
      </button>
    </form>
  );
}
