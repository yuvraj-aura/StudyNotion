import { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { markLectureAsComplete } from '../../../services/operations/courseDetailsAPI';
import { updateCompletedLectures } from "../../../redux/slices/viewCourseSlice";
// import { DashVideo } from '@videojs/react/media/dash-video';

import { 
    MdReplay, 
    MdCheckCircle, 
    MdOutlineCheckCircleOutline 
} from "react-icons/md";
import { 
    IoPlaySkipForward, 
    IoPlaySkipBack, 
    IoInformationCircleOutline 
} from "react-icons/io5";
import IconBtn from '../../common/IconBtn';

const VideoDetails = () => {
    const { courseId, sectionId, subSectionId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const videoRef = useRef(null);
    const location = useLocation();

    const { token } = useSelector((state) => state.auth);
    const { courseSectionData = [], courseEntireData = {}, completedLectures = [] } = useSelector(
        (state) => state.viewCourse
    );

    const [videoData, setVideoData] = useState(null);
    const [videoEnded, setVideoEnded] = useState(false);
    const [loading, setLoading] = useState(false);

    // Sync current lecture data
    useEffect(() => {
        const setVideoSpecificDetails = () => {
            if (!courseSectionData?.length) return;

            if (!courseId && !sectionId && !subSectionId) {
                navigate("/dashboard/enrolled-courses");
                return;
            }

            const currentSection = courseSectionData.find((sec) => sec._id === sectionId);
            const currentSubSection = currentSection?.subsections?.find((sub) => sub._id === subSectionId);

            if (currentSubSection) {
                setVideoData(currentSubSection);
                setVideoEnded(false);
            }
        };

        setVideoSpecificDetails();
    }, [courseSectionData, courseEntireData, location.pathname, sectionId, subSectionId, courseId, navigate]);

    // Check if the current lecture is the very first one
    const isFirstVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex((data) => data._id === sectionId);
        if (currentSectionIndex === -1) return true;

        const currentSubSectionIndex = courseSectionData[currentSectionIndex]?.subsections?.findIndex(
            (data) => data._id === subSectionId
        );

        return currentSectionIndex === 0 && currentSubSectionIndex === 0;
    };

    // Check if the current lecture is the very last one
    const isLastVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex((data) => data._id === sectionId);
        if (currentSectionIndex === -1) return true;

        const totalSections = courseSectionData.length;
        const currentSubSectionLength = courseSectionData[currentSectionIndex]?.subsections?.length || 0;
        const currentSubSectionIndex = courseSectionData[currentSectionIndex]?.subsections?.findIndex(
            (data) => data._id === subSectionId
        );

        return (
            currentSectionIndex === totalSections - 1 &&
            currentSubSectionIndex === currentSubSectionLength - 1
        );
    };

    // Navigate to the next video
    const goToNextVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex((data) => data._id === sectionId);
        if (currentSectionIndex === -1) return;

        const currentSubSectionIndex = courseSectionData[currentSectionIndex]?.subsections?.findIndex(
            (data) => data._id === subSectionId
        );
        const currentSectionSubSections = courseSectionData[currentSectionIndex]?.subsections || [];

        // If there are more lectures in the same section
        if (currentSubSectionIndex < currentSectionSubSections.length - 1) {
            const nextSubSectionId = currentSectionSubSections[currentSubSectionIndex + 1]?._id;
            navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`);
        } else if (currentSectionIndex < courseSectionData.length - 1) {
            // Go to the first lecture of the next section
            const nextSection = courseSectionData[currentSectionIndex + 1];
            const nextSubSectionId = nextSection?.subsections?.[0]?._id;
            if (nextSection && nextSubSectionId) {
                navigate(`/view-course/${courseId}/section/${nextSection._id}/sub-section/${nextSubSectionId}`);
            }
        }
    };

    // Navigate to the previous video
    const goToPrevVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex((data) => data._id === sectionId);
        if (currentSectionIndex === -1) return;

        const currentSubSectionIndex = courseSectionData[currentSectionIndex]?.subsections?.findIndex(
            (data) => data._id === subSectionId
        );

        // Previous video in same section
        if (currentSubSectionIndex > 0) {
            const prevSubSectionId = courseSectionData[currentSectionIndex].subsections[currentSubSectionIndex - 1]?._id;
            navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`);
        } else if (currentSectionIndex > 0) {
            // Last video of the previous section
            const prevSection = courseSectionData[currentSectionIndex - 1];
            const prevSubSections = prevSection?.subsections || [];
            const prevSubSectionId = prevSubSections[prevSubSections.length - 1]?._id;
            if (prevSection && prevSubSectionId) {
                navigate(`/view-course/${courseId}/section/${prevSection._id}/sub-section/${prevSubSectionId}`);
            }
        }
    };

    const handleLectureCompletion = async () => {
        setLoading(true);
        const res = await markLectureAsComplete(
            { courseId, subSectionId },
            token
        );
        if (res) {
            dispatch(updateCompletedLectures(subSectionId));
        }
        setLoading(false);
    };

    const handleRepeat = () => {
        if (videoRef?.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play();
            setVideoEnded(false);
        }
    };

    const isCompleted = completedLectures?.includes(subSectionId);

    return (
        <div className="flex flex-col gap-5 text-white">
            {/* Player Container */}
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-richblack-900 border border-richblack-800 shadow-[0_12px_40px_rgba(0,0,0,0.6)]">
                {!videoData ? (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-richblack-300">
                        <IoInformationCircleOutline className="text-4xl text-richblack-400" />
                        <p className="text-sm font-medium">Select a lecture to start learning</p>
                    </div>
                ) : (
                    <>
                        <video
                            ref={videoRef}
                            src={videoData?.videoURL ?? videoData?.videoUrl}
                            playsInline
                            controls={!videoEnded}
                            onEnded={() => setVideoEnded(true)}
                            className="h-full w-full object-cover"
                        />

                        {/* Modern Post-Video Action Overlay */}
                        {videoEnded && (
                            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-richblack-900/85 backdrop-blur-md px-4 transition-all duration-300 animate-fadeIn">
                                <h3 className="text-lg md:text-xl font-bold text-richblack-5 mb-1">
                                    Lecture Finished!
                                </h3>
                                <p className="text-xs md:text-sm text-richblack-300 mb-6 text-center max-w-sm">
                                    {isCompleted 
                                        ? "Great job! Keep progressing through the course." 
                                        : "Mark this lecture as completed to track your journey."}
                                </p>

                                {/* Action Buttons */}
                                <div className="flex flex-wrap items-center justify-center gap-3">
                                    {/* Mark as Completed Button */}
                                    {!isCompleted && (
                                        <IconBtn
                                            disabled={loading}
                                            onClick={handleLectureCompletion}
                                            text={!loading ? "Mark as Done" : "Saving..."}
                                            customClasses="text-xs md:text-sm shadow-md"
                                        >
                                            <MdCheckCircle className="text-base" />
                                        </IconBtn>
                                    )}

                                    {/* Replay Button */}
                                    <button
                                        disabled={loading}
                                        onClick={handleRepeat}
                                        className="flex items-center gap-1.5 rounded-md bg-richblack-800 hover:bg-richblack-700 text-richblack-5 border border-richblack-700 py-2 px-4 text-xs md:text-sm font-semibold transition-all duration-200 cursor-pointer"
                                    >
                                        <MdReplay className="text-base text-yellow-50" />
                                        <span>Replay</span>
                                    </button>

                                    {/* Previous Button */}
                                    {!isFirstVideo() && (
                                        <button
                                            disabled={loading}
                                            onClick={goToPrevVideo}
                                            className="flex items-center gap-1.5 rounded-md bg-richblack-800 hover:bg-richblack-700 text-richblack-200 hover:text-white border border-richblack-700 py-2 px-4 text-xs md:text-sm font-semibold transition-all duration-200 cursor-pointer"
                                        >
                                            <IoPlaySkipBack className="text-xs" />
                                            <span>Previous</span>
                                        </button>
                                    )}

                                    {/* Next Button */}
                                    {!isLastVideo() && (
                                        <button
                                            disabled={loading}
                                            onClick={goToNextVideo}
                                            className="flex items-center gap-1.5 rounded-md bg-yellow-50 hover:bg-yellow-100 text-richblack-900 py-2 px-4 text-xs md:text-sm font-semibold transition-all duration-200 cursor-pointer shadow-md"
                                        >
                                            <span>Next</span>
                                            <IoPlaySkipForward className="text-xs" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Lecture Meta & Description */}
            {videoData && (
                <div className="flex flex-col gap-3 rounded-2xl border border-richblack-800 bg-richblack-800/40 p-5 backdrop-blur-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <span className="text-xs font-semibold text-yellow-50 uppercase tracking-wider">
                                Current Lecture
                            </span>
                            <h1 className="text-xl md:text-2xl font-bold text-richblack-5 mt-0.5">
                                {videoData?.title}
                            </h1>
                        </div>

                        {/* Completion pill */}
                        <div className="flex items-center gap-2">
                            {isCompleted ? (
                                <span className="flex items-center gap-1 rounded-full bg-caribbeangreen-300/10 border border-caribbeangreen-300/30 px-3 py-1 text-xs font-medium text-caribbeangreen-100">
                                    <MdCheckCircle className="text-sm" />
                                    Completed
                                </span>
                            ) : (
                                <button
                                    onClick={handleLectureCompletion}
                                    disabled={loading}
                                    className="flex items-center gap-1.5 rounded-full bg-richblack-700 hover:bg-richblack-600 border border-richblack-600 px-3 py-1 text-xs font-medium text-richblack-200 hover:text-white transition-all cursor-pointer"
                                >
                                    <MdOutlineCheckCircleOutline className="text-sm text-yellow-50" />
                                    <span>Mark as done</span>
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="h-[1px] w-full bg-richblack-700/60 my-1" />

                    <div>
                        <h4 className="text-xs font-semibold text-richblack-300 uppercase tracking-wider mb-1.5">
                            About this lesson
                        </h4>
                        <p className="text-sm text-richblack-200 leading-relaxed whitespace-pre-line">
                            {videoData?.description || "No description provided for this lesson."}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideoDetails;
