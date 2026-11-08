import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Spinner from "../../Spinner";
import { getEnrolledCourses } from "../../../services/operations/profileAPI";

export default function EnrolledCourses() {
    const { token } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const { key } = useLocation();

    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadFailed, setLoadFailed] = useState(false);
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        let active = true;
        setLoading(true);
        setLoadFailed(false);
        getEnrolledCourses(token)
            .then((courses) => {
                if (active) setEnrolledCourses(courses);
            })
            .catch(() => {
                if (active) setLoadFailed(true);
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => { active = false; };
    }, [token, key, retryCount]);

    return (
        <div className="text-white font-inter flex flex-col gap-y-6">
            <h1 className="text-3xl font-semibold text-richblack-5">Enrolled Courses</h1>

            {loading ? (
                <div className="grid min-h-[calc(100vh-12rem)] place-items-center">
                    <Spinner />
                </div>
            ) : loadFailed ? (
                <div role="alert">
                    <p>Could not load your enrolled courses.</p>
                    <button type="button" className="text-yellow-50 underline" onClick={() => setRetryCount((count) => count + 1)}>
                        Try again
                    </button>
                </div>
            ) : !enrolledCourses.length ? (
                <p className="grid h-[10vh] w-full place-content-center text-richblack-300">
                    You have not enrolled in any course yet.
                    {/* TODO: Modify this empty state */}
                </p>
            ) : (
                <div className="my-6 rounded-t-xl border border-richblack-700 bg-richblack-800 overflow-hidden shadow-xl">
                    <div className="flex rounded-t-xl bg-richblack-700/80 p-4 px-6 text-sm font-semibold text-richblack-50">
                        <p className="w-[45%]">Course Name</p>
                        <p className="w-1/4">Duration</p>
                        <p className="flex-1">Progress</p>
                    </div>

                    {enrolledCourses.map((course, i, arr) => (
                        <div
                            key={course._id || i}
                            className={`flex items-center border-b border-richblack-700/60 p-5 px-6 gap-x-4 hover:bg-richblack-750 transition-colors duration-150 ${i === arr.length - 1 ? "border-b-0" : ""
                                }`}
                        >
                            <div
                                className="flex w-[45%] cursor-pointer items-center gap-4"
                                onClick={() => {
                                    const section = course.courseContent?.find((item) => item.subsections?.length);
                                    if (!section) {
                                        navigate("/view-course/" + course._id);
                                        return;
                                    }
                                    navigate("/view-course/" + course._id + "/section/" + section._id +
                                        "/sub-section/" + section.subsections[0]._id);
                                }}
                            >
                                <img
                                    src={course.thumbnail}
                                    alt={course.name}
                                    className="h-14 w-14 rounded-lg object-cover border border-richblack-700 shrink-0"
                                />
                                <div className="flex max-w-xs flex-col gap-1">
                                    <p className="font-semibold text-richblack-5 text-sm sm:text-base hover:text-yellow-50 transition-colors">
                                        {course.name}
                                    </p>
                                    <p className="text-xs text-richblack-300 line-clamp-1">
                                        {
                                            course.description?.length > 50
                                            ? `${course.description.slice(0, 50)}...`
                                            : course.description
                                        }
                                    </p>
                                </div>
                            </div>

                            <div className="w-1/4 text-sm text-richblack-200 font-medium">
                                {course?.totalDuration}
                            </div>

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
