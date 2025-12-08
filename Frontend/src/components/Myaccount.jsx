// src/components/Myaccount.jsx
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import { SiThreads } from "react-icons/si";

const API_BASE_URL = "https://pathtopages.onrender.com/api/v1/auth";

const TOKEN_KEY = "ptp_auth_token";
const USER_KEY = "ptp_user";
// ✅ LocalStorage key for orders
const ORDERS_KEY = "ptp_orders";
// ✅ NEW: LocalStorage key for last login
const LAST_LOGIN_KEY = "ptp_last_login";
// ✅ LocalStorage key for CART (same as Cart.jsx)
const CART_KEY = "pathtopages_cart";

// Helper to format last login timestamp
const formatDateTime = (isoString) => {
  if (!isoString) return "";
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
};

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

  // ✅ Orders state
  // { id, status: "Ordered" | "Delivered" | "Shipped", date, items: [{ name, qty }], email / userId }
  const [orders, setOrders] = useState([]);

  // ✅ NEW: last login timestamp
  const [lastLogin, setLastLogin] = useState("");

  // ✅ NEW: cart items count (from localStorage)
  const [cartCount, setCartCount] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  const redirectAfterAuth =
    location.state && location.state.from ? location.state.from : null;

  // ✅ Helper to update cart count from localStorage
  const updateCartCountFromStorage = () => {
    try {
      const rawCart = localStorage.getItem(CART_KEY);
      const parsed = rawCart ? JSON.parse(rawCart) : [];
      const count = Array.isArray(parsed)
        ? parsed.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0)
        : 0;
      setCartCount(count);
    } catch (err) {
      console.error("Failed to read cart from localStorage:", err);
      setCartCount(0);
    }
  };

  // On mount – if user already logged in, show Account view
  useEffect(() => {
    try {
      const rawUser = localStorage.getItem(USER_KEY);
      if (rawUser) {
        const parsed = JSON.parse(rawUser);
        setProfile(parsed);
        setCurrentView("account");
      }
      const storedLastLogin = localStorage.getItem(LAST_LOGIN_KEY);
      if (storedLastLogin) {
        setLastLogin(storedLastLogin);
      }
    } catch (err) {
      console.error("Failed to read saved user:", err);
      setProfile(null);
    }

    // ✅ also load cart count once on mount
    updateCartCountFromStorage();
  }, []);

  // ✅ Helper to load orders for this user from localStorage
  const loadOrdersFromStorage = (user) => {
    if (!user) {
      setOrders([]);
      return;
    }
    try {
      const raw = localStorage.getItem(ORDERS_KEY);
      if (!raw) {
        setOrders([]);
        return;
      }
      const parsed = JSON.parse(raw);

      const allOrders = Array.isArray(parsed) ? parsed : [];

      // Filter orders for this user by id or email
      const userOrders = allOrders.filter((order) => {
        if (!order) return false;
        const matchById =
          user.id && (order.userId === user.id || order.user_id === user.id);
        const matchByEmail =
          user.email && order.email && order.email === user.email;
        return matchById || matchByEmail;
      });

      setOrders(userOrders);
    } catch (err) {
      console.error("Failed to load orders:", err);
      setOrders([]);
    }
  };

  // ✅ whenever profile is available, load orders
  useEffect(() => {
    if (profile) {
      loadOrdersFromStorage(profile);
    }
  }, [profile]);

  // ✅ listen to storage changes (if other tabs/pages update orders or cart)
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === ORDERS_KEY && profile) {
        loadOrdersFromStorage(profile);
      }
      if (e.key === CART_KEY) {
        updateCartCountFromStorage();
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [profile]);

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

      const loginTime = new Date().toISOString();

      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(profileData));
      localStorage.setItem(LAST_LOGIN_KEY, loginTime);

      setProfile(profileData);
      setLastLogin(loginTime);
      setCurrentView("account");
      setIsEditing(false);
      setSuccessMsg(
        `Welcome back, ${
          (profileData.name || "Friend").split(" ")[0]
        }! You’re logged in.`
      );

      // load orders for this user after login
      loadOrdersFromStorage(profileData);

      // ✅ refresh cart count as well (in case cart changed before login)
      updateCartCountFromStorage();

      if (redirectAfterAuth) {
        navigate(redirectAfterAuth, { replace: true });
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorMsg(err.message || "Login failed. Please try again.");
      setProfile(null);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(LAST_LOGIN_KEY);
      setLastLogin("");
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

      const loginTime = new Date().toISOString();

      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(profileData));
      localStorage.setItem(LAST_LOGIN_KEY, loginTime);

      setProfile(profileData);
      setLastLogin(loginTime);
      setCurrentView("account");
      setIsEditing(false);
      setSuccessMsg(
        `Account created successfully! Welcome, ${
          (profileData.name || "Friend").split(" ")[0]
        }.`
      );

      // load orders for this user after signup (likely empty at first)
      loadOrdersFromStorage(profileData);

      // ✅ refresh cart count as well
      updateCartCountFromStorage();

      if (redirectAfterAuth) {
        navigate(redirectAfterAuth, { replace: true });
      }
    } catch (err) {
      console.error("Signup error:", err);
      setErrorMsg(err.message || "Registration failed. Please try again.");
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(LAST_LOGIN_KEY);
      setProfile(null);
      setLastLogin("");
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
    localStorage.removeItem(LAST_LOGIN_KEY);
    setProfile(null);
    setCurrentView("login");
    setIsEditing(false);
    setOrders([]);
    setLastLogin("");
    // ✅ cart itself is not cleared, but count is refreshed
    updateCartCountFromStorage();
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
   *  DERIVED INFO
   * ======================= */

  // Orders lists
  const activeOrders = orders.filter(
    (o) => o && o.status && o.status.toLowerCase() !== "delivered"
  );
  const deliveredOrders = orders.filter(
    (o) => o && o.status && o.status.toLowerCase() === "delivered"
  );

  const totalOrders = orders.length;
  const totalActive = activeOrders.length;
  const totalDelivered = deliveredOrders.length;

  // Profile completion (for meter)
  let completionPercent = 0;
  let missingFields = [];
  let firstName = "Friend";

  if (profile) {
    const fields = [
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "phone", label: "Phone" },
      { key: "fullAddress", label: "Address" },
      { key: "city", label: "City" },
      { key: "pincode", label: "Pincode" },
    ];

    const filledCount = fields.reduce(
      (acc, f) => acc + (profile[f.key] ? 1 : 0),
      0
    );
    completionPercent =
      fields.length > 0 ? Math.round((filledCount / fields.length) * 100) : 0;
    missingFields = fields.filter((f) => !profile[f.key]).map((f) => f.label);

    if (profile.name) {
      firstName = profile.name.split(" ")[0];
    }
  }

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
            {/* profile summary chip with completion + last login */}
            <div className="profile-summary-chip mb-3">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="mb-1 profile-greeting">
                    Hi, <span>{firstName}</span> 👋
                  </p>
                  {lastLogin && (
                    <p className="small text-muted mb-0">
                      Last login: {formatDateTime(lastLogin)}
                    </p>
                  )}
                </div>
                <div className="text-end">
                  <span className="completion-label small">
                    Profile {completionPercent}% complete
                  </span>
                  <div className="completion-bar mt-1">
                    <div
                      className="completion-bar-fill"
                      style={{ width: `${completionPercent}%` }}
                    />
                  </div>
                  {missingFields.length > 0 && (
                    <p className="tiny-missing mt-1 mb-0">
                      Add: {missingFields.join(", ")}
                    </p>
                  )}
                </div>
              </div>
            </div>

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

            {/* Quick actions + cart info */}
            <div className="account-quick-actions mt-3">
              <p className="small text-muted mb-2">Quick actions</p>
              <div className="d-flex flex-wrap gap-2">
                <Link to="/shop" className="btn btn-light btn-sm">
                  Go to Shop
                </Link>
                <Link to="/cart" className="btn btn-light btn-sm">
                  View Cart
                </Link>
              </div>
              <p className="tiny-missing mt-2 mb-0">
                Cart right now:{" "}
                <strong>
                  {cartCount} {cartCount === 1 ? "item" : "items"}
                </strong>
              </p>
            </div>

            <div className="d-flex flex-wrap gap-2 mt-3">
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
      <div className="page-bg">
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
        <main className="main-content">
          {/* Scrapbook hero */}
          <section className="account-hero container">
            <span className="account-pill mb-2">
              Profile • Address • Checkout helper
            </span>
            <h1 className="h2 mt-2 mb-2 account-title dancing-script">
              Your cozy little account corner
            </h1>
            <p className="small mb-0 account-subtitle">
              Save your name and address once, and we’ll gently pre-fill them
              every time you order a scrapbook or sticker pack.
            </p>
          </section>

          {/* Form card + Orders box card */}
          <section className="container account-form-section my-4">
            <div className="row justify-content-center">
              <div className="col-lg-5 col-md-7">
                {/* Existing account/auth card */}
                <div className="card card-minimal p-4">
                  {errorMsg && (
                    <div className="alert alert-danger small mb-3">
                      {errorMsg}
                    </div>
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

                {/* Orders card, only on Account view */}
                {currentView === "account" && (
                  <div className="card card-minimal p-4 mt-3">
                    <div className="orders-box">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <div>
                          <h5 className="orders-title mb-1">Your Orders</h5>
                          <p className="text-muted small mb-0">
                            See everything you’ve ordered and what’s already
                            delivered.
                          </p>
                        </div>

                        {/* summary pills */}
                        <div className="orders-summary text-end">
                          <span className="orders-pill me-1">
                            Total: {totalOrders}
                          </span>
                          <span className="orders-pill active-pill me-1">
                            Active: {totalActive}
                          </span>
                          <span className="orders-pill delivered-pill">
                            Delivered: {totalDelivered}
                          </span>
                        </div>
                      </div>

                      {orders.length === 0 ? (
                        <div className="mt-3">
                          <p className="text-muted small mb-1">
                            You haven’t ordered anything yet.
                          </p>
                          <Link
                            to="/shop"
                            className="btn btn-primary btn-sm mt-1"
                          >
                            Start shopping
                          </Link>
                        </div>
                      ) : (
                        <>
                          {/* Active orders */}
                          {activeOrders.length > 0 && (
                            <>
                              <p className="orders-section-title small mb-1 mt-3">
                                Active orders
                              </p>
                              {activeOrders.map((order, index) => (
                                <div
                                  key={`active-${index}`}
                                  className="order-item"
                                >
                                  <div>
                                    <strong>
                                      Order #
                                      {order.id || order.orderId || index + 1}
                                    </strong>
                                    <p className="small text-muted mb-0">
                                      {order.date || order.createdAt || ""}
                                    </p>
                                    {Array.isArray(order.items) &&
                                      order.items.length > 0 && (
                                        <p className="small mb-0">
                                          {order.items
                                            .map(
                                              (it) =>
                                                `${
                                                  it.name || it.title || "Item"
                                                }${it.qty ? ` ×${it.qty}` : ""}`
                                            )
                                            .join(", ")}
                                        </p>
                                      )}
                                  </div>
                                  <span className="order-status">
                                    {order.status || "Ordered"}
                                  </span>
                                </div>
                              ))}
                            </>
                          )}

                          {/* Delivered orders */}
                          {deliveredOrders.length > 0 && (
                            <>
                              <p className="orders-section-title small mb-1 mt-3">
                                Delivered
                              </p>
                              {deliveredOrders.map((order, index) => (
                                <div
                                  key={`delivered-${index}`}
                                  className="order-item"
                                >
                                  <div>
                                    <strong>
                                      Order #
                                      {order.id || order.orderId || index + 1}
                                    </strong>
                                    <p className="small text-muted mb-0">
                                      {order.date || order.createdAt || ""}
                                    </p>
                                    {Array.isArray(order.items) &&
                                      order.items.length > 0 && (
                                        <p className="small mb-0">
                                          {order.items
                                            .map(
                                              (it) =>
                                                `${
                                                  it.name || it.title || "Item"
                                                }${it.qty ? ` ×${it.qty}` : ""}`
                                            )
                                            .join(", ")}
                                        </p>
                                      )}
                                  </div>
                                  <span className="order-status delivered">
                                    Delivered
                                  </span>
                                </div>
                              ))}
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="custom-footer py-4">
          <div className="footer-left">
            <h5 className="footer-title dancing-script mb-1">Path To Pages</h5>
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
            <a
              href="https://www.threads.net/pathtopages"
              className="footer-icon"
            >
              <SiThreads size={22} />
            </a>
          </div>

          <div className="footer-right">
            <p className="small footer-copy mb-0">
              © {new Date().getFullYear()} PathToPages
            </p>
          </div>
        </footer>
      </div>

      {/* Scrapbook account styles */}
      <style jsx="true">{`
        @import url("https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400..700&display=swap");
        @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap");

        .dancing-script {
          font-family: "Dancing Script", cursive;
          font-optical-sizing: auto;
          font-weight: 600;
          font-style: normal;
        }

        body {
          background-color: #fdf6ec;
          font-family: "Poppins", sans-serif;
          color: #3e2723;
        }

        .page-bg {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .main-content {
          flex: 1;
          padding-top: 110px;
          padding-bottom: 30px;
        }

        /* NAVBAR – scrapbook strip */
        .custom-navbar {
          background: #f3e3c9;
          border-bottom: 2px dashed #c49b6c;
          box-shadow: 0 4px 15px rgba(151, 107, 60, 0.25);
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
        }

        .brand-text {
          color: #6b4a2f;
          letter-spacing: 1px;
        }

        .nav-link-custom {
          color: #7b5533 !important;
          font-weight: 500;
          position: relative;
        }

        .nav-link-custom::after {
          content: "";
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          bottom: 0;
          width: 0;
          height: 2px;
          background: #f08c6a;
          border-radius: 999px;
          transition: width 0.2s ease;
        }

        .nav-link-custom:hover::after {
          width: 70%;
        }

        .navbar-toggler {
          border-color: #c49b6c;
        }

        .navbar-toggler-icon {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba(123,85,51,0.9)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
        }

        /* HERO – scrapbook header */
        .account-hero {
          position: relative;
          padding: 1.5rem 1.25rem;
          border-radius: 22px;
          background: radial-gradient(
            circle at top left,
            #ffe3c2 0,
            #fffdf8 40%,
            #f7ddc8 100%
          );
          box-shadow: 0 16px 30px rgba(141, 103, 64, 0.18);
          overflow: hidden;
        }

        .account-hero::before,
        .account-hero::after {
          content: "";
          position: absolute;
          width: 70px;
          height: 20px;
          background: rgba(255, 244, 210, 0.95);
          top: -12px;
          border-radius: 4px;
          box-shadow: 0 2px 6px rgba(136, 97, 63, 0.4);
        }

        .account-hero::before {
          left: 12%;
          transform: rotate(-8deg);
        }

        .account-hero::after {
          right: 14%;
          transform: rotate(7deg);
        }

        .account-pill {
          display: inline-block;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #b4764d;
          background: #fff7e7;
          padding: 0.3rem 0.9rem;
          border-radius: 999px;
          border: 1px dashed #e2a46b;
          font-size: 0.75rem;
        }

        .account-title {
          color: #5d4029;
          text-shadow: 0 2px 0 rgba(255, 255, 255, 0.7);
        }

        .account-subtitle {
          color: #7a5a3c;
          max-width: 640px;
        }

        /* CARD – notebook / paper look */
        .card-minimal {
          border-radius: 20px;
          border: none;
          box-shadow: 0 16px 30px rgba(141, 103, 64, 0.15);
          background-color: #fffdf8;
          position: relative;
          overflow: hidden;
        }

        .card-minimal::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: linear-gradient(
            to bottom,
            rgba(255, 223, 186, 0.45) 1px,
            transparent 1px
          );
          background-size: 100% 28px;
          opacity: 0.6;
          pointer-events: none;
        }

        .card-minimal > * {
          position: relative;
          z-index: 1;
        }

        .auth-form h3 {
          font-size: 1.35rem;
          font-weight: 600;
          color: #4a2e20;
        }

        .input-minimal {
          border-radius: 10px;
          border: 1px solid #ddd1c2;
          background-color: #fcf9f4;
          font-size: 0.95rem;
        }

        .input-minimal:focus {
          border-color: #c49a6c;
          box-shadow: 0 0 0 2px rgba(196, 154, 108, 0.25);
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

        .btn-light {
          border-radius: 999px;
          font-size: 0.9rem;
          background-color: #f8f4ee;
          border-color: #f0e5d8;
        }

        .btn-outline-secondary {
          border-radius: 999px;
          font-size: 0.85rem;
        }

        .btn-outline-danger {
          border-radius: 999px;
          font-size: 0.9rem;
        }

        .link-button {
          border: none;
          background: none;
          padding: 0;
          color: #7b5533;
          font-weight: 500;
          text-decoration: underline;
          cursor: pointer;
        }

        /* Account rows */
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

        /* profile summary chip */
        .profile-summary-chip {
          background: #fff5e2;
          border-radius: 14px;
          padding: 0.6rem 0.8rem;
          border: 1px dashed #e2a46b;
        }

        .profile-greeting {
          font-weight: 500;
          color: #5b3a25;
        }

        .profile-greeting span {
          color: #a35d48;
        }

        .completion-label {
          color: #8a7a6c;
        }

        .completion-bar {
          width: 150px;
          height: 6px;
          border-radius: 999px;
          background: #f2e2d1;
          overflow: hidden;
          margin-left: auto;
        }

        .completion-bar-fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #f08c6a, #f6b18b);
          transition: width 0.3s ease;
        }

        .tiny-missing {
          font-size: 0.7rem;
          color: #8a7a6c;
        }

        /* Quick actions */
        .account-quick-actions .btn.btn-light.btn-sm {
          padding-inline: 0.9rem;
        }

        /* Orders box styles */
        .orders-box {
          padding: 0.25rem;
        }

        .orders-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #5b3a25;
        }

        .orders-section-title {
          color: #8a7a6c;
        }

        .orders-summary {
          font-size: 0.75rem;
        }

        .orders-pill {
          display: inline-block;
          padding: 0.15rem 0.55rem;
          border-radius: 999px;
          background: #fffaf3;
          border: 1px dashed #e2a46b;
          color: #7b5533;
        }

        .orders-pill.active-pill {
          background: #ffe9d1;
        }

        .orders-pill.delivered-pill {
          background: #e1f6d5;
          border-color: #9ac58b;
        }

        .order-item {
          display: flex;
          justify-content: space-between;
          background: #ffffff;
          border-radius: 12px;
          padding: 0.8rem;
          margin-top: 0.7rem;
          border: 1px solid #f0e3d3;
        }

        .order-status {
          background: #ffe3c2;
          padding: 0.3rem 0.8rem;
          border-radius: 999px;
          font-size: 0.8rem;
          color: #6b4a2f;
          align-self: center;
          white-space: nowrap;
        }

        .order-status.delivered {
          background: #d9f7c8;
          color: #3e6b2b;
        }

        /* FOOTER – scrapbook strip */
        .custom-footer {
          background: #f3e3c9;
          border-top: 2px dashed #c49b6c;
          color: #7b5533;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          padding-inline: 2rem;
          position: relative;
          margin-top: 40px;
        }

        .custom-footer::before,
        .custom-footer::after {
          content: "";
          position: absolute;
          width: 70px;
          height: 22px;
          background: #ffeccd;
          top: -10px;
          border-radius: 4px;
          border: 1px solid #d1b38f;
        }

        .custom-footer::before {
          left: 10%;
          transform: rotate(-4deg);
        }

        .custom-footer::after {
          right: 12%;
          transform: rotate(5deg);
        }

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

        .footer-title {
          color: #5b3a25;
          font-size: 1.6rem;
        }

        .footer-icon {
          color: #7b5533;
          transition: 0.3s ease;
        }

        .footer-icon:hover {
          transform: translateY(-2px) scale(1.05);
          color: #f08c6a;
        }

        .footer-copy {
          color: #7b5533;
          opacity: 0.85;
        }

        /* Mobile */
        @media (max-width: 768px) {
          .main-content {
            padding-top: 100px;
          }

          .account-hero {
            margin-inline: 0.25rem;
          }

          .custom-footer {
            flex-direction: column;
            text-align: center;
            padding: 2rem 1rem;
          }

          .footer-left,
          .footer-right {
            align-items: center;
          }

          .completion-bar {
            width: 120px;
          }
        }
      `}</style>
    </>
  );
};

export default Myaccount;
