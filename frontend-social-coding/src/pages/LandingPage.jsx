import React from 'react'
import { Button } from '../components'
import "./styles/pages.css"

const LandingPage = () => {
  return (
    <div className='min-h-[100vh] w-full bg-social-theme relative overflow-hidden'>
    
      <div className='w-full h-[300px]flex flex-col pt-[180px]'>
        <div className='ml-[200px]'>
            <div className='flex flex-col content-start'>
              <h1 className='text-white text-[8rem] font-extrabold Icon'>SOCIAL CODERS</h1>
              <h2 className='text-white text-l font-normal ml-4'>Haven't signed up yet ?</h2>
            </div>
              <Button className="pt-[20px]" content="Become a Social coder"/>
        </div>
      </div>
    </div>
  )
}

export default LandingPage