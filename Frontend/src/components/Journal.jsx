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
    "Hand-stitched binding",
  ],
  images: [
    `${process.env.PUBLIC_URL}/Images/Book.jpg`,
    `${process.env.PUBLIC_URL}/Images/Bookmarks.jpg`,
    `${process.env.PUBLIC_URL}/Images/Colorpapers.jpg`,
    `${process.env.PUBLIC_URL}/Images/Colorpencils.jpg`,
    `${process.env.PUBLIC_URL}/Images/Display.jpg`,
    `${process.env.PUBLIC_URL}/Images/IMG-20251023-WA0022.jpg`,
    // `${process.env.PUBLIC_URL}/Images/IMG-20251027-WA0008.jpg`,
    `${process.env.PUBLIC_URL}/Images/IMG-20251027-WA0019.jpg`,
    `${process.env.PUBLIC_URL}/Images/MiniPocketNotes.jpg`,
    `${process.env.PUBLIC_URL}/Images/Pen.jpg`,
    `${process.env.PUBLIC_URL}/Images/Scissor.jpg`,
    `${process.env.PUBLIC_URL}/Images/Set.jpg`,
    `${process.env.PUBLIC_URL}/Images/Stickers.jpg`,
    `${process.env.PUBLIC_URL}/Images/StickyNotes.jpg`,
    `${process.env.PUBLIC_URL}/Images/WashiTapes.jpg`,
  ],
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(amount);

