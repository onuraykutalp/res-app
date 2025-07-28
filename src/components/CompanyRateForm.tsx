import { useState } from "react";
import { useCompanyRateStore } from "../store/useCompanyRateStore";
import { AnimatePresence, motion } from "motion/react";
import { GiCancel } from "react-icons/gi";

export default function CompanyRateForm() {
  const addCompanyRate = useCompanyRateStore((s) => s.addCompanyRate);

  const [companyName, setCompanyName] = useState("");
  const [m1, setM1] = useState(0);
  const [m2, setM2] = useState(0);
  const [m3, setM3] = useState(0);
  const [v1, setV1] = useState(0);
  const [v2, setV2] = useState(0);
  const [currency, setCurrency] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");

  const [openForm, setOpenForm] = useState(false);

  const openFormHandler = () => {
    setOpenForm(true);
  };

  const closeFormHandler = () => {
    setOpenForm(false);
  };

  const handleSubmit = async () => {
    if (!companyName.trim()) {
      alert("Lütfen şirket adı giriniz.");
      return;
    }
    if (!currency.trim()) {
      alert("Lütfen para birimini giriniz.");
      return;
    }

    try {
      await addCompanyRate({
        companyName: companyName.trim(),
        m1,
        m2,
        m3,
        v1,
        v2,
        currency: currency.trim().toUpperCase(),
        startDate,
        endDate,
        description,
      });

      // Form sıfırlama
      setCompanyName("");
      setM1(0);
      setM2(0);
      setM3(0);
      setV1(0);
      setV2(0);
      setCurrency("");
      setStartDate("");
      setEndDate("");
      setDescription("");

      closeFormHandler();
    } catch (error) {
      console.error("CompanyRate eklenirken hata oluştu:", error);
      alert("Şirket fiyatı eklenirken hata oluştu.");
    }
  };

  return (
    <div className="p-6 mx-auto max-w-4xl">
      <div className="p-6 mx-auto max-w-4xl flex justify-center">
        <button
          onClick={openFormHandler}
          className="bg-[#555879] p-3 rounded text-white hover:bg-[#44466a] transition-colors"
        >
          Şirket Fiyat Tanımı Ekle
        </button>
      </div>

      <AnimatePresence>
        {openForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            key="modal-backdrop"
          >
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-xl shadow-xl max-w-3xl w-full mx-4 p-6 overflow-auto max-h-[90vh] relative"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
              key="modal-content"
            >
              <button
                onClick={closeFormHandler}
                className="absolute top-5 right-5"
                aria-label="Kapat"
              >
                <GiCancel className="size-5 text-red-400" />
              </button>
              <h2
                id="modal-title"
                className="text-2xl font-semibold mb-6 text-center text-[#555879]"
              >
                Şirket Fiyat Ekle
              </h2>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
                className="grid grid-cols-1 md:grid-cols-2 gap-5"
              >
                {/* Şirket */}
                <div>
                  <label
                    htmlFor="company"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Şirket
                  </label>
                  <input
                    id="company"
                    type="text"
                    placeholder="Şirket adı"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* M1 */}
                <div>
                  <label
                    htmlFor="m1"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    M1
                  </label>
                  <input
                    id="m1"
                    type="number"
                    placeholder="M1"
                    value={m1}
                    onChange={(e) => setM1(parseFloat(e.target.value) || 0)}
                    className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min={0}
                    step={0.01}
                  />
                </div>

                {/* M2 */}
                <div>
                  <label
                    htmlFor="m2"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    M2
                  </label>
                  <input
                    id="m2"
                    type="number"
                    placeholder="M2"
                    value={m2}
                    onChange={(e) => setM2(parseFloat(e.target.value) || 0)}
                    className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min={0}
                    step={0.01}
                  />
                </div>

                {/* M3 */}
                <div>
                  <label
                    htmlFor="m3"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    M3
                  </label>
                  <input
                    id="m3"
                    type="number"
                    placeholder="M3"
                    value={m3}
                    onChange={(e) => setM3(parseFloat(e.target.value) || 0)}
                    className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min={0}
                    step={0.01}
                  />
                </div>

                {/* V1 */}
                <div>
                  <label
                    htmlFor="v1"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    V1
                  </label>
                  <input
                    id="v1"
                    type="number"
                    placeholder="V1"
                    value={v1}
                    onChange={(e) => setV1(parseFloat(e.target.value) || 0)}
                    className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min={0}
                    step={0.01}
                  />
                </div>

                {/* V2 */}
                <div>
                  <label
                    htmlFor="v2"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    V2
                  </label>
                  <input
                    id="v2"
                    type="number"
                    placeholder="V2"
                    value={v2}
                    onChange={(e) => setV2(parseFloat(e.target.value) || 0)}
                    className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min={0}
                    step={0.01}
                  />
                </div>

                {/* Para Birimi */}
                <div>
                  <label
                    htmlFor="currency"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Para Birimi
                  </label>
                  <input
                    id="currency"
                    type="text"
                    placeholder="Örn: EUR, USD"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    maxLength={3}
                    required
                  />
                </div>

                {/* Başlangıç Tarihi */}
                <div>
                  <label
                    htmlFor="startDate"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Başlangıç Tarihi
                  </label>
                  <input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Bitiş Tarihi */}
                <div>
                  <label
                    htmlFor="endDate"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Bitiş Tarihi
                  </label>
                  <input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Açıklama */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Açıklama
                  </label>
                  <input
                    id="description"
                    type="text"
                    placeholder="İsteğe bağlı açıklama"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Buton */}
                <div className="md:col-span-2 flex justify-center mt-4">
                  <button
                    type="submit"
                    className="bg-[#555879] hover:bg-[#8185af] text-white px-6 py-2 rounded shadow transition-colors"
                  >
                    Kaydet
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
