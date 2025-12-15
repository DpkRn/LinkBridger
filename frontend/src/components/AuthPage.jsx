import React, { useRef, useEffect, useState } from "react";
import "../App.css";
import toast from "react-hot-toast";
import api from "../utils/api";
import { useDispatch } from "react-redux";
import { setAuthenticated, setUser } from "../redux/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { GiSkullCrossedBones } from "react-icons/gi";
import { FaCheck } from "react-icons/fa";

const AuthPage = () => {
  //redux thing
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  // Create references for the elements you want to manipulate
  const signInBtnRef = useRef(null);
  const signUpBtnRef = useRef(null);
  const containerRef = useRef(null);

  const [isAvailable, setAvailable] = useState(false);
  const [isShow, setShow] = useState(false);
  const [isShowSignup, setShowSignup] = useState(false);

  const [loginemail, setLoginEmail] = useState("");
  const [loginpassword, setLoginPassword] = useState("");

  const [signinemail, setSigninEmail] = useState("");
  const [signinpassword, setSigninPassword] = useState("");
  const [username, setUsername] = useState("");

  // Using useEffect to set up the event listeners after rendering
  useEffect(() => {
    const signInBtn = signInBtnRef.current;
    const signUpBtn = signUpBtnRef.current;
    const container = containerRef.current;

    const handleSignUpClick = () => {
      container.classList.add("sign-up-mode");
    };

    const handleSignInClick = () => {
      container.classList.remove("sign-up-mode");
    };

    // Add event listeners
    if (signUpBtn && signInBtn) {
      signUpBtn.addEventListener("click", handleSignUpClick);
      signInBtn.addEventListener("click", handleSignInClick);
    }

    // Clean up event listeners on component unmount
    return () => {
      if (signUpBtn && signInBtn) {
        signUpBtn.removeEventListener("click", handleSignUpClick);
        signInBtn.removeEventListener("click", handleSignInClick);
      }
    };
  }, []);

  const validateSpace = () => {};

  //Authentication
  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post(
        "/auth/signup",
        { username: username, email: signinemail, password: signinpassword },
        { withCredentials: true }
      );
      if (res.status === 201 && res.data.success) {
        toast.success(res.data.message);
        setLoading(false);
        navigate("/verify", {
          state: {
            username: username,
            email: signinemail,
            password: signinpassword,
          },
        });
      }
    } catch (err) {
      console.log(err);
      const message = err.response?.data?.message || "Network Slow ! Try again";
      toast.error(message);
      if (err.status === 409) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      
      setLoading(true);
      const res = await api.post(
        "/auth/signin",
        { email: loginemail, password: loginpassword },
        { withCredentials: true }
      );
      if (res.status === 200 && res.data.success) {
        // console.log(res.data.user.username)
        dispatch(setUser(res.data.user));
        dispatch(setAuthenticated(true));
        navigate("/home", { replace: true });
        setLoading(false);
        setLoginEmail("");
        setLoginPassword("");
        toast.success(`welcome ${res.data.user.username}`);
      }
    } catch (err) {
      console.log(err);

      const message = err.response?.data?.message || "Network Slow ! Try again";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const checkAvailablity = async (usrnm) => {
    if (usrnm.length < 5) return;
    try {
      const res = await api.post("/auth/checkavailablity", { username: usrnm });
      if (res.status === 209 && res.data.success) {
        console.log("not available");
        setAvailable(false);
      }
      if (res.status === 200 && res.data.success) {
        console.log("available");
        setAvailable(true);
      }
    } catch (err) {
      console.log(err);
      setAvailable(false);
      const message = err.response?.data?.message || "Server Internal Error !";
    }
  };
  return (
    <>
      <div className="container min-w-screen " ref={containerRef}>
        <div className="forms-container ">
          <div className="signin-signup  shadow-lg">
            {/* Sign-in form */}
            <form className="sign-in-form dark:bg-gray-800/50">
              <h2 className="title dark:text-white">Log in</h2>
              <div className="input-field">
                <i className="fas fa-user"></i>

                <input
                  type="text"
                  placeholder="Email"
                  value={loginemail}
                  onChange={(e) => {
                    if (e.target.value.includes(" ")) {
                      toast.error("space not allowed");
                      return;
                    }
                    setLoginEmail(e.target.value);
                  }}
                />
              </div>
              <div className="input-field">
                <i className="fas fa-lock"></i>
                <input
                  type={isShow ? "text" : "password"}
                  placeholder="Password"
                  value={loginpassword}
                  onChange={(e) => {
                    if (e.target.value.includes(" ")) {
                      toast.error("space not allowed");
                      return;
                    }
                    setLoginPassword(e.target.value);
                  }}
                />
              </div>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="remember"
                    aria-describedby="remember"
                    type="checkbox"
                    checked={isShow}
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                    required=""
                    onChange={() => {
                      setShow((state) => !state);
                    }}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="remember"
                    className="text-gray-500 dark:text-gray-300"
                  >
                    Show Password
                  </label>
                </div>
              </div>
              <button  type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-bold rounded-3xl text-sm px-10 py-2.5 text-center me-2 mt-3 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center transition-colors duration-200" onClick={handleLogin}>
{loading&&<svg aria-hidden="true" role="status" class="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
</svg>}
Login
</button>
              <p className="social-text dark:text-gray-300">Or Sign in with social platforms</p>
              <Link
                to="/reset_password"
                className="text-blue-500 dark:text-blue-400 cursor-pointer hover:underline transition-colors duration-200"
              >
                Forgot password?
              </Link>
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
            <form className="sign-up-form dark:bg-gray-800/50">
              <h2 className="title dark:text-white">Sign up</h2>

              <div className="input-field px-5 flex items-center justify-around">
                <input
                  type="text"
                  placeholder="Username"
                  className="mr-5 w-[80%]"
                  value={username}
                  onChange={(e) => {
                    if (e.target.value.includes(" ")) {
                      toast.error("space not allowed");
                      return;
                    }
                    checkAvailablity(e.target.value);
                    setUsername(e.target.value);
                  }}
                />
                {!isAvailable ? (
                  <GiSkullCrossedBones className="text-red-900" />
                ) : (
                  <FaCheck className="text-green-900" />
                )}
              </div>

              <div className="input-field flex items-center pl-5 justify-between">
                <input
                  type="email"
                  placeholder="Email"
                  value={signinemail}
                  onChange={(e) => {
                    if (e.target.value.includes(" ")) {
                      toast.error("space not allowed");
                      return;
                    }
                    setSigninEmail(e.target.value);
                  }}
                />
              </div>

              <div className="input-field flex items-center pl-5 justify-between">
                <input
                  type={isShowSignup?"text":"password"}
                  placeholder="Password"
                  value={signinpassword}
                  onChange={(e) => {
                    if (e.target.value.includes(" ")) {
                      toast.error("space not allowed");
                      return;
                    }
                    setSigninPassword(e.target.value);
                  }}
                />
              </div>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="signupCheck"
                    type="checkbox"
                    checked={isShowSignup}
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                    required=""
                    onChange={() => {
                      setShowSignup((state) => !state);
                    }}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="signupCheck"
                    className="text-gray-500 dark:text-gray-300 transition-colors duration-200"
                  >
                    Show Password
                  </label>
                </div>
              </div>

              <button  type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-bold rounded-3xl text-sm px-10 py-2.5 text-center me-2 mt-3 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center transition-colors duration-200" onClick={handleSignUp}>
{loading&&<svg aria-hidden="true" role="status" class="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
</svg>}
Signup
</button>
              <p className="social-text dark:text-gray-300">Or Sign up with social platforms</p>

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
              <p>Generate Links You'll Never Forget - Get Started!</p>
              <button
                className="btn transparent"
                ref={signUpBtnRef}
                id="sign-up-btn"
              >
                Sign up
              </button>
            </div>
            <img src="img/log.svg" className="image" alt="" />
          </div>
          <div className="panel right-panel">
            <div className="content">
              <h3>One of us ?</h3>
              <p>Turn Usernames into Smart Links - Quick and Simple!</p>
              <button
                className="btn transparent"
                ref={signInBtnRef}
                id="sign-in-btn"
              >
                Log in
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
