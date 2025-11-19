// src/components/layout/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loadingAuth } = useAuthContext();

  // ⭐ WAIT for authentication to finish
  if (loadingAuth) {
    return (
      <p className="text-center mt-10">
        Checking login status...
      </p>
    );
  }

  // ❌ No user AFTER loading → redirect
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ✔ Authenticated → allow page
  return children;
}
