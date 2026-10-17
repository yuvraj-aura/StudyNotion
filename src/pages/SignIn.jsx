import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { toast } from 'react-toastify';
import { FcGoogle } from "react-icons/fc";
import loginImg from "../assets/login.png";
import frameImg from "../assets/frame.png";
import { login } from '../services/operations/authAPI';

const SignIn = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.auth);

    const [showPass, setShowPass] = useState(false);
    const [details, setDetails] = useState({
        emailId: "",
        password: "",
    });

    function changeHandler(event) {
        setDetails(prevDetails => ({
            ...prevDetails,
            [event.target.name]: event.target.value
        }));
    }

    function submitHandler(e) {
        e.preventDefault();
        const email = details.emailId.trim().toLowerCase();
        const password = details.password;
        dispatch(login(email, password, navigate));
    }

    return (
        <div className="min-h-[calc(100vh-3.5rem)] w-11/12 mx-auto bg-richblack-900 text-richblack-5 font-inter py-12 md:py-16">
            <div className="w-11/12 max-w-[1260px] mx-auto flex flex-col-reverse lg:flex-row justify-between items-center gap-12 lg:gap-16">
                {/* Left Side: Form Section */}
                <div className="w-full lg:max-w-[490px] flex flex-col">
                    <h1 className="text-3xl sm:text-4xl font-semibold text-richblack-5 leading-tight">
                        Welcome Back
                    </h1>
                    <p className="mt-3 text-base text-richblack-100 leading-relaxed">
                        <span>Build skills for today, tomorrow, and beyond.</span>{" "}
                        <span className="font-edu-sa font-bold italic text-blue-100">
                            Education to future-proof your career.
                        </span>
                    </p>

                    <form onSubmit={submitHandler} className="mt-8 flex flex-col gap-y-5 w-full">
                        {/* Email Address */}
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="emailId" className="text-sm text-richblack-5 font-medium flex items-center gap-0.5">
                                Email Address <sup className="text-pink-200">*</sup>
                            </label>
                            <input
                                type="email"
                                value={details.emailId}
                                name="emailId"
                                id="emailId"
                                onChange={changeHandler}
                                required
                                placeholder="Enter email address"
                                className="w-full rounded-lg bg-richblack-800 p-3 text-richblack-5 placeholder-richblack-400 border-b border-richblack-700 outline-none focus:border-yellow-50 focus:ring-1 focus:ring-yellow-50 transition-all duration-200"
                            />
                        </div>

                        {/* Password Field */}
                        <div className="flex flex-col gap-1.5 relative">
                            <label htmlFor="password" className="text-sm text-richblack-5 font-medium flex items-center gap-0.5">
                                Password <sup className="text-pink-200">*</sup>
                            </label>
                            <div className="relative w-full">
                                <input
                                    type={showPass ? "text" : "password"}
                                    value={details.password}
                                    name="password"
                                    id="password"
                                    onChange={changeHandler}
                                    required
                                    placeholder="Enter password"
                                    className="w-full rounded-lg bg-richblack-800 p-3 pr-12 text-richblack-5 placeholder-richblack-400 border-b border-richblack-700 outline-none focus:border-yellow-50 focus:ring-1 focus:ring-yellow-50 transition-all duration-200"
                                />
                                <span
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer text-richblack-400 hover:text-richblack-100 transition-colors duration-200"
                                    onClick={() => setShowPass(!showPass)}
                                    aria-label={showPass ? "Hide password" : "Show password"}
                                >
                                    {showPass ? <FaRegEye size={20} /> : <FaRegEyeSlash size={20} />}
                                </span>
                            </div>
                            <Link to="/forgot-password" className="self-end text-xs text-blue-100 hover:underline mt-1">
                                Forgot Password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-2 rounded-lg bg-yellow-50 py-3 px-4 font-semibold text-richblack-900 hover:bg-yellow-100 transition-all duration-200 shadow-[inset_0px_-1px_0px_rgba(255,255,255,0.18)] hover:scale-[0.99] active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? "Signing In..." : "Sign In"}
                        </button>
                    </form>

                    {/* Separation Line */}
                    <div className="flex items-center my-6 gap-x-3">
                        <div className="h-[1px] w-full bg-richblack-700"></div>
                        <span className="text-xs font-medium text-richblack-400 uppercase">OR</span>
                        <div className="h-[1px] w-full bg-richblack-700"></div>
                    </div>

                    {/* Google Auth Button */}
                    <button
                        type="button"
                        onClick={() => toast.info("Google Sign-In integration ready")}
                        className="w-full flex items-center justify-center gap-x-3 rounded-lg border border-richblack-700 bg-richblack-800 py-3 px-4 text-sm font-medium text-richblack-100 hover:bg-richblack-700/80 hover:text-white transition-all duration-200"
                    >
                        <FcGoogle size={22} />
                        <span>Sign in with Google</span>
                    </button>
                </div>

                {/* Right Side: Imagery with decorative layered grid frame */}
                <div className="relative w-full max-w-[450px] lg:max-w-[480px]">
                    {/* Background frame asset */}
                    <img
                        src={frameImg}
                        alt="Pattern background"
                        className="w-full h-auto object-cover select-none pointer-events-none"
                        loading="lazy"
                    />
                    {/* Foreground login image */}
                    <img
                        src={loginImg}
                        alt="Students"
                        className="absolute -top-4 -left-4 w-full h-full object-cover rounded-sm shadow-xl"
                        loading="lazy"
                    />
                </div>
            </div>
        </div>
    );
};

export default SignIn;