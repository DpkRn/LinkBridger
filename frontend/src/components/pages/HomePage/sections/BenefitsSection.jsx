import React from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';

const BenefitsSection = ({
  benefits = [],
  title = "Perfect for Everyone",
  subtitle = "Whether you're a professional, creator, or developer",
  className = "",
  sectionRef = null
}) => {
  const benefitsRef = sectionRef || React.useRef(null);

  return (
    <section ref={benefitsRef} className={`py-20 bg-white/80 dark:bg-transparent backdrop-blur-sm ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            {title}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {subtitle}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title || index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              className={`relative p-6 sm:p-8 rounded-xl sm:rounded-2xl bg-gradient-to-br ${benefit.gradient || 'from-blue-600 to-cyan-600'} text-white shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
              <div className="relative z-10">
                <div className="text-5xl mb-4">{benefit.icon}</div>
                <h3 className="text-2xl font-bold mb-6">{benefit.title}</h3>
                <ul className="space-y-3">
                  {benefit.points?.map((point, idx) => (
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
  );
};

export default BenefitsSection;

