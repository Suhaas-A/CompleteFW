// src/components/layout/AdminProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";
import Loader from "../common/Loader";

export default function AdminProtectedRoute({ children }) {
  const { user, loading } = useAuthContext();

  // ✅ While loading
  if (loading) return <Loader />;

  // ✅ Not logged in → redirect to login
  if (!user) return <Navigate to="/login" replace />;

  // ✅ Non-admin access — show styled restricted page
  if (!user.admin)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9F9F7] text-[#3A3A3A] px-6">
        <div className="bg-white border border-[#EDE6D8] rounded-2xl shadow-lg p-10 max-w-lg text-center">
          <h1 className="text-3xl font-serif mb-4 text-[#8C6B1F]">🚫 Access Denied</h1>
          <p className="text-gray-600 mb-6">
            This page is restricted to <span className="font-semibold text-[#C9A227]">admin users</span> only.
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

  // ✅ If admin, render content
  return children;
}
