import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { profileEndpoints } from "../APIs";
import { setUser } from "../../redux/slices/profileSlice";

const { UPDATE_PROFILE_PICTURE_API } = profileEndpoints;

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
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        }
      );

      if (!response?.data?.success) {
        throw new Error(response?.data?.message || "Upload failed");
      }

      const updatedUser = response.data.data;
      dispatch(setUser(updatedUser));
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.update(toastId, {
        render: "Profile photo updated successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      return updatedUser;
    } catch (error) {
      console.error("updateProfilePicture error:", error);
      toast.update(toastId, {
        render:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to upload photo",
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
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

      toast.update(toastId, {
        render: "Profile photo removed.",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      return updatedUser;
    } catch (error) {
      console.error("removeProfilePicture error:", error);
      toast.update(toastId, {
        render: "Failed to remove profile photo.",
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
      return null;
    }
  };
}
