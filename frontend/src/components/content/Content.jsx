import React from 'react'

const Content = () => {
  
  return (
   <>
    <div className='w-[100vw] bg-gradient-to-r from-slate-100 via-lime-100 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300'>
      {/* logo */}
      <div className='p-8 px-5 flex flex-col items-center justify-center'>
            <span className='text-7xl text-blue-600 dark:text-blue-400 font-serif font-extrabold transition-colors duration-300'>LinkBridger</span>
            <span className='text-neutral-800 dark:text-gray-200 font-extralight mt-2 transition-colors duration-300'>Generate Links You'll Never Forget</span>
            <span className='text-neutral-800 dark:text-gray-200 font-thin transition-colors duration-300'>Turn Your Username Into Smart Links - Quick and Simple!</span>

      </div>
     

    </div>
   </>
  )
}

export default Content