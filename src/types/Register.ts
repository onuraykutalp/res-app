import { BillingGroup } from "./BillingGroup"
import { Employee } from "./Employee"
import { Income } from "./Income"

export interface Register {
    id: string,
    ship: string,
    resNo?: number,
    otel?: string,
    agencyOrOtel?: string,
    registerGroup: Income,
    calculationType: BillingGroup,
    billingGroupId: string,
    income: number, // buraya girilen değeri Income.ts içerisnden gelen tax oranını hesaplayıp Billing Group tablosuna göndericek
    outcome: number,
    currency: "TL" | "USD" | "EUR" | "GBP",
    description?: string,
    billDate: string,
    registerDate: string,
    whoRegistered: Employee,
}