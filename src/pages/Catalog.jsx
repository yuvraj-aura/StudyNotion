import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";

export default function Catalog() {
  const { catalogueName } = useParams();
  const [activeTab, setActiveTab] = useState("Most Popular");

  // Format category title from slug
  const formattedTitle = catalogueName
    ? catalogueName
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    : "Android Development";

  // Mock catalog courses matching search & filter screenshot
  const courses = [
    {
      _id: "course-1",
      courseName: "DummyCourse 1",
      instructor: "Babbar Sir",
      thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80",
      rating: 0,
      reviewsCount: 0,
      price: 999,
    },
    {
      _id: "course-2",
      courseName: "CSS Box Model & Responsive Design",
      instructor: "Love Babbar",
      thumbnail: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80",
      rating: 4.8,
      reviewsCount: 120,
      price: 1299,
    },
    {
      _id: "course-3",
      courseName: "Android Kotlin Masterclass",
      instructor: "Bumble Banerjee",
      thumbnail: "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?auto=format&fit=crop&w=600&q=80",
      rating: 4.9,
      reviewsCount: 340,
      price: 1499,
    },
  ];

  return (
    <div className="w-full bg-richblack-900 text-richblack-5 font-inter">
      {/* Hero Category Header matching Screenshot */}
      <div className="bg-richblack-800 py-12 border-b border-richblack-700">
        <div className="w-11/12 max-w-[1260px] mx-auto flex flex-col gap-y-3">
          {/* Breadcrumb */}
          <div className="flex items-center gap-x-2 text-xs text-richblack-300">
            <Link to="/" className="hover:text-yellow-50">
              Home
            </Link>
            <span>/</span>
            <span>Catalog</span>
            <span>/</span>
            <span className="text-yellow-50">{formattedTitle}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-richblack-5">
            {formattedTitle}
          </h1>
          <p className="text-sm text-richblack-300 max-w-[800px] leading-relaxed">
            {formattedTitle} is a premier programming discipline. Master fundamentals,
            advanced architectural patterns, and production-ready applications with hands-on labs.
          </p>
        </div>
      </div>

      {/* Main Catalog Body */}
      <div className="w-11/12 max-w-[1260px] mx-auto py-12 flex flex-col gap-y-16">
        {/* Section 1: Courses to get you started */}
        <div className="flex flex-col gap-y-6">
          <h2 className="text-2xl sm:text-3xl font-semibold text-richblack-5">
            Courses to get you started
          </h2>

          {/* Filter Pills matching Screenshot */}
          <div className="flex border-b border-richblack-700 gap-x-6 text-sm font-medium">
            {["Most Popular", "New"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2.5 transition-all duration-200 cursor-pointer ${
                  activeTab === tab
                    ? "border-b-2 border-yellow-50 text-yellow-50 font-semibold"
                    : "text-richblack-400 hover:text-richblack-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
            {courses.map((c) => (
              <Link to={`/course/${c._id}`} key={c._id} className="group flex flex-col">
                <div className="relative overflow-hidden rounded-xl border border-richblack-700 bg-richblack-800 shadow-lg group-hover:scale-[1.02] transition-transform duration-200">
                  <img
                    src={c.thumbnail}
                    alt={c.courseName}
                    className="h-[200px] w-full object-cover"
                  />
                  <div className="p-5 flex flex-col gap-y-2">
                    <h3 className="font-semibold text-base text-richblack-5 group-hover:text-yellow-50 transition-colors">
                      {c.courseName}
                    </h3>
                    <p className="text-xs text-richblack-400">By {c.instructor}</p>

                    <div className="flex items-center gap-x-2 text-xs">
                      <span className="font-semibold text-yellow-50">{c.rating}</span>
                      <div className="flex text-yellow-50 text-xs">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className={i < Math.floor(c.rating) ? "text-yellow-50" : "text-richblack-600"} />
                        ))}
                      </div>
                      <span className="text-richblack-400">({c.reviewsCount})</span>
                    </div>

                    <p className="text-base font-bold text-richblack-5 mt-1">
                      Rs. {c.price}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Section 2: Top Courses in Web Development */}
        <div className="flex flex-col gap-y-6">
          <h2 className="text-2xl sm:text-3xl font-semibold text-richblack-5">
            Top courses in Web Development
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.slice(0, 2).map((c, i) => (
              <Link to={`/course/${c._id}`} key={i} className="group flex flex-col">
                <div className="relative overflow-hidden rounded-xl border border-richblack-700 bg-richblack-800 shadow-lg group-hover:scale-[1.02] transition-transform duration-200">
                  <img
                    src={c.thumbnail}
                    alt={c.courseName}
                    className="h-[200px] w-full object-cover"
                  />
                  <div className="p-5 flex flex-col gap-y-2">
                    <h3 className="font-semibold text-base text-richblack-5 group-hover:text-yellow-50 transition-colors">
                      {c.courseName}
                    </h3>
                    <p className="text-xs text-richblack-400">By {c.instructor}</p>
                    <p className="text-base font-bold text-richblack-5 mt-1">
                      Rs. {c.price}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
