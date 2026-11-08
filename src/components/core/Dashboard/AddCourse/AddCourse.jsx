import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaCheck, FaPlus, FaTrash, FaVideo } from "react-icons/fa";
import { HiOutlineUpload } from "react-icons/hi";
import { toast } from "react-hot-toast";
import {
  fetchCourseCategories,
  addCourseDetails,
  createSection,
  createSubSection,
} from "../../../../services/operations/courseDetailsAPI";

export default function AddCourse() {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [categoriesList, setCategoriesList] = useState([]);
  const [createdCourse, setCreatedCourse] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailSource, setThumbnailSource] = useState("file");
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  // Step 1: Course Info State
  const [courseData, setCourseData] = useState({
    courseTitle: "",
    courseShortDesc: "",
    coursePrice: "",
    courseCategory: "",
    courseTags: "Web Development, React",
    courseBenefits: "",
    thumbnail: "",
  });

  // Step 2: Course Builder State
  const [sections, setSections] = useState([]);
  const [newSectionName, setNewSectionName] = useState("");
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [subSectionData, setSubSectionData] = useState({
    title: "",
    timeDuration: "15m",
    description: "",
    videoSource: "file",
    videoFile: null,
    videoURL: "",
  });
  const [showSubSectionModal, setShowSubSectionModal] = useState(false);

  const steps = [
    { id: 1, title: "Course Information" },
    { id: 2, title: "Course Builder" },
    { id: 3, title: "Publish" },
  ];

  // Fetch categories from database on mount
  useEffect(() => {
    const getCategories = async () => {
      const cats = await fetchCourseCategories();
      setCategoriesList(cats);
      if (cats.length > 0) {
        setCourseData((prev) => ({ ...prev, courseCategory: cats[0]._id }));
      }
    };
    getCategories();
  }, []);

  useEffect(() => {
    if (thumbnailSource === "url" || !thumbnailFile) {
      setThumbnailPreview(thumbnailSource === "url" ? courseData.thumbnail.trim() : "");
      return;
    }

    const previewUrl = URL.createObjectURL(thumbnailFile);
    setThumbnailPreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [thumbnailFile, thumbnailSource, courseData.thumbnail]);

  // Handle Step 1: Submit Course Details to Database
  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    if (
      !courseData.courseTitle ||
      !courseData.courseShortDesc ||
      !courseData.coursePrice ||
      !courseData.courseCategory
    ) {
      toast.error("Please fill all required course fields");
      return;
    }

    setLoading(true);
    const payload = new FormData();
    payload.append("name", courseData.courseTitle);
    payload.append("description", courseData.courseShortDesc);
    payload.append(
      "whatYouWillLearn",
      courseData.courseBenefits || "In-depth modern concepts and hands-on portfolio projects."
    );
    payload.append("price", courseData.coursePrice);
    payload.append("category", courseData.courseCategory);
    payload.append("tag", JSON.stringify(courseData.courseTags.split(",").map((t) => t.trim())));
    if (thumbnailSource === "url") payload.append("thumbnail", courseData.thumbnail.trim());
    if (thumbnailSource === "file" && thumbnailFile) payload.append("thumbnailImage", thumbnailFile);

    const result = await addCourseDetails(payload, token);
    setLoading(false);

    if (result) {
      setCreatedCourse(result);
      setStep(2);
    }
  };

  // Handle Step 2: Add Section to Database
  const handleAddSection = async (e) => {
    e.preventDefault();
    if (!newSectionName.trim()) {
      toast.error("Please enter section name");
      return;
    }

    if (!createdCourse?._id) {
      toast.error("Please create course details first");
      setStep(1);
      return;
    }

    setLoading(true);
    const result = await createSection(
      {
        sectionName: newSectionName,
        courseId: createdCourse._id,
      },
      token
    );
    setLoading(false);

    if (result) {
      setCreatedCourse(result);
      setSections(result.courseContent || []);
      setNewSectionName("");
    }
  };

  // Handle Step 2: Add Subsection / Lecture to Database
  const handleAddSubSection = async (e) => {
    e.preventDefault();
    if (!subSectionData.title.trim()) {
      toast.error("Please enter lecture title");
      return;
    }

    if (subSectionData.videoSource === "file" && !subSectionData.videoFile) {
      toast.error("Please select a video file or switch to video link");
      return;
    }

    if (subSectionData.videoSource === "url" && !subSectionData.videoURL.trim()) {
      toast.error("Please enter a video link");
      return;
    }

    setLoading(true);
    let payload;
    if (subSectionData.videoSource === "file" && subSectionData.videoFile) {
      const formData = new FormData();
      formData.append("sectionId", activeSectionId);
      formData.append("title", subSectionData.title);
      formData.append("timeDuration", subSectionData.timeDuration || "15m");
      formData.append("description", subSectionData.description || subSectionData.title);
      formData.append("video", subSectionData.videoFile);
      payload = formData;
    } else {
      payload = {
        sectionId: activeSectionId,
        title: subSectionData.title,
        timeDuration: subSectionData.timeDuration || "15m",
        description: subSectionData.description || subSectionData.title,
        videoURL: subSectionData.videoURL.trim() || "https://res.cloudinary.com/demo/video/upload/sample.mp4",
      };
    }

    const result = await createSubSection(payload, token);
    setLoading(false);

    if (result) {
      // Update local section view
      setSections((prev) =>
        prev.map((s) => (s._id === activeSectionId ? result : s))
      );
      setShowSubSectionModal(false);
      setSubSectionData({ 
        title: "", 
        timeDuration: "15m", 
        description: "",
        videoSource: "file",
        videoFile: null,
        videoURL: "" 
      });
    }
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
                onClick={() => {
                  if (item.id === 1 || createdCourse) setStep(item.id);
                }}
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

          <div className="absolute top-[18px] left-[15%] w-[32%] border-b border-dashed border-richblack-600 -z-0"></div>
          <div className="absolute top-[18px] left-[53%] w-[32%] border-b border-dashed border-richblack-600 -z-0"></div>
        </div>

        {/* STEP 1: Course Information Form */}
        {step === 1 && (
          <form
            onSubmit={handleCourseSubmit}
            className="space-y-6 rounded-2xl border border-richblack-700 bg-richblack-800 p-8 shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
          >
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-richblack-5">
                Course Title <sup className="text-pink-200">*</sup>
              </label>
              <input
                type="text"
                required
                value={courseData.courseTitle}
                onChange={(e) =>
                  setCourseData({ ...courseData, courseTitle: e.target.value })
                }
                placeholder="Enter Course Title (e.g. Master Full Stack Web Dev)"
                className="w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 border-b border-richblack-600 outline-none focus:border-yellow-50"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-richblack-5">
                Course Short Description <sup className="text-pink-200">*</sup>
              </label>
              <textarea
                rows={3}
                required
                value={courseData.courseShortDesc}
                onChange={(e) =>
                  setCourseData({ ...courseData, courseShortDesc: e.target.value })
                }
                placeholder="Enter Short Description"
                className="w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 border-b border-richblack-600 outline-none focus:border-yellow-50 resize-none"
              ></textarea>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-sm font-medium text-richblack-5">
                  Course Price (₹) <sup className="text-pink-200">*</sup>
                </label>
                <input
                  type="number"
                  required
                  value={courseData.coursePrice}
                  onChange={(e) =>
                    setCourseData({ ...courseData, coursePrice: e.target.value })
                  }
                  placeholder="Ex. ₹1499"
                  className="w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 border-b border-richblack-600 outline-none focus:border-yellow-50"
                />
              </div>

              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-sm font-medium text-richblack-5">
                  Course Category <sup className="text-pink-200">*</sup>
                </label>
                <select
                  required
                  value={courseData.courseCategory}
                  onChange={(e) =>
                    setCourseData({ ...courseData, courseCategory: e.target.value })
                  }
                  className="w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 border-b border-richblack-600 outline-none focus:border-yellow-50"
                >
                  <option value="">Choose a Category</option>
                  {categoriesList.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Thumbnail upload with image preview */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="thumbnail-source" className="text-sm font-medium text-richblack-5">
                Course Thumbnail
              </label>
              <select
                id="thumbnail-source"
                value={thumbnailSource}
                onChange={(e) => setThumbnailSource(e.target.value)}
                className="w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 border-b border-richblack-600 outline-none focus:border-yellow-50"
              >
                <option value="file">Upload image</option>
                <option value="url">Image URL</option>
              </select>
              {thumbnailSource === "url" ? (
                <input
                  type="url"
                  aria-label="Course thumbnail image URL"
                  value={courseData.thumbnail}
                  onChange={(e) => setCourseData({ ...courseData, thumbnail: e.target.value })}
                  placeholder="Paste image URL"
                  className="w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 border-b border-richblack-600 outline-none focus:border-yellow-50 text-sm"
                />
              ) : (
              <>
              <label
                htmlFor="course-thumbnail"
                className="flex w-full max-w-[320px] cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-richblack-500 bg-richblack-700 px-5 py-6 text-center transition hover:border-yellow-50"
              >
                <HiOutlineUpload className="text-2xl text-yellow-50" />
                <span className="text-sm font-medium text-richblack-5">
                  {thumbnailFile ? "Choose a different image" : "Choose an image from your device"}
                </span>
                <span className="text-xs text-richblack-300">Image files only (PNG, JPG, WEBP)</span>
              </label>
              <input
                id="course-thumbnail"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (!file.type.startsWith("image/")) {
                    toast.error("Please choose an image file");
                    e.target.value = "";
                    return;
                  }
                  setThumbnailFile(file);
                }}
              />
              {thumbnailFile && (
                <button
                  type="button"
                  onClick={() => setThumbnailFile(null)}
                  className="w-fit text-xs text-richblack-200 underline hover:text-richblack-5"
                >
                  Remove image
                </button>
              )}
              </>
              )}
              {thumbnailPreview && (
                <img
                  src={thumbnailPreview}
                  alt="Course thumbnail preview"
                  className="mt-2 h-40 w-full max-w-[320px] rounded-lg object-cover border border-richblack-600"
                />
              )}
            </div>

            {/* Benefits of course */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-richblack-5">
                Benefits / What you will learn
              </label>
              <textarea
                rows={3}
                value={courseData.courseBenefits}
                onChange={(e) =>
                  setCourseData({ ...courseData, courseBenefits: e.target.value })
                }
                placeholder="Key takeaways and practical skills students acquire"
                className="w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 border-b border-richblack-600 outline-none focus:border-yellow-50 resize-none"
              ></textarea>
            </div>

            <div className="flex justify-end gap-x-4">
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-yellow-50 py-2.5 px-6 font-semibold text-richblack-900 hover:bg-yellow-100 transition-all cursor-pointer shadow-md disabled:opacity-50"
              >
                {loading ? "Saving to Database..." : "Save & Continue to Builder →"}
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: Course Builder with Real Database Sections & Subsections */}
        {step === 2 && (
          <div className="space-y-8 rounded-2xl border border-richblack-700 bg-richblack-800 p-8 shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
            <div>
              <h2 className="text-2xl font-semibold text-richblack-5">Course Builder</h2>
              <p className="text-xs text-richblack-300 mt-1">
                Course: <span className="text-yellow-50 font-medium">{createdCourse?.name}</span>
              </p>
            </div>

            {/* Add Section Form */}
            <form onSubmit={handleAddSection} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-richblack-5">
                  Section Name <sup className="text-pink-200">*</sup>
                </label>
                <input
                  type="text"
                  value={newSectionName}
                  onChange={(e) => setNewSectionName(e.target.value)}
                  placeholder="Add Section Name (e.g. Module 1: Introduction to Architecture)"
                  className="w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 border-b border-richblack-600 outline-none focus:border-yellow-50"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-x-2 rounded-lg border border-yellow-50 py-2 px-5 font-semibold text-yellow-50 hover:bg-yellow-50 hover:text-richblack-900 transition-all cursor-pointer disabled:opacity-50"
              >
                <FaPlus className="text-xs" />
                <span>{loading ? "Saving Section..." : "Add Section to Database"}</span>
              </button>
            </form>

            {/* Sections & Subsections Accordion List */}
            <div className="space-y-4 mt-6">
              {sections.map((sec, idx) => {
                const subSecs = sec.subsections || sec.subSection || [];
                return (
                  <div
                    key={sec._id || idx}
                    className="rounded-xl border border-richblack-700 bg-richblack-700/50 p-4"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-richblack-600">
                      <div>
                        <p className="font-semibold text-richblack-50">{sec.sectionName}</p>
                        <p className="text-xs text-richblack-400">
                          {subSecs.length} lecture(s)
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveSectionId(sec._id);
                          setShowSubSectionModal(true);
                        }}
                        className="flex items-center gap-x-1.5 text-xs text-yellow-50 border border-yellow-50/40 rounded-md px-3 py-1.5 hover:bg-yellow-50 hover:text-richblack-900 transition-colors cursor-pointer"
                      >
                        <FaPlus className="text-[10px]" />
                        <span>Add Lecture</span>
                      </button>
                    </div>

                    {/* Subsections under this section */}
                    <div className="mt-3 space-y-2">
                      {subSecs.map((sub, sIdx) => (
                        <div
                          key={sub._id || sIdx}
                          className="flex items-center justify-between bg-richblack-800 p-2.5 px-4 rounded-lg text-xs text-richblack-200"
                        >
                          <div className="flex items-center gap-2">
                            <FaVideo className="text-yellow-50" />
                            <span className="font-medium text-richblack-50">{sub.title}</span>
                          </div>
                          <span className="text-richblack-400">{sub.timeDuration || "15m"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
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
                Make this Course Public in Catalog
              </label>
            </div>

            <div className="p-4 bg-richblack-700/50 rounded-lg text-xs text-richblack-200 space-y-1">
              <p>Course: <strong className="text-richblack-50">{createdCourse?.name}</strong></p>
              <p>Price: <strong className="text-yellow-50">₹{createdCourse?.price}</strong></p>
              <p>Curriculum Sections: <strong className="text-richblack-50">{sections.length}</strong></p>
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
                onClick={() => {
                  toast.success("Course is published and ready for enrollment!");
                  if (createdCourse?._id) {
                    navigate(`/course/${createdCourse._id}`);
                  } else {
                    navigate("/dashboard/my-courses");
                  }
                }}
                className="rounded-lg bg-yellow-50 py-2.5 px-6 font-semibold text-richblack-900 hover:bg-yellow-100 transition-all cursor-pointer shadow-md"
              >
                View Published Course
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sub-section Modal for Adding Lecture */}
      {showSubSectionModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-richblack-900/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-[500px] rounded-2xl border border-richblack-700 bg-richblack-800 p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-richblack-5 mb-4">Add Lecture to Section</h3>
            <form onSubmit={handleAddSubSection} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-richblack-200">Lecture Title *</label>
                <input
                  type="text"
                  required
                  value={subSectionData.title}
                  onChange={(e) =>
                    setSubSectionData({ ...subSectionData, title: e.target.value })
                  }
                  placeholder="e.g. Introduction & Setup"
                  className="w-full rounded-lg bg-richblack-700 p-2.5 text-richblack-5 text-sm border-b border-richblack-600 outline-none focus:border-yellow-50"
                />
              </div>

              {/* Video Source Selection (File or Link) */}
              <div className="flex flex-col gap-2">
                <label className="text-xs text-richblack-200">Lecture Video *</label>
                <div className="flex rounded-lg bg-richblack-900 p-1 border border-richblack-700 text-xs">
                  <button
                    type="button"
                    onClick={() => setSubSectionData({ ...subSectionData, videoSource: "file" })}
                    className={`flex-1 py-1.5 font-medium rounded-md transition-all cursor-pointer ${
                      subSectionData.videoSource === "file"
                        ? "bg-richblack-700 text-yellow-50 shadow-sm"
                        : "text-richblack-300 hover:text-white"
                    }`}
                  >
                    Upload from Machine
                  </button>
                  <button
                    type="button"
                    onClick={() => setSubSectionData({ ...subSectionData, videoSource: "url" })}
                    className={`flex-1 py-1.5 font-medium rounded-md transition-all cursor-pointer ${
                      subSectionData.videoSource === "url"
                        ? "bg-richblack-700 text-yellow-50 shadow-sm"
                        : "text-richblack-300 hover:text-white"
                    }`}
                  >
                    Enter Video Link / URL
                  </button>
                </div>

                {subSectionData.videoSource === "file" ? (
                  <div className="relative mt-1">
                    <label className="flex flex-col items-center justify-center w-full min-h-[90px] border-2 border-dashed border-richblack-600 rounded-lg cursor-pointer bg-richblack-700/50 hover:bg-richblack-700/80 transition-colors p-3">
                      <HiOutlineUpload className="text-2xl text-yellow-50 mb-1" />
                      <span className="text-xs text-richblack-200 font-medium truncate max-w-[280px]">
                        {subSectionData.videoFile ? subSectionData.videoFile.name : "Click to browse video file (mp4, mkv, webm)"}
                      </span>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setSubSectionData({ ...subSectionData, videoFile: file });
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <div className="mt-1">
                    <input
                      type="url"
                      value={subSectionData.videoURL}
                      onChange={(e) =>
                        setSubSectionData({ ...subSectionData, videoURL: e.target.value })
                      }
                      placeholder="https://example.com/video.mp4"
                      className="w-full rounded-lg bg-richblack-700 p-2.5 text-richblack-5 text-sm border-b border-richblack-600 outline-none focus:border-yellow-50"
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-richblack-200">Duration</label>
                <input
                  type="text"
                  value={subSectionData.timeDuration}
                  onChange={(e) =>
                    setSubSectionData({ ...subSectionData, timeDuration: e.target.value })
                  }
                  placeholder="e.g. 12m 30s"
                  className="w-full rounded-lg bg-richblack-700 p-2.5 text-richblack-5 text-sm border-b border-richblack-600 outline-none focus:border-yellow-50"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-richblack-200">Lecture Overview</label>
                <textarea
                  rows={2}
                  value={subSectionData.description}
                  onChange={(e) =>
                    setSubSectionData({ ...subSectionData, description: e.target.value })
                  }
                  placeholder="Summary of topics covered"
                  className="w-full rounded-lg bg-richblack-700 p-2.5 text-richblack-5 text-sm border-b border-richblack-600 outline-none focus:border-yellow-50 resize-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowSubSectionModal(false)}
                  className="rounded-lg bg-richblack-700 px-4 py-2 text-xs font-semibold text-richblack-100 hover:bg-richblack-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-yellow-50 px-4 py-2 text-xs font-semibold text-richblack-900 hover:bg-yellow-100 disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Add Lecture"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Right Column: Course Upload Tips Card */}
      <div className="hidden xl:block max-w-[380px] rounded-2xl border border-richblack-700 bg-richblack-800 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.2)] sticky top-24">
        <h3 className="flex items-center gap-x-2 text-lg font-semibold text-richblack-5 mb-5">
          <span className="text-yellow-50 text-xl font-bold">⚡</span>
          <span>Course Upload Tips</span>
        </h3>
        <ul className="space-y-3.5 text-xs text-richblack-100 leading-relaxed list-disc pl-5">
          <li>Set the Course Price option or make it free.</li>
          <li>Choose an existing category from your database.</li>
          <li>In Step 2 (Course Builder), add real curriculum sections.</li>
          <li>Add lectures/subsections with time duration under each section.</li>
          <li>Publishing directly syncs with the Catalog & Course Details pages.</li>
        </ul>
      </div>
    </div>
  );
}
