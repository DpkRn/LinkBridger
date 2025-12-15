import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  const navigate = useNavigate();

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 via-sky-200 to-blue-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300"
    >
      <div className="text-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-200 to-pink-500 dark:from-purple-300 dark:via-violet-100 dark:to-pink-400">
            404
          </h1>
        </motion.div>
        
        <motion.h2
          variants={fadeInUp}
          className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-white transition-colors duration-300"
        >
          Page Not Found
        </motion.h2>
        
        <motion.p
          variants={fadeInUp}
          className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto transition-colors duration-300"
        >
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </motion.p>

        <motion.div
          variants={fadeInUp}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-md text-lg transition-colors duration-200"
          >
            Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-md text-lg transition-colors duration-200"
          >
            Go Home
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12"
        >
          <img
            src="/panda.png"
            alt="404"
            className="mx-auto h-48 w-48 opacity-50 dark:opacity-70 dark:brightness-90 transition-all duration-300"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default NotFound;

