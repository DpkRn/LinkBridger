import React from 'react';
import { motion } from 'framer-motion';

const FeaturesSection = ({
  features = [],
  title = "Powerful Features",
  subtitle = "Everything you need to manage your social presence in one place",
  className = "",
  sectionRef = null,
  layout = "grid" // "grid" or "list"
}) => {
  const featuresRef = sectionRef || React.useRef(null);

  // Normalize feature data to handle both formats (description/desc, color/gradient)
  const normalizedFeatures = features.map(feature => ({
    ...feature,
    description: feature.description || feature.desc || "",
    color: feature.color || feature.gradient || 'from-purple-500 to-pink-500',
    icon: feature.icon
  }));

  return (
    <section ref={featuresRef} className={`py-20 bg-gradient-to-br from-blue-50/80 via-purple-50/80 to-pink-50/80 dark:bg-gradient-to-br dark:from-slate-900/60 dark:via-purple-950/40 dark:to-pink-950/40 backdrop-blur-sm relative overflow-hidden ${className}`}>
      {/* Dark mode decorative background elements */}
      <div className="hidden dark:block absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4 dark:bg-gradient-to-r dark:from-blue-300 dark:via-purple-300 dark:to-pink-300 dark:bg-clip-text dark:text-transparent">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </motion.div>

        {layout === "list" ? (
          <div className="space-y-4 md:space-y-6">
            {normalizedFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={feature.title || index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: feature.delay || index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.01 }}
                  className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-6 md:p-8 relative overflow-hidden group"
                >
                  <div className={`hidden dark:block absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  <div className="relative z-10 flex items-start gap-4">
                    {IconComponent && (
                      <motion.div
                        className={`bg-gradient-to-r ${feature.color} p-4 rounded-xl flex-shrink-0`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        {typeof IconComponent === 'function' ? (
                          <IconComponent className="text-2xl text-white" />
                        ) : (
                          <div className="text-2xl text-white">{IconComponent}</div>
                        )}
                      </motion.div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {normalizedFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={feature.title || index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: feature.delay || index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="relative group"
                >
                  {/* Animated edge border - OPTION 1: Pulsing Glow */}
                  <motion.div
                    className="absolute -inset-[2px] rounded-xl sm:rounded-2xl"
                    animate={{
                      boxShadow: [
                        "0 0 10px rgba(147, 51, 234, 0.5), 0 0 20px rgba(236, 72, 153, 0.3), 0 0 30px rgba(59, 130, 246, 0.2)",
                        "0 0 20px rgba(147, 51, 234, 0.8), 0 0 40px rgba(236, 72, 153, 0.6), 0 0 60px rgba(59, 130, 246, 0.4)",
                        "0 0 10px rgba(147, 51, 234, 0.5), 0 0 20px rgba(236, 72, 153, 0.3), 0 0 30px rgba(59, 130, 246, 0.2)",
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    style={{
                      background: "linear-gradient(135deg, #9333ea, #ec4899, #3b82f6)",
                    }}
                  />
                  <div className="relative p-6 sm:p-8 rounded-xl sm:rounded-2xl bg-white/90 dark:bg-gradient-to-br dark:from-gray-800/80 dark:via-gray-900/80 dark:to-gray-800/80 backdrop-blur-xl border-2 border-transparent dark:shadow-[0_0_20px_rgba(147,51,234,0.15)] hover:border-purple-400 dark:hover:border-purple-400/60 dark:hover:shadow-[0_0_30px_rgba(147,51,234,0.25)] shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-full flex flex-col">
                    {/* Dark mode gradient overlay on hover */}
                    <div className={`hidden dark:block absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                    <div className="relative z-10 flex flex-col h-full">
                      {IconComponent && (
                        <div className={`text-5xl mb-4 bg-gradient-to-r ${feature.color} bg-clip-text text-transparent dark:drop-shadow-[0_0_12px_rgba(147,51,234,0.4)]`}>
                          {typeof IconComponent === 'function' ? (
                            <IconComponent className="w-8 h-8" />
                          ) : (
                            IconComponent
                          )}
                        </div>
                      )}
                      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3 dark:bg-gradient-to-r dark:from-purple-200 dark:via-pink-200 dark:to-blue-200 dark:bg-clip-text dark:text-transparent">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed flex-grow">
                        {feature.description}
                      </p>
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 dark:shadow-[0_0_10px_rgba(236,72,153,0.5)]"
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturesSection;

