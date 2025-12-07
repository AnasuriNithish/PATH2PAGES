// Home.jsx (Minimalist + Themed Navbar from Photo)
// :contentReference[oaicite:1]{index=1}

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import { SiThreads } from "react-icons/si";
import { ShoppingCart } from "lucide-react";

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* ▬▬▬▬▬▬▬ NAVBAR (Leather-Themed, Minimalist) ▬▬▬▬▬▬▬ */}
      <nav className="navbar navbar-expand-lg fixed-top px-3 py-2 custom-navbar">
        <div className="container-fluid">
          {/* Logo + Brand */}
          <Link to="/" className="navbar-brand d-flex align-items-center">
            <img
              src={process.env.PUBLIC_URL + "/logo.png"}
              alt="Logo"
              height="38"
            />
            <span className="ms-2 fs-4 fw-semibold brand-text dancing-script">
              PathToPages
            </span>
          </Link>

          {/* Mobile Toggle */}
          <button
            className="navbar-toggler"
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navbar Links */}
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
                <Link to="/profile" className="nav-link nav-link-custom px-3">
                  Profile
                </Link>
              </li>

              {/* CART ICON */}
              <li className="nav-item ms-3">
                <Link to="/cart" className="position-relative cart-link">
                  <ShoppingCart size={26} className="cart-icon" />
                  <span className="badge cart-badge bg-danger text-white rounded-circle">
                    0
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* ▬▬▬▬▬▬▬ HERO SECTION ▬▬▬▬▬▬▬ */}
      <header className="d-flex flex-column justify-content-center align-items-center text-center text-white vh-100 hero-section">
        <div className="hero-overlay"></div>

        <h1 className="display-2 dancing-script fw-bold position-relative">
          Path To Pages
        </h1>
        <p className="lead position-relative mt-3 px-3">
          Capture your journeys in a beautifully crafted journal.
        </p>
      </header>

      {/* ▬▬▬▬▬▬▬ FEATURED PRODUCTS ▬▬▬▬▬▬▬ */}
      <main className="container py-5 text-center">
        <h2 className="fw-bold mb-4 text-dark dancing-script">
          Featured Products
        </h2>

        <div className="row g-4 justify-content-center">
          {/* Travel Journal */}
          <div className="col-md-4">
            <Link to="/journal" className="text-decoration-none text-dark">
              <div className="card border-0 shadow-sm h-100">
                <img
                  src="https://raw.githubusercontent.com/AnasuriNithish/PathtoPages/ab2fbd5de49fb4fbb735842755026ba7fbf96de4/Frontend/IMG-20251023-WA0020.jpg"
                  alt="Travel Journal"
                  className="card-img-top"
                  style={{ height: "280px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="fw-semibold dancing-script">Travel Journal</h5>
                  {/* <p className="small text-muted">
                    Capture your memories in style.
                  </p> */}
                </div>
              </div>
            </Link>
          </div>

          {/* Bookmark */}
          <div className="col-md-4">
            <Link to="/bookmark" className="text-decoration-none text-dark">
              <div className="card border-0 shadow-sm h-100">
                <img
                  src="https://raw.githubusercontent.com/AnasuriNithish/PathtoPages/ab2fbd5de49fb4fbb735842755026ba7fbf96de4/Frontend/IMG-20251027-WA0010.jpg"
                  alt="Bookmark"
                  className="card-img-top"
                  style={{ height: "280px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="fw-semibold dancing-script">
                    Handcrafted Bookmark
                  </h5>
                  {/* <p className="small text-muted">
                    For passionate book lovers.
                  </p> */}
                </div>
              </div>
            </Link>
          </div>
        </div>
      </main>

      {/* ▬▬▬▬▬▬▬ FOOTER ▬▬▬▬▬▬▬ */}
      <footer className="custom-footer py-4 mt-62">
        <div className="footer-left">
          <h5 className="footer-title dancing-script mb-1">Path To Pages</h5>
          {/* <p className="footer-subtext small mb-0">
            Designed with passion by Nithish
          </p> */}
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
          <a href="https://www.threads.net/pathtopages" className="footer-icon">
            <SiThreads size={22} />
          </a>
        </div>

        <div className="footer-right">
          <p className="small footer-copy mb-0">
            © {new Date().getFullYear()} PathToPages
          </p>
        </div>
      </footer>

      {/* ▬▬▬▬▬▬▬ INLINE STYLES FOR THEMED NAV + HERO ▬▬▬▬▬▬▬ */}
      <style>{`
       @import url("https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400..700&display=swap");
        .dancing-script {
          font-family: "Dancing Script", cursive;
          font-optical-sizing: auto;
          font-weight: 600; /* you can change to 400, 500, 700 etc. */
          font-style: normal;
        }
        body {
          background-color: #fdf8f3;
          font-family: "Poppins", sans-serif;
        }

        /* Themed Navbar based on photo colors */
        .custom-navbar {
          background: #7a5c4d url("https://www.transparenttextures.com/patterns/leather.png");
          border-bottom: 2px dashed #f8ead8;
          box-shadow: 0 4px 15px rgba(58, 37, 18, 0.35);
        }

        .brand-text {
          color: #fff8f0;
          letter-spacing: 1px;
        }

        .nav-link-custom {
          color: #f8ead8 !important;
          font-weight: 500;
          transition: color 0.2s ease;
        }

        .nav-link-custom:hover {
          color: #ffe6b3 !important;
        }

        .cart-icon {
          color: #fff8f0;
        }

        .cart-link:hover .cart-icon {
          color: #ffe6b3;
        }

        .cart-badge {
          font-size: 10px;
          position: absolute;
          top: -5px;
          right: -10px;
          padding: 4px 6px;
        }

        .navbar-toggler {
          border-color: #f8ead8;
        }

        .navbar-toggler-icon {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba(248,234,216,0.9)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
        }

        /* Hero section background from same image */
        .hero-section {
          position: relative;
          background-image: url('https://raw.githubusercontent.com/AnasuriNithish/PathtoPages/ab2fbd5de49fb4fbb735842755026ba7fbf96de4/Frontend/IMG-20251027-WA0027.jpg');
          background-size: cover;
          background-position: center;
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.35);
        }

        .hero-section h1,
        .hero-section p {
          position: relative;
          z-index: 1;
        }
                /* Footer Matches Navbar Leather Theme */
        .custom-footer {
          background: #7a5c4d
            url("https://www.transparenttextures.com/patterns/paper-1.png");
          border-top: 2px dashed #f8ead8;
          color: #f8ead8;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          padding-inline: 2rem;
          position: relative;
          margin-top: 260px;
        }

        /* Columns */
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

        /* Text + icons */
        .footer-title {
          color: #ffe6b3;
          font-size: 1.6rem;
        }

        .footer-subtext {
          color: #f8ead8;
          opacity: 0.85;
        }

        .footer-icon {
          color: #ffe6b3;
          transition: 0.3s ease;
        }

        .footer-icon:hover {
          color: #ffffff;
          transform: scale(1.12);
        }

        .footer-copy {
          color: #f8ead8;
          opacity: 0.85;
        }

        /* Mobile: stack & center again */
        @media (max-width: 768px) {
          .custom-footer {
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

export default Home;
