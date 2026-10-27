import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { toast } from "react-hot-toast";

export default function UpdatePassword() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleOnChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    toast.success("Password Updated Successfully");
    navigate("/signin");
  };

  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center bg-richblack-900 text-richblack-5 font-inter p-4">
      <div className="max-w-[500px] p-4 lg:p-8 rounded-2xl border border-richblack-700 bg-richblack-800 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
        <h1 className="text-3xl font-semibold leading-tight text-richblack-5">
          Choose new password
        </h1>
        <p className="my-4 text-base leading-relaxed text-richblack-100">
          Almost done. Enter your new password and youre all set.
        </p>

        <form onSubmit={handleOnSubmit} className="flex flex-col gap-y-4">
          <label className="relative flex flex-col gap-1.5">
            <p className="text-sm text-richblack-5 font-medium">
              New Password <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleOnChange}
              placeholder="Enter Password"
              className="w-full rounded-lg bg-richblack-700 p-3 pr-10 text-richblack-5 placeholder-richblack-400 border-b border-richblack-600 outline-none focus:border-yellow-50"
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] z-10 cursor-pointer text-richblack-400"
            >
              {showPassword ? <FaRegEye size={18} /> : <FaRegEyeSlash size={18} />}
            </span>
          </label>

          <label className="relative flex flex-col gap-1.5">
            <p className="text-sm text-richblack-5 font-medium">
              Confirm New Password <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleOnChange}
              placeholder="Confirm Password"
              className="w-full rounded-lg bg-richblack-700 p-3 pr-10 text-richblack-5 placeholder-richblack-400 border-b border-richblack-600 outline-none focus:border-yellow-50"
            />
            <span
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] z-10 cursor-pointer text-richblack-400"
            >
              {showConfirmPassword ? <FaRegEye size={18} /> : <FaRegEyeSlash size={18} />}
            </span>
          </label>

          <button
            type="submit"
            className="mt-4 w-full rounded-lg bg-yellow-50 py-3 px-4 font-semibold text-richblack-900 hover:bg-yellow-100 transition-all cursor-pointer shadow-md"
          >
            Reset Password
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between">
          <Link to="/signin" className="flex items-center gap-x-2 text-richblack-5 hover:text-yellow-50 transition-colors text-sm">
            <BiArrowBack />
            <span>Back To Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
