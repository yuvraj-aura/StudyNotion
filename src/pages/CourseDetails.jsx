import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaStar, FaGlobe, FaClock, FaCheckCircle, FaChevronDown } from "react-icons/fa";
import { toast } from "react-toastify";
import { fetchCourseDetails } from "../services/operations/courseDetailsAPI";
// import {setCourse} from "../slices/courseSlice";
import getAvgRating from "../utils/avgRating";
import Error from "./Error";
import Spinner from "../components/Spinner";
import ConfirmationModal from "../components/common/ConfirmationModal"
import CourseDetailsCard from "../components/core/Course/CourseDetailsCard";
import RatingStars from "../components/common/RatingStars";

const CourseDetails = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);
    const { loading } = useSelector((state) => state.profile);
    const {paymentLoading} = useSelector((state) => state.course);
    const { cart } = useSelector((state) => state.cart);

    const [confirmationModal, setConfirmationModal] = useState(null);


    // settnig and finding the course page details
    const [courseData, setCourseData] = useState(null);
    useEffect(() => {
        const getCourseFullDetails = async () => {
            try {
                const result = await fetchCourseDetails(courseId);
                setCourseData(result)
            }
            catch (err) {
                console.log("Could not fetch course details ->>", err)
            }
        }

        getCourseFullDetails();
        console.log("Printing COURSE DATA ->> ", courseData);
    }, [courseId])


    // setting and calc avg rating
    const [avgReviewCount, setAvgReviewCount] = useState(0);
    useEffect(() => {
        const count = getAvgRating(courseData?.data?.courseDetails.ratingAndReviews)
        setAvgReviewCount(count);

    }, [courseData])


    // setting and calc total no of lectures
    const [totalNoOfLectures, setTotalNoOfLectures] = useState(0);
    useEffect(() => {
        let lectures = 0;
        courseData?.data?.courseDetails?.courseContent?.forEach((sec) => {
            lectures += sec.subSection.length || 0
        })
        setTotalNoOfLectures(lectures);

    }, [courseData])


    const handleBuyNow = () => {
        if (!token) {
            toast.info("Please login to enroll");
            navigate("/signin");
            return;
        }
        buyCourse(token, [courseId], user, navigate, dispatch);
        toast.success("Enrolled successfully in course!");
        navigate("/dashboard/enrolled-courses");

    };


    // loading spinner
    if (loading || !courseData) {
        return (
            <div>
                <Spinner />
            </div>
        )
    }

    if (!courseData.success) {
        return (
            <div>
                <Error />
            </div>
        )
    }

    const {
        _id: course_id,
        name,
        description,
        whatYouWillLearn,
        courseContent,
        ratingAndReviews,
        instructor,
        studentsEnrolled,
        createdAt,
    } = courseData.data?.courseDetails;

    return (
        <div className="w-full bg-richblack-900 text-richblack-5 font-inter">

            {/* Top Banner / Hero matching screenshot */}
            <div className="relative bg-richblack-800 py-16 border-b border-richblack-700">

                <div className="w-11/12 max-w-315 mx-auto flex flex-col lg:flex-row justify-between items-start gap-12">

                    {/* Left Details Column */}
                    <div className="w-full lg:max-w-180 flex flex-col gap-y-4">
                        <h1 className="text-3xl sm:text-4xl font-bold text-richblack-5">
                            {name}
                        </h1>
                        <p className="text-base text-richblack-200 leading-relaxed">
                            {description}
                        </p>

                        {/* Ratings & Enrolled */}
                        <div className="flex flex-wrap items-center gap-x-3 text-sm">
                            <span className="text-yellow-50 font-bold">{avgReviewCount}</span>
                            <RatingStars rating={avgReviewCount}/>
                            <span className="text-richblack-400">({ratingAndReviews.length} reviews)</span>
                            <span className="text-richblack-400">
                                {studentsEnrolled.length} students enrolled
                            </span>
                        </div>

                        <p className="text-sm text-richblack-300">
                            Created By <span className="font-semibold text-richblack-50">{instructor.firstName}</span>
                        </p>

                        <div className="flex flex-wrap items-center gap-x-5 text-xs text-richblack-300 pt-1">
                            <div className="flex items-center gap-1.5">
                                <FaClock />
                                <span>Created at {createdAt}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <FaGlobe />
                                <span>{" "} English</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        {/* Right Floating Purchase Card */}
                        <CourseDetailsCard 
                        courseData={courseData?.data?.courseDetails} 
                        handleBuyNow={handleBuyNow} 
                        />
                    </div>
                </div>
            </div>

            {/* Course Body Content */}
            <div className="w-11/12 max-w-315 mx-auto py-16 flex flex-col gap-y-12">
                {/* What you'll learn card */}
                <div className="max-w-[720px] rounded-2xl border border-richblack-700 bg-richblack-800 p-8 shadow-md">
                    <h2 className="text-2xl font-bold text-richblack-5 mb-4">What you'll learn</h2>
                    <p className="text-sm text-richblack-200 leading-relaxed">
                        {course.whatYouWillLearn}
                    </p>
                </div>

                {/* Course Content Accordion */}
                <div className="max-w-[720px] space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-richblack-5">Course Content</h2>
                            <p className="text-xs text-richblack-400 mt-1">
                                2 section(s) • 2 lecture(s) • 15s total length
                            </p>
                        </div>
                        <button className="text-xs font-semibold text-yellow-50 hover:underline">
                            Collapse all sections
                        </button>
                    </div>

                    <div className="space-y-2 border border-richblack-700 rounded-xl overflow-hidden bg-richblack-800">
                        {course.courseContent.map((sec) => (
                            <div key={sec.id} className="border-b border-richblack-700 last:border-b-0">
                                <div className="flex items-center justify-between p-4 px-6 bg-richblack-700/60 font-medium text-sm text-richblack-5">
                                    <div className="flex items-center gap-x-2">
                                        <FaChevronDown className="text-xs" />
                                        <span>{sec.sectionName}</span>
                                    </div>
                                    <span className="text-xs text-yellow-50">1 lecture(s)</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>


            </div>

            {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
        </div>
    );
}

export default CourseDetails