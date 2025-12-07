// src/components/Checkout.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const CART_KEY = "pathtopages_cart";
const USER_KEY = "ptp_user";
const UPI_ID = "pathtopages@upi"; // update with real UPI id

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [error, setError] = useState("");

  // helper to update city/pincode and also localStorage
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

    // Customer (saved at signup/login in Myaccount.jsx)
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

  // Total price from cart
  const totalPrice = useMemo(() => {
    if (!cartItems || cartItems.length === 0) return 0;
    return cartItems.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.quantity) || 1;
      return sum + price * qty;
    }, 0);
  }, [cartItems]);

  const handlePay = (e) => {
    e.preventDefault();
    if (!cartItems.length) {
      alert("Your cart is empty.");
      return;
    }

    // Later: integrate real UPI / Razorpay etc.
    alert(
      `Demo payment:\n\nSend ₹${totalPrice.toFixed(
        2
      )} to ${UPI_ID} using your UPI app.\n(Integrate gateway later.)`
    );
  };

  // ---------- RENDER ----------

  if (!customer) {
    return (
      <>
        <nav className="navbar px-4 py-2 shadow">
          <Link to="/" className="navbar-brand fs-3 text-decoration-none">
            <span>✈️ PathToPages</span>
          </Link>
        </nav>
        <main className="container my-5">
          {error && <div className="alert alert-danger mb-3">{error}</div>}
          <Link to="/profile" className="btn">
            Go to Login / My Account
          </Link>
        </main>
      </>
    );
  }

  return (
    <>
      {/* Navbar */}
      <nav className="navbar px-4 py-2 shadow">
        <Link to="/" className="navbar-brand fs-3 text-decoration-none">
          <span>✈️ PathToPages</span>
        </Link>
        <div className="ms-auto d-none d-md-flex gap-3">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/shop" className="nav-link">
            Shop
          </Link>
          <Link to="/cart" className="nav-link">
            Cart
          </Link>
          <Link to="/profile" className="nav-link">
            Profile
          </Link>
        </div>
      </nav>

      {/* MAIN: left products, right customer + payment */}
      <main className="container my-5">
        {error && <div className="alert alert-warning small mb-4">{error}</div>}

        <div className="row g-4">
          {/* LEFT – Products */}
          <div className="col-lg-7">
            <div className="glass-card p-4 h-100">
              <h4 className="card-title mb-3">Your Order</h4>
              {cartItems.length === 0 ? (
                <p className="text-muted mb-0">
                  Your cart is empty.{" "}
                  <Link to="/shop" className="text-decoration-none">
                    Go back to shop
                  </Link>
                  .
                </p>
              ) : (
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
                        className="list-group-item py-3"
                        style={{ background: "transparent" }}
                      >
                        <div className="d-flex align-items-center gap-3">
                          {/* Image */}
                          <div
                            style={{
                              width: 80,
                              height: 80,
                              borderRadius: 10,
                              overflow: "hidden",
                              flexShrink: 0,
                              border: "1px dashed #d0b084",
                              backgroundColor: "#fffdf8",
                            }}
                          >
                            {image ? (
                              <img
                                src={image}
                                alt={name}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src =
                                    "https://placehold.co/80x80/3e2723/f8f5ed?text=PTP";
                                }}
                              />
                            ) : (
                              <div className="d-flex w-100 h-100 align-items-center justify-content-center small text-muted">
                                No image
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-grow-1">
                            <div className="fw-semibold">{name}</div>
                            <div className="text-muted small">
                              Qty: {qty} × ₹{price}
                            </div>
                          </div>

                          {/* Line total */}
                          <div className="fw-bold">₹{lineTotal.toFixed(2)}</div>
                        </div>
                      </li>
                    );
                  })}
                  <li className="list-group-item border-top mt-2 pt-2 d-flex justify-content-between align-items-center">
                    <span className="fw-bold">Total</span>
                    <span className="fw-bold">₹{totalPrice.toFixed(2)}</span>
                  </li>
                </ul>
              )}
            </div>
          </div>

          {/* RIGHT – Customer + Payment */}
          <div className="col-lg-5">
            <div className="glass-card p-4">
              <h4 className="card-title mb-3">Customer & Payment</h4>

              <div className="mb-2 small text-muted">
                These details are stored for your email and are filled
                automatically. You don’t need to type them again, except city
                and pincode which you can update here.
              </div>

              {/* Customer details */}
              <div className="mb-3">
                <label className="form-label small mb-1">Full Name</label>
                <input
                  className="form-control scrap-input"
                  value={customer.name}
                  readOnly
                />
              </div>
              <div className="mb-3">
                <label className="form-label small mb-1">Email</label>
                <input
                  className="form-control scrap-input"
                  value={customer.email}
                  readOnly
                />
              </div>
              <div className="mb-3">
                <label className="form-label small mb-1">Phone</label>
                <input
                  className="form-control scrap-input"
                  value={customer.phone}
                  readOnly
                />
              </div>
              <div className="mb-3">
                <label className="form-label small mb-1">Address</label>
                <textarea
                  className="form-control scrap-input"
                  rows={2}
                  value={customer.address}
                  readOnly
                />
              </div>

              <div className="row">
                <div className="col-6 mb-3">
                  <label className="form-label small mb-1">City</label>
                  <input
                    className="form-control scrap-input"
                    value={customer.city}
                    onChange={(e) =>
                      updateCustomerField("city", e.target.value)
                    }
                  />
                </div>
                <div className="col-6 mb-3">
                  <label className="form-label small mb-1">Pincode</label>
                  <input
                    className="form-control scrap-input"
                    value={customer.pincode}
                    onChange={(e) =>
                      updateCustomerField("pincode", e.target.value)
                    }
                  />
                </div>
              </div>

              <hr className="my-3" />

              {/* UPI / QR */}
              <h5 className="mb-2">UPI / QR Payment</h5>
              <div className="alert alert-info small">
                Pay securely using UPI. Use this UPI ID:{" "}
                <strong>{UPI_ID}</strong> or scan the QR code below in your UPI
                app. Once payment is complete, your order will be processed for
                this email and address.
              </div>

              <div className="d-flex justify-content-center mb-3">
                <div
                  style={{
                    width: 150,
                    height: 150,
                    borderRadius: 12,
                    border: "2px dashed #9b7653",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    backgroundColor: "#fffdf8",
                  }}
                >
                  QR Code Payment
                  <br />
                  (Coming soon)
                </div>
              </div>

              <div className="d-flex justify-content-between mb-3">
                <span className="fw-semibold">Amount to pay</span>
                <span className="fw-bold">₹{totalPrice.toFixed(2)}</span>
              </div>

              <button className="btn w-100" onClick={handlePay}>
                Pay ₹{totalPrice.toFixed(2)}
              </button>

              <div className="mt-3 text-center small text-muted">
                To permanently change address, phone, or name, update them in{" "}
                <Link to="/profile" className="text-decoration-none">
                  My Account
                </Link>{" "}
                and come back to checkout.
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer + copyright claim */}
      <footer className="glass-footer px-4 py-4 d-flex flex-wrap align-items-center justify-content-between">
        <div className="footer-title">
          <h4>Path To Pages</h4>
          <span>Scrapbook journal market</span>
        </div>
        <div className="quick-links">
          <h6>Quick Links</h6>
          <ul className="list-unstyled d-flex flex-wrap justify-content-center justify-content-md-start gap-3 mb-0">
            <li>
              <Link to="/shop" className="footer-link">
                Shop
              </Link>
            </li>
            <li>
              <Link to="/cart" className="footer-link">
                Cart
              </Link>
            </li>
            <li>
              <Link to="/profile" className="footer-link">
                Profile
              </Link>
            </li>
          </ul>
        </div>
        <div className="text-muted small ms-auto mt-2 mt-md-0">
          © {new Date().getFullYear()} Path To Pages. All rights reserved.
          Unauthorized copying, reproduction, or distribution of this website,
          its design, products, and content is strictly prohibited.
        </div>
      </footer>

      {/* Styles */}
      <style jsx="true">{`
        body {
          background-color: #fdf8f3;
          font-family: "Poppins", sans-serif;
        }

        .navbar {
          background: #7a5c4d
            url("https://www.transparenttextures.com/patterns/leather.png");
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
          font-weight: 500;
          transition: 0.3s;
        }

        .nav-link:hover {
          color: #ffe6b3 !important;
        }

        .glass-card {
          background: #fff8f0;
          border: 2px solid #e5c7a0;
          border-radius: 12px;
          box-shadow: 4px 6px 0 #d7b88e;
        }

        .glass-card .card-title {
          font-family: "Caveat", cursive;
          color: #5a3b1c;
        }

        .scrap-input {
          background: #fffdf8;
          border: 1px dashed #d0b084;
        }

        .scrap-input:focus {
          box-shadow: none;
          border-color: #b48a57;
        }

        button.btn {
          border: 2px dashed #9b7653;
          background: #f2dfc2;
          color: #4a3822;
          border-radius: 8px;
          transition: 0.3s;
        }

        button.btn:hover:enabled {
          background: #e7cda3;
          transform: translateY(-2px);
        }

        .glass-footer {
          background: #7a5c4d
            url("https://www.transparenttextures.com/patterns/paper-1.png");
          color: #fdf8f3;
          border-top: 3px dashed #f8ead8;
        }

        .footer-title h4 {
          font-family: "Caveat Brush", cursive;
          color: #ffe6b3;
        }

        .quick-links h6 {
          font-family: "Caveat", cursive;
          font-size: 1.2rem;
          color: #fff0d8;
        }

        .footer-link {
          color: #fceac7;
          text-decoration: none;
        }

        .footer-link:hover {
          color: #ffe6b3;
        }

        @media (max-width: 768px) {
          .glass-footer {
            flex-direction: column;
            text-align: center;
            gap: 0.5rem;
          }
        }
      `}</style>
    </>
  );
};

export default Checkout;
