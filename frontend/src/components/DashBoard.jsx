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
    <div className="flex flex-col bg-gradient-to-r from-slate-100 via-lime-100 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      
      <Content/>
      <CreateBridge/>
      <LinkPage/>
      <Footer/>
    </div>
  )
}

export default DashBoard