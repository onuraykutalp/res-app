import { Reservation } from "./Reservation";

export interface CompanyDebt {
    id: string,
    name: string,
    companyType: string,
    currency: string,
    tax?: number,
    debt: number,
    credit: number,
    balance: number,
    createdAt: string,
    reservations?: Reservation[],
}