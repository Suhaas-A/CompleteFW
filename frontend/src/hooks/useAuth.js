// src/hooks/useAuth.js
import { useState, useEffect, useCallback } from "react";
import { login, register, getMyDetails } from "../api/authApi";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load current user (if token exists)
  useEffect(() => {
    const token = sessionStorage.getItem("access_token");
    if (token) {
      getMyDetails()
        .then((res) => setUser(res.data))
        .catch(() => setUser(null))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = useCallback(async (username, password) => {
    try {
      setError(null);
      const { data } = await login(username, password);
      sessionStorage.setItem("access_token", data.access_token);
      const userRes = await getMyDetails();
      setUser(userRes.data);
      return true;
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed");
      return false;
    }
  }, []);

  const handleRegister = useCallback(async (formData) => {
    try {
      setError(null);
      await register(formData);
      return true;
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed");
      return false;
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("access_token");
    setUser(null);
  };

  return { user, loading, error, handleLogin, handleRegister, handleLogout };
}
