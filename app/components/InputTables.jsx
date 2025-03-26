import React from 'react'
import FirTable from './FirTable'
import { Button } from '@/components/ui/button'
import BtnControls from './BtnControls'
const InputTables = () => {
  return (
    <div className='mt-12 '>
         <FirTable />
        <div className='pt-10 px-6'>
         <Button className="bg-green-500 mr-4 mb-2 cursor-pointer">Hot rolling schedule detail</Button>
         <Button className="bg-blue-700 cursor-pointer">Quality process</Button>
        </div>
    <div className="grid grid-cols-3 gap-6 bg-gray-300 p-6 mt-6">
    
  {[
    "PLAN_NO",
    "IN_MAT_NO",
    "IN_MAT_TYPE",
    "UNRULL_FLAG",
    "MAT_SEQ_NO",
    "PLAN_STATUS",
    "PONO",
    "STEEL_GRADE",
    "HEAT_NO",
    "IN_MAT_THICK",
    "NEW_COLUMN_1",
    "NEW_COLUMN_2",
    "PLAN_NO",
    "IN_MAT_NO",
    "IN_MAT_TYPE",
    "UNRULL_FLAG",
    "MAT_SEQ_NO",
    "PLAN_STATUS",
    "PONO",
    "STEEL_GRADE",
    "HEAT_NO",
    "IN_MAT_THICK",
    "NEW_COLUMN_1",
    "NEW_COLUMN_2",
  ].map((label, index) => (
    <div key={index} className="flex items-center">
      <p className="w-32 font-semibold">{label}</p>
      <input className="border-2 rounded-md border-black p-1 flex-1" />
    </div>
  ))}
</div>
<div className='p-3 '>
<BtnControls />
</div>
</div>
  )
}

export default InputTables