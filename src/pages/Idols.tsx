import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ShoppingCart, Star, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { useAdmin } from "@/context/AdminContext";
import { idolsApi, locationsApi } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const deities = ["All", "Ganesha", "Lakshmi", "Shiva", "Krishna", "Hanuman", "Saraswati", "Durga", "Vishnu"];
const materials = ["All Materials", "Pure Brass", "Marble", "Panchaloha", "Wood", "Silver"];

const Idols = () => {
  const [selectedDeity, setSelectedDeity] = useState("All");
  const [selectedMaterial, setSelectedMaterial] = useState("All Materials");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocationId, setSelectedLocationId] = useState<string>("");
  const [locations, setLocations] = useState<{ id: number; name: string }[]>([]);
  const [locationIdols, setLocationIdols] = useState<any[] | null>(null);
  const { addToCart } = useCart();
  const { idols: contextIdols = [] } = useAdmin();

  const idols = selectedLocationId && locationIdols !== null ? locationIdols : contextIdols;

  useEffect(() => {
    locationsApi.getAll().then((res: any) => {
      const list = Array.isArray(res) ? res : res?.data ?? [];
      setLocations(list);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedLocationId) {
      setLocationIdols(null);
      return;
    }
    setLocationIdols([]);
    idolsApi.getAll({ location_id: selectedLocationId }).then((res: any) => {
      const list = Array.isArray(res) ? res : res?.data ?? [];
      setLocationIdols(list);
    }).catch(() => setLocationIdols([]));
  }, [selectedLocationId]);

  const getImage = (idol: any) => idol.image_url || idol.image || "";
  const getName = (idol: any) => idol.name || "";
  const getPrice = (idol: any) => idol.price || 0;
  const getOrigPrice = (idol: any) => idol.original_price || idol.originalPrice || idol.price || 1;
  const isInStock = (idol: any) => idol.in_stock ?? idol.inStock ?? true;

  const filtered = (idols ?? []).filter((idol: any) => {
    const matchDeity = selectedDeity === "All" || idol.deity === selectedDeity;
    const matchSearch = getName(idol).toLowerCase().includes(searchQuery.toLowerCase());
    const matchMaterial = selectedMaterial === "All Materials" || idol.material === selectedMaterial;
    return matchDeity && matchSearch && matchMaterial;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <section className="pt-24 pb-12 bg-gradient-hero relative overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div key={i} className="absolute w-2 h-2 rounded-full bg-gold/20" style={{ left: `${15 + i * 18}%`, top: `${30 + (i % 3) * 20}%` }} animate={{ y: [0, -25, 0], opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.4 }} />
        ))}
        <div className="container mx-auto px-4 text-center relative z-10 py-12">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="font-display text-4xl md:text-6xl font-bold text-cream mb-4">
            Sacred <span className="text-gold">Idols & Murtis</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="font-body text-cream/70 text-lg max-w-xl mx-auto">
            Handcrafted brass idols blessed by priests, delivered to your doorstep
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col gap-4 mb-10">
          <div className="flex flex-col md:flex-row gap-4 flex-wrap">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input placeholder="Search idols..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-11 h-12 bg-secondary/50 font-body" />
            </div>
            <select value={selectedLocationId} onChange={(e) => setSelectedLocationId(e.target.value)} className="h-12 px-4 rounded-md border border-input bg-secondary/50 font-body text-sm text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring max-w-xs">
              <option value="">All Locations</option>
              {locations.map((loc) => (
                <option key={loc.id} value={String(loc.id)}>{loc.name}</option>
              ))}
            </select>
            <select value={selectedMaterial} onChange={(e) => setSelectedMaterial(e.target.value)} className="h-12 px-4 rounded-md border border-input bg-secondary/50 font-body text-sm text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring max-w-xs">
              {materials.map((mat) => (<option key={mat} value={mat}>{mat}</option>))}
            </select>
          </div>
          <div className="flex gap-2 flex-wrap">
            {deities.map((deity) => (
              <motion.button key={deity} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setSelectedDeity(deity)} className={`px-4 py-2 rounded-full font-body text-sm transition-all ${selectedDeity === deity ? "bg-gradient-gold text-primary-foreground shadow-warm" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}>
                {deity}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((idol: any, i: number) => (
              <motion.div key={String(idol.id)} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.4, delay: i * 0.05 }} className="group">
                <div className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-shadow duration-500">
                  <Link to={`/idols/${idol.id}`} className="block relative overflow-hidden">
                    <motion.img src={getImage(idol)} alt={getName(idol)} className="w-full aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-temple-brown/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    {!isInStock(idol) && (
                      <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-destructive text-destructive-foreground text-xs font-body font-medium">Out of Stock</div>
                    )}
                    {isInStock(idol) && getOrigPrice(idol) > getPrice(idol) && (
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-gradient-gold text-primary-foreground text-xs font-body font-medium">
                        {Math.round((1 - getPrice(idol) / getOrigPrice(idol)) * 100)}% OFF
                      </div>
                    )}
                  </Link>
                  <div className="p-5">
                    <Link to={`/idols/${idol.id}`}>
                      <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">{getName(idol)}</h3>
                    </Link>
                    <p className="font-body text-sm text-muted-foreground mt-1">{idol.material} · {idol.height}</p>
                    {idol.rating && (
                      <div className="flex items-center gap-1 mt-2">
                        <Star className="w-4 h-4 fill-gold text-gold" />
                        <span className="font-body text-sm text-foreground font-medium">{idol.rating}</span>
                        {idol.reviews && <span className="font-body text-xs text-muted-foreground">({idol.reviews})</span>}
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-baseline gap-2">
                        <span className="font-display text-xl font-bold text-foreground">₹{getPrice(idol).toLocaleString()}</span>
                        {getOrigPrice(idol) > getPrice(idol) && <span className="font-body text-sm text-muted-foreground line-through">₹{getOrigPrice(idol).toLocaleString()}</span>}
                      </div>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                          size="icon"
                          disabled={!isInStock(idol)}
                          onClick={() => addToCart({ item_type: "idol", item_id: idol.id })}
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
