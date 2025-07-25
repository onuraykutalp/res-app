import React, { useState } from 'react'
import { useOutcomeGroupStore } from '../store/useOutcomeGroupStore';

const OutcomeGroupForm = () => {

const [name, setName] = useState("");

const addOutcomeGroup = useOutcomeGroupStore((s) => s.addOutcomeGroup);

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addOutcomeGroup({ name });
    setName("");
}

  return (
    <div className="container mx-auto p-4 items-center flex flex-col justify-center gap-4 mb-10">
      <h2 className="font-bold text-[#555879]">Gider Grubu Oluştur</h2>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <div className='flex flex-col items-center'>
          <input
            className="border px-3 py-2 rounded"
            onChange={(e) => setName(e.target.value)}
            type="text" id="name" name="name" required />
        </div>
        <button className='bg-[#555879] text-white px-4 py-2 rounded' type="submit">Kaydet</button>
      </form>
    </div>
  )
}

export default OutcomeGroupForm