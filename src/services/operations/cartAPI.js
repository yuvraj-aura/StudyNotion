import { apiConnector } from "../apiConnector";
import { profileEndpoints } from "../APIs";
import { toast } from "react-hot-toast";
import { setCart, setCartUpdating, setCartLoading, setCartReady } from "../../redux/slices/cartSlice";

const { GET_USER_CART_API, SYNC_USER_CART_API } = profileEndpoints;

let cartRequest = 0;

// Fetch Cart from DB when user logs in or mounts App
export function getUserCartFromDB(token) {
  return async (dispatch, getState) => {
    if (!token || getState().auth.token !== token) return;
    const request = ++cartRequest;
    dispatch(setCartLoading(true));
    try {
      const response = await apiConnector("GET", GET_USER_CART_API, null, {
        Authorization: `Bearer ${token}`,
      }, undefined, { timeout: 15000 });
      if (request !== cartRequest || getState().auth.token !== token) return;
      if (!response?.data?.success || !Array.isArray(response.data.data)) throw new Error("Could not load cart");
      dispatch(setCart(response.data.data));
      dispatch(setCartReady(true));
    } catch (error) {
      if (request === cartRequest && getState().auth.token === token) {
        toast.error(error.response?.status === 401
          ? "Your session has expired. Please sign in again to load your cart."
          : error.response?.data?.message || "Could not reach the server to load your cart. Check the connection and retry.");
      }
    } finally {
      if (request === cartRequest && getState().auth.token === token) dispatch(setCartLoading(false));
    }
  };
}

// Persist first, then update Redux and local storage from the database response.
export async function syncCartWithDB(cartCourses, token) {
  const { data } = await apiConnector("POST", SYNC_USER_CART_API,
    { cartCourseIds: cartCourses.map((course) => course._id || course) },
    { Authorization: "Bearer " + token });
  if (!data?.success || !Array.isArray(data.data)) {
    throw new Error(data?.message || "Could not update cart");
  }
  return data.data;
}

export function updateCourseInCart(course, remove = false) {
  return async (dispatch, getState) => {
    const { auth: { token }, cart: { cartUpdating, paymentLoading, cartLoading, cartReady } } = getState();
    if (!token || cartUpdating || paymentLoading || cartLoading || !cartReady) return;
    const request = ++cartRequest;
    dispatch(setCartUpdating(true));
    try {
      const { data } = await apiConnector("POST", SYNC_USER_CART_API,
        { courseId: course._id, remove }, { Authorization: "Bearer " + token });
      if (!data?.success || !Array.isArray(data.data)) throw new Error(data?.message || "Could not update cart");
      const savedCart = data.data;
      if (getState().auth.token !== token || request !== cartRequest) return;
      dispatch(setCart(savedCart));
      toast.success(remove ? "Course removed from cart" : "Course added to cart");
    } catch (error) {
      if (getState().auth.token === token) {
        toast.error(error.response?.data?.message || error.message || "Could not update cart. Please try again.");
      }
    } finally {
      if (getState().auth.token === token) dispatch(setCartUpdating(false));
    }
  };
}
