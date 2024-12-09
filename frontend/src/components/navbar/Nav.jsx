import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setSidebarMenu } from "../../redux/pageSlice";
import toast from "react-hot-toast";
import api from "../../utils/api";
import {
  setAuthenticated,
  setLinks,
  setNotifications,
  setUser,
} from "../../redux/userSlice";
import { MdOutlineArrowDropDownCircle } from "react-icons/md";
import Notification from "../notification/Notification";


const Nav = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const notificationRef=useRef(null)
  const profilePageRef=useRef(null)

  const [profileMenu, setProfileMenu] = useState(false);
  const [notificationPage, setNotificationPage] = useState(false);

  const { sidebarMenu } = useSelector((store) => store.page);
  const username = useSelector((store) => store.admin.user.username);
  const links = useSelector((store) => store.admin.links);
  const notifications = useSelector((store) => store.admin.notifications);

  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      const res = await api.get("/auth/signout", { withCredentials: true });
      if (res.status === 200 && res.data.success) {
        dispatch(setUser(null));
        dispatch(setAuthenticated(false));
        dispatch(setLinks([]));
        navigate("/login", { replace: true });
        toast.success(res.data.message);
      }
    } catch (err) {
      const message = err.response?.data?.message || "Server Internal Error";
      toast.error(message);
    }
  };

  const getAllLinks = async () => {
    try {
      const res = await api.post(
        "/source/getallsource",
        { username },
        { withCredentials: true }
      );
      if (res.status === 200 && res.data.success) {
        dispatch(setLinks(res.data.sources));
      }
    } catch (err) {
      console.log(err);
      const message = err.response?.data?.message || "Server Internal Error";
      toast.error(message);
    }
  };

  const handleMarkRead = async () => {
    console.log("clicked !");
    try {
      const res = await api.post(
        "/source/notifications",
        {},
        { withCredentials: true }
      );
      if (res.status === 201 && res.data.success) {
        await getAllLinks();
        dispatch(setNotifications(0));
        setNotificationPage(false);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    dispatch(
      setNotifications(links.reduce((acc, link) => acc + link.notSeen, 0))
    );
    
  }, [links, notifications]);

  const onNotificationClick = async () => {
    if (notifications === 0) {
      toast("you have no any new clicks");
      return;
    }
    setNotificationPage((state) => !state);
  };

// handle out side click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current && 
        !notificationRef.current.contains(event.target) && 
        !event.target.closest(".notification-button")
      ) {
        setNotificationPage(false);
      }
      if (
        profilePageRef.current && 
        !profilePageRef.current.contains(event.target) && 
        !event.target.closest(".profileMenu-button")
      ) {
        setProfileMenu(false);
      }
    };

    if (notificationPage || profileMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notificationPage,profileMenu]);

  const handleProfileClick=(e)=>{
    navigate('/profile')
    setProfileMenu(false)
  }



  return (
    <nav className="bg-gray-800 h-[70px]   relative z-40 px-5 shadow-xl shadow-white ">
      <div className="">
        <div className="relative flex h-16 items-center md:justify-between justify-end">
          {/* mobile menu icon */}
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* <!-- Mobile menu button--> */}
            <button
              type="button"
              className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={() => dispatch(setSidebarMenu(!sidebarMenu))}
            >
              <span className="absolute -inset-0.5"></span>
              <span className="sr-only">Open main menu</span>
              {/* <!--
            Icon when menu is closed.

            Menu open: "hidden", Menu closed: "block"
          --> */}
              <svg
                className="block h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                aria-hidden="true"
                data-slot="icon"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
              {/* <!--
            Icon when menu is open.

            Menu open: "block", Menu closed: "hidden"
          --> */}
              <svg
                className="hidden h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                aria-hidden="true"
                data-slot="icon"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex  items-center justify-center">
            {/* Logo */}
            <div className="flex flex-shrink-0 mr-5  items-center">
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500"
                alt="Link Bridge"
              />
            </div>

            {/* NavMenu */}
            <div className="hidden sm:ml-6 sm:block z-50 text-white">
              <div className="flex space-x-4">
                {/* <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" --> */}
                <Link
                  to="/home"
                  className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white"
                  aria-current="page"
                >
                  Home
                </Link>
                <Link
                  to="/links"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Links
                </Link>
                {/* <Link
                  to="#"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Analysis
                </Link> */}
                <Link
                  to="/doc"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Docs
                </Link>
              </div>
            </div>
          </div>

          <div className="absolute inset-y-0  flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {/* notification */}
            <div className="relative">
              <button
                type="button"
                className=" notification-button relative rounded-full  bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                onClick={onNotificationClick}
              >
                <span className="absolute -inset-1.5"></span>
                <span className="sr-only">View notifications</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                  data-slot="icon"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                  />
                </svg>
              </button>
              {/* notification icon */}
              {notifications > 0 && (
                <div className="bg-white size-5 absolute -top-2 cursor-pointer -right-2  text-black flex justify-center items-center rounded-full text-sm p-1">
                  <span>{notifications}</span>
                </div>
              )}

             
            </div>
            {/* <!-- Profile dropdown --> */}
            <div className="relative ml-3">
              <div>
                <button
                  type="button"
                  className="relative profileMenu-button font-bold gap-1 text-white shadow-md items-center px-4 py-2 flex rounded-full uppercase bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 hover:cursor-pointer"
                  id="user-menu-button"
                  aria-expanded="false"
                  aria-haspopup="true"
                  onClick={() => {
                    setProfileMenu((state) => !state);
                  }}
                >
                  <span className="absolute -inset-1.5"></span>
                  <span className="sr-only">Open user menu</span>
                  {/* <img
                    className="h-8 w-8 rounded-full"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                  /> */}
                  {username}
                  <MdOutlineArrowDropDownCircle />
                </button>
              </div>

              {/* Profile Menu */}
              {profileMenu && (
                <div
                  className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                  tabindex="-1"
                  ref={profilePageRef}
                >
                  {/* <!-- Active: "bg-gray-100", Not Active: "" --> */}
                  <div
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-300 hover:cursor-pointer"
                    role="menuitem"
                    tabindex="-1"
                    id="user-menu-item-0"
                    onClick={handleProfileClick}
                  >
                    Your Profile
                  </div>
                  <div
                    className="block px-4 py-2 text-sm text-gray-700  hover:bg-slate-300 hover:cursor-pointer"
                    role="menuitem"
                    tabindex="-1"
                    id="user-menu-item-1"
                  >
                    Settings
                  </div>
                  <div
                    className="block px-4 py-2 text-sm text-gray-700  hover:bg-slate-300 hover:cursor-pointer"
                    role="menuitem"
                    tabindex="-1"
                    id="user-menu-item-2"
                    onClick={handleSignOut}
                  >
                    Sign out
                  </div>
                </div>
              )}
            </div>
          </div>
          {notificationPage && (
                <div className=" notification-page absolute rounded-lg  top-[55px] right-2  bg-cyan-700 text-center ">
                  <Notification />
                  <button
                    className="px-3 py-2 bg-slate-200 rounded-md mb-4 hover:bg-slate-400"
                    onClick={handleMarkRead}
                    ref={notificationRef}
                  >
                    mark as read
                  </button>
                </div>
              )}
        </div>
      </div>

      {/* sidebarMenu */}
      {sidebarMenu && (
        <div className="sm:hidden bg-black/80" id="mobile-menu">
          <div className="space-y-1 px-2 pb-3 pt-2">
            <Link
              to="/home"
              onClick={() => dispatch(setSidebarMenu(!sidebarMenu))}
              className="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white"
              aria-current="page"
            >
              Home
            </Link>
            <Link
              to="/links"
              onClick={() => dispatch(setSidebarMenu(!sidebarMenu))}
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Links
            </Link>
            <Link
              to="#"
              onClick={() => dispatch(setSidebarMenu(!sidebarMenu))}
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Analysis
            </Link>
            <Link
              to="/doc"
              onClick={() => dispatch(setSidebarMenu(!sidebarMenu))}
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Docs
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Nav;
