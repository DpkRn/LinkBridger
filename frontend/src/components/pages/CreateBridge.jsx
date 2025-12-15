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
  const linkRef = useRef(null);
  const { username,_id } = useSelector((store) => store.admin.user);
  let  links  = useSelector((store) => store.admin.links);
  const editLinkData = useSelector((store) => store.page.editLinkData);
  const isEditMode = editLinkData !== null;

  // Populate form when edit mode is activated
  useEffect(() => {
    if (editLinkData) {
      setPlatform(editLinkData.source);
      setProfileLink(editLinkData.destination);
      setSource(editLinkData.source);
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
      // Update existing link
      try {
        setLoading(true);
        const res = await api.post('/source/editlink', {
          id: editLinkData.id,
          source: platform.toLowerCase(),
          destination: profileLink.trim()
        }, { withCredentials: true });
        
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
          setLoading(false);
          toast.success("Bridge has been updated successfully!");
        }
      } catch (err) {
        const message = err.response?.data?.message || "Server Internal Error";
        toast.error(message);
        setLoading(false);
      }
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
          setLoading(false)
          toast.success("Bridge has been created successfully!")
        }
      }catch(err){
        const message=err.response?.data?.message || "Server Internal Error"
        toast.error(message)
      }finally{
        setLoading(false)
      }
    }
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
        className="p-10 rounded-lg shadow-2xl space-y-4 w-full bg-white/80 dark:bg-gray-800/80 transition-colors duration-300"
      >
        <h1 className="text-2xl font-bold text-gray-700 dark:text-gray-200 transition-colors duration-300">
          {isEditMode ? "Edit Social Profile Bridge" : "Social Profile Bridge"}
        </h1>

        {isEditMode && (
          <div className="bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-lg p-3 text-blue-800 dark:text-blue-200 text-sm">
            Editing: <span className="font-semibold">{editLinkData?.source}</span>
          </div>
        )}

        <input
          type="text"
          placeholder="Platform (e.g., linkedin, instagram, facebook)"
          value={platform}
          onChange={(e) => setPlatform((e.target.value).toLowerCase())}
          className="p-3 w-full md:w-[80%] lowercase border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 outline-none transition-all transform hover:scale-105 duration-300"
          required
          disabled={isEditMode}
        />

        <input
          type="url"
          placeholder={`Profile Link (e.g., https://www.linkedin.com/...../)`}
          value={profileLink}
          onChange={(e) => setProfileLink(e.target.value)}
          className="p-3 w-full md:w-[80%] border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 outline-none transition-all transform hover:scale-105 duration-300"
          required
        />

        <div className="flex gap-3">
          <button
            type="button"
            className="py-3 px-6 bg-gradient-to-r from-purple-500 to-indigo-500 dark:from-purple-600 dark:to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-500 hover:rotate-3"
            onClick={handleSubmit}
          >
            {loading 
              ? (isEditMode ? "Updating..." : "Creating...") 
              : (isEditMode ? "Update Bridge" : "Create New")
            }
          </button>
          
          {isEditMode && (
            <button
              type="button"
              className="py-3 px-6 bg-gray-500 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-700 text-white font-bold rounded-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              onClick={handleCancel}
            >
              Cancel
            </button>
          )}
        </div>
        {/* bridge */}
        {showBridge&&<div className="">
          <div className="px-4 py-2 bg-black/30 dark:bg-gray-700/50 text-white dark:text-gray-200 rounded-md flex items-center break-words gap-3 transition-colors duration-300">
            <span className="break-all font-mono" ref={linkRef}>
              {`https://linkb-one.vercel.app/${username}/${source}`}
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
    </div>
  )}
  export default CreateBridge;
