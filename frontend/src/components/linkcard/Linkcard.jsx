import React, { useRef } from "react";
import toast from "react-hot-toast";
import { MdContentCopy } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import api from "../../utils/api";
import { setLinks } from "../../redux/userSlice";
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
       
        toast.success("bridge has been deleted successfully!")
      }
    }catch(err){
      const message=err.response?.data?.message || "Server Internal Error"
      toast.error(message)
    }
  }
  const handleEditLink=async(id)=>{
    try{
      const res=await api.post('/source/editlink',{id:id},{withCredentials:true})
      if(res.status===200&&res.data.success){
        // const tempArr=links.filter(link=>link._id!=id)
        dispatch(setLinks(tempArr))
       
        toast.success("bridge has been edited successfully!")
      }
    }catch(err){
      const message=err.response?.data?.message || "Server Internal Error"
      toast.error(message)
    }
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
    <div className=" flex  bg-slate-200 items-center mx-4 p-5 my-2 shadow-md rounded-lg relative gap-4 hover:bg-black/20 transition-all duration-700">
      
      {/* linkLogo */}
      <div className="hidden md:flex flex-col items-center border-r-2 border-dashed border-black pr-5 h-full gap-2">
       <span className="bg-blue-700/80 size-16 rounded-full flex items-center justify-center font-extrabold text-lg"> {clicked}</span>
       <span className="bg-black/80 px-4 py-2 rounded-md text-white ">Clicked</span>
      </div>

      {/* LinkContent */}
      <div className="flex flex-col space-y-2">
        {/* plateform */}
        <div>
          <span className="text-3xl font-bold text-blue-900 font-serif">
            {source}
          </span>
        </div>
        {/* destination */}
        <div>
          <span className="font-mono text-lg break-all">{destination}</span>
        </div>

        {/* bridge */}
        <div className="">
          <div className="px-4 py-2 bg-black/30 text-white rounded-md flex items-center break-words gap-3">
            <span className="break-all font-mono" ref={linkRef}>
              {`https://linkb-one.vercel.app/${username}/${source}`}
            </span>
            <span>
              <MdContentCopy
                className="hover:text-blue-700 active:text-black cursor-pointer"
                onClick={copyToClipboard}
              />
            </span>
          </div>
        </div>
        {/* clicked section for small */}
        <div className="md:hidden flex items-center py-2 border-b-2 border-dashed border-black pr-5 h-full gap-2">
       <span className="bg-blue-700/80 size-12 rounded-full flex items-center justify-center font-extrabold text-lg"> {clicked}</span>
       <span className="bg-black/80 px-4 py-2 rounded-md text-white ">Clicked</span>
      </div>

        {/* Edit section */}
        <div className="flex  bg-white pl-6 rounded-md ">
          
          <button className="text-black text-2xl hover:bg-black/10 active:bg-black/50 rounded-full p-3" onClick={()=>handleDeleteLink(_id)}><MdDelete className="text-red-900 text-2xl"/></button>
          <button className="text-black text-2xl hover:bg-black/10 active:bg-black/50 rounded-full p-3" onClick={()=>handleEditLink(_id)}><FaEdit /></button>
          <button  className="text-black text-2xl hover:bg-black/10 active:bg-black/50 rounded-full p-3" onClick={()=>handleEditLink(_id)}><FcImageFile /></button>
          
          

        </div>
      </div>
    </div>
  );
};

export default Linkcard;
