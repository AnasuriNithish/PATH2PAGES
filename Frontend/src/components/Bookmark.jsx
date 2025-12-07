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
   THEME (same as existing file)
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
     @import url("https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400..700&display=swap");
        .dancing-script {
          font-family: "Dancing Script", cursive;
          font-optical-sizing: auto;
          font-weight: 600; /* you can change to 400, 500, 700 etc. */
          font-style: normal;
        }
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

/* ===========================
   MAIN BOOKMARK PAGE
   ========================== */

const BookmarkShop = () => {
  const [addingId, setAddingId] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);

  const navigate = useNavigate();

  // Read cart count from localStorage on mount + when storage changes
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

    // Optional: listen for changes from other tabs
    const handler = (e) => {
      if (e.key === CART_KEY) loadCartCount();
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  // Add to global cart (localStorage) and go to /cart
  const handleAddToCart = useCallback(
    (product) => {
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
              quantity: 1,
              image,
            },
          ];
        } else if (existingIndex > -1) {
          newCart = cart.map((item, idx) =>
            idx === existingIndex
              ? { ...item, quantity: (item.quantity || 1) + 1 }
              : item
          );
        } else {
          newCart = [
            ...cart,
            {
              id: product.id,
              title: product.title,
              price: product.price,
              quantity: 1,
              image,
            },
          ];
        }

        localStorage.setItem(CART_KEY, JSON.stringify(newCart));

        // Update badge count
        const count = newCart.reduce(
          (sum, item) => sum + (item.quantity || 1),
          0
        );
        setCartItemCount(count);

        // Navigate to global Cart page
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
                 </ul>
               </div>
             </div>
           </nav>

      {/* Main – bookmark products */}
      <main
        className="main-content"
        style={{ paddingTop: "80px", paddingBottom: "16px" }}
      >
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
      </main>

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

export default BookmarkShop;
