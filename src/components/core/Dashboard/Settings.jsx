import React, { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { setUser } from "../../../redux/slices/profileSlice";
import { FiUpload, FiTrash2 } from "react-icons/fi";
import { updateProfilePicture, removeProfilePicture } from "../../../services/operations/settingsAPI";

export default function Settings() {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ── file input ref for native OS file dialog ──
  const fileInputRef = useRef(null);
  const [previewSrc, setPreviewSrc] = useState(null); // local preview before upload
  const [uploading, setUploading] = useState(false);

  // ── form state ──
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    dateOfBirth: user?.additionalDetails?.dateOfBirth || "",
    gender: user?.additionalDetails?.gender || "Prefer not to say",
    contactNumber: user?.additionalDetails?.contactNumber || "",
    about: user?.additionalDetails?.about || "",
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

  // ─── Open native OS file chooser ───────────────────────────────────────────
  const handleUploadClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  // ─── When user selects a file ─────────────────────────────────────────────
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // show local preview immediately
    const localUrl = URL.createObjectURL(file);
    setPreviewSrc(localUrl);

    // build FormData and dispatch thunk
    const form = new FormData();
    form.append("profilePhoto", file);

    setUploading(true);
    const result = await dispatch(updateProfilePicture(token, form));
    setUploading(false);

    if (result) {
      // clear local preview — now using the Cloudinary URL from Redux
      setPreviewSrc(null);
    }

    // reset file input so same file can be re-selected
    e.target.value = "";
  };

  // ─── Remove photo → fall back to dicebear initials avatar ────────────────
  const handleRemove = async () => {
    const firstName = user?.firstName || "U";
    const lastName = user?.lastName || "";
    setUploading(true);
    await dispatch(removeProfilePicture(token, firstName, lastName));
    setUploading(false);
    setPreviewSrc(null);
  };

  // ─── Displayed avatar src ─────────────────────────────────────────────────
  const firstName = user?.firstName || "U";
  const lastName = user?.lastName || "";
  const dicebearUrl = `https://api.dicebear.com/5.x/initials/svg?seed=${encodeURIComponent(
    `${firstName} ${lastName}`
  )}`;
  const avatarSrc = previewSrc || user?.image || dicebearUrl;

  return (
    <div className="text-richblack-5 font-inter flex flex-col gap-y-8">
      <h1 className="text-3xl font-semibold text-richblack-5">Edit Profile</h1>

      {/* ── 1. Profile Picture Card ── */}
      <div className="flex items-center gap-x-6 rounded-2xl border border-richblack-700 bg-richblack-800 p-8 px-12 shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Avatar */}
        <div className="relative">
          <img
            src={avatarSrc}
            alt={`${firstName} ${lastName} avatar`}
            className="aspect-square w-[78px] rounded-full object-cover border-2 border-richblack-600 shadow-md"
            onError={(e) => {
              // If the image fails to load, fall back to dicebear
              e.currentTarget.src = dicebearUrl;
            }}
          />
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60">
              <svg
                className="h-6 w-6 animate-spin text-yellow-50"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="space-y-2">
          <p className="text-base font-semibold text-richblack-5">Change Profile Picture</p>
          <p className="text-xs text-richblack-400">
            Supported: JPG, PNG, WebP · Max 5 MB
          </p>
          <div className="flex gap-x-3">
            <button
              type="button"
              onClick={handleUploadClick}
              disabled={uploading}
              className="flex items-center gap-x-2 rounded-lg bg-yellow-50 py-2 px-5 font-semibold text-richblack-900
                         hover:bg-yellow-100 transition-all cursor-pointer shadow-sm text-sm
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{uploading ? "Uploading…" : "Upload"}</span>
              <FiUpload />
            </button>

            <button
              type="button"
              onClick={handleRemove}
              disabled={uploading}
              className="flex items-center gap-x-2 rounded-lg bg-richblack-700 py-2 px-5 font-semibold text-richblack-100
                         hover:bg-richblack-600 transition-all cursor-pointer text-sm
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Remove</span>
              <FiTrash2 />
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. Personal Information Form ── */}
      <form
        onSubmit={handleProfileSubmit}
        className="flex flex-col gap-y-6 rounded-2xl border border-richblack-700 bg-richblack-800 p-8 px-12 shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
      >
        <h2 className="text-lg font-semibold text-richblack-5">Profile Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-richblack-200">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter first name"
              className="rounded-lg bg-richblack-700 p-3 text-richblack-5 border-b border-richblack-600 outline-none focus:border-yellow-50 placeholder:text-richblack-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-richblack-200">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter last name"
              className="rounded-lg bg-richblack-700 p-3 text-richblack-5 border-b border-richblack-600 outline-none focus:border-yellow-50 placeholder:text-richblack-500"
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
              placeholder="+91 98765 43210"
              className="rounded-lg bg-richblack-700 p-3 text-richblack-5 border-b border-richblack-600 outline-none focus:border-yellow-50 placeholder:text-richblack-500"
            />
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-sm font-medium text-richblack-200">About</label>
            <textarea
              name="about"
              rows={3}
              value={formData.about}
              onChange={handleChange}
              placeholder="Tell us a little about yourself…"
              className="rounded-lg bg-richblack-700 p-3 text-richblack-5 border-b border-richblack-600 outline-none focus:border-yellow-50 resize-none placeholder:text-richblack-500"
            />
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
