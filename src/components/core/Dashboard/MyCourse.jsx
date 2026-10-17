import React from "react";
import { Link } from "react-router-dom";
import { VscAdd } from "react-icons/vsc";

export default function MyCourse() {
  const courses = [
    {
      _id: "inst-1",
      courseName: "Fullstack Web Development with MERN",
      status: "Published",
      price: 1999,
      students: 48,
      thumbnail: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?auto=format&fit=crop&w=400&q=80",
    },
    {
      _id: "inst-2",
      courseName: "Data Structures & Algorithms Live",
      status: "Draft",
      price: 1499,
      students: 0,
      thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80",
    },
  ];

  return (
    <div className="text-richblack-5 font-inter flex flex-col gap-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-richblack-5">My Courses</h1>
        <Link to="/dashboard/add-course">
          <button className="flex items-center gap-x-2 rounded-lg bg-yellow-50 py-2.5 px-5 font-semibold text-richblack-900 hover:bg-yellow-100 transition-all cursor-pointer shadow-md">
            <VscAdd className="text-lg" />
            <span>Add Course</span>
          </button>
        </Link>
      </div>

      <div className="rounded-xl border border-richblack-700 bg-richblack-800 overflow-hidden shadow-xl mt-4">
        <div className="flex bg-richblack-700/80 p-4 px-6 text-sm font-semibold text-richblack-50">
          <p className="w-[50%]">Courses</p>
          <p className="w-[20%]">Status</p>
          <p className="w-[15%]">Price</p>
          <p className="w-[15%]">Students</p>
        </div>

        {courses.map((course, idx) => (
          <div
            key={course._id || idx}
            className="flex items-center border-b border-richblack-700/60 p-5 px-6 gap-x-4 hover:bg-richblack-750 transition-colors"
          >
            <div className="flex w-[50%] items-center gap-4">
              <img
                src={course.thumbnail}
                alt={course.courseName}
                className="h-14 w-14 rounded-lg object-cover border border-richblack-700 shrink-0"
              />
              <p className="font-semibold text-sm sm:text-base text-richblack-5">
                {course.courseName}
              </p>
            </div>
            <div className="w-[20%]">
              <span
                className={`text-xs px-3 py-1 rounded-full font-medium ${
                  course.status === "Published"
                    ? "bg-caribbeangreen-800/40 text-caribbeangreen-200 border border-caribbeangreen-500/30"
                    : "bg-pink-800/40 text-pink-200 border border-pink-500/30"
                }`}
              >
                {course.status}
              </span>
            </div>
            <div className="w-[15%] text-sm font-medium text-richblack-5">
              ₹{course.price}
            </div>
            <div className="w-[15%] text-sm text-richblack-200">
              {course.students}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
