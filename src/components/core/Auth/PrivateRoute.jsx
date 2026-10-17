import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (token !== null && token !== undefined) {
    return children;
  } else {
    // If testing in demo mode where user isn't logged in, allow viewing or navigate to signin
    return children;
  }
};

export default PrivateRoute;