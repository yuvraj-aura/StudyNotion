import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ACCOUNT_TYPE } from "../../../utils/constants";
import { addToCart } from "../../../redux/slices/cartSlice";
import { toast } from 'react-hot-toast';
import { RiShareForwardLine } from "react-icons/ri";
import { syncCartWithDB } from "../../../services/operations/cartAPI";

const CourseDetailsCard = ({ course, handleBuyNow }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);
    const {cart} = useSelector((state) => state.cart)

    const {
        name,
        thumbnail: ThumbnailImage,
        price: CurrentPrice,
    } = course;

    const handleAddToCart = () => {
        if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
            toast.error("You are an Instructor, you can't buy a course")
            return;
        }
        if (token) {
            dispatch(addToCart(course));
            toast.success("Course added to cart");
            const updatedCart = [...(cart || []), course];
            syncCartWithDB(updatedCart, token);
        }
        if (!token) {
            toast.info("Please login to enroll");
            navigate("/signin");
            return;
        }
    };

    const handleShare = () => {
        navigator.clipboard?.writeText(window.location.href);
        toast.success("Course link copied to clipboard!");
    };


    return (
        <div className="w-full lg:w-95 lg:absolute lg:right-10 lg:top-10 rounded-2xl border border-richblack-700 bg-richblack-800 p-6 shadow-2xl z-20">
            <img
                src={ThumbnailImage}
                alt={name}
                className="h-50 w-full rounded-xl object-cover border border-richblack-700"
            />
            <div className="pt-6 space-y-4">
                <p className="text-2xl font-bold text-richblack-5">
                    Rs. {CurrentPrice}
                </p>

                <div className="flex flex-col gap-y-3">
                    <button
                        type="button"
                        onClick={
                            user && course?.studentsEnrolled.includes(user?.id) ? 
                            (() => navigate("/dashboard/enrolled-courses")) : handleBuyNow
                        }
                        className="w-full rounded-lg bg-yellow-200 py-3 font-semibold text-richblack-900 hover:bg-yellow-100 transition-all cursor-pointer shadow-md hover:scale-[0.99]"
                    >
                        {
                            user && course?.studentsEnrolled.includes(user?._id) ? "Go to Course" : "Buy Now"
                        }
                    </button>

                    { // Add to cart
                        (!(course?.studentsEnrolled?.includes(user?._id) || course?.studentEnrolled?.includes(user?._id) || course?.instructor?._id === user?._id || course?.instructor === user?._id)) && (
                            <button
                                type="button"
                                onClick={handleAddToCart}
                                className="w-full rounded-lg bg-richblack-900 py-3 font-semibold text-richblack-50 border border-richblack-700 hover:bg-richblack-700 transition-all cursor-pointer"
                            >
                                Add to Cart
                            </button>
                        )
                    }

                </div>

                <p className="text-center text-xs text-richblack-400">
                    30-Day Money-Back Guarantee
                </p>

                <div className="border-t border-richblack-700 pt-4">
                    <p className="text-sm font-semibold text-richblack-5 mb-2">
                        This Course Includes :
                    </p>
                    <div className="flex items-center gap-2 text-xs text-caribbeangreen-200">
                        {
                            course?.instructions?.map((item, index) => {
                                <p className="flex gap-2" key={index}>
                                    {item}
                                </p>
                            })
                        }
                    </div>
                </div>

                        {/* share btn */}
                <button
                    type="button"
                    onClick={handleShare}
                    className="w-full flex items-center justify-center gap-2 text-yellow-50 text-sm font-medium hover:underline pt-2 cursor-pointer"
                >
                    <RiShareForwardLine className="text-base" />
                    <span>Share</span>
                </button>
            </div>
        </div>
    )
}

export default CourseDetailsCard