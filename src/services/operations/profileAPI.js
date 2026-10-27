import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { profileEndpoints } from "../APIs";

const { GET_USER_ENROLLED_COURSES_API } = profileEndpoints;

// Fetch all courses enrolled by the logged-in user
export const getEnrolledCourses = async (token) => {
    const toastId = toast.loading("Loading enrolled courses...");
    let result = [];
    try {
        const response = await apiConnector(
            "POST",
            GET_USER_ENROLLED_COURSES_API,
            null,
            {
                Authorization: `Bearer ${token}`,
            }
        );
        if (!response?.data?.success) {
            throw new Error(response?.data?.message || "Could not fetch enrolled courses");
        }
        result = response?.data?.data || [];
    } catch (err) {
        console.log("GET_ENROLLED_COURSES_API ERROR ->> ", err);
        toast.error(err.response?.data?.message || err.message || "Failed to fetch enrolled courses");
    } finally {
        toast.dismiss(toastId);
    }
    return result;
};
