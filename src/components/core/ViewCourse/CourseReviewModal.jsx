import React, { useEffect } from 'react'
import { IoClose } from "react-icons/io5";
import { useSelector } from "react-redux";
import { useForm } from 'react-hook-form';
import ReactStars from 'react-rating-stars-component';
import IconBtn from "../../common/IconBtn";
import { createRating } from "../../../services/operations/courseDetailsAPI";


const CourseReviewModal = ({ setReviewModal }) => {
    const { user } = useSelector((state) => state.profile);
    const { token } = useSelector((state) => state.auth);
    const { courseEntireData } = useSelector((state) => state.viewCourse);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        setValue("courseExperience", "");
        setValue("courseRating", 0)
    }, [])

    const ratingChange = (newRating) => {
        setValue("courseRating", newRating);
    }

    const onSubmit = async (data) => {
        await createRating(
            {
                courseId: courseEntireData._id,
                rating: data.courseRating,
                review: data.courseExperience,
            },
            token
        );
        setReviewModal(false);
    }

    return (
        <div className='fixed inset-0 z-[100] bg-blue-200/95 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 transition-opacity duration-200'>
            <div className='bg-richblack-800 rounded-2xl border border-blue-200 shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-full max-w-[480px] p-6 sm:p-8 relative scale-100 transition-transform duration-200 text-richblack-5'>
                {/* close button */}
                <button
                    className='absolute right-4 top-4 w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-richblack-900 hover:bg-blue-100 transition-colors duration-200'
                    onClick={setReviewModal(false)}
                >
                    <IoClose size={20} />
                </button>

                {/* header */}
                <div className='flex items-center gap-3 mb-6 text-center sm:text-start'>
                    <img
                        src={user?.image}
                        alt={user?.name}
                        className='w-[50px] h-[50px] rounded-full object-cover border border-blue-100 bg-richblack-700'
                    />

                    <div className='flex flex-col'>
                        <p className='font-medium text-richblack-5'>{user?.firstName} {user?.lastName}</p>
                        <p className='text-xs text-richblack-300'>Posting Publicly</p>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className='flex flex-col gap-4'
                >
                    {/* stars */}
                    <div className='flex justify-center mb-2'>
                        <ReactStars
                            count={5}
                            onChange={ratingChange}
                            size={24}
                            activeColor="#FFD60A"
                            emptyColor="rgb(75 85 99)"
                            half={true}
                        />
                    </div>

                    {/* textarea */}
                    <div className='w-full'>
                        <label htmlFor="courseExperience" className='block text-sm text-richblack-5 font-medium mb-2'>
                            Add Your Experience
                        </label>
                        <textarea
                            id="courseExperience"
                            placeholder='Add your Experience here'
                            {...register("courseExperience", {
                                required: true,
                            })}
                            className='w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 placeholder-richblack-400 border-b border-blue-200 outline-none focus:border-yellow-50 focus:ring-1 focus:ring-yellow-50 transition-all duration-200 resize-none min-h-[120px]'
                        ></textarea>
                        {
                            errors.courseExperience && (
                                <span className='mt-1 text-xs text-caribbeangreen-200'>
                                    Please add your experience
                                </span>
                            )
                        }
                    </div>

                    {/* submit / cancel buttons */}
                    <div className='flex items-center gap-3 pt-2'>
                        <button
                            type='button'
                            className='flex-1 rounded-lg bg-transparent border border-blue-200 px-4 py-2.5 text-sm font-medium text-richblack-5 hover:bg-blue-200/50 transition-colors duration-200'
                            onClick={() => setReviewModal(false)}
                        >
                            Cancel
                        </button>

                        <IconBtn
                            text='Submit Review'
                            type='submit'
                            customClasses='bg-blue-200 text-richblack-900 hover:bg-blue-100 hover:shadow-[0_0_15px_rgba(71,165,197,0.4)] shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)]'
                        />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CourseReviewModal
