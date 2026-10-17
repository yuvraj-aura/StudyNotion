import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RiEditBoxLine } from "react-icons/ri";

export default function MyProfile() {
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();

  const initials = user?.firstName
    ? `${user.firstName[0]}${user.lastName ? user.lastName[0] : ""}`.toUpperCase()
    : "SN";

  return (
    <div className="text-white flex flex-col gap-y-8 font-inter">
      <h1 className="text-3xl font-semibold text-richblack-5">My Profile</h1>

      {/* Section 1: User Avatar & Name */}
      <div className="flex items-center justify-between rounded-2xl border border-richblack-700 bg-richblack-800 p-8 px-12 shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
        <div className="flex items-center gap-x-5">
          {user?.image ? (
            <img
              src={user.image}
              alt={`profile-${user?.firstName}`}
              className="aspect-square w-[78px] rounded-full object-cover border-2 border-richblack-600"
            />
          ) : (
            <div className="flex h-[78px] w-[78px] items-center justify-center rounded-full bg-pink-700 text-2xl font-bold text-white border-2 border-pink-500 shadow-md">
              {initials}
            </div>
          )}
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-richblack-5">
              {user?.firstName ? `${user?.firstName} ${user?.lastName || ""}` : "Student Name"}
            </h2>
            <p className="text-sm text-richblack-300">
              {user?.email || "student@studynotion.com"}
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/dashboard/settings")}
          className="flex items-center gap-x-2 rounded-lg bg-yellow-50 py-2 px-5 font-semibold text-richblack-900 hover:bg-yellow-100 transition-all duration-200 cursor-pointer shadow-sm hover:scale-95"
        >
          <span>Edit</span>
          <RiEditBoxLine className="text-lg" />
        </button>
      </div>

      {/* Section 2: About / Bio */}
      <div className="flex flex-col gap-y-4 rounded-2xl border border-richblack-700 bg-richblack-800 p-8 px-12 shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
        <div className="flex w-full items-center justify-between">
          <h2 className="text-lg font-semibold text-richblack-5">About</h2>
          <button
            onClick={() => navigate("/dashboard/settings")}
            className="flex items-center gap-x-2 rounded-lg bg-yellow-50 py-2 px-5 font-semibold text-richblack-900 hover:bg-yellow-100 transition-all duration-200 cursor-pointer shadow-sm hover:scale-95"
          >
            <span>Edit</span>
            <RiEditBoxLine className="text-lg" />
          </button>
        </div>
        <p
          className={`${
            user?.additionalDetails?.about
              ? "text-richblack-5"
              : "text-richblack-400 font-medium"
          } text-sm leading-relaxed`}
        >
          {user?.additionalDetails?.about || "Write something about yourself..."}
        </p>
      </div>

      {/* Section 3: Personal Details Grid */}
      <div className="flex flex-col gap-y-6 rounded-2xl border border-richblack-700 bg-richblack-800 p-8 px-12 shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
        <div className="flex w-full items-center justify-between">
          <h2 className="text-lg font-semibold text-richblack-5">Personal Details</h2>
          <button
            onClick={() => navigate("/dashboard/settings")}
            className="flex items-center gap-x-2 rounded-lg bg-yellow-50 py-2 px-5 font-semibold text-richblack-900 hover:bg-yellow-100 transition-all duration-200 cursor-pointer shadow-sm hover:scale-95"
          >
            <span>Edit</span>
            <RiEditBoxLine className="text-lg" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
          <div>
            <p className="text-xs text-richblack-400 mb-1">First Name</p>
            <p className="text-sm font-semibold text-richblack-5">
              {user?.firstName || "First Name"}
            </p>
          </div>

          <div>
            <p className="text-xs text-richblack-400 mb-1">Last Name</p>
            <p className="text-sm font-semibold text-richblack-5">
              {user?.lastName || "Last Name"}
            </p>
          </div>

          <div>
            <p className="text-xs text-richblack-400 mb-1">Email</p>
            <p className="text-sm font-semibold text-richblack-5">
              {user?.email || "student@studynotion.com"}
            </p>
          </div>

          <div>
            <p className="text-xs text-richblack-400 mb-1">Phone Number</p>
            <p className="text-sm font-semibold text-richblack-5">
              {user?.additionalDetails?.contactNumber || "+91 98765 43210"}
            </p>
          </div>

          <div>
            <p className="text-xs text-richblack-400 mb-1">Gender</p>
            <p className="text-sm font-semibold text-richblack-5">
              {user?.additionalDetails?.gender || "Add Gender"}
            </p>
          </div>

          <div>
            <p className="text-xs text-richblack-400 mb-1">Date Of Birth</p>
            <p className="text-sm font-semibold text-richblack-5">
              {user?.additionalDetails?.dateOfBirth || "January 1, 1970"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
