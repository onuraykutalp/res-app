import React, { useState } from 'react'
import { useIncomeStore } from '../store/useIncomeStore'
import { AnimatePresence, motion } from 'motion/react';
import { GiCancel } from 'react-icons/gi';

const IncomeForm: React.FC = () => {

    const addOutcome = useIncomeStore((set) => set.addIncome);

    const [name, setName] = useState("");
    const [tax, setTax] = useState(0);
    const [ship, setShip] = useState<boolean>(false);
    const [accountant, setAccountant] = useState<boolean>(false);

    const [openForm, setOpenForm] = useState(false);

    const openFormHandle = () => {
        setOpenForm(true);
    }

    const closeFormHandle = () => {
        setOpenForm(false);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await addOutcome({
            name,
            tax,
            ship,
            accountant,
        });

        setName("");
        setTax(0);
        setShip(false);
        setAccountant(false);
        setOpenForm(false);
    }

    return (
        <div className='flex justify-end pr-4 relative'>
  <button onClick={openFormHandle} className="bg-[#555879] text-white p-3 rounded">
    Gelir Tipi Oluştur
  </button>

  <AnimatePresence>
    {openForm && (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed z-50 inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      >
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 relative">
          <h2 className="text-2xl font-bold text-center mb-6 text-[#555879]">Yeni Gelir Ekle</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <button
              type="reset"
              onClick={closeFormHandle}
              className="p-3 bg-red absolute right-2 top-2"
            >
              <GiCancel className="size-5 text-[#555879]" />
            </button>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gelir Tipi Adı</label>
              <input
                type="text"
                className="w-full rounded-lg p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder=""
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vergi Oranı</label>
              <input
                type="number"
                className="w-full rounded-lg p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                value={tax}
                onChange={(e) => setTax(Number(e.target.value))}
                placeholder=""
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="ship"
                  checked={ship}
                  onChange={(e) => setShip(e.target.checked)}
                  className="accent-blue-600 w-5 h-5"
                />
                <label htmlFor="ship" className="text-gray-700 text-sm">Gemide Göster</label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="accountant"
                  checked={accountant}
                  onChange={(e) => setAccountant(e.target.checked)}
                  className="accent-blue-600 w-5 h-5"
                />
                <label htmlFor="accountant" className="text-gray-700 text-sm">Muhasebede Göster</label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#555879] hover:bg-blue-400 transition text-white font-semibold py-3 rounded-lg shadow"
            >
              Kaydet
            </button>
          </form>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
</div>

    )
}

export default IncomeForm