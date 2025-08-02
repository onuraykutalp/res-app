import { useEffect, useState } from "react";
import { useRegisterStore } from "../store/useRegisterStore";
import { AccountType } from "../types/Enums";

const currencies: string[] = ["USD", "EUR", "TRY", "GBP"];
const accountTypeLabels: Record<AccountType, string> = {
    GEMI_KASA_TRY: "Gemi Kasa (TRY)",
    GEMI_KASA_EUR: "Gemi Kasa (EUR)",
    GEMI_KASA_USD: "Gemi Kasa (USD)",
    GEMI_KASA_GBP: "Gemi Kasa (GBP)",
    ISBANK_POS_TRY: "İş Bankası (TRY)",
    ISBANK_POS_EUR: "İş Bankası (EUR)",
    ISBANK_POS_USD: "İş Bankası (USD)",
};

const RegisterDaily = () => {
    const [selectedDate, setSelectedDate] = useState<string>(() => {
        const today = new Date().toISOString().slice(0, 10);
        return today;
    });
    const { registers, fetchRegisters } = useRegisterStore();

    useEffect(() => {
        fetchRegisters(); // Fetch registers without arguments
    }, [fetchRegisters, selectedDate]);

    const accountTypeSums: Partial<Record<AccountType, Record<string, number>>> = {};

    registers.forEach(register => {
        if (selectedDate && register.createdAt.slice(0, 10) !== selectedDate) return; // Filter by selected date
        const { accountType, currency, entry } = register;
        if (!accountTypeSums[accountType]) {
            accountTypeSums[accountType] = {};
            currencies.forEach(cur => {
                accountTypeSums[accountType]![cur] = 0;
            });
        }
        if (typeof entry === "number") {
            accountTypeSums[accountType]![currency] += entry;
        }
    });

    const totalSums: Record<string, number> = {};
    currencies.forEach(cur => {
        totalSums[cur] = 0;
    });
    Object.values(accountTypeSums).forEach(sums => {
        currencies.forEach(cur => {
            if (sums && sums[cur]) {
                totalSums[cur] += sums[cur];
            }
        });
    });

    return (
        <div className="w-1/2 justfiy-end items-center mx-auto p-4 bg-gray-100 rounded-lg shadow">
            <h1>Kasa Durum Günlük</h1>
            <div className="mb-4">
                <label className="mr-2 font-semibold">Tarih:</label>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={e => setSelectedDate(e.target.value)}
                    className="border px-2 py-1 rounded"
                />
            </div>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Hesap Tipi</th>
                            {currencies.map(cur => (
                                <th key={cur} className="px-4 py-2 text-left text-xs font-semibold text-gray-700">{cur}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(accountTypeSums).map(([accountType, sums]) => (
                            <tr key={accountType} className="hover:bg-gray-50">
                                <td className="px-4 py-2 whitespace-nowrap">{accountTypeLabels[accountType as AccountType]}</td>
                                {currencies.map(cur => (
                                    <td key={cur} className="px-4 py-2 whitespace-nowrap">
                                        {sums && sums[cur] ? sums[cur].toFixed(2) : ''}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        <tr className="font-bold bg-gray-100">
                            <td className="px-4 py-2 whitespace-nowrap">Toplam</td>
                            {currencies.map(cur => (
                                <td key={cur} className="px-4 py-2 whitespace-nowrap">
                                    {totalSums[cur] ? totalSums[cur].toFixed(2) : ''}
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RegisterDaily;
