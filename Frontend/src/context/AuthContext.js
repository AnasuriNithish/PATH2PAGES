import React, { createContext, useContext, useState, useEffect } from "react";
import {
  register as apiRegister,
  login as apiLogin,
  // optionally: setToken for your api_service (uncomment if available)
  // setApiToken
} from "../services/api_service";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // bootstrap from localStorage
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      if (storedToken) {
        setToken(storedToken);
        // if api_service supports setting token globally, do it here:
        // setApiToken(storedToken);
      }
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (err) {
          console.warn("Failed to parse stored user", err);
          localStorage.removeItem("user");
        }
      }
    } catch (err) {
      console.error("Error bootstrapping auth", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Helper to parse JSON safely
  async function safeParseJson(res) {
    try {
      // Some servers return empty body (204) or non-json; guard against that
      const text = await res.text();
      if (!text) return null;
      return JSON.parse(text);
    } catch (err) {
      // fallback: try res.json() (some environments), but keep safe
      try {
        return await res.json();
      } catch (e) {
        return null;
      }
    }
  }

  // login expects an object: { name, password } (or { email, password } if you prefer)
  const login = async ({ name, password } = {}) => {
    setLoading(true);
    try {
      const res = await apiLogin({ name, password });
      // res is expected to be a Fetch Response-like object
      const contentType = res?.headers?.get?.("content-type") || "";
      const isJson = contentType.includes("application/json");

      // parse JSON safely (handles empty bodies)
      const data = isJson ? await safeParseJson(res) : null;

      if (!res.ok) {
        const msg = (data && data.message) || `Login failed (${res.status})`;
        throw new Error(msg);
      }

      // Expect server returns { token, user }
      if (!data || !data.token) {
        throw new Error("Server did not return auth token");
      }

      setToken(data.token);
      setUser(data.user || null);
      localStorage.setItem("token", data.token);
      if (data.user) localStorage.setItem("user", JSON.stringify(data.user));

      // If your api_service supports setting a global token (like axios.defaults.headers),
      // call it here. Remove or uncomment depending on your api_service implementation.
      // setApiToken(data.token);

      return { success: true };
    } catch (error) {
      // normalize message
      const message = error?.message || "Login failed";
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (signupData) => {
    setLoading(true);
    try {
      const res = await apiRegister(signupData);
      const contentType = res?.headers?.get?.("content-type") || "";
      const isJson = contentType.includes("application/json");
      const data = isJson ? await safeParseJson(res) : null;

      if (!res.ok) {
        const msg = (data && data.message) || `Signup failed (${res.status})`;
        throw new Error(msg);
      }

      // Optionally, auto-login after signup if API returns token:
      // if (data?.token) { ... }

      return { success: true };
    } catch (error) {
      return { success: false, message: error?.message || "Signup failed" };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // if api service has clear token helper: setApiToken(null)
      setToken(null);
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const isAuthenticated = Boolean(token);

  return (
    <AuthContext.Provider
      value={{ user, token, login, signup, logout, loading, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
