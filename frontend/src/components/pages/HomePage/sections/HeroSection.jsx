import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { TypewriterEffect } from '../../../ui/typewriter-effect';
import { FlipWords } from '../../../ui/flip-words';
import { FaArrowRight } from 'react-icons/fa';

const HeroSection = ({
  words = [],
  flipWords = [],
  description = "",
  highlightText = "",
  ctaText = "Get Started Free",
  ctaAction = null,
  secondaryCtaText = "Learn More",
  secondaryCtaAction = null,
  platforms = [],
  showScrollIndicator = true,
  className = "",
  mousePosition = { x: 0, y: 0 },
  isAuthenticated = false
}) => {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  const handleCtaClick = () => {
    if (ctaAction) {
      ctaAction();
    } else {
      navigate('/login');
    }
  };

  const handleSecondaryCtaClick = () => {
    if (secondaryCtaAction) {
      secondaryCtaAction();
    } else {
      navigate('/doc');
    }
  };

  return (
    <motion.section
      ref={heroRef}
      style={{ opacity, scale }}
      className={`relative min-h-screen flex items-center justify-center overflow-hidden ${!isAuthenticated ? 'pt-16' : ''} ${className}`}
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
          {words.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <TypewriterEffect words={words} className="mb-6" />
            </motion.div>
          )}

          {/* Subheading with Flip Words */}
          {flipWords.length > 0 && (
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
          )}

          {/* Description */}
          {description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed"
            >
              {description}
              {highlightText && (
                <>
                  <br />
                  <span className="font-semibold text-purple-600 dark:text-purple-400">
                    {highlightText}
                  </span>
                </>
              )}
            </motion.p>
          )}

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
              onClick={handleCtaClick}
              className="group relative px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-base sm:text-lg rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 overflow-hidden w-full sm:w-auto"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {ctaText}
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>

            {secondaryCtaText && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSecondaryCtaClick}
                className="px-6 py-3 sm:px-8 sm:py-4 bg-white dark:bg-gray-800 backdrop-blur-sm text-gray-800 dark:text-gray-200 font-bold text-base sm:text-lg rounded-full shadow-xl border-2 border-purple-600 dark:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300 w-full sm:w-auto"
              >
                {secondaryCtaText}
              </motion.button>
            )}
          </motion.div>

          {/* Platform Icons */}
          {platforms.length > 0 && (
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
                    key={platform.name || index}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 + index * 0.1, type: "spring", stiffness: 200 }}
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    className={`text-4xl ${platform.color || 'text-gray-600'} cursor-pointer hover:drop-shadow-lg transition-all`}
                  >
                    {platform.icon}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Scroll Indicator */}
      {showScrollIndicator && (
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
      )}
    </motion.section>
  );
};

export default HeroSection;

