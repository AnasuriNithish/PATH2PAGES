import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

// =======================
// Profile Page
// =======================
const ProfilePage = () => {
  const navigate = useNavigate();
  const [profile] = useState({ name: "Mock User", email: "test@example.com" });

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/auth", { replace: true });
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/auth", { state: { from: "/profile" }, replace: true });
    }
  }, [navigate]);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8f5ed",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        color: "#4d3b2b",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 400,
          padding: 24,
          backgroundColor: "#fff",
          borderRadius: 16,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h1
          style={{
            fontSize: 28,
            fontWeight: "bold",
            marginBottom: 24,
            textAlign: "center",
            color: "#7a5c4d",
          }}
        >
          My Account
        </h1>

        <div
          style={{
            marginBottom: 16,
            borderBottom: "1px solid #eee",
            paddingBottom: 8,
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 600 }}>Name:</div>
          <div style={{ fontSize: 16 }}>{profile.name}</div>
        </div>

        <div
          style={{
            marginBottom: 16,
            borderBottom: "1px solid #eee",
            paddingBottom: 8,
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 600 }}>Email:</div>
          <div style={{ fontSize: 16 }}>{profile.email}</div>
        </div>

        <div
          style={{
            marginBottom: 16,
            borderBottom: "1px solid #eee",
            paddingBottom: 8,
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 600 }}>Status:</div>
          <div style={{ fontSize: 16, color: "green" }}>Authenticated</div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            marginTop: 16,
            width: "100%",
            backgroundColor: "#a35d48",
            color: "#fff",
            fontWeight: 600,
            padding: "8px 0",
            borderRadius: 999,
            border: "none",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

