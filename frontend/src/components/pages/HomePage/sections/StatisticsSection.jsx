import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

// AnimatedCounter component
const AnimatedCounter = ({ end, duration = 2000, suffix = "", statsInView }) => {
  const [count, setCount] = React.useState(0);
  const animationFrameRef = React.useRef(null);
  const isMountedRef = React.useRef(true);
  const hasAnimatedRef = React.useRef(false);

  React.useEffect(() => {
    if (hasAnimatedRef.current) {
      setCount(0);
      hasAnimatedRef.current = false;
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }

    if (!statsInView) return;
    
    isMountedRef.current = true;
    hasAnimatedRef.current = true;

    let startTime = null;
    const animate = (currentTime) => {
      if (!isMountedRef.current) return;
      
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
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [statsInView, end, duration]);

  return <span>{count}{suffix}</span>;
};

const StatisticsSection = ({ 
  stats = [],
  title = "Trusted by Thousands",
  subtitle = "Join the community of professionals, creators, and developers",
  className = "",
  sectionRef = null
}) => {
  const statsRef = sectionRef || useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-100px" });

  return (
    <section ref={statsRef} className={`py-20 bg-gradient-to-br from-purple-50/80 via-pink-50/80 to-blue-50/80 dark:bg-gradient-to-br dark:from-purple-950/40 dark:via-slate-900/60 dark:to-blue-950/40 backdrop-blur-sm relative overflow-hidden ${className}`}>
      {/* Dark mode decorative background elements */}
      <div className="hidden dark:block absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4 dark:bg-gradient-to-r dark:from-purple-300 dark:via-pink-300 dark:to-blue-300 dark:bg-clip-text dark:text-transparent">
            {title}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-[120px]">
            {subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label || index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="relative group p-[2px] rounded-xl sm:rounded-2xl"
            >
              {/* Rotating gradient border with glow */}
              <motion.div
                className="absolute inset-0 rounded-xl sm:rounded-2xl"
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{
                  background: "conic-gradient(from 0deg, #9333ea, #ec4899, #3b82f6, #9333ea)",
                }}
              />
              <motion.div
                className="absolute inset-0 rounded-xl sm:rounded-2xl"
                animate={{
                  boxShadow: [
                    "0 0 15px rgba(147, 51, 234, 0.4), inset 0 0 15px rgba(147, 51, 234, 0.2)",
                    "0 0 25px rgba(236, 72, 153, 0.6), inset 0 0 25px rgba(236, 72, 153, 0.3)",
                    "0 0 15px rgba(59, 130, 246, 0.4), inset 0 0 15px rgba(59, 130, 246, 0.2)",
                    "0 0 15px rgba(147, 51, 234, 0.4), inset 0 0 15px rgba(147, 51, 234, 0.2)",
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <div className="relative text-center p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white/90 dark:bg-gradient-to-br dark:from-gray-800/80 dark:via-gray-900/80 dark:to-gray-800/80 backdrop-blur-xl dark:shadow-[0_0_20px_rgba(147,51,234,0.15)] shadow-lg hover:shadow-xl dark:hover:shadow-[0_0_30px_rgba(147,51,234,0.25)] transition-all overflow-hidden">
                {/* Dark mode gradient overlay on hover */}
                <div className="hidden dark:block absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="text-3xl md:text-4xl mb-2 text-purple-600 dark:text-purple-400 flex justify-center dark:drop-shadow-[0_0_8px_rgba(147,51,234,0.5)]">
                    {stat.icon}
                  </div>
                  <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-white mb-2 dark:bg-gradient-to-r dark:from-purple-200 dark:via-pink-200 dark:to-blue-200 dark:bg-clip-text dark:text-transparent">
                    {statsInView ? (
                      <AnimatedCounter end={stat.value} suffix={stat.suffix} statsInView={statsInView} />
                    ) : (
                      `0${stat.suffix}`
                    )}
                  </div>
                  <div className="text-sm md:text-base text-gray-600 dark:text-gray-300 font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;

