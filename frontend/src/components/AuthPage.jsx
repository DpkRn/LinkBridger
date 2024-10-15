import React, { useRef, useEffect, useState } from 'react';
import '../App.css';
import toast from 'react-hot-toast';
import api from '../utils/api'
import { useDispatch } from 'react-redux';
import { setAuthenticated, setUser } from '../redux/userSlice';
import { Link, useNavigate } from 'react-router-dom';
import { GiSkullCrossedBones } from "react-icons/gi";
import { FaCheck } from "react-icons/fa";

const AuthPage = () => {
 //redux thing
  const dispatch=useDispatch()

  const navigate=useNavigate()

   const [loading,setLoading]=useState(false)

  // Create references for the elements you want to manipulate
  const signInBtnRef = useRef(null);
  const signUpBtnRef = useRef(null);
  const containerRef = useRef(null);

  const [isAvailable,setAvailable]=useState(false)


  const [loginemail,setLoginEmail]=useState('');
  const [loginpassword,setLoginPassword]=useState('');

  const [signinemail,setSigninEmail]=useState('');
  const [signinpassword,setSigninPassword]=useState('');
  const [username,setUsername]=useState('');
  


  // Using useEffect to set up the event listeners after rendering
  useEffect(() => {
    const signInBtn = signInBtnRef.current;
    const signUpBtn = signUpBtnRef.current;
    const container = containerRef.current;

    const handleSignUpClick = () => {
      container.classList.add('sign-up-mode');
    };

    const handleSignInClick = () => {
      container.classList.remove('sign-up-mode');
    };

    // Add event listeners
    if (signUpBtn && signInBtn) {
      signUpBtn.addEventListener('click', handleSignUpClick);
      signInBtn.addEventListener('click', handleSignInClick);
    }

    // Clean up event listeners on component unmount
    return () => {
      if (signUpBtn && signInBtn) {
        signUpBtn.removeEventListener('click', handleSignUpClick);
        signInBtn.removeEventListener('click', handleSignInClick);
      }
    };
  }, []); 




  //Authentication
  const handleSignUp=async(e)=>{
    e.preventDefault()
    try{
      setLoading(true)
      const res=await api.post('/auth/signup',{username:username,email:signinemail,password:signinpassword},{withCredentials:true});
      if(res.status===201&&res.data.success){
        toast.success(res.data.message)
        setLoading(false)
        navigate('/verify',{state:{username:username,email:signinemail,password:signinpassword}})
      }
    }catch(err){
      console.log(err)
      const message=err.response?.data?.message||"Network Slow ! Try again";
      toast.error(message)
      if(err.status===409){
        navigate('/login')
      }
    }finally{
      setLoading(false)
    }
  }


  const handleLogin=async(e)=>{
    e.preventDefault()
    try{
      setLoading(true)
      const res=await api.post('/auth/signin',{email:loginemail,password:loginpassword},{withCredentials:true});
      if(res.status===200&&res.data.success){
        // console.log(res.data.user.username)
        dispatch(setUser(res.data.user))
        dispatch(setAuthenticated(true))
        setLoading(false)
        setLoginEmail('')
        setLoginPassword('')
        toast.success(`welcome ${res.data.user.username}`)
      }
    }catch(err){
      console.log(err)

      const message=err.response?.data?.message||"Network Slow ! Try again";
      toast.error(message)
    }finally{
      setLoading(false)
    }
  }

  const checkAvailablity=async(usrnm)=>{
    if(usrnm.length<5) return;
    try{
      const res=await api.post('/auth/checkavailablity',{username:usrnm})
      if(res.status===209&&res.data.success){
        console.log('not available')
        setAvailable(false)
      }
      if(res.status===200&&res.data.success){
        console.log('available')
        setAvailable(true)
      }

    }catch(err){
      console.log(err)
      setAvailable(false)
      const message=err.response?.data?.message||"Server Internal Error !";
    }
  }
  return (
    <>
      <div className="container min-w-screen " ref={containerRef}>
        <div className="forms-container ">
          <div className="signin-signup  shadow-lg">
            {/* Sign-in form */}
            <form  className="sign-in-form ">
              <h2 className="title">Log in</h2>
              <div className="input-field">
                <i className="fas fa-user"></i>
                
                <input type="text" placeholder="Email" value={loginemail} onChange={(e)=>setLoginEmail(e.target.value)} />
              </div>
              <div className="input-field">
                <i className="fas fa-lock"></i>
                <input type="password" placeholder="Password"  value={loginpassword} onChange={(e)=>setLoginPassword(e.target.value)} />
              </div>
              <button  className="btn solid  "  onClick={handleLogin}>{`${!loading?"Sign In":"..."}`}</button>
              <p className="social-text">Or Sign in with social platforms</p>
              <Link to='/reset_password' className='text-blue-500 cursor-pointer' >forgot password?</Link>
              {/* <div className="social-media">
                <a href="#" className="social-icon">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="social-icon">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="social-icon">
                  <i className="fab fa-google"></i>
                </a>
                <a href="#" className="social-icon">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div> */}
            </form>

            {/* Sign-up form */}
            <form  className="sign-up-form">
              <h2 className="title">Sign up</h2>

              <div className="input-field px-5 flex items-center justify-around">
                 <input type="text" placeholder="username" className='mr-5 w-[80%]' value={username} 
                 onChange={(e)=>{
                  checkAvailablity(e.target.value);
                   setUsername(e.target.value)}
                  } />
                 {!isAvailable?<GiSkullCrossedBones className='text-red-900'/>
                 :<FaCheck className='text-green-900' />}
              </div>

              <div className="input-field flex items-center pl-5 justify-between">
                <input type="email" placeholder="Email" value={signinemail} onChange={(e)=>setSigninEmail(e.target.value)}/>
              </div>

              <div  className="input-field flex items-center pl-5 justify-between">
                <input type="password" placeholder="Password" value={signinpassword} onChange={(e)=>setSigninPassword(e.target.value)}/>
              </div>

              <button  className="btn solid"   onClick={handleSignUp} >{`${!loading?"Sign Up":"..."}`}</button>
              <p className="social-text">Or Sign up with social platforms</p>
             
              {/* <div className="social-media">
                <a href="#" className="social-icon">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="social-icon">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="social-icon">
                  <i className="fab fa-google"></i>
                </a>
                <a href="#" className="social-icon">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div> */}
            </form>
          </div>
        </div>

        {/* Panels */}
        <div className="panels-container">
          <div className="panel left-panel">
            <div className="content">
              <h3>New here ?</h3>
              <p>
              Generate Links You'll Never Forget - Get Started!
              </p>
              <button className="btn transparent" ref={signUpBtnRef} id="sign-up-btn">
                Sign up
              </button>
            </div>
            <img src="img/log.svg" className="image" alt="" />
          </div>
          <div className="panel right-panel">
            <div className="content">
              <h3>One of us ?</h3>
              <p>
              Turn Usernames into Smart Links - Quick and Simple!
              </p>
              <button className="btn transparent" ref={signInBtnRef} id="sign-in-btn">
                Sign in
              </button>
            </div>
            <img src="img/register.svg" className="image" alt="" />
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthPage;
