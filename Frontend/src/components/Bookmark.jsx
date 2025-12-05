import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

import {
  ShoppingCart,
  Loader2,
  Trash2,
  ArrowLeft,
  QrCode,
  DollarSign,
} from "lucide-react";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import { SiThreads } from "react-icons/si";

/* ===========================
   API CONFIG (same style as Journal.jsx)
   ========================== */

const API_BASE_URL = "https://pathtopages.onrender.com/api/v1";

// TODO: put your real userId from backend here
const USER_ID = "6906fc0a502d8f37d2146823";

// Safe check so 'process' is not referenced in non-Node environments
const API_TOKEN =
  (typeof process !== "undefined" &&
    process.env &&
    process.env.REACT_APP_PTP_API_KEY) ||
  "";

// Generic helper
const callApi = async (method, path, body) => {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: API_TOKEN ? `Bearer ${API_TOKEN}` : undefined,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      let msg = `${method} ${path} failed`;
      try {
        const t = await res.text();
        msg += `: ${t}`;
      } catch {
        /* ignore */
      }
      throw new Error(msg);
    }
    if (res.status === 204) return null;
    return res.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

const addOrUpdateCart = (userId, productId, quantity) =>
  callApi("POST", `/user/${userId}/cart/${productId}`, { quantity });

const removeProductFromCart = (userId, productId) =>
  callApi("DELETE", `/user/${userId}/cart/${productId}`);

/* ===========================
   MOCK DATA – PLUG YOUR REAL PRODUCT IDS
   ========================== */

const BOOKMARK_PRODUCTS = [
  {
    id: "68f8ffcaddfcfc98412ee990", // Season bookmark (example)
    title: "Vintage Leather",
    subtitle: "The Traveler's Compass Bookmark",
    description:
      "A premium quality, embossed leather bookmark with a delicate metallic compass charm. Perfect for marking pages in your adventure log.",
    price: 1299,
    image: "https://placehold.co/400x400/b78a5f/f8f5ed?text=Vintage+Leather",
    images: [
      "https://placehold.co/800x600/b78a5f/f8f5ed?text=Vintage+Leather+1",
      "https://placehold.co/800x600/a36e5a/f8f5ed?text=Vintage+Leather+2",
      "https://placehold.co/800x600/8b5b47/f8f5ed?text=Vintage+Leather+3",
    ],
    material: "Genuine Leather, Brass Charm",
    stock: 5,
  },
];

/* ===========================
   JOURNAL.jsx THEME - EXACT COPY
   ========================== */

const CustomStyles = () => (
  <>
    {/* Bootstrap 5 CSS */}
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
      crossOrigin="anonymous"
    />

    {/* Google Fonts */}
    <link
      href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;700&family=Lora:wght@400;700&display=swap"
      rel="stylesheet"
    />
    <link
      href="https://fonts.googleapis.com/css2?family=Caveat+Brush&family=Caveat:wght@400;700&display=swap"
      rel="stylesheet"
    />
    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@500&display=swap"
      rel="stylesheet"
    />

    <style>{`
      html, body, #root {
        height: 100%;
        margin: 0;
        padding: 0;
      }
      
      .page-bg {
        background-color: #f8f5ed;
        min-height: 100vh;
        font-family: 'Lora', serif;
        color: #3e2723;
        display: flex;
        flex-direction: column;
      }
      
      .main-content {
        flex: 1;
      }
      
      h1, h4, h6, .display-font {
        font-family: 'Cormorant Garamond', serif;
        font-weight: 600;
        color: #4a2e20;
      }
      
      .vintage-card-shadow {
        border: 1px solid #e6dfd4;
        border-radius: 10px;
        background: #fffdf8;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
      }
      
      .text-vintage-accent {
        color: #a35d48 !important;
      }
      
      .btn-vintage {
        background-color: #a35d48;
        border: none;
        color: white;
        padding: 8px 18px;
        border-radius: 6px;
        font-size: 15px;
        transition: 0.2s;
      }
      .btn-vintage:hover {
        background-color: #8c4c3e;
      }
      
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      .spin-anim {
        animation: spin 1s linear infinite;
      }
      
      .leather-strip, .navbar {
        background: #7a5c4d url(https://www.transparenttextures.com/patterns/leather.png);
        border-bottom: 3px dashed #f8ead8;
        box-shadow: 0 4px 15px rgba(58, 37, 18, 0.3);
      }
      
      .navbar-brand span {
        font-family: 'Caveat Brush', cursive;
        color: #fff8f0;
        letter-spacing: 1.5px;
      }
      .nav-link {
        color: #f8ead8 !important;
        font-family: 'Poppins', sans-serif;
        font-weight: 500;
        transition: 0.3s;
      }
      .nav-link:hover {
        color: #ffe6b3 !important;
      }
      
      .glass-footer {
        background: #7a5c4d url("https://www.transparenttextures.com/patterns/paper-1.png");
        color: #fdf8f3;
        border-top: 3px dashed #f8ead8;
        position: relative;
      }
      .glass-footer::before,
      .glass-footer::after {
        content: "";
        position: absolute;
        width: 60px;
        height: 20px;
        background: #e8d5b7;
        top: -10px;
        transform: rotate(-3deg);
        border: 1px solid #d1b38f;
        border-radius: 4px;
      }
      .glass-footer::after {
        right: 15%;
        transform: rotate(3deg);
      }
      .footer-title h4 {
        font-family: "Caveat Brush", cursive;
        color: #ffe6b3;
        text-shadow: 1px 1px 0 #4d3b2b;
      }
      .quick-links h6 {
        font-family: "Caveat", cursive;
        font-size: 1.3rem;
        color: #fff0d8;
      }
      .footer-link {
        color: #fceac7;
        text-decoration: none;
        font-size: 1rem;
        transition: color 0.3s ease, transform 0.2s ease;
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

      /* Simple overlay buttons for slideshow */
      .slideshow-wrapper {
        position: relative;
        overflow: hidden;
        border-radius: 10px;
      }

      .slideshow-arrow {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 38px;
        height: 38px;
        border-radius: 50%;
        border: none;
        background-color: rgba(0,0,0,0.45);
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
      .slideshow-arrow.left {
        left: 10px;
      }
      .slideshow-arrow.right {
        right: 10px;
      }

      .slideshow-dots {
        position: absolute;
        bottom: 10px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 6px;
      }
      .slideshow-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: rgba(255,255,255,0.6);
        border: none;
        padding: 0;
      }
      .slideshow-dot.active {
        background-color: #fff;
      }

      @media (max-width: 768px) {
        .glass-footer {
          flex-direction: column;
          text-align: center;
        }
        .quick-links ul {
          justify-content: center;
        }
      }
    `}</style>
  </>
);

