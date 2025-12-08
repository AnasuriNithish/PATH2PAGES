// src/components/Bookmark.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";

import { ShoppingCart, Loader2 } from "lucide-react";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import { SiThreads } from "react-icons/si";

/* ===========================
   SHARED CONFIG
   ========================== */

const CART_KEY = "pathtopages_cart"; // same key used in Journal.jsx / Checkout.jsx

/* ===========================
   MOCK DATA – USE REAL PRODUCT ID HERE
   ========================== */

const BOOKMARK_PRODUCTS = [
  {
    // PUT your real MongoDB _id for the bookmark product here
    id: "68f8ffcaddfcfc98412ee990",
    title: "Bookmarks",
    subtitle: "The Traveler's Compass Bookmark",
    description:
      "A premium quality bookmark crafted for readers who love to travel through pages and places. Perfect for scrapbooks, journals and everyday reading.",
    price: 199,
    image: "https://placehold.co/400x400/b78a5f/f8f5ed?text=Vintage+Leather",
    images: [
      "https://placehold.co/800x600/b78a5f/f8f5ed?text=Vintage+Leather+1",
      "https://placehold.co/800x600/a36e5a/f8f5ed?text=Vintage+Leather+2",
      "https://placehold.co/800x600/8b5b47/f8f5ed?text=Vintage+Leather+3",
    ],
    material: "Genuine Leather, Brass Charm",
    stock: 5,
    rating: 4.8,
    reviewsCount: 32,
  },
];

