// import React, { useRef, useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { FaWhatsapp, FaInstagram } from "react-icons/fa";
// import { SiThreads } from "react-icons/si";

// const Wishlist = () => {
//   const navbarRef = useRef(null);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const [wishlistItems, setWishlistItems] = useState([
//     {
//       id: "product-1",
//       title: "Vintage Travel Journal",
//       quantity: 1,
//       price: 49.99,
//       image:
//         "https://i.pinimg.com/736x/2b/03/a7/2b03a758649c06f97b38702a5c64ace7.jpg",
//     },
//     {
//       id: "product-2",
//       title: "Travel Bookmark Set",
//       quantity: 2,
//       price: 9.99,
//       image:
//         "https://i.pinimg.com/736x/18/2a/fb/182afb4b8c4a0453bb1f5e60fdbad961.jpg",
//     },
//   ]);

//   // useEffect(() => {
//   //   const handleScroll = () => {
//   //     if (!navbarRef.current) return;
//   //     if (window.scrollY > 50) {
//   //       navbarRef.current.classList.add("scrolled");
//   //     } else {
//   //       navbarRef.current.classList.remove("scrolled");
//   //     }
//   //   };
//   //   window.addEventListener("scroll", handleScroll);
//   //   return () => window.removeEventListener("scroll", handleScroll);
//   // }, []);

//   const removeItem = (id) => {
//     setWishlistItems((prev) => prev.filter((item) => item.id !== id));
//   };

//   return (
//     <>
//       {/* Navbar */}
//       <nav
//         ref={navbarRef}
//         className="navbar navbar-expand-lg fixed-top glass-navbar py-3"
//       >
//         <div className="container">
//           <Link to="/" className="navbar-brand d-flex align-items-center">
//             <img
//               src={process.env.PUBLIC_URL + "/logo.png"}
//               alt="Logo"
//               height="35"
//             />
//             <span className="ms-2 fs-5 fw-bold">PathToPage</span>
//           </Link>
//           <button
//             className="navbar-toggler border-0"
//             type="button"
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//             aria-label="Toggle navigation"
//           >
//             <span className="navbar-toggler-icon"></span>
//           </button>
//           <div
//             className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`}
//           >
//             <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
//               <li className="nav-item">
//                 <Link to="/" className="nav-link px-3">
//                   Home
//                 </Link>
//               </li>
//               <li className="nav-item">
//                 <Link to="/shop" className="nav-link px-3">
//                   Shop
//                 </Link>
//               </li>
            
//               <li className="nav-item">
//                 <Link to="/cart" className="nav-link px-3">
//                   Cart
//                 </Link>
//               </li>
//               <li className="nav-item">
//                 <Link to="/wishlist" className="nav-link px-3 active">
//                   Wishlist
//                 </Link>
//               </li>
//               <li className="nav-item">
//                 <Link to="/profile" className="nav-link px-3">
//                   Profile
//                 </Link>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </nav>

//       {/* Wishlist Content */}
//       <main className="wishlist-main">
//         <div className="container">
//           <h1 className="wishlist-title">Wishlist</h1>
//           {wishlistItems.length === 0 ? (
//             <div className="empty-wishlist glass-card p-5 text-center">
//               <p className="mb-0 fs-5">Your wishlist is empty.</p>
//             </div>
//           ) : (
//             <div className="glass-card p-4">
//               {wishlistItems.map(({ id, title, quantity, price, image }) => (
//                 <div
//                   key={id}
//                   className="wishlist-item d-flex align-items-center mb-4 pb-4 border-bottom"
//                 >
//                   <img
//                     src={image}
//                     alt={title}
//                     className="wishlist-image me-4 rounded"
//                   />
//                   <div className="flex-grow-1">
//                     <h5 className="mb-2">{title}</h5>
//                     <p className="mb-1 text-muted">Quantity: {quantity}</p>
//                     <p className="mb-2 fw-bold fs-5">
//                       ${(price * quantity).toFixed(2)}
//                     </p>
//                     <button
//                       className="btn btn-outline-danger btn-sm"
//                       onClick={() => removeItem(id)}
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </main>

//       {/* Footer */}
//       <footer className="glass-footer d-flex flex-column flex-md-row align-items-center justify-content-between px-4 py-5 text-center text-md-start">
//         {/* Left: Brand / Title */}
//         <div className="footer-title mb-4 mb-md-0">
//           <h4 className="happy-monkey-regular mb-1">Path To Pages</h4>
//           <span className="happy-monkey-regular small">
//             Designed by Nithish
//           </span>
//         </div>

//         {/* Center: Quick Links */}
//         <div className="quick-links mb-4 mb-md-0">
//           <h6 className="mb-3">Quick Links</h6>
//           <ul className="list-unstyled d-flex flex-wrap justify-content-center justify-content-md-start">
//             <li>
//               <Link to="/" className="footer-link">
//                 Home
//               </Link>
//             </li>
//             <li>
//               <Link to="/about" className="footer-link">
//                 About
//               </Link>
//             </li>
//             <li>
//               <Link to="/shop" className="footer-link">
//                 Shop
//               </Link>
//             </li>
//             <li>
//               <Link to="/profile" className="footer-link">
//                 Profile
//               </Link>
//             </li>
//             <li>
//               <Link to="/contact" className="footer-link">
//                 Contact
//               </Link>
//             </li>
//             <li>
//               <Link to="/faq" className="footer-link">
//                 FAQ
//               </Link>
//             </li>
//           </ul>
//         </div>

//         {/* Right: Social Media */}
//         <div className="social-icons d-flex justify-content-center">
//           <a
//             href="https://wa.me/918019418800"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <FaWhatsapp />
//           </a>
//           <a
//             href="https://www.instagram.com/pathtopages"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <FaInstagram />
//           </a>
//           <a
//             href="https://www.threads.net/pathtopages"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <SiThreads />
//           </a>
//         </div>
//       </footer>

