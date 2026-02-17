import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ShoppingCart, Star, Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { useAdmin } from "@/context/AdminContext";
import { locations } from "@/data/locations";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const deities = ["All", "Ganesha", "Lakshmi", "Shiva", "Krishna", "Hanuman", "Saraswati", "Durga", "Vishnu"];
const materials = ["All Materials", "Pure Brass", "Marble", "Panchaloha", "Wood", "Silver"];

const Idols = () => {
  const [selectedDeity, setSelectedDeity] = useState("All");
  const [selectedMaterial, setSelectedMaterial] = useState("All Materials");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [searchQuery, setSearchQuery] = useState("");
  const { addToCart } = useCart();
  const { idols = [] } = useAdmin();

  const filtered = (idols ?? []).filter((idol) => {
    const matchDeity = selectedDeity === "All" || idol.deity === selectedDeity;
    const matchSearch = idol.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchMaterial = selectedMaterial === "All Materials" || idol.material === selectedMaterial;
    const matchLocation = selectedLocation === "All Locations" || true; // idols available everywhere
    return matchDeity && matchSearch && matchMaterial && matchLocation;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Banner */}
      <section className="pt-24 pb-12 bg-gradient-hero relative overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-gold/20"
            style={{ left: `${15 + i * 18}%`, top: `${30 + (i % 3) * 20}%` }}
            animate={{ y: [0, -25, 0], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
          />
        ))}
        <div className="container mx-auto px-4 text-center relative z-10 py-12">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-6xl font-bold text-cream mb-4"
          >
            Sacred <span className="text-gold">Idols & Murtis</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-body text-cream/70 text-lg max-w-xl mx-auto"
          >
            Handcrafted brass idols blessed by priests, delivered to your doorstep
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col gap-4 mb-10"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search idols..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 h-12 bg-secondary/50 font-body"
              />
            </div>
            <div className="relative max-w-xs">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full h-12 pl-11 pr-4 rounded-md border border-input bg-secondary/50 font-body text-sm text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
            <select
              value={selectedMaterial}
              onChange={(e) => setSelectedMaterial(e.target.value)}
              className="h-12 px-4 rounded-md border border-input bg-secondary/50 font-body text-sm text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring max-w-xs"
            >
              {materials.map((mat) => (
                <option key={mat} value={mat}>{mat}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 flex-wrap">
            {deities.map((deity) => (
              <motion.button
                key={deity}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedDeity(deity)}
                className={`px-4 py-2 rounded-full font-body text-sm transition-all ${
                  selectedDeity === deity
                    ? "bg-gradient-gold text-primary-foreground shadow-warm"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {deity}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((idol, i) => (
              <motion.div
                key={idol.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group"
              >
                <div className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-shadow duration-500">
                  <Link to={`/idols/${idol.id}`} className="block relative overflow-hidden">
                    <motion.img
                      src={idol.image}
                      alt={idol.name}
                      className="w-full aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-temple-brown/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    {!idol.inStock && (
                      <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-destructive text-destructive-foreground text-xs font-body font-medium">
                        Out of Stock
                      </div>
                    )}
                    {idol.inStock && (
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-gradient-gold text-primary-foreground text-xs font-body font-medium">
                        {Math.round((1 - idol.price / idol.originalPrice) * 100)}% OFF
                      </div>
                    )}
                  </Link>
                  <div className="p-5">
                    <Link to={`/idols/${idol.id}`}>
                      <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {idol.name}
                      </h3>
                    </Link>
                    <p className="font-body text-sm text-muted-foreground mt-1">{idol.material} · {idol.height}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <Star className="w-4 h-4 fill-gold text-gold" />
                      <span className="font-body text-sm text-foreground font-medium">{idol.rating}</span>
                      <span className="font-body text-xs text-muted-foreground">({idol.reviews})</span>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-baseline gap-2">
                        <span className="font-display text-xl font-bold text-foreground">₹{idol.price.toLocaleString()}</span>
                        <span className="font-body text-sm text-muted-foreground line-through">₹{idol.originalPrice.toLocaleString()}</span>
                      </div>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                          size="icon"
                          disabled={!idol.inStock}
                          onClick={() => addToCart({ id: idol.id, name: idol.name, price: idol.price, image: idol.image })}
                          className="rounded-full bg-gradient-gold text-primary-foreground hover:opacity-90 h-10 w-10"
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <p className="font-display text-2xl text-muted-foreground">No idols found</p>
            <p className="font-body text-muted-foreground mt-2">Try adjusting your search or filter</p>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Idols;
