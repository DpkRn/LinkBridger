import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from 'react-router-dom';
import { setSidebarMenu } from "../../redux/pageSlice";
import toast from "react-hot-toast";
import api from "../../utils/api";
import { setAuthenticated, setUser } from "../../redux/userSlice";

const Nav = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [profileMenu, setProfileMenu] = useState(false);
  const { sidebarMenu } = useSelector(store => store.page);

  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      const res = await api.get('/auth/signout', { withCredentials: true });
      if (res.status === 200 && res.data.success) {
        dispatch(setUser(null));
        dispatch(setAuthenticated(false));
        navigate('/login', { replace: true });
        toast.success(res.data.message);
      }
    } catch (err) {
      const message = err.response?.data?.message || "Server Internal Error";
      toast.error(message);
    }
  };

  const handleClickOutside = (e) => {
    if (!e.target.closest(".profile-menu")) {
      setProfileMenu(false);
    }else{
      setProfileMenu(true);
    }
  };

  useEffect(() => {
    if (profileMenu) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [profileMenu]);

  return (
    <nav className="bg-gray-800 h-[70px] relative z-40">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* Mobile menu button */}
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              type="button"
              className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={() => dispatch(setSidebarMenu(!sidebarMenu))}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="block h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>

          {/* Logo */}
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center">
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500"
                alt="Your Company"
              />
            </div>
            {/* Nav Menu */}
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                <Link to="#" className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white">Home</Link>
                <Link to="#" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Links</Link>
              </div>
            </div>
          </div>

          {/* Profile and Notifications */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <button
              type="button"
              className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              <span className="sr-only">View notifications</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                />
              </svg>
            </button>

            {/* Profile dropdown */}
            <div className="relative ml-3">
              <button
                type="button"
                className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                onClick={() => setProfileMenu((prev) => !prev)}
              >
                <span className="sr-only">Open user menu</span>
                <img
                  className="h-8 w-8 rounded-full"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                />
              </button>

              {/* Dropdown menu */}
              {profileMenu && (
                <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-300">Your Profile</div>
                  <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-300">Settings</div>
                  <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-300" onClick={handleSignOut}>Sign out</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {sidebarMenu && (
        <div className="sm:hidden bg-black/80" id="mobile-menu">
          <div className="space-y-1 px-2 pb-3 pt-2">
            <Link to="#" className="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white">Home</Link>
            <Link to="#" className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Links</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Nav;
