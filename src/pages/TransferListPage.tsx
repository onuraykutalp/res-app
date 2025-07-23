import React from 'react'
import TransferList from '../components/TransferList'

const TransferListPage = () => {
  return (
    <div className="p-4 justify-center items-center flex flex-col">
      <h1 className='font-bold text-3xl mb-4 text-[#555879]'>Transfer Listesi</h1>
      <div className="w-full overflow-x-auto md:overflow-x-visible">
        <TransferList />
      </div>
    </div>
  )
}

export default TransferListPage