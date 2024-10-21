import React, { useEffect, useRef } from "react";
import Linkcard from "../linkcard/Linkcard";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { MdContentCopy } from "react-icons/md";
import { setLinks } from "../../redux/userSlice";
import toast from "react-hot-toast";
import api from "../../utils/api";

const LinkPage = () => {
  const navigate = useNavigate();
  const dispatch=useDispatch()
  const linkRef = useRef(null);
  const location = useLocation();
  const sidebarMenu = useSelector((store) => store.page.sidebarMenu);
  const links = useSelector((store) => store.admin.links);
  const username = useSelector((store) => store.admin.user.username);
  const handleCreateNewBridge = () => {
    navigate("/home");
  };
//  useEffect(()=>{
//   const getAllLinks=async()=>{
//     try{
//      const res=await api.post('/source/getallsource',{username},{withCredentials:true});
//      if(res.status===200&&res.data.success){
//        dispatch(setLinks(res.data.sources))
//      }
//     }catch(err){
//      console.log(err)
//      const message=err.response?.data?.message||"Server Internal Error"
//      toast.error(message)
//     }
//    }
//    if(links.length===0){
//     getAllLinks()
//    }
//  },[links])
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
    <div className={` md:p-10 ${sidebarMenu ? "blur-sm" : ""}`}>
      {/* button */}
      {location.pathname === "/links" && (
        <div className="text-right m-8">
          <button
            className="py-3 px-6 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold rounded-lg shadow-lg hover:shadow-2xl transform hover:scale-110 transition-transform duration-500 hover:-rotate-3 active:bg-gradient-to-r active:from-purple-900 active:to-indigo-900"
            onClick={handleCreateNewBridge}
          >
            Create New Bridge
          </button>
        </div>
      )}
      <span>your linktree is live live on:</span> 
      <div className="px-4 py-2 bg-black/30 text-white rounded-md flex items-center break-words gap-3">
      <span className="break-all font-mono" ref={linkRef}>
        {`https://linkb-one.vercel.app/${username}`}
      </span>
      <span>
        <MdContentCopy
          className="hover:text-blue-700 active:text-black cursor-pointer"
          onClick={copyToClipboard}
        />
      </span>
    </div>
      

      {links.length === 0 ? (
        <h1 className="mt-8">
          No links found. add new link by clicking on create new button
        </h1>
      ) : (
        links.map((link) => <Linkcard key={link._id} sources={link} />)
      )}
    </div>
  );
};

export default LinkPage;
