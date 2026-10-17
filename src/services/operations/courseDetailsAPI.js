import toast from "react-hot-toast"
import { apiConnector } from "../apiConnector";

export const getAllCourses = async () => {
    const toastId = toast.loading("Loading...")
    let result = [];
    try {
        const response = await apiConnector("GET", GET_ALL_COURSE_API)
        if (!response?.data?.success) {
            throw new Error("Could not Fetch Course categories")
        }
        result = response?.data?.data;
    } catch (err) {
        console.log("Get all course API error ->> ", err)
        toast.error(err.message)
    }
    toast.dismiss(toastId)
    return result
}

export const fetchCourseDetails = async (courseId) => {
    const toastId = toast.loading("Loading...")

    // dispatch(setLoading(true))
    let result = null
    try {
        const resp = await apiConnector("GET", COURSE_DETAILS_API, {
            courseId,
        })
        console.log("COURSE_DETAILS_API Response ->> ", resp)

        if (!response.data.success) {
            throw new Error(response.data.message)
        }
    } catch (err) {
        console.log("Get course details API error ->> ", err)
        toast.error(err.message)
    }
}