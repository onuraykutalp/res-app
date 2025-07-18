import { Client } from "./Client";
import { Employee } from "./Employee";
import { TransferPoint } from "./TransferPoint";
import { Saloon } from "./Saloon";
import { ResTable } from "./ResTable";
import { CompanyRate } from "./CompanyRate";
import { Transfer } from "./Transfer";
import { GeneralIncome } from "./GeneralIncome";

export interface Reservation {
  id: string;
  date: string;
  paymentType: string;
  room?: string;
  voucherNo: string;
  nationality: string;
  description?: string;
  transferNote?: string;
  ship: string;

  fromWhoId?: string; // Müşteri seçilmeyebilir, opsiyonel yaptım
  fromWho?: Client;

  resTakerId: string;
  resTaker?: Employee;

  authorizedId: string;
  authorized?: Employee;

  arrivalTransferId?: string;
  arrivalTransfer?: TransferPoint;

  returnTransferId?: string;
  returnTransfer?: TransferPoint;

  saloonId: string;
  saloon?: Saloon;

  m1: number;
  m1Price: number;
  m2: number;
  m2Price: number;
  m3: number;
  m3Price: number;
  v1: number;
  v1Price: number;
  v2: number;
  v2Price: number;

  resTableId: string;
  resTable?: ResTable;

  menuId: string;
  menu?: CompanyRate;

  transfers?: Transfer[];

  generalIncomeId?: string; // Eğer müşteri yoksa bu üzerinden fiyat alınabilir
  generalIncome?: GeneralIncome;

  price: number; // Rezervasyonun fiyatı

  createdAt: string;
}

export interface TransferInput {
  personQuantity: number;
  time: string;
  transferDesc?: string;
  transferLocationId: string;
  transferPointId: string;
  driverId?: string;
}

export interface ReservationInput {
  date: string;
  paymentType: string;
  room?: string;
  voucherNo?: string;
  nationality: string;
  description?: string;
  transferNote?: string;
  ship: string;

  fromWhoId?: string; // opsiyonel oldu müşteri
  resTakerId: string;
  authorizedId: string;

  m1: number;
  m1Price: number;
  m2: number;
  m2Price: number;
  m3: number;
  m3Price: number;
  v1: number;
  v1Price: number;
  v2: number;
  v2Price: number;

  arrivalTransferId?: string;
  returnTransferId?: string;

  saloonId: string;
  resTableId: string;
  menuId: string;
  price: number; // ← EKLİYORSUN!

  transfers?: TransferInput[]; // opsiyonel transfer dizisi
}
