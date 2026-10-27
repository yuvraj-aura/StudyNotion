import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { courseEndpoints, categories } from "../APIs";

const {
    GET_ALL_COURSE_API,
    COURSE_DETAILS_API,
    COURSE_CATEGORIES_API,
    CREATE_COURSE_API,
    CREATE_SECTION_API,
    CREATE_SUBSECTION_API,
    UPDATE_SECTION_API,
    UPDATE_SUBSECTION_API,
    DELETE_SECTION_API,
    DELETE_SUBSECTION_API,
    GET_ALL_INSTRUCTOR_COURSES_API,
    DELETE_COURSE_API,
    GET_FULL_COURSE_DETAILS_AUTHENTICATED,
    CREATING_RATING_API,
    LECTURE_COMPLETION_API,
} = courseEndpoints;

// Fetch all courses
export const getAllCourses = async () => {
    const toastId = toast.loading("Loading...")
    let result = [];
    try {
        const response = await apiConnector("GET", GET_ALL_COURSE_API);
        if (!response?.data?.success) {
            throw new Error("Could not fetch courses");
        }
        result = response?.data?.data || [];
    } catch (err) {
        console.log("Get all course API error ->> ", err);
        toast.error(err.message)
    }
    toast.dismiss(toastId)
    return result;
};

// Fetch full details of a course by courseId
export const fetchCourseDetails = async (courseId) => {
    const toastId = toast.loading("Loading...")
    let result = null;
    try {
        const response = await apiConnector("POST", COURSE_DETAILS_API, {
            courseId,
        });
        console.log("COURSE_DETAILS_API Response ->> ", response);

        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        result = response.data;
    } catch (err) {
        console.log("Get course details API error ->> ", err);
        result = err.response.data
    }
    toast.dismiss(toastId);
    return result;
};

// Fetch all course categories
export const fetchCourseCategories = async () => {
    const toastId = toast.loading("Loading...")
    let result = [];
    try {
        const response = await apiConnector("GET", COURSE_CATEGORIES_API);
        console.log("COURSE_CATEGORIES_API Response ->> ", response)
        if (!response?.data?.success) {
            throw new Error("Could not fetch Course Categories")
        }
        result = response?.data?.data || [];
    } catch (error) {
        console.log("COURSE_CATEGORIES_API Error ->> ", error)
        toast.error(error.message);
    }
    toast.dismiss(toastId);
    return result;
};

// Add new course
export const addCourseDetails = async (data, token) => {
    let result = null;
    const toastId = toast.loading("Loading...");
    try {
        const response = await apiConnector("POST", CREATE_COURSE_API, data, {
            'Content-Type': "multipart/form-data",
            Authorization: `Bearer ${token}`,
        });
        console.log("CREATE COURSE API RESPONSE:", response);
        if (!response?.data?.success) {
            throw new Error(response?.data?.message || "Could not add course details");
        }
        toast.success("Course Created Successfully!");
        result = response?.data?.data;
    } catch (error) {
        console.log("CREATE COURSE API ERROR:", error);
        toast.error(error.response?.data?.message || error.message || "Failed to create course");
    } finally {
        toast.dismiss(toastId);
    }
    return result;
};


// edit the course details
export const editCourseDetails = async (data, token) => {
    const toastId = toast.loading("Loading...")
    let result = null;
    try {
        const response = await apiConnector(
            "POST",
            EDIT_COURSE_API,
            data,
            {
                'Content-Type': "multipart/form-data",
                Authorization: `Bearer ${token}`,
            });

        console.log("EDIT COURSE API Response ->> ", response)
        if (!response?.data?.success) {
            throw new Error(response?.data?.message || "Could not update course details");
        }
        toast.success("Course Created Successfully!");
        result = response?.data?.data;
    } catch (error) {
        console.log("EDIT COURSE API ERROR:", error);
        toast.error(error.response?.data?.message || error.message || "Failed to Update course");
    }
    toast.dismiss(toastId)
    return result
}

