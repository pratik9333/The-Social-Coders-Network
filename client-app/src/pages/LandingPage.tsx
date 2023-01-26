import React from 'react'
import {Button} from '../components'
import "./styles/pages.css"

const LandingPage:React.FC = () => {
  return (
    <div className='min-h-[100vh] w-full bg-social-theme relative overflow-hidden'>
    
      <div className='w-full h-[300px]flex flex-col pt-[180px]'>
        <div className='lg:ml-[200px] sm:ml-[50px] ml-[20px]'>
            <div className='flex flex-col content-start'>
              <h1 className='text-white text-[2.5rem] font-extrabold Icon sm:text-[3rem] md:text-[4rem] lg:text-[6rem] xl:text-[8rem] whitespace-nowrap'>SOCIAL CODERS</h1>
              <h2 className='text-white text-l font-normal ml-4'>Haven't signed up yet ?</h2>
            </div>
              <Button className="pt-[20px] sm:text-[1rem] sm:width-[80px] width-[40px] text-[0.8rem]" content="Become a Social coder"/>
        </div>
      </div>
    </div>
  )
}

export default LandingPage