import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { FaEye, FaExternalLinkAlt, FaSpinner, FaSync, FaChevronDown } from 'react-icons/fa'
import api from '../../utils/api'

const TemplatePreview = () => {
  const { username } = useSelector((store) => store.admin.user);
  const [template, setTemplate] = useState('default');
  const [availableTemplates, setAvailableTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [previewUrl, setPreviewUrl] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [iframeError, setIframeError] = useState(false);
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
  const iframeRef = useRef(null);

  // Fetch available templates
  useEffect(() => {
    const fetchAvailableTemplates = async () => {
      try {
        const res = await api.get('/project/templates');
        if (res.status === 200 && res.data.success) {
          setAvailableTemplates(res.data.templates || []);
        }
      } catch (error) {
        console.error("Error fetching available templates:", error);
        // Fallback to default templates if API fails
        setAvailableTemplates([
          { template: 'default', displayName: 'Default' },
          { template: 'minimal', displayName: 'Minimal' },
          { template: 'modern', displayName: 'Modern' },
          { template: 'dark', displayName: 'Dark' },
          { template: 'light', displayName: 'Light' }
        ]);
      } finally {
        setLoadingTemplates(false);
      }
    };

    fetchAvailableTemplates();
  }, []);

  // Load user's selected template and create preview URL
  useEffect(() => {
    const loadTemplate = async () => {
      if (!username) return;
      
      try {
        const res = await api.post('/settings/get', { username }, { withCredentials: true });
        if (res.status === 200 && res.data.success) {
          const selectedTemplate = res.data.settings?.template || 'default';
          setTemplate(selectedTemplate);
        }
        
        // Create preview URL using the API baseURL
        // Extract base URL from api instance (defaults to localhost:8080 or use env)
        const apiBaseUrl = api.defaults.baseURL || 'http://localhost:8080';
        // Remove trailing slash if present
        const baseUrl = apiBaseUrl.replace(/\/$/, '');
        // Add timestamp to force refresh when needed
        const url = `${baseUrl}/${username}?preview=${Date.now()}`;
        console.log("Setting preview URL:", url);
        setPreviewUrl(url);
      } catch (error) {
        console.error("Error loading template:", error);
        // Fallback to default preview URL
        const apiBaseUrl = api.defaults.baseURL || 'http://localhost:8080';
        const baseUrl = apiBaseUrl.replace(/\/$/, '');
        const url = `${baseUrl}/${username}?preview=${Date.now()}`;
        console.log("Setting fallback preview URL:", url);
        setPreviewUrl(url);
      } finally {
        setLoading(false);
      }
    };

    loadTemplate();
  }, [username]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showTemplateDropdown && !event.target.closest('.template-dropdown-container')) {
        setShowTemplateDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTemplateDropdown]);

  // Add timeout to detect if iframe fails to load
  useEffect(() => {
    if (!previewUrl || loading) return;
    
    const timeout = setTimeout(() => {
      // Check if iframe has loaded after 5 seconds
      try {
        const iframe = iframeRef.current;
        if (iframe && iframe.contentDocument) {
          // If we can access contentDocument, it loaded
          console.log("Iframe loaded successfully");
        } else {
          // Can't access (cross-origin) but that's okay - check if src is set
          if (iframe && iframe.src) {
            console.log("Iframe src set, should be loading");
          }
        }
      } catch (e) {
        // Cross-origin - this is expected and normal
        console.log("Cross-origin iframe (expected behavior)");
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [previewUrl, loading]);

  const refreshPreview = () => {
    setRefreshKey(prev => prev + 1);
    setIframeError(false);
    updatePreviewUrl(template);
  };

  const updatePreviewUrl = (selectedTemplate) => {
    const apiBaseUrl = api.defaults.baseURL || 'http://localhost:8080';
    const baseUrl = apiBaseUrl.replace(/\/$/, '');
    const newUrl = `${baseUrl}/${username}?template=${selectedTemplate}&preview=${Date.now()}`;
    setPreviewUrl(newUrl);
    if (iframeRef.current) {
      iframeRef.current.src = newUrl;
    }
  };

  const handleTemplateChange = (selectedTemplate) => {
    setTemplate(selectedTemplate);
    setShowTemplateDropdown(false);
    updatePreviewUrl(selectedTemplate);
  };

  if (!username) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-4 md:mx-6 lg:mx-8 mb-6"
    >
      <div className="bg-white/80 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 md:p-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-xl">
              <FaEye className="text-xl text-white" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                Your LinkHub Preview
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Template: <span className="font-semibold capitalize">{template}</span> • 
                <span className="ml-1 text-xs">Shows public view</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Template Selector Dropdown */}
            <div className="relative template-dropdown-container">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowTemplateDropdown(!showTemplateDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl transition-colors text-sm font-semibold"
                title="Select template to preview"
              >
                <span className="capitalize">
                  {availableTemplates.find(t => t.template === template)?.displayName || template}
                </span>
                <FaChevronDown className={`text-xs transition-transform ${showTemplateDropdown ? 'rotate-180' : ''}`} />
              </motion.button>
              
              {showTemplateDropdown && !loadingTemplates && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-2xl z-50 max-h-64 overflow-y-auto">
                  {availableTemplates.length > 0 ? (
                    availableTemplates.map((t) => (
                      <button
                        key={t.template}
                        onClick={() => handleTemplateChange(t.template)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors ${
                          t.template === template
                            ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 font-semibold'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <div className="capitalize">{t.displayName || t.template}</div>
                        {t.description && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {t.description}
                          </div>
                        )}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                      No templates available
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={refreshPreview}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl transition-colors text-sm font-semibold"
              title="Refresh preview to see latest changes"
            >
              <FaSync className="text-xs" />
              <span>Refresh</span>
            </motion.button>
            <a
              href={previewUrl.split('?')[0]}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors text-sm font-semibold"
            >
              <span>View Live</span>
              <FaExternalLinkAlt className="text-xs" />
            </a>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-96 bg-gray-100 dark:bg-gray-800 rounded-2xl">
            <FaSpinner className="animate-spin text-purple-600 text-3xl" />
          </div>
        ) : (
          <div className="relative w-full bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 shadow-inner">
            {/* Browser Chrome */}
            <div className="absolute top-0 left-0 right-0 h-10 bg-gray-200 dark:bg-gray-700 flex items-center px-4 gap-2 z-10 border-b border-gray-300 dark:border-gray-600">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div className="ml-4 flex-1 bg-white dark:bg-gray-800 rounded px-3 py-1 text-xs text-gray-600 dark:text-gray-400 truncate">
                {previewUrl.split('?')[0]}
              </div>
            </div>
            {/* Iframe Container */}
            <div className="relative w-full h-[600px] md:h-[700px] overflow-auto mt-10">
              {iframeError ? (
                <div className="flex flex-col items-center justify-center h-full bg-gray-100 dark:bg-gray-800 rounded-2xl p-8">
                  <FaEye className="text-4xl text-gray-400 mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
                    Unable to load preview. This might happen if:
                  </p>
                  <ul className="text-sm text-gray-500 dark:text-gray-500 text-center space-y-2 mb-6">
                    <li>• Your profile doesn't have any public links yet</li>
                    <li>• Your profile information is not set up</li>
                    <li>• The page is still loading</li>
                  </ul>
                  <a
                    href={previewUrl.split('?')[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors text-sm font-semibold"
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
                    // Check if iframe content is accessible
                    try {
                      const iframe = iframeRef.current;
                      if (iframe && iframe.contentWindow) {
                        // If we can access contentWindow, it loaded successfully
                        console.log("Iframe loaded successfully");
                      }
                    } catch (e) {
                      // Cross-origin restrictions - this is normal, but iframe should still work
                      console.log("Cross-origin iframe (expected)");
                    }
                  }}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TemplatePreview;

