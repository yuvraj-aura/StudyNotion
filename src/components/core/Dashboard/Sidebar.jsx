import React, { useState } from "react";
import { sidebarLinks } from "../../../data/dashboard-links";
import SidebarLink from "./SidebarLink";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { VscSettingsGear, VscSignOut } from "react-icons/vsc";
import { setToken } from "../../../redux/slices/authSlice";
import { setUser } from "../../../redux/slices/profileSlice";
import { resetCart } from "../../../redux/slices/cartSlice";
import { toast } from "react-toastify";

export default function Sidebar() {
  const { user } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(setToken(null));
    dispatch(setUser(null));
    dispatch(resetCart());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged Out Successfully");
    navigate("/");
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] min-w-[222px] flex-col border-r border-r-richblack-700 bg-richblack-800 py-10 select-none">
      <div className="flex flex-col">
        {sidebarLinks.map((link) => {
          if (link.type && user?.accountType !== link.type) return null;
          return (
            <SidebarLink key={link.id} link={link} iconName={link.icon} />
          );
        })}
      </div>

      <div className="mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-700"></div>

      <div className="flex flex-col">
        <SidebarLink
          link={{ name: "Settings", path: "/dashboard/settings" }}
          iconName="VscSettingsGear"
        />

        <button
          onClick={handleLogout}
          className="px-8 py-2.5 text-sm font-medium text-richblack-300 hover:text-richblack-50 hover:bg-richblack-800 transition-all duration-200 flex items-center gap-x-3 w-full text-left cursor-pointer"
        >
          <VscSignOut className="text-lg" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
