import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import { SiThreads } from "react-icons/si";

const Shop = () => {
  const navbarRef = useRef(null);
  const hasAnimated = useRef(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // NEW: rotating hero tagline
  const [tagline, setTagline] = useState("Scrapbooks • Stickers");

  // NEW: product filter (all / scrapbook / stickers)
  const [activeFilter, setActiveFilter] = useState("all");

  // NEW: scroll-to-products reference
  const productsRef = useRef(null);

  // Load GSAP and Anime.js scripts
  useEffect(() => {
    const scripts = [
      "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js",
    ];
    let scriptsLoaded = 0;

    const initIfReady = () => {
      if (scriptsLoaded === scripts.length) {
        initAnimations();
      }
    };

    scripts.forEach((src) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        scriptsLoaded++;
        initIfReady();
        return;
      }
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = () => {
        scriptsLoaded++;
        initIfReady();
      };
      document.body.appendChild(script);
    });
  }, []);

  // Initialize animations
  const initAnimations = () => {
    if (
      hasAnimated.current ||
      !window.gsap ||
      !window.anime ||
      !window.gsap.registerPlugin
    )
      return;
    hasAnimated.current = true;

    window.gsap.registerPlugin(window.ScrollTrigger);

    // Navbar entrance animation
    window.gsap.from(navbarRef.current, {
      y: -100,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });

    // Title animation with Anime.js
    const titleElement = document.querySelector(".shop-title");
    if (titleElement && !titleElement.querySelector(".letter")) {
      titleElement.innerHTML = titleElement.textContent.replace(
        /\S/g,
        "<span class='letter'>$&</span>"
      );

      window.anime.timeline({ loop: false }).add({
        targets: ".shop-title .letter",
        translateY: [-100, 0],
        opacity: [0, 1],
        easing: "easeOutExpo",
        duration: 1400,
        delay: (el, i) => 50 * i,
      });
    }

    // Card animations
    window.gsap.utils.toArray(".shop-card").forEach((card, index) => {
      window.gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          toggleActions: "play none none none",
        },
        y: 100,
        opacity: 0,
        duration: 1,
        delay: index * 0.2,
        ease: "power3.out",
      });
    });

    // Floating polaroid bob animation
    window.gsap.to(".shop-polaroid-left", {
      y: -10,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    window.gsap.to(".shop-polaroid-right", {
      y: 10,
      duration: 3.2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // Product title animations
    const productTitles = document.querySelectorAll(".product-title");
    productTitles.forEach((el) => {
      if (!el.querySelector(".letter")) {
        el.innerHTML = el.textContent.replace(
          /\S/g,
          "<span class='letter'>$&</span>"
        );
      }
    });

    window.anime.timeline({ loop: false }).add({
      targets: ".product-title .letter",
      translateY: [-50, 0],
      opacity: [0, 1],
      easing: "easeOutExpo",
      duration: 600,
      delay: (el, i) => 30 * i,
    });

    // Animate filter chips softly
    const chips = document.querySelectorAll(".shop-filter-chip");
    if (chips.length) {
      window.anime({
        targets: chips,
        opacity: [0, 1],
        translateY: [10, 0],
        delay: window.anime.stagger(80, { start: 500 }),
        duration: 600,
        easing: "easeOutQuad",
      });
    }
  };

  // Navbar scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (!navbarRef.current) return;
      if (window.scrollY > 50) {
        navbarRef.current.classList.add("scrolled");
      } else {
        navbarRef.current.classList.remove("scrolled");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Rotating tagline text
  useEffect(() => {
    const phrases = [
      "Scrapbooks • Stickers",
      "Polaroids • Memories",
      "Cute Layout Ideas",
      "Aesthetic Journal Kits",
    ];
    let index = 0;
    const id = setInterval(() => {
      index = (index + 1) % phrases.length;
      setTagline(phrases[index]);
    }, 2600);

    return () => clearInterval(id);
  }, []);

  const showScrapbook = activeFilter === "all" || activeFilter === "scrapbook";
  const showStickers = activeFilter === "all" || activeFilter === "stickers";

  const scrollToProducts = () => {
    if (productsRef.current) {
      productsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* NAVBAR – vintage paper strip */}
      <nav
        ref={navbarRef}
        className="navbar navbar-expand-lg fixed-top shop-navbar px-3 py-2"
      >
        <div className="container-fluid">
          <Link to="/" className="navbar-brand d-flex align-items-center">
            <div className="shop-logo-wrapper">
              <img
                src={process.env.PUBLIC_URL + "/logo.png"}
                alt="Logo"
                height="36"
              />
            </div>
            <span className="ms-2 fs-4 fw-semibold shop-brand dancing-script">
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
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
              <li className="nav-item">
                <Link to="/" className="nav-link shop-nav-link px-3">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/shop" className="nav-link shop-nav-link px-3 active">
                  Shop
                </Link>
              </li>
              {/* NEW: Cart quick link */}
              <li className="nav-item">
                <Link to="/cart" className="nav-link shop-nav-link px-3">
                  Cart
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/profile" className="nav-link shop-nav-link px-3">
                  Profile
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* HERO – scrapbook page with title */}
      <section className="shop-hero d-flex align-items-center justify-content-center text-center">
        <div className="shop-hero-paper"></div>
        <div className="shop-hero-grid"></div>

        <div className="shop-hero-inner">
          <span className="shop-hero-tagline small fw-semibold">{tagline}</span>
          <h1 className="shop-title display-3 fw-bold mt-3 dancing-script">
            Shop your next story
          </h1>
          <p className="shop-hero-subtitle mt-3">
            Choose a vintage scrapbook, print your photos in Polaroid style,
            decorate with stickers and make a cozy album that you’ll flip
            through for years.
          </p>

          {/* NEW: Scroll hint */}
          <button
            type="button"
            className="shop-scroll-hint mt-3"
            onClick={scrollToProducts}
          >
            <span className="small">Scroll to products</span>
            <span className="shop-scroll-arrow">↓</span>
          </button>
        </div>

        {/* Floating mini polaroids */}
        <div className="shop-polaroid shop-polaroid-left">
          <img
            src="https://raw.githubusercontent.com/AnasuriNithish/PathtoPages/ab2fbd5de49fb4fbb735842755026ba7fbf96de4/Frontend/IMG-20251027-WA0027.jpg"
            alt="Scrapbook preview"
          />
          <span className="shop-polaroid-caption">First page magic ✨</span>
        </div>

        <div className="shop-polaroid shop-polaroid-right">
          <img
            src="https://raw.githubusercontent.com/AnasuriNithish/PathtoPages/ab2fbd5de49fb4fbb735842755026ba7fbf96de4/Frontend/IMG-20251027-WA0010.jpg"
            alt="Stickers preview"
          />
          <span className="shop-polaroid-caption">
            Cute sticker clusters 💌
          </span>
        </div>

        {/* NEW: floating emoji stickers */}
        <div className="shop-floating-sticker sticker-1">📖</div>
        <div className="shop-floating-sticker sticker-2">✨</div>
        <div className="shop-floating-sticker sticker-3">📎</div>
      </section>

      {/* MAIN – product cards */}
      <main
        ref={productsRef}
        className="shop-container container py-5"
        aria-label="Shop products"
      >
        <h2 className="text-center mb-2 dancing-script shop-section-title">
          Pick your base, then fill it with memories
        </h2>
        <p className="text-center text-muted mb-4 shop-section-subtitle">
          Start with a scrapbook, add Polaroid-style prints, finish with
          stickers and tiny notes.
        </p>

        {/* NEW: Filter chips */}
        <div className="shop-filters-wrapper mb-4">
          <div className="shop-filters d-flex flex-wrap justify-content-center gap-2 mb-1">
            <button
              type="button"
              className={`shop-filter-chip ${
                activeFilter === "all" ? "active" : ""
              }`}
              onClick={() => setActiveFilter("all")}
            >
              All
            </button>
            <button
              type="button"
              className={`shop-filter-chip ${
                activeFilter === "scrapbook" ? "active" : ""
              }`}
              onClick={() => setActiveFilter("scrapbook")}
            >
              Scrapbooks
            </button>
            <button
              type="button"
              className={`shop-filter-chip ${
                activeFilter === "stickers" ? "active" : ""
              }`}
              onClick={() => setActiveFilter("stickers")}
            >
              Stickers & Add-ons
            </button>
          </div>
          <p className="text-center small text-muted shop-filter-helper">
            {activeFilter === "all" && "Showing scrapbooks and sticker kits."}
            {activeFilter === "scrapbook" &&
              "Just the main scrapbook album for your photos."}
            {activeFilter === "stickers" &&
              "Sticker sheets and add-ons to decorate your pages."}
          </p>
        </div>

        <div className="row g-4 justify-content-center">
          {/* SCRAPBOOK CARD (journal route) */}
          {showScrapbook && (
            <div className="col-md-6 col-lg-5">
              <Link
                to="/journal"
                className="text-decoration-none text-dark shop-card-link"
              >
                <div className="shop-card card h-100 scrapbook-card scrapbook-card-left">
                  <div className="scrap-card-tape scrap-card-tape-top-left"></div>
                  <div className="scrap-card-tape scrap-card-tape-top-right"></div>

                  <div className="scrap-card-photo-wrapper">
                    <img
                      src="https://raw.githubusercontent.com/AnasuriNithish/PathtoPages/ab2fbd5de49fb4fbb735842755026ba7fbf96de4/Frontend/IMG-20251027-WA0027.jpg"
                      alt="Vintage Scrapbook Album"
                      className="scrap-card-photo"
                    />
                  </div>

                  <div className="card-body text-center p-4">
                    <h3 className="product-title card-title mb-2">
                      Vintage Scrapbook Album
                    </h3>
                    <p className="card-text small text-muted mb-2">
                      Thick ivory pages, warm-toned cover – perfect for Polaroid
                      prints, travel tickets, and handwritten notes.
                    </p>
                    <p className="card-hint tiny-hint mb-1">
                      Tap to see the full journal kit &amp; close-up pictures.
                    </p>
                    <button className="btn scrap-btn mt-2 px-4 py-2">
                      Explore Scrapbooks
                    </button>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* STICKER / ADD-ONS CARD (bookmark route) */}
          {showStickers && (
            <div className="col-md-6 col-lg-5">
              <Link
                to="/bookmark"
                className="text-decoration-none text-dark shop-card-link"
              >
                <div className="shop-card card h-100 scrapbook-card scrapbook-card-right">
                  <div className="scrap-card-tape scrap-card-tape-top-left"></div>
                  <div className="scrap-card-tape scrap-card-tape-top-right"></div>

                  <div className="scrap-card-photo-wrapper">
                    <img
                      src="https://raw.githubusercontent.com/AnasuriNithish/PathtoPages/ab2fbd5de49fb4fbb735842755026ba7fbf96de4/Frontend/IMG-20251027-WA0010.jpg"
                      alt="Stickers & Polaroid Add-ons"
                      className="scrap-card-photo"
                    />
                  </div>

                  <div className="card-body text-center p-4">
                    <h3 className="product-title card-title mb-2">
                      Stickers &amp; Add-on Pack
                    </h3>
                    <p className="card-text small text-muted mb-2">
                      Sticker sheets, tags and bookmarks to frame your memories
                      and decorate every corner of your pages.
                    </p>
                    <p className="card-hint tiny-hint mb-1">
                      Includes bookmarks, labels and tiny accents for layouts.
                    </p>
                    <button className="btn scrap-btn mt-2 px-4 py-2">
                      Explore Sticker Sets
                    </button>
                  </div>
                </div>
              </Link>
            </div>
          )}
        </div>

        {/* NEW: bundle suggestion strip */}
        <section className="shop-bundle-strip mt-4">
          <p className="mb-1">
            💡 <span className="fw-semibold">Idea:</span> Pair the{" "}
            <span className="bundle-accent">Vintage Scrapbook</span> with the{" "}
            <span className="bundle-accent">Sticker &amp; Add-on Pack</span> for
            a complete journaling starter kit.
          </p>
          <p className="small mb-0 text-muted">
            Use the scrapbook for main memories, and the sticker pack for mood,
            dates and little highlights on each page.
          </p>
        </section>

        {/* NEW: FAQ section */}
        {/* <section className="shop-faq mt-5">
          <h3 className="text-center mb-3 dancing-script">
            Questions before you add to cart?
          </h3>
          <div className="shop-faq-items">
            <details>
              <summary>Will my photos fit in these scrapbooks?</summary>
              <p>
                Yes! The albums are perfect for Polaroid-style prints and
                regular 4x6 inch photos. You can mix, layer, and overlap them
                freely.
              </p>
            </details>
            <details>
              <summary>Do I need to buy both scrapbook and stickers?</summary>
              <p>
                Not at all. You can start with the scrapbook alone and add
                stickers later. But together, they give you a much more fun,
                finished look.
              </p>
            </details>
            <details>
              <summary>Is this good as a gift?</summary>
              <p>
                Definitely. Many people gift the scrapbook + sticker combo with
                a few printed photos for birthdays, anniversaries or farewells.
              </p>
            </details>
          </div>
        </section> */}
      </main>

      {/* FOOTER – scrapbook strip */}
      <footer className="glass-footer scrapbook-footer d-flex flex-column flex-md-row align-items-center justify-content-between px-4 py-4 text-center text-md-start">
        <div className="footer-title mb-3 mb-md-0">
          <h4 className="dancing-script mb-1">Path To Pages</h4>
        </div>

        <div className="quick-links mb-3 mb-md-0">
          <h6 className="mb-2">Quick Links</h6>
          <ul className="list-unstyled d-flex flex-wrap justify-content-center justify-content-md-start gap-3 mb-0">
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

      {/* SCRAPBOOK THEME STYLES */}
      <style jsx="true">{`
        @import url("https://fonts.googleapis.com/css2?family=Dancing+Script:wght@500;600;700&family=Shadows+Into+Light&family=Poppins:wght@300;400;500;600&display=swap");

        body {
          background-color: #fdf6ec;
          font-family: "Poppins", sans-serif;
        }

        .dancing-script {
          font-family: "Dancing Script", cursive;
        }

        /* NAVBAR */
        .shop-navbar {
          background: #f3e3c9;
          border-bottom: 2px dashed #c49b6c;
          box-shadow: 0 4px 15px rgba(151, 107, 60, 0.25);
          transition: background 0.3s ease, box-shadow 0.3s ease;
          z-index: 1000;
        }

        .shop-navbar.scrolled {
          background: #e5cfac;
          box-shadow: 0 6px 20px rgba(122, 83, 46, 0.4);
        }

        .shop-logo-wrapper {
          background: #ffffff;
          padding: 4px 8px;
          border-radius: 12px;
          box-shadow: 0 2px 6px rgba(130, 96, 63, 0.35);
        }

        .shop-brand {
          color: #6b4a2f;
          letter-spacing: 1px;
        }

        .shop-nav-link {
          color: #7b5533 !important;
          font-weight: 500;
          position: relative;
        }

        .shop-nav-link::after {
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

        .shop-nav-link:hover::after,
        .shop-nav-link.active::after {
          width: 70%;
        }

        .navbar-toggler {
          border-color: #c49b6c;
        }

        .navbar-toggler-icon {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba(123,85,51,0.9)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
        }

        /* HERO */
        .shop-hero {
          position: relative;
          min-height: 70vh;
          padding-top: 88px;
          background: radial-gradient(
            circle at top left,
            #ffe3c2 0,
            #fdf6ec 40%,
            #f7ddc8 100%
          );
          overflow: hidden;
        }

        .shop-hero-paper {
          position: absolute;
          inset: 3.5rem 1rem 2.5rem 1rem;
          background: #fffdf8;
          border-radius: 24px;
          box-shadow: 0 22px 40px rgba(142, 101, 60, 0.25);
        }

        .shop-hero-grid {
          position: absolute;
          inset: 3.8rem 1.4rem 2.8rem 1.4rem;
          background-image: linear-gradient(
              rgba(255, 210, 175, 0.25) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255, 210, 175, 0.25) 1px,
              transparent 1px
            );
          background-size: 26px 26px;
          border-radius: 20px;
          opacity: 0.8;
        }

        .shop-hero-inner {
          position: relative;
          z-index: 2;
          max-width: 720px;
          padding: 1.5rem;
        }

        .shop-hero-tagline {
          display: inline-block;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #b4764d;
          background: #fff7e7;
          padding: 0.3rem 0.9rem;
          border-radius: 999px;
          border: 1px dashed #e2a46b;
        }

        .shop-title {
          color: #5d4029;
          text-shadow: 0 2px 0 rgba(255, 255, 255, 0.7);
        }

        .shop-title .letter {
          display: inline-block;
        }

        .shop-hero-subtitle {
          color: #7a5a3c;
          font-size: 1.02rem;
          max-width: 600px;
          margin: 0 auto;
        }

        /* Scroll hint */
        .shop-scroll-hint {
          margin-top: 0.75rem;
          border-radius: 999px;
          border: 1px dashed #c58b61;
          background: #fffdf8;
          padding: 0.35rem 0.9rem;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          cursor: pointer;
          font-size: 0.8rem;
          color: #7b5533;
          box-shadow: 0 3px 8px rgba(141, 103, 64, 0.18);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .shop-scroll-hint:hover {
          transform: translateY(-1px);
          box-shadow: 0 5px 12px rgba(141, 103, 64, 0.26);
        }

        .shop-scroll-arrow {
          font-size: 1rem;
          animation: scrollArrowBounce 1.4s infinite;
        }

        @keyframes scrollArrowBounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(3px);
          }
        }

        /* FLOATING POLAROIDS */
        .shop-polaroid {
          position: absolute;
          width: 190px;
          background: #ffffff;
          padding: 8px 8px 18px;
          border-radius: 10px;
          box-shadow: 0 8px 18px rgba(87, 63, 42, 0.35);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          z-index: 1;
        }

        .shop-polaroid img {
          width: 100%;
          height: 135px;
          object-fit: cover;
          border-radius: 6px;
        }

        .shop-polaroid-caption {
          font-size: 0.78rem;
          color: #6f4b31;
          font-family: "Shadows Into Light", cursive;
        }

        .shop-polaroid-left {
          left: 6%;
          bottom: 12%;
          transform: rotate(-9deg);
        }

        .shop-polaroid-right {
          right: 7%;
          top: 20%;
          transform: rotate(8deg);
        }

        /* NEW: floating emoji stickers */
        .shop-floating-sticker {
          position: absolute;
          font-size: 32px;
          opacity: 0.7;
          pointer-events: none;
          z-index: 1;
          animation: floatUpDown 4s ease-in-out infinite;
        }

        .shop-floating-sticker.sticker-1 {
          left: 12%;
          top: 18%;
        }

        .shop-floating-sticker.sticker-2 {
          right: 14%;
          bottom: 18%;
          animation-delay: 0.8s;
        }

        .shop-floating-sticker.sticker-3 {
          left: 50%;
          bottom: 10%;
          transform: translateX(-50%);
          animation-delay: 1.4s;
        }

        @keyframes floatUpDown {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        /* SECTION TITLES */
        .shop-section-title {
          color: #5b3a25;
          font-size: 2rem;
        }

        .shop-section-subtitle {
          max-width: 520px;
          margin: 0 auto;
        }

        /* FILTER CHIPS */
        .shop-filters-wrapper {
          text-align: center;
        }

        .shop-filter-chip {
          border-radius: 999px;
          border: 1px dashed #c58b61;
          background: #fffdf8;
          padding: 0.3rem 0.9rem;
          font-size: 0.8rem;
          cursor: pointer;
          color: #7b5533;
          transition: all 0.2s ease;
        }

        .shop-filter-chip.active {
          background: #f08c6a;
          border-style: solid;
          color: #fffaf4;
          box-shadow: 0 4px 10px rgba(240, 140, 106, 0.5);
        }

        .shop-filter-chip:hover:not(.active) {
          background: #ffe1c7;
        }

        .shop-filter-helper {
          font-size: 0.8rem;
        }

        /* PRODUCT CARDS */
        .scrapbook-card {
          position: relative;
          background: transparent;
          border: none;
        }

        .scrapbook-card .card-body {
          background: #fffdf8;
          border-radius: 0 0 20px 20px;
          position: relative;
        }

        .scrapbook-card-left .card-body {
          transform: rotate(-1deg);
        }

        .scrapbook-card-right .card-body {
          transform: rotate(1deg);
        }

        .scrapbook-card .card-body::before {
          content: "";
          position: absolute;
          inset: -10px;
          border-radius: 22px;
          border: 1px dashed rgba(210, 167, 122, 0.6);
          z-index: -1;
        }

        .scrap-card-photo-wrapper {
          background: #ffffff;
          padding: 10px 10px 18px;
          border-radius: 16px 16px 0 0;
          box-shadow: 0 10px 18px rgba(141, 103, 64, 0.18);
        }

        .scrap-card-photo {
          width: 100%;
          height: 260px;
          object-fit: cover;
          border-radius: 10px;
        }

        .scrap-card-tape {
          position: absolute;
          width: 75px;
          height: 18px;
          background: rgba(255, 244, 210, 0.95);
          top: -12px;
          border-radius: 3px;
          box-shadow: 0 2px 6px rgba(136, 97, 63, 0.4);
          z-index: 2;
        }

        .scrap-card-tape-top-left {
          left: 16%;
          transform: rotate(-13deg);
        }

        .scrap-card-tape-top-right {
          right: 16%;
          transform: rotate(11deg);
        }

        .shop-card {
          box-shadow: 0 14px 26px rgba(141, 103, 64, 0.22);
          border-radius: 22px;
          overflow: visible;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .shop-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 32px rgba(141, 103, 64, 0.28);
        }

        .product-title {
          font-family: "Dancing Script", cursive;
          color: #5a3b1c;
          font-size: 1.7rem;
        }

        .card-text {
          color: #6d5844;
        }

        .scrap-btn {
          border-radius: 999px;
          border: 1px dashed #c58b61;
          background: #fff6ea;
          color: #7b5533;
          font-weight: 500;
          font-size: 0.95rem;
          transition: 0.2s ease;
        }

        .scrap-btn:hover {
          background: #ffe1c7;
          transform: translateY(-1px);
          box-shadow: 0 4px 10px rgba(197, 139, 97, 0.35);
        }

        .tiny-hint {
          font-size: 0.75rem;
          color: #8a6a4a;
        }

        /* BUNDLE STRIP */
        .shop-bundle-strip {
          margin-top: 1.5rem;
          padding: 0.9rem 1.1rem;
          border-radius: 18px;
          background: #fff5e2;
          border: 1px dashed #d7a16e;
          box-shadow: 0 6px 14px rgba(141, 103, 64, 0.18);
        }

        .bundle-accent {
          color: #a35d48;
          font-weight: 600;
        }

        /* FAQ SECTION */
        .shop-faq h3 {
          color: #5b3a25;
        }

        .shop-faq-items {
          max-width: 720px;
          margin: 0 auto;
        }

        .shop-faq-items details {
          background: #fffdf8;
          border-radius: 14px;
          border: 1px dashed #d7a16e;
          padding: 0.7rem 0.9rem;
          margin-bottom: 0.7rem;
          box-shadow: 0 6px 16px rgba(141, 103, 64, 0.16);
        }

        .shop-faq-items summary {
          cursor: pointer;
          font-size: 0.92rem;
          font-weight: 500;
          color: #7b5533;
          list-style: none;
        }

        .shop-faq-items summary::-webkit-details-marker {
          display: none;
        }

        .shop-faq-items summary::before {
          content: "+";
          display: inline-block;
          margin-right: 0.5rem;
          font-weight: 700;
          color: #a35d48;
        }

        .shop-faq-items details[open] summary::before {
          content: "-";
        }

        .shop-faq-items p {
          margin-top: 0.4rem;
          margin-bottom: 0;
          font-size: 0.86rem;
          color: #6d5844;
        }

        /* FOOTER */
        .scrapbook-footer {
          background: #f3e3c9;
          border-top: 2px dashed #c49b6c;
          color: #7b5533;
          position: relative;
          overflow: hidden;
        }

        .scrapbook-footer::before,
        .scrapbook-footer::after {
          content: "";
          position: absolute;
          width: 70px;
          height: 22px;
          background: #ffeccd;
          top: -10px;
          border-radius: 4px;
          border: 1px solid #d1b38f;
        }

        .scrapbook-footer::before {
          left: 10%;
          transform: rotate(-4deg);
        }

        .scrapbook-footer::after {
          right: 12%;
          transform: rotate(5deg);
        }

        .footer-title h4 {
          color: #5b3a25;
          font-size: 1.7rem;
        }

        .footer-subline {
          color: #7b5533;
          opacity: 0.9;
        }

        .quick-links h6 {
          font-family: "Shadows Into Light", cursive;
          font-size: 1.1rem;
          color: #5b3a25;
        }

        .footer-link {
          color: #7b5533;
          text-decoration: none;
          font-size: 0.95rem;
          transition: color 0.2s ease, transform 0.2s ease;
        }

        .footer-link:hover {
          color: #f08c6a;
          transform: translateY(-2px);
        }

        .social-icons a {
          font-size: 1.6rem;
          margin-left: 1rem;
          color: #7b5533;
          transition: all 0.3s ease;
        }

        .social-icons a:hover {
          color: #f08c6a;
          transform: scale(1.15) translateY(-1px);
        }

        @media (max-width: 768px) {
          .shop-hero {
            min-height: 60vh;
          }

          .shop-hero-paper {
            inset: 5.2rem 0.75rem 2.2rem 0.75rem;
          }

          .shop-hero-grid {
            inset: 5.6rem 1.1rem 2.6rem 1.1rem;
          }

          .shop-polaroid-left,
          .shop-polaroid-right,
          .shop-floating-sticker {
            display: none;
          }

          .scrapbook-footer {
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

export default Shop;
