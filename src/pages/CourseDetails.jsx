import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaGlobe, FaClock, FaChevronDown } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { fetchCourseDetails } from "../services/operations/courseDetailsAPI";
import getAvgRating from "../utils/avgRating";
import Error from "./Error";
import Spinner from "../components/Spinner";
import CourseDetailsCard from "../components/core/Course/CourseDetailsCard";
import RatingStars from "../components/common/RatingStars";
import { buyCourse } from "../services/operations/studentFeaturesAPI";

const CourseDetails = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.auth);
    const { user, loading: profileLoading } = useSelector((state) => state.profile);

    const [courseData, setCourseData] = useState(null);
    const [loading, setLoading] = useState(true);

    const [isActive, setIsActive] = useState([]);
    const handleActive = (id) => {
        setIsActive((activeSections) =>
            activeSections.includes(id)
                ? activeSections.filter((sectionId) => sectionId !== id)
                : [...activeSections, id]
        );
    };


    // Fetch dynamic course details from database
    useEffect(() => {
        const getCourseFullDetails = async () => {
            setLoading(true);
            try {
                const result = await fetchCourseDetails(courseId);
                console.log("Course details API response:", result);
                if (result) {
                    setCourseData(result);
                    setIsActive(
                        (result.data?.courseDetails?.courseContent || []).map(
                            (section, index) => section._id || index
                        )
                    );
                }
            } catch (err) {
                console.log("Could not fetch course details ->>", err);
            } finally {
                setLoading(false);
            }
        };

        if (courseId) {
            getCourseFullDetails();
        }
    }, [courseId]);

    // Calculate average rating
    const [avgReviewCount, setAvgReviewCount] = useState(0);
    useEffect(() => {
        const reviews = courseData?.data?.courseDetails?.ratingAndReviews || [];
        const count = getAvgRating(reviews);
        setAvgReviewCount(count);
    }, [courseData]);

    // Calculate total number of lectures
    const [totalNoOfLectures, setTotalNoOfLectures] = useState(0);
    useEffect(() => {
        let lectures = 0;
        const sections = courseData?.data?.courseDetails?.courseContent || [];
        sections.forEach((sec) => {
            lectures += sec?.subsections?.length || sec?.subSection?.length || 0;
        });
        setTotalNoOfLectures(lectures);
    }, [courseData]);

    const handleBuyNow = () => {
        if (!token) {
            toast("Please login to enroll");
            navigate("/signin");
            return;
        }
        buyCourse({
            courses: [courseId],
            token,
            userDetails: user,
            navigate,
            dispatch,
        });
    };

    if (loading || profileLoading) {
        return (
            <div className="min-h-[calc(100vh-3.5rem)] grid place-items-center bg-richblack-900">
                <Spinner />
            </div>
        );
    }

    if (!courseData || !courseData.success || !courseData.data?.courseDetails) {
        return <Error />;
    }

    const { courseDetails: course, totalDuration } = courseData.data;
    const {
        name,
        description,
        whatYouWillLearn,
        courseContent = [],
        ratingAndReviews = [],
        instructor,
        studentEnrolled = [],
        createdAt,
    } = course;

    const sectionIds = courseContent.map((section, index) => section._id || index);
    const allSectionsCollapsed = !sectionIds.some((id) => isActive.includes(id));
    const toggleAllSections = () => {
        setIsActive((activeSections) =>
            sectionIds.some((id) => activeSections.includes(id)) ? [] : sectionIds
        );
    };

    const instructorFullName = instructor
        ? `${instructor.firstName || ""} ${instructor.lastName || ""}`.trim()
        : "StudyNotion Instructor";

    return (
        <div className=" w-full mx-auto bg-richblack-900 text-richblack-5 font-inter">
            {/* Top Banner / Hero */}
            <div className="relative bg-richblack-800 py-16 border-b border-richblack-700">
                <div className="w-11/12 max-w-315 mx-auto flex flex-col lg:flex-row justify-between items-start gap-12">
                    {/* Left Details Column */}
                    <div className="w-11/12 lg:max-w-175 flex flex-col gap-y-4">
                        <h1 className="text-3xl sm:text-4xl font-bold text-richblack-5">
                            {name}
                        </h1>
                        <p className="text-base text-richblack-200 leading-relaxed">
                            {description}
                        </p>

                        {/* Ratings & Enrolled */}
                        <div className="flex flex-wrap items-center gap-x-3 text-sm">
                            <span className="text-yellow-50 font-bold">{avgReviewCount}</span>
                            <RatingStars rating={avgReviewCount} />
                            <span className="text-richblack-400">
                                ({ratingAndReviews.length} reviews)
                            </span>
                            <span className="text-richblack-400">
                                {studentEnrolled.length} students enrolled
                            </span>
                        </div>

                        <p className="text-sm text-richblack-300">
                            Created By <span className="font-semibold text-richblack-50">{instructorFullName}</span>
                        </p>

                        <div className="flex flex-wrap items-center gap-x-5 text-xs text-richblack-300 pt-1">
                            <div className="flex items-center gap-1.5">
                                <FaClock />
                                <span>Created at {new Date(createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <FaGlobe />
                                <span>English</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Floating Purchase Card */}
                    <div className="w-full lg:w-auto">
                        <CourseDetailsCard
                            course = {{
                                ...course,
                                studentsEnrolled: studentEnrolled,
                            }}
                            handleBuyNow={handleBuyNow}
                        />
                    </div>
                </div>
            </div>

            {/* Course Body Content */}
            <div className="w-11/12 max-w-[1260px] mx-auto py-16 flex flex-col gap-y-12">
                {/* What you'll learn card */}
                {whatYouWillLearn && (
                    <div className="max-w-[720px] rounded-2xl border border-richblack-700 bg-richblack-800 p-8 shadow-md">
                        <h2 className="text-2xl font-bold text-richblack-5 mb-4">What you'll learn</h2>
                        <p className="text-sm text-richblack-200 leading-relaxed whitespace-pre-line">
                            {whatYouWillLearn}
                        </p>
                    </div>
                )}

                {/* Course Content Accordion */}
                <div className="max-w-180 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-richblack-5">Course Content</h2>
                            <div className="flex justify-between w-180 text-xs text-richblack-400 mt-1">
                                <div className="flex gap-x-1 border-white">
                                    <p>
                                        {courseContent.length} section(s)
                                    </p>
                                    <p>
                                        {" • "}
                                    </p>
                                    <p>
                                        {totalNoOfLectures} lecture(s)
                                    </p>
                                    <p>
                                        {" • "}
                                    </p>
                                    <p>
                                        {totalDuration} Total Duration
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    className="flex gap-2 items-center text-yellow-50"
                                    onClick={toggleAllSections}
                                    disabled={courseContent.length === 0}
                                >
                                    {allSectionsCollapsed ? "Expand All Sections" : "Collapse All Sections"}
                                    <FaChevronDown
                                        aria-hidden="true"
                                        className={`text-xs transition-transform duration-300 ease-in-out motion-reduce:transition-none ${allSectionsCollapsed ? "rotate-180" : "rotate-0"}`}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>

                    {courseContent.length > 0 ? (
                        <div className="space-y-3 border border-richblack-700 rounded-xl overflow-hidden bg-richblack-800 p-4">
                            {courseContent.map((sec, idx) => {
                                const subSecs = sec.subsections || sec.subSection || [];
                                const sectionId = sec._id || idx;
                                const isExpanded = isActive.includes(sectionId);
                                const panelId = `course-${courseId}-section-${sectionId}`;
                                return (
                                    <div key={sectionId} className="rounded-lg border border-richblack-700 overflow-hidden">
                                        <button
                                            type="button"
                                            onClick={() => handleActive(sectionId)}
                                            aria-expanded={isExpanded}
                                            aria-controls={panelId}
                                            className="flex w-full items-center justify-between p-4 px-6 bg-richblack-700/60 font-medium text-left text-sm text-richblack-5"
                                        >
                                            <span className="flex items-center gap-x-2">
                                                <FaChevronDown
                                                    aria-hidden="true"
                                                    className={`text-xs text-yellow-50 transition-transform duration-300 ease-in-out motion-reduce:transition-none ${isExpanded ? "rotate-0" : "rotate-180"}`}
                                                />
                                                <span>{sec.sectionName}</span>
                                            </span>
                                            <span className="text-xs text-yellow-50">
                                                {subSecs.length} lecture(s)
                                            </span>
                                        </button>

                                        <div
                                            id={panelId}
                                            aria-hidden={!isExpanded}
                                            inert={!isExpanded}
                                            className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out motion-reduce:transition-none ${isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                                        >
                                            <div className="min-h-0 overflow-hidden">
                                                {subSecs.length > 0 && (
                                                    <div className="bg-richblack-900/60 divide-y divide-richblack-800 px-6 py-2">
                                                        {subSecs.map((sub, sIdx) => (
                                                            <div key={sub._id || sIdx} className="py-2.5 flex items-center justify-between text-xs text-richblack-100">
                                                                <span>▶ {sub.title}</span>
                                                                <span className="text-richblack-400">{sub.timeDuration || "10m"}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-sm text-richblack-400">No curriculum sections published yet.</p>
                    )}
                </div>
            </div>

        </div>
    );
};

export default CourseDetails;
