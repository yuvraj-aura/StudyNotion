import React from "react";
import { Link } from "react-router-dom";

export default function Error() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)] justify-center items-center text-3xl text-richblack-5 font-inter gap-y-4">
      <h1 className="text-6xl font-extrabold text-yellow-50">404</h1>
      <p className="text-xl text-richblack-300">Error - Page Not Found</p>
      <Link to="/">
        <button className="mt-4 rounded-lg bg-yellow-50 py-2.5 px-6 text-sm font-semibold text-richblack-900 hover:bg-yellow-100 transition-all cursor-pointer shadow-md">
          Return Home
        </button>
      </Link>
    </div>
  );
}
