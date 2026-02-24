import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, ArrowLeft, Clock, Check, Phone, Shield, Calendar, LogIn, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/context/AdminContext";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PoojaDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { poojas } = useAdmin();
  const { isLoggedIn } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();

  const pooja = poojas.find((p: any) => String(p.id) === id);
  if (!pooja) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-3xl text-foreground">Pooja not found</h1>
          <Link to="/poojas" className="font-body text-primary hover:underline mt-4 block">Back to Poojas</Link>
        </div>
      </div>
    );
  }

  const image = pooja.image_url || pooja.image || "";
  const price = pooja.price || 0;
  const origPrice = pooja.original_price || pooja.originalPrice || price;
  const discount = origPrice > price ? Math.round((1 - price / origPrice) * 100) : 0;
  const advancePercent = pooja.advance_percent || 30;

  const highlights = [
    { icon: Clock, label: "Duration", value: pooja.duration },
    { icon: Calendar, label: "Category", value: pooja.category },
  ];

  // Pujari info from API response (if included)
  const pujari = pooja.pujari || pooja.priest || null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 container mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Link to="/poojas" className="inline-flex items-center gap-2 font-body text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Poojas
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="relative rounded-3xl overflow-hidden bg-card shadow-elevated group lg:sticky lg:top-28">
            <img src={image} alt={pooja.title} className="w-full aspect-[3/4] object-cover transition-transform duration-700 group-hover:scale-105" />
            {discount > 0 && <div className="absolute top-4 left-4 px-4 py-2 rounded-full bg-gradient-gold text-primary-foreground font-body text-sm font-semibold">{discount}% OFF</div>}
            <div className="absolute top-4 right-4 px-4 py-2 rounded-full bg-background/90 backdrop-blur-sm font-body text-sm font-medium text-foreground">{pooja.category}</div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="flex flex-col justify-center">
            <span className="font-body text-sm uppercase tracking-[0.2em] text-primary font-medium">🙏 {pooja.category} Pooja</span>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">{pooja.title}</h1>

            {pooja.rating && (
              <div className="flex items-center gap-3 mt-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < Math.floor(pooja.rating) ? "fill-gold text-gold" : "text-border"}`} />
                  ))}
                </div>
                <span className="font-body text-sm text-foreground font-medium">{pooja.rating}</span>
                {pooja.reviews && <span className="font-body text-sm text-muted-foreground">({pooja.reviews} reviews)</span>}
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

            <p className="font-body text-muted-foreground mt-6 leading-relaxed">{pooja.description}</p>

            <div className="grid grid-cols-2 gap-3 mt-6">
              {highlights.filter(h => h.value).map((h) => (
                <motion.div key={h.label} whileHover={{ scale: 1.02 }} className="bg-secondary/50 rounded-xl px-4 py-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <h.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-body text-xs text-muted-foreground">{h.label}</span>
                    <p className="font-body text-sm font-medium text-foreground">{h.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pujari info */}
            {pujari && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 bg-card border border-primary/20 rounded-2xl p-5">
                <span className="font-body text-xs uppercase tracking-[0.15em] text-primary font-medium">Your Pujari</span>
                <div className="flex items-center gap-4 mt-3">
                  <div className="w-14 h-14 rounded-xl bg-gradient-gold flex items-center justify-center flex-shrink-0">
                    <User className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-display text-base font-semibold text-foreground">{pujari.full_name || pujari.name}</h4>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      {pujari.experience && <span className="font-body text-xs text-muted-foreground">{pujari.experience}</span>}
                      {pujari.rating && <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-gold text-gold" /><span className="font-body text-xs font-medium">{pujari.rating}</span></span>}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Benefits */}
            {(() => {
              const benefits = Array.isArray(pooja.benefits) ? pooja.benefits : typeof pooja.benefits === "string" ? pooja.benefits.split(",").map((s: string) => s.trim()).filter(Boolean) : [];
              return benefits.length > 0 ? (
                <div className="mt-6">
                  <span className="font-body text-sm font-medium text-foreground">Benefits:</span>
                  <ul className="mt-2 space-y-2">
                    {benefits.map((b: string) => (
                      <motion.li key={b} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 font-body text-sm text-muted-foreground">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0"><Check className="w-3 h-3 text-primary" /></div>
                        {b}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              ) : null;
            })()}

            {/* Includes */}
            {(() => {
              const includes = Array.isArray(pooja.includes) ? pooja.includes : typeof pooja.includes === "string" ? pooja.includes.split(",").map((s: string) => s.trim()).filter(Boolean) : [];
              return includes.length > 0 ? (
                <div className="mt-6">
                  <span className="font-body text-sm font-medium text-foreground">What's Included:</span>
                  <ul className="mt-2 space-y-2">
                    {includes.map((inc: string) => (
                      <li key={inc} className="flex items-center gap-2 font-body text-sm text-muted-foreground">
                        <Shield className="w-4 h-4 text-gold" /> {inc}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null;
            })()}

            {/* Payment Info */}
            <div className="mt-6 bg-primary/5 border border-primary/20 rounded-xl p-4">
              <p className="font-body text-sm font-medium text-foreground mb-1">💡 Partial Payment Available</p>
              <p className="font-body text-xs text-muted-foreground">
                Pay just <span className="font-semibold text-primary">₹{Math.round(price * advancePercent / 100).toLocaleString()} ({advancePercent}% advance)</span> to confirm your booking.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex gap-4 mt-8">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                <Button
                  onClick={() => {
                    if (!isLoggedIn) {
                      toast({ title: "Please login first", description: "You need to login to book a pooja.", variant: "destructive" });
                      navigate("/login");
                      return;
                    }
                    toast({ title: "Booking initiated! 🙏", description: "Our team will contact you shortly to confirm." });
                  }}
                  className="w-full h-14 bg-gradient-gold text-primary-foreground font-body font-semibold text-base hover:opacity-90 glow-saffron rounded-xl"
                >
                  {isLoggedIn ? (<><Calendar className="w-5 h-5 mr-2" /> Book Now — ₹{Math.round(price * advancePercent / 100).toLocaleString()} Advance</>) : (<><LogIn className="w-5 h-5 mr-2" /> Login to Book</>)}
                </Button>
              </motion.div>
              <a href="tel:+918500087012">
                <Button variant="outline" className="h-14 px-6 rounded-xl font-body"><Phone className="w-5 h-5 mr-2" /> Call Us</Button>
              </a>
            </div>

            <p className="font-body text-xs text-muted-foreground mt-3 text-center">
              By booking, you agree to our <Link to="/cancellation-policy" className="text-primary hover:underline">Cancellation & Refund Policy</Link>
            </p>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PoojaDetail;
