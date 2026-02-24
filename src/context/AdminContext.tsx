import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { adminAuthApi, getAdminToken, setAdminToken, clearAdminToken, poojasApi, idolsApi, blogsApi, testimonialsApi } from "@/lib/api";
import { normalizeList } from "@/lib/normalize";

interface AdminContextType {
  isAdmin: boolean;
  adminLoading: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  // Data
  poojas: any[];
  idols: any[];
  testimonials: any[];
  blogs: any[];
  dataLoading: boolean;
  // CRUD
  refreshPoojas: () => Promise<void>;
  addPooja: (body: Record<string, any> | FormData) => Promise<void>;
  updatePooja: (id: string | number, body: Record<string, any> | FormData) => Promise<void>;
  deletePooja: (id: string | number) => Promise<void>;
  refreshIdols: () => Promise<void>;
  addIdol: (body: Record<string, any> | FormData) => Promise<void>;
  updateIdol: (id: string | number, body: Record<string, any> | FormData) => Promise<void>;
  deleteIdol: (id: string | number) => Promise<void>;
  refreshTestimonials: () => Promise<void>;
  addTestimonial: (body: Record<string, any>) => Promise<void>;
  updateTestimonial: (id: string | number, body: Record<string, any>) => Promise<void>;
  deleteTestimonial: (id: string | number) => Promise<void>;
  refreshBlogs: () => Promise<void>;
  addBlog: (body: Record<string, any> | FormData) => Promise<void>;
  updateBlog: (id: string | number, body: Record<string, any> | FormData) => Promise<void>;
  deleteBlog: (id: string | number) => Promise<void>;
}

const AdminContext = createContext<AdminContextType>({} as AdminContextType);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);

  const [poojas, setPoojas] = useState<any[]>([]);
  const [idols, setIdols] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);

  // On mount, verify existing admin token
  useEffect(() => {
    const token = getAdminToken();
    if (token) {
      adminAuthApi
        .verify()
        .then(() => setIsAdmin(true))
        .catch(() => clearAdminToken())
        .finally(() => setAdminLoading(false));
    } else {
      setAdminLoading(false);
    }
  }, []);

  // Fetch public data on mount
  const fetchPublicData = useCallback(async () => {
    setDataLoading(true);
    try {
      const [p, i, t, b] = await Promise.all([
        poojasApi.getAll().catch(() => []),
        idolsApi.getAll().catch(() => []),
        testimonialsApi.getAll().catch(() => []),
        blogsApi.getAll().catch(() => []),
      ]);
      setPoojas(normalizeList(Array.isArray(p) ? p : (p as any)?.poojas ?? (p as any)?.data ?? []));
      setIdols(normalizeList(Array.isArray(i) ? i : (i as any)?.idols ?? (i as any)?.data ?? []));
      setTestimonials(Array.isArray(t) ? t : (t as any)?.testimonials ?? (t as any)?.data ?? []);
      setBlogs(normalizeList(Array.isArray(b) ? b : (b as any)?.blogs ?? (b as any)?.data ?? []));
    } catch {
      // silent
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPublicData();
  }, [fetchPublicData]);

  const login = async (password: string): Promise<boolean> => {
    try {
      const res = await adminAuthApi.login(password);
      setAdminToken(res.token);
      setIsAdmin(true);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setIsAdmin(false);
    clearAdminToken();
  };

  // ─── Poojas CRUD ──────────────────────────────────
  const refreshPoojas = useCallback(async () => {
    try {
      const token = getAdminToken();
      const data = token ? await poojasApi.adminGetAll() : await poojasApi.getAll();
      setPoojas(normalizeList(Array.isArray(data) ? data : (data as any)?.poojas ?? (data as any)?.data ?? []));
    } catch { /* silent */ }
  }, []);

  const addPooja = async (body: Record<string, any> | FormData) => {
    await poojasApi.adminCreate(body);
    await refreshPoojas();
  };
  const updatePooja = async (id: string | number, body: Record<string, any> | FormData) => {
    await poojasApi.adminUpdate(id, body);
    await refreshPoojas();
  };
  const deletePooja = async (id: string | number) => {
    await poojasApi.adminDelete(id);
    await refreshPoojas();
  };

  // ─── Idols CRUD ───────────────────────────────────
  const refreshIdols = useCallback(async () => {
    try {
      const token = getAdminToken();
      const data = token ? await idolsApi.adminGetAll() : await idolsApi.getAll();
      setIdols(normalizeList(Array.isArray(data) ? data : (data as any)?.idols ?? (data as any)?.data ?? []));
    } catch { /* silent */ }
  }, []);

  const addIdol = async (body: Record<string, any> | FormData) => {
    await idolsApi.adminCreate(body);
    await refreshIdols();
  };
  const updateIdol = async (id: string | number, body: Record<string, any> | FormData) => {
    await idolsApi.adminUpdate(id, body);
    await refreshIdols();
  };
  const deleteIdol = async (id: string | number) => {
    await idolsApi.adminDelete(id);
    await refreshIdols();
  };

  // ─── Testimonials CRUD ────────────────────────────
  const refreshTestimonials = useCallback(async () => {
    try {
      const token = getAdminToken();
      const data = token ? await testimonialsApi.adminGetAll() : await testimonialsApi.getAll();
      setTestimonials(Array.isArray(data) ? data : (data as any)?.testimonials ?? (data as any)?.data ?? []);
    } catch { /* silent */ }
  }, []);

  const addTestimonial = async (body: Record<string, any>) => {
    await testimonialsApi.adminCreate(body);
    await refreshTestimonials();
  };
  const updateTestimonial = async (id: string | number, body: Record<string, any>) => {
    await testimonialsApi.adminUpdate(id, body);
    await refreshTestimonials();
  };
  const deleteTestimonial = async (id: string | number) => {
    await testimonialsApi.adminDelete(id);
    await refreshTestimonials();
  };

  // ─── Blogs CRUD ───────────────────────────────────
  const refreshBlogs = useCallback(async () => {
    try {
      const token = getAdminToken();
      const data = token ? await blogsApi.adminGetAll() : await blogsApi.getAll();
      setBlogs(normalizeList(Array.isArray(data) ? data : (data as any)?.blogs ?? (data as any)?.data ?? []));
    } catch { /* silent */ }
  }, []);

  const addBlog = async (body: Record<string, any> | FormData) => {
    await blogsApi.adminCreate(body);
    await refreshBlogs();
  };
  const updateBlog = async (id: string | number, body: Record<string, any> | FormData) => {
    await blogsApi.adminUpdate(id, body);
    await refreshBlogs();
  };
  const deleteBlog = async (id: string | number) => {
    await blogsApi.adminDelete(id);
    await refreshBlogs();
  };

  return (
    <AdminContext.Provider
      value={{
        isAdmin, adminLoading, login, logout,
        poojas, idols, testimonials, blogs, dataLoading,
        refreshPoojas, addPooja, updatePooja, deletePooja,
        refreshIdols, addIdol, updateIdol, deleteIdol,
        refreshTestimonials, addTestimonial, updateTestimonial, deleteTestimonial,
        refreshBlogs, addBlog, updateBlog, deleteBlog,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
