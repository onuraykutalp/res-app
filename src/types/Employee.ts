import { EmployeeGroup } from "./EmployeeGroup";

export interface Employee {
  id: string;
  group: EmployeeGroup;
  name: string;
  lastname: string;
  phone: number;
  username: string;
  password?: string; // sadece create ve login sırasında kullanılır
}