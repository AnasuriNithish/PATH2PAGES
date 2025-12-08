// src/components/Checkout.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const CART_KEY = "pathtopages_cart";
const USER_KEY = "ptp_user";
const UPI_ID = "pathtopages@upi"; // update with real UPI ID when ready

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [error, setError] = useState("");

  // Rotating hero tagline
  const [heroTagline, setHeroTagline] = useState(
    "Checkout • Address • Payment"
  );

  // Local order note (only on this device)
  const [orderNote, setOrderNote] = useState("");

  // Payment method selection (UI only)
  const [paymentMethod, setPaymentMethod] = useState("upi");

  // ---- helpers ----
  const updateCustomerField = (field, value) => {
    setCustomer((prev) => {
      const updated = { ...(prev || {}), [field]: value };

      try {
        const raw = localStorage.getItem(USER_KEY);
        if (raw) {
          const u = JSON.parse(raw);
          const newUser = { ...u, [field]: value };
          localStorage.setItem(USER_KEY, JSON.stringify(newUser));
        }
      } catch (err) {
        console.error("Failed to update user in localStorage:", err);
      }

      return updated;
    });
  };

  // Load cart + customer from localStorage
  useEffect(() => {
    // Cart
    try {
      const rawCart = localStorage.getItem(CART_KEY);
      const parsed = rawCart ? JSON.parse(rawCart) : [];
      setCartItems(Array.isArray(parsed) ? parsed : []);
    } catch (err) {
      console.error("Failed to read cart:", err);
      setCartItems([]);
    }

    // Customer
    try {
      const rawUser = localStorage.getItem(USER_KEY);
      if (!rawUser) {
        setCustomer(null);
        setError(
          "We could not detect your account details. Please log in and then proceed to checkout again."
        );
        return;
      }

      const u = JSON.parse(rawUser);
      const customerData = {
        name: u.name || "",
        email: u.email || "",
        phone: u.phone || "",
        address: u.fullAddress || u.address || "",
        city: u.city || "",
        pincode: u.pincode || "",
      };

      setCustomer(customerData);
    } catch (err) {
      console.error("Failed to read user from localStorage:", err);
      setCustomer(null);
      setError(
        "There was a problem loading your saved details. Please log in again."
      );
    }
  }, []);

  // Rotating tagline
  useEffect(() => {
    const phrases = [
      "Checkout • Address • Payment",
      "Almost done – cozy parcel loading",
      "Confirm details • Scan • Pay",
      "One step away from your storybook",
    ];
    let index = 0;
    const id = setInterval(() => {
      index = (index + 1) % phrases.length;
      setHeroTagline(phrases[index]);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  // Totals
  const totalPrice = useMemo(() => {
    if (!cartItems || cartItems.length === 0) return 0;
    return cartItems.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.quantity) || 1;
      return sum + price * qty;
    }, 0);
  }, [cartItems]);

  const totalItemsCount = useMemo(
    () =>
      cartItems.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0),
    [cartItems]
  );

  const handlePay = (e) => {
    e.preventDefault();
    if (!cartItems.length) {
      alert("Your cart is empty.");
      return;
    }

    alert(
      `Demo payment:\n\nSend ₹${totalPrice.toFixed(
        2
      )} to ${UPI_ID} using your UPI app.\nSelected method: ${paymentMethod.toUpperCase()}.\n\n(Integrate payment gateway later.)`
    );
  };

  // ================== RENDER: NO CUSTOMER (not logged in) ==================
  if (!customer) {
    return (
      <>
        {/* Navbar */}
        <nav className="navbar navbar-expand-lg px-3 py-2 checkout-navbar shadow-sm">
          <div className="container-fluid">
            <Link to="/" className="navbar-brand d-flex align-items-center">
              <img
                src={process.env.PUBLIC_URL + "/logo.png"}
                alt="Logo"
                height="36"
              />
              <span className="ms-2 fs-4 fw-semibold checkout-brand-text">
                PathToPages
              </span>
            </Link>
          </div>
        </nav>

        <main className="checkout-main container">
          <section className="checkout-hero mb-3">
            <span className="checkout-pill mb-2">{heroTagline}</span>
            <h1 className="h2 mt-2 mb-2 checkout-hero-title">
              We need your cozy account first
            </h1>
            <p className="small mb-0 checkout-hero-subtitle">
              Log in or create an account so we can safely attach this order to
              your name and address.
            </p>

            {/* Stepper */}
            <div className="checkout-steps mt-3">
              <div className="checkout-step completed">
                <span className="circle">1</span>
                <span className="label">Cart</span>
              </div>
              <div className="checkout-step active">
                <span className="circle">2</span>
                <span className="label">Account</span>
              </div>
              <div className="checkout-step">
                <span className="circle">3</span>
                <span className="label">Payment</span>
              </div>
            </div>
          </section>

          <div className="checkout-empty-card mb-5">
            {error && (
              <div className="alert alert-danger small mb-3">{error}</div>
            )}
            <Link to="/profile" className="btn checkout-btn-primary">
              Go to Login / My Account
            </Link>
          </div>
        </main>

        {/* Footer */}
        <footer className="checkout-footer py-4">
          <div className="footer-left">
            <h5 className="footer-title mb-1">Path To Pages</h5>
            <p className="footer-subtext small mb-0">
              Turning phone galleries into cozy paper stories.
            </p>
          </div>

          <div className="footer-right">
            <p className="small footer-copy mb-0">
              © {new Date().getFullYear()} PathToPages
            </p>
          </div>
        </footer>

        <CheckoutStyles />
      </>
    );
  }

  // ================== RENDER: MAIN CHECKOUT ==================
  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg px-3 py-2 checkout-navbar shadow-sm">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand d-flex align-items-center">
            <img
              src={process.env.PUBLIC_URL + "/logo.png"}
              alt="Logo"
              height="36"
            />
            <span className="ms-2 fs-4 fw-semibold checkout-brand-text">
              PathToPages
            </span>
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#checkoutNav"
            aria-controls="checkoutNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="checkoutNav">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
              <li className="nav-item">
                <Link to="/" className="nav-link checkout-nav-link px-3">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/shop" className="nav-link checkout-nav-link px-3">
                  Shop
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/cart" className="nav-link checkout-nav-link px-3">
                  Cart
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/profile" className="nav-link checkout-nav-link px-3">
                  Profile
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* MAIN: hero + layout */}
      <main className="checkout-main container">
        {/* Hero */}
        <section className="checkout-hero mb-4">
          <span className="checkout-pill mb-2">{heroTagline}</span>
          <h1 className="h2 mt-2 mb-2 checkout-hero-title">
            Last step before your pages arrive
          </h1>
          <p className="small mb-2 checkout-hero-subtitle">
            Review your order and confirm your city & pincode. We’ll use these
            details to ship your scrapbooks and sticker sets to the right door.
          </p>

          {/* Stepper & chips */}
          <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between mt-2">
            <div className="checkout-steps mb-2 mb-md-0">
              <div className="checkout-step completed">
                <span className="circle">1</span>
                <span className="label">Cart</span>
              </div>
              <div className="checkout-step completed">
                <span className="circle">2</span>
                <span className="label">Details</span>
              </div>
              <div className="checkout-step active">
                <span className="circle">3</span>
                <span className="label">Payment</span>
              </div>
            </div>

            <div className="checkout-chips d-flex flex-wrap gap-2">
              <span className="chip-soft">
                Items: {cartItems.length} / {totalItemsCount} pcs
              </span>
              <span className="chip-soft">Total: ₹{totalPrice.toFixed(2)}</span>
              {customer.city && (
                <span className="chip-soft alt">
                  Ship to: {customer.city}
                  {customer.pincode && ` • ${customer.pincode}`}
                </span>
              )}
            </div>
          </div>
        </section>

        {error && (
          <div className="alert alert-warning small mb-4 checkout-alert">
            {error}
          </div>
        )}

        {/* MAIN ROW: left products, right customer + payment */}
        <div className="row g-4">
          {/* LEFT – Products */}
          <div className="col-lg-7">
            <div className="checkout-card h-100">
              <h4 className="checkout-card-title mb-3">Your Order</h4>
              {cartItems.length === 0 ? (
                <p className="text-muted mb-0 small">
                  Your cart is empty.{" "}
                  <Link to="/shop" className="checkout-link">
                    Go back to shop
                  </Link>
                  .
                </p>
              ) : (
                <>
                  <ul className="list-group list-group-flush">
                    {cartItems.map((item, idx) => {
                      const name = item.title || item.name || "Product";
                      const qty = Number(item.quantity) || 1;
                      const price = Number(item.price) || 0;
                      const lineTotal = price * qty;
                      const image = item.image;

                      return (
                        <li
                          key={idx}
                          className="list-group-item py-3 checkout-list-item"
                        >
                          <div className="d-flex align-items-center gap-3">
                            {/* Polaroid Image */}
                            <div className="checkout-polaroid">
                              {image ? (
                                <img
                                  src={image}
                                  alt={name}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src =
                                      "https://placehold.co/80x80/3e2723/f8f5ed?text=PTP";
                                  }}
                                />
                              ) : (
                                <div className="checkout-polaroid-empty">
                                  No image
                                </div>
                              )}
                              <span className="checkout-polaroid-caption">
                                For this order
                              </span>
                            </div>

                            {/* Info */}
                            <div className="flex-grow-1">
                              <div className="fw-semibold small checkout-item-name">
                                {name}
                              </div>
                              <div className="text-muted small">
                                Qty: {qty} × ₹{price}
                              </div>
                            </div>

                            {/* Line total */}
                            <div className="fw-bold small checkout-line-total">
                              ₹{lineTotal.toFixed(2)}
                            </div>
                          </div>
                        </li>
                      );
                    })}
                    <li className="list-group-item pt-3 mt-2 checkout-total-row d-flex justify-content-between align-items-center">
                      <span className="fw-bold">Total</span>
                      <span className="fw-bold checkout-total-amount">
                        ₹{totalPrice.toFixed(2)}
                      </span>
                    </li>
                  </ul>

                  {/* Delivery estimate */}
                  <div className="checkout-delivery-strip mt-3">
                    <div className="small fw-semibold mb-1">
                      Estimated delivery
                    </div>
                    <p className="small mb-0 text-muted">
                      Your parcel usually ships in <strong>24–48 hours</strong>{" "}
                      after payment. Typical delivery time:{" "}
                      <strong>3–7 days</strong> depending on your city and
                      pincode.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* RIGHT – Customer + Payment */}
          <div className="col-lg-5">
            <div className="checkout-card">
              <h4 className="checkout-card-title mb-3">Customer & Payment</h4>

              <div className="mb-2 small text-muted">
                These details are stored for your email and filled
                automatically. Adjust <strong>city</strong> and{" "}
                <strong>pincode</strong> if delivery address is different.
              </div>

              {/* Customer details */}
              <div className="mb-3">
                <label className="form-label small mb-1">Full Name</label>
                <input
                  className="form-control checkout-input"
                  value={customer.name}
                  readOnly
                />
              </div>
              <div className="mb-3">
                <label className="form-label small mb-1">Email</label>
                <input
                  className="form-control checkout-input"
                  value={customer.email}
                  readOnly
                />
              </div>
              <div className="mb-3">
                <label className="form-label small mb-1">Phone</label>
                <input
                  className="form-control checkout-input"
                  value={customer.phone}
                  readOnly
                />
              </div>
              <div className="mb-3">
                <label className="form-label small mb-1">Address</label>
                <textarea
                  className="form-control checkout-input"
                  rows={2}
                  value={customer.address}
                  readOnly
                />
              </div>

              <div className="row">
                <div className="col-6 mb-3">
                  <label className="form-label small mb-1">City</label>
                  <input
                    className="form-control checkout-input"
                    value={customer.city}
                    onChange={(e) =>
                      updateCustomerField("city", e.target.value)
                    }
                  />
                </div>
                <div className="col-6 mb-3">
                  <label className="form-label small mb-1">Pincode</label>
                  <input
                    className="form-control checkout-input"
                    value={customer.pincode}
                    onChange={(e) =>
                      updateCustomerField("pincode", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Order note */}
              <div className="mb-3">
                <label className="form-label small mb-1">
                  Order note (optional)
                </label>
                <textarea
                  className="form-control checkout-input checkout-note-input"
                  rows={2}
                  placeholder="Any small note about this order (gift name, preferred delivery instruction, etc.). Local use only."
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                />
                <p className="tiny-note mt-1 mb-0">
                  This note is stored only on this device (not sent to any
                  server).
                </p>
              </div>

              <hr className="my-3" />

              {/* Payment choice + UPI info */}
              <h5 className="mb-2 small fw-semibold">Payment method (demo)</h5>

              <div className="checkout-payment-pills mb-2">
                <button
                  type="button"
                  className={
                    "payment-pill " + (paymentMethod === "upi" ? "active" : "")
                  }
                  onClick={() => setPaymentMethod("upi")}
                >
                  UPI
                </button>
                <button
                  type="button"
                  className={
                    "payment-pill " + (paymentMethod === "gpay" ? "active" : "")
                  }
                  onClick={() => setPaymentMethod("gpay")}
                >
                  Google Pay
                </button>
                <button
                  type="button"
                  className={
                    "payment-pill " +
                    (paymentMethod === "phonepe" ? "active" : "")
                  }
                  onClick={() => setPaymentMethod("phonepe")}
                >
                  PhonePe
                </button>
              </div>

              <div className="checkout-info-box small mb-3">
                Pay securely using your UPI app. Use this UPI ID:{" "}
                <strong>{UPI_ID}</strong> or scan the QR code below. Once
                payment is complete, your order will be processed for this email
                and address.
              </div>

              <div className="d-flex justify-content-center mb-3">
                <div className="checkout-qr-placeholder">
                  QR Code Payment
                  <br />
                  (Coming soon)
                </div>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span className="fw-semibold small">Amount to pay</span>
                <span className="fw-bold small checkout-total-amount">
                  ₹{totalPrice.toFixed(2)}
                </span>
              </div>

              <button
                className="btn checkout-btn-primary w-100 mb-2"
                onClick={handlePay}
              >
                Pay ₹{totalPrice.toFixed(2)}
              </button>

              <div className="mt-2 text-center small text-muted">
                To permanently change address, phone, or name, update them in{" "}
                <Link to="/profile" className="checkout-link">
                  My Account
                </Link>{" "}
                and come back to checkout.
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="checkout-footer py-4">
        <div className="footer-left">
          <h5 className="footer-title mb-1">Path To Pages</h5>
          <p className="footer-subtext small mb-0">
            Scrapbook journal market • Hand-crafted memory books.
          </p>
        </div>

        <div className="footer-right small footer-copy">
          © {new Date().getFullYear()} Path To Pages. All rights reserved.
          Unauthorized copying or distribution of this website, its design,
          products, and content is prohibited.
        </div>
      </footer>

      <CheckoutStyles />
    </>
  );
};

