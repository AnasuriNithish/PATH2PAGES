import React, { useState } from "react";
import {
  ShoppingCart,
  Loader2,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  DollarSign,
  Trash2,
  CheckCircle,
  QrCode,
} from "lucide-react";
import { Link } from "react-router-dom";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import { SiThreads } from "react-icons/si";

/* ===========================
   API CONFIG & HELPERS
   =========================== */

const API_BASE_URL = "https://pathtopages.onrender.com/api/v1";

// TODO: put your real userId from backend
const USER_ID = "6906fc0a502d8f37d2146823";

// API key should come from .env (never hard-code it)
// CRA:  REACT_APP_PTP_API_KEY=your_key
// Vite: VITE_PTP_API_KEY=your_key
// API token should come from .env
// CRA:  REACT_APP_PTP_API_KEY=your_token
// Vite: VITE_PTP_API_KEY=your_token
const API_TOKEN =
  process.env.REACT_APP_PTP_API_KEY || import.meta.env?.VITE_PTP_API_KEY || "";

// generic helper to call your backend
const callApi = async (method, path, body) => {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      // ✅ match Postman:
      Authorization: `Bearer ${API_TOKEN}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${method} ${path} failed: ${res.status} ${text}`);
  }

  if (res.status === 204) return null;
  return res.json();
};

// POST  /user/:userId/cart/:productId
const addOrUpdateCart = (userId, productId, quantity) => {
  // adjust body shape if your backend expects something else
  return callApi("POST", `/user/${userId}/cart/${productId}`, { quantity });
};

// DELETE /user/:userId/cart/:productId
const removeProductFromCart = (userId, productId) => {
  return callApi("DELETE", `/user/${userId}/cart/${productId}`);
};

/* ===========================
   VIEW CONSTANTS
   =========================== */

const VIEWS = {
  PRODUCT: "product",
  CART: "cart",
  CHECKOUT: "checkout",
};

/* ===========================
   STYLES (unchanged)
   =========================== */

