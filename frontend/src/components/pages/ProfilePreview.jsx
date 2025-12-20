import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import toast from "react-hot-toast";
import {
  FaUser,
  FaMapMarkerAlt,
  FaHeart,
  FaLink,
  FaExternalLinkAlt,
  FaLock,
  FaEyeSlash,
  FaGlobe,
  FaArrowLeft,
  FaShieldAlt,
  FaMousePointer
} from "react-icons/fa";

const ProfilePreview = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [profileData, setProfileData] = useState(null);
  const [links, setLinks] = useState([]);
  const [settings, setSettings] = useState(null);

  // Add edge animation styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes edge-glow {
        0%, 100% {
          box-shadow: 
            0 0 5px rgba(147, 51, 234, 0.4),
            0 0 10px rgba(236, 72, 153, 0.3),
            0 0 15px rgba(59, 130, 246, 0.2),
            inset 0 0 5px rgba(147, 51, 234, 0.2);
        }
        50% {
          box-shadow: 
            0 0 15px rgba(147, 51, 234, 0.6),
            0 0 25px rgba(236, 72, 153, 0.5),
            0 0 35px rgba(59, 130, 246, 0.4),
            inset 0 0 10px rgba(147, 51, 234, 0.3);
        }
      }
      @keyframes edge-shimmer {
        0% {
          background-position: -200% center;
        }
        100% {
          background-position: 200% center;
        }
      }
      .edge-animated {
        position: relative;
        transition: all 0.3s ease;
      }
      .edge-animated::before {
        content: '';
        position: absolute;
        inset: -2px;
        border-radius: inherit;
        padding: 2px;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(147, 51, 234, 0.6),
          rgba(236, 72, 153, 0.6),
          rgba(59, 130, 246, 0.6),
          rgba(147, 51, 234, 0.6),
          transparent
        );
        background-size: 200% 100%;
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
        z-index: 0;
      }
      .edge-animated:hover {
        animation: edge-glow 2s ease-in-out infinite;
      }
      .edge-animated:hover::before {
        opacity: 1;
        animation: edge-shimmer 2s linear infinite;
      }
      .dark .edge-animated:hover {
        animation: edge-glow 2s ease-in-out infinite;
      }
      .dark .edge-animated::before {
        background: linear-gradient(
          90deg,
          transparent,
          rgba(168, 85, 247, 0.7),
          rgba(244, 114, 182, 0.7),
          rgba(96, 165, 250, 0.7),
          rgba(168, 85, 247, 0.7),
          transparent
        );
        background-size: 200% 100%;
      }
      .edge-animated-always {
        animation: edge-glow 2s ease-in-out infinite;
      }
      .edge-animated-always::before {
        opacity: 1;
        animation: edge-shimmer 2s linear infinite;
      }
      .dark .edge-animated-always {
        animation: edge-glow 2s ease-in-out infinite;
      }
      .dark .edge-animated-always::before {
        background: linear-gradient(
          90deg,
          transparent,
          rgba(168, 85, 247, 0.7),
          rgba(244, 114, 182, 0.7),
          rgba(96, 165, 250, 0.7),
          rgba(168, 85, 247, 0.7),
          transparent
        );
        background-size: 200% 100%;
      }
      .edge-animated > * {
        position: relative;
        z-index: 1;
      }
    `;
    document.head.appendChild(style);
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);
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

  useEffect(() => {
    if (username) {
      loadProfileData();
    }
  }, [username]);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const res = await api.post('/profile/getpublicprofile', { username }, { withCredentials: true });
      if (res.status === 200 && res.data.success) {
        setProfileData(res.data.profile);
        // Include both public and unlisted links (unlisted will be tagged)
        setLinks(res.data.links || []);
        setSettings(res.data.settings);
      } else {
        toast.error(res.data.message || "Profile not found or not public");
        navigate('/home');
      }
    } catch (error) {
      const message = error.response?.data?.message || "Profile not found";
      if (error.response?.status === 401) {
        toast.error("Please login to view profiles");
        navigate('/login');
      } else if (error.response?.status === 403) {
        toast.error("Profile is private");
        navigate('/home');
      } else {
        toast.error(message);
        navigate('/home');
      }
    } finally {
      setLoading(false);
    }
  };

  const getVisibilityIcon = (visibility) => {
    switch (visibility) {
      case 'public':
        return <FaGlobe className="text-sm" />;
      case 'unlisted':
        return <FaEyeSlash className="text-sm" />;
      case 'private':
        return <FaLock className="text-sm" />;
      default:
        return <FaGlobe className="text-sm" />;
    }
  };

  const getVisibilityColor = (visibility) => {
    switch (visibility) {
      case 'public':
        return 'from-green-500 to-emerald-500';
      case 'unlisted':
        return 'from-yellow-500 to-orange-500';
      case 'private':
        return 'from-gray-500 to-gray-600';
      default:
        return 'from-green-500 to-emerald-500';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white dark:bg-gray-900">
        <div className="relative flex justify-center items-center">
          <div className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-purple-500 dark:border-purple-400"></div>
          <img src="https://www.svgrepo.com/show/509001/avatar-thinking-9.svg" className="rounded-full h-28 w-28" alt="Loading" />
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-white dark:bg-gray-900">
        <FaShieldAlt className="text-6xl text-gray-400 dark:text-gray-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Profile Protected</h2>
        <p className="text-gray-700 dark:text-gray-400">This profile is not available for public viewing.</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold"
        >
          Go Home
        </motion.button>
      </div>
    );
  }

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="w-full overflow-hidden relative min-h-screen dark:bg-gray-900" data-profile-preview>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-96 h-96 bg-purple-500/20 dark:bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x * 0.5 - 200,
            y: mousePosition.y * 0.5 - 200,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-pink-500/20 dark:bg-pink-500/10 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x * 0.3 - 200,
            y: mousePosition.y * 0.3 - 200,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x * 0.7 - 200,
            y: mousePosition.y * 0.7 - 200,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>

      <div className="relative z-10 py-8 md:py-12 px-4 sm:px-6 md:px-10 lg:px-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          {/* Back Button */}
          <motion.button
            variants={itemVariants}
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            className="mb-6 flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            <FaArrowLeft />
            <span>Back</span>
          </motion.button>

          {/* Profile Card */}
          <motion.div
            variants={itemVariants}
            className="edge-animated edge-animated-always bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-6 md:p-10 lg:p-12 mb-8"
          >
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
              {/* Profile Image */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="relative w-32 h-32 md:w-40 md:h-40 rounded-full"
              >
                <div className="w-full h-full rounded-full border-4 border-purple-500/30 dark:border-purple-400/30 overflow-hidden shadow-2xl relative">
                  <img
                    src={profileData.image || "profile.png"}
                    alt={profileData.name || username}
                    className="w-full h-full object-cover"
                    style={{
                      filter: settings?.profile?.showProfileImage === false ? 'blur(6px)' : 'none',
                      transform: 'translateZ(0)',
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      imageRendering: 'auto'
                    }}
                    onError={(e) => {
                      e.target.src = "profile.png";
                    }}
                  />
                  {settings?.profile?.showProfileImage === false && (
                    <div 
                      className="absolute inset-0 flex items-center justify-center rounded-full pointer-events-none"
                      style={{
                        background: 'rgba(17, 24, 39, 0.2)',
                        transform: 'translateZ(0)'
                      }}
                    >
                      <FaLock className="text-2xl md:text-3xl text-gray-400 dark:text-gray-500" />
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <motion.h1
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 dark:from-purple-400 dark:via-pink-400 dark:to-blue-400 bg-clip-text text-transparent mb-2"
                >
                  {profileData.name || username}
                </motion.h1>
                <p className="text-lg text-gray-700 dark:text-gray-400 mb-4">@{username}</p>

                {/* Location */}
                {settings?.profile?.showLocation !== false && profileData.location && (
                  <div className="flex items-center justify-center md:justify-start gap-2 text-gray-700 dark:text-gray-300 mb-2">
                    <FaMapMarkerAlt className="text-blue-600 dark:text-blue-400" />
                    <span>{profileData.location}</span>
                  </div>
                )}

                {/* Passion */}
                {settings?.profile?.showPassion !== false && profileData.passion && (
                  <div className="flex items-center justify-center md:justify-start gap-2 text-gray-700 dark:text-gray-300 mb-2">
                    <FaHeart className="text-pink-600 dark:text-pink-400" />
                    <span>{profileData.passion}</span>
                  </div>
                )}

                {/* Bio */}
                {settings?.profile?.showBio !== false && profileData.bio && (
                  <p className="text-gray-700 dark:text-gray-300 mt-4 leading-relaxed">
                    {profileData.bio}
                  </p>
                )}
              </div>
            </div>

            {/* Stats - Each card is independently controlled by its setting */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 pt-8 border-t border-white/20 dark:border-gray-700/50">
              {/* Link Count Card - Controlled by showLinkCount setting */}
              {settings?.links?.showLinkCount !== false && (
                <div className="edge-animated text-center p-4 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-blue-600/10 rounded-2xl border border-white/20 dark:border-purple-400/20">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {links.length}
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-400">Links</div>
                </div>
              )}
              {/* Click Stats Card - Controlled by showClickStats setting */}
              {settings?.links?.showClickStats !== false && (
                <div className="edge-animated text-center p-4 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 rounded-2xl border border-white/20 dark:border-blue-400/20">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {links.reduce((sum, link) => sum + (link.clicked || 0), 0)}
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-400">Total Clicks</div>
                </div>
              )}
              {/* Status Card - Always visible */}
              <div className="edge-animated text-center p-4 bg-gradient-to-r from-green-600/10 to-emerald-600/10 rounded-2xl border border-white/20 dark:border-green-400/20">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  Live
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-400">Status</div>
              </div>
            </div>
          </motion.div>

          {/* Links Section */}
          {links.length > 0 ? (
            <motion.div variants={itemVariants} className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <FaLink className="text-purple-600 dark:text-purple-400" />
                Links
              </h2>
              {links.map((link, index) => (
                <motion.a
                  key={link._id || index}
                  href={link.destination}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="edge-animated block bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 p-6 hover:shadow-2xl transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`bg-gradient-to-r ${getVisibilityColor(link.visibility)} p-4 rounded-xl`}>
                        {getVisibilityIcon(link.visibility)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {link.source.toUpperCase()}
                          </h3>
                          {link.visibility === 'unlisted' && (
                            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white dark:from-yellow-400 dark:to-orange-400 flex items-center gap-1">
                              <FaEyeSlash className="text-xs" />
                              Unlisted
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-400 truncate">
                          {link.destination}
                        </p>
                        {link.visibility === 'unlisted' && (
                          <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1 italic">
                            Not listed in link hub
                          </p>
                        )}
                        {/* Click Count */}
                        <div className="flex items-center gap-2 mt-2">
                          <FaMousePointer className="text-xs text-gray-500 dark:text-gray-400" />
                          <span className="text-xs font-semibold text-gray-700 dark:text-gray-400">
                            {link.clicked || 0} {link.clicked === 1 ? 'click' : 'clicks'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <FaExternalLinkAlt className="text-gray-400 dark:text-gray-500 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
                  </div>
                </motion.a>
              ))}
            </motion.div>
          ) : (
            <motion.div
              variants={itemVariants}
              className="edge-animated bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-12 text-center"
            >
              <FaLink className="text-6xl text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Links Yet</h3>
              <p className="text-gray-700 dark:text-gray-400">This user hasn't added any public links yet.</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePreview;
