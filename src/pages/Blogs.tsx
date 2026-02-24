import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Search, Calendar, Clock, ArrowRight, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAdmin } from "@/context/AdminContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const categories = ["All", "Rituals", "Vastu", "Astrology", "Guides", "Festivals"];

const Blogs = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { blogs = [] } = useAdmin();

  const filtered = (blogs ?? []).filter((b: any) => {
    const matchCat = selectedCategory === "All" || b.category === selectedCategory;
    const matchSearch = (b.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.excerpt || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-24 pb-12 bg-gradient-hero relative overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-gold/20"
            style={{ left: `${10 + i * 15}%`, top: `${25 + (i % 3) * 22}%` }}
            animate={{ y: [0, -30, 0], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 3 + i * 0.4, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
        <div className="container mx-auto px-4 text-center relative z-10 py-12">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-6xl font-bold text-cream mb-4"
          >
            Divine <span className="text-gold">Blog</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-body text-cream/70 text-lg max-w-xl mx-auto"
          >
            Insights on rituals, spirituality, Vastu, and sacred traditions
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col md:flex-row gap-4 mb-10"
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 h-12 bg-secondary/50 font-body"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full font-body text-sm transition-all ${
                  selectedCategory === cat
                    ? "bg-gradient-gold text-primary-foreground shadow-warm"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filtered.map((blog, i) => (
              <motion.div
                key={String(blog.id)}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group"
              >
                <Link to={`/blog/${blog.id}`}>
                  <div className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-500 border border-border hover:border-primary/30 h-full flex flex-col">
                    <div className="relative overflow-hidden h-52">
                      <motion.img
                        src={blog.image_url || blog.image || ""}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 rounded-full bg-background/90 backdrop-blur-sm text-xs font-body font-medium text-foreground">
                          {blog.category}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-temple-brown/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-3 text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span className="font-body text-xs">{new Date(blog.date || blog.created_at || "").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="font-body text-xs">{blog.read_time || blog.readTime}</span>
                        </div>
                      </div>
                      <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors leading-snug mb-2">
                        {blog.title}
                      </h3>
                      <p className="font-body text-sm text-muted-foreground line-clamp-3 flex-1">
                        {blog.excerpt}
                      </p>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-gold flex items-center justify-center">
                            <User className="w-3.5 h-3.5 text-primary-foreground" />
                          </div>
                          <span className="font-body text-xs text-foreground font-medium">{blog.author}</span>
                        </div>
                        <motion.div
                          whileHover={{ x: 4 }}
                          className="text-primary"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <p className="font-display text-2xl text-muted-foreground">No articles found</p>
            <p className="font-body text-muted-foreground mt-2">Try adjusting your search or filter</p>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Blogs;
