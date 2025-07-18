export interface CompanyRate {
    id: string,
    company: string,
    m1: number,
    m2: number,
    m3: number,
    v1: number,
    v2: number,
    currency: string,
    startDate: string,
    endDate: string,
    description?: string,
    createdAt: string,
}

export type CreateCompanyRate = Omit<CompanyRate, "id" | "createdAt">;