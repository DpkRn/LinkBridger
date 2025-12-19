import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import api from "../../utils/api";
import toast from "react-hot-toast";
import {
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaLink,
  FaChartLine,
  FaBell,
  FaSearch,
  FaSave,
  FaSpinner,
  FaCheckCircle,
  FaGlobe,
  FaUserLock,
  FaShieldAlt
} from "react-icons/fa";

const Settings = () => {
  const { username, _id } = useSelector((store) => store.admin.user);
  const [loading, setLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Profile Visibility Settings
  const [profileSettings, setProfileSettings] = useState({
    isPublic: false,
    showInSearch: false,
    allowProfileView: false,
    showEmail: false,
    showLocation: true,
    showBio: true,
    showPassion: true,
    showProfileImage: true
  });

  // Link Display Settings
  const [linkSettings, setLinkSettings] = useState({
    showLinkCount: true,
    showClickStats: false
  });

  // Search Settings
  const [searchSettings, setSearchSettings] = useState({
    allowSearch: false,
    showInFeatured: false,
    searchKeywords: []
  });

  // Privacy Settings
  const [privacySettings, setPrivacySettings] = useState({
    showAnalytics: false,
    showLastUpdated: false,
    requireAuth: false
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailOnNewClick: false,
    emailOnProfileView: false,
    weeklyReport: false
  });

  const [newKeyword, setNewKeyword] = useState("");

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

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, [username]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const res = await api.post('/settings/get', { username }, { withCredentials: true });
      if (res.status === 200 && res.data.success) {
        const settings = res.data.settings;
        if (settings.profile) setProfileSettings(settings.profile);
        if (settings.links) setLinkSettings(settings.links);
        if (settings.search) setSearchSettings(settings.search);
        if (settings.privacy) setPrivacySettings(settings.privacy);
        if (settings.notifications) setNotificationSettings(settings.notifications);
      } else {
        toast.error(res.data.message || "Failed to load settings");
      }
    } catch (error) {
      console.error("Error loading settings:", error);
      const message = error.response?.data?.message || "Failed to load settings";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const payload = {
        username,
        profile: profileSettings,
        links: linkSettings,
        search: searchSettings,
        privacy: privacySettings,
        notifications: notificationSettings
      };
      
      const res = await api.post(
        '/settings/update',
        payload,
        { withCredentials: true }
      );
      
      if (res.status === 200 && res.data.success) {
        toast.success("Settings saved successfully!");
        // Reload settings to ensure UI is in sync
        await loadSettings();
      } else {
        toast.error(res.data.message || "Failed to save settings");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      const message = error.response?.data?.message || "Server Internal Error";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !searchSettings.searchKeywords.includes(newKeyword.trim())) {
      setSearchSettings({
        ...searchSettings,
        searchKeywords: [...searchSettings.searchKeywords, newKeyword.trim()]
      });
      setNewKeyword("");
    }
  };

  const removeKeyword = (keyword) => {
    setSearchSettings({
      ...searchSettings,
      searchKeywords: searchSettings.searchKeywords.filter(k => k !== keyword)
    });
  };

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
    <div className="w-full overflow-hidden relative min-h-screen" data-settings-page>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
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
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>

      <div className="relative z-10 py-8 md:py-12 px-4 sm:px-6 md:px-10 lg:px-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto"
        >
          {/* Header */}
          <motion.div
            variants={itemVariants}
            className="mb-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <motion.div
                className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-xl"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <FaShieldAlt className="text-3xl text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 dark:from-purple-400 dark:via-pink-400 dark:to-blue-400 bg-clip-text text-transparent">
                  Privacy & Settings
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base mt-1">
                  Control your profile visibility and privacy preferences
                </p>
              </div>
            </div>
          </motion.div>

          <div className="space-y-6">
            {/* Profile Visibility Section */}
            <motion.div
              variants={itemVariants}
              className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 md:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <FaUser className="text-2xl text-purple-600 dark:text-purple-400" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Visibility</h2>
              </div>

              <div className="space-y-4">
                <ToggleSetting
                  label="Make Profile Public"
                  description="Allow others to view your profile"
                  value={profileSettings.isPublic}
                  onChange={(val) => setProfileSettings({ ...profileSettings, isPublic: val })}
                />
                <ToggleSetting
                  label="Show in Search Results"
                  description="Allow your profile to appear in search"
                  value={profileSettings.showInSearch}
                  onChange={(val) => setProfileSettings({ ...profileSettings, showInSearch: val })}
                  disabled={!profileSettings.isPublic}
                />
                <ToggleSetting
                  label="Allow Profile View"
                  description="Let others view your full profile page"
                  value={profileSettings.allowProfileView}
                  onChange={(val) => setProfileSettings({ ...profileSettings, allowProfileView: val })}
                  disabled={!profileSettings.isPublic}
                />
                <ToggleSetting
                  label="Show Email"
                  description="Display email on public profile"
                  value={profileSettings.showEmail}
                  onChange={(val) => setProfileSettings({ ...profileSettings, showEmail: val })}
                  disabled={!profileSettings.isPublic}
                />
                <ToggleSetting
                  label="Show Location"
                  description="Display location on public profile"
                  value={profileSettings.showLocation}
                  onChange={(val) => setProfileSettings({ ...profileSettings, showLocation: val })}
                />
                <ToggleSetting
                  label="Show Bio"
                  description="Display bio on public profile"
                  value={profileSettings.showBio}
                  onChange={(val) => setProfileSettings({ ...profileSettings, showBio: val })}
                />
                <ToggleSetting
                  label="Show Passion"
                  description="Display passion on public profile"
                  value={profileSettings.showPassion}
                  onChange={(val) => setProfileSettings({ ...profileSettings, showPassion: val })}
                />
                <ToggleSetting
                  label="Show Profile Image"
                  description="Display profile picture on public profile"
                  value={profileSettings.showProfileImage}
                  onChange={(val) => setProfileSettings({ ...profileSettings, showProfileImage: val })}
                />
              </div>
            </motion.div>

            {/* Link Display Section */}
            <motion.div
              variants={itemVariants}
              className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 md:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <FaLink className="text-2xl text-blue-600 dark:text-blue-400" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Link Display</h2>
              </div>

              <div className="space-y-4">
                <ToggleSetting
                  label="Show Link Count"
                  description="Display total number of links on public profile"
                  value={linkSettings.showLinkCount}
                  onChange={(val) => setLinkSettings({ ...linkSettings, showLinkCount: val })}
                />
                <ToggleSetting
                  label="Show Click Statistics"
                  description="Display click statistics on public profile"
                  value={linkSettings.showClickStats}
                  onChange={(val) => setLinkSettings({ ...linkSettings, showClickStats: val })}
                />
              </div>
            </motion.div>

            {/* Search & Discovery Section */}
            <motion.div
              variants={itemVariants}
              className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 md:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <FaSearch className="text-2xl text-green-600 dark:text-green-400" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Search & Discovery</h2>
              </div>

              <div className="space-y-4">
                <ToggleSetting
                  label="Allow Search"
                  description="Allow your profile to appear in search results"
                  value={searchSettings.allowSearch}
                  onChange={(val) => setSearchSettings({ ...searchSettings, allowSearch: val })}
                />
                <ToggleSetting
                  label="Show in Featured"
                  description="Allow your profile to appear in featured sections"
                  value={searchSettings.showInFeatured}
                  onChange={(val) => setSearchSettings({ ...searchSettings, showInFeatured: val })}
                  disabled={!searchSettings.allowSearch}
                />
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Search Keywords
                  </label>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                    Add keywords to help others find your profile
                  </p>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                      placeholder="Add keyword..."
                      className="flex-1 px-4 py-2 bg-white/90 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={addKeyword}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors"
                    >
                      Add
                    </motion.button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {searchSettings.searchKeywords.map((keyword, index) => (
                      <motion.span
                        key={index}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm flex items-center gap-2"
                      >
                        {keyword}
                        <button
                          onClick={() => removeKeyword(keyword)}
                          className="hover:text-purple-900 dark:hover:text-purple-100"
                        >
                          ×
                        </button>
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Privacy Section */}
            <motion.div
              variants={itemVariants}
              className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 md:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <FaLock className="text-2xl text-red-600 dark:text-red-400" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Privacy</h2>
              </div>

              <div className="space-y-4">
                <ToggleSetting
                  label="Show Analytics"
                  description="Display analytics data on public profile"
                  value={privacySettings.showAnalytics}
                  onChange={(val) => setPrivacySettings({ ...privacySettings, showAnalytics: val })}
                />
                <ToggleSetting
                  label="Show Last Updated"
                  description="Display last updated timestamp on public profile"
                  value={privacySettings.showLastUpdated}
                  onChange={(val) => setPrivacySettings({ ...privacySettings, showLastUpdated: val })}
                />
                <ToggleSetting
                  label="Require Authentication"
                  description="Require users to be logged in to view your profile"
                  value={privacySettings.requireAuth}
                  onChange={(val) => setPrivacySettings({ ...privacySettings, requireAuth: val })}
                />
              </div>
            </motion.div>

            {/* Notifications Section */}
            <motion.div
              variants={itemVariants}
              className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 md:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <FaBell className="text-2xl text-yellow-600 dark:text-yellow-400" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h2>
              </div>

              <div className="space-y-4">
                <ToggleSetting
                  label="Email on New Click"
                  description="Receive email when a link receives a new click"
                  value={notificationSettings.emailOnNewClick}
                  onChange={(val) => setNotificationSettings({ ...notificationSettings, emailOnNewClick: val })}
                />
                <ToggleSetting
                  label="Email on Profile View"
                  description="Receive email when your profile is viewed"
                  value={notificationSettings.emailOnProfileView}
                  onChange={(val) => setNotificationSettings({ ...notificationSettings, emailOnProfileView: val })}
                />
                <ToggleSetting
                  label="Weekly Report"
                  description="Receive weekly analytics report via email"
                  value={notificationSettings.weeklyReport}
                  onChange={(val) => setNotificationSettings({ ...notificationSettings, weeklyReport: val })}
                />
              </div>
            </motion.div>

            {/* Save Button */}
            <motion.div variants={itemVariants} className="flex justify-end pt-6">
              <motion.button
                whileHover={{ scale: loading ? 1 : 1.05 }}
                whileTap={{ scale: loading ? 1 : 0.95 }}
                onClick={handleSave}
                disabled={loading}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave />
                    Save Settings
                  </>
                )}
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Toggle Setting Component
const ToggleSetting = ({ label, description, value, onChange, disabled = false }) => {
  return (
    <div className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="flex-1">
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">
          {label}
        </label>
        <p className="text-xs text-gray-600 dark:text-gray-400">{description}</p>
      </div>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => !disabled && onChange(!value)}
        disabled={disabled}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          value ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <motion.span
          animate={{ x: value ? 20 : 2 }}
          className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
        />
      </motion.button>
    </div>
  );
};

export default Settings;
