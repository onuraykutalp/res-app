import { Employee } from "./Employee";

export interface Supplier {
    id: string,
    name: string,
    supplierType: string,
    currency: string,
    tax?: string,
    limit?: number,
    createdAt: string,
    createdBy: Employee;
    createdById: string,
    lastUpdate: string,
    updatedBy: Employee;
    updatedById: string,
}