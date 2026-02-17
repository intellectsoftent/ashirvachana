import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Pooja, poojasData, poojaIdImageMap } from "@/data/poojas";
import { Idol, idolsData } from "@/data/idols";
import { Testimonial, testimonialsData } from "@/data/testimonials";
import { Blog, blogsData } from "@/data/blogs";
import { idolImageMap } from "@/utils/idolImages";

// Blog image map for re-mapping
import blogGaneshPuja from "@/assets/blog-ganesh-puja.jpg";
import blogVastuHome from "@/assets/blog-vastu-home.jpg";
import blogNavagraha from "@/assets/blog-navagraha.jpg";
import blogChoosingIdol from "@/assets/blog-choosing-idol.jpg";

const blogImageMap: Record<string, string> = {
  "importance-of-ganesh-puja": blogGaneshPuja,
  "vastu-tips-home": blogVastuHome,
  "navagraha-puja-benefits": blogNavagraha,
  "choosing-right-idol": blogChoosingIdol,
};

interface AdminContextType {
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  poojas: Pooja[];
  idols: (Idol & { image: string })[];
  testimonials: Testimonial[];
  blogs: Blog[];
  addPooja: (pooja: Pooja) => void;
  updatePooja: (id: string, pooja: Partial<Pooja>) => void;
  deletePooja: (id: string) => void;
  addIdol: (idol: Idol & { image: string }) => void;
  updateIdol: (id: string, idol: Partial<Idol>) => void;
  deleteIdol: (id: string) => void;
  addTestimonial: (t: Testimonial) => void;
  updateTestimonial: (id: string, t: Partial<Testimonial>) => void;
  deleteTestimonial: (id: string) => void;
  addBlog: (b: Blog) => void;
  updateBlog: (id: string, b: Partial<Blog>) => void;
  deleteBlog: (id: string) => void;
}

const AdminContext = createContext<AdminContextType>({} as AdminContextType);

const ADMIN_PASSWORD = "divine@admin2026";

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem("admin_auth") === "true");

  // Initialize data from localStorage or defaults, always re-map images to current build URLs
  const [poojas, setPoojas] = useState<Pooja[]>(() => {
    const stored = localStorage.getItem("admin_poojas");
    if (stored) {
      const parsed: Pooja[] = JSON.parse(stored);
      return parsed.map((p) => ({ ...p, image: poojaIdImageMap[p.id] || p.image }));
    }
    return poojasData;
  });

  const [idols, setIdols] = useState<(Idol & { image: string })[]>(() => {
    const stored = localStorage.getItem("admin_idols");
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((i: Idol & { image: string }) => ({ ...i, image: idolImageMap[i.id] || i.image }));
    }
    return idolsData.map((idol) => ({ ...idol, image: idolImageMap[idol.id] || "" }));
  });

  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    const stored = localStorage.getItem("admin_testimonials");
    return stored ? JSON.parse(stored) : testimonialsData;
  });

  const [blogs, setBlogs] = useState<Blog[]>(() => {
    const stored = localStorage.getItem("admin_blogs");
    if (stored) {
      const parsed: Blog[] = JSON.parse(stored);
      return parsed.map((b) => ({ ...b, image: blogImageMap[b.id] || b.image }));
    }
    return blogsData;
  });

  // Persist to localStorage
  useEffect(() => { localStorage.setItem("admin_poojas", JSON.stringify(poojas)); }, [poojas]);
  useEffect(() => { localStorage.setItem("admin_idols", JSON.stringify(idols)); }, [idols]);
  useEffect(() => { localStorage.setItem("admin_testimonials", JSON.stringify(testimonials)); }, [testimonials]);
  useEffect(() => { localStorage.setItem("admin_blogs", JSON.stringify(blogs)); }, [blogs]);

  const login = (password: string) => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      localStorage.setItem("admin_auth", "true");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem("admin_auth");
  };

  const addPooja = (pooja: Pooja) => setPoojas((prev) => [...prev, pooja]);
  const updatePooja = (id: string, data: Partial<Pooja>) =>
    setPoojas((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)));
  const deletePooja = (id: string) => setPoojas((prev) => prev.filter((p) => p.id !== id));

  const addIdol = (idol: Idol & { image: string }) => setIdols((prev) => [...prev, idol]);
  const updateIdol = (id: string, data: Partial<Idol>) =>
    setIdols((prev) => prev.map((i) => (i.id === id ? { ...i, ...data } : i)));
  const deleteIdol = (id: string) => setIdols((prev) => prev.filter((i) => i.id !== id));

  const addTestimonial = (t: Testimonial) => setTestimonials((prev) => [...prev, t]);
  const updateTestimonial = (id: string, data: Partial<Testimonial>) =>
    setTestimonials((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t)));
  const deleteTestimonial = (id: string) => setTestimonials((prev) => prev.filter((t) => t.id !== id));

  const addBlog = (b: Blog) => setBlogs((prev) => [...prev, b]);
  const updateBlog = (id: string, data: Partial<Blog>) =>
    setBlogs((prev) => prev.map((b) => (b.id === id ? { ...b, ...data } : b)));
  const deleteBlog = (id: string) => setBlogs((prev) => prev.filter((b) => b.id !== id));

  return (
    <AdminContext.Provider
      value={{
        isAdmin, login, logout,
        poojas, idols, testimonials, blogs,
        addPooja, updatePooja, deletePooja,
        addIdol, updateIdol, deleteIdol,
        addTestimonial, updateTestimonial, deleteTestimonial,
        addBlog, updateBlog, deleteBlog,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
