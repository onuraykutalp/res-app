import React from 'react';
import { Employee } from '../types/Employee';
import { useEmployeeStore } from '../store/useEmployeeStore';

interface EmployeeListProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
}

const EmployeeList: React.FC<EmployeeListProps> = ({ employees, onEdit }) => {
  const deleteEmployee = useEmployeeStore(state => state.deleteEmployee);

  const handleDelete = async (id: string) => {
    if (window.confirm('Personeli silmek istediğinize emin misiniz?')) {
      await deleteEmployee(id);
    }
  };

  return (
    <div>
      <h2>Personel Listesi</h2>
      {employees.length === 0 ? (
        <p>Henüz personel eklenmemiş.</p>
      ) : (
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Ad</th>
              <th className="border border-gray-300 p-2">Soyad</th>
              <th className="border border-gray-300 p-2">Telefon</th>
              <th className="border border-gray-300 p-2">Kullanıcı Adı</th>
              <th className="border border-gray-300 p-2">Grup</th>
              <th className="border border-gray-300 p-2">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp.id}>
                <td className="border border-gray-300 p-2">{emp.name}</td>
                <td className="border border-gray-300 p-2">{emp.lastname}</td>
                <td className="border border-gray-300 p-2">{emp.phone}</td>
                <td className="border border-gray-300 p-2">{emp.username}</td>
                <td className="border border-gray-300 p-2">{emp.group.groupName}</td>
                <td className="border border-gray-300 p-2 space-x-2">
                  <button
                    className="bg-yellow-400 px-2 py-1 rounded"
                    onClick={() => onEdit(emp)}
                  >
                    Düzenle
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleDelete(emp.id)}
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EmployeeList;
