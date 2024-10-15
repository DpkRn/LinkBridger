import { useEffect, useState } from 'react';
import "./App.css";
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import api from './utils/api';
import { setAuthenticated, setUser } from './redux/userSlice';
import toast from 'react-hot-toast';
import Nav from './components/navbar/Nav';
import AuthPage from './components/AuthPage';
import DashBoard from './components/DashBoard';
import VerificationPage from './components/VerificationPage';
import VerifiedPage from './components/VerifiedPage';
import PasswordReset from './components/PasswordReset';

function App() {
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(true);
  const isAuthenticated = useSelector(store => store.admin.isAuthenticated);
  const user = useSelector(store => store.admin.user);
  const [isLoggingOut, setIsLoggingOut] = useState(false); // Track if logging out

  const PrivateRoute = ({ children }) => {
    return isAuthenticated === true ? children : <Navigate to='/login' />;
  };

  const AuthRoute = ({ children }) => {
    return isAuthenticated === false ? children : <Navigate to='/' />;
  };

  useEffect(() => {
    const getUserInfo = async () => {
      if (isLoggingOut) return; // Prevent token verification during logout

      try {
        const res = await api.post('/auth/verify', {}, { withCredentials: true });
        if (res.status === 200 && res.data.success) {
          dispatch(setUser(res.data.user));
          dispatch(setAuthenticated(true));
          toast.success(`Welcome back ${res.data.user.username}`);
        }
      } catch (err) {
        console.error(err);
        const message = err.response?.data?.message || "Server Internal Error";
        dispatch(setUser(null));
        dispatch(setAuthenticated(false));
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    if (!user) {
      getUserInfo();
    } else {
      setLoading(false);
    }
  }, [user, isLoggingOut]); // Re-run effect when logging out state changes

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading....</div>;

  return (
    <div className='pb-1 w-[100%] bg-gradient-to-r from-slate-100 via-lime-100 to-slate-100 overflow-hidden'>
      {isAuthenticated && <Nav isLoggingOut={isLoggingOut} setIsLoggingOut={setIsLoggingOut} />}

      <Routes>
        <Route path='/login' element={<AuthRoute><AuthPage /></AuthRoute>} />
        <Route path='/verify' element={<VerificationPage />} />
        <Route path='/' element={<PrivateRoute><DashBoard /></PrivateRoute>} />
        <Route path='/verified' element={<VerifiedPage />} />
        <Route path='/reset_password' element={<PasswordReset />} />
      </Routes>
    </div>
  );
}

export default App;