// Add new section to a course
export const createSection = async (data, token) => {
    let result = null;
    const toastId = toast.loading("Adding section...");
    try {
        const response = await apiConnector("POST", CREATE_SECTION_API, data, {
            Authorization: `Bearer ${token}`,
        });
        console.log("CREATE_SECTION_API Response ->> ", response)
        if (!response?.data?.success) {
            throw new Error(response?.data?.message || "Could not create section");
        }
        toast.success("Course Section Created");
        result = response?.data?.data;
    } catch (error) {
        console.log("CREATE SECTION API ERROR:", error);
        toast.error(error.response?.data?.message || error.message || "Failed to create section");
    } finally {
        toast.dismiss(toastId);
    }
    return result;
};

// Add new subsection to a section
export const createSubSection = async (data, token) => {
    let result = null;
    const toastId = toast.loading("Adding lecture...");
    try {
        const response = await apiConnector("POST", CREATE_SUBSECTION_API, data, {
            Authorization: `Bearer ${token}`,
        });
        console.log("CREATE_SUB_SECTION_API Response ->> ", response)
        if (!response?.data?.success) {
            throw new Error(response?.data?.message || "Could not create lecture");
        }
        toast.success("Lecture Added Successfully");
        result = response?.data?.data;
    } catch (error) {
        console.log("CREATE SUBSECTION API ERROR:", error);
        toast.error(error.response?.data?.message || error.message || "Failed to create lecture");
    } finally {
        toast.dismiss(toastId);
    }
    return result;
};

// updating the section
export const updateSection = async (data, token) => {
    let result = null;
    const toastId = toast.loading("Loading...");
    try {
        const response = await apiConnector("POST", UPDATE_SECTION_API, data, {
            Authorization: `Bearer ${token}`,
        });
        console.log("UPDATE_SECTION_API Response ->> ", response)
        if (!response?.data?.success) {
            throw new Error(response?.data?.message || "Could not update Section");
        }
        toast.success("Course Section Updated");
        result = response?.data?.data;
    } catch (error) {
        console.log("UPDATE SECTION API ERROR:", error);
        toast.error(error.response?.data?.message || error.message || "Failed to update Section");
    } finally {
        toast.dismiss(toastId);
    }
    return result;
}

// updating a sub section
export const updateSubSection = async (data, token) => {
    let result = null;
    const toastId = toast.loading("Loading...");
    try {
        const response = await apiConnector("POST", UPDATE_SUBSECTION_API, data, {
            Authorization: `Bearer ${token}`,
        });
        console.log("UPDATE_SUB_SECTION_API Response ->> ", response)
        if (!response?.data?.success) {
            throw new Error(response?.data?.message || "Could not update Lecture");
        }
        toast.success("Lecture Updated");
        result = response?.data?.data;
    } catch (error) {
        console.log("UPDATE SUB SECTION API ERROR:", error);
        toast.error(error.response?.data?.message || error.message || "Failed to update Lecture");
    } finally {
        toast.dismiss(toastId);
    }
    return result;
}

// delete a section
export const deleteSection = async (data, token) => {
    let result = null;
    const toastId = toast.loading("Loading...");
    try {
        const response = await apiConnector("POST", DELETE_SECTION_API, data, {
            Authorization: `Bearer ${token}`,
        });
        console.log("DELETE_SECTION_API Response ->> ", response)
        if (!response?.data?.success) {
            throw new Error(response?.data?.message || "Could not delete Section");
        }
        toast.success("Course Section deleted");
        result = response?.data?.data;
    } catch (error) {
        console.log("DELETE SECTION API ERROR:", error);
        toast.error(error.response?.data?.message || error.message || "Failed to delete Section");
    } finally {
        toast.dismiss(toastId);
    }
    return result;
}

// delete a sub section
export const deleteSubSection = async (data, token) => {
    let result = null;
    const toastId = toast.loading("Loading...");
    try {
        const response = await apiConnector("POST", DELETE_SUBSECTION_API, data, {
            Authorization: `Bearer ${token}`,
        });
        console.log("DELETE_SUBSECTION_API Response ->> ", response)
        if (!response?.data?.success) {
            throw new Error(response?.data?.message || "Could not delete lecture");
        }
        toast.success("Lecture deleted");
        result = response?.data?.data;
    } catch (error) {
        console.log("DELETE SUB-SECTION API ERROR:", error);
        toast.error(error.response?.data?.message || error.message || "Failed to delete Section");
    } finally {
        toast.dismiss(toastId);
    }
    return result;
}

