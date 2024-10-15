import { useEffect, useState } from 'react'
import "./App.css"
import AuthPage from './components/AuthPage'
import {Routes,Route, Navigate} from 'react-router-dom'
import DashBoard from './components/DashBoard'
import { useDispatch, useSelector } from 'react-redux'
import api from './utils/api'
import { setAuthenticated, setUser } from './redux/userSlice'
import toast from 'react-hot-toast'
import VerificationPage from './components/VerificationPage'
import Nav from './components/navbar/Nav'
import VerifiedPage from './components/VerifiedPage'
import PasswordReset from './components/PasswordReset'



function App() {
  const dispatch=useDispatch()
  const [isLoading,setLoading]=useState(true)
  const isAuthenticated=useSelector(store=>store.admin.isAuthenticated)

  const PrivateRoute=({children})=>{
    return isAuthenticated?children:<Navigate to='/login'/>;
  }
  const AuthRoute=({children})=>{
    return !isAuthenticated?children:<Navigate to='/'/>;
  }

  useEffect(()=>{
     const getUserInfo=async()=>{
      try{
        const res=await api.get('/auth/verify',{withCredentials:true})
        if(res.status===200&&res.data.success){
          console.log("user verified !")
          dispatch(setUser(res.data.user))
          dispatch(setAuthenticated(true))
          setLoading(false)
          toast.success(`welcome back ${res.data.user.username}`)
        }
      }catch(err){
        console.log(err)
          const message=err.response?.data?.message||"Server Internal Error"
          dispatch(setAuthenticated(false))
          toast.error(message)
      }finally{
        setLoading(false);
      }
    }

    if(!isAuthenticated){
      getUserInfo();
    }else{
      setLoading(false)
    }
  },[dispatch,isAuthenticated])

   if(isLoading) return <h1>Loading....</h1>

  return (
    <div className='pb-1 w-[100%] bg-gradient-to-r from-slate-100 via-lime-100 to-slate-100 overflow-hidden'>
    {isAuthenticated&&<Nav/>}
   
    <Routes>
    <Route path='/login' element={<AuthRoute><AuthPage/></AuthRoute>}/>
    <Route path='/verify' element={<VerificationPage/>}/>
    <Route path='/' element={ <PrivateRoute><DashBoard/></PrivateRoute>}/>
    <Route path='/verified' element={ <VerifiedPage/>}/>
    <Route path='/reset_password' element={ <PasswordReset/>}/>
    </Routes>
    </div>
  )
}

export default App
