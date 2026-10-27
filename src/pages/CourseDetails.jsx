import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaStar, FaGlobe, FaClock, FaChevronDown } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { fetchCourseDetails } from "../services/operations/courseDetailsAPI";
import getAvgRating from "../utils/avgRating";
import Error from "./Error";
import Spinner from "../components/Spinner";
import ConfirmationModal from "../components/common/ConfirmationModal";
import CourseDetailsCard from "../components/core/Course/CourseDetailsCard";
import RatingStars from "../components/common/RatingStars";
import { buyCourse } from "../services/operations/studentFeaturesAPI";

const CourseDetails = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.auth);
    const { user, loading: profileLoading } = useSelector((state) => state.profile);

    const [confirmationModal, setConfirmationModal] = useState(null);
    const [courseData, setCourseData] = useState(null);
    const [loading, setLoading] = useState(true);

    const [isActive, setIsActive] = useState([]);
    const handleActive = (id) => {
        setIsActive(
            !isActive.includes(id) 
              ?  isActive.concat(id)
             : isActive.filter((e) => e != id)
        )
    }


    // Fetch dynamic course details from database
    useEffect(() => {
        const getCourseFullDetails = async () => {
            setLoading(true);
            try {
                const result = await fetchCourseDetails(courseId);
                console.log("Course details API response:", result);
                if (result) {
                    setCourseData(result);
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
        const reviews = courseData?.data?.ratingAndReviews || [];
        const count = getAvgRating(reviews);
        setAvgReviewCount(count);
    }, [courseData]);

    // Calculate total number of lectures
    const [totalNoOfLectures, setTotalNoOfLectures] = useState(0);
    useEffect(() => {
        let lectures = 0;
        const sections = courseData?.data?.courseContent || [];
        sections.forEach((sec) => {
            lectures += sec?.subsections?.length || sec?.subSection?.length || 0;
        });
        setTotalNoOfLectures(lectures);
    }, [courseData]);

    const handleBuyNow = () => {
        if (!token) {
            toast.info("Please login to enroll");
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

    if (!courseData || !courseData.success || !courseData.data) {
        return <Error />;
    }

    const course = courseData.data;
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
                            <p className="flex justify-between w-180 text-xs text-richblack-400 mt-1">
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
                                        {course?.totalDuration} Total Duration
                                    </p>
                                </div>

                                <div className="flex gap-2 items-center">
                                    <button 
                                    className="text-yellow-400"
                                    onClick = {() => setIsActive([])}
                                    >
                                        Collapse All Sections
                                    </button>
                                    <FaChevronDown
                                    className="text-xs text-yellow-50" 
                                    // onClick={}
                                    />
                                </div>
                            </p>
                        </div>
                    </div>

                    {courseContent.length > 0 ? (
                        <div className="space-y-3 border border-richblack-700 rounded-xl overflow-hidden bg-richblack-800 p-4">
                            {courseContent.map((sec, idx) => {
                                const subSecs = sec.subsections || sec.subSection || [];
                                return (
                                    <div key={sec._id || idx} className="rounded-lg border border-richblack-700 overflow-hidden">
                                        <div className="flex items-center justify-between p-4 px-6 bg-richblack-700/60 font-medium text-sm text-richblack-5">
                                            <div className="flex items-center gap-x-2">
                                                <FaChevronDown className="text-xs text-yellow-50" />
                                                <span>{sec.sectionName}</span>
                                            </div>
                                            <span className="text-xs text-yellow-50">
                                                {subSecs.length} lecture(s)
                                            </span>
                                        </div>

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
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-sm text-richblack-400">No curriculum sections published yet.</p>
                    )}
                </div>
            </div>

            {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
        </div>
    );
};

export default CourseDetails;