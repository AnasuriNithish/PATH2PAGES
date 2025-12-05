// src/App.js
import React from "react";
import {
  HashRouter as Router, // works well on static hosting
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import Home from "./components/Home";
import Shop from "./components/Shop";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import AuthPage from "./components/AuthPage";
import Myaccount from "./components/Myaccount";
import Journal from "./components/Journal";
import Bookmark from "./components/Bookmark";

function App() {
  return (
    <AuthProvider>
      <Router>  
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/bookmark" element={<Bookmark />} />
          <Route path="/cart" element={<Cart />} />

          {/* Auth page (login + signup) */}
          <Route path="/auth" element={<AuthPage />} />

          {/* Account page – Myaccount is the profile/dashboard */}
          <Route path="/profile" element={<Myaccount />} />

          {/* Checkout – if you want, you can make this protected later */}
          <Route path="/checkout" element={<Checkout />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
