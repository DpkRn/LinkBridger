import React from 'react'
import LinkPage from './pages/LinkPage'
import Content from './content/Content'
import CreateBridge from './pages/CreateBridge'
import Footer from './footer/Footer'


const DashBoard = () => {
 

  return (
    <div className="flex flex-col dark:from-gray-950 dark:via-purple-950 dark:to-gray-950 dark:bg-gradient-to-br transition-colors duration-300">
      
      <Content/>
      <CreateBridge/>
      <LinkPage/>
      <Footer/>
    </div>
  )
}

export default DashBoard