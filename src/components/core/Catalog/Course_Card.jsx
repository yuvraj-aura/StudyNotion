import { useState, useEffect } from "react";
import RatingStars from "../../common/RatingStars";
import getAvgRating from "../../../utils/avgRating";
import { Link } from 'react-router-dom'

const Course_Card = ({ course, Height }) => {

    const [avgReviewCount, setAvgReviewCount] = useState(0);

    useEffect(() => {
        const count = getAvgRating(course?.ratingAndReviews);
        setAvgReviewCount(count);
    }, [course])

    return (
        <Link to={`/course/${course._id}`} className="block">

            <div className="rounded-xl overflow-hidden border border-richblack-700 bg-richblack-800 transition-all duration-200 hover:border-richblack-500 hover:shadow-[0_0_15px_rgba(255,214,10,0.2)] group">

                <div className={`relative ${Height || "h-50"} w-full overflow-hidden`}>
                    <img
                        src={course?.thumbnail}
                        alt={course?.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                </div>
                <div className="p-4 flex flex-col gap-2">
                    <p className="text-sm font-medium text-yellow-50 line-clamp-1">
                        {course?.name}
                    </p>
                    <p className="text-xs text-richblack-400">
                        {course?.instructor?.firstName} {course?.instructor?.lastName}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-richblack-200">
                        <RatingStars rating={avgReviewCount} />
                        <span className="text-richblack-400">({course?.ratingAndReviews?.length || 0})</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-richblack-5">
                            ₹{course?.price || 0}
                        </span>
                        <span className="text-xs text-richblack-400">
                            {course?.studentEnrolled?.length || 0} students
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default Course_Card