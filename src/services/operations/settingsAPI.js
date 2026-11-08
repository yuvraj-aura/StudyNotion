import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { settingsEndpoints } from "../APIs";
import { setUser } from "../../redux/slices/profileSlice";
// import { response } from "express";

const {
    UPDATE_PROFILE_PICTURE_API,
    UPDATE_PROFILE_API,
    CHANGE_PASSWORD_API,
    DELETE_PROFILE_API,
} = settingsEndpoints;

/**
 * Upload a new profile photo to Cloudinary via the backend.
 * Dispatches setUser to update Redux + localStorage on success.
 *
 * @param {string} token  - JWT auth token
 * @param {FormData} formData - must contain field "profilePhoto" (File)
 */
export function updateProfilePicture(token, formData) {
    return async (dispatch) => {
        const toastId = toast.loading("Uploading profile photo...");
        try {
            const response = await apiConnector(
                "PUT",
                UPDATE_PROFILE_PICTURE_API,
                formData,
                {
                    Authorization: `Bearer ${token}`,
                },
                undefined,
                { timeout: 90000 }
            );

            console.log("UPDATE_PROFILE_PICTURE_API Response ->> ", response)

            if (!response?.data?.success) {
                throw new Error(response?.data?.message || "Upload failed");
            }

            const updatedUser = response.data.data;
            dispatch(setUser(updatedUser));
            localStorage.setItem("user", JSON.stringify(updatedUser));

            toast.success("Profile photo updated successfully!", { id: toastId });

            return updatedUser;
        } catch (error) {
            console.error("updateProfilePicture error:", error);
            toast.error(error.code === "ECONNABORTED"
                ? "Upload timed out. Refresh your profile to check whether it saved, then retry if needed."
                : error?.response?.data?.message || error?.message || "Failed to upload photo",
                { id: toastId });
            return null;
        }
    };
}

/**
 * Remove the current profile photo.
 * Resets the user's image to a dicebear initials avatar and syncs Redux + localStorage.
 * No separate backend call needed — the avatar URL is stored as the image field.
 *
 * @param {string} token     - JWT auth token (unused currently, kept for future API call)
 * @param {string} firstName - user's first name
 * @param {string} lastName  - user's last name
 */


export function removeProfilePicture(token, firstName, lastName) {
    return async (dispatch) => {
        const toastId = toast.loading("Removing profile photo...");
        try {
            const seed = encodeURIComponent(`${firstName} ${lastName}`);
            const avatarUrl = `https://api.dicebear.com/5.x/initials/svg?seed=${seed}`;

            // Read current user from localStorage and update the image field
            const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
            const updatedUser = { ...currentUser, image: avatarUrl };

            dispatch(setUser(updatedUser));
            localStorage.setItem("user", JSON.stringify(updatedUser));

            toast.success("Profile photo removed.", { id: toastId });

            return updatedUser;
        } catch (error) {
            console.error("removeProfilePicture error:", error);
            toast.error("Failed to remove profile photo.", { id: toastId });
            return null;
        }
    };
}


export function updateProfile(token, formData) {
    return async (dispatch) => {
        const toastId = toast.loading("Updating Profile...");
        try {
            const response = await apiConnector(
                "PUT",
                UPDATE_PROFILE_API,
                formData,
                {
                    Authorization: `Bearer ${token}`,
                }
            )

            console.log("UPDATE_PROFILE_API Response ->> ", response)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }

            const userImage = response.data.updatedUserDetails.image ? response.data.updatedUserDetails.image
                : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.updatedUserDetails.firstName} ${response.data.updatedUserDetails.lastName}`

            dispatch(
                setUser({ ...response.data.updatedUserDetails, image: userImage })
            )

            toast.success("Profile Updated successfully")
        } catch (err) {
            console.error("UPDATE_PROFILE_API error:", err);
            toast.update(toastId, {
                render: "Failed to remove profile photo.",
                type: "error",
                isLoading: false,
                autoClose: 4000,
            });
            return null;
        } finally {
            toast.dismiss(toastId);
        }
    }
}

export async function changePassword(token, formData) {
    const toastId = toast.loading("Loading...")
    try {
        const response = await apiConnector(
            "POST",
            CHANGE_PASSWORD_API,
            formData,
            {
                Authorization: `Bearer ${token}`
            },
        )
        console.log("CHANGE_PASSWORD_API Reponse ->> ", response)

        if (!response.data.success) {
            throw new Error(response.data.message)
        }

        toast.success("Password Changed Successfully")
    } catch (err) {
        console.error("CHANGE_PASSWORD_API error:", err);
        toast.error(err.response.data.message);
    } finally {
        toast.dismiss(toastId);
    }
    return response
}

export function deleteProfile(token, navigate) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        try {
            const response = await apiConnector(
                "DELETE",
                DELETE_PROFILE_API,
                null,
                {
                    Authorization: `Bearer ${token}`
                }

            )
            console.log("DELETE_PROFILE_API Response ->> ", response)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }

            toast.success("Profile Deleted Successfully")
            dispatch(logout(navigate))
        } catch (err) {
            console.error("DELETE_PROFILE_API Error ->> ", err)
            toast.error(err.response.data.message);
        } finally {
            toast.dismiss(toastId);
        }
        return response
    }
}