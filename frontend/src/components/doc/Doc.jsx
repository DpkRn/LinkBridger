import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdOutlineArrowDropDownCircle } from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  FaBook,
  FaRocket,
  FaStar,
  FaShieldAlt,
  FaLightbulb,
} from "react-icons/fa";
import { useSelector } from "react-redux";
// import { MdOutlineArrowDropDownCircle, MdMenu, MdClose } from "react-icons/md";

const Doc = () => {
  const [docsMenu, setDocsMenu] = useState(false);
  const docsMenuRef = useRef(null);
  const navigate = useNavigate();
   const isAuthenticated = useSelector(store => store.admin.isAuthenticated);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        docsMenuRef.current &&
        !docsMenuRef.current.contains(event.target) &&
        !event.target.closest(".docs-menu-button")
      ) {
        setDocsMenu(false);
      }
    };

    if (docsMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [docsMenu]);

  const docsMenuItems = [
    { to: "/docs/features", label: "Features", icon: FaRocket },
    { to: "/docs/benefits", label: "Benefits", icon: FaStar },
    { to: "/docs/security", label: "Security", icon: FaShieldAlt },
    { to: "/docs/how-to-use", label: "How to Use", icon: FaBook },
    { to: "/docs/different", label: "How it's Different", icon: FaLightbulb },
  ];
  return (
    <div className="relative docs-menu-button" ref={docsMenuRef}>
      <motion.button
        type="button"
        onClick={() => setDocsMenu(!docsMenu)}
        className={`relative px-4 py-2 rounded-lg font-medium text-sm md:text-base transition-all duration-200 flex items-center gap-2 dark:text-white  
                   `}
      >
        <FaBook className="w-4 h-4 text-red-400" />
        Docs
        <motion.div
          animate={{ rotate: docsMenu ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <MdOutlineArrowDropDownCircle className="w-4 h-4" />
        </motion.div>
      </motion.button>

      {/* Docs Dropdown Menu */}
      <AnimatePresence>
        {docsMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 z-[100] mt-2 w-56 origin-top-left rounded-2xl bg-gray-800/95 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-700/50 dark:border-gray-700/50 shadow-2xl overflow-hidden"
          >
            <div className="p-2">
              {docsMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.to;
                return (
                  <motion.div
                    key={item.to}
                    whileHover={{ x: 5 }}
                    className={`flex items-center gap-3 px-4 py-3 text-sm rounded-lg cursor-pointer transition-colors duration-200 ${
                      isActive
                        ? "text-white dark:text-white bg-gradient-to-r from-purple-600/30 via-pink-600/30 to-blue-600/30"
                        : "text-white dark:text-gray-200 hover:text-white dark:hover:text-white hover:bg-white/10 dark:hover:bg-gray-800/50"
                    }`}
                    onClick={() => {
                      navigate(item.to);
                      setDocsMenu(false);
                    }}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Doc;
