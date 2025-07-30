import { AccountType, Currency } from "./Enums";


export interface Register {
  id: string;
  ship: string;
  reservationId?: string | null;
  clientId?: string | null;
  companyDebtId?: string | null;
  groupName: string;
  accountType: AccountType;
  entry: number;
  out: number;
  currency: Currency;
  description?: string;
  receiptDate: string; // ISO format
  createdAt: string;
  createdById: string;
}
