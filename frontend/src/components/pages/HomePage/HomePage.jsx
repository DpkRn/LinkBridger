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
  FaShieldAlt, 
  FaInfinity,
  FaUsers,
  FaGlobe,
  FaClock,
  FaStar,
  FaEnvelope,
  FaHome,
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
  CTASection
} from './sections';

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(store => store.admin.isAuthenticated);
  const darkMode = useSelector(store => store.page.darkMode);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const statsRef = useRef(null);
  const featuresRef = useRef(null);
  const benefitsRef = useRef(null);
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

  const features = [
    {
      icon: <FaLink className="w-8 h-8" />,
      title: "Personalized Links",
      description: "Create memorable URLs like clickly.cv/yourname/linkedin that reflect your brand",
      color: "from-blue-500 to-cyan-500",
      delay: 0.1
    },
    {
      icon: <FaHome className="w-8 h-8" />,
      title: "All Links at One Place",
      description: "Access all your profiles with a single hub link. Visit clickly.cv/yourname to see all your links in one beautiful page",
      color: "from-violet-500 to-purple-500",
      delay: 0.15
    },
    {
      icon: <FaSyncAlt className="w-8 h-8" />,
      title: "Centralized Management",
      description: "Update once, reflect everywhere. Change your destination URL and all shared links update automatically",
      color: "from-purple-500 to-pink-500",
      delay: 0.2
    },
    {
      icon: <FaEnvelope className="w-8 h-8" />,
      title: "Real-Time Email Notifications",
      description: "Get instant email notifications based on your preferences. Customize notifications for link visits, profile views, and weekly reports. Control what you want to be notified about through your settings. Stay informed about engagement on your terms",
      color: "from-cyan-500 to-blue-500",
      delay: 0.25
    },
    {
      icon: <FaChartLine className="w-8 h-8" />,
      title: "Click Analytics",
      description: "Track engagement with real-time analytics. Know which platforms drive the most traffic",
      color: "from-green-500 to-emerald-500",
      delay: 0.3
    },
    {
      icon: <FaShieldAlt className="w-8 h-8" />,
      title: "Privacy First",
      description: "Control who sees what with granular content permissions. Protect links with passwords, set visibility preferences (public/unlisted/private), and customize what appears in your profile. No tracking scripts, no third-party analytics. Your data stays yours",
      color: "from-orange-500 to-red-500",
      delay: 0.4
    },
    {
      icon: <FaInfinity className="w-8 h-8" />,
      title: "Never Expires",
      description: "Your links work forever. No expiration dates, no premium plans, no limits",
      color: "from-indigo-500 to-purple-500",
      delay: 0.5
    },
    {
      icon: <FaRocket className="w-8 h-8" />,
      title: "Easy Setup",
      description: "Get started in minutes. Just choose a username and start creating your personalized links",
      color: "from-pink-500 to-rose-500",
      delay: 0.6
    },
  ];

  const benefits = [
    {
      title: "For Professionals",
      points: [
        "Build your brand with consistent, memorable links",
        "Professional appearance on resumes and business cards",
        "Save time with centralized link management",
        "Track engagement to optimize networking strategy"
      ],
      icon: <FaUsers className="w-12 h-12" />,
      gradient: "from-blue-600 to-cyan-600"
    },
    {
      title: "For Content Creators",
      points: [
        "Easy sharing across all platforms",
        "Audience insights through click tracking",
        "Flexibility to add any platform",
        "Cross-platform promotion made simple"
      ],
      icon: <FaStar className="w-12 h-12" />,
      gradient: "from-purple-600 to-pink-600"
    },
    {
      title: "For Developers",
      points: [
        "Open source and fully customizable",
        "API access for integration",
        "Self-hostable solution",
        "Contribute to the community"
      ],
      icon: <FaGlobe className="w-12 h-12" />,
      gradient: "from-green-600 to-emerald-600"
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
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/doc')}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base text-gray-800 dark:text-gray-300 font-medium hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  Docs
                </motion.button>
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

      {/* Statistics Section */}
      <StatisticsSection
        stats={stats}
        title="Trusted by Thousands"
        subtitle="Join the community of professionals, creators, and developers"
        sectionRef={statsRef}
      />

      {/* Features Section */}
      <FeaturesSection
        features={features}
        title="Powerful Features"
        subtitle="Everything you need to manage your social presence in one place"
        sectionRef={featuresRef}
      />

      {/* Benefits Section */}
      <BenefitsSection
        benefits={benefits}
        title="Perfect for Everyone"
        subtitle="Whether you're a professional, creator, or developer"
        sectionRef={benefitsRef}
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

