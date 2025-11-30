import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";
import Loader from "../common/Loader";

export default function UserProtectedRoute({ children }) {
  const { user, loadingAuth } = useAuthContext();

  if (loadingAuth) return <Loader />;

  // If not logged in → redirect to login
  if (!user) return <Navigate to="/login" replace />;

  // Detect admin from any backend field you use
  const isAdmin =
    user.admin ||
    user.is_admin ||
    user.isAdmin ||
    user.role === "admin" ||
    user.is_superuser ||
    user.is_staff;

  // ❌ If admin tries to enter user pages → redirect to admin dashboard
  if (isAdmin) return <Navigate to="/admin/dashboard" replace />;

  return children;
}
