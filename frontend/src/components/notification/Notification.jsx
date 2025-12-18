import React from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMousePointer, FaLink, FaChartLine } from 'react-icons/fa';

const Notification = () => {
  const links = useSelector(store => store.admin.links);
  const notificationsWithClicks = links.filter(link => link.notSeen > 0);

  if (notificationsWithClicks.length === 0) {
    return (
      <div className="p-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center justify-center gap-4"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center">
            <FaMousePointer className="w-8 h-8 text-purple-400" />
          </div>
          <div>
            <p className="text-gray-900 dark:text-gray-400 font-semibold text-lg mb-1">
              No New Activity
            </p>
            <p className="text-gray-700 dark:text-gray-500 text-sm">
              You're all caught up! Check back later for new clicks.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <AnimatePresence>
        {notificationsWithClicks.map((link, index) => (
          <motion.div
            key={link._id || index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="mb-3 p-4 rounded-xl bg-gray-700/30 dark:bg-gray-800/30 hover:bg-gray-700/40 dark:hover:bg-gray-700/50 border border-gray-600/30 dark:border-gray-700/50 transition-all duration-200 group"
          >
            <div className="flex items-start gap-3">
              {/* Icon */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-purple-500/30"
              >
                <FaChartLine className="w-5 h-5 text-purple-400" />
              </motion.div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white dark:text-white font-semibold text-sm">
                    {link.notSeen} {link.notSeen === 1 ? 'New Click' : 'New Clicks'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-xs font-bold text-purple-300 dark:text-purple-300 border border-purple-400/30">
                    {link.source.toUpperCase()}
                  </span>
                </div>
                <p className="text-gray-300 dark:text-gray-500 text-xs flex items-center gap-2">
                  <FaLink className="w-3 h-3" />
                  <span className="truncate">
                    {link.destination || 'Your personalized link'}
                  </span>
                </p>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                  className="mt-2 h-0.5 bg-gradient-to-r from-purple-500/50 to-pink-500/50 rounded-full"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Notification;
