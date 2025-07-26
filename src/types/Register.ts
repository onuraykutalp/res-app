import { Reservation } from "./Reservation";
import { CompanyRate } from "./CompanyRate";
import { Employee } from "./Employee";
import { Account } from "./Account";

export type SourceType = "COMPANY" | "EMPLOYEE";

export interface Register {
  id: string;
  ship: string;

  reservationId?: string | null;
  reservation?: Reservation | null;

  companyRateId?: string | null;
  companyRate?: CompanyRate | null;

  sourceType: SourceType;
  sourceId?: string | null;
  employeeSource?: Employee | null;
  companySource?: CompanyRate | null;

  registerGroup: string;

  accountId: string;
  account?: Account;

  entry?: number;
  exit?: number;

  currency: string;
  description?: string;

  invoiceDate: Date;
  createdAt: Date;

  createdByEmployeeId: string;
  createdBy?: Employee;
}
