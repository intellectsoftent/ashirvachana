/**
 * Razorpay Checkout utility
 * Requires Razorpay script: https://checkout.razorpay.com/v1/checkout.js
 */

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayOptions {
  key: string;
  amount: number; // in paise
  currency?: string;
  order_id: string;
  name?: string;
  description?: string;
  prefill?: { name?: string; email?: string; contact?: string };
  handler: (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => void;
  modal?: { ondismiss?: () => void };
}

export function openRazorpayCheckout(options: RazorpayOptions): void {
  if (typeof window === "undefined" || !window.Razorpay) {
    throw new Error("Razorpay script not loaded. Ensure checkout.js is included.");
  }
  const rzp = new window.Razorpay({
    key: options.key,
    amount: options.amount,
    currency: options.currency || "INR",
    order_id: options.order_id,
    name: options.name || "Ashirvachana",
    description: options.description || "Booking Payment",
    prefill: options.prefill || {},
    handler: options.handler,
    modal: options.modal || {},
  });
  rzp.open();
}