const CustomStyles = () => (
  <>
    {/* Bootstrap 5 CSS link */}
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

    <style>
      {`

 /* GLOBAL LAYOUT */
html, body, #root {
  height: 100%;
  margin: 0;
  padding: 0;
}
.leather-strip {
        background: #7a5a45;
        color: white;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
      }
.page-bg {
  background-color: #f8f5ed;   /* Vintage paper beige */
  min-height: 100vh;
  font-family: 'Lora', serif;
  color: #3e2723;

  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;    /* Automatically push footer to bottom */
}

/* ===========================
   FOOTER – GLASS / LEATHER STYLE
   =========================== */

.glass-footer {
  background: #7a5c4d
    url("https://www.transparenttextures.com/patterns/paper-1.png");
  color: #fdf8f3;
  border-top: 3px dashed #f8ead8;
  position: relative;

  /* layout */
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1.5rem;

  /* size */
  padding: 2.5rem 2rem;
  min-height: 150px;
}

/* decorative tape tabs */
.glass-footer::before,
.glass-footer::after {
  content: "";
  position: absolute;
  width: 60px;
  height: 28px;
  background: #e8d5b7;
  top: -14px;
  border: 1px solid #d1b38f;
  border-radius: 4px;
}

.glass-footer::before {
  left: 12%;
  transform: rotate(-3deg);
}

.glass-footer::after {
  right: 12%;
  transform: rotate(3deg);
}

/* footer sections */
.footer-title h4 {
  font-family: "Caveat Brush", cursive;
  color: #ffe6b3;
  text-shadow: 1px 1px 0 #4d3b2b;
  margin-bottom: 0.25rem;
}

.footer-title span {
  font-size: 0.85rem;
  opacity: 0.9;
}

.quick-links h6 {
  font-family: "Caveat", cursive;
  font-size: 1.3rem;
  color: #fff0d8;
  margin-bottom: 0.75rem;
}

.quick-links .footer-links {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.footer-link {
  color: #fceac7;
  text-decoration: none;
  font-size: 1rem;
  cursor: pointer;
  transition: color 0.3s ease, transform 0.2s ease;
}

.footer-link:hover {
  color: #ffe6b3;
  transform: translateY(-2px);
}

/* social icons / text */
.social-icons {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.social-icons span {
  font-size: 0.9rem;
}

.social-icons .footer-links {
  display: flex;
  gap: 0.75rem;
}

/* If you use <a> for icons instead of spans */
.social-icons a {
  font-size: 1.4rem;
  color: #ffe6b3;
  transition: all 0.3s ease;
  text-decoration: none;
}
.social-icons a:hover {
  color: #ffffff;
  transform: scale(1.1);
}

/* ===========================
   RESPONSIVE BEHAVIOUR
   =========================== */

/* Small screens: stack items, hide tape for safety */
@media (max-width: 768px) {
  .glass-footer {
    flex-direction: column;
    text-align: center;
    align-items: center;
    padding: 2rem 1.5rem;
    min-height: 170px;
  }

  .glass-footer::before,
  .glass-footer::after {
    display: none;
  }

  .quick-links .footer-links {
    justify-content: center;
  }

  .social-icons {
    justify-content: center;
  }
}

/* Medium screens: keep flex row but give extra padding */
@media (min-width: 769px) and (max-width: 1199px) {
  .glass-footer {
    padding: 2.5rem 3rem;
    min-height: 160px;
  }
}

/* Large / desktop screens: more breathing room */
@media (min-width: 1200px) {
  .glass-footer {
    padding: 3rem 4rem;
    min-height: 180px;
  }
}

/* TYPOGRAPHY */
h1, h4, h6 {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 600;
  color: #4a2e20;
}

/* CARDS */
/* CARDS */
.vintage-card-shadow {
  border: 1px solid #e6dfd4;
  border-radius: 10px;
  background: #fffdf8;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

/* If you want padding on text cards, let Bootstrap handle it with p-3 / p-4 */


/* ACCENT TEXT */
.text-vintage-accent {
  color: #a35d48 !important;  /* Leather brown */
}

/* BUTTONS */
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

/* IMAGE CAROUSEL */
/* IMAGE CAROUSEL – FULL COVER */
.carousel-image {
  width: 100%;
  height: 550px;         /* tweak this if you want taller/shorter */
  object-fit: cover;     /* fill and crop nicely */
 object-position: 55% center;
  border-radius: 8px;
  display: block;
}

.carousel-wrapper,
.carousel-slide {
  padding: 0 !important;
  margin: 0 !important;
}


/* OPTIONAL MINIMAL SPINNER */
.spin-anim {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

`}
    </style>
  </>
);

/* ===========================
   PRODUCT DATA
   =========================== */

const JOURNAL_PRODUCT_ID = "68d8f374e1f41bc52a3185e2";

