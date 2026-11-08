import IconBtn from "../../../common/IconBtn"
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { buyCourse } from "../../../../services/operations/studentFeaturesAPI";

const RenderTotalAmount = () => {
    const {total, cart} = useSelector((state) => state.cart);
    const {token} = useSelector((state) => state.auth);
    const {user} = useSelector((state) => state.profile);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleBuyMultipleCourse = () => {
        const courses = cart.map((course) => course._id)
        buyCourse({ courses, token, userDetails: user, navigate, dispatch })
    }
  return (
    <div className='min-w-70 rounded-md border border-richblack-700 bg-richblack-800 p-6'>
        <p className='mb-1 text-sm font-medium text-richblack-300'>Total: </p>
        <p className='mb-6 text-3xl font-medium text-yellow-100'>₹ {total}</p>

        <IconBtn
        text="Buy Now"
        onClick = {handleBuyMultipleCourse}
        customClasses = "w-full justify-center"
        />
    </div>
  )
}

export default RenderTotalAmount