import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Sparkles, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { useOrders } from "@/context/OrderContext";
import { locations } from "@/data/locations";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Cart = () => {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { toast } = useToast();
  const [showCheckout, setShowCheckout] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerLocation, setCustomerLocation] = useState("Chennai");

  const handleCheckout = () => {
    if (!customerName || !customerPhone) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    const totalWithGST = Math.round(totalPrice * 1.18);
    // All items in cart are idols (full payment required)
    const order = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      items: items.map((i) => ({ ...i, type: "idol" as const })),
      totalPrice,
      totalWithGST,
      advancePaid: totalWithGST,
      balanceDue: 0,
      paymentType: "full" as const,
      customerName,
      customerPhone,
      customerEmail,
      location: customerLocation,
      status: "pending" as const,
      createdAt: new Date().toISOString(),
    };
    addOrder(order);
    clearCart();
    setShowCheckout(false);
    toast({ title: "Order placed successfully!", description: "You will receive a confirmation call shortly." });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 container mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/idols" className="inline-flex items-center gap-2 font-body text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </Link>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8"
        >
          Shopping Cart
        </motion.h1>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24"
          >
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}>
              <ShoppingBag className="w-20 h-20 text-muted-foreground/30 mx-auto" />
            </motion.div>
            <h2 className="font-display text-2xl text-foreground mt-6">Your cart is empty</h2>
            <p className="font-body text-muted-foreground mt-2">Explore our collection of sacred idols</p>
            <Link to="/idols">
              <Button className="mt-6 bg-gradient-gold text-primary-foreground font-body glow-saffron">
                <Sparkles className="w-4 h-4 mr-2" /> Browse Idols
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {items.map((item, i) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30, height: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex gap-5 p-5 bg-card rounded-2xl shadow-card"
                  >
                    <Link to={`/idols/${item.id}`}>
                      <img src={item.image} alt={item.name} className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-xl" />
                    </Link>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <Link to={`/idols/${item.id}`}>
                          <h3 className="font-display text-lg font-semibold text-foreground hover:text-primary transition-colors">{item.name}</h3>
                        </Link>
                        <p className="font-display text-xl font-bold text-foreground mt-1">₹{item.price.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-3 bg-secondary rounded-full px-1 py-1">
                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full bg-background flex items-center justify-center hover:bg-accent transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </motion.button>
                          <span className="font-body text-sm font-semibold w-6 text-center">{item.quantity}</span>
                          <motion.button
                            whileTap={{ scale: 0.85 }}
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full bg-background flex items-center justify-center hover:bg-accent transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </motion.button>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeFromCart(item.id)}
                          className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:sticky lg:top-28 h-fit"
            >
              <div className="bg-card rounded-2xl shadow-card p-6">
                <h3 className="font-display text-xl font-bold text-foreground mb-6">Order Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between font-body text-sm text-muted-foreground">
                    <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                    <span>₹{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-body text-sm text-muted-foreground">
                    <span>Shipping</span>
                    <span className="text-primary font-medium">FREE</span>
                  </div>
                  <div className="flex justify-between font-body text-sm text-muted-foreground">
                    <span>Tax (GST 18%)</span>
                    <span>₹{Math.round(totalPrice * 0.18).toLocaleString()}</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between">
                    <span className="font-display text-lg font-bold text-foreground">Total</span>
                    <span className="font-display text-lg font-bold text-foreground">₹{Math.round(totalPrice * 1.18).toLocaleString()}</span>
                  </div>
                </div>

                {!showCheckout ? (
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={() => setShowCheckout(true)}
                      className="w-full h-14 mt-6 bg-gradient-gold text-primary-foreground font-body font-semibold text-base hover:opacity-90 glow-saffron rounded-xl"
                    >
                      <Sparkles className="w-5 h-5 mr-2" /> Proceed to Checkout
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-6 space-y-3"
                  >
                    <Input
                      placeholder="Your Name *"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="bg-secondary/50 font-body"
                    />
                    <Input
                      placeholder="Phone Number *"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="bg-secondary/50 font-body"
                    />
                    <Input
                      placeholder="Email (optional)"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="bg-secondary/50 font-body"
                    />
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <select
                        value={customerLocation}
                        onChange={(e) => setCustomerLocation(e.target.value)}
                        className="w-full h-10 pl-10 pr-4 rounded-md border border-input bg-secondary/50 font-body text-sm text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        {locations.filter(l => l !== "All Locations").map((loc) => (
                          <option key={loc} value={loc}>{loc}</option>
                        ))}
                      </select>
                    </div>
                    <Button
                      onClick={handleCheckout}
                      className="w-full h-14 bg-gradient-gold text-primary-foreground font-body font-semibold text-base hover:opacity-90 glow-saffron rounded-xl"
                    >
                      <Sparkles className="w-5 h-5 mr-2" /> Place Order
                    </Button>
                  </motion.div>
                )}

                <button onClick={clearCart} className="w-full mt-3 font-body text-sm text-muted-foreground hover:text-destructive transition-colors text-center">
                  Clear Cart
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
