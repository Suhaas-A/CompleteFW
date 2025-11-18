// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { login, register, getMyDetails } from "../api/authApi";
import { setToken, getToken, clearToken } from "../utils/storage";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true); // renamed for clarity
  const [error, setError] = useState(null);

  // ⭐ Load user if token exists
  const loadUser = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setLoadingAuth(false);
      return;
    }

    try {
      const res = await getMyDetails();
      setUser(res.data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoadingAuth(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // ⭐ Login
  const handleLogin = async (username, password) => {
    try {
      setError(null);

      // login → returns token
      const { data } = await login(username, password);
      setToken(data.access_token);

      // load user with that new token
      await loadUser();

      return true;
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid credentials");
      return false;
    }
  };

  // ⭐ Register
  const handleRegister = async (formData) => {
    try {
      setError(null);
      await register(formData);
      return true;
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed");
      return false;
    }
  };

  // ⭐ Logout
  const handleLogout = () => {
    clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loadingAuth,
        error,
        handleLogin,
        handleRegister,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook
export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return ctx;
};