const mockProduct = {
  id: JOURNAL_PRODUCT_ID,
  title: "The Scholar's Handbound Journal",
  description:
    "An exquisite, hand-stitched journal featuring 200 pages of aged, premium paper. Perfect for creative writing, travel logs, or daily planning.",
  price: 799,
  details: [
    "A5 size, 200 unlined pages",
    "Aged cream paper, 120gsm thick",
    "Genuine leather cover (mock)",
    "Hand-stitched binding",
  ],
  images: [
    "https://raw.githubusercontent.com/AnasuriNithish/PathtoPages/ab2fbd5de49fb4fbb735842755026ba7fbf96de4/Frontend/IMG-20251027-WA0006.jpg",
    "https://raw.githubusercontent.com/AnasuriNithish/PathtoPages/ab2fbd5de49fb4fbb735842755026ba7fbf96de4/Frontend/IMG-20251027-WA0005.jpg",
    "https://raw.githubusercontent.com/AnasuriNithish/PathtoPages/ab2fbd5de49fb4fbb735842755026ba7fbf96de4/Frontend/IMG-20251027-WA0010.jpg",
    "https://raw.githubusercontent.com/AnasuriNithish/PathtoPages/ab2fbd5de49fb4fbb735842755026ba7fbf96de4/Frontend/IMG-20251027-WA0012.jpg",
    "https://raw.githubusercontent.com/AnasuriNithish/PathtoPages/ab2fbd5de49fb4fbb735842755026ba7fbf96de4/Frontend/IMG-20251027-WA0014.jpg",
    "https://raw.githubusercontent.com/AnasuriNithish/PathtoPages/ab2fbd5de49fb4fbb735842755026ba7fbf96de4/Frontend/IMG-20251027-WA0015.jpg",
    "https://raw.githubusercontent.com/AnasuriNithish/PathtoPages/ab2fbd5de49fb4fbb735842755026ba7fbf96de4/Frontend/IMG-20251027-WA0019.jpg",
    "https://raw.githubusercontent.com/AnasuriNithish/PathtoPages/ab2fbd5de49fb4fbb735842755026ba7fbf96de4/Frontend/IMG-20251027-WA0020.jpg",
    "https://raw.githubusercontent.com/AnasuriNithish/PathtoPages/ab2fbd5de49fb4fbb735842755026ba7fbf96de4/Frontend/IMG-20251027-WA0022.jpg",
    "https://raw.githubusercontent.com/AnasuriNithish/PathtoPages/ab2fbd5de49fb4fbb735842755026ba7fbf96de4/Frontend/IMG-20251027-WA0024.jpg",
    "https://raw.githubusercontent.com/AnasuriNithish/PathtoPages/ab2fbd5de49fb4fbb735842755026ba7fbf96de4/Frontend/IMG-20251027-WA0027.jpg",
  ],
};

/* ===========================
   UTILS
   =========================== */

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(amount);
};

/* ===========================
   CAROUSEL
   =========================== */

const ProductImageCarousel = ({ images }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = images.length;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <div className="position-relative rounded-3 overflow-hidden vintage-card-shadow">
      <div
        className="d-flex"
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
          transition: "transform 0.5s",
        }}
      >
        {images.map((imgSrc, index) => (
          <img
            key={index}
            src={imgSrc}
            alt={`Product slide ${index + 1}`}
            className="carousel-image flex-shrink-0"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://placehold.co/800x500/333/fff?text=Image+Error";
            }}
            // style={{ width: "100%" }}
          />
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="btn btn-sm position-absolute top-50 start-0 translate-middle-y ms-3 bg-dark bg-opacity-50 text-white rounded-circle p-2"
        aria-label="Previous image"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="btn btn-sm position-absolute top-50 end-0 translate-middle-y me-3 bg-dark bg-opacity-50 text-white rounded-circle p-2"
        aria-label="Next image"
      >
        <ChevronRight size={24} />
      </button>

      <div className="position-absolute bottom-0 start-50 translate-middle-x d-flex gap-2 mb-3">
        {images.map((_, index) => (
          <div
            key={index}
            className={`rounded-circle cursor-pointer transition-all ${
              currentSlide === index
                ? "bg-vintage-accent"
                : "bg-white opacity-50"
            }`}
            onClick={() => setCurrentSlide(index)}
            style={{ width: "10px", height: "10px" }}
          ></div>
        ))}
      </div>
    </div>
  );
};

/* ===========================
   PRODUCT DETAIL VIEW
   =========================== */

