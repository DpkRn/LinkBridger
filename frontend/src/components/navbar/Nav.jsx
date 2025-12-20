import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { setSidebarMenu, toggleDarkMode } from "../../redux/pageSlice";
import toast from "react-hot-toast";
import api from "../../utils/api";
import {
  setAuthenticated,
  setLinks,
  setNotifications,
  setUser,
} from "../../redux/userSlice";
import { MdOutlineArrowDropDownCircle, MdMenu, MdClose } from "react-icons/md";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { FaBell, FaUser, FaCog, FaSignOutAlt, FaHome, FaLink, FaBook, FaSearch, FaTimes } from "react-icons/fa";
import Notification from "../notification/Notification";

const Nav = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const notificationRef = useRef(null);
  const profilePageRef = useRef(null);
  const searchInputRef = useRef(null);
  const location = useLocation();

  const [profileMenu, setProfileMenu] = useState(false);
  const [notificationPage, setNotificationPage] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchRef = useRef(null);

  const { sidebarMenu, darkMode } = useSelector((store) => store.page);
  const username = useSelector((store) => store.admin.user.username);
  const links = useSelector((store) => store.admin.links);
  const notifications = useSelector((store) => store.admin.notifications);

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

  const handleSignOut = async (e) => {
    try {
      const res = await api.get("/auth/signout", { withCredentials: true });
      if (res.status === 200 && res.data.success) {
        dispatch(setUser(null));
        dispatch(setAuthenticated(false));
        dispatch(setLinks([]));
        navigate("/login", { replace: true });
        toast.success(res.data.message);
      }
    } catch (err) {
      const message = err.response?.data?.message || "Server Internal Error";
      toast.error(message);
    }
  };

  const getAllLinks = async () => {
    try {
      const res = await api.post(
        "/source/getallsource",
        { username },
        { withCredentials: true }
      );
      if (res.status === 200 && res.data.success) {
        dispatch(setLinks(res.data.sources));
      }
    } catch (err) {
      console.log(err);
      const message = err.response?.data?.message || "Server Internal Error";
      toast.error(message);
    }
  };

  const handleMarkRead = async () => {
    try {
      const res = await api.post(
        "/source/notifications",
        {},
        { withCredentials: true }
      );
      if (res.status === 201 && res.data.success) {
        await getAllLinks();
        dispatch(setNotifications(0));
        setNotificationPage(false);
        toast.success("All notifications marked as read!");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    dispatch(
      setNotifications(links.reduce((acc, link) => acc + link.notSeen, 0))
    );
  }, [links, notifications, dispatch]);

  const onNotificationClick = async () => {
    if (notifications === 0) {
      toast("You have no new clicks", { icon: "📭" });
      return;
    }
    setNotificationPage((state) => !state);
  };

  // Handle search - memoized with useCallback to avoid stale closures
  const handleSearch = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    try {
      setSearchLoading(true);
      const res = await api.post('/search/users', { query: query.trim() }, { withCredentials: true });
      if (res.status === 200 && res.data.success) {
        setSearchResults(res.data.results || []);
        setShowSearchDropdown(true);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, []); // Empty deps array since handleSearch only uses stable setState functions and api

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        handleSearch(searchQuery);
      } else {
        setSearchResults([]);
        setShowSearchDropdown(false);
      }
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchQuery, handleSearch]);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target) &&
        !event.target.closest(".notification-button")
      ) {
        setNotificationPage(false);
      }
      if (
        profilePageRef.current &&
        !profilePageRef.current.contains(event.target) &&
        !event.target.closest(".profileMenu-button")
      ) {
        setProfileMenu(false);
      }
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        !event.target.closest(".search-button")
      ) {
        setShowSearchDropdown(false);
        setIsSearchExpanded(false);
      }
    };

    if (notificationPage || profileMenu || showSearchDropdown || isSearchExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notificationPage, profileMenu, showSearchDropdown, isSearchExpanded]);

  const handleProfileClick = (e) => {
    navigate("/profile");
    setProfileMenu(false);
  };

  const handleSettingsClick = (e) => {
    navigate("/settings");
    setProfileMenu(false);
  };

  const navLinks = [
    { to: "/home", label: "Home", icon: FaHome },
    { to: "/links", label: "Links", icon: FaLink },
    { to: "/doc", label: "Docs", icon: FaBook },
  ];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-gray-800/95 dark:bg-gray-900/50 border-b border-gray-700/50 dark:border-gray-700/50 shadow-lg">
      {/* Interactive Background Gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x * 0.3 - 200,
            y: mousePosition.y * 0.3 - 200,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
        />
      </div>

      <div className="relative z-10">
        <div className="relative flex h-16 md:h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <motion.button
              type="button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative inline-flex items-center justify-center rounded-lg p-2 text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
              aria-controls="mobile-menu"
              onClick={() => dispatch(setSidebarMenu(!sidebarMenu))}
            >
              <AnimatePresence mode="wait">
                {sidebarMenu ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MdClose className="h-6 w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MdMenu className="h-6 w-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {/* Logo and Desktop Navigation */}
          <div className="flex items-center justify-center flex-1 sm:flex-none">
            <Link
              to="/home"
              className="flex items-center gap-3 group"
            >
              <motion.div
                whileHover={{ scale: 1.05, rotateY: 5 }}
                whileTap={{ scale: 0.95 }}
                className="relative h-10 w-10 rounded-full overflow-hidden"
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
                  className="h-full w-full"
                >
                  <img
                    className="h-10 w-10 rounded-full object-contain bg-white/10 dark:bg-gray-800/20 p-1 drop-shadow-lg transition-all duration-300"
                    src={logo}
                    alt="LinkBridger Logo"
                    onError={(e) => {
                      e.target.src = 'https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500';
                    }}
                  />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
              <motion.span
                className="hidden sm:block text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
              >
                LinkBridger
              </motion.span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden sm:ml-8 sm:flex sm:items-center sm:gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`relative px-4 py-2 rounded-lg font-medium text-sm md:text-base transition-all duration-200 ${
                      isActive
                        ? "text-white dark:text-white bg-gradient-to-r from-purple-600/30 via-pink-600/30 to-blue-600/30"
                        : "text-white dark:text-gray-300 hover:text-white dark:hover:text-white hover:bg-white/10 dark:hover:bg-white/10"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      {link.label}
                    </span>
                    {isActive && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400"
                        layoutId="activeTab"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* Search - Responsive: Icon on mobile, full input on desktop */}
            <div className="relative search-button" ref={searchRef}>
              {/* Mobile: Search Icon Button */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsSearchExpanded(true)}
                className="md:hidden rounded-lg bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm p-2.5 text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 hover:bg-white/20 dark:hover:bg-gray-700/50 border border-white/10 dark:border-gray-700/50"
                aria-label="Search users"
              >
                <FaSearch className="h-5 w-5" />
              </motion.button>

              {/* Desktop: Full Search Input */}
              <div className="hidden md:block relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4 z-10" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    if (searchResults.length > 0) {
                      setShowSearchDropdown(true);
                    }
                  }}
                  className="pl-10 pr-10 py-2 bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg border border-white/10 dark:border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 w-48 md:w-64 text-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSearchResults([]);
                      setShowSearchDropdown(false);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-white z-10"
                  >
                    <FaTimes className="h-3 w-3" />
                  </button>
                )}
              </div>

              {/* Mobile: Expanded Search Input (when icon is clicked) */}
              <AnimatePresence>
                {isSearchExpanded && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="md:hidden absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 z-50"
                  >
                    <div className="relative">
                      <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
                      <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => {
                          if (searchResults.length > 0) {
                            setShowSearchDropdown(true);
                          }
                        }}
                        autoFocus
                        className="w-full pl-10 pr-10 py-2 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm"
                      />
                      <button
                        onClick={() => {
                          setIsSearchExpanded(false);
                          setSearchQuery("");
                          setSearchResults([]);
                          setShowSearchDropdown(false);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <FaTimes className="h-4 w-4" />
                      </button>
                    </div>
                    
                    {/* Mobile Search Dropdown */}
                    {showSearchDropdown && (searchResults.length > 0 || searchLoading) && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-2 w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                      >
                        {searchLoading ? (
                          <div className="p-4 text-center text-gray-600 dark:text-gray-400">
                            <div className="animate-spin h-5 w-5 border-2 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
                          </div>
                        ) : searchResults.length > 0 ? (
                          <div className="max-h-96 overflow-y-auto">
                            {searchResults.map((user) => (
                              <motion.div
                                key={user.username}
                                whileHover={{ backgroundColor: "rgba(147, 51, 234, 0.1)" }}
                                onClick={() => {
                                  navigate(`/profile/${user.username}`);
                                  setShowSearchDropdown(false);
                                  setSearchQuery("");
                                  setIsSearchExpanded(false);
                                }}
                                className="p-4 hover:bg-purple-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-200 dark:border-gray-700 last:border-b-0 flex items-center gap-3"
                              >
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                                  {user.name?.[0]?.toUpperCase() || user.username[0].toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-semibold text-gray-900 dark:text-white truncate">
                                    {user.name || user.username}
                                  </div>
                                  <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                    @{user.username}
                                  </div>
                                </div>
                                <FaUser className="text-gray-400 dark:text-gray-500 flex-shrink-0" />
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-4 text-center text-gray-600 dark:text-gray-400">
                            No users found
                          </div>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Search Dropdown - Desktop */}
              <AnimatePresence>
                {!isSearchExpanded && showSearchDropdown && (searchResults.length > 0 || searchLoading) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="hidden md:block absolute top-full left-0 mt-2 w-64 md:w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                  >
                    {searchLoading ? (
                      <div className="p-4 text-center text-gray-600 dark:text-gray-400">
                        <div className="animate-spin h-5 w-5 border-2 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="max-h-96 overflow-y-auto">
                        {searchResults.map((user) => (
                          <motion.div
                            key={user.username}
                            whileHover={{ backgroundColor: "rgba(147, 51, 234, 0.1)" }}
                            onClick={() => {
                              navigate(`/profile/${user.username}`);
                              setShowSearchDropdown(false);
                              setSearchQuery("");
                            }}
                            className="p-4 hover:bg-purple-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-200 dark:border-gray-700 last:border-b-0 flex items-center gap-3"
                          >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                              {user.name?.[0]?.toUpperCase() || user.username[0].toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-gray-900 dark:text-white truncate">
                                {user.name || user.username}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                @{user.username}
                              </div>
                            </div>
                            <FaUser className="text-gray-400 dark:text-gray-500 flex-shrink-0" />
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-gray-600 dark:text-gray-400">
                        No users found
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Dark Mode Toggle */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => dispatch(toggleDarkMode())}
              className="relative rounded-lg bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm p-2.5 text-gray-300 hover:text-white dark:hover:text-yellow-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 hover:bg-white/20 dark:hover:bg-gray-700/50 border border-white/10 dark:border-gray-700/50"
              aria-label="Toggle dark mode"
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? (
                <MdLightMode className="h-5 w-5 text-yellow-300" />
              ) : (
                <MdDarkMode className="h-5 w-5" />
              )}
            </motion.button>

            {/* Notifications */}
            <div className="relative">
              <motion.button
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="notification-button relative rounded-lg bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm p-2.5 text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 hover:bg-white/20 dark:hover:bg-gray-700/50 border border-white/10 dark:border-gray-700/50"
                onClick={onNotificationClick}
              >
                <FaBell className="h-5 w-5" />
                {notifications > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg border-2 border-white/20 dark:border-gray-900/50"
                  >
                    {notifications > 9 ? "9+" : notifications}
                  </motion.div>
                )}
              </motion.button>

              {/* Notification Dropdown */}
              <AnimatePresence>
                {notificationPage && (
                  <motion.div
                    ref={notificationRef}
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 z-[100] mt-2 w-80 md:w-96 origin-top-right rounded-2xl bg-gray-800/95 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-700/50 dark:border-gray-700/50 shadow-2xl overflow-hidden"
                  >
                    <div className="p-4 border-b border-gray-600/30 dark:border-gray-700/50">
                      <h3 className="text-lg font-bold text-white dark:text-white flex items-center gap-2">
                        <FaBell className="text-purple-400" />
                        Notifications
                        {notifications > 0 && (
                          <span className="ml-auto bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {notifications} new
                          </span>
                        )}
                      </h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      <Notification />
                    </div>
                    {notifications > 0 && (
                      <div className="p-4 border-t border-gray-600/30 dark:border-gray-700/50">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleMarkRead}
                          className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <FaBell className="w-4 h-4" />
                          Mark All as Read
                        </motion.button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Menu */}
            <div className="relative ml-2">
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="profileMenu-button relative flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 hover:from-purple-600/30 hover:via-pink-600/30 hover:to-blue-600/30 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 text-white font-semibold text-sm uppercase focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200"
                onClick={() => setProfileMenu((state) => !state)}
              >
                <FaUser className="w-4 h-4" />
                <span className="hidden sm:inline">{username}</span>
                <motion.div
                  animate={{ rotate: profileMenu ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <MdOutlineArrowDropDownCircle className="w-5 h-5" />
                </motion.div>
              </motion.button>

              {/* Profile Dropdown */}
              <AnimatePresence>
                {profileMenu && (
                  <motion.div
                    ref={profilePageRef}
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 z-[100] mt-2 w-56 origin-top-right rounded-2xl bg-gray-800/95 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-700/50 dark:border-gray-700/50 shadow-2xl overflow-hidden"
                    role="menu"
                  >
                    <div className="p-2">
                      <div className="px-4 py-3 border-b border-gray-600/30 dark:border-gray-700/50">
                        <p className="text-sm font-semibold text-white dark:text-white uppercase">{username}</p>
                        <p className="text-xs text-gray-300 dark:text-gray-400 mt-1">Welcome back!</p>
                      </div>
                      <motion.div
                        whileHover={{ x: 5 }}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-white dark:text-gray-200 hover:text-white dark:hover:text-white hover:bg-white/10 dark:hover:bg-gray-800/50 rounded-lg cursor-pointer transition-colors duration-200"
                        role="menuitem"
                        onClick={handleProfileClick}
                      >
                        <FaUser className="w-4 h-4 text-purple-400" />
                        Your Profile
                      </motion.div>
                      <motion.div
                        whileHover={{ x: 5 }}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-white dark:text-gray-200 hover:text-white dark:hover:text-white hover:bg-white/10 dark:hover:bg-gray-800/50 rounded-lg cursor-pointer transition-colors duration-200"
                        role="menuitem"
                        onClick={handleSettingsClick}
                      >
                        <FaCog className="w-4 h-4 text-blue-400" />
                        Settings
                      </motion.div>
                      <motion.div
                        whileHover={{ x: 5 }}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-red-300 dark:text-red-300 hover:text-red-200 dark:hover:text-red-400 hover:bg-red-500/10 rounded-lg cursor-pointer transition-colors duration-200"
                        role="menuitem"
                        onClick={handleSignOut}
                      >
                        <FaSignOutAlt className="w-4 h-4" />
                        Sign out
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar Menu */}
        <AnimatePresence>
          {sidebarMenu && (
            <motion.div
              initial={{ opacity: 0, x: -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ duration: 0.3 }}
              className="sm:hidden fixed inset-y-0 left-0 w-64 z-50 bg-gray-800/95 dark:bg-gray-900/95 backdrop-blur-xl border-r border-gray-700/50 dark:border-gray-700/50 shadow-2xl"
              id="mobile-menu"
            >
              <div className="p-4 space-y-2">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.to;
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => dispatch(setSidebarMenu(false))}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                        isActive
                          ? "text-white dark:text-white bg-gradient-to-r from-purple-600/30 via-pink-600/30 to-blue-600/30"
                          : "text-white dark:text-gray-300 hover:text-white dark:hover:text-white hover:bg-white/10 dark:hover:bg-white/10"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Nav;
