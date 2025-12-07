import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import './Balloons.css'; // Custom CSS for balloon animation

const VerifiedPage = () => {
  const navigate = useNavigate();
  const location=useLocation();
  const state=location.state || "";
  if(state!='verified'){
    return <Navigate to='/login' replace:true/>
  }

  useEffect(() => {
    // Trigger balloon animation when the page is loaded
    const balloonInterval = setInterval(() => {
      createBalloon();
    }, 200); // Create a balloon every 200ms

    return () => clearInterval(balloonInterval); // Clear interval on component unmount
  }, []);

  const createBalloon = () => {
    const balloon = document.createElement('div');
    balloon.classList.add('balloon');
    document.body.appendChild(balloon);

    setTimeout(() => {
      balloon.remove();
    }, 10000); // Remove balloon after 10 seconds
  };

  const handleLoginRedirect = () => {
    navigate('/login',{replace:true});
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-400 to-purple-600 relative overflow-hidden">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Your account has been verified!</h1>
        <p className="text-lg text-white mb-8">Please go to the login page to continue.</p>
        <button
          onClick={handleLoginRedirect}
          className="bg-white text-purple-600 font-bold py-2 px-6 rounded-full shadow-lg transition transform hover:scale-105 hover:bg-purple-100"
         
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default VerifiedPage;
