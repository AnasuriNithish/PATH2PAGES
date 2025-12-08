// Home.jsx – Vintage Scrapbook / Polaroid Theme + Extra Floating Crafts
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import { SiThreads } from "react-icons/si";
import { ShoppingCart } from "lucide-react";
import { gsap } from "gsap";
import anime from "animejs";

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // dynamic tagline + chapter visibility
  const [tag, setTag] = useState("Scrapbooks • Stickers");
  const [showChapter, setShowChapter] = useState(false);

  const polaroidLeftRef = useRef(null);
  const polaroidRightRef = useRef(null);
  const heroRef = useRef(null);

  // floating stickers / craft icons
  const stickerRefs = useRef([]);

  useEffect(() => {
    // === GSAP: polaroids gentle infinite floating ===
    if (polaroidLeftRef.current) {
      gsap.to(polaroidLeftRef.current, {
        y: -8,
        duration: 3,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    }

    if (polaroidRightRef.current) {
      gsap.to(polaroidRightRef.current, {
        y: 8,
        duration: 3.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    }

    // === Anime.js: polaroids entry (fade + slide) ===
    anime({
      targets: ".polaroid",
      opacity: [0, 1],
      translateY: [-20, 0],
      duration: 900,
      delay: anime.stagger(150),
      easing: "easeOutQuad",
    });

    // === GSAP: hero block fade-in ===
    if (heroRef.current) {
      gsap.from(heroRef.current, {
        opacity: 1,
        y: 25,
        duration: 0.7,
        ease: "power2.out",
      });
    }

    // === Floating stickers / craft icons wiggle / float ===
    stickerRefs.current.forEach((sticker, i) => {
      if (!sticker) return;
      gsap.to(sticker, {
        x: i % 2 === 0 ? 18 : -18,
        y: 14,
        rotation: i % 2 === 0 ? 7 : -7,
        duration: 2.6 + i * 0.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });

    // === Dynamic rotating tagline ===
    const phrases = [
      "Scrapbooks • Stickers",
      "Polaroids • Memories",
      "Aesthetic Journals",
      "Cute Layout Ideas",
    ];
    let index = 0;
    const taglineInterval = setInterval(() => {
      index = (index + 1) % phrases.length;
      setTag(phrases[index]);
    }, 2500);

    // === Scroll – parallax + chapter indicator ===
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;

      if (heroRef.current) {
        heroRef.current.style.transform = `translateY(${scrollY * 0.15}px)`;
      }

      setShowChapter(scrollY > 350);
    };

    window.addEventListener("scroll", handleScroll);

    // === Handwritten-style cursor trail ===
    const handleMouseMove = (e) => {
      const trail = document.createElement("div");
      trail.className = "trail";
      trail.style.left = e.pageX + "px";
      trail.style.top = e.pageY + "px";
      document.body.appendChild(trail);

      setTimeout(() => {
        trail.remove();
      }, 900);
    };

    document.addEventListener("mousemove", handleMouseMove);

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousemove", handleMouseMove);
      clearInterval(taglineInterval);
    };
  }, []);

  return (
    <>
      {/* ▬▬▬▬▬▬▬ NAVBAR (Scrapbook Tape + Paper) ▬▬▬▬▬▬▬ */}
      <nav className="navbar navbar-expand-lg fixed-top px-3 py-2 scrapbook-navbar">
        <div className="container-fluid">
          {/* Logo + Brand */}
          <Link to="/" className="navbar-brand d-flex align-items-center">
            <div className="logo-wrapper">
              <img
                src={process.env.PUBLIC_URL + "/logo.png"}
                alt="Logo"
                height="38"
              />
            </div>
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

      {/* ▬▬▬▬▬▬▬ HERO SECTION – Vintage Scrapbook Feel ▬▬▬▬▬▬▬ */}
      <header className="d-flex flex-column justify-content-center align-items-center text-center hero-section">
        <div className="hero-paper-layer"></div>
        <div className="hero-grid-overlay"></div>

        <div className="hero-content" ref={heroRef}>
          <span className="hero-tagline small fw-semibold hero-anim">
            {tag}
          </span>
          <h1 className="display-2 dancing-script fw-bold mt-2 hero-title hero-anim">
            Turn your moments into pages
          </h1>
          <p className="lead mt-3 px-3 hero-subtitle hero-anim">
            Print your favourite photos in a Polaroid style, decorate with
            stickers, and create a cozy vintage album that feels like a
            storybook of your life.
          </p>
          <div className="hero-buttons mt-4">
            <Link to="/shop" className="btn btn-shop hero-anim">
              Explore Scrapbooks
            </Link>
            <Link
              to="/journal"
              className="btn btn-outline-notes ms-2 hero-anim"
            >
              See Sample Layout
            </Link>
          </div>
        </div>

        {/* Floating Polaroid-style previews */}
        <div className="polaroid polaroid-left" ref={polaroidLeftRef}>
          <img
            src="https://raw.githubusercontent.com/AnasuriNithish/PathtoPages/ab2fbd5de49fb4fbb735842755026ba7fbf96de4/Frontend/IMG-20251023-WA0020.jpg"
            alt="Scrapbook preview"
          />
          <span className="polaroid-caption">Road trip memories ✈️</span>
        </div>

        <div className="polaroid polaroid-right" ref={polaroidRightRef}>
          <img
            src="https://raw.githubusercontent.com/AnasuriNithish/PathtoPages/ab2fbd5de49fb4fbb735842755026ba7fbf96de4/Frontend/IMG-20251027-WA0010.jpg"
            alt="Stickers preview"
          />
          <span className="polaroid-caption">Sticker pack & notes 💌</span>
        </div>

        {/* Floating craft things */}
        <div
          className="floating-sticker floating-sticker-1"
          ref={(el) => (stickerRefs.current[0] = el)}
        >
          ✨
        </div>
        <div
          className="floating-sticker floating-sticker-2"
          ref={(el) => (stickerRefs.current[1] = el)}
        >
          📒
        </div>
        <div
          className="floating-sticker floating-sticker-3"
          ref={(el) => (stickerRefs.current[2] = el)}
        >
          ✂️
        </div>
        <div
          className="floating-sticker floating-sticker-4"
          ref={(el) => (stickerRefs.current[3] = el)}
        >
          📎
        </div>
        <div
          className="floating-sticker floating-sticker-5"
          ref={(el) => (stickerRefs.current[4] = el)}
        >
          🧵
        </div>
        <div
          className="floating-sticker floating-sticker-6"
          ref={(el) => (stickerRefs.current[5] = el)}
        >
          🖊️
        </div>
      </header>

      {/* ▬▬▬▬▬▬▬ FEATURED PRODUCTS – Polaroid Cards ▬▬▬▬▬▬▬ */}
      <main className="container py-5 text-center">
        <h2 className="fw-bold mb-2 text-dark dancing-script section-heading">
          Featured for your next chapter
        </h2>
        <p className="text-muted small mb-4 section-subtitle">
          Start with a scrapbook, add Polaroid-style photos, finish with cute
          sticker details.
        </p>

        <div className="row g-4 justify-content-center">
          {/* Scrapbook Product */}
          <div className="col-md-4">
            <Link to="/journal" className="text-decoration-none text-dark">
              <div className="card border-0 shadow-sm h-100 scrap-card scrap-card-1">
                <div className="card-tape card-tape-left"></div>
                <div className="card-tape card-tape-right"></div>
                <div className="card-inner">
                  <img
                    src="https://raw.githubusercontent.com/AnasuriNithish/PathtoPages/ab2fbd5de49fb4fbb735842755026ba7fbf96de4/Frontend/IMG-20251023-WA0020.jpg"
                    alt="Vintage Scrapbook"
                    className="card-img-top"
                  />
                  <div className="card-body">
                    <h5 className="fw-semibold dancing-script">
                      Vintage Scrapbook Album
                    </h5>
                    <p className="small text-muted mb-1">
                      Hardbound, thick pages, perfect for Polaroid prints.
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Sticker Pack Product */}
          <div className="col-md-4">
            <Link to="/bookmark" className="text-decoration-none text-dark">
              <div className="card border-0 shadow-sm h-100 scrap-card scrap-card-2">
                <div className="card-tape card-tape-left"></div>
                <div className="card-tape card-tape-right"></div>
                <div className="card-inner">
                  <img
                    src="https://raw.githubusercontent.com/AnasuriNithish/PathtoPages/ab2fbd5de49fb4fbb735842755026ba7fbf96de4/Frontend/IMG-20251027-WA0010.jpg"
                    alt="Sticker & Bookmark Pack"
                    className="card-img-top"
                  />
                  <div className="card-body">
                    <h5 className="fw-semibold dancing-script">
                      Sticker & Bookmark Set
                    </h5>
                    <p className="small text-muted mb-1">
                      Add doodles, labels and tiny details to every page.
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </main>

      {/* sticky chapter divider */}
      {showChapter && (
        <div className="chapter-divider">✦ Chapter 2: Your Story Begins ✦</div>
      )}

      {/* ▬▬▬▬▬▬▬ FOOTER ▬▬▬▬▬▬▬ */}
      <footer className="scrapbook-footer py-4">
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

      <div id="cursorTrail"></div>

      {/* ▬▬▬▬▬▬▬ INLINE STYLES – Scrapbook Theme + EFFECTS ▬▬▬▬▬▬▬ */}
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400..700&family=Shadows+Into+Light&display=swap");

        .dancing-script {
          font-family: "Dancing Script", cursive;
          font-optical-sizing: auto;
          font-weight: 600;
          font-style: normal;
        }

        body {
          background-color: #fdf6ec;
          font-family: "Poppins", sans-serif;
        }

        /* ▬ NAVBAR ▬ */
        .scrapbook-navbar {
          background: #f3e3c9;
          border-bottom: 2px dashed #c49b6c;
          box-shadow: 0 4px 15px rgba(151, 107, 60, 0.25);
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .logo-wrapper {
          background: #fff;
          padding: 4px 6px;
          border-radius: 10px;
          box-shadow: 0 2px 6px rgba(130, 96, 63, 0.35);
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
          color: #6b4a2f;
          transition: transform 0.15s ease;
        }

        .cart-link:hover .cart-icon {
          transform: translateY(-1px) scale(1.03);
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

        /* ▬ HERO ▬ */
        .hero-section {
          position: relative;
          min-height: 100vh;
          padding-top: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: radial-gradient(circle at top left, #ffe9d1 0, #fdf6ec 40%, #f8e0cc 100%);
        }

        .hero-paper-layer {
          position: absolute;
          inset: 3rem 1rem 2rem 1rem;
          background: rgba(255, 253, 248, 0.82) !important;
          border-radius: 22px;
          box-shadow: 0 20px 40px rgba(142, 101, 60, 0.25);
        }

        .hero-grid-overlay {
          position: absolute;
          inset: 3.4rem 1.4rem 2.4rem 1.4rem;
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
          opacity: 0.28!important; 
        }

        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 700px;
          padding: 1.5rem;
          transition: transform 0.3s ease-out;
        }

        .hero-tagline {
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #9b5a2f;
          background: #fff7e7;
          display: inline-block;
          padding: 0.25rem 0.9rem;
          border-radius: 999px;
          border: 1px dashed #e2a46b;
        }

        .hero-title {
          color: #3b2413;
          text-shadow:
            0 2px 6px rgba(255, 240, 220, 0.9),
            0 0 12px rgba(255, 220, 190, 0.6);
        }

        .hero-subtitle {
          color: #4a2d18;
          font-size: 1.1rem;
          font-weight: 500;
          letter-spacing: 0.02em;
          text-shadow: 0 1px 3px rgba(255, 248, 235, 0.9);
          background: transparent;
          padding: 0;
          border-radius: 0;
          position: relative;
          display: inline-block;
        }

        .hero-buttons .btn {
          border-radius: 999px;
          padding-inline: 1.4rem;
          padding-block: 0.55rem;
          font-weight: 500;
          font-size: 0.95rem;
        }

        .btn-shop {
          background: linear-gradient(135deg, #f08c6a, #f6b18b);
          border: none;
          color: #fff;
          box-shadow: 0 4px 10px rgba(240, 140, 106, 0.5);
        }

        .btn-shop:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 14px rgba(240, 140, 106, 0.6);
        }

        .btn-outline-notes {
          border: 1px dashed #c58b61;
          background: #fff6ea;
          color: #7b5533;
        }

        .btn-outline-notes:hover {
          background: #ffe1c7;
        }

        /* Floating Polaroids */
        .polaroid {
          position: absolute;
          width: 190px;
          background: #fff;
          padding: 8px 8px 18px;
          border-radius: 10px;
          box-shadow: 0 8px 18px rgba(87, 63, 42, 0.35);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .polaroid img {
          width: 100%;
          height: 135px;
          object-fit: cover;
          border-radius: 6px;
        }

        .polaroid-caption {
          font-size: 0.75rem;
          color: #6f4b31;
          font-family: "Shadows Into Light", cursive;
        }

        .polaroid-left {
          left: 8%;
          bottom: 16%;
          transform: rotate(-8deg);
        }

        .polaroid-right {
          right: 8%;
          top: 20%;
          transform: rotate(9deg);
        }

        /* Floating craft icons */
        .floating-sticker {
          position: absolute;
          font-size: 32px;
          opacity: 0.7;
          pointer-events: none;
          z-index: 3;
        }

        .floating-sticker-1 {
          top: 23%;
          left: 16%;
        }

        .floating-sticker-2 {
          bottom: 18%;
          right: 14%;
        }

        .floating-sticker-3 {
          top: 18%;
          right: 24%;
        }

        .floating-sticker-4 {
          bottom: 24%;
          left: 10%;
        }

        .floating-sticker-5 {
          top: 30%;
          left: 30%;
        }

        .floating-sticker-6 {
          bottom: 20%;
          right: 32%;
        }

        @media (max-width: 768px) {
          .polaroid-left,
          .polaroid-right,
          .floating-sticker {
            display: none;
          }

          .hero-paper-layer {
            inset: 5.5rem 0.75rem 2rem 0.75rem;
          }

          .hero-grid-overlay {
            inset: 5.9rem 1.1rem 2.4rem 1.1rem;
          }
        }

        /* ▬ FEATURED CARDS ▬ */
        .section-heading {
          color: #5b3a25;
        }

        .section-subtitle {
          max-width: 520px;
          margin: 0 auto;
        }

        .scrap-card {
          position: relative;
          background: transparent;
        }

        .scrap-card .card-inner {
          background: #fffdf8;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 14px 26px rgba(141, 103, 64, 0.25);
          transform-origin: center center;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .scrap-card-1 .card-inner {
          transform: rotate(-2.5deg);
        }

        .scrap-card-2 .card-inner {
          transform: rotate(2.5deg);
        }

        .scrap-card:hover .card-inner {
          transform: rotate(0deg) translateY(-4px);
          box-shadow: 0 20px 32px rgba(141, 103, 64, 0.28);
          animation: wiggle 0.4s ease-in-out;
        }

        @keyframes wiggle {
          0% { transform: rotate(-1deg) translateY(-4px); }
          25% { transform: rotate(1.5deg) translateY(-4px); }
          50% { transform: rotate(-1deg) translateY(-4px); }
          75% { transform: rotate(1.5deg) translateY(-4px); }
          100% { transform: rotate(0deg) translateY(-4px); }
        }

        .scrap-card .card-img-top {
          height: 260px;
          object-fit: cover;
        }

        .card-tape {
          position: absolute;
          width: 70px;
          height: 18px;
          background: rgba(255, 244, 210, 0.9);
          top: -10px;
          border-radius: 3px;
          box-shadow: 0 2px 6px rgba(136, 97, 63, 0.4);
        }

        .card-tape-left {
          left: 16%;
          transform: rotate(-12deg);
        }

        .card-tape-right {
          right: 16%;
          transform: rotate(11deg);
        }

        .scrap-card .card-body {
          position: relative;
          padding-bottom: 1.6rem;
        }

        /* ▬ FOOTER ▬ */
        .scrapbook-footer {
          background: #f3e3c9;
          border-top: 2px dashed #c49b6c;
          color: #7b5533;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          padding-inline: 2rem;
          position: relative;
          margin-top: 3rem;
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
        }

        .footer-copy {
          color: #7b5533;
          opacity: 0.85;
        }

        @media (max-width: 768px) {
          .scrapbook-footer {
            flex-direction: column;
            text-align: center;
            padding: 2rem 1rem;
          }

          .footer-left,
          .footer-right {
            align-items: center;
          }
        }

        /* Cursor trail */
        .trail {
          position: absolute;
          width: 6px;
          height: 6px;
          background: #f08c6a;
          border-radius: 50%;
          opacity: 0.6;
          pointer-events: none;
          animation: fadeOutTrail 0.9s ease-out forwards;
          z-index: 9999;
        }

        @keyframes fadeOutTrail {
          from { opacity: 0.6; transform: scale(1); }
          to { opacity: 0; transform: scale(3); }
        }

        /* Chapter divider */
        .chapter-divider {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: #ffeed8;
          padding: 10px 20px;
          border: 1px dashed #d7a16e;
          border-radius: 999px;
          box-shadow: 0 3px 8px rgba(105, 74, 47, 0.25);
          font-family: "Shadows Into Light", cursive;
          z-index: 999;
          font-size: 0.95rem;
        }
      `}</style>
    </>
  );
};

export default Home;
