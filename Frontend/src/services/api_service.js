// src/services/api_service.js

// --------------------------------------
// ✅ API Base URL Configuration
// --------------------------------------
const PROD_URL =
  process.env.REACT_APP_PROD_URL || "https://pathtopages.onrender.com";

const API_BASE_URL = PROD_URL + "/api/v1";
console.log("🔗 API Base URL:", API_BASE_URL);

// --------------------------------------
// 🔐 Auth Token Helper
// --------------------------------------
const getToken = () => localStorage.getItem("authToken");

// --------------------------------------
// ✅ Helper function for Fetch API
// --------------------------------------
export const fetchAPI = async (url, options = {}) => {
  try {
    const token = getToken();

    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers || {}),
    };

    const finalOptions = {
      method: options.method || "GET",
      headers,
      // ✅ stringified only once
      body: options.body ? JSON.stringify(options.body) : undefined,
    };

    const response = await fetch(url, finalOptions);

    // Try to parse JSON (may fail for 204, etc.)
    let data;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    // Attach status so caller can handle it
    if (!response.ok) {
      const error = new Error(
        (data && data.message) || `API request failed (${response.status})`
      );
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    console.error("❌ API Error:", error.message);
    throw error;
  }
};


// --------------------------------------
// 🛍️ Product APIs
// --------------------------------------
export const getProducts = (category = "all") =>
  fetchAPI(`${API_BASE_URL}/products?category=${encodeURIComponent(category)}`);

export const getProduct = (productId) =>
  fetchAPI(`${API_BASE_URL}/products/${productId}`);

// --------------------------------------
// 🛒 Cart APIs (Authenticated)
// --------------------------------------
export const getCart = (userId) =>
  fetchAPI(`${API_BASE_URL}/user/${encodeURIComponent(userId)}/cart`, {
    method: "GET",
  });

export const addToCart = (userId, productId, quantity = 1, variantId = null) =>
  fetchAPI(`${API_BASE_URL}/user/${encodeURIComponent(userId)}/cart/item`, {
    method: "POST",
    // ⬇️ send plain object, NOT JSON.stringify
    body: { productId, quantity, variantId },
  });

export const updateCartItem = (userId, productId, quantity, variantId = null) =>
  fetchAPI(`${API_BASE_URL}/user/${encodeURIComponent(userId)}/cart/item`, {
    method: "PUT",
    body: { productId, quantity, variantId },
  });

export const removeFromCart = (userId, productId) =>
  // convention: quantity 0 means remove
  updateCartItem(userId, productId, 0);

export const clearCart = (userId) =>
  fetchAPI(`${API_BASE_URL}/user/${encodeURIComponent(userId)}/cart/clear`, {
    method: "DELETE",
  });

// --------------------------------------
// 🔐 Auth APIs
// --------------------------------------
export const register = (userData) =>
  fetchAPI(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    body: userData, // ⬅️ plain object
  });

export const login = (credentials) =>
  fetchAPI(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    body: credentials, // ⬅️ plain object
  });

// --------------------------------------
// 🖼️ Image Base URL
// --------------------------------------
export const getImageBaseURL = () => API_BASE_URL.replace(/\/api\/v1$/, "");
