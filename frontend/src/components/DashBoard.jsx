import React from 'react'
import LinkPage from './pages/LinkPage'
import Content from './content/Content'
import CreateBridge from './pages/CreateBridge'
import Footer from './footer/Footer'


const DashBoard = () => {
 

  return (
    <div className="flex flex-col dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 dark:bg-gradient-to-br transition-colors duration-300">
      
      <Content/>
      <CreateBridge/>
      <LinkPage/>
      <Footer/>
    </div>
  )
}

export default DashBoard