import React from 'react'
import { useSelector } from 'react-redux'

const Notification = () => {
    const links=useSelector(store=>store.admin.links)
  return (
    <div className='w-max p-8 text-white' >
        <div>
            <ul>
               { links.map((link,ind)=>link.notSeen>0&&<div key={ind} className='my-2 py-2 px-4 rounded-lg hover:bg-cyan-900'><span>{`${link.notSeen} clicks on ${link.source}`}</span></div>)}
            </ul>
        </div>
    </div>
  )
}

export default Notification