// =======================
// Auth Page (Login + Signup)
// =======================
const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/profile";

  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const showMessage = (text, type = "info") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  // If already logged in, go to the desired page
  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      navigate(from, { replace: true });
    }
  }, [navigate, from]);

  // ---------- LOGIN ----------
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateEmail(loginEmail)) {
      showMessage("Please enter a valid email address.", "error");
      return;
    }
    setLoading(true);

    try {
      // Simulated backend check
      const isRegistered = loginEmail === "test@example.com";
      await new Promise((r) => setTimeout(r, 1000));

      if (isRegistered) {
        const mockToken = "mock-token-123";
        localStorage.setItem("authToken", mockToken);
        showMessage("Login successful! Redirecting...", "success");
        navigate(from, { replace: true });
      } else {
        showMessage("Account not found. Please sign up.", "warning");
        setMode("signup");
      }
    } catch (err) {
      console.error(err);
      showMessage("An error occurred during login.", "error");
    } finally {
      setLoading(false);
    }
  };

  // ---------- SIGNUP ----------
  const handleSignup = async (e) => {
    e.preventDefault();

    if (!validateEmail(signupForm.email)) {
      showMessage("Please enter a valid email address.", "error");
      return;
    }
    if (!signupForm.name || !signupForm.phone || !signupForm.address) {
      showMessage("All fields are required.", "error");
      return;
    }

    setLoading(true);

    try {
      // Simulated signup
      await new Promise((r) => setTimeout(r, 1000));

      const mockToken = "mock-token-new-user";
      localStorage.setItem("authToken", mockToken);
      showMessage("Account created successfully! Redirecting...", "success");
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      showMessage("Signup failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8f5ed",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: 16,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          width: "100%",
          maxWidth: 450,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: "#7a5c4d",
            padding: 20,
            color: "#fff",
            textAlign: "center",
          }}
        >
          <h4 style={{ margin: 0 }}>
            {mode === "login" ? "Welcome Back" : "Create Your Account"}
          </h4>
        </div>

        {/* Body */}
        <div style={{ padding: 24 }}>
          {/* Alert message */}
          {message && (
            <div
              style={{
                fontSize: 13,
                marginBottom: 12,
                padding: 8,
                borderRadius: 6,
                backgroundColor:
                  message.type === "error"
                    ? "#f8d7da"
                    : message.type === "success"
                    ? "#d1e7dd"
                    : message.type === "warning"
                    ? "#fff3cd"
                    : "#cff4fc",
              }}
            >
              {message.text}
            </div>
          )}

          {/* LOGIN FORM */}
          {mode === "login" ? (
            <form onSubmit={handleLogin}>
              <p style={{ fontSize: 14, color: "#666", textAlign: "center" }}>
                Login with your email address.
              </p>

              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12 }}>Email</label>
                <input
                  type="email"
                  placeholder="user@example.com (Try 'test@example.com')"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: 8,
                    borderRadius: 8,
                    border: "1px solid #e0d9c9",
                    fontSize: 14,
                    marginTop: 4,
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "8px 0",
                  borderRadius: 999,
                  border: "none",
                  backgroundColor: "#7a5c4d",
                  color: "#fff",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              <p style={{ fontSize: 13, textAlign: "center", marginTop: 12 }}>
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  style={{
                    border: "none",
                    background: "none",
                    color: "#7a5c4d",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  Sign up
                </button>
              </p>
            </form>
          ) : (
            // SIGNUP FORM
            <form onSubmit={handleSignup}>
              <p style={{ fontSize: 14, color: "#666", textAlign: "center" }}>
                Enter your details to create an account.
              </p>

              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12 }}>Full Name</label>
                <input
                  type="text"
                  value={signupForm.name}
                  onChange={(e) =>
                    setSignupForm((p) => ({ ...p, name: e.target.value }))
                  }
                  required
                  style={{
                    width: "100%",
                    padding: 8,
                    borderRadius: 8,
                    border: "1px solid #e0d9c9",
                    marginTop: 4,
                  }}
                />
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12 }}>Email</label>
                <input
                  type="email"
                  value={signupForm.email}
                  onChange={(e) =>
                    setSignupForm((p) => ({ ...p, email: e.target.value }))
                  }
                  required
                  style={{
                    width: "100%",
                    padding: 8,
                    borderRadius: 8,
                    border: "1px solid #e0d9c9",
                    marginTop: 4,
                  }}
                />
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12 }}>Phone</label>
                <input
                  type="tel"
                  value={signupForm.phone}
                  onChange={(e) =>
                    setSignupForm((p) => ({ ...p, phone: e.target.value }))
                  }
                  required
                  style={{
                    width: "100%",
                    padding: 8,
                    borderRadius: 8,
                    border: "1px solid #e0d9c9",
                    marginTop: 4,
                  }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12 }}>Address</label>
                <input
                  type="text"
                  value={signupForm.address}
                  onChange={(e) =>
                    setSignupForm((p) => ({ ...p, address: e.target.value }))
                  }
                  required
                  style={{
                    width: "100%",
                    padding: 8,
                    borderRadius: 8,
                    border: "1px solid #e0d9c9",
                    marginTop: 4,
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "8px 0",
                  borderRadius: 999,
                  border: "none",
                  backgroundColor: "#7a5c4d",
                  color: "#fff",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {loading ? "Creating account..." : "Sign up"}
              </button>

              <p style={{ fontSize: 13, textAlign: "center", marginTop: 12 }}>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  style={{
                    border: "none",
                    background: "none",
                    color: "#7a5c4d",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  Login
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

// =======================
// Initial Redirect Component
// =======================
const InitialRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate("/profile", { replace: true });
    } else {
      navigate("/auth", { replace: true });
    }
  }, [navigate]);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8f5ed",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <p style={{ fontSize: 18, color: "#7a5c4d" }}>Redirecting...</p>
    </div>
  );
};

// =======================
// Root App Component
// =======================
const App = () => {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      {/* catch-all: start at "/" or unknown -> InitialRedirect */}
      <Route path="*" element={<InitialRedirect />} />
    </Routes>
  );
};

export default App;
