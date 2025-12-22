import React from 'react'
import { useLocation } from 'react-router-dom'
import LinkPage from './pages/LinkPage'
import Content from './content/Content'
import CreateBridge from './pages/CreateBridge'
import Footer from './footer/Footer'
import TemplatePreview from './preview/TemplatePreview'
import Template from './preview/Template'

const DashBoard = () => {
  const location = useLocation()
  
  return (
    <div className="flex flex-col dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 dark:bg-gradient-to-br transition-colors duration-300">
      <Content/>
      {/* <TemplatePreview/> */}
      <Template/>
      <CreateBridge/>
      {/* Only pass Template as children if pathname is not /links */}
      {location.pathname !== '/links' ? (
        <LinkPage>
          <Template />
        </LinkPage>
      ) : (
        <LinkPage />
      )}
      <Footer/>
    </div>
  )
}

export default DashBoard