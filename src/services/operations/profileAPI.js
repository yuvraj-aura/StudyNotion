import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { profileEndpoints } from "../APIs";

const { 
    GET_USER_DETAILS_API, 
    GET_USER_ENROLLED_COURSES_API, 
    GET_INSTRUCTOR_API, 
} = profileEndpoints;

export const getUserDetails = async (token) => {
    const toastId = toast.loading("Loading...");
    let result = null;
    try {
        const response = await apiConnector(
            "GET",
            GET_USER_DETAILS_API,
            null,
            {
                Authorization: `Bearer ${token}`
            }
        );

        console.log("Calling GET_USER_DETAILS_API Response->> ", response);
        if (!response?.data?.success) {
            throw new Error(response?.data?.message || "Could not fetch user details");
        }

        result = response?.data?.data || null;
    } catch (err) {
        console.log("GET_USER_DETAILS_API ERROR ->> ", err);
        toast.error(err.response?.data?.message || err.message || "Failed to fetch user details");
        result = null;
    } finally {
        toast.dismiss(toastId);
    }
    return result;
};

// Fetch all courses enrolled by the logged-in user
export const getEnrolledCourses = async (token) => {
    const response = await apiConnector(
            "GET",
            GET_USER_ENROLLED_COURSES_API,
            null,
            {
                Authorization: `Bearer ${token}`,
            }
    );
    if (!response?.data?.success || !Array.isArray(response.data.data)) {
        throw new Error("Could not fetch enrolled courses");
    }
    return response.data.data;
};


// fetch instructor data
export async function getInstructorData(token) {
    const toastId = toast.loading("Loading...")
    let result = [];
    try {
        const response = await apiConnector(
            "GET", 
            GET_INSTRUCTOR_API,
            null,
            {
                Authorization: `Bearer ${token}`,
            },
        )

        console.log("GET_INSTRUCTOR_API Response ->> ", response)

        if (!response?.data?.success) {
            throw new Error(response?.data?.message || "Could not fetch Instructor Data");
        }

        result = response?.data?.courses;
        
    } catch (err) {
        console.log("GET_INSTRUCTOR_API Err ->> ", err)
        toast.error("Could not get Instructor Data");
    } finally {
        toast.dismiss(toastId)
    }
    return result;
}
