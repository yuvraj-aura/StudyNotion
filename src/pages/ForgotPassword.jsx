import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { toast } from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const handleOnSubmit = (e) => {
    e.preventDefault();
    setEmailSent(true);
    toast.success("Reset email sent! Please check your inbox.");
  };

  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center bg-richblack-900 text-richblack-5 font-inter p-4">
      <div className="max-w-[500px] p-4 lg:p-8 rounded-2xl border border-richblack-700 bg-richblack-800 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
        <h1 className="text-3xl font-semibold leading-tight text-richblack-5">
          {!emailSent ? "Reset your password" : "Check email"}
        </h1>
        <p className="my-4 text-base leading-relaxed text-richblack-100">
          {!emailSent
            ? "Have no fear. We'll email you instructions to reset your password. If you don't have access to your email we can try account recovery."
            : `We have sent the reset email to ${email}`}
        </p>

        <form onSubmit={handleOnSubmit}>
          {!emailSent && (
            <label className="w-full flex flex-col gap-1.5">
              <p className="text-sm text-richblack-5 font-medium">
                Email Address <sup className="text-pink-200">*</sup>
              </p>
              <input
                required
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 placeholder-richblack-400 border-b border-richblack-600 outline-none focus:border-yellow-50"
              />
            </label>
          )}

          <button
            type="submit"
            className="mt-6 w-full rounded-lg bg-yellow-50 py-3 px-4 font-semibold text-richblack-900 hover:bg-yellow-100 transition-all cursor-pointer shadow-md"
          >
            {!emailSent ? "Submit" : "Resend Email"}
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
