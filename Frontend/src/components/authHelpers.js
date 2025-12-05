// authHelpers.js
export const PROD_URL = "https://pathtopages.onrender.com";

// Check if user is logged in
export const isLoggedIn = async () => {
  const token = localStorage.getItem("authToken");
  if (!token) return false;

  try {
    const res = await fetch(`${PROD_URL}/api/v1/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    return res.ok && data?.success;
  } catch (err) {
    localStorage.removeItem("authToken");
    return false;
  }
};
