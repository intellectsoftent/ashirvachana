// API Configuration
// Change this URL to point to your deployed backend
// export const API_BASE_URL = "https://api.ashirvachana.com";
export const API_BASE_URL = "http://localhost:5000";

// Razorpay Key ID (public key) - add VITE_RAZORPAY_KEY_ID to .env
export const RAZORPAY_KEY_ID =
  import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_SOEC5u0A81FhHB";
