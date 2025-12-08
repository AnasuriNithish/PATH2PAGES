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
  const [heroTagline, setHeroTagline] = useState(
    "Cart • Scrapbooks • Stickers • Polaroid prints"
  );
  const [isGift, setIsGift] = useState(false);
  const [orderNote, setOrderNote] = useState("");
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

  // ===== ROTATING TAGLINE =====
  useEffect(() => {
    const phrases = [
      "Cart • Scrapbooks • Stickers • Polaroid prints",
      "Review your cozy little bundle",
      "Almost ready to ship your memories",
      "One more step to your storybook",
    ];
    let i = 0;
    const id = setInterval(() => {
      i = (i + 1) % phrases.length;
      setHeroTagline(phrases[i]);
    }, 2600);
    return () => clearInterval(id);
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

  // ===== CLEAR CART =====
  const clearCart = () => {
    if (!window.confirm("Clear all items from your cart?")) return;
    saveCart([]);
  };

  // ===== TOTALS & DERIVED VALUES =====
  const totalPrice = cartItems.reduce(
    (sum, item) =>
      sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
    0
  );

  const totalItemsCount = cartItems.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0),
    0
  );

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <>
      <div className="cart-page-bg">
        {/* ===== NAVBAR – scrapbook strip ===== */}
        <nav
          ref={navbarRef}
          className="navbar navbar-expand-lg px-3 py-2 cart-navbar shadow-sm"
        >
          <div className="container-fluid">
            <Link to="/" className="navbar-brand d-flex align-items-center">
              <img
                src={process.env.PUBLIC_URL + "/logo.png"}
                alt="Logo"
                height="36"
              />
              <span className="ms-2 fs-4 fw-semibold cart-brand-text">
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
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
                <li className="nav-item">
                  <Link to="/" className="nav-link cart-nav-link px-3">
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/shop" className="nav-link cart-nav-link px-3">
                    Shop
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/cart"
                    className="nav-link cart-nav-link px-3 active"
                  >
                    Cart
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/profile" className="nav-link cart-nav-link px-3">
                    Profile
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* ===== MAIN CONTENT ===== */}
        <main className="cart-main">
          {/* Scrapbook hero */}
          <section className="cart-hero container">
            <span className="cart-pill mb-2">{heroTagline}</span>
            <h1 className="h2 mt-2 mb-2 cart-hero-title">
              Your basket of little memories
            </h1>
            <p className="small mb-0 cart-hero-subtitle">
              Review your journals, sticker sets and add-ons before we turn them
              into a cozy package for your pages.
            </p>

            {/* Floating icons */}
            <span className="cart-floating-icon icon-1">✨</span>
            <span className="cart-floating-icon icon-2">📦</span>

            {/* Mini summary pill */}
            {cartItems.length > 0 && (
              <div className="cart-summary-pill">
                <span>
                  {cartItems.length}{" "}
                  {cartItems.length === 1 ? "product" : "products"} •{" "}
                  {totalItemsCount} {totalItemsCount === 1 ? "item" : "items"}{" "}
                  in your cart
                </span>
              </div>
            )}
          </section>

          {/* Cart content */}
          <section className="container cart-section">
            {cartItems.length === 0 ? (
              <div className="cart-empty-card">
                <p className="mb-2">Your cart is feeling a bit lonely ☕</p>
                <p className="small text-muted mb-3">
                  Add a scrapbook or sticker pack and start filling your
                  storybook.
                </p>
                <Link to="/shop" className="btn cart-btn-primary">
                  Browse products
                </Link>
              </div>
            ) : (
              <>
                <div className="row g-4">
                  {/* Left – items list */}
                  <div className="col-lg-8">
                    <div className="cart-items-card">
                      {cartItems.map((item) => (
                        <div key={item.id} className="cart-item-row">
                          <div className="cart-item-polaroid">
                            <img
                              src={
                                item.image ||
                                process.env.PUBLIC_URL + "/placeholder.png"
                              }
                              alt={item.title}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  "https://placehold.co/300x300/eee/666?text=Image";
                              }}
                            />
                            <span className="cart-item-caption">
                              For this page →
                            </span>
                          </div>

                          <div className="cart-item-body">
                            <h5 className="cart-item-title mb-1">
                              {item.title}
                            </h5>
                            <p className="cart-item-price mb-2">
                              ₹{Number(item.price || 0).toFixed(2)} each
                            </p>

                            <div className="d-flex flex-wrap align-items-center gap-3">
                              {/* Quantity stepper */}
                              <div className="d-flex align-items-center gap-2">
                                <span className="form-label mb-0 small text-muted">
                                  Quantity
                                </span>
                                <div className="cart-qty-stepper">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      updateQuantity(
                                        item.id,
                                        Number(item.quantity || 1) - 1
                                      )
                                    }
                                  >
                                    -
                                  </button>
                                  <input
                                    id={`qty-${item.id}`}
                                    type="number"
                                    className="cart-qty-input"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) =>
                                      updateQuantity(
                                        item.id,
                                        parseInt(e.target.value, 10) || 1
                                      )
                                    }
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      updateQuantity(
                                        item.id,
                                        Number(item.quantity || 1) + 1
                                      )
                                    }
                                  >
                                    +
                                  </button>
                                </div>
                              </div>

                              <button
                                className="btn btn-sm cart-btn-remove"
                                onClick={() => removeItem(item.id)}
                              >
                                Remove
                              </button>
                            </div>
                          </div>

                          <div className="cart-item-total text-end">
                            <span className="small text-muted d-block">
                              Subtotal
                            </span>
                            <span className="fw-bold">
                              ₹
                              {(
                                (Number(item.price) || 0) *
                                (Number(item.quantity) || 0)
                              ).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Suggestion strip */}
                    <div className="cart-suggestion-strip mt-3">
                      💡{" "}
                      <span className="fw-semibold">
                        Don’t forget your tiny details:
                      </span>{" "}
                      add{" "}
                      <Link to="/bookmark" className="cart-suggest-link">
                        bookmarks & sticker add-ons
                      </Link>{" "}
                      to frame each page or mark your favourite chapters.
                    </div>
                  </div>

                  {/* Right – summary */}
                  <div className="col-lg-4">
                    <div className="cart-summary-card">
                      <div className="d-flex justify-content-between mb-1">
                        <span className="small text-muted">
                          Items ({cartItems.length})
                        </span>
                        <span className="small text-muted">
                          {totalItemsCount} total
                        </span>
                      </div>

                      <div className="d-flex justify-content-between mb-2">
                        <span className="small text-muted">Subtotal</span>
                        <span className="small text-muted">
                          ₹{totalPrice.toFixed(2)}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between mb-3">
                        <span className="small text-muted">Shipping</span>
                        <span className="small text-muted">
                          Calculated at checkout
                        </span>
                      </div>

                      <div className="border-top pt-3 d-flex justify-content-between align-items-center mb-3">
                        <span className="fw-semibold">Total</span>
                        <span className="fw-bold cart-summary-total">
                          ₹{totalPrice.toFixed(2)}
                        </span>
                      </div>

                      {/* Gift & note */}
                      <div className="cart-gift-box mb-2">
                        <div className="form-check form-switch mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="giftSwitch"
                            checked={isGift}
                            onChange={(e) => setIsGift(e.target.checked)}
                          />
                          <label
                            className="form-check-label small"
                            htmlFor="giftSwitch"
                          >
                            Mark this order as a gift (we’ll keep it neat
                            inside)
                          </label>
                        </div>
                        <textarea
                          className="form-control cart-note-input"
                          rows={2}
                          placeholder="Add a small note for yourself (or the person you’re gifting it to)."
                          value={orderNote}
                          onChange={(e) => setOrderNote(e.target.value)}
                        />
                        <p className="tiny-note mt-1 mb-0">
                          Note: This note is just for you on this device (not
                          sent anywhere).
                        </p>
                      </div>

                      <button
                        className="btn cart-btn-primary w-100 mb-2"
                        onClick={handleCheckout}
                      >
                        Proceed to checkout
                      </button>

                      <button
                        type="button"
                        className="btn btn-sm w-100 cart-btn-clear"
                        onClick={clearCart}
                      >
                        Clear cart
                      </button>

                      <p className="small text-muted mt-2 mb-0">
                        You can review your address and payment details on the
                        next step.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </section>
        </main>

        {/* ===== FOOTER – scrapbook strip ===== */}
        <footer className="cart-footer py-4">
          <div className="footer-left">
            <h5 className="footer-title mb-1">Path To Pages</h5>
            <p className="footer-subtext small mb-0">
              One page at a time, your story becomes a keepsake.
            </p>
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

      {/* ===== SCRAPBOOK CART THEME STYLES ===== */}
      <style jsx="true">{`
        @import url("https://fonts.googleapis.com/css2?family=Dancing+Script:wght@500;600;700&family=Poppins:wght@300;400;500;600&display=swap");

        body {
          background-color: #fdf6ec;
          font-family: "Poppins", sans-serif;
          color: #3e2723;
        }

        .cart-page-bg {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .cart-main {
          flex: 1;
          padding-top: 110px;
          padding-bottom: 40px;
        }

        /* NAVBAR */
        .cart-navbar {
          background: #f3e3c9;
          border-bottom: 2px dashed #c49b6c;
          box-shadow: 0 4px 15px rgba(151, 107, 60, 0.25);
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
        }

        .cart-brand-text {
          font-family: "Dancing Script", cursive;
          color: #6b4a2f;
          letter-spacing: 1px;
        }

        .cart-nav-link {
          color: #7b5533 !important;
          font-weight: 500;
          position: relative;
        }

        .cart-nav-link::after {
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

        .cart-nav-link:hover::after,
        .cart-nav-link.active::after {
          width: 70%;
        }

        .navbar-toggler {
          border-color: #c49b6c;
        }

        .navbar-toggler-icon {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba(123,85,51,0.9)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
        }

        /* HERO */
        .cart-hero {
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
          margin-bottom: 24px;
        }

        .cart-hero::before,
        .cart-hero::after {
          content: "";
          position: absolute;
          width: 70px;
          height: 20px;
          background: rgba(255, 244, 210, 0.95);
          top: -12px;
          border-radius: 4px;
          box-shadow: 0 2px 6px rgba(136, 97, 63, 0.4);
        }

        .cart-hero::before {
          left: 12%;
          transform: rotate(-8deg);
        }

        .cart-hero::after {
          right: 14%;
          transform: rotate(7deg);
        }

        .cart-pill {
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

        .cart-hero-title {
          font-family: "Dancing Script", cursive;
          color: #5d4029;
          text-shadow: 0 2px 0 rgba(255, 255, 255, 0.7);
        }

        .cart-hero-subtitle {
          color: #7a5a3c;
          max-width: 640px;
        }

        .cart-floating-icon {
          position: absolute;
          font-size: 30px;
          opacity: 0.75;
          pointer-events: none;
          animation: cartFloat 4s ease-in-out infinite;
        }

        .cart-floating-icon.icon-1 {
          left: 15%;
          top: 20%;
        }

        .cart-floating-icon.icon-2 {
          right: 16%;
          bottom: 16%;
          animation-delay: 0.7s;
        }

        @keyframes cartFloat {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        .cart-summary-pill {
          position: absolute;
          bottom: 12px;
          right: 16px;
          background: #ffeed8;
          border-radius: 999px;
          padding: 4px 14px;
          border: 1px dashed #d7a16e;
          font-size: 0.78rem;
          color: #7b5533;
          box-shadow: 0 4px 10px rgba(141, 103, 64, 0.2);
        }

        /* CART CONTENT */
        .cart-section {
          margin-top: 24px;
        }

        .cart-empty-card {
          border-radius: 20px;
          background: #fffdf8;
          box-shadow: 0 16px 30px rgba(141, 103, 64, 0.14);
          border: 2px dashed #e0c3a4;
          padding: 2rem 1.5rem;
          text-align: center;
        }

        .cart-items-card {
          border-radius: 20px;
          background: #fffdf8;
          box-shadow: 0 16px 30px rgba(141, 103, 64, 0.15);
          border: 1px dashed #e0c3a4;
          padding: 1.5rem;
        }

        .cart-item-row {
          display: grid;
          grid-template-columns: minmax(0, 140px) minmax(0, 1fr) auto;
          gap: 1.25rem;
          padding-block: 1rem;
          border-bottom: 1px dashed #f0dfcf;
        }

        .cart-item-row:last-child {
          border-bottom: none;
        }

        /* Polaroid image block */
        .cart-item-polaroid {
          background: #ffffff;
          padding: 8px 8px 16px;
          border-radius: 12px;
          box-shadow: 0 10px 18px rgba(87, 63, 42, 0.35);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .cart-item-polaroid:hover {
          transform: translateY(-2px) rotate(-1deg);
          box-shadow: 0 12px 22px rgba(87, 63, 42, 0.4);
        }

        .cart-item-polaroid img {
          width: 100%;
          height: 110px;
          object-fit: cover;
          border-radius: 8px;
        }

        .cart-item-caption {
          font-size: 0.7rem;
          color: #6f4b31;
          font-style: italic;
        }

        .cart-item-body {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .cart-item-title {
          color: #4a2e20;
        }

        .cart-item-price {
          color: #7a5a3c;
          font-size: 0.9rem;
        }

        /* Qty stepper */
        .cart-qty-stepper {
          display: inline-flex;
          align-items: center;
          border-radius: 999px;
          border: 1px dashed #e0c3a4;
          overflow: hidden;
          background: #fff8f0;
        }

        .cart-qty-stepper button {
          border: none;
          background: transparent;
          width: 26px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1rem;
          color: #7b5533;
        }

        .cart-qty-input {
          max-width: 60px;
          background: transparent;
          border: none;
          text-align: center;
          font-size: 0.9rem;
        }

        .cart-qty-input:focus {
          outline: none;
        }

        .cart-btn-remove {
          border-radius: 999px;
          border: 1px dashed #e28b8b;
          background: #fff3f3;
          font-size: 0.8rem;
          padding-inline: 0.9rem;
          color: #a04949;
        }

        .cart-btn-remove:hover {
          background: #ffe1e1;
        }

        .cart-item-total {
          min-width: 90px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        /* SUMMARY CARD */
        .cart-summary-card {
          border-radius: 20px;
          background: #fffdf8;
          box-shadow: 0 16px 30px rgba(141, 103, 64, 0.15);
          border: 1px dashed #e0c3a4;
          padding: 1.5rem;
        }

        .cart-summary-total {
          color: #a35d48;
        }

        /* Gift & note */
        .cart-gift-box {
          background: #fffaf3;
          border-radius: 14px;
          border: 1px dashed #e0c3a4;
          padding: 0.6rem 0.7rem;
        }

        .cart-note-input {
          font-size: 0.85rem;
          border-radius: 10px;
          border: 1px solid #e4d2c1;
          background: #fffdf8;
        }

        .cart-note-input:focus {
          border-color: #c58b61;
          box-shadow: 0 0 0 0.15rem rgba(192, 136, 94, 0.25);
        }

        .tiny-note {
          font-size: 0.7rem;
          color: #8a7a6c;
        }

        /* Suggestion strip */
        .cart-suggestion-strip {
          border-radius: 18px;
          background: #fff5e2;
          border: 1px dashed #d7a16e;
          padding: 0.8rem 1rem;
          box-shadow: 0 6px 14px rgba(141, 103, 64, 0.12);
          font-size: 0.9rem;
          color: #7b5533;
        }

        .cart-suggest-link {
          color: #a35d48;
          font-weight: 500;
          text-decoration: none;
        }

        .cart-suggest-link:hover {
          text-decoration: underline;
        }

        /* BUTTONS */
        .cart-btn-primary {
          background: linear-gradient(135deg, #f08c6a, #f6b18b);
          border: none;
          color: #ffffff;
          border-radius: 999px;
          font-weight: 500;
          font-size: 0.95rem;
          padding: 0.6rem 1.4rem;
          box-shadow: 0 4px 12px rgba(240, 140, 106, 0.55);
        }

        .cart-btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(240, 140, 106, 0.7);
        }

        .cart-btn-clear {
          border-radius: 999px;
          border: 1px dashed #e28b8b;
          background: #fff3f3;
          font-size: 0.8rem;
          padding: 0.45rem 1rem;
          color: #a04949;
        }

        .cart-btn-clear:hover {
          background: #ffe1e1;
        }

        /* FOOTER */
        .cart-footer {
          background: #f3e3c9;
          border-top: 2px dashed #c49b6c;
          color: #7b5533;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          padding-inline: 2rem;
          position: relative;
        }

        .cart-footer::before,
        .cart-footer::after {
          content: "";
          position: absolute;
          width: 70px;
          height: 22px;
          background: #ffeccd;
          top: -10px;
          border-radius: 4px;
          border: 1px solid #d1b38f;
        }

        .cart-footer::before {
          left: 10%;
          transform: rotate(-4deg);
        }

        .cart-footer::after {
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
          font-family: "Dancing Script", cursive;
          color: #5b3a25;
          font-size: 1.6rem;
        }

        .footer-subtext {
          color: #7b5533;
          opacity: 0.85;
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

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .cart-main {
            padding-top: 100px;
            padding-bottom: 30px;
          }

          .cart-hero {
            margin-inline: 0.25rem;
          }

          .cart-summary-pill {
            position: static;
            margin-top: 0.75rem;
          }

          .cart-item-row {
            grid-template-columns: 1fr;
            align-items: flex-start;
          }

          .cart-item-total {
            align-items: flex-end;
          }

          .cart-footer {
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

export default Cart;
