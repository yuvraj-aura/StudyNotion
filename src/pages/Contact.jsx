import React, { useState } from 'react';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaClock, FaPaperPlane } from 'react-icons/fa';
import { toast } from 'react-toastify';
import countryCodeData from '../data/countryCode.json';

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    countryCode: '+91',
    phoneNo: '',
    message: ''
  });

  const changeHandler = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    toast.success('Thank you for reaching out! We will contact you shortly.');
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      countryCode: '+91',
      phoneNo: '',
      message: ''
    });
  };

  // Filter valid country codes
  const validCountryCodes = countryCodeData.filter((c) => c.code && c.country);

  return (
    <div className="w-full min-h-[calc(100vh-3.5rem)] bg-richblack-900 text-richblack-5 font-inter py-12 md:py-20">
      <div className="w-11/12 max-w-[1260px] mx-auto flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-14">
        {/* Left Side: Contact Information Cards */}
        <div className="w-full lg:w-[40%] flex flex-col gap-6 bg-richblack-800 p-8 sm:p-10 rounded-2xl border border-richblack-700/80 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-richblack-700 flex items-center justify-center text-yellow-50 shrink-0 mt-0.5">
              <FaEnvelope size={18} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-richblack-5">Chat with us</h3>
              <p className="text-sm text-richblack-300 mt-0.5">Our friendly team is here to help.</p>
              <p className="text-sm font-semibold text-yellow-50 mt-1">support@studynotion.com</p>
            </div>
          </div>

          <div className="w-full h-[1px] bg-richblack-700/60 my-1"></div>

          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-richblack-700 flex items-center justify-center text-caribbeangreen-200 shrink-0 mt-0.5">
              <FaMapMarkerAlt size={18} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-richblack-5">Visit our office</h3>
              <p className="text-sm text-richblack-300 mt-0.5">Come say hello at our headquarters.</p>
              <p className="text-sm font-semibold text-richblack-100 mt-1">Uttam Nagar West, New Delhi, India</p>
            </div>
          </div>

          <div className="w-full h-[1px] bg-richblack-700/60 my-1"></div>

          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-richblack-700 flex items-center justify-center text-blue-100 shrink-0 mt-0.5">
              <FaPhoneAlt size={18} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-richblack-5">Call us</h3>
              <p className="text-sm text-richblack-300 mt-0.5">Mon-Fri from 9am to 6pm IST.</p>
              <p className="text-sm font-semibold text-richblack-100 mt-1">+91 (110) 5522-5500</p>
            </div>
          </div>

          <div className="w-full h-[1px] bg-richblack-700/60 my-1"></div>

          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-richblack-700 flex items-center justify-center text-pink-200 shrink-0 mt-0.5">
              <FaClock size={18} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-richblack-5">Response Time</h3>
              <p className="text-sm text-richblack-300 mt-0.5">We usually respond within 24 business hours.</p>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Contact Form */}
        <div className="w-full lg:w-[60%] flex flex-col p-8 sm:p-12 rounded-2xl border border-richblack-700/80 bg-richblack-800 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-semibold text-richblack-5 leading-tight">
              Got an Idea? We've got the skills. Let's team up.
            </h2>
            <p className="text-sm sm:text-base text-richblack-300 mt-2">
              Tell us more about yourself and what you've got in mind.
            </p>
          </div>

          <form onSubmit={submitHandler} className="flex flex-col gap-y-5 w-full">
            {/* First Name & Last Name */}
            <div className="flex flex-col sm:flex-row gap-5">
              <div className="flex-1 flex flex-col gap-1.5">
                <label htmlFor="firstName" className="text-sm text-richblack-5 font-medium flex items-center gap-0.5">
                  First Name <sup className="text-pink-200">*</sup>
                </label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={changeHandler}
                  required
                  className="w-full rounded-lg bg-richblack-700/70 p-3 text-richblack-5 placeholder-richblack-400 border-b border-richblack-600 outline-none focus:border-yellow-50 focus:ring-1 focus:ring-yellow-50 transition-all duration-200"
                />
              </div>

              <div className="flex-1 flex flex-col gap-1.5">
                <label htmlFor="lastName" className="text-sm text-richblack-5 font-medium flex items-center gap-0.5">
                  Last Name <sup className="text-pink-200">*</sup>
                </label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={changeHandler}
                  required
                  className="w-full rounded-lg bg-richblack-700/70 p-3 text-richblack-5 placeholder-richblack-400 border-b border-richblack-600 outline-none focus:border-yellow-50 focus:ring-1 focus:ring-yellow-50 transition-all duration-200"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm text-richblack-5 font-medium flex items-center gap-0.5">
                Email Address <sup className="text-pink-200">*</sup>
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={changeHandler}
                required
                className="w-full rounded-lg bg-richblack-700/70 p-3 text-richblack-5 placeholder-richblack-400 border-b border-richblack-600 outline-none focus:border-yellow-50 focus:ring-1 focus:ring-yellow-50 transition-all duration-200"
              />
            </div>

            {/* Phone Number with Country Code Dropdown */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="phoneNo" className="text-sm text-richblack-5 font-medium flex items-center gap-0.5">
                Phone Number <sup className="text-pink-200">*</sup>
              </label>
              <div className="flex gap-3">
                <select
                  name="countryCode"
                  id="countryCode"
                  value={formData.countryCode}
                  onChange={changeHandler}
                  className="w-[100px] sm:w-[120px] rounded-lg bg-richblack-700/70 p-3 text-richblack-5 border-b border-richblack-600 outline-none focus:border-yellow-50 focus:ring-1 focus:ring-yellow-50 transition-all duration-200"
                >
                  {validCountryCodes.map((c, i) => (
                    <option key={i} value={c.code} className="bg-richblack-800 text-richblack-5">
                      {c.code} - {c.country}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  name="phoneNo"
                  id="phoneNo"
                  placeholder="12345 67890"
                  value={formData.phoneNo}
                  onChange={changeHandler}
                  required
                  className="flex-1 rounded-lg bg-richblack-700/70 p-3 text-richblack-5 placeholder-richblack-400 border-b border-richblack-600 outline-none focus:border-yellow-50 focus:ring-1 focus:ring-yellow-50 transition-all duration-200"
                />
              </div>
            </div>

            {/* Message Area */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="message" className="text-sm text-richblack-5 font-medium flex items-center gap-0.5">
                Message <sup className="text-pink-200">*</sup>
              </label>
              <textarea
                name="message"
                id="message"
                rows={5}
                placeholder="Enter your message here..."
                value={formData.message}
                onChange={changeHandler}
                required
                className="w-full rounded-lg bg-richblack-700/70 p-3 text-richblack-5 placeholder-richblack-400 border-b border-richblack-600 outline-none focus:border-yellow-50 focus:ring-1 focus:ring-yellow-50 transition-all duration-200 resize-none"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-3 rounded-lg bg-yellow-50 py-3 px-4 font-semibold text-richblack-900 hover:bg-yellow-100 transition-all duration-200 shadow-[inset_0px_-1px_0px_rgba(255,255,255,0.18)] hover:scale-[0.99] active:scale-[0.97] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Send Message</span>
              <FaPaperPlane size={14} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
