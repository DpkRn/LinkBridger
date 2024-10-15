import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import api from '../utils/api'
import { setLinks } from '../redux/userSlice'


import Nav from './navbar/Nav'
import LinkPage from './pages/LinkPage'
import Content from './content/Content'
import Form from './pages/CreateBridge'
import CreateBridge from './pages/CreateBridge'


const DashBoard = () => {
  const dispatch=useDispatch()

  // const links=useSelector(store=>store.admin.links)
  const [showLinkBridge,setShowLinkBridge]=useState(false)
  const {username}=useSelector(store=>store.admin.user)
 useEffect(()=>{
    const getAllLinks=async()=>{
     try{
      const res=await api.post('/source/getallsource',{username},{withCredentials:true});
      if(res.status===200&&res.data.success){
        // console.log(res.data.sources)
        dispatch(setLinks(res.data.sources))
        toast.success('links fetched')
      }
     }catch(err){
      console.log(err)
      const message=err.response?.data?.message||"Server Internal Error"
      toast.error(message)
     }
    }
    getAllLinks()
 },[])


  return (
    <div className="flex  flex-col">
      
      <Content/>
      <CreateBridge/>
      <LinkPage/>
    </div>
  )
}

export default DashBoard