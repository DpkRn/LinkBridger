import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { MdContentCopy } from "react-icons/md";
import api from '../../utils/api';
import { setLinks } from '../../redux/userSlice';

const CreateBridge = () => {
  const dispatch=useDispatch()
  const [platform, setPlatform] = useState('');
  const [source,setSource]=useState('')
  const [profileLink, setProfileLink] = useState('');
  const [showBridge,setShowBridge]=useState(false)
  const linkRef = useRef(null);
  const { username,_id } = useSelector((store) => store.admin.user);
  let  links  = useSelector((store) => store.admin.links);

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("clickeddddddddd")
    try{
      const res=await api.post('/source/addnewsource',{userId:_id,username:username,source:platform,destination:profileLink})
      if(res.status===201&&res.data.success){
        links=[...links,res.data.link]
        dispatch(setLinks(links))
        setSource(res.data.link.source)
        setShowBridge(true)
        setPlatform('')
        setProfileLink('')
        toast.success("bridge has been made successfully!")
      }
    }catch(err){
      const message=err.response?.data?.message || "Server Internal Error"
      toast.error(message)
    }
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
    <div className="h-full">
      <form  
        className=" p-10  rounded-lg shadow-2xl   space-y-4  w-full"
      >
        <h1 className="text-2xl font-bold text-gray-700 ">
          Social Profile Bridge
        </h1>

        <input
          type="text"
          placeholder="Platform (e.g., linkdin, instagram, facebook)"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="p-3 w-full md:w-[80%] lowercase border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition-transform transform hover:scale-105 duration-300"
          required
        />

        <input
          type="url"
          placeholder={`Profile Link (e.g., https://www.linkdin.com/...../)`}
          value={profileLink}
          onChange={(e) => setProfileLink(e.target.value)}
          className="p-3 w-full md:w-[80%] border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition-transform transform hover:scale-105 duration-300"
          required
        />

        <button
        
          className="py-3 px-6 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold rounded-lg shadow-lg hover:shadow-2xl transform hover:scale-70 transition-transform duration-500 hover:rotate-3"

          onClick={handleSubmit}
        >
          Create New
        </button>
        {/* bridge */}
        {showBridge&&<div className="">
          <div className="px-4 py-2 bg-black/30 text-white rounded-md flex items-center break-words gap-3">
            <span className="break-all font-mono" ref={linkRef}>
              {`http://localhost:8080/${username}/${source}`}
            </span>
            <span>
              <MdContentCopy
                className="hover:text-blue-700 active:text-black cursor-pointer"
                onClick={copyToClipboard}
              />
            </span>
          </div>
        </div>}
      </form>
    </div>
  )}
  export default CreateBridge;
