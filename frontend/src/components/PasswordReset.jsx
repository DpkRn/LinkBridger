import React, { useState } from "react";
import toast from "react-hot-toast";
import { CSSTransition } from "react-transition-group";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

const PasswordReset = () => {
  const [step, setStep] = useState(1); // Step 1: Email, Step 2: OTP, Step 3: Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const navigate=useNavigate()

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    // Logic to send OTP to the email
    try {
      const res = await api.post(
        "/auth/password_reset",
        { email },
        { withCredentials: true }
      );
      if (res.status === 201 && res.data.success) {
        toast.success(res.data.message);
        setOtpSent(true);
        setMessage(`OTP has been sent to your ${email}. Please check your inbox.`);
        setStep(2); // Move to OTP step
      }
    } catch (err) {
      console.log(err);
      const message = err.response?.data?.message || "something went wrong";
      toast.error(message);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(
        "/auth/validate_otp",
        { email,otp,password },
        { withCredentials: true }
      );
      if (res.status === 201 && res.data.success) {
          // Dummy OTP for testing
          // setMessage("Email verified! You can now reset your password.");
          toast.success(res.data.message);
          navigate('/login',{replace:true})
          
        }
         
        
      
    } catch (err) {
      console.log(err);
      setMessage("Invalid OTP. Please try again.");
      const message = err.response?.data?.message || "something went wrong";
      toast.error(message);
    }
  };
    

  return (
    <div className="w-screen h-screen  flex items-center justify-center">
      <div className="w-full max-w-md shadow-lg rounded-lg p-8 transition-all duration-500 ease-in-out transform">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Forgot Password
        </h2>
        {message && (
          <div className="mb-4 text-center text-green-500">{message}</div>
        )}

        {/* Email Form */}
        <CSSTransition
          in={step === 1}
          timeout={300}
          classNames="fade"
          unmountOnExit
        >
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Send OTP
            </button>
          </form>
        </CSSTransition>

        {/* OTP Form */}
        <CSSTransition
          in={step === 2}
          timeout={300}
          classNames="fade"
          unmountOnExit
        >
          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700"
              >
                Enter OTP
              </label>
              <input
                type="text"
                name="otp"
                id="otp"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {/* <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Reset Password
            </button> */}
         
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Change Password
            </button>
          </form>
        </CSSTransition>

        {/* Password Reset Form */}
        {/* <CSSTransition
          in={step === 3}
          timeout={300}
          classNames="fade"
          unmountOnExit
        >
         
        </CSSTransition> */}
      </div>
    </div>
  );
};

export default PasswordReset;
