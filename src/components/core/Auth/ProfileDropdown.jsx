import { useRef, useState } from "react";
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
  const ref = useRef(null);

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
    <div className="relative" onMouseLeave={() => setOpen(false)}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-x-1 outline-none cursor-pointer"
        aria-label="Profile menu"
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

      {open && (
        <div
          ref={ref}
          onClick={(e) => e.stopPropagation()}
          className="absolute top-[118%] right-0 z-[1000] divide-y-[1px] divide-richblack-700 overflow-hidden rounded-md border-[1px] border-richblack-700 bg-richblack-800 shadow-xl"
        >
          <Link to="/dashboard/my-profile" onClick={() => setOpen(false)}>
            <div className="flex w-full items-center gap-x-2 py-[10px] px-[14px] text-sm text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25 transition-all duration-200">
              <VscDashboard className="text-lg" />
              <span>Dashboard</span>
            </div>
          </Link>
          <div
            onClick={handleLogout}
            className="flex w-full items-center gap-x-2 py-[10px] px-[14px] text-sm text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25 transition-all duration-200 cursor-pointer"
          >
            <VscSignOut className="text-lg" />
            <span>Logout</span>
          </div>
        </div>
      )}
    </div>
  );
}