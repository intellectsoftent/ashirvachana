import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Star, Search, Clock, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAdmin } from "@/context/AdminContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const categories = ["All", "Protection", "Shanti", "Graha", "Home", "Festival", "Prosperity"];

const Poojas = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { poojas = [] } = useAdmin();

  const getImage = (p: any) => p.image_url || p.image || "";
  const getTitle = (p: any) => p.title || "";
  const getPrice = (p: any) => p.price || 0;
  const getOrigPrice = (p: any) => p.original_price || p.originalPrice || p.price || 1;

  const filtered = (poojas ?? []).filter((p: any) => {
    const matchCat = selectedCategory === "All" || p.category === selectedCategory;
    const matchSearch = getTitle(p).toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-24 pb-12 bg-gradient-hero relative overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div key={i} className="absolute w-2 h-2 rounded-full bg-gold/20" style={{ left: `${10 + i * 15}%`, top: `${25 + (i % 3) * 22}%` }} animate={{ y: [0, -30, 0], opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 3 + i * 0.4, repeat: Infinity, delay: i * 0.3 }} />
        ))}
        <div className="container mx-auto px-4 text-center relative z-10 py-12">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="font-display text-4xl md:text-6xl font-bold text-cream mb-4">
            Sacred <span className="text-gold">Poojas & Homams</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="font-body text-cream/70 text-lg max-w-xl mx-auto">
            Book authentic Vedic rituals performed by experienced priests at your doorstep
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col gap-4 mb-10">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input placeholder="Search poojas..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-11 h-12 bg-secondary/50 font-body" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <motion.button key={cat} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 rounded-full font-body text-sm transition-all ${selectedCategory === cat ? "bg-gradient-gold text-primary-foreground shadow-warm" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}>
                {cat}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((pooja: any, i: number) => {
              const price = getPrice(pooja);
              const origPrice = getOrigPrice(pooja);
              return (
                <motion.div key={String(pooja.id)} layout initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.4, delay: i * 0.06 }} className="group">
                  <Link to={`/poojas/${pooja.id}`}>
                    <div className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-500 border border-border hover:border-primary/30">
                      <div className="relative overflow-hidden h-56">
                        <motion.img src={getImage(pooja)} alt={getTitle(pooja)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute top-3 left-3">
                          <span className="px-3 py-1 rounded-full bg-background/90 backdrop-blur-sm text-xs font-body font-medium text-foreground">{pooja.category}</span>
                        </div>
                        {origPrice > price && (
                          <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-gradient-gold text-primary-foreground text-xs font-body font-semibold">
                            {Math.round((1 - price / origPrice) * 100)}% OFF
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{getTitle(pooja)}</h3>
                        <div className="flex items-center gap-3 mt-2">
                          {pooja.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-gold text-gold" />
                              <span className="font-body text-sm text-foreground font-medium">{pooja.rating}</span>
                              {pooja.reviews && <span className="font-body text-xs text-muted-foreground">({pooja.reviews})</span>}
                            </div>
                          )}
                          {pooja.duration && (
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="w-3.5 h-3.5" />
                              <span className="font-body text-xs">{pooja.duration}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <div>
                            <span className="font-body text-xs text-muted-foreground">Starting From</span>
                            <div className="flex items-baseline gap-2">
                              <span className="font-display text-xl font-bold text-foreground">₹{price.toLocaleString()}</span>
                              {origPrice > price && <span className="font-body text-sm text-muted-foreground line-through">₹{origPrice.toLocaleString()}</span>}
                            </div>
                          </div>
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-3 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                            <ArrowRight className="w-5 h-5" />
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <p className="font-display text-2xl text-muted-foreground">No poojas found</p>
            <p className="font-body text-muted-foreground mt-2">Try adjusting your search or filter</p>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Poojas;
