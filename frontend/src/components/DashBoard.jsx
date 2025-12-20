import React from 'react'
import LinkPage from './pages/LinkPage'
import Content from './content/Content'
import CreateBridge from './pages/CreateBridge'
import Footer from './footer/Footer'


const DashBoard = () => {
 

  return (
<<<<<<< Updated upstream
    <div className="flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-purple-950 dark:to-gray-950 transition-colors duration-300">
=======
    <div className="flex flex-col dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 dark:bg-gradient-to-br transition-colors duration-300">
>>>>>>> Stashed changes
      
      <Content/>
      <CreateBridge/>
      <LinkPage/>
      <Footer/>
    </div>
  )
}

export default DashBoard