// Inject Bootstrap + page-specific scrapbook styling
const CustomStyles = () => (
  <>
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
      crossOrigin="anonymous"
    />
    <style>
      {`
        @import url("https://fonts.googleapis.com/css2?family=Dancing+Script:wght@500;600;700&family=Shadows+Into+Light&family=Poppins:wght@300;400;500;600&display=swap");

        body {
          background-color: #fdf6ec;
          font-family: "Poppins", sans-serif;
          color: #3e2723;
        }

        .dancing-script {
          font-family: "Dancing Script", cursive;
        }

        .page-bg {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .main-content {
          flex: 1;
        }

        /* NAVBAR – matches Home/Shop scrapbook vibe */
        .custom-navbar {
          background: #f3e3c9;
          border-bottom: 2px dashed #c49b6c;
          box-shadow: 0 4px 15px rgba(151, 107, 60, 0.25);
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
        }

        .brand-text {
          color: #6b4a2f;
          letter-spacing: 1px;
        }

        .nav-link-custom {
          color: #7b5533 !important;
          font-weight: 500;
          position: relative;
        }

        .nav-link-custom::after {
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

        .nav-link-custom:hover::after {
          width: 70%;
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
          border-color: #c49b6c;
        }

        .navbar-toggler-icon {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba(123,85,51,0.9)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
        }

        /* JOURNAL HERO (top text) */
        .journal-hero {
          margin-top: 100px;
          margin-bottom: 24px;
          position: relative;
          padding: 1.5rem 1.25rem;
          border-radius: 22px;
          background: radial-gradient(circle at top left, #ffe3c2 0, #fffdf8 40%, #f7ddc8 100%);
          box-shadow: 0 16px 30px rgba(141, 103, 64, 0.18);
          overflow: hidden;
        }

        .journal-hero::before,
        .journal-hero::after {
          content: "";
          position: absolute;
          width: 70px;
          height: 20px;
          background: rgba(255, 244, 210, 0.95);
          top: -12px;
          border-radius: 4px;
          box-shadow: 0 2px 6px rgba(136, 97, 63, 0.4);
        }

        .journal-hero::before {
          left: 12%;
          transform: rotate(-8deg);
        }

        .journal-hero::after {
          right: 14%;
          transform: rotate(7deg);
        }

        .journal-pill {
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

        .journal-title {
          color: #5d4029;
          text-shadow: 0 2px 0 rgba(255, 255, 255, 0.7);
        }

        .journal-subtitle {
          color: #7a5a3c;
          max-width: 640px;
        }

        /* Floating ribbon for context */
        .journal-ribbon {
          position: fixed;
          top: 95px;
          right: 16px;
          background: #ffeed8;
          border-radius: 999px;
          padding: 6px 16px;
          border: 1px dashed #d7a16e;
          box-shadow: 0 4px 10px rgba(141, 103, 64, 0.25);
          font-size: 0.8rem;
          z-index: 900;
          animation: ribbonFloat 4s ease-in-out infinite;
        }

        @keyframes ribbonFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        .journal-layout {
          margin-bottom: 40px;
        }

        h1, h2, h4, h5 {
          color: #4a2e20;
        }

        .text-vintage-accent {
          color: #a35d48 !important;
        }

        /* IMAGE SIDE – Polaroid style */
        .vintage-card-shadow {
          border-radius: 16px;
          background: #fffdf8;
          box-shadow: 0 16px 30px rgba(141, 103, 64, 0.2);
          padding: 14px 14px 22px;
          position: relative;
          transform: rotate(-2.5deg);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .vintage-card-shadow:hover {
          transform: rotate(-1deg) translateY(-4px);
          box-shadow: 0 22px 40px rgba(141, 103, 64, 0.26);
        }

        .vintage-card-shadow::before {
          content: "";
          position: absolute;
          width: 70px;
          height: 18px;
          background: rgba(255, 244, 210, 0.95);
          top: -12px;
          left: 18%;
          border-radius: 3px;
          box-shadow: 0 2px 6px rgba(136, 97, 63, 0.4);
          transform: rotate(-10deg);
        }

        .vintage-card-shadow::after {
          content: "";
          position: absolute;
          width: 70px;
          height: 18px;
          background: rgba(255, 244, 210, 0.95);
          top: -12px;
          right: 18%;
          border-radius: 3px;
          box-shadow: 0 2px 6px rgba(136, 97, 63, 0.4);
          transform: rotate(9deg);
        }

        .carousel-image {
          width: 100%;
          height: 430px;
          object-fit: cover;
          border-radius: 10px;
          box-shadow: 0 10px 18px rgba(87, 63, 42, 0.35);
          transform-origin: center center;
          transition: transform 0.4s ease;
        }

        .carousel-image:hover {
          transform: scale(1.03) rotate(-0.5deg);
        }

        /* Carousel controls */
        .vintage-card-shadow .btn {
          backdrop-filter: blur(6px);
        }

        .vintage-card-shadow .btn:hover {
          transform: translateY(-1px);
        }

        /* Indicators as tiny stickers */
        .vintage-card-shadow span {
          box-shadow: 0 1px 3px rgba(0,0,0,0.25);
        }

        /* Thumbnail strip under main image */
        .thumb-strip {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }

        .thumb-btn {
          border: none;
          padding: 0;
          background: transparent;
          border-radius: 8px;
          overflow: hidden;
          position: relative;
        }

        .thumb-img {
          width: 56px;
          height: 56px;
          object-fit: cover;
          border-radius: 8px;
          opacity: 0.8;
          transition: opacity 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
        }

        .thumb-btn.active .thumb-img {
          opacity: 1;
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(87, 63, 42, 0.35);
        }

        .thumb-btn::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 8px;
          border: 2px solid transparent;
        }

        .thumb-btn.active::after {
          border-color: #a35d48;
        }

        /* PRODUCT SIDE – notebook page */
        .journal-details-card {
          border-radius: 20px;
          background: #fffdf8;
          box-shadow: 0 16px 30px rgba(141, 103, 64, 0.15);
          border: none;
          position: relative;
          overflow: hidden;
          transform: rotate(1deg);
        }

        .journal-details-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: linear-gradient(
              to bottom,
              rgba(255, 223, 186, 0.4) 1px,
              transparent 1px
            );
          background-size: 100% 30px;
          opacity: 0.7;
          pointer-events: none;
        }

        .journal-details-card .card-body {
          position: relative;
        }

        .journal-details-card h1 {
          font-family: "Dancing Script", cursive;
          font-size: 2.2rem;
          color: #5a3b1c;
        }

        .journal-tagline {
          font-size: 0.8rem;
          letter-spacing: 0.14em;
        }

        .journal-details-card ul li {
          position: relative;
          padding-left: 0.6rem;
        }

        .journal-details-card ul li::before {
          content: "✶";
          position: absolute;
          left: -0.4rem;
          top: 0;
          font-size: 0.5rem;
          color: #c58b61;
        }

        /* Highlight badges above description */
        .highlight-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-bottom: 0.75rem;
        }

        .badge-pill-soft {
          font-size: 0.7rem;
          padding: 0.25rem 0.7rem;
          border-radius: 999px;
          background: #ffe9d1;
          color: #8a5533;
          border: 1px dashed #d7a16e;
          animation: softPulse 3.5s ease-in-out infinite;
        }

        .badge-pill-soft-alt {
          background: #ffe0f0;
          border-color: #e3a4c4;
          color: #8a3c57;
        }

        .badge-pill-soft-outline {
          background: #fffdf8;
          border-style: solid;
        }

        @keyframes softPulse {
          0%, 100% { transform: translateY(0); box-shadow: 0 0 0 rgba(240,140,106,0); }
          50% { transform: translateY(-1px); box-shadow: 0 0 12px rgba(240,140,106,0.22); }
        }

        /* Price & buttons */
        .btn-vintage {
          background: linear-gradient(135deg, #f08c6a, #f6b18b);
          border: none;
          color: white;
          padding: 9px 18px;
          border-radius: 999px;
          font-weight: 500;
          box-shadow: 0 4px 12px rgba(240, 140, 106, 0.55);
        }

        .btn-vintage:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(240, 140, 106, 0.7);
        }

        .input-group > .btn.btn-outline-secondary {
          border-radius: 999px 0 0 999px;
          border-color: #c58b61;
          color: #7b5533;
        }

        .input-group > .btn.btn-outline-secondary:last-child {
          border-radius: 0 999px 999px 0;
        }

        .input-group .form-control {
          border-color: #c58b61;
        }

        .input-group .form-control:focus {
          box-shadow: 0 0 0 0.15rem rgba(240, 140, 106, 0.25);
        }

        /* CREATIVE SECTION – tabs + checklist */
        .creative-section {
          margin-top: 10px;
        }

        .section-card {
          border-radius: 18px;
          background: #fff9f0;
          box-shadow: 0 12px 26px rgba(141, 103, 64, 0.18);
          padding: 1.3rem 1.4rem 1.5rem;
          position: relative;
          overflow: hidden;
        }

        .section-card::before {
          content: "";
          position: absolute;
          width: 65px;
          height: 18px;
          background: #ffeccd;
          border-radius: 4px;
          top: -10px;
          left: 14%;
          border: 1px solid #d1b38f;
          transform: rotate(-5deg);
        }

        .section-card::after {
          content: "";
          position: absolute;
          width: 65px;
          height: 18px;
          background: #ffeccd;
          border-radius: 4px;
          top: -10px;
          right: 14%;
          border: 1px solid #d1b38f;
          transform: rotate(4deg);
        }

        .section-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .section-tab {
          border-radius: 999px;
          border: 1px dashed #c58b61;
          background: #fffdf8;
          padding: 0.3rem 0.85rem;
          font-size: 0.8rem;
          cursor: pointer;
          color: #7b5533;
          transition: all 0.2s ease;
        }

        .section-tab.active {
          background: #f08c6a;
          border-style: solid;
          color: #fffaf4;
          box-shadow: 0 4px 10px rgba(240, 140, 106, 0.5);
        }

        .section-content ul {
          padding-left: 1.1rem;
        }

        .section-content li {
          margin-bottom: 0.25rem;
        }

        .checklist-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 0.3rem 0.75rem;
        }

        .checklist-item {
          position: relative;
          padding-left: 1.2rem;
        }

        .checklist-item::before {
          content: "✔";
          position: absolute;
          left: 0;
          top: 0;
          font-size: 0.75rem;
          color: #4caf50;
        }

        .tiny-note {
          font-size: 0.7rem;
          color: #856047;
        }

        /* FOOTER – scrapbook strip */
        .custom-footer {
          background: #f3e3c9;
          border-top: 2px dashed #c49b6c;
          color: #7b5533;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          padding-inline: 2rem;
          position: relative;
          margin-top: 40px;
        }

        .custom-footer::before,
        .custom-footer::after {
          content: "";
          position: absolute;
          width: 70px;
          height: 22px;
          background: #ffeccd;
          top: -10px;
          border-radius: 4px;
          border: 1px solid #d1b38f;
        }

        .custom-footer::before {
          left: 10%;
          transform: rotate(-4deg);
        }

        .custom-footer::after {
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

        /* Mobile */
        @media (max-width: 768px) {
          .journal-hero {
            margin-top: 90px;
          }

          .vintage-card-shadow {
            transform: rotate(0deg);
          }

          .journal-details-card {
            transform: rotate(0deg);
          }

          .carousel-image {
            height: 320px;
          }

          .journal-ribbon {
            display: none !important;
          }

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

// Simple image carousel for journal pictures + thumbnails
const ProductImageCarousel = ({ images }) => {
  const [current, setCurrent] = useState(0);
  const total = images.length;

  const next = () => setCurrent((prev) => (prev + 1) % total);
  const prev = () => setCurrent((prev) => (prev - 1 + total) % total);

  return (
    <div>
      <div className="position-relative vintage-card-shadow overflow-hidden mb-3">
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

        {/* Indicators (dots) */}
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

      {/* Thumbnail strip */}
      <div className="thumb-strip">
        {images.map((img, i) => (
          <button
            key={i}
            type="button"
            className={`thumb-btn ${current === i ? "active" : ""}`}
            onClick={() => setCurrent(i)}
          >
            <img
              src={img}
              alt={`Thumbnail ${i + 1}`}
              className="thumb-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://placehold.co/80x80/3e2723/f8f5ed?text=No+Img";
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

const Journal = () => {
  const [quantity, setQuantity] = useState(1);
  const [activeSection, setActiveSection] = useState("prompts");
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Add to cart and go to /cart (LOGIC UNCHANGED)
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
        style={{ paddingTop: "120px", paddingBottom: "30px" }}
      >
        {/* floating ribbon */}
        <div className="journal-ribbon d-none d-md-flex align-items-center gap-2">
          <span className="fw-semibold">Journal Kit</span>
          <span className="small">Pairs perfectly with your scrapbooks</span>
        </div>

        {/* Hero / Heading */}
        <section className="journal-hero container">
          <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between">
            <div>
              <span className="journal-pill mb-2">
                Journal • Scrapbook • Polaroid-ready
              </span>
              <h1 className="h2 mt-2 mb-2 journal-title dancing-script">
                Capture your days, one page at a time
              </h1>
              <p className="small mb-0 journal-subtitle">
                A cozy vintage journal to pair with your Polaroid-style photos,
                stickers and handwritten memories.
              </p>
            </div>
          </div>
        </section>

        <div className="container journal-layout">
          <div className="row g-5">
            {/* Images section */}
            <div className="col-lg-6">
              <ProductImageCarousel images={product.images} />
            </div>

            {/* Product details section */}
            <div className="col-lg-6">
              <div className="card p-4 vintage-card-shadow border-0 journal-details-card h-100">
                <div className="card-body d-flex flex-column">
                  <h1 className="mb-2">{product.title}</h1>
                  <p className="text-uppercase small fw-bold text-vintage-accent mb-2 journal-tagline">
                    Handbound Collection
                  </p>

                  {/* highlight badges */}
                  <div className="highlight-badges">
                    <span className="badge-pill-soft">Limited stock</span>
                    <span className="badge-pill-soft badge-pill-soft-alt">
                      Perfect gift-ready packaging
                    </span>
                    <span className="badge-pill-soft badge-pill-soft-outline">
                      Polaroid friendly pages
                    </span>
                  </div>

                  <p className="text-muted">{product.description}</p>

                  <div className="mt-3">
                    <h5 className="mb-2">Inside this journal kit</h5>
                    <ul className="list-unstyled text-muted small ms-3">
                      {product.details.map((d, i) => (
                        <li key={i} className="mb-1">
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Price & Add to Cart */}
                  <div className="mt-auto pt-4 border-top">
                    <div className="d-flex flex-column mb-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="h3 text-vintage-accent fw-bold">
                          {formatCurrency(product.price)}
                        </span>
                      </div>
                      {/* <p className="small text-muted mb-0 mt-1">
                        Estimated delivery:{" "}
                        <span className="fw-semibold text-vintage-accent">
                          3–5 days
                        </span>
                      </p> */}
                      {/* <p className="small text-success mb-2">
                        ✅ Free shipping on scrapbook + journal combos above
                        ₹999
                      </p> */}
                    </div>

                    <div className="d-flex align-items-center gap-3">
                      {/* Quantity selector */}
                      <div className="input-group" style={{ maxWidth: 140 }}>
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

          {/* CREATIVE USE + CHECKLIST SECTION */}
          <section className="creative-section mt-4">
            <div className="row g-4 align-items-stretch">
              {/* How to use section */}
              <div className="col-lg-5">
                {/* <div className="section-card h-100">
                  <h4 className="mb-2">How you can use this journal</h4>
                  <p className="small text-muted mb-3">
                    Switch between ideas below to see how this journal fits into
                    your everyday routine.
                  </p>

                  <div className="section-tabs mb-3">
                    <button
                      type="button"
                      className={`section-tab ${
                        activeSection === "prompts" ? "active" : ""
                      }`}
                      onClick={() => setActiveSection("prompts")}
                    >
                      Daily Prompts
                    </button>
                    <button
                      type="button"
                      className={`section-tab ${
                        activeSection === "travel" ? "active" : ""
                      }`}
                      onClick={() => setActiveSection("travel")}
                    >
                      Travel Logs
                    </button>
                    <button
                      type="button"
                      className={`section-tab ${
                        activeSection === "gratitude" ? "active" : ""
                      }`}
                      onClick={() => setActiveSection("gratitude")}
                    >
                      Gratitude Pages
                    </button>
                  </div>

                  <div className="section-content small">
                    {activeSection === "prompts" && (
                      <ul className="mb-0">
                        <li>
                          Start each page with “Today I want to remember...”
                        </li>
                        <li>
                          Stick a Polaroid at the top, write 3–4 lines below.
                        </li>
                        <li>
                          Add a tiny sticker or doodle in the corner as a mood
                          marker.
                        </li>
                      </ul>
                    )}

                    {activeSection === "travel" && (
                      <ul className="mb-0">
                        <li>Dedicate 2–3 pages per trip or weekend outing.</li>
                        <li>
                          Paste tickets, receipts and mini photos like a
                          collage.
                        </li>
                        <li>
                          End each spread with a “Favourite moment” highlight.
                        </li>
                      </ul>
                    )}

                    {activeSection === "gratitude" && (
                      <ul className="mb-0">
                        <li>Reserve a few pages just for gratitude lists.</li>
                        <li>Write 3 things you’re grateful for each night.</li>
                        <li>
                          Add soft stickers or washi tape borders around special
                          entries.
                        </li>
                      </ul>
                    )}
                  </div>
                </div> */}
              </div>

              {/* Checklist side */}
              <div className="col-lg-7">
                <div className="section-card h-100">
                  <h5 className="mb-3">
                    What&apos;s inside your kit checklist
                  </h5>
                  <ul className="list-unstyled small checklist-grid mb-2">
                    {product.details.map((item, idx) => (
                      <li key={idx} className="checklist-item">
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="tiny-note mb-0">
                    Tip: Use the mini notebook as an on-the-go idea catcher,
                    then migrate your favourite notes into this main journal
                    with photos and stickers.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="custom-footer py-4">
        <div className="footer-left">
          <h5 className="footer-title dancing-script mb-1">Path To Pages</h5>
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
