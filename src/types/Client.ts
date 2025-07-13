import { Employee } from "./Employee";

export interface Client{
 id: string,
 company: string,
 clientType: string,
 currency: string,
 tax?: string,
 limit: number,
 createdAt: string,
 whoCreated: Employee,
 lastUpdate?: string,
 whoUpdated?: Employee,
}