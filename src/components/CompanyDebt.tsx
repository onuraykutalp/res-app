import React, { useEffect, useState } from 'react';
import { useCompanyRateStore } from '../store/useCompanyRateStore';
import { CompanyRate } from '../types/CompanyRate';

const CompanyDebt = () => {
  const { companyRates, fetchCompanyRates } = useCompanyRateStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRates = async () => {
      setLoading(true);
      setError(null);
      try {
        await fetchCompanyRates();
      } catch {
        setError("Şirket fiyatları yüklenirken hata oluştu.");
      } finally {
        setLoading(false);
      }
    };
    loadRates();
  }, [fetchCompanyRates]);

  if (loading) {
    return <div className="p-4 text-center text-gray-600">Şirket fiyatları yükleniyor...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-600">{error}</div>;
  }

  if (!Array.isArray(companyRates)) {
    return <div className="p-4 text-center text-red-600">Şirket fiyatları listesi geçersiz.</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-center text-[#555879]">Müşteriler Cari Listesi</h2>

      <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
        <table className="min-w-[1000px] w-full table-auto text-sm text-left divide-y divide-gray-200">
          <thead className="bg-gray-100 text-gray-700 text-xs uppercase">
            <tr>
              <th className="px-4 py-3 text-center">Şirket</th>
              <th className="px-4 py-3 text-center">Döviz</th>
              <th className="px-4 py-3 text-center">KDV</th>
              <th className="px-4 py-3 text-center">Son Rezervasyon</th>
              <th className="px-4 py-3 text-center">Borç</th>
              <th className="px-4 py-3 text-center">Alacak</th>
              <th className="px-4 py-3 text-center">Bakiye</th>
            </tr>
          </thead>
          <tbody>
            {companyRates.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  Kayıt bulunamadı.
                </td>
              </tr>
            ) : (
              companyRates.map((rate) => {
                const latestReservation = rate.reservations?.length
                  ? rate.reservations.reduce((latest, current) =>
                      new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest
                    )
                  : null;

                let currencySymbol = "";
                if (rate.currency === "EUR") currencySymbol = "€";
                else if (rate.currency === "USD") currencySymbol = "$";
                else if (rate.currency === "TRY") currencySymbol = "₺";
                else if (rate.currency === "GBP") currencySymbol = "£";

                return (
                  <tr key={rate.id} className="text-center hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-4 py-2">{rate.companyName}</td>
                    <td className="px-4 py-2">{rate.currency}</td>
                    <td className="px-4 py-2">{rate.tax}</td>
                    <td className="px-4 py-2">
                      {latestReservation
                        ? `#${latestReservation.reservationNo} (${new Date(
                            latestReservation.createdAt
                          ).toLocaleDateString()})`
                        : "-"}
                    </td>
                    <td className="px-4 py-2">
                      {rate.debt} {currencySymbol}
                    </td>
                    <td className="px-4 py-2">
                      {rate.credit} {currencySymbol}
                    </td>
                    <td className="px-4 py-2 max-w-xs truncate">
                      {rate.balance ?? "-"} {currencySymbol}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompanyDebt;
