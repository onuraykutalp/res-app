
import { Employee } from "./Employee";
import { Saloon } from "./Saloon";
import { ResTable } from "./ResTable";
import { CompanyRate } from "@prisma/client";

export interface Reservation {
  id: string; // Reservation No
  reservationNo: number; // Reservation No (for display)
  date: string; // Reservation Date
  room?: string; // Room (optional)
  voucherNo?: string;
  nationality?: string;
  description?: string; // Res Description (optional)
  transferNote?: string; // Transfer Description (optional)
  ship: string;

  // Müşteri (Client) veya boş olabilir (Who Gives Reservation)
  companyRateId?: string;
  companyRate?: CompanyRate;

  // Rezervasyonu alan personel (Employee)
  resTakerId: string;
  resTaker?: Employee;

  // Yetkili (Employee)
  authorizedId: string;
  authorized?: Employee;

 

  arrivalTransfer?: string,
  returnTransfer?: string;

  arrivalLocation?: string; // Transfer Arrival Location (optional)
  returnLocation?: string; // Transfer Return Location (optional)

  // Salon ve masa bilgileri
  saloonId: string;
  saloon?: Saloon;

  resTableId: string;
  resTable?: ResTable;

  // Menü adetleri
  m1: number;
  m2: number;
  m3: number;
  v1: number;
  v2: number;

  // Kişi sayısı detayları
  full: number;
  half: number;
  infant: number;
  guide: number;

  // Hesaplanan toplam kişi sayısı
  totalPerson: number;

  // Satılan menü tipleri listesi (örneğin: ["M1", "V2"])
  tour: string[];

  // Ödeme tipi (Enum olarak tanımlanacak: 'Gemide' | 'Cari' | 'Comp' | 'Komisyonsuz')
  paymentType: "Gemide" | "Cari" | "Comp" | "Komisyonsuz";

  // Alınan para ve şirkete ödenecek para
  moneyReceived: number;
  moneyToPayCompany: number;

  // Hesaplanan toplam ücret (CompanyRate'lere göre hesaplanıp burada tutulacak)
  fullPrice: number;

  createdAt: string;
}

export type MenuPersonCount = {
  full: number;
  half: number;
  infant: number;
  guide: number;
};

export interface ReservationInput {
  date: string;
  room?: string;
  voucherNo?: string;
  nationality?: string;
  description?: string;
  transferNote?: string;
  ship: string;

  companyRateId?: string;

  resTakerId: string;
  authorizedId: string;

  arrivalTransfer?: string;
  returnTransfer?: string;

  arrivalLocation?: string;
  returnLocation?: string;

  saloonId: string;
  resTableId: string;

  // Menü adetleri artık her menü için kişi sayıları ayrı
  m1: MenuPersonCount;
  m2: MenuPersonCount;
  m3: MenuPersonCount;
  v1: MenuPersonCount;
  v2: MenuPersonCount;

  tour: string[];

  paymentType: "Gemide" | "Cari" | "Comp" | "Komisyonsuz";

  moneyReceived: number;
  moneyToPayCompany: number;

  fullPrice: number;
}
