import React from "react";
import * as Icons from "react-icons/vsc";
import { NavLink, matchPath, useLocation } from "react-router-dom";

export default function SidebarLink({ link, iconName }) {
  const Icon = Icons[iconName] || Icons["VscCircleFilled"];
  const location = useLocation();

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  const isActive = matchRoute(link.path);

  return (
    <NavLink
      to={link.path}
      className={`relative px-8 py-2.5 text-sm font-medium transition-all duration-200 flex items-center gap-x-3 ${
        isActive
          ? "bg-yellow-800/40 text-yellow-50"
          : "text-richblack-300 hover:text-richblack-50 hover:bg-richblack-800"
      }`}
    >
      <span
        className={`absolute left-0 top-0 h-full w-[0.2rem] bg-yellow-50 transition-all duration-200 ${
          isActive ? "opacity-100" : "opacity-0"
        }`}
      ></span>

      <Icon className="text-lg" />
      <span>{link.name}</span>
    </NavLink>
  );
}