// fetch all courses under a specific instructor
export const fetchInstructorCourses = async (token) => {
    let result = null;
    const toastId = toast.loading("Loading...");
    try {
        const response = await apiConnector(
            "GET",
            GET_ALL_INSTRUCTOR_COURSES_API,
            null,
            {
                Authorization: `Bearer ${token}`,
            });
        console.log("INSTRUCTOR_COURSES_API Response ->> ", response)
        if (!response?.data?.success) {
            throw new Error(response?.data?.message || "Could not fetch Instructor Courses");
        }
        toast.success("Fetched Instructor Courses");
        result = response?.data?.data;
    } catch (error) {
        console.log("INSTRUCTOR COURSES API ERROR:", error);
        toast.error(error.response?.data?.message || error.message || "Failed to fetch Instructor's Courses");
    } finally {
        toast.dismiss(toastId);
    }
    return result;
}

// delete course
export const deleteCourse = async (data, token) => {
    let result = null;
    const toastId = toast.loading("Loading...");
    try {
        const response = await apiConnector(
            "DELETE", 
            DELETE_COURSE_API, 
            data, 
            {
                Authorization: `Bearer ${token}`,
            }
        );
        console.log("DELETE_COURSE_API Response ->> ", response)
        if (!response?.data?.success) {
            throw new Error(response?.data?.message || "Could not delete Course");
        }
        toast.success("Course deleted");
        result = response?.data?.data;
    } catch (error) {
        console.log("DELETE COURSE API ERROR:", error);
        toast.error(error.response?.data?.message || error.message || "Failed to delete Course");
    } finally {
        toast.dismiss(toastId);
    }
    return result;
}

export const getFullDetailsOfCourse = async (courseId, token) => {
    const toastId = toast.loading("Loading...")
    let result = null;
    try {
        const response = await apiConnector(
            "POST",
            GET_FULL_COURSE_DETAILS_AUTHENTICATED,
            {
                courseId,
            }, 
            {
                Authorization: `Bearer ${token}`,
            },
        )
        console.log("COURSE FULL DETAILS API response ->> ", response)

        if (!response.data.success) {
            throw new Error(response.data.message)
        }

        result = response?.data?.data;
    } catch (error) {
        console.log("COURSE FULL DETAILS API error ->> ", error)
        result = error.response.data
        toast.error(error.response.data.message)
    }
    toast.dismiss(toastId)
    return result
};

// on line 340
export const markLectureAsComplete = async (data, token) => {
    let result = null;
    console.log("marking Lecture complete data ->> ", data);

    const toastId = toast.loading("Loading...");

    try {
        const response = await apiConnector("POST", LECTURE_COMPLETION_API, data, {
            Authorization: `Bearer ${token}`,
        })
        console.log("MARK_LECTURE_AS_COMPLETE_API response ->> ", response);

        if (!response.data.message) {
            throw new Error(response.data.error);
        }
        toast.success("Lecture Completed");
        result = true;
    } catch (err) {
        console.log("MARK_LECTURE_AS_COMPLETE_API Error ->> ", err)
        toast.error(err.message)
        result = false
    }
    toast.dismiss(toastId);
    return result;
}

// Create rating and review for course
export const createRating = async (data, token) => {
    const toastId = toast.loading("Loading...");
    let success = false;
    try {
        const response = await apiConnector("POST", CREATING_RATING_API, data, {
            Authorization: `Bearer ${token}`,
        });
        console.log("CREATE_RATING_API RESPONSE ->> ", response);
        if (!response?.data?.success) {
            throw new Error(response?.data?.message || "Could not create rating");
        }
        toast.success("Rating and review created successfully");
        success = true;
    } catch (error) {
        console.log("CREATE_RATING_API ERROR ->> ", error);
        toast.error(error.response?.data?.message || error.message || "Failed to create rating");
    }
    toast.dismiss(toastId);
    return success;
};
