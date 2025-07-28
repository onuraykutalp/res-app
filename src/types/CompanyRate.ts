import { Reservation } from "./Reservation";

export interface CompanyRate {
  id: string;
  companyName: string;
  m1: number;
  m2: number;
  m3: number;
  v1: number;
  v2: number;
  currency: string;
  startDate: string;
  endDate: string;
  description?: string;
  tax?: number | null;
  companyType?: string | null;
  credit?: number | null;
  debt?: number | null;
  balance?: number | null;
  createdAt: string;
  reservations?: Reservation[];
}
