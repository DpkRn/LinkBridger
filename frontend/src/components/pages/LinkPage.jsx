import React from 'react'
import Linkcard from '../linkcard/Linkcard'
import { useSelector } from 'react-redux'

const LinkPage = () => {
  const sidebarMenu=useSelector(store=>store.page.sidebarMenu)
    const links=useSelector(store=>store.admin.links)

   


  return (
    
    <div className={` md:p-10 ${sidebarMenu?"blur-sm":""}`}>
        {links.length===0?<h1>No links found. add new link by clicking on create new button</h1>:(links.map((link)=><Linkcard key={link._id} sources={link} />))}    
    </div>
  )
}

export default LinkPage