// src/components/Myaccount.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom"; // ✅ real router Link
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import { SiThreads } from "react-icons/si";
/* ---------------- API BASE ---------------- */

// IMPORTANT: This matches your backend:
// https://pathtopages.onrender.com/api/v1/auth/...
const API_BASE_URL = "https://pathtopages.onrender.com/api/v1/auth";
const TOKEN_KEY = "ptp_auth_token";
const USER_KEY = "ptp_user";

/* ---------------- Auth Layout & Forms ---------------- */

const AuthLayout = ({
  title,
  children,
  switchView,
  switchText,
  switchAction,
}) => (
  <div className="auth-container">
    <div className="auth-card">
      <h2 className="happy-monkey-regular mb-4 auth-title">{title}</h2>
      {children}
      <p className="mt-4 text-center text-muted small">
        {switchText}
        <button className="btn-link ms-1 p-0 fw-bold" onClick={switchView}>
          {switchAction}
        </button>
      </p>
    </div>
  </div>
);

/* ---------- LOGIN: token check by email ---------- */

const LoginForm = ({ setCurrentView, setProfile, showNotification }) => {
  const [formData, setFormData] = useState({ email: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    showNotification("Attempting to retrieve session token...");

    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          // backend may still accept password, but here we do token-based login
          password: "",
        }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || result.message || "Login failed");
      }

      // ✅ store token
      localStorage.setItem(TOKEN_KEY, result.token);

      const user = result.data || result.user || {};
      const profileData = {
        name: user.name || "",
        email: user.email || formData.email,
        phone: user.mobile || user.phone || "",
      };

      // ✅ store user profile as well
      localStorage.setItem(USER_KEY, JSON.stringify(profileData));

      setProfile(profileData);
      setCurrentView("account");
      showNotification(
        `Access granted via token check. Welcome, ${
          (profileData.name || "Friend").split(" ")[0]
        }!`
      );
    } catch (err) {
      console.error("Login error:", err);
      showNotification(err.message || "Network error during token check.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Sign In (Token Check)"
      switchView={() => setCurrentView("signup")}
      switchText="No token found? Try"
      switchAction="Sign Up"
    >
      <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
        <p className="text-muted small text-center">
          Enter your registered email to check for a valid session token.
        </p>

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          className="form-control edit-input"
          required
        />

        <button type="submit" className="btn save-btn mt-3" disabled={loading}>
          {loading ? "Checking Token..." : "Check Session Token"}
        </button>
      </form>
    </AuthLayout>
  );
};

/* ---------- SIGNUP: matches backend required fields ---------- */

const SignupForm = ({ setCurrentView, setProfile, showNotification }) => {
  // backend expects name, mobile, email, fullAddress, password
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    fullAddress: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    showNotification("Registering new account...");

    try {
      const res = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData), // send all five fields
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(
          result.error || result.message || "Network error during registration."
        );
      }

      // ✅ token from backend
      localStorage.setItem(TOKEN_KEY, result.token);

      const user = result.data || result.user || {};
      const profileData = {
        name: user.name || formData.name,
        email: user.email || formData.email,
        phone: user.mobile || user.phone || formData.mobile,
      };

      // ✅ store profile
      localStorage.setItem(USER_KEY, JSON.stringify(profileData));

      setProfile(profileData);
      setCurrentView("account");
      showNotification(
        `Account created successfully! Welcome, ${
          (profileData.name || "Friend").split(" ")[0]
        }!`
      );
    } catch (err) {
      console.error("Register error:", err);
      showNotification(err.message || "Network error during registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      switchView={() => setCurrentView("login")}
      switchText="Already have an account? Access via"
      switchAction="Token Check"
    >
      <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="form-control edit-input"
          required
        />
        <input
          type="tel"
          name="mobile"
          placeholder="Mobile Number"
          value={formData.mobile}
          onChange={handleChange}
          className="form-control edit-input"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          className="form-control edit-input"
          required
        />
        <textarea
          name="fullAddress"
          placeholder="Full Address (Street, City, State)"
          value={formData.fullAddress}
          onChange={handleChange}
          className="form-control edit-input"
          rows="2"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password (required for registration)"
          value={formData.password}
          onChange={handleChange}
          className="form-control edit-input"
          minLength="6"
          required
        />
        <button type="submit" className="btn save-btn mt-3" disabled={loading}>
          {loading ? "Registering..." : "Sign Up"}
        </button>
      </form>
    </AuthLayout>
  );
};

