import React from 'react'
import { Button } from '@/components/ui/button'
const BtnControls = () => {
  return (
    <div>
        <div className='flex my-8'>
            <Button>F2</Button>
            <input placeholder='Query' className='w-22 mx-3 border-2 rounded-md border-black' />
            <Button>F3</Button>
            <input placeholder='Split' className='w-22 mx-3 border-2 rounded-md border-black' />
            <Button>F5</Button>
            <input placeholder='Delete' className='w-22 mx-3 border-2 rounded-md border-black' />
            <Button>F6</Button>
            <input placeholder='Rollback' className='w-22 mx-3 border-2 rounded-md border-black' />
            <Button>F7</Button>
            <input placeholder='Rule Check' className='w-22 mx-3 border-2 rounded-md border-black' />
            <Button>F8</Button>
            <input placeholder='Update' className='w-22 mx-3 border-2 rounded-md border-black' />
            <Button>F9</Button>
            <input placeholder='Confirm' className='w-22 mx-3 border-2 rounded-md border-black' />
            <Button>F10</Button>
            <input placeholder='Release' className='w-22 mx-3 border-2 rounded-md border-black' />
          </div>  
    </div>
  )
}

export default BtnControls