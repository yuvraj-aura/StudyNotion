import { Navigate } from "react-router-dom";

const PrivateRoute = ( {isLoggedIn, children} ) => {
  if (isLoggedIn) {
    return children;
  }else{
    return <Navigate to="/signin" />
  }
}

export default PrivateRoute