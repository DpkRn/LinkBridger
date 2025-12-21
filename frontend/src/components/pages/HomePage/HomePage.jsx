import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleDarkMode } from '../../../redux/pageSlice';
import { 
  FaRocket, 
  FaLink, 
  FaChartLine, 
  FaSyncAlt, 
  FaUsers,
  FaClock,
  FaEnvelope,
  FaCheckCircle,
  FaBriefcase,
  FaUserTie,
  FaCode,
  FaGraduationCap,
  FaCog
} from 'react-icons/fa';
import { 
  SiLinkedin, 
  SiGithub, 
  SiInstagram, 
  SiFacebook,
  SiLeetcode,
  SiYoutube,
  SiX
} from 'react-icons/si';
import { MdDarkMode, MdLightMode } from 'react-icons/md';
import Footer from '../../footer/Footer';
import logo from '../../../assets/logo.png';
import { FlipWords } from '../../ui/flip-words';
import {
  HeroSection,
  StatisticsSection,
  CTASection,
  ComparisonTable
} from './sections';
import Doc from '../../doc/Doc';

// 3D Card Component with Magnetic Hover
const MagneticCard = ({ children, className = "", intensity = 0.3 }) => {
  const cardRef = useRef(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = (e.clientX - centerX) / (rect.width / 2);
    const y = (e.clientY - centerY) / (rect.height / 2);
    setRotate({ x: y * intensity, y: -x * intensity });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: rotate.x,
        rotateY: rotate.y,
      }}
      transition={{ type: "spring", stiffness: 150, damping: 30, mass: 0.5 }}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
        willChange: "transform",
        backfaceVisibility: "hidden",
      }}
    >
      {children}
    </motion.div>
  );
};

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(store => store.admin.isAuthenticated);
  const darkMode = useSelector(store => store.page.darkMode);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const statsRef = useRef(null);
  // Ref to store latest mouse position, avoiding stale closure values in RAF callback
  const latestMousePositionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let rafId = null;
    let lastUpdateTime = 0;
    const throttleDelay = 16; // ~60fps

    const handleMouseMove = (e) => {
      // Always update the latest position ref immediately with current event coordinates
      // This ensures we always have the most recent position, even if RAF hasn't executed yet
      // Convert to percentages (0-100%) for proper CSS gradient positioning
      latestMousePositionRef.current = {
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      };
      
      const now = Date.now();
      if (now - lastUpdateTime < throttleDelay) {
        // Throttle updates to reduce re-renders
        // If RAF is already scheduled, don't schedule another one
        // The scheduled RAF will read the latest position from the ref at execution time
        if (rafId === null) {
          // Update lastUpdateTime immediately when scheduling RAF to prevent continuous scheduling
          // This ensures subsequent mousemove events correctly see we're still throttling
          lastUpdateTime = now;
          rafId = requestAnimationFrame(() => {
            // Read latest position from ref at execution time, not from closure-captured event
            // This ensures we always use the most recent mouse position, not the position
            // from when the RAF was first scheduled
            setMousePosition({
              x: latestMousePositionRef.current.x,
              y: latestMousePositionRef.current.y,
            });
            rafId = null;
          });
        }
        return;
      }
      
      // Update immediately if throttle delay has passed
      lastUpdateTime = now;
      setMousePosition({
        x: latestMousePositionRef.current.x,
        y: latestMousePositionRef.current.y,
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };
  }, []);

  const words = [
    {
      text: "Transform",
      className: "text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 dark:from-purple-400 dark:via-pink-400 dark:to-blue-400",
    },
    {
      text: "Your",
      className: "text-5xl md:text-7xl font-extrabold text-gray-800 dark:text-gray-200",
    },
    {
      text: "Social",
      className: "text-5xl md:text-7xl font-extrabold text-gray-800 dark:text-gray-200",
    },
    {
      text: "Presence",
      className: "text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400",
    },
  ];

  const flipWords = ["LinkedIn", "GitHub", "Instagram", "Portfolio", "YouTube", "Twitter"];

  const platformsForFlip = [
    "linkedin",
    "github",
    "leetcode",
    "portfolio",
    "instagram",
    "codeforce",
  ];

  const exampleLinks = [
    {
      platform: "LinkedIn",
      url: "https://clickly.cv/dpkrn/linkedin",
      color: "from-blue-500 to-cyan-500",
    },
    {
      platform: "GitHub",
      url: "https://clickly.cv/dpkrn/github",
      color: "from-gray-600 to-gray-800",
    },
    {
      platform: "LeetCode",
      url: "https://clickly.cv/dpkrn/leetcode",
      color: "from-orange-500 to-yellow-500",
    },
    {
      platform: "Portfolio",
      url: "https://clickly.cv/dpkrn/portfolio",
      color: "from-purple-500 to-pink-500",
    },
    {
      platform: "Instagram",
      url: "https://clickly.cv/dpkrn/instagram",
      color: "from-pink-500 to-rose-500",
    },
    {
      platform: "Codeforces",
      url: "https://clickly.cv/dpkrn/codeforces",
      color: "from-red-500 to-orange-500",
    },
  ];

  const useCases = [
    {
      title: "Job Seekers",
      desc: "Create professional links for your resume, LinkedIn, portfolio, and GitHub. Share one memorable link with recruiters.",
      icon: FaBriefcase,
      gradient: "from-blue-500 to-cyan-500",
      examples: [
        "Resume sharing",
        "Interview preparation",
        "Professional networking",
      ],
    },
    {
      title: "Content Creators",
      desc: "Manage all your social media profiles from one place. Share your LinkBridger link in bio and watch engagement grow.",
      icon: FaUserTie,
      gradient: "from-purple-500 to-pink-500",
      examples: [
        "Instagram bio links",
        "YouTube descriptions",
        "TikTok profiles",
      ],
    },
    {
      title: "Developers",
      desc: "Showcase your GitHub, portfolio, blog, and coding profiles. Perfect for developer portfolios and tech resumes.",
      icon: FaCode,
      gradient: "from-green-500 to-emerald-500",
      examples: [
        "Portfolio websites",
        "GitHub profiles",
        "Tech blogs",
      ],
    },
    {
      title: "Students",
      desc: "Share academic profiles, LinkedIn, research papers, and project portfolios. Great for college applications and networking.",
      icon: FaGraduationCap,
      gradient: "from-orange-500 to-red-500",
      examples: [
        "College applications",
        "Academic networking",
        "Project showcases",
      ],
    },
    {
      title: "Businesses",
      desc: "Create branded links for your company's social media presence. Manage multiple team member profiles efficiently.",
      icon: FaUsers,
      gradient: "from-indigo-500 to-purple-500",
      examples: [
        "Team profiles",
        "Brand consistency",
        "Social media management",
      ],
    },
    {
      title: "Freelancers",
      desc: "Consolidate your work samples, client testimonials, and contact information in one professional link.",
      icon: FaRocket,
      gradient: "from-pink-500 to-rose-500",
      examples: [
        "Client proposals",
        "Portfolio sharing",
        "Service showcases",
      ],
    },
  ];

  const howItWorksSteps = [
    {
      step: "1",
      title: "Create an Account",
      desc: "Sign up using your email and create an account on LinkBridger.",
      icon: FaRocket,
    },
    {
      step: "2",
      title: "Choose a Username",
      desc: "Pick a username that's easy to remember (e.g., dpkrn). Your link will follow this format: https://clickly.cv/your-username/instagram.",
      icon: FaLink,
    },
    {
      step: "3",
      title: "Verify Your Account",
      desc: "Complete email verification to activate your account.",
      icon: FaCheckCircle,
    },
    {
      step: "4",
      title: "Create a New Link",
      desc: "Enter the platform name (e.g., Instagram, LinkedIn) in lowercase. Paste your profile URL in the 'Destination URL' field. Click 'Create Link' to generate your personalized link.",
      icon: FaCog,
    },
    {
      step: "5",
      title: "Share the Link",
      desc: "Copy and share your smart link across various platforms. Share your hub link (https://clickly.cv/yourname) to let visitors see all your profiles in one place.",
      icon: FaSyncAlt,
    },
    {
      step: "6",
      title: "Get Real-Time Notifications",
      desc: "Receive instant email notifications every time someone visits your links. Stay informed about engagement and track who's viewing your profiles in real-time.",
      icon: FaEnvelope,
    },
  ];


  const platforms = [
    { name: "LinkedIn", icon: <SiLinkedin />, color: "text-blue-600" },
    { name: "GitHub", icon: <SiGithub />, color: "text-gray-800 dark:text-gray-200" },
    { name: "Instagram", icon: <SiInstagram />, color: "text-pink-600" },
    { name: "Facebook", icon: <SiFacebook />, color: "text-blue-700" },
    { name: "LeetCode", icon: <SiLeetcode />, color: "text-orange-600" },
    { name: "YouTube", icon: <SiYoutube />, color: "text-red-600" },
    { name: "Twitter", icon: <SiX />, color: "text-blue-400" },
  ];

  const stats = [
    { value: 10000, suffix: "+", label: "Active Users", icon: <FaUsers /> },
    { value: 50000, suffix: "+", label: "Links Created", icon: <FaLink /> },
    { value: 1000000, suffix: "+", label: "Clicks Tracked", icon: <FaChartLine /> },
    { value: 99, suffix: "%", label: "Uptime", icon: <FaClock /> },
  ];

  return (
    <div className="min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
      {/* Navigation Header for Non-Authenticated Users */}
      {!isAuthenticated && location.pathname === '/' && (
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-lg"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <motion.div
                whileHover={{ scale: 1.05, rotateY: 5 }}
                className="flex items-center gap-3 cursor-pointer relative"
                onClick={() => navigate('/')}
                style={{ transformStyle: "preserve-3d" }}
              >
                <motion.div
                  animate={{
                    rotateY: [0, 360],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{ transformStyle: "preserve-3d" }}
                  className="h-10 w-10 rounded-full overflow-hidden"
                >
                  <img
                    className="h-10 w-10 rounded-full object-contain bg-white/10 dark:bg-gray-800/20 p-1 transition-all duration-300"
                    src={logo}
                    alt="LinkBridger Logo"
                    onError={(e) => {
                      e.target.src = 'https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500';
                    }}
                  />
                </motion.div>
                <span className="hidden sm:inline text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-600 dark:to-pink-600 bg-clip-text text-transparent">
                  LinkBridger
                </span>
              </motion.div>
              
              <div className="flex items-center gap-2 sm:gap-4">
                {/* Dark Mode Toggle */}
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1, rotate: 15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => dispatch(toggleDarkMode())}
                  className="relative rounded-lg bg-white/90 dark:bg-gray-800/50 backdrop-blur-sm p-2.5 text-gray-800 dark:text-gray-300 hover:text-purple-600 dark:hover:text-yellow-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 hover:bg-white dark:hover:bg-gray-700/50 border border-gray-300 dark:border-gray-700/50 shadow-md"
                  aria-label="Toggle dark mode"
                  title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {darkMode ? (
                    <MdLightMode className="h-5 w-5 text-yellow-300" />
                  ) : (
                    <MdDarkMode className="h-5 w-5 text-gray-800" />
                  )}
                </motion.button>
                
                {/* <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/doc')}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base text-gray-800 dark:text-gray-300 font-medium hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  Docs
                </motion.button> */}
                <Doc/>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/login')}
                  className="px-4 py-1.5 sm:px-6 sm:py-2 text-sm sm:text-base bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
                >
                  Get Started
                </motion.button>
              </div>
            </div>
          </div>
        </motion.nav>
      )}

      {/* Hero Section */}
      <HeroSection
        words={words}
        flipWords={flipWords}
        description="LinkBridger transforms your social media presence with memorable, personalized URLs."
        highlightText="One link to rule them all. Update once, reflect everywhere."
        ctaText="Get Started Free"
        secondaryCtaText="Learn More"
        platforms={platforms}
        mousePosition={mousePosition}
        isAuthenticated={isAuthenticated}
      />

      {/* Have You Ever Wondered Section - Redesigned with Perfect Alignment */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="container mx-auto max-w-3xl">
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-3 sm:mb-4 md:mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
          >
            Have You Ever Wondered How Link Has Been Personalized:
          </motion.h2>

          <MagneticCard intensity={0.15}>
            <motion.div
              className="relative bg-gradient-to-br from-slate-800/95 via-slate-700/95 to-slate-800/95 dark:from-slate-900/95 dark:via-slate-800/95 dark:to-slate-900/95 backdrop-blur-xl rounded-xl md:rounded-2xl shadow-2xl border border-purple-500/20 dark:border-purple-400/20 p-4 md:p-5 lg:p-6 overflow-hidden"
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              {/* Animated Background Glow */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Floating Particles */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-purple-400/40"
                  style={{
                    left: `${10 + (i * 7)}%`,
                    top: `${15 + (i % 4) * 25}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    x: [0, Math.sin(i) * 10, 0],
                    opacity: [0.2, 0.6, 0.2],
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: 3 + i * 0.2,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeInOut",
                  }}
                />
              ))}

              <div className="relative z-10">
                {/* Base URL Display - Shown Once */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="mb-4 pb-3 border-b border-purple-500/30 dark:border-purple-400/30"
                >
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-1.5 font-semibold uppercase tracking-wider">
                    Base URL (Same for All):
                  </p>
                  <motion.div
                    className="flex items-center gap-2 flex-wrap"
                    animate={{
                      x: [0, 5, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <motion.a
                      href="https://clickly.cv/dpkrn/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs md:text-sm lg:text-base font-mono font-bold text-purple-300 dark:text-purple-200 bg-purple-500/20 dark:bg-purple-500/30 px-2 py-1 rounded-lg border border-purple-400/30 hover:bg-purple-500/30 dark:hover:bg-purple-500/40 hover:border-purple-400/50 transition-all duration-300 inline-block"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      https://clickly.cv/dpkrn/
                    </motion.a>
                    <span className="text-xs md:text-sm text-gray-400 dark:text-gray-500 italic">
                      (accessible for all generated link at one place)
                    </span>
                    <motion.span
                      className="text-lg"
                      animate={{
                        opacity: [0.5, 1, 0.5],
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      ⬇️
                    </motion.span>
                  </motion.div>
                </motion.div>

                {/* Links List - Perfectly Aligned */}
                <div className="space-y-1.5 md:space-y-2">
                  {[
                    { platform: "LinkedIn", url: "https://clickly.cv/dpkrn/linkedin", color: "from-blue-500 to-cyan-500" },
                    { platform: "GitHub", url: "https://clickly.cv/dpkrn/github", color: "from-gray-400 to-gray-600" },
                    { platform: "LeetCode", url: "https://clickly.cv/dpkrn/leetcode", color: "from-orange-500 to-yellow-500" },
                    { platform: "Portfolio", url: "https://clickly.cv/dpkrn/portfolio", color: "from-purple-500 to-pink-500" },
                    { platform: "Instagram", url: "https://clickly.cv/dpkrn/instagram", color: "from-pink-500 to-rose-500" },
                    { platform: "Facebook", url: "https://clickly.cv/dpkrn/facebook", color: "from-blue-600 to-blue-700" },
                    { platform: "Codeforces", url: "https://clickly.cv/dpkrn/codeforces", color: "from-red-500 to-orange-500" },
                  ].map((link, idx) => (
                    <motion.div
                      key={link.platform}
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ 
                        delay: 0.3 + idx * 0.1,
                        type: "spring",
                        stiffness: 100,
                        damping: 15
                      }}
                      whileHover={{ 
                        x: 10,
                        scale: 1.02,
                      }}
                      className="group relative"
                    >
                      {/* Hover Glow Effect */}
                      <motion.div
                        className={`absolute -inset-1 bg-gradient-to-r ${link.color} opacity-0 group-hover:opacity-20 blur-md rounded-lg transition-opacity duration-300`}
                      />
                      
                      <div className="relative flex items-center gap-2 p-2 bg-slate-700/50 dark:bg-slate-800/50 rounded-lg border border-slate-600/50 dark:border-slate-700/50 backdrop-blur-sm group-hover:border-purple-400/50 transition-all duration-300">
                        {/* Platform Label */}
                        <motion.div
                          className="flex-shrink-0 w-20 md:w-24"
                          whileHover={{ scale: 1.1 }}
                        >
                          <span className="text-xs md:text-sm font-semibold text-gray-300 dark:text-gray-400">
                            {link.platform}:
                          </span>
                        </motion.div>

                        {/* Complete URL - No Space */}
                        <div className="flex items-center font-mono">
                          {/* Base URL - Static */}
                          <span className="text-xs md:text-sm lg:text-base text-gray-400 dark:text-gray-500 select-all">
                            https://clickly.cv/dpkrn/
                          </span>
                          {/* Platform Name - Animated (no space before) */}
                          <motion.a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-xs md:text-sm lg:text-base font-bold bg-gradient-to-r ${link.color} bg-clip-text text-transparent hover:scale-110 transition-transform duration-300 inline-block`}
                            whileHover={{ 
                              scale: 1.15,
                            }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {link.platform.toLowerCase()}
                          </motion.a>
                        </div>

                        {/* Animated Arrow */}
                        <motion.div
                          className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                          animate={{
                            x: [0, 5, 0],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          <span className="text-purple-400">→</span>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Bottom CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                  className="mt-5 pt-4 border-t border-purple-500/30 dark:border-purple-400/30"
                >
                  <motion.div
                    className="flex flex-col items-center justify-center gap-2"
                    animate={{
                      scale: [1, 1.02, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                   
                    <motion.div
                      className="flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.05 }}
                    >
                      <motion.span
                        className="text-lg"
                        animate={{
                          rotate: [0, 360],
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        ✨
                      </motion.span>
                      <motion.a
                        href="/login"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate('/login');
                        }}
                        className="text-center text-sm md:text-base text-purple-300 dark:text-purple-200 font-bold hover:text-purple-200 dark:hover:text-purple-100 transition-colors underline decoration-2 underline-offset-3 decoration-purple-400/50 hover:decoration-purple-400"
                        whileHover={{ 
                          scale: 1.1,
                          x: 5,
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        You can create your own links: click here to start
                      </motion.a>
                      <motion.span
                        className="text-lg"
                        animate={{
                          rotate: [360, 0],
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        ✨
                      </motion.span>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </MagneticCard>
        </div>
      </motion.section>

      {/* Only the platform name changes Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="container mx-auto">
          <MagneticCard intensity={0.1}>
            <motion.div
              className="relative bg-gradient-to-br from-purple-900/40 via-pink-900/40 to-blue-900/40 dark:from-purple-950/60 dark:via-pink-950/60 dark:to-blue-950/60 backdrop-blur-xl rounded-xl sm:rounded-2xl md:rounded-3xl shadow-2xl border border-purple-500/30 dark:border-purple-400/20 p-4 sm:p-5 md:p-6 lg:p-8 overflow-hidden"
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative z-10 text-center">
                <motion.div
                  className="flex items-center justify-center gap-2 mb-3 sm:mb-4"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <motion.span
                    className="text-2xl md:text-3xl"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    ✨
                  </motion.span>
                  <motion.h3
                    className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 dark:from-purple-200 dark:via-pink-200 dark:to-blue-200 bg-clip-text text-transparent"
                    animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    style={{ backgroundSize: "200% 100%" }}
                  >
                    Only the platform name changes
                  </motion.h3>
                  <motion.span
                    className="text-2xl md:text-3xl"
                    animate={{ rotate: [360, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    ✨
                  </motion.span>
                </motion.div>
                <motion.p
                  className="text-base md:text-lg text-gray-200 dark:text-gray-300 font-medium"
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  All else remains the same
                </motion.p>
              </div>
            </motion.div>
          </MagneticCard>
        </div>
      </motion.section>

      {/* It will provide a special link Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-black/5 dark:bg-black/20"
      >
        <div className="container mx-auto">
          <MagneticCard intensity={0.1}>
            <motion.div
              className="relative bg-black dark:bg-black backdrop-blur-xl rounded-xl sm:rounded-2xl md:rounded-3xl shadow-2xl border border-gray-900 dark:border-gray-800 p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10 overflow-hidden"
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative z-10 space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="text-center"
                >
                  <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-400 via-violet-200 to-pink-500 dark:from-purple-300 dark:via-violet-100 dark:to-pink-400 py-2 md:py-4">
                    <span className="uppercase text-sm md:text-base lg:text-xl font-bold block">
                      It will provide a special link for all your platforms.
                    </span>
                  </div>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-base md:text-lg lg:text-2xl xl:text-3xl text-center"
                >
                  <a
                    href="https://clickly.cv/dpkrn/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 dark:text-blue-300 underline font-mono hover:text-blue-300 dark:hover:text-blue-200 transition-colors break-all md:break-normal"
                  >
                    https://clickly.cv/dpkrn
                  </a>
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="text-center"
                >
                  <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-400 via-violet-200 to-pink-500 dark:from-purple-300 dark:via-violet-100 dark:to-pink-400 py-2 md:py-4">
                    <span className="uppercase text-sm md:text-base lg:text-xl font-bold block">
                      Change only the platform name to redirect to all profiles
                    </span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="text-base md:text-lg lg:text-2xl xl:text-3xl text-center"
                >
                  <a
                    href="https://clickly.cv/dpkrn/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 dark:text-blue-300 underline font-mono hover:text-blue-300 dark:hover:text-blue-200 transition-colors break-all md:break-normal"
                  >
                    https://clickly.cv/dpkrn/
                    <FlipWords
                      className="text-blue-400 dark:text-blue-300"
                      words={platformsForFlip}
                    />
                  </a>
                </motion.div>
              </div>
            </motion.div>
          </MagneticCard>
        </div>
      </motion.section>

      {/* Use Cases Section - Title changed to "Perfect for Everyone" */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="container mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-5 md:mb-6 lg:mb-8 text-center bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
          >
            Perfect for Everyone
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
            {useCases.map((useCase, idx) => {
              const IconComponent = useCase.icon;
              return (
                <motion.div
                  key={useCase.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-6 md:p-8 relative overflow-hidden group"
                >
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-r ${useCase.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                  />
                  <div className="relative z-10">
                    <motion.div
                      className={`bg-gradient-to-r ${useCase.gradient} p-3 sm:p-4 rounded-xl w-fit mb-3 sm:mb-4`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <IconComponent className="text-2xl sm:text-3xl text-white" />
                    </motion.div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
                      {useCase.title}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-400 leading-relaxed mb-3 sm:mb-4">
                      {useCase.desc}
                    </p>
                    <div className="space-y-2">
                      {useCase.examples.map((example, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-400"
                        >
                          <FaCheckCircle className="text-green-600 dark:text-green-400 text-xs" />
                          <span>{example}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

    
       <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="pt-8 sm:pt-12 md:pt-16 lg:pt-20 pb-2 sm:pb-4 md:pb-6 lg:pb-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50/80 via-purple-50/80 to-pink-50/80 dark:from-slate-900/60 dark:via-purple-950/40 dark:to-pink-950/40"
      >
         <ComparisonTable/> 
      </motion.section>

      {/* How It Works Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="pt-2 sm:pt-4 md:pt-6 lg:pt-8 pb-8 sm:pb-12 md:pb-16 lg:pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50/80 via-purple-50/80 to-pink-50/80 dark:from-slate-900/60 dark:via-purple-950/40 dark:to-pink-950/40"
      >
        <div className="container mx-auto">
          <motion.div
            className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-6 md:p-10 lg:p-12"
            whileHover={{ scale: 1.01 }}
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
            >
              How It Works
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-base md:text-lg lg:text-xl leading-8 text-gray-700 dark:text-gray-300 mb-3 sm:mb-4 md:mb-6"
            >
              The core idea behind{" "}
              <b className="text-gray-900 dark:text-white">LinkBridger</b> is
              to simplify the management of social media links. Instead of
              sharing long, hard-to-remember URLs, you create a single,
              personalized URL that automatically redirects users to the
              correct platform. Access all your links at one place by visiting{" "}
              <b className="text-gray-900 dark:text-white">
                https://clickly.cv/yourname
              </b>{" "}
              (without any platform name). Plus, get real-time email
              notifications every time someone visits your links!
            </motion.p>

            <div className="space-y-4 sm:space-y-5 md:space-y-6">
              {howItWorksSteps.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 md:p-6 bg-white/5 dark:bg-gray-800/30 rounded-xl sm:rounded-2xl border border-white/10 hover:border-white/20 transition-all group"
                  >
                    <motion.div
                      className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 sm:p-4 rounded-xl flex-shrink-0"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <IconComponent className="text-xl sm:text-2xl text-white" />
                    </motion.div>
                    <div className="flex-1">
                      <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1.5 sm:mb-2">
                        {item.step}. {item.title}
                      </h4>
                      <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="mt-4 sm:mt-6 md:mt-8 p-4 sm:p-5 md:p-6 bg-white/5 dark:bg-gray-800/30 rounded-xl sm:rounded-2xl border border-white/10"
            >
              <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                Example:
              </p>
              <div className="space-y-2">
                <motion.a
                  href="https://clickly.cv/dpkrn/instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="block text-blue-400 hover:text-blue-300 underline font-mono text-base md:text-lg"
                >
                  Instagram: https://clickly.cv/dpkrn/instagram
                </motion.a>
                <motion.a
                  href="https://clickly.cv/dpkrn/leetcode"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="block text-blue-400 hover:text-blue-300 underline font-mono text-base md:text-lg"
                >
                  LeetCode: https://clickly.cv/dpkrn/leetcode
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Statistics Section */}
      <StatisticsSection
        stats={stats}
        title="Trusted by Thousands"
        subtitle="Join the community of professionals, creators, and developers"
        sectionRef={statsRef}
      />

      {/* Final CTA Section */}
      <CTASection
        title="Ready to Transform Your Links?"
        subtitle="Join thousands of professionals who trust LinkBridger to manage their social presence"
        ctaText="Get Started Now"
      />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;

