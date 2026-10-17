import { apiConnector } from "../apiConnector";
import { profileEndpoints } from "../APIs";
import { setCart } from "../../redux/slices/cartSlice";

const { GET_USER_CART_API, SYNC_USER_CART_API } = profileEndpoints;

// Fetch Cart from DB when user logs in or mounts App
export function getUserCartFromDB(token) {
  return async (dispatch) => {
    if (!token) return;
    try {
      const response = await apiConnector("GET", GET_USER_CART_API, null, {
        Authorization: `Bearer ${token}`,
      });
      if (response?.data?.success && response.data.data) {
        dispatch(setCart(response.data.data));
      }
    } catch (error) {
      console.log("Could not load cart from database:", error.message);
    }
  };
}

// Sync cart items array with database
export async function syncCartWithDB(cartCourses, token) {
  if (!token) return;
  try {
    const cartCourseIds = cartCourses.map((c) => c._id || c);
    await apiConnector(
      "POST",
      SYNC_USER_CART_API,
      { cartCourseIds },
      {
        Authorization: `Bearer ${token}`,
      }
    );
  } catch (error) {
    console.log("Failed to sync cart with database:", error.message);
  }
}
