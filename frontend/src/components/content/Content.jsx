import React from 'react'

const Content = ({setShowLinkBridge}) => {
  console.log(setShowLinkBridge)
  return (
   <>
    <div className='w-[100vw]'>
      {/* logo */}
      <div className='p-8  px-5 flex flex-col items-center justify-center'>
            <span className='text-7xl text-blue-600 font-serif font-extrabold'>Link Bridger</span>
            <span className= 'text-neutral-800 font-extralight mt-2 '>Generate Links You'll Never Forget </span>
            <span className= 'text-neutral-800 font-thin'>Turn Your Username Into Smart Links - Quick and Simple!</span>

      </div>
      {/* button */}
      {/* <div className='text-right m-8'>
          <button className='py-3 px-6 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold rounded-lg shadow-lg hover:shadow-2xl transform hover:scale-110 transition-transform duration-500 hover:-rotate-3 active:bg-gradient-to-r active:from-purple-900 active:to-indigo-900'
          // onClick={()=>setShowLinkBridge(state=>!state)}
          >Create New Bridge</button>
      </div> */}

    </div>
   </>
  )
}

export default Content