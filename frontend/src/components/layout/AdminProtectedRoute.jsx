// src/components/layout/AdminProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";
import Loader from "../common/Loader";

export default function AdminProtectedRoute({ children }) {
  const { user, loadingAuth } = useAuthContext();

  // Wait for auth to load
  if (loadingAuth) return <Loader />;

  // Not logged in
  if (!user) return <Navigate to="/login" replace />;

  // Detect admin using all possible backend fields
  const isAdmin =
    user.admin ||
    user.is_admin ||
    user.isAdmin ||
    user.role === "admin" ||
    user.is_superuser ||
    user.is_staff;

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9F9F7] text-[#3A3A3A] px-6">
        <div className="bg-white border border-[#EDE6D8] rounded-2xl shadow-lg p-10 max-w-lg text-center">
          <h1 className="text-3xl font-serif mb-4 text-[#8C6B1F]">🚫 Access Denied</h1>
          <p className="text-gray-600 mb-6">
            This page is restricted to <span className="font-semibold text-[#C9A227]">admin users</span>.
          </p>
          <a
            href="/"
            className="inline-block bg-gradient-to-r from-[#C9A227] to-[#8C6B1F] text-white px-6 py-2 rounded-lg shadow-md hover:from-[#D4AF37] hover:to-[#B8871F] transition-all duration-300"
          >
            Go Back Home
          </a>
        </div>
      </div>
    );
  }

  return children;
}