/* ---------------- Inline Icons ---------------- */

const WhatsappIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
    <path
      d="M380.9 97.1C339.4 55.4 283.6 32 223.8 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-31c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 222-99.6 222-222 0-59.7-22.4-115.6-64-157.1zM223.8 456.7l-.1-.1c-34.4 0-68.4-9.3-97.7-27l-5.6-3.1L32.2 417l36.6-108.2 5.3-8.8c-17.7-32.9-27.1-70.8-27.1-111.4 0-101.4 82.3-183.8 183.8-183.8 50 0 97.4 19.5 133.1 55.3 36.8 36.3 56.6 84.8 56.6 136.6-.1 101.4-82.3 183.8-183.8 183.8zM368.4 345.2c-2.9-1.5-17.3-8.4-19.8-9.3-2.5-.9-4.5-1.4-6.4 1.4-1.9 2.8-7.4 9.3-9.1 11.2-1.8 2-3.5 2.2-6.2.6-2.5-1.5-10.6-3.9-20.5-12.7-7.7-6.8-12.9-15.3-14.4-17.8-1.4-2.5-.1-3.9 1.2-5.1 1.1-1.1 2.5-2.8 3.5-4.1.9-1.3 1.2-2.3.9-4-1.3-3.3-6.4-16.1-8.7-22.1-2.4-6-4.9-5.1-6.4-5.4-1.4-.2-3.1-.2-4.8-.2s-3.5.5-5.3 2.5c-1.9 2-7.4 7.4-7.4 18s7.6 20.7 8.6 22.1c1 1.4 15 23.3 36.4 32.2 16.9 7.1 31.5 8.1 42.4 5.4 10.7-2.7 17.3-11.4 19.8-17.5 2.5-6.1 2.5-11.3 1.8-12.7-1.4-1.5-5.3-2.3-11.4-5.6z"
      fill="currentColor"
    />
  </svg>
);

const InstagramIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
    <path
      d="M224.1 184.6c-5.8 0-10.5 4.7-10.5 10.5v193.3c0 5.8 4.7 10.5 10.5 10.5s10.5-4.7 10.5-10.5V195.1c0-5.8-4.7-10.5-10.5-10.5zm0-101.9c-70 0-127 57-127 127s57 127 127 127 127-57 127-127-57-127-127-127zm.1 199.1c-39.7 0-71.9-32.2-71.9-71.9s32.2-71.9 71.9-71.9 71.9 32.2 71.9 71.9-32.2 71.9-71.9 71.9zM380.9 97.1c-21.4-21.3-51.4-32.5-84.5-32.5H151.6c-33.1 0-63.1 11.2-84.5 32.5C45.8 118.4 34.6 148.4 34.6 181.5v185.1c0 33.1 11.2 63.1 32.5 84.5 21.3 21.4 51.4 32.5 84.5 32.5h144.7c33.1 0 63.1-11.2 84.5-32.5 21.4-21.3 32.5-51.4 32.5-84.5V181.5c0-33.1-11.2-63.1-32.5-84.5zM358 151.8a21.9 21.9 0 1 1-43.8 0 21.9 21.9 0 1 1 43.8 0z"
      fill="currentColor"
    />
  </svg>
);

const ThreadsIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
    <path
      d="M304 48c0-26.5-21.5-48-48-48s-48 21.5-48 48v88H48c-26.5 0-48 21.5-48 48s21.5 48 48 48h48v32H48c-26.5 0-48 21.5-48 48s21.5 48 48 48h48v88c0 26.5 21.5 48 48 48s48-21.5 48-48v-88h96c26.5 0 48-21.5 48-48s-21.5-48-48-48H256v-32h96c26.5 0 48-21.5 48-48s-21.5-48-48-48H256V48zm-80 304v-96h96v96H224z"
      fill="currentColor"
    />
  </svg>
);

/* ---------------- Edit Profile & Modals ---------------- */

const EditProfileForm = ({
  editableProfile,
  setEditableProfile,
  setIsEditing,
  setProfile,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setProfile(editableProfile);
    setIsEditing(false);
    console.log("Profile saved:", editableProfile);
    if (window.anime) {
      window.anime({
        targets: ".save-btn",
        scale: [1, 1.05, 1],
        duration: 500,
        easing: "easeInOutQuad",
      });
    }
  };

  return (
    <div className="d-flex flex-column gap-3">
      <input
        type="text"
        name="name"
        value={editableProfile.name}
        onChange={handleChange}
        className="form-control edit-input"
        placeholder="Full Name"
      />
      <input
        type="email"
        name="email"
        value={editableProfile.email}
        onChange={handleChange}
        className="form-control edit-input"
        placeholder="Email Address"
        disabled
      />
      <input
        type="tel"
        name="phone"
        value={editableProfile.phone}
        onChange={handleChange}
        className="form-control edit-input"
        placeholder="Phone Number"
      />
      <button className="btn save-btn mt-2" onClick={handleSave}>
        Save Changes
      </button>
    </div>
  );
};

