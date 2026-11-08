import { createPortal } from 'react-dom';
import { IoClose } from "react-icons/io5";
import { AiFillStar } from "react-icons/ai";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useForm } from 'react-hook-form';
import IconBtn from "../../common/IconBtn";
import { createRating } from "../../../services/operations/courseDetailsAPI";


const CourseReviewModal = ({ setReviewModal }) => {
    const { user } = useSelector((state) => state.profile);
    const { token } = useSelector((state) => state.auth);
    const { courseId } = useParams();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({ defaultValues: { courseExperience: "", courseRating: "" } });
    const selectedRating = Number(watch("courseRating"));

    const onSubmit = async (data) => {
        const saved = await createRating(
            {
                courseId,
                rating: Number(data.courseRating),
                review: data.courseExperience.trim(),
            },
            token
        );
        if (saved) setReviewModal(false);
    }

    return createPortal(
        <div className='fixed inset-0 z-[1000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 transition-opacity duration-200'>
            <div role="dialog" aria-modal="true" aria-labelledby="course-review-title" className='bg-richblack-800 rounded-2xl border border-blue-200 shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-full max-w-120 max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative scale-100 transition-transform duration-200 text-richblack-5'>
                <h2 id="course-review-title" className="text-xl font-semibold mb-5">Review this course</h2>
                {/* close button */}
                <button
                    type="button"
                    aria-label="Close review"
                    disabled={isSubmitting}
                    className='absolute right-4 top-4 w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-richblack-900 hover:bg-blue-100 transition-colors duration-200'
                    onClick={() => setReviewModal(false)}
                >
                    <IoClose size={20} />
                </button>

                {/* header */}
                <div className='flex items-center gap-3 mb-6 text-center sm:text-start'>
                    <img
                        src={user?.image}
                        alt={`${user?.firstName || ""} ${user?.lastName || ""}`.trim()}
                        className='w-12.5 h-12.5 rounded-full object-cover border border-blue-100 bg-richblack-700'
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
                    <fieldset disabled={isSubmitting}>
                        <legend className="text-sm font-medium mb-2">Your rating</legend>
                        <div className="flex justify-center gap-2">
                            {[1, 2, 3, 4, 5].map((rating) => (
                                <label key={rating} className="cursor-pointer rounded p-1 hover:bg-richblack-700 transition-colors">
                                    <input
                                        type="radio"
                                        value={rating}
                                        aria-label={`${rating} ${rating === 1 ? "star" : "stars"}`}
                                        className="peer sr-only"
                                        {...register("courseRating", { required: "Please select a rating" })}
                                    />
                                    <AiFillStar aria-hidden="true" className={`text-3xl rounded peer-focus-visible:outline peer-focus-visible:outline-yellow-50 ${rating <= selectedRating ? "text-yellow-50" : "text-richblack-400"}`} />
                                </label>
                            ))}
                        </div>
                        {errors.courseRating && <p role="alert" className="text-xs text-pink-200 mt-2">{errors.courseRating.message}</p>}
                    </fieldset>

                    {/* textarea */}
                    <div className='w-full'>
                        <label htmlFor="courseExperience" className='block text-sm text-richblack-5 font-medium mb-2'>
                            Add Your Experience
                        </label>
                        <textarea
                            id="courseExperience"
                            placeholder='Add your Experience here'
                            {...register("courseExperience", {
                                validate: (value) => Boolean(value.trim()),
                            })}
                            className='w-full rounded-lg bg-richblack-700 p-3 text-richblack-5 placeholder-richblack-400 border-b border-blue-200 outline-none focus:border-yellow-50 focus:ring-1 focus:ring-yellow-50 transition-all duration-200 resize-none min-h-30'
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
                            disabled={isSubmitting}
                            className='flex-1 rounded-lg bg-transparent border border-blue-200 px-4 py-2.5 text-sm font-medium text-richblack-5 hover:bg-blue-200/50 transition-colors duration-200'
                            onClick={() => setReviewModal(false)}
                        >
                            Cancel
                        </button>

                        <IconBtn
                            text={isSubmitting ? 'Saving Review...' : 'Submit Review'}
                            disabled={isSubmitting || !courseId}
                            type='submit'
                            customClasses='bg-blue-200 text-richblack-900 hover:bg-blue-100 hover:shadow-[0_0_15px_rgba(71,165,197,0.4)] shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)]'
                        />
                    </div>
                </form>
            </div>
        </div>,
        document.body
    )
}

export default CourseReviewModal
