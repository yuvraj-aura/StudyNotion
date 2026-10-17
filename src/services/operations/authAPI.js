import { toast } from "react-toastify";
import { setLoading, setToken } from "../../redux/slices/authSlice";
import { resetCart } from "../../redux/slices/cartSlice";
import { setUser } from "../../redux/slices/profileSlice";
import { apiConnector } from "../apiConnector";
import { endpoints } from "../APIs";

const {
  SENDOTP_API,
  SIGNUP_API,
  LOGIN_API,
  RESETPASSTOKEN_API,
  RESETPASSWORD_API,
} = endpoints;

export function sendOtp(email, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Sending verification code to your email...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", SENDOTP_API, {
        email,
        checkUserPresent: true,
      });

      console.log("SENDOTP API RESPONSE -> ", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("OTP sent to your email successfully!");
      navigate("/verify-email");
    } catch (error) {
      console.log("SENDOTP API ERROR -> ", error);
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Could not send OTP. Please try again.";
      toast.error(errorMsg);
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}

export function signUp(
  accountType,
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  otp,
  navigate
) {
  return async (dispatch) => {
    const toastId = toast.loading("Creating your account...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", SIGNUP_API, {
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPass: confirmPassword,
        otp,
      });

      console.log("SIGNUP API RESPONSE -> ", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Account created successfully! Please sign in.");
      navigate("/signin");
    } catch (error) {
      console.log("SIGNUP API ERROR -> ", error);
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Signup failed. Please try again.";
      toast.error(errorMsg);
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}

export function login(email, password, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Signing in...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      });

      console.log("LOGIN API RESPONSE -> ", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Login Successful!");
      dispatch(setToken(response.data.token));

      const userImage = response.data?.data?.image
        ? response.data.data.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.data.firstName} ${response.data.data.lastName}`;
      
      const hydratedUser = { ...response.data.data, image: userImage };
      dispatch(setUser(hydratedUser));

      localStorage.setItem("token", JSON.stringify(response.data.token));
      localStorage.setItem("user", JSON.stringify(hydratedUser));

      navigate("/dashboard/my-profile");
    } catch (error) {
      console.log("LOGIN API ERROR -> ", error);
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Login Failed. Please check your credentials.";
      toast.error(errorMsg);
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}

export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null));
    dispatch(setUser(null));
    dispatch(resetCart());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged Out");
    navigate("/");
  };
}
