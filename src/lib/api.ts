import { API_BASE_URL } from "@/config";

// ─── Token helpers ───────────────────────────────────────
export const getUserToken = () => localStorage.getItem("user_token");
export const setUserToken = (token: string) => localStorage.setItem("user_token", token);
export const clearUserToken = () => localStorage.removeItem("user_token");

export const getAdminToken = () => localStorage.getItem("admin_token");
export const setAdminToken = (token: string) => localStorage.setItem("admin_token", token);
export const clearAdminToken = () => localStorage.removeItem("admin_token");

// ─── Generic fetch wrapper ──────────────────────────────
interface FetchOptions extends RequestInit {
  token?: string | null;
  isFormData?: boolean;
}

export async function apiFetch<T = any>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { token, headers: customHeaders, isFormData, ...rest } = options;

  const headers: Record<string, string> = {
    ...(customHeaders as Record<string, string>),
  };

  // Don't set Content-Type for FormData — browser sets it with boundary
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, { headers, ...rest });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || data.error || `Request failed (${res.status})`);
  }

  return data as T;
}

// ─── FormData upload helper ─────────────────────────────
export async function apiUpload<T = any>(
  path: string,
  formData: FormData,
  options: { method?: string; token?: string | null } = {}
): Promise<T> {
  return apiFetch<T>(path, {
    method: options.method || "POST",
    token: options.token,
    body: formData,
    isFormData: true,
  });
}

// ─── User Auth API ───────────────────────────────────────
export const authApi = {
  signup: (body: { name: string; email: string; password: string; phone: string }) =>
    apiFetch<{ token: string; user: any }>("/api/auth/signup", { method: "POST", body: JSON.stringify(body) }),

  login: (body: { email: string; password: string }) =>
    apiFetch<{ token: string; user: any }>("/api/auth/login", { method: "POST", body: JSON.stringify(body) }),

  getProfile: () =>
    apiFetch<{ user: any }>("/api/auth/me", { token: getUserToken() }),

  updateProfile: (body: Record<string, any>) =>
    apiFetch("/api/auth/profile", { method: "PUT", token: getUserToken(), body: JSON.stringify(body) }),
};

// ─── Admin Auth API ──────────────────────────────────────
export const adminAuthApi = {
  login: (body: { username: string; password: string }) =>
    apiFetch<{ token: string; admin: any }>("/api/admin/login", { method: "POST", body: JSON.stringify(body) }),

  verify: () =>
    apiFetch("/api/admin/verify", { token: getAdminToken() }),

  forgotPassword: (email: string) =>
    apiFetch<{ success: boolean; message: string }>("/api/admin/forgot-password", { method: "POST", body: JSON.stringify({ email }) }),

  verifyOtp: (email: string, otp: string) =>
    apiFetch<{ success: boolean; message: string; reset_token: string }>("/api/admin/verify-otp", { method: "POST", body: JSON.stringify({ email, otp }) }),

  resetPassword: (reset_token: string, new_password: string) =>
    apiFetch<{ success: boolean; message: string }>("/api/admin/reset-password", { method: "POST", body: JSON.stringify({ reset_token, new_password }) }),
};

// ─── Poojas API ──────────────────────────────────────────
export const poojasApi = {
  // Public
  getAll: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return apiFetch<any[]>(`/api/poojas${qs}`);
  },
  getById: (id: string | number, params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return apiFetch<any>(`/api/poojas/${id}${qs}`);
  },
  // Admin
  adminGetAll: () =>
    apiFetch<any[]>("/api/poojas/admin/all", { token: getAdminToken() }),
  adminCreate: (body: Record<string, any> | FormData) =>
    body instanceof FormData
      ? apiUpload<any>("/api/poojas/admin/create", body, { token: getAdminToken() })
      : apiFetch<any>("/api/poojas/admin/create", { method: "POST", token: getAdminToken(), body: JSON.stringify(body) }),
  adminUpdate: (id: string | number, body: Record<string, any> | FormData) =>
    body instanceof FormData
      ? apiUpload<any>(`/api/poojas/admin/${id}`, body, { method: "PUT", token: getAdminToken() })
      : apiFetch<any>(`/api/poojas/admin/${id}`, { method: "PUT", token: getAdminToken(), body: JSON.stringify(body) }),
  adminDelete: (id: string | number) =>
    apiFetch(`/api/poojas/admin/${id}`, { method: "DELETE", token: getAdminToken() }),
};

