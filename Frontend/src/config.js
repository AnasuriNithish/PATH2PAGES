// src/config.js

// [Line 5] <<< CHANGE URL HERE IF NEEDED
// This must match the base URL you use in Postman for {{PROD_URL}}
export const PROD_URL =
  process.env.REACT_APP_PROD_URL || "https://pathtopages.onrender.com";

export const API_BASE = `${PROD_URL}/api/v1`;
