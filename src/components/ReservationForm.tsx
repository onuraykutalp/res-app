import { useEffect, useState } from "react";
import { useClientStore } from "../store/useClientStore";
import { useEmployeeStore } from "../store/useEmployeeStore";
import { useSaloonStore } from "../store/useSaloonStore";
import { useResTableStore } from "../store/useResTableStore";
import { useTransferPointStore } from "../store/useTransferPointStore";
import { useReservationStore } from "../store/useReservationStore";

interface ReservationFormData {
  name: string;
  phone: string;
  date: string;
  clientId: string;
  resTakerId: string;
  fromWhoId: string;
  saloonId: string;
  resTableId: string;
  arrivalTransferPointId: string;
  returnTransferPointId: string;
  notes: string;
  paymentType: string;      // yeni alan
  nationality: string;      // yeni alan
  ship: string;             // yeni alan
  authorizedId: string;     // yeni alan
  menuId: string;           // yeni alan
}

export default function ReservationForm() {
  const [formData, setFormData] = useState<ReservationFormData>({
    name: "",
    phone: "",
    date: "",
    clientId: "",
    resTakerId: "",
    fromWhoId: "",
    saloonId: "",
    resTableId: "",
    arrivalTransferPointId: "",
    returnTransferPointId: "",
    notes: "",
    paymentType: "",               // EKLENDİ
    nationality: "",               // EKLENDİ
    ship: "",                      // EKLENDİ
    authorizedId: "",              // EKLENDİ
    menuId: "",                    // EKLENDİ
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        // tarih formatını ISO string'e çevir
        date: new Date(formData.date).toISOString(),
      };

      await createReservation(payload); // bu fonksiyon ID'lerle çalışmalı

      setFormData({
        name: "",
        phone: "",
        date: "",
        clientId: "",
        resTakerId: "",
        fromWhoId: "",
        saloonId: "",
        resTableId: "",
        arrivalTransferPointId: "",
        returnTransferPointId: "",
        notes: "",

        paymentType: "",
        nationality: "",
        ship: "",
        authorizedId: "",
        menuId: "",
      });
    } catch (err) {
      console.error("Rezervasyon kaydı başarısız:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-6">Yeni Rezervasyon</h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <input
          type="text"
          name="name"
          placeholder="İsim"
          value={formData.name}
          onChange={handleChange}
          className="input border rounded-md px-4 py-2"
        />

        <input
          type="text"
          name="phone"
          placeholder="Telefon"
          value={formData.phone}
          onChange={handleChange}
          className="input border rounded-md px-4 py-2"
        />

        <input
          type="datetime-local"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="input border rounded-md px-4 py-2"
        />

        <select
          name="clientId"
          value={formData.clientId}
          onChange={handleChange}
          className="input border rounded-md px-4 py-2"
        >
          <option value="">Müşteri Seçiniz</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.company}
            </option>
          ))}
        </select>

        <select
          name="resTakerId"
          value={formData.resTakerId}
          onChange={handleChange}
          className="input border rounded-md px-4 py-2"
        >
          <option value="">Rezervasyonu Alan</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.name} {emp.lastname}
            </option>
          ))}
        </select>

        <select
          name="fromWhoId"
          value={formData.fromWhoId}
          onChange={handleChange}
          className="input border rounded-md px-4 py-2"
        >
          <option value="">Yetkili</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.name} {emp.lastname}
            </option>
          ))}
        </select>

        <select
          name="arrivalTransferPointId"
          value={formData.arrivalTransferPointId}
          onChange={handleChange}
          className="input border rounded-md px-4 py-2"
        >
          <option value="">Geliş Transfer Noktası</option>
          {transferPoints.map((tp) => (
            <option key={tp.id} value={tp.id}>
              {tp.transferPointName}
            </option>
          ))}
        </select>

        <select
          name="returnTransferPointId"
          value={formData.returnTransferPointId}
          onChange={handleChange}
          className="input border rounded-md px-4 py-2"
        >
          <option value="">Dönüş Transfer Noktası</option>
          {transferPoints.map((tp) => (
            <option key={tp.id} value={tp.id}>
              {tp.transferPointName}
            </option>
          ))}
        </select>

        <select
          name="saloonId"
          value={formData.saloonId}
          onChange={handleChange}
          className="input border rounded-md px-4 py-2"
        >
          <option value="">Salon Seçiniz</option>
          {saloons.map((saloon) => (
            <option key={saloon.id} value={saloon.id}>
              {saloon.saloonName}
            </option>
          ))}
        </select>

        <select
          name="resTableId"
          value={formData.resTableId}
          onChange={handleChange}
          className="input border rounded-md px-4 py-2"
          disabled={!formData.saloonId}  // Salon seçilmeden masa seçilmesin
        >
          <option value="">Masa Seçiniz</option>
          {resTables.filter(t => t.saloon.id === formData.saloonId)
            .map((table) => (
              <option key={table.id} value={table.id}>
                {table.name} (Kapasite: {table.capacity})
              </option>
            ))}
        </select>

        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Notlar"
          className="input border rounded-md px-4 py-2 col-span-1 md:col-span-2"
          rows={3}
        />

        <button
          type="submit"
          className="col-span-1 md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl"
        >
          Kaydet
        </button>
      </form>
    </div>
  );
}