const CheckoutStyles = () => (
  <style jsx="true">{`
    @import url("https://fonts.googleapis.com/css2?family=Dancing+Script:wght@500;600;700&family=Poppins:wght@300;400;500;600&display=swap");

    body {
      background-color: #fdf6ec;
      font-family: "Poppins", sans-serif;
      color: #3e2723;
    }

    .checkout-main {
      padding-top: 110px;
      padding-bottom: 40px;
    }

    /* NAVBAR – scrapbook strip */
    .checkout-navbar {
      background: #f3e3c9;
      border-bottom: 2px dashed #c49b6c;
      box-shadow: 0 4px 15px rgba(151, 107, 60, 0.25);
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
    }

    .checkout-brand-text {
      font-family: "Dancing Script", cursive;
      color: #6b4a2f;
      letter-spacing: 1px;
    }

    .checkout-nav-link {
      color: #7b5533 !important;
      font-weight: 500;
      position: relative;
      font-size: 0.95rem;
    }

    .checkout-nav-link::after {
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

    .checkout-nav-link:hover::after {
      width: 70%;
    }

    .navbar-toggler {
      border-color: #c49b6c;
    }

    .navbar-toggler-icon {
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba(123,85,51,0.9)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
    }

    /* HERO – scrapbook header */
    .checkout-hero {
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
      margin-top: 0.25rem;
    }

    .checkout-hero::before,
    .checkout-hero::after {
      content: "";
      position: absolute;
      width: 70px;
      height: 20px;
      background: rgba(255, 244, 210, 0.95);
      top: -12px;
      border-radius: 4px;
      box-shadow: 0 2px 6px rgba(136, 97, 63, 0.4);
    }

    .checkout-hero::before {
      left: 12%;
      transform: rotate(-8deg);
    }

    .checkout-hero::after {
      right: 14%;
      transform: rotate(7deg);
    }

    .checkout-pill {
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

    .checkout-hero-title {
      font-family: "Dancing Script", cursive;
      color: #5d4029;
      text-shadow: 0 2px 0 rgba(255, 255, 255, 0.7);
    }

    .checkout-hero-subtitle {
      color: #7a5a3c;
      max-width: 640px;
    }

    /* STEPPER */
    .checkout-steps {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .checkout-step {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      font-size: 0.8rem;
      color: #8a7a6c;
    }

    .checkout-step .circle {
      width: 20px;
      height: 20px;
      border-radius: 999px;
      border: 1px dashed #d1b38f;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      background: #fffdf8;
    }

    .checkout-step.completed .circle {
      background: #f5d3b0;
      color: #4a2e20;
      border-style: solid;
    }

    .checkout-step.active .circle {
      background: #f08c6a;
      color: #ffffff;
      border-color: #f08c6a;
    }

    .checkout-step .label {
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    /* CHIPS */
    .checkout-chips .chip-soft {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.78rem;
      padding: 0.25rem 0.7rem;
      border-radius: 999px;
      border: 1px dashed #d7a16e;
      background: #fffaf3;
      color: #7b5533;
    }

    .checkout-chips .chip-soft.alt {
      background: #e1f6d5;
      border-color: #9ac58b;
      color: #3e6b2b;
    }

    /* CARDS */
    .checkout-card {
      border-radius: 20px;
      background: #fffdf8;
      box-shadow: 0 16px 30px rgba(141, 103, 64, 0.15);
      border: 1px dashed #e0c3a4;
      padding: 1.5rem;
      position: relative;
      overflow: hidden;
    }

    .checkout-card::before {
      content: "";
      position: absolute;
      inset: 0;
      background-image: linear-gradient(
        to bottom,
        rgba(255, 223, 186, 0.45) 1px,
        transparent 1px
      );
      background-size: 100% 28px;
      opacity: 0.45;
      pointer-events: none;
    }

    .checkout-card > * {
      position: relative;
      z-index: 1;
    }

    .checkout-card-title {
      font-family: "Dancing Script", cursive;
      font-size: 1.6rem;
      color: #4a2e20;
    }

    /* Order list */
    .checkout-list-item {
      background: transparent;
      border-color: #f0dfcf !important;
    }

    .checkout-polaroid {
      width: 80px;
      background: #ffffff;
      padding: 4px 4px 12px;
      border-radius: 10px;
      box-shadow: 0 10px 18px rgba(87, 63, 42, 0.35);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3px;
      flex-shrink: 0;
    }

    .checkout-polaroid img {
      width: 100%;
      height: 60px;
      object-fit: cover;
      border-radius: 6px;
    }

    .checkout-polaroid-empty {
      width: 100%;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.65rem;
      color: #8d6e5a;
      background: #fff4e4;
      border-radius: 6px;
    }

    .checkout-polaroid-caption {
      font-size: 0.65rem;
      color: #6f4b31;
      font-style: italic;
    }

    .checkout-item-name {
      color: #4a2e20;
    }

    .checkout-line-total {
      color: #a35d48;
    }

    .checkout-total-row {
      border-top: 1px dashed #e0c3a4 !important;
    }

    .checkout-total-amount {
      color: #a35d48;
    }

    /* Delivery strip */
    .checkout-delivery-strip {
      margin-top: 0.9rem;
      padding: 0.75rem 0.9rem;
      border-radius: 14px;
      border: 1px dashed #d7a16e;
      background: #fff5e2;
      box-shadow: 0 6px 14px rgba(141, 103, 64, 0.12);
    }

    /* Inputs */
    .checkout-input {
      background: #fffdf8;
      border: 1px dashed #d0b084;
      border-radius: 10px;
      font-size: 0.95rem;
    }

    .checkout-input:focus {
      border-color: #c49a6c;
      box-shadow: 0 0 0 0.15rem rgba(196, 154, 108, 0.25);
    }

    .checkout-note-input {
      font-size: 0.85rem;
    }

    .tiny-note {
      font-size: 0.7rem;
      color: #8a7a6c;
    }

    /* Info box */
    .checkout-info-box {
      border-radius: 12px;
      border: 1px dashed #9b7653;
      background: #fff8ed;
      padding: 0.75rem 0.9rem;
      color: #5b3a25;
    }

    /* Payment pills */
    .checkout-payment-pills {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      margin-bottom: 0.3rem;
    }

    .payment-pill {
      border-radius: 999px;
      border: 1px dashed #d0b084;
      background: #fffaf3;
      font-size: 0.78rem;
      padding: 0.25rem 0.8rem;
      cursor: pointer;
      color: #7b5533;
    }

    .payment-pill.active {
      background: #f08c6a;
      border-style: solid;
      color: #ffffff;
      box-shadow: 0 4px 10px rgba(240, 140, 106, 0.6);
    }

    /* QR placeholder */
    .checkout-qr-placeholder {
      width: 150px;
      height: 150px;
      border-radius: 12px;
      border: 2px dashed #9b7653;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      background-color: #fffdf8;
      text-align: center;
      line-height: 1.3;
    }

    /* Buttons & links */
    .checkout-btn-primary {
      background: linear-gradient(135deg, #f08c6a, #f6b18b);
      border: none;
      color: #ffffff;
      border-radius: 999px;
      font-weight: 500;
      font-size: 0.95rem;
      padding: 0.6rem 1.4rem;
      box-shadow: 0 4px 12px rgba(240, 140, 106, 0.55);
    }

    .checkout-btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(240, 140, 106, 0.7);
    }

    .checkout-link {
      color: #a35d48;
      text-decoration: none;
      font-weight: 500;
    }

    .checkout-link:hover {
      text-decoration: underline;
    }

    /* Empty state card */
    .checkout-empty-card {
      border-radius: 20px;
      background: #fffdf8;
      box-shadow: 0 16px 30px rgba(141, 103, 64, 0.14);
      border: 2px dashed #e0c3a4;
      padding: 2rem 1.5rem;
      text-align: center;
    }

    /* Footer */
    .checkout-footer {
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

    .checkout-footer::before,
    .checkout-footer::after {
      content: "";
      position: absolute;
      width: 70px;
      height: 22px;
      background: #ffeccd;
      top: -10px;
      border-radius: 4px;
      border: 1px solid #d1b38f;
    }

    .checkout-footer::before {
      left: 10%;
      transform: rotate(-4deg);
    }

    .checkout-footer::after {
      right: 12%;
      transform: rotate(5deg);
    }

    .footer-left {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .footer-right {
      display: flex;
      flex-direction: column;
      justify-content: center;
      text-align: right;
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

    .footer-copy {
      color: #7b5533;
      opacity: 0.85;
      font-size: 0.78rem;
      max-width: 380px;
    }

    /* Alerts */
    .checkout-alert {
      border-radius: 10px;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .checkout-main {
        padding-top: 100px;
        padding-bottom: 30px;
      }

      .checkout-hero {
        margin-inline: 0.25rem;
      }

      .checkout-footer {
        flex-direction: column;
        text-align: center;
        padding: 2rem 1rem;
      }

      .footer-left,
      .footer-right {
        align-items: center;
        text-align: center;
      }

      .footer-copy {
        text-align: center;
      }

      .checkout-chips {
        margin-top: 0.5rem;
      }
    }
  `}</style>
);

export default Checkout;
