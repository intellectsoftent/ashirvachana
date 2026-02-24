import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, Star, ArrowLeft, Shield, Truck, RotateCcw, Check, Heart, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/context/AdminContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Ruler, HeartHandshake } from "lucide-react";

const IdolDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { isLoggedIn } = useUser();
  const { idols } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [addedToCart, setAddedToCart] = useState(false);
  const [liked, setLiked] = useState(false);

  const idol = idols.find((item: any) => String(item.id) === id);
  if (!idol) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-3xl text-foreground">Idol not found</h1>
          <Link to="/idols" className="font-body text-primary hover:underline mt-4 block">Back to Idols</Link>
        </div>
      </div>
    );
  }

  const image = idol.image_url || idol.image || "";
  const price = idol.price || 0;
  const origPrice = idol.original_price || idol.originalPrice || price;
  const discount = origPrice > price ? Math.round((1 - price / origPrice) * 100) : 0;
  const inStock = idol.in_stock ?? idol.inStock ?? true;

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      toast({ title: "Please login first", description: "You need to login to add items to cart.", variant: "destructive" });
      navigate("/login");
      return;
    }
    try {
      await addToCart({ item_type: "idol", item_id: idol.id });
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 container mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Link to="/idols" className="inline-flex items-center gap-2 font-body text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Idols
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="relative rounded-3xl overflow-hidden bg-card shadow-elevated group lg:sticky lg:top-28">
            <motion.img src={image} alt={idol.name} className="w-full aspect-[3/4] object-cover transition-transform duration-700 group-hover:scale-105" />
            {discount > 0 && <div className="absolute top-4 left-4 px-4 py-2 rounded-full bg-gradient-gold text-primary-foreground font-body text-sm font-semibold">{discount}% OFF</div>}
            <motion.button whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} onClick={() => setLiked(!liked)} className="absolute top-4 right-4 w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center shadow-card">
              <Heart className={`w-6 h-6 transition-colors ${liked ? "fill-destructive text-destructive" : "text-muted-foreground"}`} />
            </motion.button>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="flex flex-col justify-center">
            <span className="font-body text-sm uppercase tracking-[0.2em] text-primary font-medium">{idol.material}</span>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">{idol.name}</h1>

            {idol.rating && (
              <div className="flex items-center gap-3 mt-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < Math.floor(idol.rating) ? "fill-gold text-gold" : "text-border"}`} />
                  ))}
                </div>
                <span className="font-body text-sm text-foreground font-medium">{idol.rating}</span>
                {idol.reviews && <span className="font-body text-sm text-muted-foreground">({idol.reviews} reviews)</span>}
              </div>
            )}

            <div className="flex items-baseline gap-3 mt-6">
              <span className="font-display text-4xl font-bold text-foreground">₹{price.toLocaleString()}</span>
              {origPrice > price && (
                <>
                  <span className="font-body text-xl text-muted-foreground line-through">₹{origPrice.toLocaleString()}</span>
                  <span className="font-body text-sm font-semibold text-primary">Save ₹{(origPrice - price).toLocaleString()}</span>
                </>
              )}
            </div>

            <p className="font-body text-muted-foreground mt-6 leading-relaxed">{idol.description}</p>

            <div className="mt-6 space-y-2">
              <span className="font-body text-sm font-medium text-foreground">Specifications:</span>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Height", value: idol.height },
                  { label: "Weight", value: idol.weight },
                  { label: "Material", value: idol.material },
                  { label: "Deity", value: idol.deity },
                ].filter(s => s.value).map((spec) => (
                  <div key={spec.label} className="bg-secondary/50 rounded-lg px-4 py-3">
                    <span className="font-body text-xs text-muted-foreground">{spec.label}</span>
                    <p className="font-body text-sm font-medium text-foreground">{spec.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {(() => {
              const features = Array.isArray(idol.features) ? idol.features : typeof idol.features === "string" ? idol.features.split(",").map((s: string) => s.trim()).filter(Boolean) : [];
              return features.length > 0 ? (
                <div className="mt-6">
                  <span className="font-body text-sm font-medium text-foreground">Features:</span>
                  <ul className="mt-2 space-y-2">
                    {features.map((f: string) => (
                      <li key={f} className="flex items-center gap-2 font-body text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-primary" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null;
            })()}

            <div className="flex gap-4 mt-8">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                <Button onClick={handleAddToCart} disabled={!inStock} className="w-full h-14 bg-gradient-gold text-primary-foreground font-body font-semibold text-base hover:opacity-90 glow-saffron rounded-xl">
                  {addedToCart ? (<><Check className="w-5 h-5 mr-2" /> Added to Cart</>) : !isLoggedIn ? (<><LogIn className="w-5 h-5 mr-2" /> Login to Buy</>) : (<><ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart</>)}
                </Button>
              </motion.div>
              <Link to="/cart">
                <Button variant="outline" className="h-14 px-6 rounded-xl font-body">View Cart</Button>
              </Link>
            </div>

            <div className="mt-8 pt-8 border-t border-border">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="shipping" className="border-b border-border">
                  <AccordionTrigger className="py-4 font-body text-base font-medium text-foreground hover:no-underline">
                    <span className="flex items-center gap-3"><Truck className="w-5 h-5 text-muted-foreground" /> Shipping & Returns</span>
                  </AccordionTrigger>
                  <AccordionContent className="font-body text-sm text-muted-foreground leading-relaxed pb-4 space-y-2">
                    <p>Free shipping for all prepaid orders across India.</p>
                    <p>7-day return policy for damaged or defective items.</p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="dimensions" className="border-b border-border">
                  <AccordionTrigger className="py-4 font-body text-base font-medium text-foreground hover:no-underline">
                    <span className="flex items-center gap-3"><Ruler className="w-5 h-5 text-muted-foreground" /> Dimensions</span>
                  </AccordionTrigger>
                  <AccordionContent className="font-body text-sm text-muted-foreground leading-relaxed pb-4">
                    <p>Height: {idol.height}</p>
                    <p>Weight: {idol.weight}</p>
                    <p>Material: {idol.material}</p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="care" className="border-b-0">
                  <AccordionTrigger className="py-4 font-body text-base font-medium text-foreground hover:no-underline">
                    <span className="flex items-center gap-3"><HeartHandshake className="w-5 h-5 text-muted-foreground" /> Care Instructions</span>
                  </AccordionTrigger>
                  <AccordionContent className="font-body text-sm text-muted-foreground leading-relaxed pb-4 space-y-2">
                    <p>Wipe gently with a soft, dry cloth to maintain shine.</p>
                    <p>Avoid using chemical cleaners or abrasive materials.</p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default IdolDetail;
