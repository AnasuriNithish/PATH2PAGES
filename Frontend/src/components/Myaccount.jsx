// src/components/Myaccount.jsx
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import { SiThreads } from "react-icons/si";
const API_BASE_URL = "https://pathtopages.onrender.com/api/v1/auth";

const TOKEN_KEY = "ptp_auth_token";
const USER_KEY = "ptp_user";

const Myaccount = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState("login"); // "login" | "signup" | "account"
  const [profile, setProfile] = useState(null);

  const [loginForm, setLoginForm] = useState({
    email: "",
  });

  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    fullAddress: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Edit mode for account details
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    fullAddress: "",
    city: "",
    pincode: "",
  });

  const navigate = useNavigate();
  const location = useLocation();

  const redirectAfterAuth =
    location.state && location.state.from ? location.state.from : null;

  // On mount – if user already logged in, show Account view
  useEffect(() => {
    try {
      const rawUser = localStorage.getItem(USER_KEY);
      if (rawUser) {
        const parsed = JSON.parse(rawUser);
        setProfile(parsed);
        setCurrentView("account");
      }
    } catch (err) {
      console.error("Failed to read saved user:", err);
      setProfile(null);
    }
  }, []);

  const clearMessages = () => {
    setErrorMsg("");
    setSuccessMsg("");
  };

  /* =========================
   *  LOGIN (EMAIL ONLY)
   * ======================= */

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    clearMessages();

    if (!loginForm.email) {
      setErrorMsg("Please enter your email.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginForm.email }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || result.message || "Login failed");
      }

      const token =
        result.token ||
        result.accessToken ||
        result.data?.token ||
        result.data?.accessToken;

      if (!token) {
        throw new Error("No token received from server.");
      }

      const rawUser = result.data || {};

      let oldUser = null;
      try {
        const oldRaw = localStorage.getItem(USER_KEY);
        oldUser = oldRaw ? JSON.parse(oldRaw) : null;
      } catch {
        oldUser = null;
      }

      const profileData = {
        id: rawUser.id || rawUser._id || oldUser?.id,
        name: rawUser.name || oldUser?.name || "",
        email: rawUser.email || oldUser?.email || loginForm.email,
        phone: rawUser.phone || rawUser.mobile || oldUser?.phone || "",
        fullAddress:
          rawUser.fullAddress || rawUser.address || oldUser?.fullAddress || "",
        city: rawUser.city || oldUser?.city || "",
        pincode: rawUser.pincode || oldUser?.pincode || "",
      };

      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(profileData));

      setProfile(profileData);
      setCurrentView("account");
      setIsEditing(false);
      setSuccessMsg(
        `Welcome back, ${
          (profileData.name || "Friend").split(" ")[0]
        }! You’re logged in.`
      );

      if (redirectAfterAuth) {
        navigate(redirectAfterAuth, { replace: true });
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorMsg(err.message || "Login failed. Please try again.");
      setProfile(null);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
   *  SIGNUP
   * ======================= */

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    clearMessages();

    if (
      !signupForm.name ||
      !signupForm.email ||
      !signupForm.password ||
      !signupForm.fullAddress
    ) {
      setErrorMsg("Please fill in all required fields (*).");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signupForm.name,
          email: signupForm.email,
          password: signupForm.password,
          mobile: signupForm.mobile,
          fullAddress: signupForm.fullAddress,
        }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(
          result.error || result.message || "Registration failed"
        );
      }

      const token =
        result.token ||
        result.accessToken ||
        result.data?.token ||
        result.data?.accessToken;

      if (!token) {
        throw new Error("No token received from server.");
      }

      const rawUser = result.data || {};
      const profileData = {
        id: rawUser.id || rawUser._id,
        name: rawUser.name || signupForm.name,
        email: rawUser.email || signupForm.email,
        phone: rawUser.mobile || rawUser.phone || signupForm.mobile,
        fullAddress:
          rawUser.fullAddress || rawUser.address || signupForm.fullAddress,
        city: rawUser.city || "",
        pincode: rawUser.pincode || "",
      };

      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(profileData));

      setProfile(profileData);
      setCurrentView("account");
      setIsEditing(false);
      setSuccessMsg(
        `Account created successfully! Welcome, ${
          (profileData.name || "Friend").split(" ")[0]
        }.`
      );

      if (redirectAfterAuth) {
        navigate(redirectAfterAuth, { replace: true });
      }
    } catch (err) {
      console.error("Signup error:", err);
      setErrorMsg(err.message || "Registration failed. Please try again.");
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
   *  LOGOUT
   * ======================= */

  const handleLogout = () => {
    clearMessages();
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setProfile(null);
    setCurrentView("login");
    setIsEditing(false);
    setSuccessMsg("You’ve been logged out safely.");
  };

  /* =========================
   *  ACCOUNT EDIT HANDLERS
   * ======================= */

  const startEditing = () => {
    if (!profile) return;
    clearMessages();
    setEditForm({
      name: profile.name || "",
      phone: profile.phone || "",
      fullAddress: profile.fullAddress || "",
      city: profile.city || "",
      pincode: profile.pincode || "",
    });
    setIsEditing(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    clearMessages();

    if (!profile) return;

    const updatedProfile = {
      ...profile,
      name: editForm.name.trim(),
      phone: editForm.phone.trim(),
      fullAddress: editForm.fullAddress.trim(),
      city: editForm.city.trim(),
      pincode: editForm.pincode.trim(),
    };

    setProfile(updatedProfile);
    localStorage.setItem(USER_KEY, JSON.stringify(updatedProfile));

    setIsEditing(false);
    setSuccessMsg("Your account details have been updated.");
  };

  const cancelEditing = () => {
    clearMessages();
    setIsEditing(false);
  };

  /* =========================
   *  RENDER HELPERS
   * ======================= */

  const renderLoginForm = () => (
    <form onSubmit={handleLoginSubmit} className="auth-form">
      <h3 className="mb-3">Login</h3>
      <p className="text-muted small mb-3">
        Enter your email to access your saved details and orders.
      </p>
      <div className="mb-3">
        <label className="form-label">Email*</label>
        <input
          type="email"
          className="form-control input-minimal"
          name="email"
          value={loginForm.email}
          onChange={handleLoginChange}
          placeholder="you@example.com"
        />
      </div>
      <button
        type="submit"
        className="btn btn-primary w-100"
        disabled={loading}
      >
        {loading ? "Checking..." : "Continue"}
      </button>
      <div className="mt-3 text-center small">
        New here?{" "}
        <button
          type="button"
          className="link-button"
          onClick={() => {
            clearMessages();
            setCurrentView("signup");
          }}
        >
          Create account
        </button>
      </div>
    </form>
  );

  const renderSignupForm = () => (
    <form onSubmit={handleSignupSubmit} className="auth-form">
      <h3 className="mb-3">Create account</h3>
      <p className="text-muted small mb-3">
        We’ll use these details to auto-fill checkout for you.
      </p>
      <div className="mb-3">
        <label className="form-label">Full Name*</label>
        <input
          type="text"
          className="form-control input-minimal"
          name="name"
          value={signupForm.name}
          onChange={handleSignupChange}
          placeholder="Your full name"
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Email*</label>
        <input
          type="email"
          className="form-control input-minimal"
          name="email"
          value={signupForm.email}
          onChange={handleSignupChange}
          placeholder="you@example.com"
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Password*</label>
        <input
          type="password"
          className="form-control input-minimal"
          name="password"
          value={signupForm.password}
          onChange={handleSignupChange}
          placeholder="Create a password"
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Mobile</label>
        <input
          type="tel"
          className="form-control input-minimal"
          name="mobile"
          value={signupForm.mobile}
          onChange={handleSignupChange}
          placeholder="10-digit mobile number"
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Full Address*</label>
        <textarea
          className="form-control input-minimal"
          name="fullAddress"
          rows={2}
          value={signupForm.fullAddress}
          onChange={handleSignupChange}
          placeholder="House no, street, city, state, pincode"
        />
      </div>
      <button
        type="submit"
        className="btn btn-primary w-100"
        disabled={loading}
      >
        {loading ? "Creating..." : "Sign up"}
      </button>
      <div className="mt-3 text-center small">
        Already have an account?{" "}
        <button
          type="button"
          className="link-button"
          onClick={() => {
            clearMessages();
            setCurrentView("login");
          }}
        >
          Login
        </button>
      </div>
    </form>
  );

  const renderAccountView = () => (
    <div className="auth-form">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h3 className="mb-0">My account</h3>
          <p className="text-muted small mb-0">
            Manage the details we use at checkout.
          </p>
        </div>
        {profile && !isEditing && (
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={startEditing}
          >
            Edit
          </button>
        )}
      </div>

      {profile ? (
        !isEditing ? (
          <>
            <div className="account-row">
              <span className="label">Name</span>
              <span className="value">{profile.name || "—"}</span>
            </div>
            <div className="account-row">
              <span className="label">Email</span>
              <span className="value">{profile.email || "—"}</span>
            </div>
            <div className="account-row">
              <span className="label">Phone</span>
              <span className="value">{profile.phone || "—"}</span>
            </div>
            <div className="account-row">
              <span className="label">Address</span>
              <span className="value">
                {profile.fullAddress ? (
                  profile.fullAddress
                ) : (
                  <span className="text-muted">Not added</span>
                )}
              </span>
            </div>
            <div className="account-row">
              <span className="label">City</span>
              <span className="value">{profile.city || "—"}</span>
            </div>
            <div className="account-row">
              <span className="label">Pincode</span>
              <span className="value">{profile.pincode || "—"}</span>
            </div>

            <p className="mt-3 text-muted small">
              These details are stored for your email and used automatically on
              checkout. You can edit them anytime.
            </p>

            <div className="d-flex flex-wrap gap-2 mt-3">
              {/* <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/shop")}
              >
                Explore shop
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => navigate("/cart")}
              >
                View cart
              </button> */}
              <button
                type="button"
                className="btn btn-outline-danger ms-auto"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleEditSubmit}>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control input-minimal"
                name="name"
                value={editForm.name}
                onChange={handleEditChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Phone</label>
              <input
                type="tel"
                className="form-control input-minimal"
                name="phone"
                value={editForm.phone}
                onChange={handleEditChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Full Address</label>
              <textarea
                className="form-control input-minimal"
                name="fullAddress"
                rows={2}
                value={editForm.fullAddress}
                onChange={handleEditChange}
              />
            </div>
            <div className="row">
              <div className="col-6 mb-3">
                <label className="form-label">City</label>
                <input
                  type="text"
                  className="form-control input-minimal"
                  name="city"
                  value={editForm.city}
                  onChange={handleEditChange}
                />
              </div>
              <div className="col-6 mb-3">
                <label className="form-label">Pincode</label>
                <input
                  type="text"
                  className="form-control input-minimal"
                  name="pincode"
                  value={editForm.pincode}
                  onChange={handleEditChange}
                />
              </div>
            </div>
            <div className="d-flex gap-2 mt-3">
              <button type="submit" className="btn btn-primary">
                Save
              </button>
              <button
                type="button"
                className="btn btn-light"
                onClick={cancelEditing}
              >
                Cancel
              </button>
            </div>
          </form>
        )
      ) : (
        <p className="text-muted">No profile found. Please log in again.</p>
      )}
    </div>
  );

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg px-3 py-2 custom-navbar shadow-sm">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand d-flex align-items-center">
            <img
              src={process.env.PUBLIC_URL + "/logo.png"}
              alt="Logo"
              height="36"
            />
            <span className="ms-2 fs-4 fw-semibold brand-text dancing-script">
              PathToPages
            </span>
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`}
          >
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
              <li className="nav-item">
                <Link to="/" className="nav-link nav-link-custom px-3">
                  Home
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/shop" className="nav-link nav-link-custom px-3">
                  Shop
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/cart" className="nav-link nav-link-custom px-3">
                  Cart
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/profile" className="nav-link nav-link-custom px-3">
                  Profile
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="container my-5">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-7">
            <div className="card card-minimal p-4">
              {errorMsg && (
                <div className="alert alert-danger small mb-3">{errorMsg}</div>
              )}
              {successMsg && (
                <div className="alert alert-success small mb-3">
                  {successMsg}
                </div>
              )}

              {currentView === "login" && renderLoginForm()}
              {currentView === "signup" && renderSignupForm()}
              {currentView === "account" && renderAccountView()}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="custom-footer py-4 mt-62">
        <div className="footer-left">
          <h5 className="footer-title dancing-script mb-1">Path To Pages</h5>
          {/* <p className="footer-subtext small mb-0">
            Designed with passion by Nithish
          </p> */}
        </div>

        <div className="footer-center">
          <a href="https://wa.me/918019418800" className="footer-icon">
            <FaWhatsapp size={22} />
          </a>
          <a
            href="https://www.instagram.com/pathtopages"
            className="footer-icon"
          >
            <FaInstagram size={22} />
          </a>
          <a href="https://www.threads.net/pathtopages" className="footer-icon">
            <SiThreads size={22} />
          </a>
        </div>

        <div className="footer-right">
          <p className="small footer-copy mb-0">
            © {new Date().getFullYear()} PathToPages
          </p>
        </div>
      </footer>

      {/* Minimal styles */}
      <style jsx="true">{`
        @import url("https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400..700&display=swap");
        .dancing-script {
          font-family: "Dancing Script", cursive;
          font-optical-sizing: auto;
          font-weight: 600; /* you can change to 400, 500, 700 etc. */
          font-style: normal;
        }
        body {
          background-color: #faf5ef;
          font-family: "Poppins", sans-serif;
          color: #2e2520;
        }

        /* Themed Navbar based on photo colors */
        .custom-navbar {
          background: #7a5c4d
            url("https://www.transparenttextures.com/patterns/leather.png");
          border-bottom: 2px dashed #f8ead8;
          box-shadow: 0 4px 15px rgba(58, 37, 18, 0.35);
        }

        .brand-text {
          color: #fff8f0;
          letter-spacing: 1px;
        }

        .nav-link-custom {
          color: #f8ead8 !important;
          font-weight: 500;
          transition: color 0.2s ease;
        }

        .nav-link-custom:hover {
          color: #ffe6b3 !important;
        }

        .cart-icon {
          color: #fff8f0;
        }

        .cart-link:hover .cart-icon {
          color: #ffe6b3;
        }

        .cart-badge {
          font-size: 10px;
          position: absolute;
          top: -5px;
          right: -10px;
          padding: 4px 6px;
        }

        .navbar-toggler {
          border-color: #f8ead8;
        }

        .navbar-toggler-icon {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba(248,234,216,0.9)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
        }

        .card-minimal {
          border-radius: 16px;
          border: 1px solid #e4ddd3;
          box-shadow: 0 10px 30px rgba(15, 10, 8, 0.06);
          background-color: #ffffff;
        }

        .auth-form h3 {
          font-size: 1.35rem;
          font-weight: 600;
          color: #2e2520;
        }

        .input-minimal {
          border-radius: 10px;
          border: 1px solid #ddd1c2;
          background-color: #fcf9f4;
          font-size: 0.95rem;
        }

        .input-minimal:focus {
          border-color: #c49a6c;
          box-shadow: 0 0 0 2px rgba(196, 154, 108, 0.2);
        }

        .btn-primary {
          background-color: #2e2520;
          border-color: #2e2520;
          border-radius: 999px;
          font-size: 0.95rem;
          padding: 0.55rem 1.2rem;
        }

        .btn-primary:hover {
          background-color: #46362b;
          border-color: #46362b;
        }

        .btn-secondary {
          background-color: #f3ece3;
          border-color: #f3ece3;
          color: #2e2520;
          border-radius: 999px;
          font-size: 0.9rem;
        }

        .btn-secondary:hover {
          background-color: #e7ded2;
          border-color: #e7ded2;
        }

        .btn-outline-secondary {
          border-radius: 999px;
          font-size: 0.9rem;
        }

        .btn-light {
          border-radius: 999px;
          font-size: 0.9rem;
          background-color: #f8f4ee;
          border-color: #f0e5d8;
        }

        .link-button {
          border: none;
          background: none;
          padding: 0;
          color: #2e2520;
          font-weight: 500;
          text-decoration: underline;
          cursor: pointer;
        }

        .account-row {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.5rem 0;
          border-bottom: 1px dashed #eee1d4;
          font-size: 0.95rem;
        }

        .account-row:last-of-type {
          border-bottom: none;
        }

        .account-row .label {
          color: #8a7a6c;
        }

        .account-row .value {
          text-align: right;
          flex: 1;
        }

        /* Footer Matches Navbar Leather Theme */
        .custom-footer {
          background: #7a5c4d
            url("https://www.transparenttextures.com/patterns/paper-1.png");
          border-top: 2px dashed #f8ead8;
          color: #f8ead8;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          padding-inline: 2rem;
          position: relative;
          margin-top: 260px;
        }

        /* Columns */
        .footer-left,
        .footer-right {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .footer-center {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }

        /* Text + icons */
        .footer-title {
          color: #ffe6b3;
          font-size: 1.6rem;
        }

        .footer-subtext {
          color: #f8ead8;
          opacity: 0.85;
        }

        .footer-icon {
          color: #ffe6b3;
          transition: 0.3s ease;
        }

        .footer-icon:hover {
          color: #ffffff;
          transform: scale(1.12);
        }

        .footer-copy {
          color: #f8ead8;
          opacity: 0.85;
        }

        /* Mobile: stack & center again */
        @media (max-width: 768px) {
          .custom-footer {
            flex-direction: column;
            text-align: center;
            padding: 2rem 1rem;
          }

          .footer-left,
          .footer-right {
            align-items: center;
          }
        }
      `}</style>
    </>
  );
};

export default Myaccount;
