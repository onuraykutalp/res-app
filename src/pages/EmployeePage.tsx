import React, { useEffect, useState } from 'react'
import { useEmployeeStore } from '../store/useEmployeeStore'
import { Employee } from '../types/Employee';
import EmployeeForm from '../components/EmployeeForm';
import EmployeeList from '../components/EmployeeList';

const EmployeePage: React.FC = () => {
    
const fetchEmployees = useEmployeeStore(state => state.fetchEmployees);
const employees = useEmployeeStore(state => state.employees);

const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

useEffect(() => {
    fetchEmployees();
},[fetchEmployees]);

const handleEdit = (employee : Employee) => {
    setEditingEmployee(employee);
}




  return (
    <div>
        <EmployeeForm />
        <EmployeeList employees={employees} onEdit={handleEdit} />
    </div>
  )
}

export default EmployeePage