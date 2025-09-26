import { createContext, useState, useContext, useEffect } from "react";
import api from "../api/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Persist user on refresh
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  // --- SIGNUP ---
  const signup = async (username, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/users", { username, email, password });
      setUser(res.data);
      return res.data;
    } catch (err) {
      console.error("Signup failed:", err);
      setError(err.response?.data?.message || "Signup failed. Try again.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIN ---
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/login", { email, password });
      setUser(res.data);
      return res.data;
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.response?.data?.message || "Login failed. Check your credentials.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // --- LOGOUT ---
  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, error, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
