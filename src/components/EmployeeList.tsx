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
    <div className="p-6 bg-white rounded-lg shadow-md mx-auto">
      <h2 className="text-2xl font-semibold text-[#555879] mb-4 text-center">
        Personel Listesi
      </h2>

      {employees.length === 0 ? (
        <p className="text-gray-500 text-center">Henüz personel eklenmemiş.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-gray-700 font-medium">Ad</th>
                <th className="px-4 py-3 text-gray-700 font-medium">Soyad</th>
                <th className="px-4 py-3 text-gray-700 font-medium">Telefon</th>
                <th className="px-4 py-3 text-gray-700 font-medium">Kullanıcı Adı</th>
                <th className="px-4 py-3 text-gray-700 font-medium">Grup</th>
                <th className="px-4 py-3 text-gray-700 font-medium text-center">İşlemler</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2">{emp.name}</td>
                  <td className="px-4 py-2">{emp.lastname}</td>
                  <td className="px-4 py-2">{emp.phone}</td>
                  <td className="px-4 py-2">{emp.username}</td>
                  <td className="px-4 py-2">{emp.group?.groupName}</td>
                  <td className="px-4 py-2 flex flex-wrap justify-center gap-2">
                    <button
                      onClick={() => onEdit(emp)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white text-xs px-3 py-1 rounded shadow"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleDelete(emp.id)}
                      className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded shadow"
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>

  );
};

export default EmployeeList;
