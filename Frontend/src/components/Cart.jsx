// src/Cart.jsx

import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import { SiThreads } from "react-icons/si";

const CART_KEY = "pathtopages_cart";

const Cart = () => {
  const navbarRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  // ===== LOAD CART FROM LOCALSTORAGE =====
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      setCartItems(Array.isArray(parsed) ? parsed : []);
    } catch (err) {
      console.error("Error reading cart from localStorage:", err);
      setCartItems([]);
    }
  }, []);

  // ===== SAVE CART TO LOCALSTORAGE =====
  const saveCart = (items) => {
    setCartItems(items);
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch (err) {
      console.error("Error saving cart to localStorage:", err);
    }
  };

  // ===== UPDATE QUANTITY =====
  const updateQuantity = (productId, qty) => {
    const newQty = Math.max(1, qty || 1);
    const updated = cartItems.map((item) =>
      item.id === productId ? { ...item, quantity: newQty } : item
    );
    saveCart(updated);
  };

  // ===== REMOVE ITEM =====
  const removeItem = (productId) => {
    const updated = cartItems.filter((item) => item.id !== productId);
    saveCart(updated);
  };

  const totalPrice = cartItems.reduce(
    (sum, item) =>
      sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
    0
  );

  const handleCheckout = () => {
    // go to your checkout route (or change to whatever you use)
    navigate("/checkout");
  };

  return (
    <>
      <div
        className="cart-app-layout"
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          background: "#fdf8f3",
        }}
      >
        {/* ===== NAVBAR ===== */}
        <nav
          ref={navbarRef}
          className="navbar navbar-expand-lg fixed-top glass-navbar p-3"
          style={{ transition: "background-color 0.3s ease" }}
        >
          <div className="container-fluid">
            <Link to="/" className="navbar-brand d-flex align-items-center">
              <img
                src={process.env.PUBLIC_URL + "/logo.png"}
                alt="Logo"
                height="40"
              />
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
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link to="/" className="nav-link">
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/shop" className="nav-link">
                    Shop
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/cart" className="nav-link active">
                    Cart
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/profile" className="nav-link">
                    Profile
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* ===== MAIN CONTENT ===== */}
        <main
          className="container cart-main-content flex-grow-1 py-5"
          style={{
            marginTop: "90px",
            marginBottom: "24px",
            minHeight: "280px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h1 className="mb-4">Shopping Cart</h1>

          {cartItems.length === 0 ? (
            <div
              style={{
                width: "100%",
                minHeight: "160px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.15rem",
                color: "#666",
              }}
            >
              Your cart is empty.
            </div>
          ) : (
            <div
              className="glass-card p-4"
              style={{ width: "100%", maxWidth: "650px" }}
            >
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="d-flex align-items-center mb-3 border-bottom pb-3"
                >
                  <img
                    src={
                      item.image || process.env.PUBLIC_URL + "/placeholder.png"
                    }
                    alt={item.title}
                    width="80"
                    height="80"
                    className="me-3 rounded"
                    style={{ objectFit: "cover", background: "#ececec" }}
                  />
                  <div className="flex-grow-1">
                    <h5 className="mb-2">{item.title}</h5>
                    <div className="d-flex align-items-center gap-3 mt-2">
                      <label
                        htmlFor={`qty-${item.id}`}
                        className="form-label mb-0"
                      >
                        Quantity:
                      </label>
                      <input
                        id={`qty-${item.id}`}
                        type="number"
                        className="form-control"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(
                            item.id,
                            parseInt(e.target.value, 10) || 1
                          )
                        }
                        style={{ width: "90px", background: "#fafafa" }}
                      />
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => removeItem(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div
                    className="ms-3 fw-bold"
                    style={{ minWidth: 80, textAlign: "right" }}
                  >
                    ₹
                    {(Number(item.price) * Number(item.quantity || 0)).toFixed(
                      2
                    )}
                  </div>
                </div>
              ))}

              <hr />
              <h4 className="d-flex justify-content-end mt-2">
                Total: ₹{totalPrice.toFixed(2)}
              </h4>
              <button
                className="btn btn-primary mt-3 float-end"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </main>

        {/* ===== FOOTER ===== */}
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

      {/* ===== PAGE-SPECIFIC STYLES ===== */}
      <style jsx="true">{`
        :root {
          --primary-color: #7a5c4d;
          --primary-hover: #5e4435;
          --secondary-color: #f4e5d0;
          --text-color: #4a3b2a;
          --text-secondary: #6e5844;
          --background: #fdf8f3;
          --surface: #fffaf5;
          --border: #e3c9a7;
          --shadow-sm: 2px 3px 0 #d4b48b;
          --shadow-md: 4px 6px 0 #c49a6c;
          --radius-base: 10px;
          --radius-lg: 16px;
        }

        body {
          background-color: var(--background);
          color: var(--text-color);
          font-family: "Poppins", sans-serif;
        }

        .glass-navbar {
          background: var(--primary-color)
            url("https://www.transparenttextures.com/patterns/leather.png");
          color: #f8ead8;
          border-bottom: 3px dashed #f6e0c6;
          box-shadow: 0 4px 15px rgba(58, 37, 18, 0.3);
        }

        .navbar .nav-link,
        .navbar .navbar-brand {
          color: #f8ead8 !important;
          font-weight: 500;
        }

        .navbar .nav-link.active {
          font-weight: 600;
          color: #ffe6b3 !important;
        }

        .navbar .nav-link:hover {
          color: #ffe6b3 !important;
        }

        .glass-card {
          background: var(--surface);
          border: 2px dashed var(--border);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
          padding: 24px;
        }

        .glass-card img {
          border-radius: 10px;
          object-fit: cover;
          background: #fdf8f3;
        }

        input[type="number"] {
          background: #fff8f0;
          border: 1px dashed var(--border);
          border-radius: 6px;
          padding: 4px 8px;
          color: var(--text-color);
          width: 80px;
        }

        .btn-outline-danger.btn-sm {
          border-style: dashed;
          border-radius: var(--radius-base);
        }

        .glass-footer {
          background: var(--primary-color)
            url("https://www.transparenttextures.com/patterns/paper-1.png");
          color: #fdf8f3;
          border-top: 3px dashed #f8ead8;
          padding: 60px 24px 20px;
        }

        .footer-title h4 {
          font-family: "Caveat Brush", cursive;
          color: #ffe6b3;
          text-shadow: 1px 1px 0 #4d3b2b;
        }

        .footer-link {
          color: #fceac7;
          text-decoration: none;
        }

        .footer-link:hover {
          color: #ffe6b3;
          transform: translateY(-2px);
        }

        .social-icons a {
          font-size: 1.7rem;
          margin-left: 1rem;
          color: #ffe6b3;
          transition: all 0.3s ease;
        }

        .social-icons a:hover {
          color: #fff;
          transform: scale(1.2);
        }

        @media (max-width: 768px) {
          .cart-main-content {
            padding: 20px;
          }
          .glass-card {
            padding: 16px;
          }
          input[type="number"] {
            width: 60px;
          }
        }
      `}</style>
    </>
  );
};

export default Cart;
