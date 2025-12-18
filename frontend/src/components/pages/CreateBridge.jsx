import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { MdContentCopy } from "react-icons/md";
import { FaLink, FaGlobe, FaExclamationTriangle, FaCheckCircle, FaTimes, FaRocket, FaEdit } from 'react-icons/fa';
import api from '../../utils/api';
import { setLinks } from '../../redux/userSlice';
import { setEditLinkData, clearEditLinkData } from '../../redux/pageSlice';

const CreateBridge = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [platform, setPlatform] = useState('');
  const [source, setSource] = useState('');
  const [profileLink, setProfileLink] = useState('');
  const [showBridge, setShowBridge] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const linkRef = useRef(null);
  const { username, _id } = useSelector((store) => store.admin.user);
  let links = useSelector((store) => store.admin.links);
  const editLinkData = useSelector((store) => store.page.editLinkData);
  const isEditMode = editLinkData !== null;

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

  // Populate form when edit mode is activated
  useEffect(() => {
    if (editLinkData) {
      const normalizedPlatform = editLinkData.source.toLowerCase().trim();
      setPlatform(normalizedPlatform);
      setProfileLink(editLinkData.destination);
      setSource(normalizedPlatform);
      setShowBridge(false);
    } else {
      setPlatform('');
      setProfileLink('');
      setSource('');
      setShowBridge(false);
    }
  }, [editLinkData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isEditMode && editLinkData) {
      const platformChanged = platform.toLowerCase().trim() !== editLinkData.source.toLowerCase().trim();
      
      if (platformChanged) {
        setPendingUpdate({
          id: editLinkData.id,
          source: platform.toLowerCase().trim(),
          destination: profileLink.trim()
        });
        setShowWarningModal(true);
        return;
      }
      
      await performUpdate({
        id: editLinkData.id,
        source: platform.toLowerCase().trim(),
        destination: profileLink.trim()
      });
    } else {
      try {
        setLoading(true);
        const res = await api.post('/source/addnewsource', { userId: _id, username: username, source: platform, destination: profileLink }, { withCredentials: true });
        if (res.status === 201 && res.data.success) {
          links = [...links, res.data.link];
          dispatch(setLinks(links));
          setSource(res.data.link.source);
          setShowBridge(true);
          setPlatform('');
          setProfileLink('');
          toast.success("Bridge has been created successfully!");
        } else if (res.status === 201 && !res.data.success) {
          const message = res.data.message || "Creation failed";
          toast.error(message);
        }
      } catch (err) {
        const message = err.response?.data?.message || "Server Internal Error";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    }
  };

  const performUpdate = async (updateData) => {
    try {
      setLoading(true);
      const res = await api.post('/source/editlink', updateData, { withCredentials: true });
        
      if (res.status === 200 && res.data.success) {
        const updatedLink = res.data.link || res.data;
        
        const linkExists = links.some(link => link._id === editLinkData.id);
        
        let updatedLinks;
        if (linkExists) {
          updatedLinks = links.map(link => 
            link._id === editLinkData.id ? { ...link, ...updatedLink } : link
          );
        } else {
          updatedLinks = [...links, updatedLink];
          toast.warning("Link was restored and updated. It may have been removed from the list.");
        }
        
        dispatch(setLinks(updatedLinks));
        setSource(updatedLink.source);
        setShowBridge(true);
        dispatch(clearEditLinkData());
        toast.success("Bridge has been updated successfully!");
      } else if (res.status === 200 && !res.data.success) {
        const message = res.data.message || "Update failed";
        toast.error(message);
      }
    } catch (err) {
      const message = err.response?.data?.message || "Server Internal Error";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmUpdate = async () => {
    setLoading(true);
    setShowWarningModal(false);
    if (editLinkData) {
      await performUpdate({
        id: editLinkData.id,
        source: platform.toLowerCase().trim(),
        destination: profileLink.trim()
      });
    }
    setPendingUpdate(null);
  };

  const handleCancelUpdate = () => {
    setShowWarningModal(false);
    setPendingUpdate(null);
  };

  const handleCancel = () => {
    dispatch(clearEditLinkData());
    setPlatform('');
    setProfileLink('');
    setSource('');
    setShowBridge(false);
  };

  const copyToClipboard = () => {
    const linkText = linkRef.current.innerText;
    navigator.clipboard.writeText(linkText)
      .then(() => {
        toast.success("Link copied to clipboard!");
      })
      .catch((err) => {
        toast.error("Failed to copy!");
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
    <div className="w-full overflow-hidden relative" data-create-bridge>
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

      <div className="relative z-10 py-8 md:py-12 px-4 sm:px-6 md:px-10 lg:px-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl mx-auto"
        >
          <motion.form
            variants={itemVariants}
            onSubmit={handleSubmit}
            className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 md:p-10 lg:p-12 space-y-6 md:space-y-8"
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 mb-6"
            >
              <motion.div
                className={`bg-gradient-to-r ${isEditMode ? 'from-blue-500 to-cyan-500' : 'from-purple-600 to-pink-600'} p-4 rounded-xl`}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                {isEditMode ? (
                  <FaEdit className="text-3xl text-white" />
                ) : (
                  <FaLink className="text-3xl text-white" />
                )}
              </motion.div>
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 dark:from-purple-400 dark:via-pink-400 dark:to-blue-400 bg-clip-text text-transparent">
                  {isEditMode ? "Edit Bridge" : "Create Bridge"}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base mt-1">
                  {isEditMode ? "Update your personalized link" : "Create a new personalized social media link"}
                </p>
              </div>
            </motion.div>

            {/* Edit Mode Indicator */}
            {isEditMode && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-blue-100/80 dark:bg-blue-900/30 border border-blue-300/50 dark:border-blue-600/50 rounded-2xl p-4 flex items-center gap-3"
              >
                <FaCheckCircle className="text-blue-600 dark:text-blue-400 text-xl flex-shrink-0" />
                <div>
                  <p className="text-blue-700 dark:text-blue-200 font-semibold">Edit Mode Active</p>
                  <p className="text-blue-600/80 dark:text-blue-300/80 text-sm">Editing link ID: <span className="font-mono font-bold">{editLinkData?.id}</span></p>
                </div>
              </motion.div>
            )}

            {/* Platform Input */}
            <motion.div
              variants={itemVariants}
              className="space-y-2"
            >
              <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-semibold text-lg">
                <FaLink className="text-purple-600 dark:text-purple-400" />
                Platform Name
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 group-focus-within:text-purple-600 dark:group-focus-within:text-purple-400 transition-colors z-10">
                  <FaLink className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="e.g., linkedin, instagram, facebook, github"
                  value={platform}
                  onChange={(e) => {
                    const newPlatform = (e.target.value).toLowerCase();
                    setPlatform(newPlatform);
                    if (isEditMode) {
                      setSource(newPlatform);
                    }
                  }}
                  disabled={showWarningModal || loading}
                  className="w-full pl-12 pr-4 py-4 bg-white/90 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed lowercase"
                  required
                />
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-500">
                Enter the platform name in lowercase (e.g., "linkedin" not "LinkedIn")
              </p>
            </motion.div>

            {/* Profile Link Input */}
            <motion.div
              variants={itemVariants}
              className="space-y-2"
            >
              <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-semibold text-lg">
                <FaGlobe className="text-blue-600 dark:text-blue-400" />
                Destination URL
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors z-10">
                  <FaGlobe className="w-5 h-5" />
                </div>
                <input
                  type="url"
                  placeholder="https://www.linkedin.com/in/your-profile"
                  value={profileLink}
                  onChange={(e) => setProfileLink(e.target.value)}
                  disabled={showWarningModal || loading}
                  className="w-full pl-12 pr-4 py-4 bg-white/90 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                />
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-500">
                Enter the full URL of your profile on this platform
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <motion.button
                type="submit"
                disabled={loading || showWarningModal}
                whileHover={{ scale: loading ? 1 : 1.05 }}
                whileTap={{ scale: loading ? 1 : 0.95 }}
                className={`flex-1 py-4 px-8 bg-gradient-to-r ${isEditMode ? 'from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700' : 'from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700'} text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {isEditMode ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    {isEditMode ? <FaEdit /> : <FaRocket />}
                    {isEditMode ? "Update Bridge" : "Create Bridge"}
                  </>
                )}
              </motion.button>
              
              {isEditMode && (
                <motion.button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading || showWarningModal}
                  whileHover={{ scale: loading ? 1 : 1.05 }}
                  whileTap={{ scale: loading ? 1 : 0.95 }}
                  className="py-4 px-8 bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-700/50 text-gray-700 dark:text-white font-bold rounded-xl border border-gray-300 dark:border-gray-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <FaTimes />
                  Cancel
                </motion.button>
              )}
            </motion.div>

            {/* Generated Link Display */}
            <AnimatePresence>
              {showBridge && (
                <motion.div
                  initial={{ opacity: 0, y: 20, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -20, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6 p-6 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 backdrop-blur-sm rounded-2xl border border-purple-400/30"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <FaCheckCircle className="text-green-600 dark:text-green-400 text-xl" />
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">Your Personalized Link:</h3>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-gray-200 dark:border-white/10">
                    <span
                      ref={linkRef}
                      className="break-all font-mono text-base md:text-lg text-gray-900 dark:text-gray-200 flex-1"
                    >
                      {`https://clickly.cv/${username}/${source}`}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={copyToClipboard}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 p-3 rounded-lg transition-all duration-300 flex-shrink-0"
                      title="Copy link"
                    >
                      <MdContentCopy className="text-xl text-white" />
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.form>
        </motion.div>
      </div>

      {/* Warning Modal */}
      <AnimatePresence>
        {showWarningModal && editLinkData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 dark:bg-black/80 backdrop-blur-sm"
            onClick={handleCancelUpdate}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/95 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full p-6 md:p-8 border-2 border-yellow-400/50 dark:border-yellow-500/50 relative overflow-hidden"
            >
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-50/50 via-orange-50/50 to-red-50/50 dark:from-yellow-600/10 dark:via-orange-600/10 dark:to-red-600/10" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <motion.div
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 p-4 rounded-xl"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <FaExclamationTriangle className="text-3xl text-white" />
                  </motion.div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                    Platform Change Warning
                  </h3>
                </div>
                
                <div className="mb-6">
                  <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                    Changing the platform from <span className="font-bold text-red-600 dark:text-red-400">"{editLinkData.source}"</span> to <span className="font-bold text-green-600 dark:text-green-400">"{platform.toLowerCase()}"</span> will make your old link invalid!
                  </p>
                  
                  <div className="bg-gray-50 dark:bg-gray-800/30 rounded-2xl p-4 space-y-4 mb-4 border border-gray-200 dark:border-white/10">
                    <div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-400 mb-2 flex items-center gap-2">
                        <FaTimes className="text-red-600 dark:text-red-400" />
                        Old Link (will become invalid):
                      </p>
                      <p className="text-sm font-mono text-red-600 dark:text-red-400 break-all bg-red-100 dark:bg-red-500/10 p-3 rounded-lg border border-red-300 dark:border-red-500/20">
                        https://clickly.cv/{username}/{editLinkData.source}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-400 mb-2 flex items-center gap-2">
                        <FaCheckCircle className="text-green-600 dark:text-green-400" />
                        New Link:
                      </p>
                      <p className="text-sm font-mono text-green-600 dark:text-green-400 break-all bg-green-100 dark:bg-green-500/10 p-3 rounded-lg border border-green-300 dark:border-green-500/20">
                        https://clickly.cv/{username}/{platform.toLowerCase()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-100 dark:bg-yellow-500/20 border border-yellow-300 dark:border-yellow-400/30 rounded-xl p-4">
                    <p className="text-sm text-yellow-800 dark:text-yellow-300 flex items-start gap-2">
                      <FaExclamationTriangle className="text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span>Anyone who has bookmarked or shared the old link will need to use the new one.</span>
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.button
                    type="button"
                    onClick={handleCancelUpdate}
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.05 }}
                    whileTap={{ scale: loading ? 1 : 0.95 }}
                    className="flex-1 py-3 px-6 bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-700/50 text-gray-700 dark:text-white font-semibold rounded-xl border border-gray-300 dark:border-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={handleConfirmUpdate}
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.05 }}
                    whileTap={{ scale: loading ? 1 : 0.95 }}
                    className="flex-1 py-3 px-6 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Updating...
                      </>
                    ) : (
                      <>
                        Continue Anyway
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreateBridge;
