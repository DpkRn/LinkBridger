// src/ProfilePage.js

import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { MdEditDocument } from "react-icons/md";

const ProfilePage = () => {
  // State variables for profile information
  const [name, setName] = useState("");
  const [passion, setPassion] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState();
  const [image,setImage]=useState("profile.png")
  const [isEditable,setEditable]=useState(false)
  const [hover,setHover]=useState(false);
  const [loader,setLoader]=useState(false)
  const [imageLoader,setImageLoading]=useState(false)

const fileInputRef=useRef(null)
  const {username}=useSelector((store)=>store.admin.user)



  const handleSaveEditClick=async()=>{
    if(isEditable){
      try{
        setLoader(true)
        const res=await api.post('/profile/update',{username,name,passion,location,bio},{withCredentials:true});
        if(res.status===201&&res.data.success){
          toast.success(res.data.msg)
          setEditable(false)
        }

      }catch(error){
        const msg=error.response?.data?.msg||"server internal error !"
        toast.error(msg);
      }finally{
        setLoader(false)
      }
      
    }else{
      setEditable(true)
    }
  }


  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };


  const handleImageChange = async (event) => {
    event.preventDefault();
    try{
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async() => {
          console.log("sending image")
          setImageLoading(true)
          const response = await api.post('/profile/updatepic', {username,image:reader.result} ,{
            withCredentials: true,
          });
          if (response.status === 201 && response.data.success) {
            
            console.log(response.data.resImage)
            setImageLoading(false)
            setImage(response.data.resImage);
            
    
            toast.success("Image updated successfully ");
          } else {
            
            toast.error("something got wrong ! try again");
            setImageLoading(false)
          }
         
        }; 
        reader.onerror(error=>{
          console.log("image error:",error)
          toast.error(error);
          setImageLoading(false)
        })   
      }
    }catch(error){
      const message=error.response?.data?.msg || "server error"
      setImageLoading(false);
    }finally{
      setImageLoading(false)
    }
  };
  


  useEffect(()=>{
    const getProfileInfo=async()=>{
      try{
        const profileinfo=await api.post('/profile/getprofileinfo',{username},{withCredentials:true})
        if(profileinfo.status==200&&profileinfo.data.success){
          const {name,location,bio,passion,image}=profileinfo.data.userinfo
            setName(name);
            setLocation(location)
            setBio(bio)
            setPassion(passion)
            setImage(image)
        }
      }catch(error){
        console.log("error while getting profile info")
        const message=error.response?.data?.msg||"server internal error"
        toast.error(message)
      }
    }
    if(username){
      getProfileInfo()
    }
  },[username])

  return (
    <div className="">
    <div className="min-h-screen flex-col gap-1 bg-gradient-to-br  from-pink-300 via-sky-300 to-blue-800 flex md:flex-row flex-nowrap   justify-center p-6">
      <div className="bg-white/40 shadow-lg rounded-lg p-6 md:p-12 flex-shrink-0 max-w-md w-full flex-[1]">
        {/* Profile Picture */}
        <div className="flex justify-center mb-6 relative">
         <div className="relative rounded-full w-32 h-32 border-2 overflow-hidden  border-indigo-500 " 
          onMouseEnter={()=>setHover(true)}
          onMouseLeave={()=>setHover(false)}
         >
         <img
            src={image}
            alt="Profile"
            className="rounded-full w-32 h-32 object-cover "
          />

          {hover&&<button className="rounded-full w-32 h-32  absolute top-0 left-0 flex justify-center items-center bg-white/40 backdrop-blur-md" onClick={handleFileInputClick}><MdEditDocument className="w-[48px] h-[48px] text-blue-800  "/></button>}

          {imageLoader&&<div className="rounded-full w-32 h-32  absolute top-0 left-0 flex justify-center items-center bg-white/40 backdrop-blur-md ">
            <svg aria-hidden="true" role="status" class="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
</svg>
          </div>}

          <input
              type="file"
              className="hidden"
              onChange={handleImageChange}
              name="profile-image"
              accept="[.jpg, .png, .jpeg, .svg, .webp]"
              ref={fileInputRef}
            />

         </div>

        </div>

        {/* Profile Information */}
        <div className="text-center space-y-4">
          <input
            type="text"
            className={`${isEditable?"":"border-none"} block  bg-transparent w-full text-center text-2xl font-semibold text-gray-800 border-b border-gray-300 focus:outline-none focus:border-indigo-500"`}
            value={name}
            placeholder="Name"
            disabled={!isEditable}
            onChange={(e) => setName(e.target.value)}
          />
          @<span className="font-thin text-sm">{username}</span>
          <input
            type="text"
            className={`${isEditable?"":"border-none"} block w-full bg-transparent text-center text-gray-500 border-b border-gray-300 focus:outline-none focus:border-indigo-500`}
            value={location}
            placeholder="Location"
            disabled={!isEditable}
            onChange={(e) => setLocation(e.target.value)}
          />
          <input
            type="text"
            className={`${isEditable?"":"border-none"} block w-full bg-transparent text-center text-sm text-gray-400 border-b border-gray-300 focus:outline-none focus:border-indigo-500`}
            value={passion}
            placeholder="Passion"
            disabled={!isEditable}
            onChange={(e) => setPassion(e.target.value)}
          />
        </div>

        {/* Bio Section */}
        <div className="mt-6 text-center">
          <textarea
            className={`${isEditable?"":"border-none"} w-full text-center bg-transparent text-gray-600 border border-gray-300 rounded-md p-2 focus:outline-none focus:border-indigo-500`}
            rows="4"
            value={bio}
            placeholder="Bio"
            disabled={!isEditable}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-center">
          <button
            className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 focus:outline-none flex justify-center items-center"
            onClick={() => handleSaveEditClick()}
          >
           {loader&&<svg aria-hidden="true" role="status" class="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
</svg>} {isEditable?"Save":"Edit"}
          </button>
        </div>

        {/* Social Links */}
        <div className="mt-6 flex justify-center space-x-4">
          <a
            href="#"
            className="text-indigo-500 hover:text-indigo-700"
            aria-label="Twitter"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.32 4.32 0 0 0 1.88-2.37 8.59 8.59 0 0 1-2.72 1.03 4.28 4.28 0 0 0-7.29 3.9A12.1 12.1 0 0 1 3.16 4.9a4.28 4.28 0 0 0 1.33 5.71 4.26 4.26 0 0 1-1.94-.53v.05a4.28 4.28 0 0 0 3.43 4.19 4.3 4.3 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.97 8.57 8.57 0 0 1-5.3 1.83c-.34 0-.67-.02-1-.06A12.08 12.08 0 0 0 8.68 21c7.88 0 12.2-6.52 12.2-12.2 0-.19 0-.38-.01-.57A8.64 8.64 0 0 0 22.46 6z" />
            </svg>
          </a>
          <a
            href="#"
            className="text-indigo-500 hover:text-indigo-700"
            aria-label="LinkedIn"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M4.98 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm.02 5H2V21h3V8h-.02zm7.06 0h-3V21h3v-7.75c0-1.85 2-2 2-2s2 .15 2 2V21h3V12.9c0-4.61-4-4.9-4-4.9s-4 .29-4 4.9V21z" />
            </svg>
          </a>
          <a
            href="#"
            className="text-indigo-500 hover:text-indigo-700"
            aria-label="GitHub"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M12 2a10 10 0 0 0-3.16 19.48c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.15-3.37-1.15-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.06 1.53 1.06.89 1.52 2.34 1.08 2.91.83.09-.64.35-1.08.63-1.33-2.22-.26-4.56-1.12-4.56-4.97 0-1.1.39-2 1.03-2.69-.1-.26-.45-1.29.1-2.7 0 0 .84-.27 2.75 1.03a9.55 9.55 0 0 1 5 0c1.9-1.3 2.75-1.03 2.75-1.03.55 1.41.2 2.44.1 2.7.64.7 1.03 1.6 1.03 2.69 0 3.86-2.35 4.71-4.58 4.96.36.31.68.92.68 1.85v2.75c0 .27.18.59.69.48A10 10 0 0 0 12 2z" />
            </svg>
          </a>
        </div>
      </div>
      <div className="flex-[2] bg-white/30 flex items-center justify-center  rounded-md"> not completed yet</div>
    </div>
    </div>
  );
};

export default ProfilePage;
