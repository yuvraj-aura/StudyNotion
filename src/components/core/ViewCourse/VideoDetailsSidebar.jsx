import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useSelector } from 'react-redux';
import { IoChevronBack, IoChevronDown, IoCheckmarkCircle, IoCheckmarkCircleOutline, IoPlayCircleOutline } from "react-icons/io5";
import { AiFillStar } from "react-icons/ai";
import { HiOutlineAcademicCap } from "react-icons/hi2";
import IconBtn from "../../common/IconBtn";

const VideoDetailsSidebar = ({ setReviewModal }) => {
    const [activeStatus, setActiveStatus] = useState("");
    const [videobarActive, setVideobarActive] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    const { courseId, sectionId, subSectionId } = useParams();

    const {
        courseSectionData = [],
        courseEntireData = {},
        totalNoOfLectures = 0,
        completedLectures = [],
    } = useSelector((state) => state.viewCourse);

    // Sync active section and subsection based on URL params
    useEffect(() => {
        if (!courseSectionData?.length) return;

        const currentSectionIndex = courseSectionData.findIndex(
            (sec) => sec._id === sectionId
        );

        if (currentSectionIndex === -1) return;

        const currentSubSectionIndex = courseSectionData[currentSectionIndex]?.subsections?.findIndex(
            (sub) => sub._id === subSectionId
        );

        const activeSubSecId = courseSectionData[currentSectionIndex]?.subsections?.[currentSubSectionIndex]?._id;

        setActiveStatus(courseSectionData[currentSectionIndex]?._id);
        if (activeSubSecId) {
            setVideobarActive(activeSubSecId);
        }
    }, [courseSectionData, courseEntireData, location.pathname, sectionId, subSectionId]);

    const completedCount = completedLectures?.length || 0;
    const progressPercent = totalNoOfLectures > 0 
        ? Math.round((completedCount / totalNoOfLectures) * 100) 
        : 0;

    return (
        <aside className="h-[calc(100vh-3.5rem)] w-full max-w-87.5 border-r border-r-richblack-700 bg-richblack-800 flex flex-col select-none shrink-0">
            
            {/* Header / Meta Section */}
            <div className="p-4 border-b border-richblack-700 bg-richblack-800/80 backdrop-blur-sm sticky top-0 z-10">
                
                {/* Actions Bar */}
                <div className="flex items-center justify-between gap-2 mb-4">
                    <button
                        onClick={() => navigate("/dashboard/enrolled-courses")}
                        className="flex items-center gap-1.5 text-xs font-medium text-richblack-300 hover:text-richblack-5 bg-richblack-700/60 hover:bg-richblack-700 px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer"
                        title="Back to Enrolled Courses"
                    >
                        <IoChevronBack className="text-base" />
                        <span>Courses</span>
                    </button>

                    <button
                        onClick={() => setReviewModal(true)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-richblack-900 bg-yellow-50 hover:bg-yellow-100 px-3 py-1.5 rounded-lg transition-all duration-200 shadow-[0_2px_8px_rgba(255,214,10,0.25)] hover:shadow-[0_4px_12px_rgba(255,214,10,0.35)] cursor-pointer"
                    >
                        <AiFillStar className="text-sm" />
                        <span>Add Review</span>
                    </button>
                </div>

                {/* Course Title & Progress Bar */}
                <div>
                    <h2 className="text-base font-bold text-richblack-5 line-clamp-1 leading-snug">
                        {courseEntireData?.name}
                    </h2>
                    
                    {/* Progress Info */}
                    <div className="mt-2.5">
                        <div className="flex items-center justify-between text-xs text-richblack-300 mb-1.5">
                            <span className="flex items-center gap-1">
                                <HiOutlineAcademicCap className="text-sm text-yellow-50" />
                                <span>{completedCount} of {totalNoOfLectures} Lessons</span>
                            </span>
                            <span className="font-semibold text-richblack-100">{progressPercent}%</span>
                        </div>
                        {/* Progress Bar Track */}
                        <div className="h-1.5 w-full rounded-full bg-richblack-700 overflow-hidden">
                            <div 
                                className="h-full rounded-full bg-linear-to-r from-yellow-100 to-yellow-50 transition-all duration-300"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Sections Accordion List */}
            <div className="flex-1 overflow-y-auto divide-y divide-richblack-700/60">
                {courseSectionData?.length === 0 ? (
                    <div className="p-6 text-center text-xs text-richblack-400">
                        No sections available
                    </div>
                ) : (
                    courseSectionData?.map((section) => {
                        const isSectionOpen = activeStatus === section?._id;
                        const sectionLecturesCount = section?.subsections?.length || 0;
                        const sectionCompletedCount = section?.subsections?.filter(
                            (item) => completedLectures.includes(item?._id)
                        )?.length || 0;

                        return (
                            <div key={section?._id} className="transition-colors">
                                {/* Section Accordion Trigger */}
                                <button
                                    type="button"
                                    onClick={() => setActiveStatus(isSectionOpen ? "" : section?._id)}
                                    className={`w-full flex items-center justify-between px-4 py-3.5 text-left transition-colors cursor-pointer ${
                                        isSectionOpen 
                                            ? "bg-richblack-700/50 text-richblack-5" 
                                            : "hover:bg-richblack-700/30 text-richblack-200"
                                    }`}
                                >
                                    <div className="flex items-center gap-2.5 pr-2 min-w-0">
                                        <IoChevronDown
                                            className={`text-sm text-richblack-400 transition-transform duration-200 shrink-0 ${
                                                isSectionOpen ? "rotate-180 text-yellow-50" : ""
                                            }`}
                                        />
                                        <span className="text-xs font-semibold truncate">
                                            {section?.sectionName}
                                        </span>
                                    </div>

                                    {/* Lecture counter pill */}
                                    <span className="text-[11px] font-medium text-richblack-400 bg-richblack-800 px-2 py-0.5 rounded-full shrink-0 border border-richblack-700">
                                        {sectionCompletedCount}/{sectionLecturesCount}
                                    </span>
                                </button>

                                {/* Subsections / Lectures List */}
                                {isSectionOpen && (
                                    <div className="bg-richblack-900/60 py-1 divide-y divide-richblack-800">
                                        {section?.subsections?.map((topic) => {
                                            const isSelected = videobarActive === topic?._id;
                                            const isCompleted = completedLectures.includes(topic?._id);

                                            return (
                                                <div
                                                    key={topic?._id}
                                                    onClick={() => {
                                                        navigate(
                                                            `/view-course/${courseId || courseEntireData?._id}/section/${section?._id}/sub-section/${topic?._id}`
                                                        );
                                                        setVideobarActive(topic?._id);
                                                    }}
                                                    className={`group flex items-center justify-between gap-3 px-4 py-3 text-xs cursor-pointer transition-all border-l-[3px] ${
                                                        isSelected
                                                            ? "border-yellow-50 bg-richblack-700 text-richblack-5 font-semibold shadow-inner"
                                                            : "border-transparent text-richblack-200 hover:bg-richblack-800/80 hover:text-richblack-5"
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2.5 min-w-0">
                                                        {isCompleted ? (
                                                            <IoCheckmarkCircle className="text-base text-caribbeangreen-200 shrink-0" />
                                                        ) : (
                                                            <IoPlayCircleOutline className={`text-base shrink-0 transition-colors ${
                                                                isSelected ? "text-yellow-50" : "text-richblack-400 group-hover:text-richblack-200"
                                                            }`} />
                                                        )}
                                                        <span className="truncate">{topic?.title}</span>
                                                    </div>

                                                    {/* Duration or Completed badge */}
                                                    {topic?.timeDuration && (
                                                        <span className="text-[10px] text-richblack-400 shrink-0">
                                                            {topic.timeDuration}m
                                                        </span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </aside>
    );
};

export default VideoDetailsSidebar;
