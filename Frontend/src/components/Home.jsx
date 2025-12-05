// Home.jsx (scanned and annotated — unused items are commented inline)
// Source file: :contentReference[oaicite:1]{index=1}

import React, { useEffect, useRef, useState } from "react";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import { SiThreads } from "react-icons/si";
// eslint-disable-next-line no-unused-vars
import { Link, useLocation, useNavigate } from "react-router-dom"; // <- useLocation is NOT used, useNavigate is declared but NOT used below
import { getImageBaseURL } from "../services/api_service"; // <- Imported but the resulting BASE_URL is not used below

const Home = () => {
  const navbarRef = useRef(null);
  const hasAnimated = useRef(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate(); // UNUSED: navigate is declared but never used in this file
  // eslint-disable-next-line no-unused-vars
  const BASE_URL = getImageBaseURL(); // UNUSED: BASE_URL is assigned but not used anywhere

  // GSAP + Anime.js animations
  useEffect(() => {
    const scripts = [
      "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js",
    ];
    let scriptsLoaded = 0;

    scripts.forEach((src) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        scriptsLoaded++;
        if (scriptsLoaded === scripts.length) initAnimations();
        return;
      }
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = () => {
        scriptsLoaded++;
        if (scriptsLoaded === scripts.length) initAnimations();
      };
      document.body.appendChild(script);
    });

    function initAnimations() {
      if (
        hasAnimated.current ||
        !window.gsap ||
        !window.anime ||
        !window.gsap.registerPlugin
      )
        return;
      hasAnimated.current = true;

      window.gsap.registerPlugin(window.ScrollTrigger);

      window.gsap.from(navbarRef.current, {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      const textWrapper = document.querySelector(".hero-title");
      if (textWrapper && !textWrapper.querySelector(".letter")) {
        textWrapper.innerHTML = textWrapper.textContent.replace(
          /\S/g,
          "<span class='letter'>$&</span>"
        );

        window.anime.timeline({ loop: false }).add({
          targets: ".hero-title .letter",
          translateY: [-100, 0],
          opacity: [0, 1],
          easing: "easeOutExpo",
          duration: 1400,
          delay: (el, i) => 30 * i,
        });
      }

      window.gsap.utils.toArray(".animated-text").forEach((el) => {
        window.gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          y: 30,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
        });
      });
    }
  }, []);

  // Navbar glass effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!navbarRef.current) return;
      if (window.scrollY > 50) {
        navbarRef.current.classList.add("glass-navbar");
      } else {
        navbarRef.current.classList.remove("glass-navbar");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Dynamic API URL
  const API_BASE = "https://pathtopages.onrender.com";

  console.log("🔗 Using API Base:", API_BASE);

  // Fetch all products without filter
  const [products, setProducts] = useState([]); // NOTE: products are fetched and set, but not used in the JSX below (UI uses hardcoded product cards)
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false); // UNUSED in render: loading state is set but not shown anywhere in the UI

  // eslint-disable-next-line no-unused-vars
  const fullImageUrl = (imgPath) => {
    if (!imgPath) return "";
    if (imgPath.startsWith("http")) return imgPath;
    return `${API_BASE}/${imgPath.replace(/^\/+/, "")}`;
  }; // UNUSED: fullImageUrl helper is defined but not used — images in the component are hardcoded external URLs

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const response = await fetch(
          `${API_BASE}/api/v1/products/?category=bookmark`
        );
        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  // Sort products to ensure journal appears first, then bookmark
  // eslint-disable-next-line no-unused-vars
  const sortedProducts = [...products].sort((a, b) => {
    if (a.category === "journal" && b.category !== "journal") return -1;
    if (a.category !== "journal" && b.category === "journal") return 1;
    return 0;
  }); // UNUSED: sortedProducts is computed but not used in render — product cards are static/hardcoded

  return (
    <>
      {/* Navbar */}
      <nav
        ref={navbarRef}
        className="navbar navbar-expand-lg fixed-top glass-navbar p-3"
      >
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
              {/* <li className="nav-item">
                <Link to="/cart" className="nav-link text-white">
                  Cart
                </Link>
              </li> */}
              <li className="nav-item">
                <Link to="/profile" className="nav-link text-white">
                  Profile
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero d-flex flex-column justify-content-center align-items-center text-center text-white vh-100 position-relative">
        <img
          src="https://raw.githubusercontent.com/AnasuriNithish/PathtoPages/ab2fbd5de49fb4fbb735842755026ba7fbf96de4/Frontend/IMG-20251027-WA0027.jpg"
          alt="Hero background"
          className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
          style={{ zIndex: -2 }}
        />
        <div
          className="hero-overlay position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
          style={{ zIndex: -1 }}
        ></div>
        <h1 className="happy-monkey-regular hero-title display-1 fw-bold">
          Path To Pages
        </h1>
        <p className="happy-monkey-regular lead animated-text max-w-600px px-3">
          From snapshots to stories, keep your travel memories alive in a
          journal made for your adventures.
        </p>
      </header>

      <main className="container py-5 text-center">
        <section id="featured" className="featured-products">
          <h2 className="happy-monkey-regular mb-5 animated-text">
            Featured Products
          </h2>

          <div className="row g-4 justify-content-center">
            {/* Travel Journal Card */}
            <div className="col-md-4">
              <Link to="/journal" className="text-decoration-none">
                <div
                  className="card glass-card h-100 shadow-sm"
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src="https://raw.githubusercontent.com/AnasuriNithish/PathtoPages/ab2fbd5de49fb4fbb735842755026ba7fbf96de4/Frontend/IMG-20251023-WA0020.jpg"
                    alt="Travel Journal"
                    className="card-img-top"
                    style={{
                      height: "300px",
                      objectFit: "cover",
                      borderRadius: "12px 12px 0 0",
                    }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">Travel Journal</h5>
                    <p className="card-text">
                      A vintage-style refillable journal to capture your
                      adventures.
                    </p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Handcrafted Bookmark Card */}
            <div className="col-md-4">
              <Link to="/bookmark" className="text-decoration-none">
                <div
                  className="card glass-card h-100 shadow-sm"
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src="https://raw.githubusercontent.com/AnasuriNithish/PathtoPages/ab2fbd5de49fb4fbb735842755026ba7fbf96de4/Frontend/IMG-20251027-WA0010.jpg"
                    alt="Handcrafted Bookmark"
                    className="card-img-top"
                    style={{
                      height: "300px",
                      objectFit: "cover",
                      borderRadius: "12px 12px 0 0",
                    }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">Handcrafted Bookmark</h5>
                    <p className="card-text">
                      Premium handcrafted bookmarks for every book lover.
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="glass-footer d-flex flex-column flex-md-row align-items-center justify-content-between px-4 py-5 text-center text-md-start">
        <div className="footer-title mb-4 mb-md-0">
          <h4 className="happy-monkey-regular mb-1">Path To Pages</h4>
          {/* <span className="happy-monkey-regular small">
            Designed by Nithish
          </span> */}
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
          {/* <a
            href="https://www.threads.net/pathtopages"
            target="_blank"
            rel="noopener noreferrer"
          >
            <SiThreads />
          </a> */}
        </div>
      </footer>

      {/* Scrapbook Journal Theme CSS */}
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
          font-family: "Poppins", sans-serif;
          font-weight: 500;
          transition: 0.3s;
        }
        .nav-link:hover {
          color: #ffe6b3 !important;
        }
        .hero {
          position: relative;
          overflow: hidden;
          color: #5a4633;
        }
        .hero-bg {
          object-fit: cover;
          object-position: center;
          z-index: 0;
          filter: brightness(0.7);
        }
        .hero-overlay {
          background: rgba(0, 0, 0, 0.3);
          z-index: 1;
        }
        .hero-title,
        .hero p {
          position: relative;
          z-index: 2;
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
        .featured-products h2 {
          font-family: "Caveat Brush", cursive;
          color: #5a3b1c;
          border-bottom: 3px dashed #caa472;
          display: inline-block;
          padding-bottom: 5px;
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

export default Home;
