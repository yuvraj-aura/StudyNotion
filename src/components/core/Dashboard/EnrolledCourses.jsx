import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function EnrolledCourses() {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Mock initial enrolled courses matching user screenshot
  const [enrolledCourses, setEnrolledCourses] = useState([
    {
      _id: "course101",
      courseName: "Web Dev 1",
      courseDescription: "Nulla alias aut non. Complete Fullstack fundamentals and modern frontend development.",
      thumbnail: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?auto=format&fit=crop&w=400&q=80",
      totalDuration: "2hr 30min",
      progressPercentage: 0,
    },
    {
      _id: "course102",
      courseName: "DSA Masterclass",
      courseDescription: "Problem solving, algorithmic patterns, Leetcode practice with Python and C++.",
      thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80",
      totalDuration: "8hr 45min",
      progressPercentage: 35,
    },
  ]);

  return (
    <div className="text-white font-inter flex flex-col gap-y-6">
      <h1 className="text-3xl font-semibold text-richblack-5">Enrolled Courses</h1>

      {!enrolledCourses ? (
        <div className="grid min-h-[calc(100vh-12rem)] place-items-center">
          <div className="spinner"></div>
        </div>
      ) : !enrolledCourses.length ? (
        <p className="grid h-[10vh] w-full place-content-center text-richblack-300">
          You have not enrolled in any course yet.
        </p>
      ) : (
        <div className="my-6 rounded-t-xl border border-richblack-700 bg-richblack-800 overflow-hidden shadow-xl">
          {/* Table Header matching screenshot */}
          <div className="flex rounded-t-xl bg-richblack-700/80 p-4 px-6 text-sm font-semibold text-richblack-50">
            <p className="w-[45%]">Course Name</p>
            <p className="w-1/4">Duration</p>
            <p className="flex-1">Progress</p>
          </div>

          {/* Cards / Rows */}
          {enrolledCourses.map((course, i, arr) => (
            <div
              key={course._id || i}
              className={`flex items-center border-b border-richblack-700/60 p-5 px-6 gap-x-4 hover:bg-richblack-750 transition-colors duration-150 ${
                i === arr.length - 1 ? "border-b-0" : ""
              }`}
            >
              {/* Course Name & Thumbnail */}
              <div
                className="flex w-[45%] cursor-pointer items-center gap-4"
                onClick={() => {
                  navigate(`/view-course/${course?._id}/section/1/sub-section/1`);
                }}
              >
                <img
                  src={course.thumbnail}
                  alt={course.courseName}
                  className="h-14 w-14 rounded-lg object-cover border border-richblack-700 shrink-0"
                />
                <div className="flex max-w-xs flex-col gap-1">
                  <p className="font-semibold text-richblack-5 text-sm sm:text-base hover:text-yellow-50 transition-colors">
                    {course.courseName}
                  </p>
                  <p className="text-xs text-richblack-300 line-clamp-1">
                    {course.courseDescription}
                  </p>
                </div>
              </div>

              {/* Duration */}
              <div className="w-1/4 text-sm text-richblack-200 font-medium">
                {course?.totalDuration || "2hr 30min"}
              </div>

              {/* Progress Bar & Label */}
              <div className="flex flex-1 flex-col gap-2">
                <p className="text-xs font-semibold text-richblack-50">
                  Progress: {course.progressPercentage || 0}%
                </p>
                <div className="w-full bg-richblack-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-yellow-50 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${course.progressPercentage || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
