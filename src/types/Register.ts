import { Employee } from "./Employee";
import { AccountType, Currency } from "./Enums";


// Tüm alanları olan veri tipi (veritabanından dönenler için)
export interface Register {
  id: string;
  ship?: string;
  reservationId?: string | null;
  clientId?: string | null;
  companyDebtId?: string | null;
  groupName?: string;
  accountType: AccountType;
  entry?: number;
  out?: number;
  currency: Currency;
  description?: string;
  receiptDate: string; // ISO format (DateTime)
  createdAt: string;   // ISO format
  createdById: string;
  createdBy?: Employee;
}

// ✅ Yeni kayıt oluşturmak için kullanılacak tip (id, createdAt hariç)
export type RegisterInput = Omit<Register, "id" | "createdAt">;
