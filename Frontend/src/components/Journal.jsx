// src/Journal.jsx

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import { SiThreads } from "react-icons/si";

const PRODUCT_ID = "68d8f374e1f41bc52a3185e2";
const CART_KEY = "pathtopages_cart"; // keep same key used by Cart.jsx

// Product data for the main journal
const product = {
  id: PRODUCT_ID,
  title: "Journal Book",
  description:
    "An exquisite, vintage journal crafted with 200 pages of beautifully aged, premium parchment-style paper. Perfect for capturing wandering thoughts, documenting timeless travel tales, or planning your days with old-world charm and elegance..",
  price: 799,
  details: [
    "Travel Journal Book",
    "Color Craft Papers",
    "Sketching Pencil",
    "Elegant Bookmark Collection",
    "Precision Craft Scissors",
    "Pastel Sticky Note Pack",
    "Creative Sticker Set",
    "Artist’s Color Pencil Kit",
    "Strong Hold Craft Glue",
    "Pocket-Sized Mini Notebook",
    "Genuine leather cover (mock)",
    "Hand-stitched binding",
  ],
  images: [
    `${process.env.PUBLIC_URL}/IMG-20251027-WA0006.jpg`,
    `${process.env.PUBLIC_URL}/IMG-20251027-WA0005.jpg`,
    `${process.env.PUBLIC_URL}/IMG-20251027-WA0010.jpg`,
  ],
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(amount);

// Inject Bootstrap + page-specific minimal scrapbook styling
const CustomStyles = () => (
  <>
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
      crossOrigin="anonymous"
    />
    <style>
      {`
        body {
          background-color: #f8f5ed;
          font-family: "Lora", serif;
          color: #3e2723;
        }

        .page-bg {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .main-content {
          flex: 1;
        }

          /* Themed Navbar based on photo colors */
        .custom-navbar {
          background: #7a5c4d
            url("https://www.transparenttextures.com/patterns/leather.png");
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

        /* CONTENT */
        h1, h2, h4, h5 {
          color: #4a2e20;
        }

        .vintage-card-shadow {
          border-radius: 10px;
          background: #fffdf8;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
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
        }

        .btn-vintage:hover {
          background-color: #8c4c3e;
        }

        .carousel-image {
          width: 100%;
          height: 500px;
          object-fit: cover;
          border-radius: 10px;
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
      `}
    </style>
  </>
);

// Simple image carousel for journal pictures
const ProductImageCarousel = ({ images }) => {
  const [current, setCurrent] = useState(0);
  const total = images.length;

  const next = () => setCurrent((prev) => (prev + 1) % total);
  const prev = () => setCurrent((prev) => (prev - 1 + total) % total);

  return (
    <div className="position-relative vintage-card-shadow overflow-hidden">
      <img
        src={images[current]}
        alt={`Journal ${current + 1}`}
        className="carousel-image"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src =
            "https://placehold.co/800x500/3e2723/f8f5ed?text=Image+not+found";
        }}
      />

      {/* Left / Right controls */}
      <button
        type="button"
        className="btn btn-sm bg-dark bg-opacity-50 text-white rounded-circle position-absolute top-50 start-0 translate-middle-y ms-3"
        onClick={prev}
      >
        <ChevronLeft size={22} />
      </button>
      <button
        type="button"
        className="btn btn-sm bg-dark bg-opacity-50 text-white rounded-circle position-absolute top-50 end-0 translate-middle-y me-3"
        onClick={next}
      >
        <ChevronRight size={22} />
      </button>

      {/* Indicators */}
      <div className="position-absolute bottom-0 start-50 translate-middle-x d-flex gap-2 mb-3">
        {images.map((_, i) => (
          <span
            key={i}
            onClick={() => setCurrent(i)}
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              cursor: "pointer",
              backgroundColor: current === i ? "#a35d48" : "#ffffff",
              opacity: current === i ? 1 : 0.6,
            }}
          />
        ))}
      </div>
    </div>
  );
};

const Journal = () => {
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Add to cart and go to /cart
  const handleAddToCart = () => {
    try {
      const existing = JSON.parse(localStorage.getItem(CART_KEY) || "[]");

      const index = existing.findIndex((item) => item.id === PRODUCT_ID);

      if (index > -1) {
        // Update quantity if already present
        existing[index].quantity += quantity;
      } else {
        // Push new line item
        existing.push({
          id: PRODUCT_ID,
          title: product.title,
          price: product.price,
          quantity,
          image: product.images[0],
        });
      }

      localStorage.setItem(CART_KEY, JSON.stringify(existing));

      // As per requirement: go directly to Cart page
      navigate("/cart");
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Could not add item to cart. Please try again.");
    }
  };

  const handleQtyChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  return (
    <div className="page-bg">
      <CustomStyles />

      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg px-3 py-2 custom-navbar shadow-sm">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand d-flex align-items-center">
            <img
              src={process.env.PUBLIC_URL + "/logo.png"}
              alt="Logo"
              height="36"
            />
            <span className="ms-2 fs-4 fw-semibold brand-text dancing-script">
              PathToPages
            </span>
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

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
                <Link to="/cart" className="nav-link nav-link-custom px-3">
                  Cart
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/profile" className="nav-link nav-link-custom px-3">
                  Profile
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main
        className="main-content"
        style={{ paddingTop: "110px", paddingBottom: "30px" }}
      >
        <div className="container">
          <div className="row g-5">
            {/* Images section */}
            <div className="col-lg-6">
              <ProductImageCarousel images={product.images} />
            </div>

            {/* Product details section */}
            <div className="col-lg-6">
              <div className="card p-4 vintage-card-shadow border-0 h-100">
                <div className="card-body d-flex flex-column">
                  <h1 className="h2 mb-2">{product.title}</h1>
                  <p className="text-uppercase small fw-bold text-vintage-accent mb-3">
                    Handbound Collection
                  </p>

                  <p className="text-muted">{product.description}</p>

                  <div className="mt-4">
                    <h5 className="mb-2">Key Features</h5>
                    <ul className="list-unstyled text-muted small ms-3">
                      {product.details.map((d, i) => (
                        <li key={i} className="mb-1">
                          • {d}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Price & Add to Cart */}
                  <div className="mt-auto pt-4 border-top">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="h3 text-vintage-accent fw-bold">
                        {formatCurrency(product.price)}
                      </span>
                    </div>

                    <div className="d-flex align-items-center gap-3">
                      {/* Quantity selector */}
                      <div className="input-group" style={{ maxWidth: 120 }}>
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => handleQtyChange(-1)}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          className="form-control text-center"
                          min="1"
                          value={quantity}
                          onChange={(e) =>
                            setQuantity(
                              Math.max(1, parseInt(e.target.value) || 1)
                            )
                          }
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => handleQtyChange(1)}
                        >
                          +
                        </button>
                      </div>

                      {/* Add to Cart button */}
                      <button
                        type="button"
                        className="btn btn-vintage flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                        onClick={handleAddToCart}
                      >
                        <ShoppingCart size={20} />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      {/* Footer */}
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
    </div>
  );
};

export default Journal;
