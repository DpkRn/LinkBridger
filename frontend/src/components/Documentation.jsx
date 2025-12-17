import React, { useState, useRef, useEffect } from "react";
import { useInView } from "framer-motion";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { TypewriterEffect } from "./ui/typewriter-effect";
import {
  TextRevealCard,
  TextRevealCardDescription,
  TextRevealCardTitle,
} from "./ui/text-reveal-card";
import { FlipWords } from "./ui/flip-words";
import { BackgroundBeamsWithCollision } from "./ui/background-beams-with-collision";
import { ContainerScroll } from "./ui/container-scroll-animation";
import Footer from "./footer/Footer";
import { 
  FaRocket, 
  FaLink, 
  FaChartLine, 
  FaSyncAlt, 
  FaCog, 
  FaChevronDown,
  FaChevronUp,
  FaStar,
  FaArrowRight,
  FaCheckCircle,
  FaLightbulb,
  FaShieldAlt,
  FaClock,
  FaPalette,
  FaBriefcase,
  FaUserTie,
  FaCode,
  FaGraduationCap,
  FaUsers,
  FaLock,
  FaEye,
  FaServer,
  FaExclamationTriangle,
  FaQuestionCircle,
  FaCheck,
  FaTimes,
  FaHome,
  FaEnvelope
} from "react-icons/fa";

