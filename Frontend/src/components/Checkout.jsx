// checkout.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// Dynamically load GSAP and anime.js
const useAnimations = (checkoutRef, payBtnRef) => {
  useEffect(() => {
    const scripts = [
      "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js",
    ];
    let loaded = 0;
    scripts.forEach((src) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        loaded++;
        if (loaded === scripts.length) doAnimations();
        return;
      }
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.onload = () => {
        loaded++;
        if (loaded === scripts.length) doAnimations();
      };
      document.body.appendChild(s);
    });

    function doAnimations() {
      // GSAP: Slide-in checkout card
      window.gsap.from(checkoutRef.current, {
        y: 80,
        opacity: 0,
        duration: 1.3,
        ease: "power2.out",
      });
      // GSAP: Input fade
      window.gsap.utils.toArray(".scrap-input").forEach((el, i) => {
        window.gsap.from(el, {
          opacity: 0,
          y: 24,
          delay: 0.6 + i * 0.1,
          duration: 0.8,
        });
      });
      // anime.js: Pay button bounce
      if (payBtnRef.current) {
        window.anime({
          targets: payBtnRef.current,
          scale: [0.66, 1.09, 1],
          duration: 900,
          easing: "easeOutElastic(1, .6)",
          delay: 800,
        });
      }
    }
  }, [checkoutRef, payBtnRef]);
};

const Checkout = () => {
  const checkoutRef = useRef(null);
  const payBtnRef = useRef(null);
  const navigate = useNavigate();

  useAnimations(checkoutRef, payBtnRef);

  // Dummy cart and billing state
  const [cart, setCart] = useState([
    { name: "Travel Journal", price: 280, qty: 1 },
    { name: "Hand-drawn Bookmark", price: 45, qty: 2 },
  ]);
  const [billing, setBilling] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
    phone: "",
  });

  const handleInput = (e) => {
    setBilling({ ...billing, [e.target.name]: e.target.value });
  };

  const handlePay = (e) => {
    e.preventDefault();
    // Do payment logic here
    window.anime({
      targets: payBtnRef.current,
      scale: [1, 1.25, 0.9, 1],
      duration: 800,
      direction: "alternate",
      easing: "easeInOutQuad",
    });
    setTimeout(() => navigate("/order-success"), 1000);
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <>
      {/* Scrapbook Navbar */}
      <nav className="navbar px-4 py-2 shadow">
        <span className="navbar-brand fs-3">
          <span>✈️ PathToPages Checkout</span>
        </span>
      </nav>

      <main className="container my-5 d-flex justify-content-center">
        {/* Paper-style Checkout Card */}
        <div
          ref={checkoutRef}
          className="glass-card p-4"
          style={{ maxWidth: 540, width: "100%" }}
        >
          <h2 className="mb-3" style={{ fontFamily: "Caveat Brush, cursive" }}>
            Payment Details
          </h2>
          <form onSubmit={handlePay}>
            <div className="mb-3">
              <input
                className="form-control scrap-input"
                type="text"
                name="name"
                placeholder="Your Name"
                value={billing.name}
                onChange={handleInput}
                required
              />
            </div>
            <div className="mb-3">
              <input
                className="form-control scrap-input"
                type="email"
                name="email"
                placeholder="Email"
                value={billing.email}
                onChange={handleInput}
                required
              />
            </div>
            <div className="mb-3">
              <textarea
                className="form-control scrap-input"
                name="address"
                rows={2}
                placeholder="Delivery Address"
                value={billing.address}
                onChange={handleInput}
                required
              />
            </div>
            <div className="row">
              <div className="col-6 mb-3">
                <input
                  className="form-control scrap-input"
                  type="text"
                  name="city"
                  placeholder="City"
                  value={billing.city}
                  onChange={handleInput}
                  required
                />
              </div>
              <div className="col-6 mb-3">
                <input
                  className="form-control scrap-input"
                  type="text"
                  name="pincode"
                  placeholder="Pincode"
                  value={billing.pincode}
                  onChange={handleInput}
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <input
                className="form-control scrap-input"
                type="tel"
                name="phone"
                placeholder="Mobile Number"
                value={billing.phone}
                onChange={handleInput}
                required
              />
            </div>
            <div className="mb-4">
              <h4 className="mb-2" style={{ fontFamily: "Caveat, cursive" }}>
                Cart Summary
              </h4>
              <ul className="list-unstyled mb-2">
                {cart.map((item, idx) => (
                  <li
                    key={idx}
                    style={{ fontFamily: "Caveat, cursive", color: "#966f4b" }}
                  >
                    <span role="img" aria-label="sticker">
                      📌
                    </span>{" "}
                    {item.name} × {item.qty} — ₹{item.price * item.qty}
                  </li>
                ))}
              </ul>
              <strong
                style={{
                  color: "#ad7e50",
                  fontFamily: "Caveat Brush, cursive",
                }}
              >
                Total: ₹{totalPrice}
              </strong>
            </div>
            <button type="submit" className="btn w-100" ref={payBtnRef}>
              Pay ₹{totalPrice}
            </button>
          </form>
        </div>
      </main>
      {/* Footer */}
      <footer className="glass-footer px-4 py-4 d-flex align-items-center justify-content-between">
        <div className="footer-title">
          <h4>Path To Pages</h4>
          <span>Scrapbook journal market</span>
        </div>
        <div className="quick-links">
          <h6>Quick Links</h6>
          <ul className="list-unstyled d-flex flex-wrap justify-content-center justify-content-md-start gap-3">
            <li>
              <a href="/shop" className="footer-link">
                Shop
              </a>
            </li>
            <li>
              <a href="/faq" className="footer-link">
                FAQ
              </a>
            </li>
            <li>
              <a href="/profile" className="footer-link">
                Profile
              </a>
            </li>
          </ul>
        </div>
        <div className="social-icons">
          <a
            href="https://wa.me/918019418800"
            target="_blank"
            rel="noopener noreferrer"
            title="Whatsapp"
          >
            📱
          </a>
          <a
            href="https://www.instagram.com/pathtopages"
            target="_blank"
            rel="noopener noreferrer"
            title="Instagram"
          >
            📷
          </a>
        </div>
      </footer>

      {/* Scrapbook Journal Theme CSS */}
      <style jsx="true">{`
        /* Place your theme CSS here (as provided in previous message) */
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
          font-family: "Poppins", sans-serif;
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
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          font-family: "Poppins", sans-serif;
        }
        .glass-card:hover {
          transform: translateY(-4px);
          box-shadow: 6px 8px 0 #c49a6c;
        }
        .glass-card .card-title {
          font-family: "Caveat", cursive;
          color: #5a3b1c;
          font-size: 1.4rem;
        }
        .glass-card .card-text {
          color: #6d5844;
          font-size: 0.95rem;
        }
        button.btn {
          border: 2px dashed #9b7653;
          background: #f2dfc2;
          color: #4a3822;
          border-radius: 8px;
          transition: 0.3s;
        }
        button.btn:hover {
          background: #e7cda3;
          transform: translateY(-2px);
        }
        .glass-footer {
          background: #7a5c4d
            url("https://www.transparenttextures.com/patterns/paper-1.png");
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
};

export default Checkout;
