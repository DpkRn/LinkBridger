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
import Footer from './footer/Footer'


const DashBoard = () => {
 

  return (
    <div className="flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-gray-950 dark:via-purple-950 dark:to-gray-950 transition-colors duration-300">
      
      <Content/>
      <CreateBridge/>
      <LinkPage/>
      <Footer/>
    </div>
  )
}

export default DashBoard