// ─── Idols API ───────────────────────────────────────────
export const idolsApi = {
  // Public
  getAll: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return apiFetch<any[]>(`/api/idols${qs}`);
  },
  getById: (id: string | number, params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return apiFetch<any>(`/api/idols/${id}${qs}`);
  },
  // Admin
  adminGetAll: () =>
    apiFetch<any[]>("/api/idols/admin/all", { token: getAdminToken() }),
  adminCreate: (body: Record<string, any> | FormData) =>
    body instanceof FormData
      ? apiUpload<any>("/api/idols/admin/create", body, { token: getAdminToken() })
      : apiFetch<any>("/api/idols/admin/create", { method: "POST", token: getAdminToken(), body: JSON.stringify(body) }),
  adminUpdate: (id: string | number, body: Record<string, any> | FormData) =>
    body instanceof FormData
      ? apiUpload<any>(`/api/idols/admin/${id}`, body, { method: "PUT", token: getAdminToken() })
      : apiFetch<any>(`/api/idols/admin/${id}`, { method: "PUT", token: getAdminToken(), body: JSON.stringify(body) }),
  adminDelete: (id: string | number) =>
    apiFetch(`/api/idols/admin/${id}`, { method: "DELETE", token: getAdminToken() }),
};

// ─── Blogs API ───────────────────────────────────────────
export const blogsApi = {
  getAll: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return apiFetch<any[]>(`/api/blogs${qs}`);
  },
  getById: (id: string | number) =>
    apiFetch<any>(`/api/blogs/${id}`),
  adminGetAll: () =>
    apiFetch<any[]>("/api/blogs/admin/all", { token: getAdminToken() }),
  adminCreate: (body: Record<string, any> | FormData) =>
    body instanceof FormData
      ? apiUpload<any>("/api/blogs/admin/create", body, { token: getAdminToken() })
      : apiFetch<any>("/api/blogs/admin/create", { method: "POST", token: getAdminToken(), body: JSON.stringify(body) }),
  adminUpdate: (id: string | number, body: Record<string, any> | FormData) =>
    body instanceof FormData
      ? apiUpload<any>(`/api/blogs/admin/${id}`, body, { method: "PUT", token: getAdminToken() })
      : apiFetch<any>(`/api/blogs/admin/${id}`, { method: "PUT", token: getAdminToken(), body: JSON.stringify(body) }),
  adminDelete: (id: string | number) =>
    apiFetch(`/api/blogs/admin/${id}`, { method: "DELETE", token: getAdminToken() }),
};

// ─── Testimonials API ────────────────────────────────────
export const testimonialsApi = {
  getAll: () =>
    apiFetch<any[]>("/api/testimonials"),
  adminGetAll: () =>
    apiFetch<any[]>("/api/testimonials/admin/all", { token: getAdminToken() }),
  adminCreate: (body: Record<string, any>) =>
    apiFetch<any>("/api/testimonials/admin/create", { method: "POST", token: getAdminToken(), body: JSON.stringify(body) }),
  adminUpdate: (id: string | number, body: Record<string, any>) =>
    apiFetch<any>(`/api/testimonials/admin/${id}`, { method: "PUT", token: getAdminToken(), body: JSON.stringify(body) }),
  adminDelete: (id: string | number) =>
    apiFetch(`/api/testimonials/admin/${id}`, { method: "DELETE", token: getAdminToken() }),
};

