import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleDarkMode } from '../../redux/pageSlice';
import { TypewriterEffect, TypewriterEffectSmooth } from '../ui/typewriter-effect';
import { FlipWords } from '../ui/flip-words';
import { BackgroundBeamsWithCollision } from '../ui/background-beams-with-collision';
import { 
  FaRocket, 
  FaLink, 
  FaChartLine, 
  FaSyncAlt, 
  FaShieldAlt, 
  FaInfinity,
  FaArrowRight,
  FaCheckCircle,
  FaUsers,
  FaGlobe,
  FaClock,
  FaStar,
  FaEnvelope,
  FaHome
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

// AnimatedCounter component moved outside to prevent recreation on every parent re-render
const AnimatedCounter = ({ end, duration = 2000, suffix = "", statsInView }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const animationFrameRef = useRef(null);
  const isMountedRef = useRef(true);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    // Reset animation state when end or duration changes
    if (hasAnimatedRef.current) {
      setCount(0);
      hasAnimatedRef.current = false;
      // Cancel any pending animation
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }

    // Only start animation if element is in view
    if (!statsInView) return;
    
    isMountedRef.current = true;
    hasAnimatedRef.current = true;

    let startTime = null;
    const animate = (currentTime) => {
      if (!isMountedRef.current) {
        // Component unmounted, stop animation
        return;
      }
      
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      if (isMountedRef.current) {
        setCount(Math.floor(easeOutQuart * end));
      }
      
      if (progress < 1 && isMountedRef.current) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        animationFrameRef.current = null;
      }
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      isMountedRef.current = false;
      // Cancel any pending animation frame
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [statsInView, end, duration]);

  return <span ref={countRef}>{count}{suffix}</span>;
};

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(store => store.admin.isAuthenticated);
  const darkMode = useSelector(store => store.page.darkMode);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const featuresRef = useRef(null);
  const benefitsRef = useRef(null);
  // Ref to store latest mouse position, avoiding stale closure values in RAF callback
  const latestMousePositionRef = useRef({ x: 0, y: 0 });
  
  const statsInView = useInView(statsRef, { once: true, margin: "-100px" });
  const featuresInView = useInView(featuresRef, { once: true, margin: "-100px" });
  const benefitsInView = useInView(benefitsRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

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
      description: "Get instant email notifications for every visit to your links. Stay informed about who's checking out your profiles in real-time",
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
      description: "No tracking scripts, no third-party analytics. Your data stays yours",
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
    <div className="min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-purple-950 dark:to-gray-950">
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
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => navigate('/')}
              >
                <img
                  className="h-10 w-auto transition-all duration-300"
                  src="logo.png"
                  alt="LinkBridger Logo"
                  onError={(e) => {
                    e.target.src = 'https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500';
                  }}
                />
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
      <motion.section
        ref={heroRef}
        style={{ opacity, scale }}
        className={`relative min-h-screen flex items-center justify-center overflow-hidden ${!isAuthenticated ? 'pt-16' : ''}`}
      >
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/60 via-pink-50/60 to-blue-50/60 dark:from-purple-500/20 dark:via-pink-500/20 dark:to-blue-500/20" />
          <motion.div
            className="absolute inset-0"
            animate={{
              backgroundPosition: [
                `${mousePosition.x}% ${mousePosition.y}%`,
                `${Math.min(mousePosition.x * 1.1, 100)}% ${Math.min(mousePosition.y * 1.1, 100)}%`,
              ],
            }}
            transition={{ duration: 0.5 }}
            style={{
              backgroundImage: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(147, 51, 234, 0.08), transparent 50%)`,
            }}
          />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-8">
            {/* Main Heading with Typewriter */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <TypewriterEffect words={words} className="mb-6" />
            </motion.div>

            {/* Subheading with Flip Words */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-2xl md:text-4xl font-semibold text-gray-800 dark:text-gray-300 mb-4"
            >
              Create personalized links for your{' '}
              <span className="inline-block">
                <FlipWords words={flipWords} duration={2000} className="text-3xl md:text-5xl font-bold" />
              </span>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed"
            >
              LinkBridger transforms your social media presence with memorable, personalized URLs.
              <br />
              <span className="font-semibold text-purple-600 dark:text-purple-400">
                One link to rule them all. Update once, reflect everywhere.
              </span>
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login')}
                className="group relative px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-base sm:text-lg rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 overflow-hidden w-full sm:w-auto"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Get Started Free
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/doc')}
                className="px-6 py-3 sm:px-8 sm:py-4 bg-white dark:bg-gray-800 backdrop-blur-sm text-gray-800 dark:text-gray-200 font-bold text-base sm:text-lg rounded-full shadow-xl border-2 border-purple-600 dark:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300 w-full sm:w-auto"
              >
                Learn More
              </motion.button>
            </motion.div>

            {/* Platform Icons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="mt-16"
            >
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Works with all platforms</p>
              <div className="flex flex-wrap justify-center gap-6">
                {platforms.map((platform, index) => (
                  <motion.div
                    key={platform.name}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 + index * 0.1, type: "spring", stiffness: 200 }}
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    className={`text-4xl ${platform.color} cursor-pointer hover:drop-shadow-lg transition-all`}
                  >
                    {platform.icon}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, repeat: Infinity, repeatType: "reverse", duration: 2 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-purple-600 dark:border-purple-400 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-3 bg-purple-600 dark:bg-purple-400 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Statistics Section */}
      <section ref={statsRef} className="py-20 bg-gradient-to-br from-purple-50/80 via-pink-50/80 to-blue-50/80 dark:bg-transparent backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-200 mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Join the community of professionals, creators, and developers
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white/90 dark:bg-gray-900/50 backdrop-blur-xl border border-purple-200/60 dark:border-gray-700/50 shadow-lg hover:shadow-xl hover:border-purple-300/80 transition-all"
              >
                <div className="text-3xl md:text-4xl mb-2 text-purple-600 dark:text-purple-400 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                  {statsInView ? (
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} statsInView={statsInView} />
                  ) : (
                    `0${stat.suffix}`
                  )}
                </div>
                <div className="text-sm md:text-base text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 bg-gradient-to-br from-blue-50/80 via-purple-50/80 to-pink-50/80 dark:bg-transparent backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-200 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need to manage your social presence in one place
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: feature.delay }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative p-6 sm:p-8 rounded-xl sm:rounded-2xl bg-white/90 dark:bg-gray-900/50 backdrop-blur-xl border border-purple-200/60 dark:border-gray-700/50 hover:border-purple-400 dark:hover:border-purple-400 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                <div className={`relative text-5xl mb-4 bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section ref={benefitsRef} className="py-20 bg-white/80 dark:bg-transparent backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-200 mb-4">
              Perfect for Everyone
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Whether you're a professional, creator, or developer
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className={`relative p-6 sm:p-8 rounded-xl sm:rounded-2xl bg-gradient-to-br ${benefit.gradient} text-white shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                <div className="relative z-10">
                  <div className="text-5xl mb-4">{benefit.icon}</div>
                  <h3 className="text-2xl font-bold mb-6">{benefit.title}</h3>
                  <ul className="space-y-3">
                    {benefit.points.map((point, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.2 + idx * 0.1 }}
                        className="flex items-start gap-2"
                      >
                        <FaCheckCircle className="w-5 h-5 mt-1 flex-shrink-0" />
                        <span className="text-white/90">{point}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
              Ready to Transform Your Links?
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-6 sm:mb-10 max-w-2xl mx-auto px-4">
              Join thousands of professionals who trust LinkBridger to manage their social presence
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="px-6 py-3 sm:px-10 sm:py-5 bg-white text-purple-600 font-bold text-base sm:text-lg md:text-xl rounded-full shadow-2xl hover:shadow-white/50 transition-all duration-300 flex items-center justify-center gap-3 mx-auto"
            >
              Get Started Now
              <FaArrowRight />
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
