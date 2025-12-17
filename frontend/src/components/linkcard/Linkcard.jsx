import React, { useRef } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { MdContentCopy } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { FaEdit, FaTrash, FaExternalLinkAlt, FaMousePointer } from "react-icons/fa";
import api from "../../utils/api";
import { setLinks } from "../../redux/userSlice";
import { setEditLinkData } from "../../redux/pageSlice";
import { FcImageFile } from "react-icons/fc";

const Linkcard = ({ sources }) => {
  const linkRef = useRef(null);
  const { username } = useSelector((store) => store.admin.user);
  const links = useSelector((store) => store.admin.links);
  const dispatch = useDispatch();

  const { source, destination, clicked, _id } = sources;

  const handleDeleteLink = async (id) => {
    try {
      const res = await api.post('/source/deletelink', { id: id }, { withCredentials: true });
      if (res.status === 200 && res.data.success) {
        const tempArr = links.filter(link => link._id != id);
        dispatch(setLinks(tempArr));
        toast.success("Bridge has been deleted successfully!");
      }
    } catch (err) {
      const message = err.response?.data?.message || "Server Internal Error";
      toast.error(message);
    }
  };

  const handleEditLink = (id) => {
    const linkToEdit = links.find(link => link._id === id);
    if (!linkToEdit) {
      toast.error("Link not found");
      return;
    }
    
    dispatch(setEditLinkData({
      id: linkToEdit._id,
      source: linkToEdit.source,
      destination: linkToEdit.destination
    }));
    
    setTimeout(() => {
      const createBridgeElement = document.querySelector('[data-create-bridge]');
      if (createBridgeElement) {
        createBridgeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const copyToClipboard = () => {
    const linkText = linkRef.current.innerText;
    navigator.clipboard
      .writeText(linkText)
      .then(() => {
        toast.success("Link copied to clipboard!");
      })
      .catch((err) => {
        toast.error("Failed to copy!");
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-6 md:p-8 overflow-hidden relative group"
    >
      {/* Gradient Background on Hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Click Counter Section */}
          <motion.div
            className="hidden md:flex flex-col items-center justify-center border-r-2 border-dashed border-white/20 dark:border-gray-600 pr-6 min-w-[120px]"
            whileHover={{ scale: 1.1 }}
          >
            <motion.div
              className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 rounded-2xl shadow-lg mb-3"
              whileHover={{ rotate: 5, scale: 1.1 }}
            >
              <FaMousePointer className="text-3xl text-white" />
            </motion.div>
            <motion.div
              className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              {clicked || 0}
            </motion.div>
            <span className="bg-white/10 dark:bg-gray-800/50 px-4 py-2 rounded-lg text-sm font-semibold text-gray-900 dark:text-gray-200 border border-white/20">
              Clicks
            </span>
          </motion.div>

          {/* Main Content */}
          <div className="flex-1 space-y-4">
            {/* Platform Name */}
            <div>
              <motion.h3
                className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-2"
                whileHover={{ scale: 1.05 }}
              >
                {source.toUpperCase()}
              </motion.h3>
              <p className="font-mono text-sm md:text-base text-gray-700 dark:text-gray-400 break-all">
                {destination}
              </p>
            </div>

            {/* Personalized Link */}
            <div className="p-4 bg-gray-900/50 dark:bg-gray-800/30 rounded-2xl border border-gray-600/30 dark:border-white/10">
              <p className="text-xs text-gray-300 dark:text-gray-500 mb-2 font-semibold">
                Your Personalized Link:
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <span
                  ref={linkRef}
                  className="break-all font-mono text-base md:text-lg text-white dark:text-gray-200 flex-1 min-w-0"
                >
                  {`https://clickly.cv/${username}/${source}`}
                </span>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={copyToClipboard}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 p-2.5 rounded-lg transition-all duration-300 flex-shrink-0"
                  title="Copy link"
                >
                  <MdContentCopy className="text-xl text-white" />
                </motion.button>
              </div>
            </div>

            {/* Mobile Click Counter */}
            <div className="md:hidden flex items-center gap-4 p-4 bg-white/5 dark:bg-gray-800/30 rounded-2xl border border-white/10">
              <motion.div
                className="bg-gradient-to-r from-blue-600 to-cyan-600 p-3 rounded-xl"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <FaMousePointer className="text-2xl text-white" />
              </motion.div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{clicked || 0}</div>
                <div className="text-xs text-gray-700 dark:text-gray-500">Total Clicks</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <motion.button
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleDeleteLink(_id)}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white p-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
                title="Delete link"
              >
                <FaTrash className="text-lg" />
                <span className="hidden sm:inline">Delete</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleEditLink(_id)}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white p-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
                title="Edit link"
              >
                <FaEdit className="text-lg" />
                <span className="hidden sm:inline">Edit</span>
              </motion.button>

              <motion.a
                href={`https://clickly.cv/${username}/${source}`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white p-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
                title="Open link"
              >
                <FaExternalLinkAlt className="text-lg" />
                <span className="hidden sm:inline">Open</span>
              </motion.a>

              <motion.button
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleEditLink(_id)}
                className="bg-white/10 dark:bg-gray-800/50 hover:bg-white/20 dark:hover:bg-gray-700/50 text-gray-900 dark:text-white p-3 rounded-xl transition-all duration-300 border border-white/20 flex items-center gap-2"
                title="Change image"
              >
                <FcImageFile className="text-xl" />
                <span className="hidden sm:inline">Image</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Linkcard;
