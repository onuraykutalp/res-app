import React, { useState, useEffect } from 'react';
import { useReservationStore } from '../store/useReservationStore';
import { Reservation, ReservationInput } from '../types/Reservation';
import { Client } from '../types/Client';
import { Employee } from '../types/Employee';
import { motion } from 'motion/react';
import { Switch } from '@mui/material';

export const ReservationForm: React.FC = () => {
  const addReservation = useReservationStore(state => state.addReservation);

  // Client ve Employee listeleri için state
  const [clients, setClients] = useState<Client[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  // Form state
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [fromWho, setFromWho] = useState('');       // client id
  const [resTable, setResTable] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [companyPrice, setCompanyPrice] = useState<number>(0);
  const [agency, setAgency] = useState<string>('');
  const [m1, setM1] = useState<number>(0);
  const [m2, setM2] = useState<number>(0);
  const [m3, setM3] = useState<number>(0);
  const [v1, setV1] = useState<number>(0);
  const [v2, setV2] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [room, setRoom] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [payment, setPayment] = useState('');
  const [resTaker, setResTaker] = useState('');     // employee id

  const [reservationForm, setReservationForm] = useState(false);

  // Sayfa açılırken client ve employee verilerini çek
  useEffect(() => {
    async function fetchClients() {
      const res = await fetch('http://localhost:3001/api/clients');
      const data = await res.json();
      setClients(data);
    }
    async function fetchEmployees() {
      const res = await fetch('http://localhost:3001/api/employees');
      const data = await res.json();
      setEmployees(data);
    }
    fetchClients();
    fetchEmployees();
  }, []);

  const openReservationForm = () => setReservationForm(true);
  const closeReservationForm = () => setReservationForm(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !date || !fromWho || !resTable || !price || !payment || !resTaker) {
      alert('Lütfen zorunlu alanları doldurun!');
      return;
    }

    const reservationInput: ReservationInput = {
      name,
      date,
      fromWho,   // sadece id gönderiyoruz
      resTable,
      price,
      companyPrice,
      agency: agency || undefined,
      m1,
      m2,
      m3,
      v1,
      v2,
      total,
      room: room || undefined,
      description: description || undefined,
      payment,
      resTaker,  // sadece id gönderiyoruz
    };

    try {
      const response = await fetch('http://localhost:3001/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservationInput),
      });

      const savedReservation: Reservation = await response.json();

      if (response.ok) {
        addReservation(savedReservation);
        // formu temizle
        setName('');
        setDate('');
        setFromWho('');
        setResTable('');
        setPrice(0);
        setCompanyPrice(0);
        setAgency('');
        setM1(0);
        setM2(0);
        setM3(0);
        setV1(0);
        setV2(0);
        setTotal(0);
        setRoom('');
        setDescription('');
        setPayment('');
        setResTaker('');
        closeReservationForm();
      } else {
        alert('Rezervasyon kaydedilemedi');
      }
    } catch (error) {
      console.error(error);
      alert('Sunucuya bağlanılamıyor');
    }
  };

  return (
    <div className="container mx-auto w-full max-w-xl p-4">
      <button
        onClick={openReservationForm}
        className="bg-[#4682A9] text-white px-4 py-2 rounded right-5 fixed"
      >
        Yeni Kayıt
      </button>

      {reservationForm && (
        <motion.div
          animate={{ opacity: [0, 100], transition: { ease: ['easeIn', 'easeOut'] } }}
          className="absolute inset-0 flex items-center top-96 justify-center z-20"
        >
          <div className="gap-3 p-10 mx-auto bg-gray-100 shadow-xl w-3/4 relative">
            <button
              onClick={closeReservationForm}
              className="bg-red-600 text-white px-3 py-1 right-0 -top-10 absolute"
            >
              X
            </button>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col w-full justify-center items-center gap-1">
                  <div className="bg-gray-400 w-full p-3 items-center justify-center flex mb-2">
                    <h1 className="text-gray-800 font-semibold">Rezervasyon Bilgileri</h1>
                  </div>

                  <div className="flex w-full gap-2">
                    <label className="mb-1 text-sm font-medium w-1/4 py-4">
                      Rez. Tarih <span className="text-red-600">*</span>
                    </label>
                    <input
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      type="date"
                      className="px-3 py-0 border rounded w-full h-12"
                      required
                    />
                  </div>

                  {/* fromWho select */}
                  <div className="flex w-full gap-2">
                    <label className="mb-1 text-sm font-medium w-1/4 py-4">
                      Rez. Veren <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={fromWho}
                      onChange={(e) => setFromWho(e.target.value)}
                      required
                      className="px-3 py-0 h-12 border rounded w-full"
                    >
                      <option value="">Seçiniz</option>
                      {clients.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.company}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex w-full gap-2">
                    <label className="mb-1 text-sm font-medium w-1/4 py-4">Rez. Alan <span className="text-red-600">*</span></label>
                    {/* resTaker select */}
                    <select
                      value={resTaker}
                      onChange={(e) => setResTaker(e.target.value)}
                      required
                      className="px-3 py-0 h-12 border rounded w-full"
                    >
                      <option value="">Seçiniz</option>
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.name} {emp.lastname}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Diğer inputlar aynı */}
                  <div className="flex w-full gap-2">
                    <label className="mb-1 text-sm font-medium w-1/4 py-4">Ödeme <span className="text-red-600">*</span></label>
                    <input
                      value={payment}
                      onChange={(e) => setPayment(e.target.value)}
                      type="text"
                      className="px-3 py-0 h-12 border rounded w-full"
                      required
                    />
                  </div>

                  <div className="flex w-full gap-2">
                    <label className="mb-1 text-sm font-medium w-1/4 py-4">Oda</label>
                    <input
                      value={room}
                      onChange={(e) => setRoom(e.target.value)}
                      type="text"
                      className="px-3 py-0 h-12 border rounded w-full"
                    />
                  </div>

                  <div className="flex w-full gap-2">
                    <label className="mb-1 text-sm font-medium w-1/4 py-4">Rez. Açıklama</label>
                    <input
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      type="text"
                      className="px-3 py-0 h-12 border rounded w-full"
                    />
                  </div>
                </div>

                <div className="flex flex-col w-full justify-center items-center gap-1">
                  <div className="bg-gray-400 w-full p-3 items-center justify-center flex mb-2">
                    <h1 className="text-gray-800 font-semibold">Transfer Bilgileri</h1>
                  </div>
                  <div className="flex w-full gap-2">
                    <label className="mb-1 text-sm font-medium w-1/4 py-4">G/D</label>
                    <div className="w-1/4">
                      <Switch value="checkedA" inputProps={{ 'aria-label': 'Switch A' }} />
                    </div>
                    <div className="w-1/4">
                      <Switch value="checkedB" inputProps={{ 'aria-label': 'Switch B' }} />
                    </div>
                  </div>
                  
                </div>
              </div>

              <button type="submit" className="p-3 bg-blue-600 text-white rounded hover:bg-blue-700">
                Kaydet
              </button>
            </form>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ReservationForm;
