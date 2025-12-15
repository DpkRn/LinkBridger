import React, { useRef } from "react";
import toast from "react-hot-toast";
import { MdContentCopy } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import api from "../../utils/api";
import { setLinks } from "../../redux/userSlice";
import { setEditLinkData } from "../../redux/pageSlice";
import { FcImageFile } from "react-icons/fc";

const Linkcard = ({ sources }) => {
  const linkRef = useRef(null);
  const { username } = useSelector((store) => store.admin.user);
  const links  = useSelector((store) => store.admin.links);
  const dispatch=useDispatch()

  const { source, destination, clicked,_id } = sources;
  


  const handleDeleteLink=async(id)=>{
    try{
      const res=await api.post('/source/deletelink',{id:id},{withCredentials:true})
      if(res.status===200&&res.data.success){
        const tempArr=links.filter(link=>link._id!=id)
        dispatch(setLinks(tempArr))
       
        toast.success("Bridge has been deleted successfully!")
      }
    }catch(err){
      const message=err.response?.data?.message || "Server Internal Error"
      toast.error(message)
    }
  }
  const handleEditLink=(id)=>{
    const linkToEdit = links.find(link => link._id === id);
    if(!linkToEdit) {
      toast.error("Link not found");
      return;
    }
    
    // Set edit mode with link data - this will populate CreateBridge form
    dispatch(setEditLinkData({
      id: linkToEdit._id,
      source: linkToEdit.source,
      destination: linkToEdit.destination
    }));
    
    // Scroll to CreateBridge component
    setTimeout(() => {
      const createBridgeElement = document.querySelector('[data-create-bridge]');
      if (createBridgeElement) {
        createBridgeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  const copyToClipboard = () => {
    const linkText = linkRef.current.innerText; // Get the text from the ref
    navigator.clipboard
      .writeText(linkText)
      .then(() => {
        toast.success("Link copied to clipboard!"); // Show notification
      })
      .catch((err) => {
        toast.error("Failed to copy!"); // Show error message if failed
      });
  };


  return (
    <div className="flex bg-slate-200 dark:bg-gray-700 items-center mx-4 p-5 my-2 shadow-md rounded-lg relative gap-4 hover:bg-black/20 dark:hover:bg-gray-600 transition-all duration-700">
      
      {/* linkLogo */}
      <div className="hidden md:flex flex-col items-center border-r-2 border-dashed border-black dark:border-gray-400 pr-5 h-full gap-2">
       <span className="bg-blue-700/80 dark:bg-blue-600 size-16 rounded-full flex items-center justify-center font-extrabold text-lg text-white"> {clicked}</span>
       <span className="bg-black/80 dark:bg-gray-800 px-4 py-2 rounded-md text-white dark:text-gray-200">Clicked</span>
      </div>

      {/* LinkContent */}
      <div className="flex flex-col space-y-2">
        {/* platform */}
        <div>
          <span className="text-3xl font-bold text-blue-900 dark:text-blue-400 font-serif transition-colors duration-300">
            {source}
          </span>
        </div>
        {/* destination */}
        <div>
          <span className="font-mono text-lg break-all text-gray-800 dark:text-gray-200 transition-colors duration-300">{destination}</span>
        </div>

        {/* bridge */}
        <div className="">
          <div className="px-4 py-2 bg-black/80 dark:bg-gray-800 text-white dark:text-gray-200 rounded-md flex items-center break-words gap-3 transition-colors duration-300">
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
        </div>
        {/* clicked section for small */}
        <div className="md:hidden flex items-center py-2 border-b-2 border-dashed border-black dark:border-gray-400 pr-5 h-full gap-2">
       <span className="bg-blue-700/80 dark:bg-blue-600 size-12 rounded-full flex items-center justify-center font-extrabold text-lg text-white"> {clicked}</span>
       <span className="bg-black/80 dark:bg-gray-800 px-4 py-2 rounded-md text-white dark:text-gray-200">Clicked</span>
      </div>

        {/* Edit section */}
        <div className="flex bg-white dark:bg-gray-600 pl-6 rounded-md transition-colors duration-300">
          
          <button className="text-black dark:text-white text-2xl hover:bg-black/10 dark:hover:bg-gray-500 active:bg-black/50 dark:active:bg-gray-700 rounded-full p-3 transition-colors duration-200" onClick={()=>handleDeleteLink(_id)}><MdDelete className="text-red-900 dark:text-red-400 text-2xl"/></button>
          <button className="text-black dark:text-white text-2xl hover:bg-black/10 dark:hover:bg-gray-500 active:bg-black/50 dark:active:bg-gray-700 rounded-full p-3 transition-colors duration-200" onClick={()=>handleEditLink(_id)}><FaEdit /></button>
          <button  className="text-black dark:text-white text-2xl hover:bg-black/10 dark:hover:bg-gray-500 active:bg-black/50 dark:active:bg-gray-700 rounded-full p-3 transition-colors duration-200" onClick={()=>handleEditLink(_id)}><FcImageFile /></button>
          
          

        </div>
      </div>
    </div>
  );
};

export default Linkcard;