const ProductDetailView = ({
  product,
  quantity,
  setQuantity,
  loadingId,
  handleAddToCart,
}) => {
  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  return (
    <div className="row g-5">
      <div className="col-lg-6">
        <ProductImageCarousel images={product.images} />
      </div>

      <div className="col-lg-6">
        <div className="card h-100 p-4 vintage-card-shadow border-0">
          <div className="card-body d-flex flex-column">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <h1 className="h2 mb-0">{product.title}</h1>
              {/* <button
                className="btn text-danger bg-light rounded-circle p-2 shadow-sm"
                aria-label="Add to Wishlist"
              >
                <Heart size={28} />
              </button> */}
            </div>

            <p className="text-uppercase small fw-bold text-vintage-accent d-flex align-items-center mb-4">
              <BookOpen size={16} className="me-2" /> Handbound Collection
            </p>

            <p className="text-muted">{product.description}</p>

            <div className="my-4">
              <p className="fw-bold mb-2">Key Features:</p>
              <ul className="list-unstyled small text-muted ms-3 mb-0">
                {product.details.map((detail, index) => (
                  <li key={index} className="d-flex align-items-start mb-1">
                    <span className="me-2 text-vintage-accent">&bull;</span>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-auto pt-4 border-top">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <p className="h3 fw-bold mb-0 text-vintage-accent d-flex align-items-center">
                  <DollarSign size={24} className="me-2" />{" "}
                  {formatCurrency(product.price)}
                </p>
              </div>

              <div className="d-flex align-items-center gap-3">
                <div className="input-group" style={{ maxWidth: "120px" }}>
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => handleQuantityChange(-1)}
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="form-control text-center"
                    min="1"
                    aria-label="Quantity"
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => handleQuantityChange(1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <button
                  className="btn btn-vintage flex-grow-1 py-2 d-flex align-items-center justify-content-center gap-2"
                  onClick={() => handleAddToCart(product)}
                  disabled={loadingId === product.id}
                >
                  {loadingId === product.id ? (
                    <Loader2 size={20} className="spin-anim" />
                  ) : (
                    <>
                      <ShoppingCart size={20} />
                      Add to Cart
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ===========================
   CART VIEW
   =========================== */

const CartView = ({ cartItems, setView, onRemoveItem, onUpdateQuantity }) => {
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="container pt-3 pb-4">
      <h1 className="h2 text-vintage-accent mb-4 border-bottom pb-2">
        Your Cart
      </h1>
      <div className="row">
        <div className="col-lg-8">
          {cartItems.length === 0 ? (
            <div className="alert alert-warning">Your cart is empty.</div>
          ) : (
            <div className="list-group vintage-card-shadow border-0 rounded-3">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="list-group-item d-flex align-items-center p-3"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="rounded me-3"
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                    }}
                  />
                  <div className="flex-grow-1">
                    <h6 className="mb-1">{item.title}</h6>
                    <p className="mb-0 small text-muted">
                      {formatCurrency(item.price)} each
                    </p>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <div className="input-group" style={{ width: "100px" }}>
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => onUpdateQuantity(item.id, -1)}
                      >
                        -
                      </button>
                      <span className="input-group-text p-1">
                        {item.quantity}
                      </span>
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => onUpdateQuantity(item.id, 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="btn btn-sm text-danger"
                      onClick={() => onRemoveItem(item.id)}
                      aria-label="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="col-lg-4 mt-4 mt-lg-0">
          <div className="card p-4 vintage-card-shadow border-0">
            <h5 className="card-title text-vintage-accent mb-3">
              Order Summary
            </h5>
            <div className="d-flex justify-content-between mb-2">
              <span>Subtotal:</span>
              <span>{formatCurrency(cartTotal)}</span>
            </div>
            <div className="d-flex justify-content-between mb-4 border-top pt-2">
              <span className="fw-bold">Total:</span>
              <span className="fw-bold h5 text-vintage-accent">
                {formatCurrency(cartTotal)}
              </span>
            </div>
            <button
              className="btn btn-vintage w-100 py-2"
              onClick={() => setView(VIEWS.CHECKOUT)}
              disabled={cartItems.length === 0}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ===========================
   CHECKOUT VIEW (payment still mock)
   =========================== */

const CheckoutView = ({ cartTotal, setView }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [qrCodeShown, setQrCodeShown] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // You can call your real checkout API here
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setQrCodeShown(true);
    setIsProcessing(false);
  };

  const handleQrScanComplete = async () => {
    // You can call your real payment-confirm API here
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    console.log(
      `[MOCK API] Payment confirmed for total: ${formatCurrency(
        cartTotal
      )}. Placing order.`
    );
    setOrderPlaced(true);
    setIsProcessing(false);
  };

  if (orderPlaced) {
    return (
      <div className="container pt-4 pb-5 text-center">
        <CheckCircle size={80} className="text-success mb-4 mx-auto" />
        <h2 className="text-vintage-accent mb-3">Order Placed Successfully!</h2>
        <p className="lead text-muted">
          Thank you for your purchase. Your order confirmation will be sent
          shortly.
        </p>
        <button
          className="btn btn-vintage mt-4"
          onClick={() => setView(VIEWS.PRODUCT)}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  if (qrCodeShown) {
    return (
      <div
        className="container pt-4 pb-5 text-center"
        style={{ maxWidth: "600px" }}
      >
        <h1 className="h2 text-vintage-accent mb-4 border-bottom pb-2">
          Scan to Complete Payment
        </h1>
        <div className="card p-4 vintage-card-shadow border-0">
          <QrCode size={40} className="text-vintage-accent mx-auto mb-3" />
          <p className="lead fw-bold mb-3">
            Total Amount: {formatCurrency(cartTotal)}
          </p>

          <div className="mx-auto my-4 p-3 border rounded-lg bg-light d-inline-block">
            <img
              src={`https://placehold.co/200x200/a35d48/ffffff?text=SCAN+TO+PAY\n${cartTotal}`}
              alt="Payment QR Code"
              style={{ width: "200px", height: "200px" }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://placehold.co/200x200/3e2723/f8f5ed?text=QR+Error";
              }}
            />
          </div>

          <p className="text-muted small">
            Please use your preferred UPI or payment app to scan the code above.
            The payment process will complete automatically upon successful
            transfer.
          </p>

          <button
            className="btn btn-success w-100 py-2 mt-4 d-flex align-items-center justify-content-center gap-2"
            onClick={handleQrScanComplete}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 size={20} className="spin-anim" />
                Waiting for Payment...
              </>
            ) : (
              "Simulate Successful Scan"
            )}
          </button>
          <button
            className="btn btn-link text-muted mt-2"
            onClick={() => setQrCodeShown(false)}
            disabled={isProcessing}
          >
            Change Payment Method
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container pt-4 pb-5" style={{ maxWidth: "600px" }}>
      <h1 className="h2 text-vintage-accent mb-4 border-bottom pb-2">
        Secure Checkout
      </h1>
      <div className="card p-4 vintage-card-shadow border-0">
        <form onSubmit={handleSubmit}>
          <h5 className="mb-3">Shipping Information</h5>
          <div className="mb-3">
            <label className="form-label small">Full Name</label>
            <input
              type="text"
              className="form-control"
              required
              placeholder="John Doe"
            />
          </div>
          <div className="mb-3">
            <label className="form-label small">Address</label>
            <input
              type="text"
              className="form-control"
              required
              placeholder="123 Writer's Alley"
            />
          </div>

          <h5 className="mb-3 mt-4">Payment Method</h5>
          <div className="alert alert-info small d-flex align-items-center gap-2">
            <QrCode size={20} />
            Payment via QR Code / UPI is the default method.
          </div>

          <div className="d-flex justify-content-between my-4 border-top pt-3">
            <span className="fw-bold">Order Total:</span>
            <span className="fw-bold h4 text-vintage-accent">
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
                <DollarSign size={20} />
                Pay Now (Show QR)
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

/* ===========================
   MAIN JOURNAL PAGE
   =========================== */

const Journal = () => {
  const [currentView, setCurrentView] = useState(VIEWS.PRODUCT);
  const [quantity, setQuantity] = useState(1);
  const [loadingId, setLoadingId] = useState(null);
  const [cartItems, setCartItems] = useState([]); // start empty, use backend
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Add to cart: calls real backend, then updates local state
  const handleAddToCart = async (product) => {
    try {
      setLoadingId(product.id);

      await addOrUpdateCart(USER_ID, product.id, quantity);

      const existingItemIndex = cartItems.findIndex(
        (item) => item.id === product.id
      );

      if (existingItemIndex > -1) {
        const updatedItems = cartItems.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        setCartItems(updatedItems);
      } else {
        setCartItems([
          ...cartItems,
          { ...product, quantity, image: product.images[0] },
        ]);
      }

      setQuantity(1);
      setCurrentView(VIEWS.CART);
    } catch (err) {
      console.error("AddOrUpdateCart error:", err);
      alert("Could not add item to cart. Please try again.");
    } finally {
      setLoadingId(null);
    }
  };

  // Remove item from cart
  const handleRemoveFromCart = async (productId) => {
    try {
      await removeProductFromCart(USER_ID, productId);
      setCartItems((items) => items.filter((i) => i.id !== productId));
    } catch (err) {
      console.error("removeProductFromCart error:", err);
      alert("Could not remove item from cart. Please try again.");
    }
  };

  // Change quantity (+/-)
  const handleUpdateQuantity = async (productId, delta) => {
    setCartItems((items) => {
      return items.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      );
    });

    const item = cartItems.find((i) => i.id === productId);
    if (!item) return;

    const newQty = Math.max(1, item.quantity + delta);

    try {
      await addOrUpdateCart(USER_ID, productId, newQty);
    } catch (err) {
      console.error("AddOrUpdateCart (qty change) error:", err);
      alert("Could not update quantity. Please try again.");
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case VIEWS.CART:
        return (
          <CartView
            cartItems={cartItems}
            setView={setCurrentView}
            onRemoveItem={handleRemoveFromCart}
            onUpdateQuantity={handleUpdateQuantity}
          />
        );
      case VIEWS.CHECKOUT:
        return <CheckoutView cartTotal={cartTotal} setView={setCurrentView} />;
      case VIEWS.PRODUCT:
      default:
        return (
          <ProductDetailView
            product={mockProduct}
            quantity={quantity}
            setQuantity={setQuantity}
            loadingId={loadingId}
            handleAddToCart={handleAddToCart}
          />
        );
    }
  };

  return (
    <div className="page-bg">
      <CustomStyles />

      {/* NAVBAR */}
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
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main
        className="main-content"
        style={{ paddingTop: "120px", paddingBottom: "16px" }}
      >
        {renderContent()}
      </main>

      {/* FOOTER */}
      <footer className="glass-footer d-flex flex-column flex-md-row align-items-center justify-content-between px-4 text-center text-md-start">
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

      {/* Scrapbook Navbar/Footer Styles */}
      <style>{`
  /* GLOBAL LAYOUT */
  html, body, #root {
    height: 100%;
    margin: 0;
    padding: 0;
  }

  body {
    background-color: #fdf8f3;
    font-family: "Lora", serif;
  }

  .page-bg {
    background-color: #f8f5ed;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    color: #3e2723;
  }

  .main-content {
    flex: 1; /* pushes footer to bottom */
  }

  /* NAVBAR (Bootstrap 5 friendly) */
  .navbar {
    background: #7a5c4d url("https://www.transparenttextures.com/patterns/leather.png");
    border-bottom: 3px dashed #f8ead8;
    box-shadow: 0 4px 15px rgba(58, 37, 18, 0.3);
  }

  .navbar-brand span {
    font-family: "Caveat", cursive;
    color: #fff8f0;
    letter-spacing: 1.5px;
  }

  .nav-link {
    color: #f8ead8 !important;
    font-family: "Poppins", sans-serif;
    font-weight: 500;
    transition: 0.3s;
  }

  .nav-link:hover {
    color: #ffe6b3 !important;
  }

  .navbar-toggler {
    border-color: #f8ead8;
  }

  .navbar-toggler-icon {
    /* custom icon so it’s visible on all devices */
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba(248,234,216, 0.9)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
  }

  /* TYPOGRAPHY */
  h1, h4, h6 {
    font-family: "Cormorant Garamond", serif;
    font-weight: 600;
    color: #4a2e20;
  }

  .text-vintage-accent {
    color: #a35d48 !important;
  }

  /* CARDS */
  .vintage-card-shadow {
    border: 1px solid #e6dfd4;
    border-radius: 10px;
    background: #fffdf8;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  }

  /* BUTTONS */
  .btn-vintage {
    background-color: #a35d48;
    border: none;
    color: #ffffff;
    padding: 8px 18px;
    border-radius: 6px;
    font-size: 15px;
    transition: 0.2s;
  }

  .btn-vintage:hover {
    background-color: #8c4c3e;
  }

  /* IMAGE CAROUSEL – RESPONSIVE */
  .carousel-image {
    width: 100%;
    height: auto;
    object-fit: cover;
    object-position: 55% center;
    border-radius: 8px;
    display: block;
  }

  /* on larger screens, give fixed height for nice layout */
  @media (min-width: 992px) {
    .carousel-image {
      height: 550px;
    }
  }

  .carousel-wrapper,
  .carousel-slide {
    padding: 0 !important;
    margin: 0 !important;
  }

  /* SPINNER */
  .spin-anim {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  /* ===========================
     FOOTER – RESPONSIVE
     =========================== */
  .glass-footer {
    background: #7a5c4d
      url("https://www.transparenttextures.com/patterns/paper-1.png");
    color: #fdf8f3;
    border-top: 3px dashed #f8ead8;
    position: relative;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1.5rem;

    padding: 2.5rem 2rem;
    min-height: 150px;
  }

  .glass-footer::before,
  .glass-footer::after {
    content: "";
    position: absolute;
    width: 60px;
    height: 28px;
    background: #e8d5b7;
    top: -14px;
    border: 1px solid #d1b38f;
    border-radius: 4px;
  }

  .glass-footer::before {
    left: 12%;
    transform: rotate(-3deg);
  }

  .glass-footer::after {
    right: 12%;
    transform: rotate(3deg);
  }

  .footer-title h4 {
    font-family: "Caveat Brush", cursive;
    color: #ffe6b3;
    text-shadow: 1px 1px 0 #4d3b2b;
    margin-bottom: 0.25rem;
  }

  .footer-title span {
    font-size: 0.85rem;
    opacity: 0.9;
  }

  .quick-links h6 {
    font-family: "Caveat", cursive;
    font-size: 1.3rem;
    color: #fff0d8;
    margin-bottom: 0.75rem;
  }

  .quick-links .footer-links {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .footer-link {
    color: #fceac7;
    text-decoration: none;
    font-size: 1rem;
    cursor: pointer;
    transition: color 0.3s ease, transform 0.2s ease;
  }

  .footer-link:hover {
    color: #ffe6b3;
    transform: translateY(-2px);
  }

  .social-icons {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .social-icons a {
    font-size: 1.4rem;
    color: #ffe6b3;
    transition: all 0.3s ease;
    text-decoration: none;
  }

  .social-icons a:hover {
    color: #ffffff;
    transform: scale(1.1);
  }

  /* Small screens: stack footer vertically */
  @media (max-width: 768px) {
    .glass-footer {
      flex-direction: column;
      text-align: center;
      align-items: center;
      padding: 2rem 1.5rem;
      min-height: 170px;
    }

    .glass-footer::before,
    .glass-footer::after {
      display: none;
    }

    .quick-links .footer-links {
      justify-content: center;
    }

    .social-icons {
      justify-content: center;
    }
  }

  /* Medium screens */
  @media (min-width: 769px) and (max-width: 1199px) {
    .glass-footer {
      padding: 2.5rem 3rem;
      min-height: 160px;
    }
  }

  /* Large / desktop */
  @media (min-width: 1200px) {
    .glass-footer {
      padding: 3rem 4rem;
      min-height: 180px;
    }
  }
`}</style>

      {/* Bootstrap 5 JS */}
      <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
        crossOrigin="anonymous"
      ></script>
    </div>
  );
};

export default Journal;
