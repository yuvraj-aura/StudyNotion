import { FaStar } from "react-icons/fa"
import { RiDeletedBin6Line } from "react-icons/ri"
import ReactStars from "react-rating-stars-component"
import { useDispatch, useSelector } from "react-redux"
import { removeFromCart } from "../../../../redux/slices/cartSlice"

const RenderCartCourses = () => {
    const { cart } = useSelector((state) => state.cart)
    const dispatch = useDispatch();

    return (
        <div className="flex flex-1 flex-col">
            {cart.map((course, index) => {
                <div
                    key={course._id}
                    className={`flex  w-full flex-wrap items-start justify-between gap-6 ${index !== cart.length - 1 && "border-b border-b-richblack-400 pb-6"} ${index !== 0 && "mt-6"}`}
                >
                    <div className="flex flex-1 flex-col gap-4 xl:flex-row">
                        <img
                            src={course?.thumbnail}
                            alt={course?.name}
                            className="h-37 w-55 rounded-lg object-cover"
                        />
                        <div className="flex flex-col space-y-1">
                            <p className="text-lg font-medium text-richblack-5">
                                {course?.name}
                            </p>
                            <p className="text-sm text-richblack-300">
                                {course?.category?.name}
                            </p>
                            <div className="flex items-center gap-2">
                                <span className="text-yellow-200">4.5</span>
                                <ReactStars 
                                count={5}
                                value={course?.ratingAndReviews?.length}
                                size={20}
                                edit={false}
                                activeColor="#fed200"
                                emptyIcon={<FaStar />}
                                fullIcon = {<FaStar />}
                                />

                                <span className="text-richblack-400">
                                    {course?.ratingAndReviews?.length} Ratings
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-end space-y-2">
                        <button
                        onClick={() => dispatch(removeFromCart(course._id))}
                        className="flex items-center gap-x-1 rounded-md broder border-richblack-600 bg-richblack-700 py-3 px-3 text-pink-400"
                        >
                            <RiDeletedBin6Line />
                        </button>

                    </div>

                </div>
            })}

        </div>
    )
}

export default RenderCartCourses