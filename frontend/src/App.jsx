import { useEffect, useState } from 'react'
import "./App.css"
import AuthPage from './components/AuthPage'
import { Routes, Route, Navigate } from 'react-router-dom'
import DashBoard from './components/DashBoard'
import { useDispatch, useSelector } from 'react-redux'
import api from './utils/api'
import { setAuthenticated, setLinks, setUser } from './redux/userSlice'
import toast from 'react-hot-toast'
import VerificationPage from './components/VerificationPage'
import Nav from './components/navbar/Nav'
import VerifiedPage from './components/VerifiedPage'
import PasswordReset from './components/PasswordReset'
import Documentation from './components/Documentation'
import LinkPage from './components/pages/LinkPage'
import ProfilePage from './components/pages/Profile'

function App() {
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(true);
  const isAuthenticated = useSelector(store => store.admin.isAuthenticated);
  const user=useSelector(store=>store.admin.user)
  const PrivateRoute = ({ children }) => {
    return isAuthenticated === true ? children : <Navigate to='/login' />;
  };

  const AuthRoute = ({ children }) => {
    return isAuthenticated === false ? children : <Navigate to='/home' />;
  };

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const res = await api.post('/auth/verify', {}, { withCredentials: true });
        if (res.status === 200 && res.data.success) {
           console.log("User verified!");
          dispatch(setUser(res.data.user));
          dispatch(setAuthenticated(true));
          // toast.success(`Welcome back ${res.data.user.username}`);
        }
      } catch (err) {
        console.error(err);
        
        const message = err.response?.data?.message || "Server Internal Error";
        dispatch(setUser(null))
        dispatch(setAuthenticated(false));
        if(!err.status===401)
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    const getAllLinks=async(username)=>{
      try{
       const res=await api.post('/source/getallsource',{username},{withCredentials:true});
       if(res.status===200&&res.data.success){
         dispatch(setLinks(res.data.sources))
       }
      }catch(err){
       console.log(err)
       const message=err.response?.data?.message||"Server Internal Error"
       toast.error(message)
      }
     }
    if (!user) {
      getUserInfo();
    } else {
      getAllLinks(user.username)
      // toast.success(`welcome ${user.username}`)
      setLoading(false);
    }
  }, []);

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading....</div>;

  return (
    <div className='pb-1 min-h-screen  bg-gradient-to-r from-slate-100 via-lime-100 to-slate-100 overflow-hidden'>
      {isAuthenticated && <Nav />}

      <Routes>
        <Route path='/doc' element={<Documentation/>} />
        <Route path='/login' element={<AuthRoute><AuthPage /></AuthRoute>}/>
        <Route path='/verify' element={<VerificationPage />} />
        <Route path='/links' element={<PrivateRoute><LinkPage/></PrivateRoute>} />
        <Route path='/' element={<AuthRoute><Documentation/></AuthRoute>} />
        <Route path='/profile' element={<ProfilePage/>} />
        <Route path='/home' element={<PrivateRoute><DashBoard /></PrivateRoute>} />
        <Route path='/verified' element={<VerifiedPage />} />
        <Route path='/reset_password' element={<PasswordReset />} />
        
      </Routes>
    </div>
  );
}

export default App;
