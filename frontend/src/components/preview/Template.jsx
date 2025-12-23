import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { FaEye, FaSpinner } from 'react-icons/fa'
import api from '../../utils/api'
import { getUserLinkUrl } from '../../lib/utils'

/**
 * Template Component - Displays LinkHub preview in a realistic smartphone frame
 * @param {string} className - Additional CSS classes
 * @param {string} height - Height of the content area (default: '600px' or '700px' on md screens)
 * @param {boolean} showStatusBar - Whether to show the status bar (default: true)
 * @param {boolean} showBrowserChrome - Whether to show browser chrome/URL bar (default: true)
 * @param {string} template - Optional template to preview (if not provided, uses user's saved template)
 */
const Template = ({ 
  className = "",
  height = "h-[600px] md:h-[700px]",
  showStatusBar = true,
  showBrowserChrome = true,
  template: previewTemplate = null,
  refreshTrigger = 0
}) => {
  const { username } = useSelector((store) => store.admin.user);
  const [template, setTemplate] = useState(previewTemplate || 'default');
  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState('');
  const [iframeError, setIframeError] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const iframeRef = useRef(null);

  // Load user's selected template and create preview URL
  useEffect(() => {
    const loadTemplate = async () => {
      if (!username) {
        setLoading(false);
        return;
      }
      
      try {
        // If previewTemplate is provided, use it; otherwise fetch from settings
        if (previewTemplate) {
          setTemplate(previewTemplate);
        } else {
          const res = await api.post('/settings/get', { username }, { withCredentials: true });
          if (res.status === 200 && res.data.success) {
            const selectedTemplate = res.data.settings?.template || 'default';
            setTemplate(selectedTemplate);
          }
        }
        
        // Create preview URL using environment-aware format
        const selectedTemplate = previewTemplate || template;
        const baseUrl = getUserLinkUrl(username);
        const url = `${baseUrl}?template=${selectedTemplate}&preview=${Date.now()}`;
        console.log("Setting preview URL:", url);
        setPreviewUrl(url);
      } catch (error) {
        console.error("Error loading template:", error);
        // Fallback to default preview URL
        const selectedTemplate = previewTemplate || template || 'default';
        const baseUrl = getUserLinkUrl(username);
        const url = `${baseUrl}?template=${selectedTemplate}&preview=${Date.now()}`;
        console.log("Setting fallback preview URL:", url);
        setPreviewUrl(url);
      } finally {
        setLoading(false);
      }
    };

    loadTemplate();
  }, [username, previewTemplate]);

  // Update preview URL when template changes (if not using previewTemplate prop)
  useEffect(() => {
    if (!username || !template || previewTemplate) return;
    
    const apiBaseUrl = api.defaults.baseURL || 'http://localhost:8080';
    const baseUrl = apiBaseUrl.replace(/\/$/, '');
    const url = `${baseUrl}/${username}?template=${template}&preview=${Date.now()}`;
    setPreviewUrl(url);
    setRefreshKey(prev => prev + 1);
    if (iframeRef.current) {
      iframeRef.current.src = url;
    }
  }, [template, username, previewTemplate]);

  // Refresh preview when refreshTrigger changes (triggered by parent when links update)
  useEffect(() => {
    if (!username || refreshTrigger === 0) return;
    
    const apiBaseUrl = api.defaults.baseURL || 'http://localhost:8080';
    const baseUrl = apiBaseUrl.replace(/\/$/, '');
    const selectedTemplate = previewTemplate || template || 'default';
    const url = `${baseUrl}/${username}?template=${selectedTemplate}&preview=${Date.now()}`;
    setPreviewUrl(url);
    setRefreshKey(prev => prev + 1);
    if (iframeRef.current) {
      iframeRef.current.src = url;
    }
  }, [refreshTrigger, username, template, previewTemplate]);

  if (!username) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`flex justify-center ${className}`}
    >
      <div 
        className="relative mx-auto"
        style={{ width: '375px', maxWidth: '375px' }}
      >
        {/* Phone Frame */}
        <div className="relative bg-gray-900 dark:bg-gray-950 rounded-[2.5rem] p-2 shadow-2xl">
          {/* Phone Notch */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-900 dark:bg-gray-950 rounded-b-2xl z-20"></div>
          
          {/* Phone Screen */}
          <div className="relative bg-white dark:bg-gray-800 rounded-[2rem] overflow-hidden">
            {/* Status Bar */}
            {showStatusBar && (
              <div className="absolute top-0 left-0 right-0 h-6 bg-gray-900 dark:bg-gray-900 flex items-center justify-between px-4 text-white text-xs z-10">
                <span>9:41</span>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-2 border border-white rounded-sm"></div>
                  <div className="w-1 h-1 rounded-full bg-white"></div>
                </div>
              </div>
            )}
            
            {/* Browser Chrome for Phone */}
            {showBrowserChrome && (
              <div className={`absolute ${showStatusBar ? 'top-6' : 'top-0'} left-0 right-0 h-12 bg-gray-200 dark:bg-gray-700 flex items-center px-3 gap-2 z-10 border-b border-gray-300 dark:border-gray-600`}>
                <div className="flex-1 bg-white dark:bg-gray-800 rounded px-2 py-1 text-xs text-gray-600 dark:text-gray-400 truncate">
                  {previewUrl.split('?')[0] || 'LinkHub Preview'}
                </div>
              </div>
            )}
            
            {/* Content Area */}
            <div className={`relative w-full ${height} overflow-auto ${showStatusBar && showBrowserChrome ? 'mt-[3rem]' : showStatusBar || showBrowserChrome ? 'mt-6' : 'mt-0'}`}>
              {loading ? (
                <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800">
                  <FaSpinner className="animate-spin text-purple-600 text-3xl" />
                </div>
              ) : iframeError ? (
                <div className="flex flex-col items-center justify-center h-full bg-gray-100 dark:bg-gray-800 rounded-2xl p-8">
                  <FaEye className="text-4xl text-gray-400 mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 text-center mb-4 text-sm">
                    Unable to load preview. This might happen if:
                  </p>
                  <ul className="text-xs text-gray-500 dark:text-gray-500 text-center space-y-2 mb-6">
                    <li>• Your profile doesn't have any public links yet</li>
                    <li>• Your profile information is not set up</li>
                    <li>• The page is still loading</li>
                  </ul>
                  <a
                    href={previewUrl.split('?')[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors text-xs font-semibold"
                  >
                    Open in New Tab
                  </a>
                </div>
              ) : (
                <iframe
                  key={refreshKey}
                  ref={iframeRef}
                  src={previewUrl}
                  className="w-full h-full border-0"
                  title="LinkHub Preview"
                  loading="lazy"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                  onError={() => {
                    console.error("Iframe load error");
                    setIframeError(true);
                  }}
                  onLoad={() => {
                    setIframeError(false);
                    try {
                      const iframe = iframeRef.current;
                      if (iframe && iframe.contentWindow) {
                        console.log("Iframe loaded successfully");
                      }
                    } catch (e) {
                      console.log("Cross-origin iframe (expected)");
                    }
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Template;

