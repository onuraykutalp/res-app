import { useState } from "react";
import { useRegisterStore } from "../store/useRegisterStore";
import { Reservation } from "../types/Reservation";
import { AccountType, Currency } from "../types/Enums";

interface Props {
    mode: "reservation" | "income";
    reservation?: Reservation;
    onClose: () => void;
}

export default function RegisterForm({ mode, reservation, onClose }: Props) {
    const { createRegister } = useRegisterStore();

    const [amount, setAmount] = useState<number>(reservation.fullPrice || 0);
    const [accountType, setAccountType] = useState<AccountType>(AccountType.GEMI_KASA_TRY);
    const [currency, setCurrency] = useState<Currency>(Currency.TRY);
    const [description, setDescription] = useState("");
    const [receiptDate, setReceiptDate] = useState(new Date().toISOString().slice(0, 10));
    const createdById = "EMPLOYEE_ID"; // buraya oturumdaki kullanıcı id'si yazılır

    const [incomeList, setIncomeList] = useState<Income[]>([]);
    const [selectedIncomeId, setSelectedIncomeId] = useState<string>("");
    const [amount, setAmount] = useState<number>(0);

    const handleSubmit = async () => {
        await createRegister({
            ship: reservation.ship || "Gemi-1",
            reservationId: reservation.id,
            clientId: null,
            companyDebtId: null,
            groupName: "Rezervasyon Tahsilat",
            accountType,
            entry: amount,
            out: 0,
            currency,
            description,
            receiptDate,
            createdById,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow p-6 w-[400px]">
                <h2 className="text-lg font-semibold mb-4">Rezervasyon Tahsilat</h2>

                <p className="text-sm mb-2">
                    <strong>Rezervasyon No:</strong> {reservation.reservationNo}
                </p>
                <p className="text-sm mb-2">
                    <strong>Toplam Fiyat:</strong> {reservation.fullPrice} {reservation.companyRate?.currency}
                </p>

                <div className="space-y-2">
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(parseFloat(e.target.value))}
                        className="w-full border p-2 rounded"
                        placeholder="Tahsil edilen tutar"
                    />

                    <select
                        className="w-full border p-2 rounded"
                        value={accountType}
                        onChange={(e) => setAccountType(e.target.value as AccountType)}
                    >
                        {Object.values(AccountType).map((val) => (
                            <option key={val} value={val}>{val}</option>
                        ))}
                    </select>

                    <select
                        className="w-full border p-2 rounded"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value as Currency)}
                    >
                        {Object.values(Currency).map((val) => (
                            <option key={val} value={val}>{val}</option>
                        ))}
                    </select>

                    <input
                        type="date"
                        className="w-full border p-2 rounded"
                        value={receiptDate}
                        onChange={(e) => setReceiptDate(e.target.value)}
                    />

                    <textarea
                        className="w-full border p-2 rounded"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Açıklama"
                    />
                </div>

                <div className="mt-4 flex justify-end gap-2">
                    <button className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>
                        İptal
                    </button>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleSubmit}>
                        Kaydet
                    </button>
                </div>
            </div>
        </div>
    );
}
