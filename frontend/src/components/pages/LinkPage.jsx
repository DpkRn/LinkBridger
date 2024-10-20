import React from "react";
import Linkcard from "../linkcard/Linkcard";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

const LinkPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarMenu = useSelector((store) => store.page.sidebarMenu);
  const links = useSelector((store) => store.admin.links);
  const username = useSelector((store) => store.admin.user.username);

  console.log(location);

  const handleCreateNewBridge = () => {
    navigate("/home");
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
      {username&&<p>your linktree is live live on: https://linkb-one.vercel.app/{username}</p>}
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