const AddressModal = ({ isOpen, onClose }) => {
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    pincode: "",
    landmark: "",
    fullAddress: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const alert = (message) => {
    console.warn("Using mock window.alert:", message);
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Saving new address:", address);
    alert("Address saved successfully! (Mock save)");
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="happy-monkey-regular modal-title mb-0">
            Add New Address
          </h5>
          <button className="btn-close" onClick={onClose}></button>
        </div>
        <form onSubmit={handleSubmit} className="d-flex flex-column form-gap">
          <input
            type="text"
            name="name"
            placeholder="Recipient Name"
            value={address.name}
            onChange={handleChange}
            className="form-control edit-input"
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={address.phone}
            onChange={handleChange}
            className="form-control edit-input"
            required
          />
          <div className="d-flex gap-3">
            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              value={address.pincode}
              onChange={handleChange}
              className="form-control edit-input"
              required
            />
            <input
              type="text"
              name="landmark"
              placeholder="Landmark (Optional)"
              value={address.landmark}
              onChange={handleChange}
              className="form-control edit-input"
            />
          </div>
          <textarea
            name="fullAddress"
            placeholder="Full Address (Street, City, State)"
            value={address.fullAddress}
            onChange={handleChange}
            className="form-control edit-input"
            rows="3"
            required
          />
          <button type="submit" className="btn save-btn mt-3">
            Save Address
          </button>
        </form>
      </div>
    </div>
  );
};

const PaymentModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="d-flex justify-content-end">
          <button className="btn-close" onClick={onClose}></button>
        </div>
        <h5
          className="happy-monkey-regular modal-title mb-3"
          style={{ color: "#d39e00" }}
        >
          Payment Options
        </h5>
        <div className="p-4 bg-warning-subtle rounded-3 border border-warning">
          <p className="lead fw-bold mb-2 text-warning-emphasis">
            Debit/Credit Card Options
          </p>
          <p className="mb-0 text-muted">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="me-1 text-warning-emphasis"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 8v4l3 3"></path>
            </svg>
            We are currently integrating secure payment gateways.
          </p>
          <p className="fw-semibold text-warning-emphasis mt-2">
            ✨ Coming Soon! ✨
          </p>
        </div>
        <button className="btn mt-4" onClick={onClose}>
          Got It
        </button>
      </div>
    </div>
  );
};

/* ---------------- Main Component ---------------- */

