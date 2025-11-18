// src/components/layout/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";
import Loader from "../common/Loader";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuthContext();

  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" replace />;

  return children;
}
