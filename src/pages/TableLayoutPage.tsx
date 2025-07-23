import React from 'react'
import TableLayout from '../components/TableLayout'

const TableLayoutPage = () => {
  return (
    <div className="container mx-auto p-4 justify-center items-center flex flex-col overflow-hidden">
      <h1 className='font-bold text-3xl mb-4 text-[#555879]'>Masa Düzeni</h1>
      <TableLayout />
    </div>
  )
}

export default TableLayoutPage