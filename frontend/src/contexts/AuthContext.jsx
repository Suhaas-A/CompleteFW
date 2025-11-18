import { createContext, useContext, useEffect, useState } from "react";
import { login, register, getMyDetails } from "../api/authApi";
import { setToken, getToken, clearToken } from "../utils/storage";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = getToken();
    if (token) {
      getMyDetails()
        .then((res) => setUser(res.data))
        .catch(() => setUser(null))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = async (username, password) => {
    try {
      setError(null);
      const { data } = await login(username, password);
      setToken(data.access_token);
      const res = await getMyDetails();
      setUser(res.data);
      return true;
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid credentials");
      return false;
    }
  };

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

  const handleLogout = () => {
    clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, error, handleLogin, handleRegister, handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Make sure this hook is exported
export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return ctx;
};