const Myaccount = () => {
  const navbarRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [currentView, setCurrentView] = useState("loading");
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editableProfile, setEditableProfile] = useState(profile);
  const [notification, setNotification] = useState(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const cardRefs = useRef([]);
  cardRefs.current = [];
  const addToRefs = (el) => {
    if (el && !cardRefs.current.includes(el)) {
      cardRefs.current.push(el);
    }
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  useEffect(() => {
    setEditableProfile(profile);
  }, [profile]);

  // Initial token check - DO NOT auto-logout; only trust localStorage
  useEffect(() => {
    // mock confirm/alert for environments that don't have them
    if (!window.confirm) {
      window.confirm = (msg) => {
        console.warn("Using mock window.confirm:", msg);
        return true;
      };
    }
    if (!window.alert) {
      window.alert = (msg) => {
        console.warn("Using mock window.alert:", msg);
      };
    }

    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      // no token => not logged in
      setCurrentView("login");
      return;
    }

    // token exists -> treat as logged in
    const savedUser = localStorage.getItem(USER_KEY);
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setProfile({
          name: parsed.name || "",
          email: parsed.email || "",
          phone: parsed.phone || "",
        });
      } catch (e) {
        console.warn("Failed to parse saved user", e);
      }
    }

    setCurrentView("account");

    // Optional: refresh profile from backend, but NEVER auto-logout here
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await res.json();

        if (res.ok && result.success) {
          const user = result.data || result.user || {};
          const refreshedProfile = {
            name: user.name || "",
            email: user.email || "",
            phone: user.mobile || user.phone || "",
          };
          setProfile(refreshedProfile);
          localStorage.setItem(USER_KEY, JSON.stringify(refreshedProfile));
        } else {
          console.warn("Profile refresh failed, keeping saved user.");
        }
      } catch (err) {
        console.error("Token check error (ignored):", err);
      }
    })();
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY); // clear saved profile
      setProfile({ name: "", email: "", phone: "" });
      setCurrentView("login");
      showNotification("You have successfully logged out.");
    }
  };

  // GSAP animation for account cards
 useEffect(() => {
   if (
     currentView === "account" &&
     window.gsap &&
     cardRefs.current.length > 0
   ) {
     window.gsap.set(cardRefs.current, { clearProps: "all" });

     // ✅ correct
     window.gsap.from(cardRefs.current, {
       y: 30,
       opacity: 0,
       scale: 0.98,
       stagger: 0.1,
       duration: 0.8,
       ease: "power3.out",
       delay: 0.3,
     });
   }
 }, [currentView]);


  const Styles = (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Caveat+Brush&family=Caveat:wght@400;700&family=Happy+Monkey&family=Inter:wght@400;600;700&display=swap');

      body, html {
        font-family: 'Inter', sans-serif;
      }

      .happy-monkey-regular {
        font-family: 'Happy Monkey', cursive;
      }
      .navbar {
        background: #7a5c4d
          url("https://www.transparenttextures.com/patterns/leather.png");
        border-bottom: 3px dashed #f8ead8;
        box-shadow: 0 4px 15px rgba(58, 37, 18, 0.3);
      }
      .navbar-brand span {
        font-family: 'Caveat', cursive;
        color: #fff8f0;
        letter-spacing: 1.5px;
      }
      .nav-link {
        color: #f8ead8 !important;
        font-weight: 500;
        transition: 0.3s;
      }
      .nav-link:hover {
        color: #ffe6b3 !important;
      }
      .navbar-toggler {
        border-color: #f8ead8 !important;
      }

      .app-content {
        background-color: #fdf8f3;
        min-height: 100vh;
        padding-bottom: 20px;
        font-family: 'Inter', sans-serif;
      }

      .auth-container {
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
        background-color: #fdf8f3;
      }
      .auth-card {
        background: #fff8f0;
        border: 2px solid #d8b98a;
        border-radius: 12px;
        padding: 30px;
        box-shadow: 0 8px 15px rgba(0,0,0,0.1);
        width: 100%;
        max-width: 400px;
      }
      .auth-title {
        color: #5a3b1c !important;
        text-align: center;
        font-size: 2rem;
        border-bottom: 2px dotted #e0d0b0;
        padding-bottom: 10px;
      }
      .btn-link {
        color: #7a5c4d !important;
        background: none !important;
        border: none !important;
        text-decoration: underline !important;
      }
      .btn-link:hover {
        color: #5a3b1c !important;
      }

      .glass-card {
        background: #fff8f0;
        border: 2px dashed #d8b98a;
        border-radius: 14px;
        box-shadow: 3px 4px 0 #c9a87a;
        transition: box-shadow 0.18s ease;
      }
      .glass-card:hover {
        box-shadow: 5px 7px 0 #b79160;
      }
      .glass-card h5 {
        font-family: 'Caveat Brush', cursive;
        color: #5a3b1c;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px dotted #d8b98a;
      }
      .detail-item {
        margin-bottom: 0.5rem;
        color: #4a3822;
      }

      .edit-input {
        border: 1px solid #d8b98a;
        border-radius: 6px;
        padding: 8px;
        background-color: #fcf6ef;
        color: #4a3822;
        transition: border-color 0.2s;
      }
      .edit-input:focus {
        border-color: #7a5c4d;
        box-shadow: 0 0 0 0.1rem rgba(122, 92, 77, 0.25);
        outline: none;
      }

      .btn {
        border: 2px dashed #a67c52 !important;
        background: #f3ddc1 !important;
        color: #4a3822 !important;
        border-radius: 8px !important;
        padding: 6px 14px !important;
        font-size: 0.95rem !important;
        transition: all 0.2s ease;
      }
      .btn:hover {
        background: #e5caa3 !important;
      }
      .logout-btn {
        font-weight: bold;
      }
      .save-btn {
        background: #a67c52 !important;
        color: #fff8f0 !important;
        border-color: #4a3822 !important;
      }
      .save-btn:hover {
        background: #7a5c4d !important;
      }

      .glass-footer {
        background: #7a5c4d
          url("https://www.transparenttextures.com/patterns/paper-1.png");
        color: #fdf8f3;
        border-top: 3px dashed #f8ead8;
        position:relative;
        margin-top:240px;
      }
      .footer-title h4 {
        font-family: 'Caveat Brush', cursive;
        color: #ffe6b3;
        text-shadow: 1px 1px 0 #4d3b2b;
      }
      .footer-link {
        color: #fceac7;
        text-decoration: none;
        transition: color 0.3s ease, transform 0.2s ease;
      }
      .footer-link:hover {
        color: #ffe6b3;
        transform: translateY(-2px);
      }
      .social-icons a {
        font-size: 1.5rem;
        margin-left: 0.9rem;
        color: #ffe6b3;
        transition: all 0.3s ease;
      }
      .social-icons a:hover {
        color: #fff;
        transform: scale(1.15);
      }

      .notification-toast {
        position: fixed;
        bottom: 65px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 1050;
        background-color: #5a3b1c;
        color: #fff8f0;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        font-weight: 500;
        min-width: 250px;
        text-align: center;
        transition: opacity 0.3s ease-in-out;
      }
      .notification-toast .btn-close {
        filter: invert(1);
        opacity: 0.8;
        margin-left: 10px;
      }

      .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(90, 59, 28, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1060;
        padding: 20px;
      }
      .modal-content {
        background: #f8eac7;
        border: 4px solid #966f3f;
        border-radius: 16px;
        padding: 40px;
        max-width: 90%;
        width: 500px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
        position: relative;
        animation: fadeInScale 0.3s ease-out;
      }
      .form-gap {
        gap: 1.25rem;
      }
      .modal-title {
        color: #7a5c4d !important;
        font-size: 1.65rem;
      }

      @media (max-width: 576px) {
        .modal-content {
          padding: 20px;
        }
        .modal-content .btn-close {
          position: absolute;
          top: 10px;
          right: 10px;
        }
      }

      @keyframes fadeInScale {
        from {
          opacity: 0;
          transform: scale(0.9);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
    `}</style>
  );

  const Toast = notification && (
    <div className="notification-toast">
      <div className="d-flex align-items-center justify-content-between">
        <span className="me-3">{notification}</span>
        <button
          className="btn-close"
          onClick={() => setNotification(null)}
          aria-label="Close"
        ></button>
      </div>
    </div>
  );

  if (currentView === "loading") {
    return (
      <>
        {Styles}
        <div className="d-flex justify-content-center align-items-center min-vh-100 app-content">
          <div
            className="spinner-border"
            role="status"
            style={{
              color: "#7A5C4D",
              width: "3rem",
              height: "3rem",
            }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="ms-3 text-gray-700 fw-bold">Checking session...</p>
        </div>
        {Toast}
      </>
    );
  }

  if (currentView === "login") {
    return (
      <>
        {Styles}
        <LoginForm
          setCurrentView={setCurrentView}
          setProfile={setProfile}
          showNotification={showNotification}
        />
        {Toast}
      </>
    );
  }

  if (currentView === "signup") {
    return (
      <>
        {Styles}
        <SignupForm
          setCurrentView={setCurrentView}
          setProfile={setProfile}
          showNotification={showNotification}
        />
        {Toast}
      </>
    );
  }

  const accountCards = [
    {
      title: "Account Details",
      id: "account-details",
      content: isEditing ? (
        <EditProfileForm
          editableProfile={editableProfile}
          setEditableProfile={setEditableProfile}
          setIsEditing={setIsEditing}
          setProfile={setProfile}
        />
      ) : (
        <>
          <div className="detail-item">
            <strong>Name:</strong> <span>{profile.name}</span>
          </div>
          <div className="detail-item">
            <strong>Email:</strong> <span>{profile.email}</span>
          </div>
          <div className="detail-item">
            <strong>Phone:</strong> <span>{profile.phone}</span>
          </div>
        </>
      ),
      buttonText: isEditing ? "Cancel" : "Edit",
      buttonAction: () => setIsEditing(!isEditing),
    },
    {
      title: "Addresses",
      id: "addresses",
      content: (
        <p className="text-muted mb-0 small">
          Manage your shipping addresses here (static placeholder).
        </p>
      ),
      buttonText: "Manage",
      buttonAction: () => setIsAddressModalOpen(true),
    },
    {
      title: "Payment Methods",
      id: "payment-methods",
      content: (
        <>
          <p className="text-muted small mb-2">No saved payment methods.</p>
          <div className="d-flex align-items-center small text-success">
            <svg
              className="me-1"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M8 12l2.646 2.646a.5.5 0 00.708 0L16 9"></path>
            </svg>
            <span>Securely stored with AES-256 encryption (mock).</span>
          </div>
        </>
      ),
      buttonText: "Add New",
      buttonAction: () => setIsPaymentModalOpen(true),
    },
    {
      title: "My Coupons",
      id: "coupons",
      content: (
        <>
          <p className="fw-bold text-success mb-2">
            You have 3 active coupons!
          </p>
          <span className="text-muted small">
            Redeem your codes like 'BOOKWORM20' before they expire.
          </span>
        </>
      ),
      buttonText: "Redeem",
      buttonAction: () =>
        showNotification(
          "Coupon redemption module opened! (Mock action successful!)"
        ),
    },
    {
      title: "Orders",
      id: "orders",
      content: (
        <p className="text-muted mb-0 small">
          Your order history will appear here. Last order: #PTP-1004
          (Processing).
        </p>
      ),
      buttonText: "View History",
      buttonAction: () =>
        showNotification(
          "Fetching detailed order history... (Mock action successful!)"
        ),
    },
  ];

  return (
    <>
      {Styles}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" />
      <script src="https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.2/anime.min.js" />

      <nav
        ref={navbarRef}
        className="navbar navbar-expand-lg fixed-top glass-navbar py-2 px-3"
      >
        <div className="container-fluid">
         <Link to="/" className="navbar-brand d-flex align-items-center">
                     <img
                       src={process.env.PUBLIC_URL + "/logo.png"}
                       alt="Logo"
                       height="40"
                     />
         
                     <span className="happy-monkey-regular ms-2 fs-4 fw-bold text-white">
                       PathToPages
                     </span>
                   </Link>

          <button
            className="navbar-toggler"
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`}
          >
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 text-white">
              <li className="nav-item">
                <Link to="/" className="nav-link text-white">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/shop" className="nav-link text-white">
                  Shop
                </Link>
              </li>
           
              <li className="nav-item">
                <Link to="/profile" className="nav-link text-white active">
                  Profile
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="app-content" style={{ paddingTop: 80 }}>
        <main className="container">
          <div className="logout-container mt-3 d-flex justify-content-end">
            <button className="btn logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>

          <h1
            className="happy-monkey-regular text-center mb-4"
            style={{ color: "#5a3b1c" }}
          >
            My Account Dashboard
          </h1>

          <div
            className="account-grid mt-4"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
              gap: "1.25rem",
              maxWidth: 1200,
              margin: "0 auto 40px",
            }}
          >
            {accountCards.map((card) => (
              <div key={card.id} className="glass-card p-4" ref={addToRefs}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="happy-monkey-regular mb-0">{card.title}</h5>
                  <button className="btn btn-sm" onClick={card.buttonAction}>
                    {card.buttonText}
                  </button>
                </div>
                {card.content}
              </div>
            ))}
          </div>
        </main>

        <AddressModal
          isOpen={isAddressModalOpen}
          onClose={() => setIsAddressModalOpen(false)}
        />
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
        />

         <footer className="glass-footer d-flex flex-column flex-md-row align-items-center justify-content-between px-4 py-5 text-center text-md-start">
                <div className="footer-title mb-4 mb-md-0">
                  <h4 className="happy-monkey-regular mb-1">Path To Pages</h4>
                  <span className="happy-monkey-regular small">
                    Designed by Nithish
                  </span>
                </div>
        
                <div className="quick-links mb-4 mb-md-0">
                  <h6 className="mb-3">Quick Links</h6>
                  <ul className="list-unstyled d-flex flex-wrap justify-content-center justify-content-md-start gap-3">
                    <li>
                      <Link to="/" className="footer-link">
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link to="/shop" className="footer-link">
                        Shop
                      </Link>
                    </li>
                    <li>
                      <Link to="/profile" className="footer-link">
                        Profile
                      </Link>
                    </li>
                  </ul>
                </div>
        
                <div className="social-icons d-flex justify-content-center">
                  <a
                    href="https://wa.me/918019418800"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaWhatsapp />
                  </a>
                  <a
                    href="https://www.instagram.com/pathtopages"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaInstagram />
                  </a>
                  <a
                    href="https://www.threads.net/pathtopages"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <SiThreads />
                  </a>
                </div>
              </footer>
      </div>

      {Toast}
    </>
  );
};

export default Myaccount;
