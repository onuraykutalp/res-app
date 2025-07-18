import React, { useState, useEffect } from 'react';
import SaloonForm from '../components/SaloonForm';
import SaloonList from '../components/SaloonList';
import useSaloonStore from '../store/useSaloonStore';

const SaloonPage: React.FC = () => {
  const { fetchSaloons } = useSaloonStore();
  const [refreshFlag, setRefreshFlag] = useState(false);

  useEffect(() => {
    fetchSaloons();
  }, [refreshFlag, fetchSaloons]);

  // Form gönderiminden sonra listeyi yenilemek için çağrılır
  const handleSuccess = () => {
    setRefreshFlag(!refreshFlag);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Salon Yönetimi</h1>
      <div className="mb-6">
        <SaloonForm onSuccess={handleSuccess} />
      </div>
      <SaloonList refreshFlag={refreshFlag} />
    </div>
  );
};

export default SaloonPage;