/* ===========================
   THEME – scrapbook / polaroid
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
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap"
      rel="stylesheet"
    />
    <link
      href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@500;600;700&family=Shadows+Into+Light&display=swap"
      rel="stylesheet"
    />

    <style>{`
      body {
        background-color: #fdf6ec;
        font-family: "Poppins", sans-serif;
        color: #3e2723;
      }

      .dancing-script {
        font-family: "Dancing Script", cursive;
      }

      html, body, #root {
        height: 100%;
        margin: 0;
        padding: 0;
      }

      .page-bg {
        background-color: #fdf6ec;
        min-height: 100vh;
        color: #3e2723;
        display: flex;
        flex-direction: column;
      }

      .main-content {
        flex: 1;
      }

      h1, h2, h4, h5, h6 {
        color: #4a2e20;
      }

      .text-vintage-accent {
        color: #a35d48 !important;
      }

      /* ============ NAVBAR – scrapbook strip ============ */

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

      .navbar-toggler {
        border-color: #c49b6c;
      }

      .navbar-toggler-icon {
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba(123,85,51,0.9)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
      }

      .cart-icon-link {
        position: relative;
        margin-left: 0.75rem;
      }

      .cart-badge {
        position: absolute;
        top: -6px;
        right: -10px;
        font-size: 10px;
        padding: 3px 6px;
        border-radius: 999px;
      }

      /* ============ HERO / TITLE ============ */

      .bookmark-hero {
        margin-top: 90px;
        margin-bottom: 24px;
        position: relative;
        padding: 1.5rem 1.25rem;
        border-radius: 22px;
        background: radial-gradient(circle at top left, #ffe3c2 0, #fffdf8 40%, #f7ddc8 100%);
        box-shadow: 0 16px 30px rgba(141, 103, 64, 0.18);
        overflow: hidden;
      }

      .bookmark-hero::before,
      .bookmark-hero::after {
        content: "";
        position: absolute;
        width: 70px;
        height: 20px;
        background: rgba(255, 244, 210, 0.95);
        top: -12px;
        border-radius: 4px;
        box-shadow: 0 2px 6px rgba(136, 97, 63, 0.4);
      }

      .bookmark-hero::before {
        left: 12%;
        transform: rotate(-8deg);
      }

      .bookmark-hero::after {
        right: 14%;
        transform: rotate(7deg);
      }

      .bookmark-pill {
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

      .bookmark-title {
        color: #5d4029;
        text-shadow: 0 2px 0 rgba(255, 255, 255, 0.7);
      }

      .bookmark-subtitle {
        color: #7a5a3c;
        max-width: 640px;
      }

      /* Floating ribbon */
      .bookmark-ribbon {
        position: absolute;
        top: 10px;
        right: 18px;
        background: #ffeed8;
        border-radius: 999px;
        padding: 6px 14px;
        border: 1px dashed #d7a16e;
        box-shadow: 0 4px 10px rgba(141, 103, 64, 0.25);
        font-size: 0.78rem;
        display: flex;
        align-items: center;
        gap: 0.35rem;
        animation: ribbonFloat 4s ease-in-out infinite;
      }

      .bookmark-ribbon span.emoji {
        font-size: 1rem;
      }

      @keyframes ribbonFloat {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-3px); }
      }

      /* Floating icons in hero */
      .bookmark-floating-icon {
        position: absolute;
        font-size: 32px;
        opacity: 0.7;
        pointer-events: none;
        animation: floatUpDown 4s ease-in-out infinite;
      }

      .bookmark-floating-icon.icon-1 {
        left: 14%;
        top: 18%;
      }

      .bookmark-floating-icon.icon-2 {
        right: 18%;
        bottom: 12%;
        animation-delay: 0.8s;
      }

      @keyframes floatUpDown {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-6px); }
      }

      /* ============ CARD / POLAROID ============ */

      .vintage-card-shadow {
        border-radius: 20px;
        background: #fffdf8;
        box-shadow: 0 16px 30px rgba(141, 103, 64, 0.15);
        border: none;
      }

      .bookmark-card-outer {
        position: relative;
        background: transparent;
        border-radius: 24px;
        box-shadow: 0 14px 26px rgba(141, 103, 64, 0.22);
      }

      .bookmark-card-inner {
        border-radius: 20px;
        overflow: hidden;
        background: #fffdf8;
        position: relative;
      }

      .bookmark-card-inner::before {
        content: "";
        position: absolute;
        inset: 0;
        background-image: linear-gradient(
          to bottom,
          rgba(255, 223, 186, 0.45) 1px,
          transparent 1px
        );
        background-size: 100% 28px;
        opacity: 0.6;
        pointer-events: none;
      }

      .bookmark-card-body {
        position: relative;
        z-index: 1;
      }

      /* small badges on right side */
      .soft-badges-row {
        display: flex;
        flex-wrap: wrap;
        gap: 0.35rem;
        margin-bottom: 0.5rem;
      }

      .badge-soft {
        font-size: 0.7rem;
        padding: 0.25rem 0.6rem;
        border-radius: 999px;
        border: 1px dashed #e2a46b;
        background: #fffaf3;
        color: #8a5533;
      }

      .badge-soft.alt {
        background: #ffe0f0;
        border-color: #e3a4c4;
        color: #8a3c57;
      }

      .badge-soft.outline {
        background: #fffdf8;
        border-style: solid;
      }

      /* rating */
      .rating-row {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        font-size: 0.85rem;
        margin-bottom: 0.4rem;
      }

      .rating-star {
        color: #f5a623;
        font-size: 1rem;
      }

      /* ============ SLIDESHOW (LEFT) ============ */

      .slideshow-wrapper {
        position: relative;
        overflow: hidden;
        border-radius: 16px;
        background: #ffffff;
        padding: 10px 10px 18px;
        box-shadow: 0 10px 18px rgba(87, 63, 42, 0.35);
      }

      .slideshow-photo-frame {
        width: 100%;
        height: 360px;
        background-size: cover;
        background-position: center;
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
        left: 12px;
      }
      .slideshow-arrow.right {
        right: 12px;
      }

      .slideshow-dots {
        position: absolute;
        bottom: 12px;
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
        background-color: #ffffff;
      }

      /* thumbnail strip */
      .thumb-strip {
        display: flex;
        flex-wrap: wrap;
        gap: 0.35rem;
        margin-top: 0.45rem;
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

      /* ============ TEXT + BUTTONS ============ */

      .key-features-list li {
        position: relative;
        padding-left: 0.7rem;
      }

      .key-features-list li::before {
        content: "✶";
        position: absolute;
        left: -0.1rem;
        top: 0;
        font-size: 0.55rem;
        color: #c58b61;
      }

      .btn-vintage {
        background: linear-gradient(135deg, #f08c6a, #f6b18b);
        border: none;
        color: white;
        padding: 9px 18px;
        border-radius: 999px;
        font-size: 15px;
        font-weight: 500;
        transition: 0.2s;
        box-shadow: 0 4px 12px rgba(240, 140, 106, 0.55);
      }
      .btn-vintage:hover {
        transform: translateY(-1px);
        box-shadow: 0 6px 16px rgba(240, 140, 106, 0.7);
      }
      .btn-vintage:disabled {
        opacity: 0.7;
        box-shadow: none;
        cursor: not-allowed;
      }

      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      .spin-anim {
        animation: spin 1s linear infinite;
      }

      /* quantity group */
      .qty-group {
        display: inline-flex;
        align-items: center;
        border-radius: 999px;
        border: 1px solid #c49b6c;
        overflow: hidden;
        background: #fffaf3;
        font-size: 0.9rem;
      }
      .qty-btn {
        border: none;
        background: transparent;
        width: 32px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
      .qty-value {
        width: 40px;
        text-align: center;
        border-left: 1px solid #e4c8a6;
        border-right: 1px solid #e4c8a6;
      }

      /* stock indicator */
      .stock-pill {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        font-size: 0.8rem;
        padding: 0.25rem 0.6rem;
        border-radius: 999px;
        border: 1px dashed #c7d7b3;
        background: #edf8dd;
        color: #4f6b33;
      }
      .stock-pill.low {
        border-color: #f2b38c;
        background: #ffe8d4;
        color: #9b4e22;
      }
      .stock-pill.out {
        border-color: #d3d3d3;
        background: #f5f5f5;
        color: #888;
      }

      /* Tips / usage section */
      .bookmark-tips {
        margin-top: 1.2rem;
        padding-top: 0.8rem;
        border-top: 1px dashed #ecd7bd;
      }
      .bookmark-tips details {
        background: #fffdf8;
        border-radius: 10px;
        border: 1px dashed #e2a46b;
        padding: 0.55rem 0.7rem;
        margin-bottom: 0.5rem;
        box-shadow: 0 4px 10px rgba(141, 103, 64, 0.12);
      }
      .bookmark-tips summary {
        cursor: pointer;
        font-size: 0.85rem;
        font-weight: 500;
        color: #7b5533;
        list-style: none;
      }
      .bookmark-tips summary::-webkit-details-marker {
        display: none;
      }
      .bookmark-tips summary::before {
        content: "+";
        display: inline-block;
        margin-right: 0.4rem;
        font-weight: 700;
        color: #a35d48;
      }
      .bookmark-tips details[open] summary::before {
        content: "-";
      }
      .bookmark-tips p {
        font-size: 0.8rem;
        color: #6d5844;
        margin-top: 0.3rem;
        margin-bottom: 0;
      }

      /* Pairing section */
      .pairing-strip {
        margin-top: 0.5rem;
        padding: 0.85rem 1rem;
        border-radius: 16px;
        background: #fff5e2;
        border: 1px dashed #d7a16e;
        box-shadow: 0 6px 14px rgba(141, 103, 64, 0.16);
        font-size: 0.85rem;
      }
      .pairing-strip a {
        text-decoration: none;
        font-weight: 500;
        color: #a35d48;
      }
      .pairing-strip a:hover {
        text-decoration: underline;
      }

      /* ============ FOOTER – scrapbook strip ============ */

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

      /* ============ RESPONSIVE ============ */

      @media (max-width: 768px) {
        .bookmark-hero {
          margin-top: 86px;
        }

        .slideshow-photo-frame {
          height: 280px;
        }

        .bookmark-ribbon {
          display: none;
        }

        .bookmark-floating-icon {
          display: none;
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
  const [quantity, setQuantity] = useState(1);

  const hasStock = product.stock === undefined || product.stock > 0;
  const lowStock = hasStock && product.stock <= 3 && product.stock > 0;

  // auto-slide (LOGIC UNCHANGED except UI)
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

  const decQty = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const incQty = () => {
    const max = product.stock || 99;
    setQuantity((prev) => Math.min(max, prev + 1));
  };

  const handleAddClick = () => {
    if (!hasStock) return;
    onAddToCart(product, quantity);
  };

  return (
    <div className="col-12 mb-4">
      <div className="bookmark-card-outer">
        <div className="bookmark-card-inner p-4 vintage-card-shadow">
          <div className="row g-4" style={{ minHeight: "520px" }}>
            {/* LEFT - IMAGE SLIDESHOW */}
            <div className="col-md-6">
              <div className="slideshow-wrapper">
                <div
                  className="slideshow-photo-frame"
                  style={{
                    backgroundImage: `url(${images[index]})`,
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

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="thumb-strip">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      className={"thumb-btn" + (i === index ? " active" : "")}
                      onClick={() => setIndex(i)}
                    >
                      <img
                        src={img}
                        alt={`Bookmark thumbnail ${i + 1}`}
                        className="thumb-img"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT - DETAILS */}
            <div className="col-md-6 d-flex flex-column justify-content-between bookmark-card-body">
              <div>
                <h2
                  className="dancing-script mb-2"
                  style={{ fontSize: "2.1rem" }}
                >
                  {product.title}
                </h2>
                <h6 className="text-vintage-accent mb-1 text-uppercase small">
                  {product.subtitle}
                </h6>

                {/* badges + rating */}
                <div className="soft-badges-row">
                  <span className="badge-soft">Best Seller</span>
                  <span className="badge-soft alt">Handmade finish</span>
                  <span className="badge-soft outline">
                    {product.material || "Premium quality"}
                  </span>
                </div>

                <div className="rating-row">
                  <span className="rating-star">★</span>
                  <span className="fw-semibold">
                    {product.rating?.toFixed(1) || "4.8"}
                  </span>
                  <span className="text-muted">
                    ({product.reviewsCount || 32} reviews)
                  </span>
                </div>

                <p className="text-muted">{product.description}</p>

                <h6 className="mt-3 mb-2">Key features</h6>
                <ul className="text-muted small key-features-list">
                  <li>Premium leather feel with a soft, vintage texture.</li>
                  <li>
                    Brass charm that gently peeks out of your book or journal.
                  </li>
                  <li>
                    Works beautifully with scrapbooks, planners and novels.
                  </li>
                </ul>

                {/* stock & meta */}
                {/* <div className="d-flex flex-wrap align-items-center gap-2 mt-2">
                  <span
                    className={
                      "stock-pill " +
                      (!hasStock ? "out" : lowStock ? "low" : "")
                    }
                  >
                    {!hasStock
                      ? "Sold out"
                      : lowStock
                      ? `Only ${product.stock} left`
                      : "In stock and ready to ship"}
                  </span>
                  <span className="small text-muted">
                    • Usually dispatches in 24–48 hours
                  </span>
                </div> */}
              </div>

              <div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h3 className="text-vintage-accent fw-bold mb-0">
                    {formatCurrency(product.price)}
                  </h3>
                  <div className="d-flex align-items-center gap-2">
                    <span className="small text-muted">Qty</span>
                    <div className="qty-group">
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={decQty}
                      >
                        -
                      </button>
                      <div className="qty-value">{quantity}</div>
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={incQty}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  className="btn btn-vintage w-100 mt-1 d-flex align-items-center justify-content-center gap-2"
                  onClick={handleAddClick}
                  disabled={isLoading || !hasStock}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="spin-anim" />
                      Adding…
                    </>
                  ) : !hasStock ? (
                    "Sold out"
                  ) : (
                    <>
                      <ShoppingCart size={18} />
                      Add to Cart
                    </>
                  )}
                </button>

                {/* Usage + Care tips */}
                {/* <div className="bookmark-tips">
                  <details>
                    <summary>How to use with your journal</summary>
                    <p>
                      Clip the bookmark to the page where your daily entry
                      starts. Let the brass charm sit just outside the book so
                      you can spot today’s page instantly.
                    </p>
                  </details>
                  <details>
                    <summary>Care tips</summary>
                    <p>
                      Avoid soaking it in water. Wipe gently with a soft dry
                      cloth. Store inside your journal when not in use to keep
                      the leather from bending.
                    </p>
                  </details>
                </div> */}
              </div>
            </div>
          </div>

          {/* Pairing suggestion */}
          <div className="pairing-strip mt-3">
            💡 <strong>Tip:</strong> This bookmark pairs perfectly with our{" "}
            <Link to="/journal">Journal Kit</Link>. Use the journal for
            memories, and this bookmark to hold your current page or favourite
            quote.
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
  const [addingId, setAddingId] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [heroTagline, setHeroTagline] = useState(
    "Bookmarks • Charms • Page savers"
  );

  const navigate = useNavigate();

  // Rotating hero tagline
  useEffect(() => {
    const phrases = [
      "Bookmarks • Charms • Page savers",
      "Mark chapters in style",
      "Perfect for journals & scrapbooks",
      "Gift-ready little keepsakes",
    ];
    let i = 0;
    const id = setInterval(() => {
      i = (i + 1) % phrases.length;
      setHeroTagline(phrases[i]);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  // Read cart count from localStorage on mount + when storage changes (LOGIC UNCHANGED)
  useEffect(() => {
    const loadCartCount = () => {
      try {
        const raw = localStorage.getItem(CART_KEY);
        const cart = raw ? JSON.parse(raw) : [];
        const count = Array.isArray(cart)
          ? cart.reduce((sum, item) => sum + (item.quantity || 1), 0)
          : 0;
        setCartItemCount(count);
      } catch {
        setCartItemCount(0);
      }
    };

    loadCartCount();

    const handler = (e) => {
      if (e.key === CART_KEY) loadCartCount();
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  // Add to global cart (localStorage) and go to /cart
  const handleAddToCart = useCallback(
    (product, quantity = 1) => {
      try {
        setAddingId(product.id);

        const raw = localStorage.getItem(CART_KEY);
        const cart = raw ? JSON.parse(raw) : [];

        const image =
          product.image ||
          (product.images && product.images.length > 0
            ? product.images[0]
            : "");

        const existingIndex = Array.isArray(cart)
          ? cart.findIndex((item) => item.id === product.id)
          : -1;

        let newCart;
        if (!Array.isArray(cart)) {
          newCart = [
            {
              id: product.id,
              title: product.title,
              price: product.price,
              quantity: quantity,
              image,
            },
          ];
        } else if (existingIndex > -1) {
          newCart = cart.map((item, idx) =>
            idx === existingIndex
              ? { ...item, quantity: (item.quantity || 1) + quantity }
              : item
          );
        } else {
          newCart = [
            ...cart,
            {
              id: product.id,
              title: product.title,
              price: product.price,
              quantity: quantity,
              image,
            },
          ];
        }

        localStorage.setItem(CART_KEY, JSON.stringify(newCart));

        const count = newCart.reduce(
          (sum, item) => sum + (item.quantity || 1),
          0
        );
        setCartItemCount(count);

        navigate("/cart");
      } catch (err) {
        console.error("Error adding bookmark to cart:", err);
        alert("Could not add to cart. Please try again.");
      } finally {
        setAddingId(null);
      }
    },
    [navigate]
  );

  return (
    <div className="page-bg">
      <CustomStyles />

      {/* Navbar */}
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

              {/* Cart icon with badge (uses existing cartItemCount logic) */}
              <li className="nav-item">
                <Link to="/cart" className="cart-icon-link nav-link">
                  <ShoppingCart size={22} />
                  {cartItemCount > 0 && (
                    <span className="badge bg-danger text-white cart-badge">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero / heading */}
      <section className="bookmark-hero container">
        <div className="bookmark-ribbon">
          <span className="emoji">📖</span>
          <span>Pairs perfectly with your journal</span>
        </div>

        <span className="bookmark-floating-icon icon-1">✨</span>
        <span className="bookmark-floating-icon icon-2">📎</span>

        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between">
          <div>
            <span className="bookmark-pill mb-2">{heroTagline}</span>
            <h1 className="h2 mt-2 mb-2 bookmark-title dancing-script">
              Mark your favorite chapters in style
            </h1>
            <p className="small mb-0 bookmark-subtitle">
              Vintage-inspired bookmarks that pair perfectly with your
              scrapbooks and journals — tiny details that make every page feel
              like part of a story.
            </p>
          </div>
        </div>
      </section>

      {/* Main – bookmark products */}
      <main className="main-content" style={{ paddingBottom: "16px" }}>
        <div className="container pb-5">
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
      </main>

      {/* Footer */}
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

export default BookmarkShop;
