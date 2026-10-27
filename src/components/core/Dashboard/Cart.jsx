import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaStar } from "react-icons/fa";
import { removeFromCart, resetCart } from "../../../redux/slices/cartSlice";
import { syncCartWithDB } from "../../../services/operations/cartAPI";
import { toast } from "react-hot-toast";

export default function Cart() {
  const { cart, total, totalItems } = useSelector((state) => state.cart);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRemove = (courseId) => {
    dispatch(removeFromCart(courseId));
    const updatedCart = cart.filter((item) => item._id !== courseId);
    if (token) {
      syncCartWithDB(updatedCart, token);
    }
  };

  const handleCheckout = () => {
    toast.success("Order placed successfully!");
    dispatch(resetCart());
    if (token) {
      syncCartWithDB([], token);
    }
    navigate("/dashboard/enrolled-courses");
  };

  return (
    <div className="text-richblack-5 font-inter flex flex-col gap-y-6">
      <h1 className="text-3xl font-semibold text-richblack-5">Your Cart</h1>
      <p className="border-b border-b-richblack-700 pb-2 font-semibold text-richblack-400">
        {totalItems} Courses in Cart
      </p>

      {totalItems > 0 ? (
        <div className="mt-8 flex flex-col-reverse items-start gap-x-10 gap-y-6 lg:flex-row">
          {/* Cart Items List */}
          <div className="flex-1 w-full flex flex-col divide-y divide-richblack-700 border border-richblack-700 rounded-xl bg-richblack-800 overflow-hidden">
            {cart.map((course, indx) => (
              <div
                key={course._id || indx}
                className="flex w-full flex-wrap items-start justify-between gap-6 p-6"
              >
                <div className="flex flex-1 flex-col gap-4 xl:flex-row">
                  <img
                    src={course?.thumbnail}
                    alt={course?.courseName}
                    className="h-[148px] w-[220px] rounded-lg object-cover border border-richblack-700"
                  />
                  <div className="flex flex-col space-y-1">
                    <p className="text-lg font-semibold text-richblack-5">
                      {course?.courseName}
                    </p>
                    <p className="text-sm text-richblack-300">
                      {course?.category?.name || "Web Development"}
                    </p>
                    <div className="flex items-center gap-2 pt-1 text-xs">
                      <span className="text-yellow-50 font-bold">4.5</span>
                      <div className="flex text-yellow-50">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} />
                        ))}
                      </div>
                      <span className="text-richblack-400">
                        ({course?.ratingAndReviews?.length || 1} Ratings)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-2">
                  <button
                    onClick={() => handleRemove(course._id)}
                    className="flex items-center gap-x-1 rounded-md border border-richblack-700 bg-richblack-700 py-2 px-3 text-pink-200 hover:bg-richblack-600 transition-all cursor-pointer text-xs font-semibold"
                  >
                    <RiDeleteBin6Line className="text-sm" />
                    <span>Remove</span>
                  </button>
                  <p className="text-2xl font-bold text-yellow-50">
                    Rs. {course?.price}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Total Card */}
          <div className="min-w-[280px] rounded-xl border border-richblack-700 bg-richblack-800 p-6 shadow-xl flex flex-col gap-y-4">
            <p className="text-sm font-semibold text-richblack-200">Total:</p>
            <p className="text-3xl font-bold text-yellow-50">Rs. {total}</p>

            <button
              onClick={handleCheckout}
              className="w-full rounded-lg bg-yellow-50 py-3 font-semibold text-richblack-900 hover:bg-yellow-100 transition-all cursor-pointer shadow-md hover:scale-[0.99]"
            >
              Buy Now
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-14 text-center text-3xl text-richblack-100 flex flex-col items-center gap-4">
          <p>Your Cart is Empty</p>
          <Link to="/">
            <button className="rounded-lg bg-yellow-50 py-2.5 px-6 text-sm font-semibold text-richblack-900 hover:bg-yellow-100 transition-all cursor-pointer">
              Explore Courses
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
