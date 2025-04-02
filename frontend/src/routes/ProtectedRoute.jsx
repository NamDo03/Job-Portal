import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ requiredRoles }) => {
  const token = Cookies.get("token");
  const { currentUser } = useSelector((state) => state.user);

  if (!token || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles.length > 0 && !requiredRoles.includes(currentUser?.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
