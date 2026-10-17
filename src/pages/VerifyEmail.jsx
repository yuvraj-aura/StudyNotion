import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BiArrowBack } from "react-icons/bi";
import { RxCountdownTimer } from "react-icons/rx";
import { toast } from "react-toastify";
import { sendOtp, signUp } from "../services/operations/authAPI";

export default function VerifyEmail() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { signupData, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    // If no signup data exists (e.g., user directly accessed /verify-email), redirect to signup
    if (!signupData) {
      navigate("/signup");
    }
  }, [signupData, navigate]);

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input automatically
    if (element.nextSibling && element.value !== "") {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && e.target.previousSibling) {
      e.target.previousSibling.focus();
    }
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length < 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    const {
      accountType,
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    } = signupData;

    dispatch(
      signUp(
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otpValue,
        navigate
      )
    );
  };

  const handleResendOtp = () => {
    if (signupData?.email) {
      dispatch(sendOtp(signupData.email, navigate));
    }
  };

  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center bg-richblack-900 text-richblack-5 font-inter p-4">
      <div className="max-w-[500px] w-full p-6 lg:p-8 rounded-2xl border border-richblack-700 bg-richblack-800 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
        <h1 className="text-3xl font-semibold leading-tight text-richblack-5">
          Verify email
        </h1>
        <p className="my-4 text-base leading-relaxed text-richblack-100">
          A verification code has been sent to{" "}
          <span className="text-yellow-50 font-medium">
            {signupData?.email || "your email"}
          </span>
          . Enter the code below.
        </p>

        <form onSubmit={handleOnSubmit}>
          <div className="flex justify-between gap-x-2 my-6">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={data}
                onChange={(e) => handleOtpChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onFocus={(e) => e.target.select()}
                className="w-12 h-12 text-center text-xl font-bold rounded-lg bg-richblack-700 border border-richblack-600 text-yellow-50 outline-none focus:border-yellow-50 focus:ring-1 focus:ring-yellow-50 transition-all"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-yellow-50 py-3 px-4 font-semibold text-richblack-900 hover:bg-yellow-100 transition-all cursor-pointer shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between text-sm">
          <Link
            to="/signup"
            className="flex items-center gap-x-2 text-richblack-5 hover:text-yellow-50 transition-colors"
          >
            <BiArrowBack />
            <span>Back To Signup</span>
          </Link>
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={loading}
            className="flex items-center gap-x-2 text-blue-100 hover:underline cursor-pointer disabled:opacity-50"
          >
            <RxCountdownTimer />
            <span>Resend it</span>
          </button>
        </div>
      </div>
    </div>
  );
}