// ─── Locations API ───────────────────────────────────────
export const locationsApi = {
  getAll: () =>
    apiFetch<any[]>("/api/locations"),
  adminGetAll: () =>
    apiFetch<any[]>("/api/locations/admin/all", { token: getAdminToken() }),
  adminCreate: (body: Record<string, any>) =>
    apiFetch<any>("/api/locations/admin/create", { method: "POST", token: getAdminToken(), body: JSON.stringify(body) }),
  adminUpdate: (id: string | number, body: Record<string, any>) =>
    apiFetch<any>(`/api/locations/admin/${id}`, { method: "PUT", token: getAdminToken(), body: JSON.stringify(body) }),
  adminDelete: (id: string | number) =>
    apiFetch(`/api/locations/admin/${id}`, { method: "DELETE", token: getAdminToken() }),
};

// ─── Pujaris API ─────────────────────────────────────────
export const pujarisApi = {
  getAll: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return apiFetch<any[]>(`/api/pujaris${qs}`);
  },
  getById: (id: string | number) =>
    apiFetch<any>(`/api/pujaris/${id}`),
  adminGetAll: () =>
    apiFetch<any[]>("/api/pujaris/admin/all", { token: getAdminToken() }),
  adminCreate: (body: Record<string, any>) =>
    apiFetch<any>("/api/pujaris/admin/create", { method: "POST", token: getAdminToken(), body: JSON.stringify(body) }),
  adminUpdate: (id: string | number, body: Record<string, any>) =>
    apiFetch<any>(`/api/pujaris/admin/${id}`, { method: "PUT", token: getAdminToken(), body: JSON.stringify(body) }),
  adminToggleAvailability: (id: string | number) =>
    apiFetch(`/api/pujaris/admin/${id}/toggle-availability`, { method: "PATCH", token: getAdminToken() }),
  adminDelete: (id: string | number) =>
    apiFetch(`/api/pujaris/admin/${id}`, { method: "DELETE", token: getAdminToken() }),
};

// ─── Cart API ────────────────────────────────────────────
export const cartApi = {
  get: () =>
    apiFetch<any>("/api/cart", { token: getUserToken() }),
  add: (body: { item_type: string; item_id: number; quantity: number }) =>
    apiFetch<any>("/api/cart/add", { method: "POST", token: getUserToken(), body: JSON.stringify(body) }),
  update: (cartItemId: number, quantity: number) =>
    apiFetch<any>(`/api/cart/${cartItemId}`, { method: "PUT", token: getUserToken(), body: JSON.stringify({ quantity }) }),
  remove: (cartItemId: number) =>
    apiFetch(`/api/cart/${cartItemId}`, { method: "DELETE", token: getUserToken() }),
  clear: () =>
    apiFetch("/api/cart/clear/all", { method: "DELETE", token: getUserToken() }),
};

// ─── Orders API ──────────────────────────────────────────
export const ordersApi = {
  // User (logged in)
  createRazorpayOrder: (body: { amount: number; currency?: string; receipt?: string }) =>
    apiFetch<any>("/api/orders/create-razorpay-order", { method: "POST", token: getUserToken(), body: JSON.stringify(body) }),
  place: (body: Record<string, any>) =>
    apiFetch<any>("/api/orders/place", { method: "POST", token: getUserToken(), body: JSON.stringify(body) }),
  // Guest (pooja checkout without login — no token)
  createRazorpayOrderGuest: (body: { amount: number; currency?: string; receipt?: string }) =>
    apiFetch<any>("/api/orders/create-razorpay-order", { method: "POST", body: JSON.stringify(body) }),
  placeGuest: (body: Record<string, any>) =>
    apiFetch<any>("/api/orders/place", { method: "POST", body: JSON.stringify(body) }),
  getMyOrders: () =>
    apiFetch<any[]>("/api/orders/my-orders", { token: getUserToken() }),
  getById: (id: string | number) =>
    apiFetch<any>(`/api/orders/${id}`, { token: getUserToken() }),
  // Admin
  adminGetAll: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return apiFetch<any[]>(`/api/orders/admin/all${qs}`, { token: getAdminToken() });
  },
  adminGetStats: () =>
    apiFetch<any>("/api/orders/admin/stats", { token: getAdminToken() }),
  adminUpdateStatus: (id: string | number, body: Record<string, any>) =>
    apiFetch<any>(`/api/orders/admin/${id}/status`, { method: "PUT", token: getAdminToken(), body: JSON.stringify(body) }),
};