//       {/* Styles */}
//       <style jsx="true">{`
//         /* === Scrapbook Journal Theme for Wishlist Page === */

//         :root {
//           --primary-color: #7a5c4d;
//           --primary-hover: #5e4435;
//           --secondary-color: #f4e5d0;
//           --text-color: #4a3b2a;
//           --text-secondary: #6e5844;
//           --background: #fdf8f3;
//           --surface: #fffaf5;
//           --border: #e3c9a7;
//           --shadow-sm: 2px 3px 0 #d4b48b;
//           --shadow-md: 4px 6px 0 #c49a6c;
//           --radius-base: 10px;
//           --radius-lg: 16px;
//         }

//         body {
//           background-color: var(--background);
//           color: var(--text-color);
//           font-family: "Poppins", sans-serif;
//         }

//         /* === Navbar === */
//         .glass-navbar {
//           background: var(--primary-color)
//             url("https://www.transparenttextures.com/patterns/leather.png");
//           color: #f8ead8;
//           border-bottom: 3px dashed #f6e0c6;
//           box-shadow: 0 4px 15px rgba(58, 37, 18, 0.3);
//           transition: 0.3s ease;
//         }

//         .navbar .nav-link,
//         .navbar .navbar-brand {
//           color: #f8ead8 !important;
//           font-weight: 500;
//           transition: 0.3s;
//         }

//         .navbar .nav-link.active {
//           font-weight: 600;
//           color: #ffe6b3 !important;
//         }

//         .navbar .nav-link:hover {
//           color: #ffe6b3 !important;
//         }

//         /* === Main Wishlist Content === */
//         .wishlist-main {
//           margin-top: 100px;
//           margin-bottom: 80px;
//           min-height: calc(100vh - 280px);
//           padding: 0 1rem;
//         }

//         .wishlist-title {
//           font-family: "Caveat Brush", cursive;
//           font-size: 2.5rem;
//           color: #5a3b1c;
//           margin-bottom: 2rem;
//         }

//         .glass-card {
//           background: var(--surface);
//           border: 2px dashed var(--border);
//           border-radius: var(--radius-lg);
//           box-shadow: var(--shadow-md);
//           padding: 24px;
//           transition: all 0.3s ease;
//         }

//         .glass-card:hover {
//           transform: translateY(-3px);
//           box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
//         }

//         .wishlist-item {
//           display: flex;
//           align-items: center;
//           gap: 1rem;
//           margin-bottom: 20px;
//           border-bottom: 2px dashed var(--border);
//           padding-bottom: 16px;
//           transition: all 0.3s ease;
//         }

//         .wishlist-item:last-child {
//           border-bottom: none;
//           margin-bottom: 0;
//           padding-bottom: 0;
//         }

//         .wishlist-image {
//           width: 100px;
//           height: 100px;
//           object-fit: cover;
//           border-radius: var(--radius-base);
//           box-shadow: var(--shadow-sm);
//           transition: transform 0.3s ease;
//         }

//         .wishlist-item:hover .wishlist-image {
//           transform: scale(1.05);
//         }

//         button {
//           border: 2px dashed var(--border);
//           border-radius: var(--radius-base);
//           padding: 6px 12px;
//           background: var(--secondary-color);
//           color: var(--text-color);
//           font-weight: 600;
//           cursor: pointer;
//           transition: all 0.3s ease;
//         }

//         button:hover {
//           background: #e7cda3;
//           transform: translateY(-2px);
//         }

//         /* Empty Wishlist */
//         .empty-wishlist {
//           text-align: center;
//           font-size: 1.2rem;
//           color: var(--text-secondary);
//         }

//         /* === Footer === */
//         .glass-footer {
//           background: var(--primary-color)
//             url("https://www.transparenttextures.com/patterns/paper-1.png");
//           color: #fdf8f3;
//           border-top: 3px dashed #f8ead8;
//           padding: 60px 24px 20px;
//         }

//         .footer-title h4 {
//           font-family: "Caveat Brush", cursive;
//           color: #ffe6b3;
//           text-shadow: 1px 1px 0 #4d3b2b;
//         }

//         .footer-link {
//           color: #fceac7;
//           text-decoration: none;
//           transition: 0.3s;
//         }

//         .footer-link:hover {
//           color: #ffe6b3;
//           transform: translateY(-2px);
//         }

//         .social-icons a {
//           font-size: 1.7rem;
//           margin-left: 1rem;
//           color: #ffe6b3;
//           transition: all 0.3s ease;
//         }

//         .social-icons a:hover {
//           color: #fff;
//           transform: scale(1.2);
//         }

//         /* === Responsive === */
//         @media (max-width: 768px) {
//           .wishlist-main {
//             margin-top: 80px;
//           }

//           .wishlist-title {
//             font-size: 2rem;
//           }

//           .wishlist-image {
//             width: 80px;
//             height: 80px;
//           }

//           .glass-footer {
//             padding: 2rem 0;
//           }

//           .footer-title h4 {
//             font-size: 1.2rem;
//           }

//           .social-icons {
//             gap: 0.5rem !important;
//           }

//           .social-icons a {
//             width: 35px;
//             height: 35px;
//             font-size: 1.1rem;
//           }
//         }

//         @media (max-width: 576px) {
//           .wishlist-item {
//             flex-direction: column;
//             align-items: flex-start;
//           }

//           .wishlist-image {
//             margin-bottom: 1rem;
//           }
//         }
//       `}</style>
//     </>
//   );
// };

// export default Wishlist;
