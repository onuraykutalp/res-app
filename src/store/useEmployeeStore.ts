import { Employee } from '../types/Employee'
import { create } from 'zustand';

interface EmployeeInput {
  name: string;
  lastname: string;
  phone: number;
  username: string;
  groupId: string;
  password: null // ekleyebilirsin
}

interface EmployeeStore {
  employees: Employee[];
  fetchEmployees: () => Promise<void>;
  addEmployee: (emp: EmployeeInput) => Promise<void>;
  updateEmployee: (id: string, emp: EmployeeInput) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
}

export const useEmployeeStore = create<EmployeeStore>((set, get) => ({
  employees: [],
  fetchEmployees: async () => {
    const res = await fetch('http://localhost:3001/api/employees');
    if (!res.ok) throw new Error('Failed to fetch employees');
    const data = await res.json();
    set({ employees: data });
  },
  addEmployee: async (emp) => {
  await fetch('http://localhost:3001/api/employees', {
    method: 'POST',
    headers:  { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...emp,
      phone: Number(emp.phone), // güvenli dönüşüm
    }),
  });
  await get().fetchEmployees();
},
  updateEmployee: async (id, emp) => {
    await fetch(`http://localhost:3001/api/employees/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emp),
    });
    await get().fetchEmployees();
  },
  deleteEmployee: async (id) => {
    await fetch(`http://localhost:3001/api/employees/${id}`, {
      method: 'DELETE',
    });
    await get().fetchEmployees();
  },
}));
