import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { VscAdd } from "react-icons/vsc";
import { useSelector } from "react-redux";
import Spinner from "../../Spinner";
import { fetchInstructorCourses, deleteCourse } from "../../../services/operations/courseDetailsAPI";
import ConfirmationModal from "../../common/ConfirmationModal";
import { FaRegTrashAlt } from "react-icons/fa";
import { RiEdit2Fill } from "react-icons/ri";

export default function MyCourse() {
    const { token } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const [Courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // 2. Attach a reference directly to the LordIcon DOM reference instance
    const iconRef = useRef(null);

    // 3. Play the animation cleanly via the web element API on hover
    const handleMouseEnter = () => {
        iconRef.current?.playerInstance?.playFromBeginning();
    };

    useEffect(() => {
        const fetchAllMyCourses = async () => {
            try {
                const courses = await fetchInstructorCourses(token);
                setCourses(courses || []);
            } catch (err) {
                console.log("Fetch instructor courses error ->> ", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAllMyCourses();
    }, [token]);

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await deleteCourse({ courseId: deleteTarget._id }, token);
            setCourses((prev) => prev.filter((c) => c._id !== deleteTarget._id));
            setDeleteTarget(null);
        } catch (err) {
            console.log("Delete course error ->> ", err);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="text-richblack-5 font-inter flex flex-col gap-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-semibold text-richblack-5">My Courses</h1>
                <Link to="/dashboard/add-course">
                    <button className="flex items-center gap-x-2 rounded-lg bg-yellow-50 py-2.5 px-5 font-semibold text-richblack-900 hover:bg-yellow-100 transition-all cursor-pointer shadow-md">
                        <VscAdd className="text-xl" />
                        <span>Add Course</span>
                    </button>
                </Link>
            </div>

            <div className="rounded-xl border border-richblack-700 bg-richblack-800 overflow-hidden shadow-xl mt-4">
                <div className="flex bg-richblack-700/80 p-4 px-6 text-sm font-semibold text-richblack-50">
                    <p className="w-[50%]">Courses</p>
                    <p className="w-[20%]">Status</p>
                    <p className="w-[15%]">Price</p>
                    <p className="w-[15%]">Students</p>
                </div>

                {loading ? (
                    <div className="py-16 flex justify-center">
                        <Spinner />
                    </div>
                ) : Courses.length === 0 ? (
                    <p className="py-16 text-center text-richblack-300">
                        You have not created any course yet. Click "Add Course" to get started.
                    </p>
                ) : (
                    Courses.map((course) => (
                        <div
                            key={course._id}
                            className="flex items-center border-b border-richblack-700/60 p-5 px-6 gap-x-4 hover:bg-richblack-750 transition-colors"
                        >
                            <div 
                                onClick={() => {
                                    const firstSection = course?.courseContent?.[0];
                                    const firstSubSection = firstSection?.subsections?.[0] || firstSection?.subSection?.[0];
                                    if (firstSection?._id && firstSubSection?._id) {
                                        navigate(`/view-course/${course._id}/section/${firstSection._id}/sub-section/${firstSubSection._id}`);
                                    } else {
                                        navigate(`/course/${course._id}`);
                                    }
                                }}
                                className="flex w-[50%] items-center gap-4 cursor-pointer group"
                            >
                                <img
                                    src={course.thumbnail}
                                    alt={course.name}
                                    className="h-14 w-14 rounded-lg object-cover border border-richblack-700 shrink-0 group-hover:scale-105 transition-transform"
                                />
                                <div className="flex flex-col">
                                    <p className="font-semibold text-sm sm:text-base text-richblack-5 group-hover:text-yellow-50 transition-colors">
                                        {course.name}
                                    </p>
                                    <span className="text-xs text-richblack-400 group-hover:underline">
                                        Click to watch lectures & content →
                                    </span>
                                </div>
                            </div>
                            <div className="w-[20%]">
                                <span
                                    className={`text-xs px-3 py-1 rounded-full font-medium ${course.status === "Published"
                                        ? "bg-caribbeangreen-800/40 text-caribbeangreen-200 border border-caribbeangreen-500/30"
                                        : "bg-pink-800/40 text-pink-200 border border-pink-500/30"
                                        }`}
                                >
                                    {course.status}
                                </span>
                            </div>
                            <div className="w-[15%] text-sm font-medium text-richblack-5">
                                ₹{course.price}
                            </div>
                            <div className="w-[15%] text-sm text-richblack-200">
                                {course.studentEnrolled?.length || 0}
                            </div>

                            {/* Action buttons */}
                            <div className="ml-auto flex items-center gap-2">
                                <button
                                    onClick={() =>
                                        navigate(`/dashboard/edit-course/${course._id}`)}
                                    className="rounded-md bg-richblack-700 hover:bg-richblack-600 px-3 py-1.5 text-xs font-medium text-richblack-5 transition-colors cursor-pointer"
                                >
                                    <RiEdit2Fill size={20}/>
                                </button>
                                <button
                                    disabled={deleting}
                                    onClick={() => setDeleteTarget(course)}
                                    onMouseEnter={handleMouseEnter}
                                    className="rounded-md bg-pink-800/40 hover:bg-red-500 px-3 py-1.5 text-xs font-medium text-pink-200 transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center p-2"
                                >
                                    <FaRegTrashAlt size={20}/>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {deleteTarget && (
                <ConfirmationModal
                    title="Delete Course"
                    message={`Are you sure you want to delete "${deleteTarget.name}"? This action cannot be undone.`}
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteTarget(null)}
                    confirmText="Delete"
                    cancelText="Cancel"
                />
            )}
        </div>
    );
}