const Documentation = () => {
  const navigate = useNavigate();
  const sidebarMenu = useSelector((store) => store.page.sidebarMenu);
  const location = useLocation();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [openFAQ, setOpenFAQ] = useState([false, false, false]);
  const [openFeature, setOpenFeature] = useState(null);
  const [hoveredFeature, setHoveredFeature] = useState(null);

  // Mouse tracking for interactive background
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleGetStarted = () => {
    navigate("/login");
  };

  const toggleFAQ = (idx) => {
    setOpenFAQ((prev) => prev.map((v, i) => (i === idx ? !v : v)));
  };

  const words = [
    {
      text: "LinkBridger : ",
      className: "text-blue-500 dark:text-blue-400 text-4xl font-bold",
    },
    {
      text: "Personalized",
      className: "text-4xl font-bold text-black dark:text-gray-200",
    },
    {
      text: "Social ",
      className: "text-4xl font-bold text-black dark:text-gray-200",
    },
    {
      text: "Profile ",
      className: "text-4xl font-bold text-black dark:text-gray-200",
    },
    {
      text: "Link ",
      className: "text-4xl font-bold text-black dark:text-gray-200",
    },
    {
      text: "Manager.",
      className: "text-4xl font-bold text-black dark:text-gray-200",
    },
  ];

  const plateforms = [
    "linkedin",
    "github",
    "leetcode",
    "portfolio",
    "instagram",
    "facebook",
    "codeforce",
  ];

  const features = [
    {
      img: "easy-to-remember.webp",
      title: "Personalized Smart Links",
      desc: "Generate easy-to-remember links for your social profiles using your username and platform names.",
      icon: FaLink,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      img: "logo.png",
      title: "All Links at One Place",
      desc: "Access all your profiles with a single hub link. Simply visit https://clickly.cv/yourname (without any platform name) to see all your links in one beautiful, organized page. Perfect for sharing in bios, resumes, and business cards.",
      icon: FaHome,
      gradient: "from-violet-500 to-purple-500",
    },
    {
      img: "update.webp",
      title: "Centralized Link Management",
      desc: "Update your social profile links in one place, and the change reflects everywhere.",
      icon: FaSyncAlt,
      gradient: "from-green-500 to-emerald-500",
    },
    {
      img: "click.webp",
      title: "Real-Time Email Notifications",
      desc: "Get instant email notifications every time someone visits your links. Stay informed about who's checking out your profiles in real-time. Perfect for tracking engagement and knowing when potential clients or employers view your links.",
      icon: FaEnvelope,
      gradient: "from-cyan-500 to-blue-500",
    },
    {
      img: "click.webp",
      title: "Click Tracking",
      desc: "Keep track of how many times your social profile links are clicked.",
      icon: FaChartLine,
      gradient: "from-orange-500 to-red-500",
    },
    {
      img: "easysetup.webp",
      title: "Easy to Setup",
      desc: "No complicated setup; just choose your username, add the platform, and you're ready to go!",
      icon: FaCog,
      gradient: "from-indigo-500 to-purple-500",
    },
  ];

  const futureFeatures = [
    {
      title: "Advanced Analytics",
      desc: "See detailed reports on clicks, traffic sources, and engagement levels for each link.",
      icon: FaChartLine,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Custom Link Themes",
      desc: "Add custom themes or styles to your personalized links to match your branding or style preferences.",
      icon: FaPalette,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      title: "Link Expiration",
      desc: "Set expiration dates for temporary links, ensuring they are only accessible for a certain period.",
      icon: FaClock,
      gradient: "from-orange-500 to-red-500",
    },
    {
      title: "Link Password Protection",
      desc: "Add a layer of security by allowing password protection on sensitive links.",
      icon: FaShieldAlt,
      gradient: "from-green-500 to-emerald-500",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <div className="min-h-screen w-full overflow-hidden relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-gray-950 dark:via-purple-950 dark:to-gray-950">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <motion.div
          className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x * 0.5 - 200,
            y: mousePosition.y * 0.5 - 200,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x * 0.3 - 200,
            y: mousePosition.y * 0.3 - 200,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x * 0.7 - 200,
            y: mousePosition.y * 0.7 - 200,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
        />
        
        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>

      {/* Header */}
      {location.pathname === "/" && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative z-50 min-w-screen h-[70px] shadow-lg bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl text-right flex items-center justify-between border-b border-white/10 transition-colors duration-300"
        >
          <motion.img
            className="h-8 w-auto ml-10 sm:ml-20 dark:brightness-0 dark:invert transition-all duration-300"
            src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500"
            alt="LinkBridger Logo"
            whileHover={{ scale: 1.1 }}
          />
          <motion.button
            onClick={handleGetStarted}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white font-semibold py-2.5 px-6 rounded-xl text-md sm:text-lg transition-all mr-10 sm:mr-20 shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            Get Started <FaArrowRight />
          </motion.button>
        </motion.div>
      )}

      <div className="relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="p-4 sm:p-6 md:p-10 lg:p-12"
        >
          {/* Hero Section */}
          <motion.section variants={itemVariants} className="mb-12 md:mb-16 text-center">
            <div className="mb-8">
              <TypewriterEffect words={words} className="mb-6" />
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <TextRevealCard
                className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 mb-8 transition-colors duration-300"
                text="Generate Links You'll Never Forget."
                revealText="Turn Usernames into Smart Links - Quick and Simple!"
              />
            </motion.div>
          </motion.section>

          {/* Introduction Section */}
          <motion.section
            variants={itemVariants}
            className="mb-12 md:mb-16"
          >
            <motion.div
              className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-6 md:p-10 lg:p-12"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
            >
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
              >
                Introduction
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-base md:text-lg lg:text-xl leading-8 text-gray-200 dark:text-gray-300"
              >
                Welcome to <b className="text-white dark:text-gray-100">LinkBridger</b>, a tool designed to make your social
                media links easier to remember and manage. Whether you're sharing
                your Instagram, GitHub, or LinkedIn profile, LinkBridger allows you
                to generate personalized URLs that are simple and customizable. Access all your links at one place by visiting <b className="text-white">https://clickly.cv/yourname</b> (without any platform name) - it creates a beautiful landing page showing all your profiles. Plus, get real-time email notifications every time someone visits your links! It
                also tracks how often your links are clicked and allows centralized
                updating, so any changes you make will reflect across all platforms
                instantly.
              </motion.p>
            </motion.div>
          </motion.section>

          {/* Example Links Section */}
          <motion.section variants={itemVariants} className="mb-12 md:mb-16">
            <ContainerScroll
              titleComponent={
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-3xl md:text-4xl lg:text-5xl font-bold text-white dark:text-gray-200 text-center"
                >
                  Have You Ever Wondered How AuthorLink Has Been Personalized:
                </motion.p>
              }
            >
              <div className="mx-auto rounded-2xl h-full flex justify-center items-center bg-gradient-to-br from-slate-800 to-slate-900 dark:from-gray-800 dark:to-gray-900 border border-white/10 p-6 md:p-8">
                <div className="md:mx-auto rounded-2xl h-full w-full space-y-3 md:space-y-4 flex flex-col justify-center md:items-center p-4">
                  {[
                    { platform: "LinkedIn", url: "https://clickly.cv/dpkrn/linkedin" },
                    { platform: "GitHub", url: "https://clickly.cv/dpkrn/github" },
                    { platform: "LeetCode", url: "https://clickly.cv/dpkrn/leetcode" },
                    { platform: "Portfolio", url: "https://clickly.cv/dpkrn/portfolio" },
                    { platform: "Instagram", url: "https://clickly.cv/dpkrn/instagram" },
                    { platform: "Facebook", url: "https://clickly.cv/dpkrn/facebook" },
                    { platform: "Codeforces", url: "https://clickly.cv/dpkrn/codeforces" },
                  ].map((link, idx) => (
                    <motion.a
                      key={link.platform}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ scale: 1.05, x: 10 }}
                      className="text-sm md:text-base lg:text-lg text-white hover:text-blue-400 transition-colors w-full text-left md:text-center group"
                    >
                      <span className="font-semibold">{link.platform}:</span>{" "}
                      <span className="text-blue-400 group-hover:text-blue-300 underline font-mono">
                        {link.url}
                      </span>
                    </motion.a>
                  ))}
                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7 }}
                    className="text-sm md:text-base text-gray-400 dark:text-gray-500 mt-4 text-center"
                  >
                    Only the platform name has been changed. All else remains the same.
                  </motion.p>
                </div>
              </div>
            </ContainerScroll>
          </motion.section>

          {/* Special Link Section */}
          <motion.section variants={itemVariants} className="mb-12 md:mb-16">
            <motion.div
              className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-6 md:p-10 overflow-hidden relative"
              whileHover={{ scale: 1.01 }}
            >
              <BackgroundBeamsWithCollision>
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative mx-auto w-max"
                  >
                    <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-400 via-violet-200 to-pink-500 dark:from-purple-300 dark:via-violet-100 dark:to-pink-400 py-4">
                      <span className="uppercase text-sm md:text-xl font-bold">
                        It will provide a special link for all your platforms.
                      </span>
                    </div>
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="text-lg md:text-2xl lg:text-3xl text-center"
                  >
                    <a
                      href="https://clickly.cv/dpkrn/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 dark:text-blue-300 underline font-mono hover:text-blue-300 transition-colors"
                    >
                      https://clickly.cv/dpkrn
                    </a>
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="relative mx-auto w-max"
                  >
                    <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-400 via-violet-200 to-pink-500 dark:from-purple-300 dark:via-violet-100 dark:to-pink-400 py-4">
                      <span className="uppercase text-sm md:text-xl font-bold">
                        Change only the platform name to redirect to all profiles
                      </span>
                    </div>
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="text-lg md:text-2xl lg:text-3xl text-center"
                  >
                    <a
                      href="https://clickly.cv/dpkrn/linkedin"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 dark:text-blue-300 underline font-mono hover:text-blue-300 transition-colors"
                    >
                      https://clickly.cv/dpkrn/
                      <FlipWords className="text-blue-400 dark:text-blue-300" words={plateforms} />
                    </a>
                  </motion.p>
                </div>
              </BackgroundBeamsWithCollision>
            </motion.div>
          </motion.section>

          {/* Get Started CTA */}
          <motion.section variants={itemVariants} className="mb-12 md:mb-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <motion.button
                onClick={handleGetStarted}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl text-lg md:text-xl transition-all shadow-lg hover:shadow-2xl flex items-center gap-3 mx-auto"
              >
                Get Started <FaRocket />
              </motion.button>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-gray-400 dark:text-gray-500 text-sm md:text-base"
              >
                Create an account and start managing your personalized links today!
              </motion.p>
            </motion.div>
          </motion.section>

          {/* Key Features Section */}
          <motion.section variants={itemVariants} className="mb-12 md:mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-12 text-center bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
            >
              Key Features
            </motion.h2>
            <div className="space-y-8 md:space-y-12">
              {features.map((feature, idx) => {
                const ref = useRef(null);
                const inView = useInView(ref, { once: true, margin: "-100px" });
                const IconComponent = feature.icon;
                const isLeft = idx % 2 === 0;

                return (
                  <motion.div
                    key={feature.title}
                    ref={ref}
                    initial={{ opacity: 0, x: isLeft ? -80 : 80 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.7, type: "spring" }}
                    onHoverStart={() => setHoveredFeature(idx)}
                    onHoverEnd={() => setHoveredFeature(null)}
                    className={`group relative bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-6 md:p-10 overflow-hidden ${
                      isLeft ? "" : "md:flex-row-reverse"
                    } flex flex-col md:flex-row items-center gap-6 md:gap-8 cursor-pointer transition-all duration-300 ${
                      hoveredFeature === idx ? "scale-105" : "scale-100"
                    }`}
                  >
                    {/* Gradient Background on Hover */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                    />
                    
                    {/* Icon */}
                    <motion.div
                      className={`relative bg-gradient-to-r ${feature.gradient} p-6 rounded-2xl shadow-lg`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <IconComponent className="text-4xl md:text-5xl text-white" />
                    </motion.div>

                    {/* Image */}
                    <motion.img
                      src={feature.img}
                      alt={feature.title}
                      className="h-48 w-48 md:h-64 md:w-64 rounded-2xl object-cover flex-shrink-0 shadow-lg"
                      whileHover={{ scale: 1.1, rotate: 2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    />

                    {/* Content */}
                    <div className="flex-1 text-center md:text-left">
                      <motion.h3
                        className={`text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}
                      >
                        {feature.title}
                      </motion.h3>
                      <motion.p className="text-base md:text-lg text-gray-300 dark:text-gray-400 leading-relaxed">
                        {feature.desc}
                      </motion.p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>

          {/* How It Works Section */}
          <motion.section variants={itemVariants} className="mb-12 md:mb-16">
            <motion.div
              className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-6 md:p-10 lg:p-12"
              whileHover={{ scale: 1.01 }}
            >
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
              >
                How It Works
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-base md:text-lg lg:text-xl leading-8 text-gray-200 dark:text-gray-300 mb-8"
              >
                The core idea behind <b className="text-white">LinkBridger</b> is to simplify the
                management of social media links. Instead of sharing long,
                hard-to-remember URLs, you create a single, personalized URL that
                automatically redirects users to the correct platform. Access all your links at one place by visiting <b className="text-white">https://clickly.cv/yourname</b> (without any platform name). Plus, get real-time email notifications every time someone visits your links!
              </motion.p>
              
              <div className="space-y-6">
                {[
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
                ].map((item, idx) => {
                  const IconComponent = item.icon;
                  return (
                    <motion.div
                      key={item.step}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-4 p-6 bg-white/5 dark:bg-gray-800/30 rounded-2xl border border-white/10 hover:border-white/20 transition-all group"
                    >
                      <motion.div
                        className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-xl flex-shrink-0"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <IconComponent className="text-2xl text-white" />
                      </motion.div>
                      <div className="flex-1">
                        <h4 className="text-xl md:text-2xl font-bold text-white mb-2">
                          {item.step}. {item.title}
                        </h4>
                        <p className="text-gray-300 dark:text-gray-400 leading-relaxed">
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
                className="mt-8 p-6 bg-white/5 dark:bg-gray-800/30 rounded-2xl border border-white/10"
              >
                <p className="text-lg font-semibold text-white mb-4">Example:</p>
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
          </motion.section>

          {/* Click Tracking Section */}
          <motion.section variants={itemVariants} className="mb-12 md:mb-16">
            <motion.div
              className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-6 md:p-10 lg:p-12"
              whileHover={{ scale: 1.01 }}
            >
              <motion.div className="flex items-center gap-4 mb-6">
                <motion.div
                  className="bg-gradient-to-r from-orange-500 to-red-500 p-4 rounded-xl"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <FaChartLine className="text-3xl text-white" />
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent"
                >
                  Click Tracking
                </motion.h2>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-base md:text-lg lg:text-xl leading-8 text-gray-200 dark:text-gray-300"
              >
                With <b className="text-white">LinkBridger</b>, you can track how many times each of your
                links has been clicked. This allows you to monitor the engagement on
                your social media profiles across different platforms. Access the
                analytics section from your dashboard to see detailed statistics
                about each link's performance.
              </motion.p>
            </motion.div>
          </motion.section>

          {/* Future Enhancements Section */}
          <motion.section variants={itemVariants} className="mb-12 md:mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-12 text-center bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
            >
              Future Enhancements
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {futureFeatures.map((feature, idx) => {
                const IconComponent = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-6 md:p-8 relative overflow-hidden group"
                  >
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                    />
                    <div className="relative z-10">
                      <motion.div
                        className={`bg-gradient-to-r ${feature.gradient} p-4 rounded-xl w-fit mb-4`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <IconComponent className="text-2xl text-white" />
                      </motion.div>
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-gray-300 dark:text-gray-400 leading-relaxed">
                        {feature.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>

          {/* Use Cases Section */}
          <motion.section variants={itemVariants} className="mb-12 md:mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-12 text-center bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
            >
              Use Cases
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[
                {
                  title: "Job Seekers",
                  desc: "Create professional links for your resume, LinkedIn, portfolio, and GitHub. Share one memorable link with recruiters.",
                  icon: FaBriefcase,
                  gradient: "from-blue-500 to-cyan-500",
                  examples: ["Resume sharing", "Interview preparation", "Professional networking"],
                },
                {
                  title: "Content Creators",
                  desc: "Manage all your social media profiles from one place. Share your LinkBridger link in bio and watch engagement grow.",
                  icon: FaUserTie,
                  gradient: "from-purple-500 to-pink-500",
                  examples: ["Instagram bio links", "YouTube descriptions", "TikTok profiles"],
                },
                {
                  title: "Developers",
                  desc: "Showcase your GitHub, portfolio, blog, and coding profiles. Perfect for developer portfolios and tech resumes.",
                  icon: FaCode,
                  gradient: "from-green-500 to-emerald-500",
                  examples: ["Portfolio websites", "GitHub profiles", "Tech blogs"],
                },
                {
                  title: "Students",
                  desc: "Share academic profiles, LinkedIn, research papers, and project portfolios. Great for college applications and networking.",
                  icon: FaGraduationCap,
                  gradient: "from-orange-500 to-red-500",
                  examples: ["College applications", "Academic networking", "Project showcases"],
                },
                {
                  title: "Businesses",
                  desc: "Create branded links for your company's social media presence. Manage multiple team member profiles efficiently.",
                  icon: FaUsers,
                  gradient: "from-indigo-500 to-purple-500",
                  examples: ["Team profiles", "Brand consistency", "Social media management"],
                },
                {
                  title: "Freelancers",
                  desc: "Consolidate your work samples, client testimonials, and contact information in one professional link.",
                  icon: FaRocket,
                  gradient: "from-pink-500 to-rose-500",
                  examples: ["Client proposals", "Portfolio sharing", "Service showcases"],
                },
              ].map((useCase, idx) => {
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
                        className={`bg-gradient-to-r ${useCase.gradient} p-4 rounded-xl w-fit mb-4`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <IconComponent className="text-3xl text-white" />
                      </motion.div>
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                        {useCase.title}
                      </h3>
                      <p className="text-gray-300 dark:text-gray-400 leading-relaxed mb-4">
                        {useCase.desc}
                      </p>
                      <div className="space-y-2">
                        {useCase.examples.map((example, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
                            <FaCheckCircle className="text-green-400 text-xs" />
                            <span>{example}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>

          {/* Best Practices Section */}
          <motion.section variants={itemVariants} className="mb-12 md:mb-16">
            <motion.div
              className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-6 md:p-10 lg:p-12"
              whileHover={{ scale: 1.01 }}
            >
              <motion.div className="flex items-center gap-4 mb-8">
                <motion.div
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 p-4 rounded-xl"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <FaLightbulb className="text-3xl text-white" />
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent"
                >
                  Best Practices
                </motion.h2>
              </motion.div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    title: "Choose a Memorable Username",
                    desc: "Pick a username that's easy to remember and spell. Avoid numbers and special characters when possible. Your username becomes part of your brand identity.",
                    icon: FaCheck,
                    color: "text-green-400",
                  },
                  {
                    title: "Keep Platform Names Consistent",
                    desc: "Use lowercase and consistent naming (e.g., 'linkedin' not 'LinkedIn' or 'linked-in'). This makes your links predictable and easy to remember.",
                    icon: FaCheck,
                    color: "text-green-400",
                  },
                  {
                    title: "Update Links Regularly",
                    desc: "Keep your destination URLs up to date. Since all your shared links automatically update, you only need to change them once in your dashboard.",
                    icon: FaSyncAlt,
                    color: "text-blue-400",
                  },
                  {
                    title: "Use Analytics to Optimize",
                    desc: "Monitor which links get the most clicks. Use this data to prioritize which platforms to feature prominently in your profile.",
                    icon: FaChartLine,
                    color: "text-purple-400",
                  },
                  {
                    title: "Test Your Links",
                    desc: "Always test your links after creating or updating them. Make sure they redirect correctly to the intended destination.",
                    icon: FaCheckCircle,
                    color: "text-cyan-400",
                  },
                  {
                    title: "Share Your Hub Link",
                    desc: "Prominently feature your main hub link (username) in your email signature, business cards, and social media bios for maximum visibility.",
                    icon: FaRocket,
                    color: "text-pink-400",
                  },
                ].map((practice, idx) => {
                  const IconComponent = practice.icon;
                  return (
                    <motion.div
                      key={practice.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-4 p-6 bg-white/5 dark:bg-gray-800/30 rounded-2xl border border-white/10 hover:border-white/20 transition-all group"
                    >
                      <motion.div
                        className="flex-shrink-0 mt-1"
                        whileHover={{ scale: 1.2, rotate: 10 }}
                      >
                        <IconComponent className={`text-2xl ${practice.color}`} />
                      </motion.div>
                      <div className="flex-1">
                        <h4 className="text-lg md:text-xl font-bold text-white mb-2">
                          {practice.title}
                        </h4>
                        <p className="text-gray-300 dark:text-gray-400 leading-relaxed">
                          {practice.desc}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </motion.section>

          {/* Platform Support Section */}
          <motion.section variants={itemVariants} className="mb-12 md:mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-12 text-center bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
            >
              Supported Platforms
            </motion.h2>
            <motion.div
              className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-6 md:p-10"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <p className="text-lg md:text-xl text-gray-300 dark:text-gray-400 mb-8 text-center">
                LinkBridger supports <b className="text-white">any platform</b> you can think of! Just provide the destination URL and we'll create your personalized link.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[
                  "LinkedIn", "GitHub", "Instagram", "Facebook", "Twitter/X", "YouTube",
                  "TikTok", "Snapchat", "Pinterest", "Reddit", "Discord", "Telegram",
                  "WhatsApp", "Medium", "Dev.to", "Behance", "Dribbble", "Figma",
                  "Portfolio", "Blog", "Website", "Email", "Resume", "LeetCode",
                  "Codeforces", "HackerRank", "CodeChef", "Stack Overflow", "Quora", "Tumblr"
                ].map((platform, idx) => (
                  <motion.div
                    key={platform}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.03, type: "spring" }}
                    whileHover={{ scale: 1.1, y: -3 }}
                    className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10 hover:border-white/30 transition-all cursor-pointer"
                  >
                    <p className="text-sm md:text-base font-semibold text-white">
                      {platform}
                    </p>
                  </motion.div>
                ))}
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="text-center text-gray-400 dark:text-gray-500 mt-6 text-sm md:text-base"
              >
                And many more! If you can share a URL, we can create a personalized link for it.
              </motion.p>
            </motion.div>
          </motion.section>

          {/* Security & Privacy Section */}
          <motion.section variants={itemVariants} className="mb-12 md:mb-16">
            <motion.div
              className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-6 md:p-10 lg:p-12"
              whileHover={{ scale: 1.01 }}
            >
              <motion.div className="flex items-center gap-4 mb-8">
                <motion.div
                  className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 rounded-xl"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <FaLock className="text-3xl text-white" />
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent"
                >
                  Security & Privacy
                </motion.h2>
              </motion.div>
              <div className="space-y-6">
                {[
                  {
                    title: "Secure Authentication",
                    desc: "All user accounts are protected with secure password hashing. We use industry-standard encryption to keep your data safe.",
                    icon: FaShieldAlt,
                    gradient: "from-blue-500 to-cyan-500",
                  },
                  {
                    title: "Privacy First",
                    desc: "We respect your privacy. Your personal information and link data are stored securely and never shared with third parties without your consent.",
                    icon: FaEye,
                    gradient: "from-purple-500 to-pink-500",
                  },
                  {
                    title: "HTTPS Encryption",
                    desc: "All connections to LinkBridger are encrypted using HTTPS, ensuring your data is protected during transmission.",
                    icon: FaLock,
                    gradient: "from-green-500 to-emerald-500",
                  },
                  {
                    title: "Secure Server Infrastructure",
                    desc: "Our servers are hosted on secure, reliable infrastructure with regular security updates and monitoring.",
                    icon: FaServer,
                    gradient: "from-orange-500 to-red-500",
                  },
                ].map((item, idx) => {
                  const IconComponent = item.icon;
                  return (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-4 p-6 bg-white/5 dark:bg-gray-800/30 rounded-2xl border border-white/10 hover:border-white/20 transition-all group"
                    >
                      <motion.div
                        className={`bg-gradient-to-r ${item.gradient} p-4 rounded-xl flex-shrink-0`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <IconComponent className="text-2xl text-white" />
                      </motion.div>
                      <div className="flex-1">
                        <h4 className="text-xl md:text-2xl font-bold text-white mb-2">
                          {item.title}
                        </h4>
                        <p className="text-gray-300 dark:text-gray-400 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </motion.section>

          {/* Troubleshooting Section */}
          <motion.section variants={itemVariants} className="mb-12 md:mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-12 text-center bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
            >
              Troubleshooting
            </motion.h2>
            <div className="space-y-4">
              {[
                {
                  issue: "My link is not redirecting correctly",
                  solution: "Double-check that your destination URL is correct and includes the full protocol (https://). Make sure the URL is accessible and not behind a login wall.",
                  icon: FaExclamationTriangle,
                  color: "from-red-500 to-orange-500",
                },
                {
                  issue: "I forgot my password",
                  solution: "Use the 'Forgot Password' link on the login page to reset your password. You'll receive an email with instructions to create a new password.",
                  icon: FaQuestionCircle,
                  color: "from-blue-500 to-cyan-500",
                },
                {
                  issue: "My username is already taken",
                  solution: "Usernames must be unique. Try adding numbers or variations to your desired username. Remember, usernames cannot be changed once created.",
                  icon: FaTimes,
                  color: "from-yellow-500 to-orange-500",
                },
                {
                  issue: "I'm not receiving verification emails",
                  solution: "Check your spam/junk folder. Make sure you entered the correct email address. If the issue persists, contact support for assistance.",
                  icon: FaExclamationTriangle,
                  color: "from-purple-500 to-pink-500",
                },
                {
                  issue: "My click count seems incorrect",
                  solution: "Click tracking may take a few moments to update. Refresh your dashboard. Note that clicks from the same IP within a short time may be filtered to prevent spam.",
                  icon: FaChartLine,
                  color: "from-green-500 to-emerald-500",
                },
                {
                  issue: "I want to delete my account",
                  solution: "Contact our support team to request account deletion. We'll process your request and ensure all your data is permanently removed from our systems.",
                  icon: FaUserTie,
                  color: "from-indigo-500 to-purple-500",
                },
              ].map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden group"
                  >
                    <motion.div className="p-6">
                      <div className="flex items-start gap-4">
                        <motion.div
                          className={`bg-gradient-to-r ${item.color} p-3 rounded-xl flex-shrink-0`}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          <IconComponent className="text-xl text-white" />
                        </motion.div>
                        <div className="flex-1">
                          <h4 className="text-lg md:text-xl font-bold text-white mb-2">
                            {item.issue}
                          </h4>
                          <p className="text-gray-300 dark:text-gray-400 leading-relaxed">
                            <span className="font-semibold text-green-400">Solution: </span>
                            {item.solution}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="mt-8 p-6 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-2xl border border-purple-400/30 text-center"
            >
              <p className="text-lg md:text-xl text-white mb-2">
                Still need help?
              </p>
              <p className="text-gray-300 dark:text-gray-400">
                Contact our support team at{" "}
                <a
                  href="mailto:d.wizard.techno@gmail.com"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  d.wizard.techno@gmail.com
                </a>
                {" "}and we'll be happy to assist you!
              </p>
            </motion.div>
          </motion.section>

          {/* FAQ Section */}
          <motion.section variants={itemVariants} className="mb-12 md:mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-12 text-center bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
            >
              Frequently Asked Questions
            </motion.h2>
            <div className="space-y-4">
              {[
                {
                  q: "Can I change my username after creating an account?",
                  a: "Unfortunately, usernames cannot be changed once they are set. Choose your username carefully!",
                },
                {
                  q: "How do I track my link clicks?",
                  a: "Click tracking is available through your dashboard. You can view the number of clicks for each link, and advanced analytics will be added soon.",
                },
                {
                  q: "Can I use custom platforms other than the popular ones (Instagram, LinkedIn, etc.)?",
                  a: "Yes! You can add any platform as long as you provide the correct profile URL.",
                },
              ].map((faq, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden cursor-pointer group"
                  onClick={() => toggleFAQ(idx)}
                >
                  <motion.div
                    className="p-6 flex justify-between items-center"
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                  >
                    <p className="font-semibold text-lg md:text-xl text-white dark:text-gray-200 flex-1">
                      Q: {faq.q}
                    </p>
                    <motion.div
                      animate={{ rotate: openFAQ[idx] ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {openFAQ[idx] ? (
                        <FaChevronUp className="text-purple-400 text-xl" />
                      ) : (
                        <FaChevronDown className="text-purple-400 text-xl" />
                      )}
                    </motion.div>
                  </motion.div>
                  <AnimatePresence>
                    {openFAQ[idx] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <motion.p
                          initial={{ y: -10 }}
                          animate={{ y: 0 }}
                          className="px-6 pb-6 text-gray-300 dark:text-gray-400 text-base md:text-lg leading-relaxed"
                        >
                          A: {faq.a}
                        </motion.p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Testimonials Section */}
          <motion.section variants={itemVariants} className="mb-12 md:mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-12 text-center bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
            >
              What Our Users Say
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {[
                {
                  text: "LinkBridger made sharing my profiles so much easier. The personalized links look great and are super easy to remember!",
                  author: "Amit S.",
                },
                {
                  text: "I love the analytics and the ability to update all my links in one place. Highly recommended!",
                  author: "Priya K.",
                },
              ].map((testimonial, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-6 md:p-8 relative overflow-hidden group"
                >
                  <motion.div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10">
                    <div className="flex gap-2 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-400 text-lg" />
                      ))}
                    </div>
                    <p className="text-lg md:text-xl italic text-gray-200 dark:text-gray-300 mb-6 leading-relaxed">
                      "{testimonial.text}"
                    </p>
                    <div className="flex items-center gap-3">
                      <motion.img
                        src="profile.jpg"
                        alt={testimonial.author}
                        className="h-12 w-12 rounded-full object-cover border-2 border-purple-400"
                        whileHover={{ scale: 1.1 }}
                      />
                      <span className="font-semibold text-white text-lg">
                        {testimonial.author}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Footer */}
          <Footer />
          <motion.footer
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center py-8 border-t border-white/10 mt-12"
          >
            <motion.p className="text-lg text-gray-400 dark:text-gray-500">
              &copy; 2024 LinkBridger. All Rights Reserved.
            </motion.p>
          </motion.footer>
        </motion.div>
      </div>
    </div>
  );
};

export default Documentation;
