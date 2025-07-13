import { Client } from "./Client";
import { Employee } from "./Employee";

export interface Reservation {
  id: string;
  name: string;
  date: string;
  fromWho: Client;
  resTable: string;
  price: number;
  companyPrice: number;
  agency?: string;
  m1: number;
  m2: number;
  m3: number;
  v1: number;
  v2: number;
  total: number;
  room?: string;
  description?: string;
  payment: string;
  resTaker: Employee;
}

export interface ReservationInput {
  name: string;
  date: string;
  fromWho: string;
  resTable: string;
  price: number;
  companyPrice: number;
  agency?: string;
  m1: number;
  m2: number;
  m3: number;
  v1: number;
  v2: number;
  total: number;
  room?: string;
  description?: string;
  payment: string;
  resTaker: string;
}