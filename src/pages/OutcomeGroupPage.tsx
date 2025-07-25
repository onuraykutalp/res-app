import React from 'react'
import OutcomeGroupList from '../components/OutcomeGroupList'
import OutcomeGroupForm from '../components/OutcomeGroupForm'

const OutcomeGroupPage = () => {
  return (
    <div className="p-4">
      <h1 className='font-bold text-[#555879] text-xl'>Gider Grupları Yönetimi</h1>
      <OutcomeGroupForm />
      <OutcomeGroupList />
    </div>
  )
}

export default OutcomeGroupPage