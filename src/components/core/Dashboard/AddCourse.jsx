import React, { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { HiOutlineUpload } from "react-icons/hi";
import { toast } from "react-toastify";
import logoImg from "../../../assets/Logo.svg";

export default function AddCourse() {
  const [step, setStep] = useState(1);
  const [courseData, setCourseData] = useState({
    courseTitle: "Payment 1",
    courseShortDesc: "Payment 1",
    coursePrice: "",
    courseCategory: "",
    courseTags: [],
    courseBenefits: "",
    courseRequirements: "",
    thumbnail: null,
  });

  const [sections, setSections] = useState([
    {
      id: 1,
      sectionName: "Section 1",
      subSections: [],
    },
  ]);
  const [newSectionName, setNewSectionName] = useState("");

  const steps = [
    { id: 1, title: "Course Information" },
    { id: 2, title: "Course Builder" },
    { id: 3, title: "Publish" },
  ];

  const handleAddSection = (e) => {
    e.preventDefault();
    if (!newSectionName.trim()) {
      toast.error("Please enter section name");
      return;
    }
    setSections((prev) => [
      ...prev,
      { id: Date.now(), sectionName: newSectionName, subSections: [] },
    ]);
    toast.success("Section created successfully");
    setNewSectionName("");
  };

  return (
    <div className="flex w-full items-start gap-x-8 font-inter text-richblack-5">
      {/* Left Column: Form & Multi-step Builder */}
      <div className="flex flex-1 flex-col">
        <h1 className="mb-8 text-3xl font-semibold text-richblack-5">Add Course</h1>

        {/* Multi-step progress numbers */}
        <div className="relative mb-12 flex w-full justify-between items-center px-6">
          {steps.map((item) => (
            <div key={item.id} className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => setStep(item.id)}
                className={`grid cursor-pointer aspect-square w-[38px] place-items-center rounded-full border text-sm font-semibold transition-all duration-200 ${
                  step === item.id
                    ? "border-yellow-50 bg-yellow-900/40 text-yellow-50"
                    : step > item.id
                    ? "border-yellow-50 bg-yellow-50 text-richblack-900"
                    : "border-richblack-700 bg-richblack-800 text-richblack-300"
                }`}
              >
                {step > item.id ? <FaCheck className="font-bold text-xs" /> : item.id}
              </button>
              <p
                className={`text-xs mt-2 font-medium ${
                  step >= item.id ? "text-richblack-5" : "text-richblack-400"
                }`}
              >
                {item.title}
              </p>
            </div>
          ))}

          {/* Dotted lines between steps */}
          <div className="absolute top-[18px] left-[15%] w-[32%] border-b border-dashed border-richblack-600 -z-0"></div>
          <div className="absolute top-[18px] left-[53%] w-[32%] border-b border-dashed border-richblack-600 -z-0"></div>
        </div>

        {/* STEP 1: Course Information Form */}
        {step === 1 && (
          <div className="space-y-6 rounded-2xl border border-richblack-700 bg-richblack-800 p-8 shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-richblack-5">
                Course Title <sup className="text-pink-200">*</sup>
              </label>
              <input
                type="text"
                value={courseData.courseTitle}
                onChange={(e) =>
                  setCourseData({ ...courseData, courseTitle: e.target.value })
                }
                placeholder="Enter Course Title"
                className="w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 border-b border-richblack-600 outline-none focus:border-yellow-50"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-richblack-5">
                Course Short Description <sup className="text-pink-200">*</sup>
              </label>
              <textarea
                rows={4}
                value={courseData.courseShortDesc}
                onChange={(e) =>
                  setCourseData({ ...courseData, courseShortDesc: e.target.value })
                }
                placeholder="Enter Description"
                className="w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 border-b border-richblack-600 outline-none focus:border-yellow-50 resize-none"
              ></textarea>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-richblack-5">
                Course Price <sup className="text-pink-200">*</sup>
              </label>
              <input
                type="number"
                value={courseData.coursePrice}
                onChange={(e) =>
                  setCourseData({ ...courseData, coursePrice: e.target.value })
                }
                placeholder="₹ Enter Course Price"
                className="w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 border-b border-richblack-600 outline-none focus:border-yellow-50"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-richblack-5">
                Course Category <sup className="text-pink-200">*</sup>
              </label>
              <select
                value={courseData.courseCategory}
                onChange={(e) =>
                  setCourseData({ ...courseData, courseCategory: e.target.value })
                }
                className="w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 border-b border-richblack-600 outline-none focus:border-yellow-50"
              >
                <option value="">Choose a Category</option>
                <option value="web-dev">Web Development</option>
                <option value="android-dev">Android Development</option>
                <option value="python">Python</option>
                <option value="dsa">DSA</option>
              </select>
            </div>

            {/* Thumbnail upload box */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-richblack-5">
                Course Thumbnail <sup className="text-pink-200">*</sup>
              </label>
              <div className="flex min-h-[220px] cursor-pointer items-center justify-center rounded-xl border-2 border-dotted border-richblack-600 bg-richblack-700/50 p-6 hover:bg-richblack-700 transition-all">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-richblack-800 flex items-center justify-center text-yellow-50 mb-3">
                    <HiOutlineUpload size={24} />
                  </div>
                  <p className="text-sm font-semibold text-richblack-200">
                    Drag and drop an image, or{" "}
                    <span className="text-yellow-50 underline">Browse</span>
                  </p>
                  <p className="text-xs text-richblack-400 mt-1">
                    Aspect ratio 16:9 (Recommended size 1024x576)
                  </p>
                </div>
              </div>
            </div>

            {/* Benefits of course */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-richblack-5">
                Benefits of the course <sup className="text-pink-200">*</sup>
              </label>
              <textarea
                rows={3}
                value={courseData.courseBenefits}
                onChange={(e) =>
                  setCourseData({ ...courseData, courseBenefits: e.target.value })
                }
                placeholder="Enter benefits of the course"
                className="w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 border-b border-richblack-600 outline-none focus:border-yellow-50 resize-none"
              ></textarea>
            </div>

            <div className="flex justify-end gap-x-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="rounded-lg bg-yellow-50 py-2.5 px-6 font-semibold text-richblack-900 hover:bg-yellow-100 transition-all cursor-pointer shadow-md"
              >
                Next &rarr;
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Course Builder Form (Matching Screenshot 3) */}
        {step === 2 && (
          <div className="space-y-8 rounded-2xl border border-richblack-700 bg-richblack-800 p-8 shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
            <h2 className="text-2xl font-semibold text-richblack-5">Course Builder</h2>

            <form onSubmit={handleAddSection} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-richblack-5">
                  Section Name <sup className="text-pink-200">*</sup>
                </label>
                <input
                  type="text"
                  value={newSectionName}
                  onChange={(e) => setNewSectionName(e.target.value)}
                  placeholder="Add a section name (e.g. Intro to Node.js)"
                  className="w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 border-b border-richblack-600 outline-none focus:border-yellow-50"
                />
              </div>

              <button
                type="submit"
                className="flex items-center gap-x-2 rounded-lg border border-yellow-50 py-2 px-5 font-semibold text-yellow-50 hover:bg-yellow-50 hover:text-richblack-900 transition-all cursor-pointer"
              >
                Create Section
              </button>
            </form>

            {/* List of created sections */}
            <div className="space-y-3 mt-6">
              {sections.map((sec, idx) => (
                <div
                  key={sec.id || idx}
                  className="flex items-center justify-between rounded-lg border border-richblack-700 bg-richblack-700/60 p-4 px-5"
                >
                  <p className="font-semibold text-richblack-50">{sec.sectionName}</p>
                  <span className="text-xs text-richblack-400">0 Sub-sections</span>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-x-4 pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="rounded-lg bg-richblack-700 py-2.5 px-6 font-semibold text-richblack-50 hover:bg-richblack-600 transition-all cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="rounded-lg bg-yellow-50 py-2.5 px-6 font-semibold text-richblack-900 hover:bg-yellow-100 transition-all cursor-pointer shadow-md"
              >
                Next &rarr;
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Publish Form */}
        {step === 3 && (
          <div className="space-y-6 rounded-2xl border border-richblack-700 bg-richblack-800 p-8 shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
            <h2 className="text-2xl font-semibold text-richblack-5">Publish Settings</h2>
            <div className="flex items-center gap-x-3">
              <input
                type="checkbox"
                id="public"
                defaultChecked
                className="h-4 w-4 rounded border-richblack-700 text-yellow-50 focus:ring-yellow-50"
              />
              <label htmlFor="public" className="text-sm font-medium text-richblack-5">
                Make this Course Public
              </label>
            </div>

            <div className="flex justify-end gap-x-4 pt-6">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="rounded-lg bg-richblack-700 py-2.5 px-6 font-semibold text-richblack-50 hover:bg-richblack-600 transition-all cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => toast.success("Course Published Successfully!")}
                className="rounded-lg bg-yellow-50 py-2.5 px-6 font-semibold text-richblack-900 hover:bg-yellow-100 transition-all cursor-pointer shadow-md"
              >
                Publish Course
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Course Upload Tips Card (Matching Screenshots 1, 2, 3) */}
      <div className="hidden xl:block max-w-[380px] rounded-2xl border border-richblack-700 bg-richblack-800 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.2)] sticky top-24">
        <h3 className="flex items-center gap-x-2 text-lg font-semibold text-richblack-5 mb-5">
          <span className="text-yellow-50 text-xl font-bold">⚡</span>
          <span>Course Upload Tips</span>
        </h3>
        <ul className="space-y-3.5 text-xs text-richblack-100 leading-relaxed list-disc pl-5">
          <li>Set the Course Price option or make it free.</li>
          <li>Standard size for the course thumbnail is 1024x576.</li>
          <li>Video section controls the course overview video.</li>
          <li>Course Builder is where you create & organize a course.</li>
          <li>
            Add Topics in the Course Builder section to create lessons, quizzes, and
            assignments.
          </li>
          <li>
            Information from the Additional Data section shows up on the course single
            page.
          </li>
          <li>Make Announcements to notify any important updates.</li>
          <li>Notes to all enrolled students at once.</li>
        </ul>
      </div>
    </div>
  );
}
