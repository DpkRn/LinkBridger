import React from 'react'
import LinkPage from './pages/LinkPage'
import Content from './content/Content'
import CreateBridge from './pages/CreateBridge'
import Footer from './footer/Footer'
import TemplatePreview from './preview/TemplatePreview'
import Template from './preview/Template'

const DashBoard = () => {
  return (
    <div className="flex flex-col dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 dark:bg-gradient-to-br transition-colors duration-300">
      <Content/>
      {/* <TemplatePreview/> */}
      <Template/>
      <CreateBridge/>
      <LinkPage>
        <Template />
      </LinkPage>
      <Footer/>
    </div>
  )
}

export default DashBoard