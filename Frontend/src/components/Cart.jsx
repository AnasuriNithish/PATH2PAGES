/* Cart.jsx */
/* eslint-disable react/jsx-no-undef */
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  getCart,
  updateCartItem,
  removeFromCart,
  addToCart,
} from "../services/api_service";
import { jwtDecode } from "jwt-decode";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import { SiThreads } from "react-icons/si";

const Cart = () => {
  const navbarRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [addProductId, setAddProductId] = useState("");
  const [addProductQty, setAddProductQty] = useState(1);

  // Hardcoded test userId (ok for local testing). Remove/replace before production.
  const [userId, setUserId] = useState("6906fc0a502d8f37d2146823");
  const navigate = useNavigate();

  // ===== AUTH / TOKEN HANDLING =====
  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      // If no token & no fallback test user -> go login
      if (!userId) {
        navigate("/login");
      }
      return;
    }

    try {
      const decoded = jwtDecode(token);

      const extractedId =
        decoded.userId ||
        decoded.id ||
        decoded._id ||
        decoded.sub ||
        userId ||
        null;

      if (extractedId) setUserId(extractedId);
    } catch (err) {
      console.error("Invalid token:", err);
      localStorage.removeItem("authToken");
      if (!userId) navigate("/login");
    }
  }, [navigate]); // intentionally NOT including userId

  // ===== LOAD CART FOR USER =====
  useEffect(() => {
    if (!userId) return;

    const loadCart = async () => {
      try {
        const res = await getCart(userId);
        // Try common response shapes: { data: { items } } or { items }
        setCartItems(res?.data?.items || res?.items || []);
      } catch (err) {
        console.error("❌ Cart load error:", err);
        const msg = (err?.message || "").toLowerCase();

        if (msg.includes("unauthorized")) {
          alert("Session expired, please login again");
          localStorage.removeItem("authToken");
          if (!userId) navigate("/login");
        } else if (
          msg.includes("forbidden") ||
          msg.includes("access forbidden")
        ) {
          alert("Access Denied: You cannot view this cart");
          setCartItems([]);
        } else {
          setCartItems([]);
        }
      }
    };

    loadCart();
  }, [userId, navigate]);

  // ===== ADD TO CART (OPTIONAL INTERNAL TEST FORM) =====
  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!userId) return;
    if (!addProductId) {
      alert("Enter product ID");
      return;
    }

    try {
      const res = await addToCart(userId, addProductId, Number(addProductQty));
      setCartItems(res?.data?.items || res?.items || []);
      setAddProductId("");
      setAddProductQty(1);
    } catch (err) {
      alert("Add to cart failed");
      console.error(err);
    }
  };

  // ===== UPDATE QUANTITY =====
  const updateQuantity = async (productId, qty) => {
    if (!userId) return;
    if (qty < 1) qty = 1;

    try {
      const res = await updateCartItem(userId, productId, qty);
      setCartItems(res?.data?.items || res?.items || []);
    } catch (err) {
      console.error("Update quantity error:", err);
    }
  };

  // ===== REMOVE ITEM =====
  const removeItem = async (productId) => {
    if (!userId) return;
    try {
      const res = await removeFromCart(userId, productId);
      setCartItems(res?.data?.items || res?.items || []);
    } catch (err) {
      console.error("Remove item error:", err);
    }
  };

  // ===== NORMALIZED ITEM HELPER =====
  const normalizeItem = (item) => {
    const productObj = item.product || item.productId || {};
    const normalizedId =
      item.id ||
      item._id ||
      productObj.id ||
      productObj._id ||
      productObj.productId ||
      item.productId;
    const normalizedTitle =
      item.title || productObj.title || productObj.name || "Product";
    const normalizedPrice = Number(item.price) || Number(productObj.price) || 0;
    const normalizedImage = item.image || productObj.image || null;

    return {
      ...item,
      normalizedId,
      normalizedTitle,
      normalizedPrice,
      normalizedImage,
    };
  };

  const normalizedCart = cartItems.map(normalizeItem);

  const totalPrice = normalizedCart.reduce(
    (sum, item) =>
      sum + (Number(item.normalizedPrice) || 0) * (Number(item.quantity) || 0),
    0
  );

  const currencySymbol = "₹";

  const handleCheckout = () => {
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
              <span className="ms-2 fs-4 fw-bold">PathToPage</span>
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

          {/* OPTIONAL small test form */}
          {/* 
          <form
            onSubmit={handleAddToCart}
            className="mb-4 d-flex gap-2 align-items-end"
            style={{ maxWidth: "400px", width: "100%" }}
          >
            <div className="flex-grow-1">
              <label className="form-label">Product ID</label>
              <input
                type="text"
                className="form-control"
                value={addProductId}
                onChange={(e) => setAddProductId(e.target.value)}
              />
            </div>
            <div style={{ width: "80px" }}>
              <label className="form-label">Qty</label>
              <input
                type="number"
                className="form-control"
                min={1}
                value={addProductQty}
                onChange={(e) =>
                  setAddProductQty(parseInt(e.target.value, 10) || 1)
                }
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Add
            </button>
          </form>
          */}

          {normalizedCart.length === 0 ? (
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
              {normalizedCart.map((item) => {
                const {
                  normalizedId,
                  normalizedTitle,
                  normalizedPrice,
                  quantity,
                  normalizedImage,
                } = item;

                return (
                  <div
                    key={normalizedId}
                    className="d-flex align-items-center mb-3 border-bottom pb-3"
                  >
                    <img
                      src={
                        normalizedImage ||
                        process.env.PUBLIC_URL + "/placeholder.png"
                      }
                      alt={normalizedTitle}
                      width="80"
                      height="80"
                      className="me-3 rounded"
                      style={{ objectFit: "cover", background: "#ececec" }}
                    />
                    <div className="flex-grow-1">
                      <h5 className="mb-2">{normalizedTitle}</h5>
                      <div className="d-flex align-items-center gap-3 mt-2">
                        <label
                          htmlFor={`qty-${normalizedId}`}
                          className="form-label mb-0"
                        >
                          Quantity:
                        </label>
                        <input
                          id={`qty-${normalizedId}`}
                          type="number"
                          className="form-control"
                          min="1"
                          value={quantity}
                          onChange={(e) =>
                            updateQuantity(
                              normalizedId,
                              parseInt(e.target.value, 10) || 1
                            )
                          }
                          style={{ width: "90px", background: "#fafafa" }}
                        />
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => removeItem(normalizedId)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <div
                      className="ms-3 fw-bold"
                      style={{ minWidth: 80, textAlign: "right" }}
                    >
                      ₹{(normalizedPrice * (quantity || 0)).toFixed(2)}
                    </div>
                  </div>
                );
              })}

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

        /* Navbar */
        .glass-navbar {
          background: var(--primary-color)
            url("https://www.transparenttextures.com/patterns/leather.png");
          color: #f8ead8;
          border-bottom: 3px dashed #f6e0c6;
          box-shadow: 0 4px 15px rgba(58, 37, 18, 0.3);
          transition: 0.3s ease;
        }

        .navbar .nav-link,
        .navbar .navbar-brand {
          color: #f8ead8 !important;
          font-weight: 500;
          transition: 0.3s;
        }

        .navbar .nav-link.active {
          font-weight: 600;
          color: #ffe6b3 !important;
        }

        .navbar .nav-link:hover {
          color: #ffe6b3 !important;
        }

        /* Cart card */
        .glass-card {
          background: var(--surface);
          border: 2px dashed var(--border);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
          padding: 24px;
          transition: all 0.3s ease;
        }

        .glass-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
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

        /* Footer */
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
          transition: 0.3s;
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
