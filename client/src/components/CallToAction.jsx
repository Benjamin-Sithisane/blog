import React from 'react'
import { Button } from 'flowbite-react'

export default function () {
  return (
    <div className='flex flex-col sm:flex-row p-3 border justify-center items-center rounded-tl-3xl rounded-br-3xl text-center shadow-md'>
        <div className='flex-1 justify-center flex flex-col'>
            <h2 className='text-2xl'>
                Nostra eros commodo nibh nisl accumsan maximus?
            </h2>
            <p className='text-gray-500 p-3'>
                Hendrerit commodo curabitur faucibus massa ad egestas.
            </p>
            <Button gradientDuoTone='redToYellow' className='rounded-tl-xl rounded-bl-none'>
                <a href='https://info.cern.ch/#:~:text=http://info.cern.ch' target='_blank' 
                rel='noopener noreferrer'>
                    Vulputate duis varius mauris tortor urna imperdiet.
                </a>
            </Button>
        </div>
        <div className='p-7 flex-1'>
                <img 
                    src='https://images.unsplash.com/photo-1568992687947-868a62a9f521?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                />
        </div>
    </div>
  )
}
