import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { VscDashboard, VscSignOut } from "react-icons/vsc";
import { AiOutlineCaretDown } from "react-icons/ai";
import { toast } from "react-hot-toast";
import { setToken } from "../../../redux/slices/authSlice";
import { setUser } from "../../../redux/slices/profileSlice";
import { resetCart } from "../../../redux/slices/cartSlice";

export default function ProfileDropdown() {
  const { user } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const menuVisible = open || hovered;
  const closeMenu = () => {
    setOpen(false);
    setHovered(false);
  };

  const handleLogout = () => {
    dispatch(setToken(null));
    dispatch(setUser(null));
    dispatch(resetCart());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged Out Successfully");
    navigate("/");
  };

  const initials = user?.firstName
    ? `${user.firstName[0]}${user.lastName ? user.lastName[0] : ""}`.toUpperCase()
    : "SN";

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={closeMenu}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) closeMenu();
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") closeMenu();
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-x-1 outline-none cursor-pointer"
        aria-label="Profile menu"
        aria-expanded={menuVisible}
        aria-controls="profile-dropdown"
      >
        {user?.image ? (
          <img
            src={user.image}
            alt={`profile-${user?.firstName}`}
            className="aspect-square w-[32px] rounded-full object-cover border border-richblack-700"
          />
        ) : (
          <div className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-pink-700 text-xs font-bold text-white border border-pink-500">
            {initials}
          </div>
        )}
        <AiOutlineCaretDown className="text-sm text-richblack-200" />
      </button>

      <div
        aria-hidden={!menuVisible}
        inert={!menuVisible}
        className={`absolute top-full right-0 z-[1000] pt-2 transition-opacity duration-200 ease-out motion-reduce:transition-none ${menuVisible ? "opacity-100" : "pointer-events-none opacity-0"}`}
      >
        <div
          id="profile-dropdown"
          onClick={(e) => e.stopPropagation()}
          className={`origin-top-right divide-y-[1px] divide-richblack-700 overflow-hidden rounded-md border-[1px] border-richblack-700 bg-richblack-800 shadow-xl transition-transform duration-200 ease-out motion-reduce:transition-none ${menuVisible ? "translate-y-0 scale-100" : "-translate-y-1 scale-95"}`}
        >
          <Link to="/dashboard/my-profile" onClick={closeMenu}>
            <div className="flex w-full items-center gap-x-2 py-[10px] px-[14px] text-sm text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25 transition-all duration-200">
              <VscDashboard className="text-lg" />
              <span>Dashboard</span>
            </div>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-x-2 py-[10px] px-[14px] text-sm text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25 transition-all duration-200 cursor-pointer"
          >
            <VscSignOut className="text-lg" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
