import React, { useRef, useState } from "react";
import { replace, useLocation, useNavigate } from "react-router-dom";
import api from "../utils/api";
import toast from "react-hot-toast";

const VerificationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { username, email, password } = location.state || "";
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);
  const [resendMessage,setResendMessage]=useState(false)

  const handleVerifyAcc = async (e) => {
    e.preventDefault();
    const newOtp=otp.reduce((acc,c)=>acc+c,'')
    toast(otp);
    try {
      const res = await api.post(
        "/auth/verifyAcc",
        { otp:newOtp, username, email, password },
        { withCredentials: true }
      );
      if (res.status === 201 && res.data.success) {
        toast.success(res.data.message);
        navigate("/verified", { state: "verified" }, { replace: true });
      }
    } catch (err) {
      console.log(err);
      const message = err.response?.data?.message || "Server Internal Error !";
      toast.error(message);
    }
  };
  const handleChange = (e, index) => {
    const { value } = e.target;

    // Allow only numbers or single characters
    if (/^[0-9]$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      // newOtp.concat()
      setOtp(newOtp);

      // Move focus to the next input box if there is a value
      if (value && index < otp.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const resendOtp=async(e)=>{
    e.preventDefault()
    try{
      setResendMessage(false)
      const res=await api.post('/auth/signup',{email},{withCredentials:true});
      if(res.status===201&&res.data.success){
          toast.success(res.data.message)
          setResendMessage(true)
      }
    }catch(err){
      setResendMessage(false)
      const message=err.response?.data?.message||'something got wrong !'
      toast.error(message)
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col justify-center overflow-hidden py-12">
      <div className="relative  px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
        <div className="mx-auto flex w-full max-w-md flex-col space-y-16">
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <div className="font-semibold text-3xl">
              <p>Email Verification</p>
            </div>
            <div className="flex flex-row text-sm font-medium text-gray-400">
              <p>{`We have sent a code to your email ${email}`}</p>
            </div>
          </div>

          <div>
            <form>
              <div className="flex flex-col space-y-16">
                <div className="flex flex-row items-center justify-between mx-auto h-16">
                  {otp.map((_, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      value={otp[index]}
                      onChange={(e) => handleChange(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      ref={(el) => (inputRefs.current[index] = el)}
                      className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                    />
                  ))}
                </div>
                

                <div className="flex flex-col space-y-5">
                  <div>
                    <button
                      className="flex flex-row items-center justify-center text-center w-full border rounded-xl outline-none py-5 bg-blue-700 border-none text-white text-sm shadow-sm"
                      onClick={handleVerifyAcc}
                    >
                      Verify Account
                    </button>
                  </div>

                  {resendMessage&&<p className="text-red-500">otp sent !</p>}
                  <p>Otp will be valid only for 5 minutes</p>
                  <div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
                    <p>Didn't recieve code?</p>{" "}
                    <p
                      className="flex flex-row items-center text-blue-600 cursor-pointer hover:underline"
                     onClick={resendOtp}
                    >
                      Resend
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;
