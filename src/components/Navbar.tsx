import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Phone, Menu, X, ShoppingCart, User, LogOut } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import logoIcon from "@/assets/logo-ashirvachana.png";

const navLinks = [
  { label: "Poojas", href: "/poojas" },
  { label: "Idols", href: "/idols" },
  { label: "Testimonials", href: "/#testimonials" },
  { label: "Blog", href: "/blog" },
  { label: "How It Works", href: "/#how-it-works" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, isLoggedIn, logout } = useUser();
  const location = useLocation();

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    if (href.startsWith("/#")) {
      if (location.pathname !== "/") {
        window.location.href = href;
      } else {
        const el = document.querySelector(href.replace("/", ""));
        el?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border"
    >
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <motion.img
            src={logoIcon}
            alt="Ashirvachana"
            className="w-10 h-10 md:w-12 md:h-12 rounded-xl object-cover"
            whileHover={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 0.5 }}
          />
          <div className="flex flex-col">
            <span className="font-display font-bold text-lg md:text-xl leading-tight text-maroon">Ashirvachana</span>
            <span className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground font-body">Idols · Pujas · Online</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = link.href.startsWith("/#")
              ? location.pathname === "/" && location.hash === link.href.replace("/", "")
              : location.pathname.startsWith(link.href);

            return link.href.startsWith("/#") ? (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className={`font-body text-sm font-medium transition-colors relative group ${isActive ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"}`} />
              </button>
            ) : (
              <Link
                key={link.label}
                to={link.href}
                className={`font-body text-sm font-medium transition-colors relative group ${isActive ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"}`} />
              </Link>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-3">
          <a href="tel:+918500087012" className="flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-primary transition-colors">
            <Phone className="w-4 h-4" />
            +91 85000-87012
          </a>
          <Link to="/cart" className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
            <ShoppingCart className="w-5 h-5 text-muted-foreground" />
            {totalItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-gold text-primary-foreground text-xs font-body font-bold flex items-center justify-center"
              >
                {totalItems}
              </motion.span>
            )}
          </Link>
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <span className="font-body text-sm text-foreground font-medium">Hi, {user?.name.split(" ")[0]}</span>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-foreground font-body text-sm font-medium hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-body text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <User className="w-4 h-4" />
              Login
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-3 md:hidden">
          <Link to="/cart" className="relative p-2">
            <ShoppingCart className="w-5 h-5 text-foreground" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-gold text-primary-foreground text-xs font-bold flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          <button className="p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-border overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              {navLinks.map((link) => {
                const isActive = link.href.startsWith("/#")
                  ? location.pathname === "/" && location.hash === link.href.replace("/", "")
                  : location.pathname.startsWith(link.href);

                return link.href.startsWith("/#") ? (
                  <button
                    key={link.label}
                    onClick={() => handleNavClick(link.href)}
                    className={`font-body text-base py-2 transition-colors text-left ${isActive ? "text-primary font-semibold" : "text-foreground hover:text-primary"}`}
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    key={link.label}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`font-body text-base py-2 transition-colors ${isActive ? "text-primary font-semibold" : "text-foreground hover:text-primary"}`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <a href="tel:+918500087012" className="flex items-center gap-2 text-sm font-body text-primary py-2">
                <Phone className="w-4 h-4" />
                +91 85000-87012
              </a>
              {isLoggedIn ? (
                <button
                  onClick={() => { logout(); setIsOpen(false); }}
                  className="mt-2 w-full py-3 rounded-lg bg-secondary text-foreground font-body text-sm font-medium text-center"
                >
                  <LogOut className="w-4 h-4 inline mr-2" />
                  Logout ({user?.name.split(" ")[0]})
                </button>
              ) : (
                <Link to="/login" onClick={() => setIsOpen(false)} className="mt-2 w-full py-3 rounded-lg bg-primary text-primary-foreground font-body text-sm font-medium text-center block">
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
