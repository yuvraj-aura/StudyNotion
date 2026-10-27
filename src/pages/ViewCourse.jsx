import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useParams } from 'react-router-dom';
import { 
    setCourseSectionData, 
    setEntireCourseData, 
    setTotalNoOfLectures, 
    setCompletedLectures 
} from "../redux/slices/viewCourseSlice";
import { getFullDetailsOfCourse } from "../services/operations/courseDetailsAPI";
import VideoDetailsSidebar from '../components/core/ViewCourse/VideoDetailsSidebar';
import CourseReviewModal from '../components/core/ViewCourse/CourseReviewModal';
import { HiMenuAlt2 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";

const ViewCourse = () => {
    const [reviewModal, setReviewModal] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const { courseId } = useParams();
    const { token } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        const setCourseSpecificDetails = async () => {
            const courseData = await getFullDetailsOfCourse(courseId, token);
            if (!courseData?.courseDetails) return;

            dispatch(setCourseSectionData(courseData.courseDetails.courseContent || []));
            dispatch(setEntireCourseData(courseData.courseDetails));
            dispatch(setCompletedLectures(courseData.completedVideos || []));

            let lectures = 0;
            courseData?.courseDetails?.courseContent?.forEach((sec) => {
                lectures += sec?.subSection?.length || 0;
            });

            dispatch(setTotalNoOfLectures(lectures));
        };
        setCourseSpecificDetails();
    }, [courseId, token, dispatch]);

    return (
        <div className="relative flex min-h-[calc(100vh-3.5rem)] bg-richblack-900 text-richblack-5 overflow-hidden">
            {/* Mobile / Compact Toggle Floating Pill */}
            <button
                type="button"
                onClick={() => setIsSidebarOpen((prev) => !prev)}
                aria-label="Toggle Lecture Sidebar"
                className="fixed bottom-6 left-6 z-40 flex md:hidden items-center gap-2 rounded-full bg-yellow-50 px-4 py-2.5 text-xs font-bold text-richblack-900 shadow-xl cursor-pointer hover:bg-yellow-100 transition-all"
            >
                {isSidebarOpen ? <IoClose className="text-base" /> : <HiMenuAlt2 className="text-base" />}
                <span>{isSidebarOpen ? "Hide Curriculum" : "View Curriculum"}</span>
            </button>

            {/* Sidebar with Desktop Collapse & Mobile Overlay */}
            <div
                className={`fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full md:hidden"
                }`}
            >
                <VideoDetailsSidebar setReviewModal={setReviewModal} />
            </div>

            {/* Backdrop for mobile screen when sidebar is open */}
            {isSidebarOpen && (
                <div 
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 z-20 bg-black/60 backdrop-blur-xs md:hidden"
                />
            )}

            {/* Main Video & Content Area */}
            <main className="flex-1 h-[calc(100vh-3.5rem)] overflow-y-auto">
                <div className="mx-auto w-full max-w-[1000px] p-4 md:p-6 lg:p-8">
                    {/* Desktop toggle pill for focus mode */}
                    <div className="hidden md:flex items-center justify-between mb-4">
                        <button
                            onClick={() => setIsSidebarOpen((prev) => !prev)}
                            className="flex items-center gap-2 text-xs font-medium text-richblack-300 hover:text-white bg-richblack-800/80 hover:bg-richblack-700/80 border border-richblack-700 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                            <HiMenuAlt2 className="text-sm" />
                            <span>{isSidebarOpen ? "Focus Mode (Hide Sidebar)" : "Show Curriculum"}</span>
                        </button>
                    </div>

                    <Outlet />
                </div>
            </main>

            {/* Review Modal */}
            {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
        </div>
    );
};

export default ViewCourse;
