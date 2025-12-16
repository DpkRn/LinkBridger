import { useRef, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { MdContentCopy } from "react-icons/md";
import api from '../../utils/api';
import { setLinks } from '../../redux/userSlice';
import { setEditLinkData, clearEditLinkData } from '../../redux/pageSlice';

const CreateBridge = () => {
  const dispatch=useDispatch()
  const [loading,setLoading]=useState(false)
  const [platform, setPlatform] = useState('');
  const [source,setSource]=useState('')
  const [profileLink, setProfileLink] = useState('');
  const [showBridge,setShowBridge]=useState(false)
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState(null);
  const linkRef = useRef(null);
  const { username,_id } = useSelector((store) => store.admin.user);
  let  links  = useSelector((store) => store.admin.links);
  const editLinkData = useSelector((store) => store.page.editLinkData);
  const isEditMode = editLinkData !== null;

  // Populate form when edit mode is activated
  useEffect(() => {
    if (editLinkData) {
      // Normalize platform to lowercase for consistency
      // This ensures comparison works correctly even if database has mixed-case values
      const normalizedPlatform = editLinkData.source.toLowerCase().trim();
      setPlatform(normalizedPlatform);
      setProfileLink(editLinkData.destination);
      setSource(normalizedPlatform);
      setShowBridge(false);
    } else {
      // Reset form when not in edit mode
      setPlatform('');
      setProfileLink('');
      setSource('');
      setShowBridge(false);
    }
  }, [editLinkData]);

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (isEditMode && editLinkData) {
      // Check if platform is being changed
      const platformChanged = platform.toLowerCase().trim() !== editLinkData.source.toLowerCase().trim();
      
      // Show warning modal if platform is being changed
      if (platformChanged) {
        setPendingUpdate({
          id: editLinkData.id,
          source: platform.toLowerCase().trim(),
          destination: profileLink.trim()
        });
        setShowWarningModal(true);
        return; // Wait for user confirmation
      }
      
      // Platform not changed, proceed with update directly (destination can still be updated)
      await performUpdate({
        id: editLinkData.id,
        source: platform.toLowerCase().trim(),
        destination: profileLink.trim()
      });
    } else {
      // Create new link
      try{
        setLoading(true)
        const res=await api.post('/source/addnewsource',{userId:_id,username:username,source:platform,destination:profileLink},{withCredentials:true})
        if(res.status===201&&res.data.success){
          links=[...links,res.data.link]
          dispatch(setLinks(links))
          setSource(res.data.link.source)
          setShowBridge(true)
          setPlatform('')
          setProfileLink('')
          toast.success("Bridge has been created successfully!")
        } else if (res.status === 201 && !res.data.success) {
          // Handle case where API returns 201 but success is false
          const message = res.data.message || "Creation failed";
          toast.error(message);
        }
      }catch(err){
        const message=err.response?.data?.message || "Server Internal Error"
        toast.error(message)
      }finally{
        // Always reset loading state, regardless of success or failure
        setLoading(false)
      }
    }
  };

  const performUpdate = async (updateData) => {
    try {
      setLoading(true);
      const res = await api.post('/source/editlink', updateData, { withCredentials: true });
        
      if (res.status === 200 && res.data.success) {
        const updatedLink = res.data.link || res.data;
        
        // Check if the link exists in current state
        const linkExists = links.some(link => link._id === editLinkData.id);
        
        let updatedLinks;
        if (linkExists) {
          // Update existing link in array
          updatedLinks = links.map(link => 
            link._id === editLinkData.id ? { ...link, ...updatedLink } : link
          );
        } else {
          // Link was removed from state, add the updated link back
          updatedLinks = [...links, updatedLink];
          toast.warning("Link was restored and updated. It may have been removed from the list.");
        }
        
        dispatch(setLinks(updatedLinks));
        setSource(updatedLink.source);
        setShowBridge(true);
        dispatch(clearEditLinkData());
        toast.success("Bridge has been updated successfully!");
      } else if (res.status === 200 && !res.data.success) {
        // Handle case where API returns 200 but success is false
        const message = res.data.message || "Update failed";
        toast.error(message);
      }
    } catch (err) {
      const message = err.response?.data?.message || "Server Internal Error";
      toast.error(message);
    } finally {
      // Always reset loading state, regardless of success or failure
      setLoading(false);
    }
  };

  const handleConfirmUpdate = async () => {
    // Set loading state BEFORE closing modal to prevent form interaction
    // This ensures form inputs remain disabled during the async update
    setLoading(true);
    setShowWarningModal(false);
    // Use current form state instead of stale pendingUpdate
    // This ensures any changes made while modal was open are included
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
    const linkText = linkRef.current.innerText; // Get the text from the ref
    navigator.clipboard.writeText(linkText)
      .then(() => {
        toast.success("Link copied to clipboard!"); // Show notification
      })
      .catch((err) => {
        toast.error("Failed to copy!"); // Show error message if failed
      });
  };
  return (
    <div className="h-full bg-gradient-to-r from-slate-100 via-lime-100 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300" data-create-bridge>
      <form  
        onSubmit={handleSubmit}
        className="p-10 rounded-lg shadow-2xl space-y-4 w-full bg-white/80 dark:bg-gray-800/80 transition-colors duration-300"
      >
        <h1 className="text-2xl font-bold text-gray-700 dark:text-gray-200 transition-colors duration-300">
          {isEditMode ? "Edit Social Profile Bridge" : "Social Profile Bridge"}
        </h1>

        {isEditMode && (
          <div className="bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-lg p-3 text-blue-800 dark:text-blue-200 text-sm">
            Editing link ID: <span className="font-semibold">{editLinkData?.id}</span>
          </div>
        )}

        <input
          type="text"
          placeholder="Platform (e.g., linkedin, instagram, facebook)"
          value={platform}
          onChange={(e) => {
            const newPlatform = (e.target.value).toLowerCase();
            setPlatform(newPlatform);
            // Update source state when platform changes in edit mode
            if (isEditMode) {
              setSource(newPlatform);
            }
          }}
          disabled={showWarningModal || loading}
          className="p-3 w-full md:w-[80%] lowercase border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 outline-none transition-all transform hover:scale-105 duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          required
        />

        <input
          type="url"
          placeholder={`Profile Link (e.g., https://www.linkedin.com/...../)`}
          value={profileLink}
          onChange={(e) => setProfileLink(e.target.value)}
          disabled={showWarningModal || loading}
          className="p-3 w-full md:w-[80%] border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 outline-none transition-all transform hover:scale-105 duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          required
        />

        <div className="flex gap-3">
          <button
            type="submit"
            className="py-3 px-6 bg-gradient-to-r from-purple-500 to-indigo-500 dark:from-purple-600 dark:to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-500 hover:rotate-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            disabled={loading || showWarningModal}
          >
            {loading 
              ? (isEditMode ? "Updating..." : "Creating...") 
              : (isEditMode ? "Update Bridge" : "Create New")
            }
          </button>
          
          {isEditMode && (
            <button
              type="button"
              className="py-3 px-6 bg-gray-500 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-700 text-white font-bold rounded-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              onClick={handleCancel}
              disabled={loading || showWarningModal}
            >
              Cancel
            </button>
          )}
        </div>
        {/* bridge */}
        {showBridge&&<div className="">
          <div className="px-4 py-2 bg-black/30 dark:bg-gray-700/50 text-white dark:text-gray-200 rounded-md flex items-center break-words gap-3 transition-colors duration-300">
            <span className="break-all font-mono" ref={linkRef}>
              {`https://clickly.cv/${username}/${source}`}
            </span>
            <span>
              <MdContentCopy
                className="hover:text-blue-700 dark:hover:text-blue-400 active:text-black dark:active:text-white cursor-pointer transition-colors duration-200"
                onClick={copyToClipboard}
              />
            </span>
          </div>
        </div>}
      </form>

      {/* Warning Modal - Outside form to avoid form submission issues */}
      {showWarningModal && editLinkData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-md w-full mx-4 p-6 border-2 border-yellow-400 dark:border-yellow-500">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Platform Change Warning
              </h3>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                Changing the platform from <span className="font-semibold text-red-600 dark:text-red-400">"{editLinkData.source}"</span> to <span className="font-semibold text-green-600 dark:text-green-400">"{platform.toLowerCase()}"</span> will make your old link invalid!
              </p>
              
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mb-3 space-y-2">
                <div>
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Old Link (will become invalid):</p>
                  <p className="text-sm font-mono text-red-600 dark:text-red-400 break-all">
                    https://clickly.cv/{username}/{editLinkData.source}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">New Link:</p>
                  <p className="text-sm font-mono text-green-600 dark:text-green-400 break-all">
                    https://clickly.cv/{username}/{platform.toLowerCase()}
                  </p>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ⚠️ Anyone who has bookmarked or shared the old link will need to use the new one.
              </p>
            </div>
            
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={handleCancelUpdate}
                disabled={loading}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmUpdate}
                disabled={loading}
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Updating..." : "Continue Anyway"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateBridge;
