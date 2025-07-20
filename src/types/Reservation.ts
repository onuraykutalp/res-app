import { Client } from "./Client";
import { Employee } from "./Employee";
import { TransferPoint } from "./TransferPoint";
import { Saloon } from "./Saloon";
import { ResTable } from "./ResTable";

export interface Reservation {
  id: string; // Reservation No
  date: string; // Reservation Date
  room?: string; // Room (optional)
  voucherNo?: string;
  nationality?: string;
  description?: string; // Res Description (optional)
  transferNote?: string; // Transfer Description (optional)
  ship: string;

  // Müşteri (Client) veya boş olabilir (Who Gives Reservation)
  fromWhoId?: string;
  fromWho?: Client;

  // Rezervasyonu alan personel (Employee)
  resTakerId: string;
  resTaker?: Employee;

  // Yetkili (Employee)
  authorizedId: string;
  authorized?: Employee;

  // Transferler (boş bırakılabilir)
  arrivalTransferId?: string;
  arrivalTransfer?: TransferPoint;

  returnTransferId?: string;
  returnTransfer?: TransferPoint;

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


export interface ReservationInput {
  date: string;
  room?: string;
  voucherNo?: string;
  nationality?: string;  // artık boş bırakılabilir
  description?: string;
  transferNote?: string;
  ship: string;

  fromWhoId?: string;

  resTakerId: string;
  authorizedId: string;

  arrivalTransferId?: string;
  returnTransferId?: string;

  saloonId: string;
  resTableId: string;

  m1: number;
  m2: number;
  m3: number;
  v1: number;
  v2: number;

  full: number;
  half: number;
  infant: number;
  guide: number;

  tour: string[];

  paymentType: "Gemide" | "Cari" | "Comp" | "Komisyonsuz";

  moneyReceived: number;
  moneyToPayCompany: number;

  fullPrice: number;
}
