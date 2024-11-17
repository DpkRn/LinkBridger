// src/ProfilePage.js

import React, { useState } from "react";

const ProfilePage = () => {
  // State variables for profile information
  const [name, setName] = useState("Dpk Rn");
  const [title, setTitle] = useState("Full Stack Developer");
  const [location, setLocation] = useState("Delhi");
  const [bio, setBio] = useState(
    "Passionate developer with a love for building scalable web applications. Always eager to learn and explore new technologies."
  );

  return (
    <div className="">
    <div className="min-h-screen flex-col gap-1 bg-gradient-to-br  from-pink-300 via-sky-300 to-blue-800 flex md:flex-row flex-nowrap   justify-center p-6">
      <div className="bg-white/40 shadow-lg rounded-lg p-6 md:p-12 flex-shrink-0 max-w-md w-full flex-[1]">
        {/* Profile Picture */}
        <div className="flex justify-center mb-6">
          <img
            src="profile.jpg"
            alt="Profile"
            className="rounded-full w-32 h-32 border-4 border-indigo-500 object-cover"
          />
        </div>

        {/* Profile Information */}
        <div className="text-center space-y-4">
          <input
            type="text"
            className="block  bg-transparent w-full text-center text-2xl font-semibold text-gray-800 border-b border-gray-300 focus:outline-none focus:border-indigo-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            className="block w-full bg-transparent text-center text-gray-500 border-b border-gray-300 focus:outline-none focus:border-indigo-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            className="block w-full bg-transparent text-center text-sm text-gray-400 border-b border-gray-300 focus:outline-none focus:border-indigo-500"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        {/* Bio Section */}
        <div className="mt-6 text-center">
          <textarea
            className="w-full text-center bg-transparent text-gray-600 border border-gray-300 rounded-md p-2 focus:outline-none focus:border-indigo-500"
            rows="4"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-center">
          <button
            className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 focus:outline-none"
            onClick={() => alert("Profile saved successfully!")}
          >
            Save
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
      <div className="flex-[2] bg-white/30 flex items-center justify-center  rounded-md"> profile info</div>
    </div>
    </div>
  );
};

export default ProfilePage;