/* ===========================
   SMALL HELPERS
   ========================== */

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

/* ===========================
   REUSABLE COMPONENTS
   ========================== */

const BookmarkCard = ({ product, onAddToCart, addingId }) => {
  const isLoading = addingId === product.id;

  const images =
    product.images && product.images.length > 0
      ? product.images
      : [product.image];

  const [index, setIndex] = useState(0);

  // auto-slide
  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(id);
  }, [images.length]);

  const goPrev = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goNext = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="col-12 mb-4">
      <div className="card vintage-card-shadow p-4">
        <div className="row g-4" style={{ minHeight: "520px" }}>
          {/* LEFT - IMAGE SLIDESHOW */}
          <div className="col-md-6">
            <div className="slideshow-wrapper">
              <div
                style={{
                  width: "100%",
                  height: "360px",
                  backgroundImage: `url(${images[index]})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    className="slideshow-arrow left"
                    onClick={goPrev}
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    className="slideshow-arrow right"
                    onClick={goNext}
                  >
                    ›
                  </button>

                  <div className="slideshow-dots">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        className={
                          "slideshow-dot" + (i === index ? " active" : "")
                        }
                        onClick={() => setIndex(i)}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* RIGHT - DETAILS */}
          <div className="col-md-6 d-flex flex-column justify-content-between">
            <div>
              <h2 className="display-font mb-2">{product.title}</h2>
              <h6 className="text-vintage-accent mb-3">{product.subtitle}</h6>

              <p className="text-muted">{product.description}</p>

              <h6 className="mt-4 mb-2">Key Features:</h6>
              <ul className="text-muted small">
                <li>Premium quality material</li>
                <li>Hand-crafted finish</li>
                <li>Durable and long-lasting</li>
              </ul>
            </div>

            <div>
              <h3 className="text-vintage-accent fw-bold">
                {formatCurrency(product.price)}
              </h3>

              <button
                className="btn btn-vintage w-100 mt-3 d-flex align-items-center justify-content-center gap-2"
                onClick={() => onAddToCart(product)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 size={18} className="spin-anim" />
                ) : (
                  <>
                    <ShoppingCart size={18} />
                    Add to Cart
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CartItem = ({ item, onRemove, onUpdateQty }) => {
  const isRemoving = false;

  return (
    <li key={item.id} className="list-group-item d-flex align-items-center p-3">
      <div
        className="rounded me-3"
        style={{
          width: 60,
          height: 60,
          backgroundImage: `url(${item.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="flex-grow-1">
        <div className="d-flex justify-content-between">
          <h6 className="mb-1">{item.title}</h6>
          <span className="fw-bold text-vintage-accent">
            {formatCurrency(item.price * item.quantity)}
          </span>
        </div>
        <div className="d-flex align-items-center mt-1">
          <small className="text-muted me-3">
            {formatCurrency(item.price)} each
          </small>
          <div className="btn-group btn-group-sm" role="group">
            <button
              className="btn btn-outline-secondary"
              onClick={() => onUpdateQty(item.id, -1)}
              disabled={item.quantity <= 1}
            >
              -
            </button>
            <span className="btn btn-outline-secondary disabled px-3">
              {item.quantity}
            </span>
            <button
              className="btn btn-outline-secondary"
              onClick={() => onUpdateQty(item.id, 1)}
            >
              +
            </button>
          </div>
        </div>
      </div>
      <button
        className="btn btn-sm btn-link text-danger ms-3"
        onClick={() => onRemove(item.id)}
        disabled={isRemoving}
      >
        <Trash2 size={18} />
      </button>
    </li>
  );
};

const CartView = ({
  cartItems,
  cartTotal,
  onBackToShop,
  onCheckout,
  onRemove,
  onUpdateQty,
}) => (
  <div className="container pt-3 pb-4">
    <div className="row g-4">
      <div className="col-lg-8">
        <div className="card border-0 vintage-card-shadow rounded-3">
          <div className="card-body p-4">
            <div className="d-flex align-items-center mb-3">
              <button
                className="btn btn-link text-decoration-none text-muted p-0 me-2"
                onClick={onBackToShop}
              >
                <ArrowLeft size={18} className="me-1" />
                Back to bookmarks
              </button>
              <h3 className="ms-auto mb-0 display-font text-vintage-accent">
                Your Cart
              </h3>
            </div>

            {cartItems.length === 0 ? (
              <div className="alert alert-warning">
                Your cart is empty. Add some bookmarks to begin your journey.
              </div>
            ) : (
              <ul className="list-group list-group-flush">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onRemove={onRemove}
                    onUpdateQty={onUpdateQty}
                  />
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="col-lg-4 mt-4 mt-lg-0">
        <div className="card p-4 vintage-card-shadow border-0 rounded-3">
          <h5 className="display-font text-vintage-accent mb-3">
            Order Summary
          </h5>
          <div className="d-flex justify-content-between mb-2">
            <span>Subtotal</span>
            <span>{formatCurrency(cartTotal)}</span>
          </div>
          <div className="d-flex justify-content-between mb-4">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <hr />
          <div className="d-flex justify-content-between mb-4 fw-bold">
            <span>Total</span>
            <span className="h5 text-vintage-accent mb-0">
              {formatCurrency(cartTotal)}
            </span>
          </div>

          <button
            className="btn btn-vintage w-100 py-2 d-flex align-items-center justify-content-center gap-2"
            disabled={cartItems.length === 0}
            onClick={onCheckout}
          >
            <DollarSign size={18} />
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  </div>
);

const CheckoutView = ({ cartTotal, onBackToCart, onOrderComplete }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setShowQR(true);

      setTimeout(() => {
        onOrderComplete();
      }, 3000);
    }, 1200);
  };

  return (
    <div className="container pt-4 pb-5" style={{ maxWidth: "600px" }}>
      <div className="row justify-content-center">
        <div className="col-lg-12">
          <div className="card border-0 vintage-card-shadow rounded-3">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <button
                  className="btn btn-link text-decoration-none text-muted p-0"
                  onClick={onBackToCart}
                  type="button"
                >
                  <ArrowLeft size={18} className="me-1" />
                  Back to Cart
                </button>
                <h4 className="display-font text-vintage-accent mb-0">
                  Secure Checkout
                </h4>
              </div>

              <form onSubmit={handleSubmit}>
                <h6 className="mb-3">Shipping Information</h6>
                <div className="mb-3">
                  <label className="form-label small">Full Name</label>
                  <input
                    className="form-control"
                    required
                    placeholder="John Doe"
                    style={{
                      backgroundColor: "#f8f5ed",
                      borderColor: "#c4a484",
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small">Address</label>
                  <input
                    className="form-control"
                    required
                    placeholder="123 Writer's Alley"
                    style={{
                      backgroundColor: "#f8f5ed",
                      borderColor: "#c4a484",
                    }}
                  />
                </div>

                <h6 className="mt-4 mb-3">Payment Method</h6>
                <div className="alert alert-info small d-flex align-items-center gap-2 mb-4">
                  <QrCode size={20} />
                  Payment via QR / UPI is the default method.
                </div>

                <div className="d-flex justify-content-between my-4 border-top pt-3">
                  <span className="fw-bold">Order Total:</span>
                  <span className="fw-bold h4 text-vintage-accent mb-0">
                    {formatCurrency(cartTotal)}
                  </span>
                </div>

                <button
                  className="btn btn-vintage w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                  type="submit"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <Loader2 size={20} className="spin-anim" />
                  ) : (
                    <>
                      <DollarSign size={18} />
                      Pay Now (Show QR)
                    </>
                  )}
                </button>
              </form>

              {showQR && (
                <div className="mt-4 text-center">
                  <p className="small text-muted mb-2">
                    Scan this QR with your UPI app to complete payment.
                  </p>
                  <div
                    className="d-inline-flex align-items-center justify-content-center rounded-3 border p-3 bg-light"
                    style={{
                      width: 200,
                      height: 200,
                    }}
                  >
                    <QrCode size={120} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ===========================
   MAIN BOOKMARK PAGE
   ========================== */

const BookmarkShop = () => {
  const [view, setView] = useState("shop"); // 'shop' | 'cart' | 'checkout'
  const [cartItems, setCartItems] = useState([]);
  const [addingId, setAddingId] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddToCart = useCallback(async (product) => {
    if (!product.id || product.id.startsWith("PUT_REAL_PRODUCT_ID")) {
      console.error(
        `Product ID is not configured for "${product.title}". Please paste the real MongoDB _id in the product list.`
      );
      setAddingId(product.id);
      setTimeout(() => {
        setCartItems((prev) => {
          const existing = prev.find((i) => i.id === product.id);
          if (existing) {
            return prev.map((i) =>
              i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
            );
          }
          return [...prev, { ...product, quantity: 1 }];
        });
        setView("cart");
        setAddingId(null);
      }, 500);

      return;
    }

    try {
      setAddingId(product.id);
      await addOrUpdateCart(USER_ID, product.id, 1);

      setCartItems((prev) => {
        const existing = prev.find((i) => i.id === product.id);
        if (existing) {
          return prev.map((i) =>
            i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
          );
        }
        return [...prev, { ...product, quantity: 1 }];
      });

      setView("cart");
    } catch (err) {
      console.error("AddOrUpdateCart error:", err);
      setCartItems((prev) => {
        const existing = prev.find((i) => i.id === product.id);
        if (existing) {
          return prev.map((i) =>
            i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
          );
        }
        return [...prev, { ...product, quantity: 1 }];
      });
      setView("cart");
    } finally {
      setAddingId(null);
    }
  }, []);

  const handleRemoveFromCart = useCallback(async (productId) => {
    try {
      await removeProductFromCart(USER_ID, productId);
    } catch (err) {
      console.error("removeProductFromCart error:", err);
    } finally {
      setCartItems((prev) => prev.filter((i) => i.id !== productId));
    }
  }, []);

  const handleUpdateQty = useCallback(
    async (productId, delta) => {
      const item = cartItems.find((i) => i.id === productId);
      if (!item) return;

      const newQty = Math.max(1, item.quantity + delta);

      setCartItems((prev) =>
        prev.map((i) => (i.id === productId ? { ...i, quantity: newQty } : i))
      );

      try {
        await addOrUpdateCart(USER_ID, productId, newQty);
      } catch (err) {
        console.error("AddOrUpdateCart (qty change) error:", err);
      }
    },
    [cartItems]
  );

  const handleOrderComplete = () => {
    setCartItems([]);
    setView("shop");
  };

  const navigate = (newView) => {
    setView(newView);
    setIsMenuOpen(false);
  };

  const renderContent = () => {
    switch (view) {
      case "cart":
        return (
          <CartView
            cartItems={cartItems}
            cartTotal={cartTotal}
            onBackToShop={() => navigate("shop")}
            onCheckout={() => navigate("checkout")}
            onRemove={handleRemoveFromCart}
            onUpdateQty={handleUpdateQty}
          />
        );
      case "checkout":
        return (
          <CheckoutView
            cartTotal={cartTotal}
            onBackToCart={() => navigate("cart")}
            onOrderComplete={handleOrderComplete}
          />
        );
      case "shop":
      default:
        return (
          <div className="container py-5">
            <div className="row">
              {BOOKMARK_PRODUCTS.map((product) => (
                <BookmarkCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  addingId={addingId}
                />
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="page-bg">
      <CustomStyles />

      <nav className="navbar navbar-expand-lg fixed-top glass-navbar p-3">
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
                <Link to="/profile" className="nav-link text-white">
                  Profile
                </Link>
              </li>
              <li className="nav-item d-flex align-items-center ms-3">
                <span className="badge bg-light text-dark">
                  Cart: {cartItemCount}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <main
        className="main-content"
        style={{ paddingTop: "80px", paddingBottom: "16px" }}
      >
        {renderContent()}
      </main>

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
  );
};

export default BookmarkShop;
