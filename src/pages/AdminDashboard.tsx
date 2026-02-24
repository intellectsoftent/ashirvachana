import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { LayoutDashboard, BookOpen, Gem, MessageSquare, FileText, LogOut, Home, ChevronLeft, ChevronRight, ShoppingBag, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/context/AdminContext";
import { useOrders } from "@/context/OrderContext";
import AdminPoojas from "@/components/admin/AdminPoojas";
import AdminIdols from "@/components/admin/AdminIdols";
import AdminTestimonials from "@/components/admin/AdminTestimonials";
import AdminBlogs from "@/components/admin/AdminBlogs";
import AdminOrders from "@/components/admin/AdminOrders";
import AdminLocations from "@/components/admin/AdminLocations";
import AdminPujari from "@/components/admin/AdminPujari";
import logoIcon from "@/assets/logo-ashirvachana.png";

const sidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "orders", label: "Booked Orders", icon: ShoppingBag },
  { id: "poojas", label: "Poojas", icon: BookOpen },
  { id: "idols", label: "Idols", icon: Gem },
  { id: "blogs", label: "Blog Posts", icon: FileText },
  { id: "testimonials", label: "Testimonials", icon: MessageSquare },
  { id: "locations", label: "Locations", icon: MapPin },
  { id: "pujari", label: "Pujari Master", icon: User },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { isAdmin, logout, poojas, idols, testimonials, blogs } = useAdmin();
  const { orders } = useOrders();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate("/admin");
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) return null;

  const pendingBalance = orders.filter(o => (o.balanceDue ?? 0) > 0 && o.status !== "cancelled").length;

  const stats = [
    { label: "Booked Orders", value: orders.length, icon: ShoppingBag, color: "bg-primary/10 text-primary", tab: "orders" },
    { label: "Pending Balance", value: pendingBalance, icon: ShoppingBag, color: "bg-destructive/10 text-destructive", tab: "orders" },
    { label: "Total Poojas", value: poojas.length, icon: BookOpen, color: "bg-gold/10 text-gold", tab: "poojas" },
    { label: "Total Idols", value: idols.length, icon: Gem, color: "bg-saffron/10 text-saffron", tab: "idols" },
    { label: "Blog Posts", value: blogs.length, icon: FileText, color: "bg-accent/10 text-accent", tab: "blogs" },
    { label: "Testimonials", value: testimonials.length, icon: MessageSquare, color: "bg-primary/10 text-primary", tab: "testimonials" },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 260 : 72 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed left-0 top-0 bottom-0 z-50 bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border overflow-hidden"
      >
        {/* Logo Area */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border flex-shrink-0">
          <img src={logoIcon} alt="Ashirvachana Admin" className="w-9 h-9 rounded-xl object-cover flex-shrink-0" />
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden whitespace-nowrap"
              >
                <span className="font-display font-bold text-sidebar-foreground text-sm">Ashirvachana</span>
                <span className="font-body text-[10px] text-sidebar-foreground/60 block">Admin Panel</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <motion.button
                key={item.id}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-body text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="px-2 pb-4 space-y-1 border-t border-sidebar-border pt-4">
          <Link to="/">
            <motion.div
              whileHover={{ x: 2 }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground font-body text-sm transition-all"
            >
              <Home className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span>View Site</span>}
            </motion.div>
          </Link>
          <motion.button
            whileHover={{ x: 2 }}
            onClick={() => { logout(); navigate("/admin"); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-destructive hover:bg-destructive/10 font-body text-sm transition-all"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </motion.button>
        </div>

      </motion.aside>

      {/* Main Content */}
      <motion.main
        animate={{ marginLeft: sidebarOpen ? 260 : 72 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex-1 min-h-screen"
      >
        {/* Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border px-6 md:px-8 h-16 flex items-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-9 h-9 rounded-xl bg-secondary hover:bg-primary/10 text-foreground hover:text-primary flex items-center justify-center transition-colors"
          >
            {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </motion.button>
          <h1 className="font-display text-lg font-bold text-foreground capitalize">
            {activeTab === "dashboard" ? "Dashboard Overview" : activeTab === "orders" ? "Booked Orders" : activeTab === "pujari" ? "Pujari Master" : activeTab === "locations" ? "Location Master" : `Manage ${activeTab}`}
          </h1>
        </motion.header>

        <div className="p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "dashboard" && (
                <div>
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5 mb-10">
                    {stats.map((s, i) => (
                      <motion.div
                        key={s.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ y: -4, scale: 1.02 }}
                        className="bg-card rounded-2xl p-6 shadow-card border border-border hover:border-primary/20 transition-all cursor-pointer"
                        onClick={() => setActiveTab(s.tab)}
                      >
                        <div className={`w-11 h-11 rounded-xl ${s.color} flex items-center justify-center mb-3`}>
                          <s.icon className="w-5 h-5" />
                        </div>
                        <p className="font-body text-sm text-muted-foreground">{s.label}</p>
                        <p className="font-display text-3xl font-bold text-foreground mt-1">{s.value}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Quick Actions */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-card rounded-2xl p-6 shadow-card border border-border"
                  >
                    <h3 className="font-display text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {sidebarItems.slice(1).map((item) => (
                        <motion.button
                          key={item.id}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setActiveTab(item.id)}
                          className="flex flex-col items-center gap-2 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                        >
                          <item.icon className="w-6 h-6 text-primary" />
                          <span className="font-body text-xs font-medium text-foreground">Manage {item.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                </div>
              )}
              {activeTab === "orders" && <AdminOrders />}
              {activeTab === "poojas" && <AdminPoojas />}
              {activeTab === "idols" && <AdminIdols />}
              {activeTab === "blogs" && <AdminBlogs />}
              {activeTab === "testimonials" && <AdminTestimonials />}
              {activeTab === "locations" && <AdminLocations />}
              {activeTab === "pujari" && <AdminPujari />}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.main>
    </div>
  );
};

export default AdminDashboard;
