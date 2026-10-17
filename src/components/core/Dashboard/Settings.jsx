import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setUser } from "../../../redux/slices/profileSlice";
import { FiUpload } from "react-icons/fi";

export default function Settings() {
  const { user } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "Love",
    lastName: user?.lastName || "Babbar",
    dateOfBirth: user?.additionalDetails?.dateOfBirth || "1995-01-01",
    gender: user?.additionalDetails?.gender || "Male",
    contactNumber: user?.additionalDetails?.contactNumber || "+91 98765 43210",
    about: user?.additionalDetails?.about || "Senior Software Engineer and Educator.",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    const updatedUser = {
      ...user,
      firstName: formData.firstName,
      lastName: formData.lastName,
      additionalDetails: {
        ...user?.additionalDetails,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        contactNumber: formData.contactNumber,
        about: formData.about,
      },
    };
    dispatch(setUser(updatedUser));
    localStorage.setItem("user", JSON.stringify(updatedUser));
    toast.success("Profile Details Updated Successfully");
    navigate("/dashboard/my-profile");
  };

  const initials = user?.firstName
    ? `${user.firstName[0]}${user.lastName ? user.lastName[0] : ""}`.toUpperCase()
    : "LB";

  return (
    <div className="text-richblack-5 font-inter flex flex-col gap-y-8">
      <h1 className="text-3xl font-semibold text-richblack-5">Edit Profile</h1>

      {/* 1. Profile Picture Card */}
      <div className="flex items-center gap-x-6 rounded-2xl border border-richblack-700 bg-richblack-800 p-8 px-12 shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
        {user?.image ? (
          <img
            src={user.image}
            alt="User avatar"
            className="aspect-square w-[78px] rounded-full object-cover border-2 border-richblack-600"
          />
        ) : (
          <div className="flex h-[78px] w-[78px] items-center justify-center rounded-full bg-pink-700 text-2xl font-bold text-white border-2 border-pink-500 shadow-md">
            {initials}
          </div>
        )}
        <div className="space-y-2">
          <p className="text-base font-semibold text-richblack-5">Change Profile Picture</p>
          <div className="flex gap-x-3">
            <button
              type="button"
              onClick={() => toast.success("Picture updated successfully")}
              className="flex items-center gap-x-2 rounded-lg bg-yellow-50 py-2 px-5 font-semibold text-richblack-900 hover:bg-yellow-100 transition-all cursor-pointer shadow-sm text-sm"
            >
              <span>Upload</span>
              <FiUpload />
            </button>
            <button
              type="button"
              className="rounded-lg bg-richblack-700 py-2 px-5 font-semibold text-richblack-100 hover:bg-richblack-600 transition-all cursor-pointer text-sm"
            >
              Remove
            </button>
          </div>
        </div>
      </div>

      {/* 2. Personal Information Form */}
      <form onSubmit={handleProfileSubmit} className="flex flex-col gap-y-6 rounded-2xl border border-richblack-700 bg-richblack-800 p-8 px-12 shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
        <h2 className="text-lg font-semibold text-richblack-5">Profile Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-richblack-200">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="rounded-lg bg-richblack-700 p-3 text-richblack-5 border-b border-richblack-600 outline-none focus:border-yellow-50"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-richblack-200">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="rounded-lg bg-richblack-700 p-3 text-richblack-5 border-b border-richblack-600 outline-none focus:border-yellow-50"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-richblack-200">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="rounded-lg bg-richblack-700 p-3 text-richblack-5 border-b border-richblack-600 outline-none focus:border-yellow-50"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-richblack-200">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="rounded-lg bg-richblack-700 p-3 text-richblack-5 border-b border-richblack-600 outline-none focus:border-yellow-50"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Non-Binary">Non-Binary</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-richblack-200">Contact Number</label>
            <input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              className="rounded-lg bg-richblack-700 p-3 text-richblack-5 border-b border-richblack-600 outline-none focus:border-yellow-50"
            />
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-sm font-medium text-richblack-200">About</label>
            <textarea
              name="about"
              rows={3}
              value={formData.about}
              onChange={handleChange}
              className="rounded-lg bg-richblack-700 p-3 text-richblack-5 border-b border-richblack-600 outline-none focus:border-yellow-50 resize-none"
            ></textarea>
          </div>
        </div>

        <div className="flex justify-end gap-x-4 pt-4">
          <button
            type="button"
            onClick={() => navigate("/dashboard/my-profile")}
            className="rounded-lg bg-richblack-700 py-2.5 px-6 font-semibold text-richblack-100 hover:bg-richblack-600 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-yellow-50 py-2.5 px-6 font-semibold text-richblack-900 hover:bg-yellow-100 transition-all cursor-pointer shadow-md"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
