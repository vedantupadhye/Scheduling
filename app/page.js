import React from 'react'
import FirTable from './components/FirTable' 
import { Button } from '@/components/ui/button'
import SecTable from './components/SecTable'
import InputTables from './components/InputTables'

const page = () => {
  return (
    <div>
      <FirTable/>
      <SecTable />
      <InputTables />
    </div>
  )
}

export default page