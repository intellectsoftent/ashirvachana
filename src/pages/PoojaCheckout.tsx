import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { poojasApi, ordersApi } from "@/lib/api";
import { RAZORPAY_KEY_ID } from "@/config";
import { openRazorpayCheckout } from "@/lib/razorpay";
import { useUser } from "@/context/UserContext";

const PoojaCheckout = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoggedIn, user } = useUser();

  const [pooja, setPooja] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [poojaDate, setPoojaDate] = useState("");
  const [poojaTime, setPoojaTime] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!id) return;
    poojasApi
      .getById(id)
      .then((p: any) => {
        setPooja(p?.data || p);
      })
      .catch(() => {
        toast({ title: "Pooja not found", variant: "destructive" });
        navigate("/poojas");
      })
      .finally(() => setLoading(false));
  }, [id, navigate, toast]);

  // Pre-fill for logged-in users
  useEffect(() => {
    if (isLoggedIn && user) {
      setCustomerName(user.name || "");
      setCustomerPhone(user.phone || "");
      setCustomerEmail(user.email || "");
      setAddress(user.address || "");
      setCity(user.city || "");
    }
  }, [isLoggedIn, user]);

  const price = pooja ? parseFloat(pooja.price) : 0;

  const handlePayment = async () => {
    if (!customerName.trim() || !customerPhone.trim() || !customerEmail.trim()) {
      toast({
        title: "Required fields missing",
        description: "Please enter your name, phone and email.",
        variant: "destructive",
      });
      return;
    }
    if (!poojaDate) {
      toast({
        title: "Select pooja date",
        variant: "destructive",
      });
      return;
    }

    const razorpayKey = RAZORPAY_KEY_ID || import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!razorpayKey) {
      toast({
        title: "Payment not configured",
        description: "Razorpay key is missing. Add VITE_RAZORPAY_KEY_ID to .env",
        variant: "destructive",
      });
      return;
    }

    try {
      setPlacing(true);
      const createOrder = isLoggedIn ? ordersApi.createRazorpayOrder : ordersApi.createRazorpayOrderGuest;
      const res = await createOrder({ amount: price, currency: "INR" });
      if (!res?.razorpay_order_id || !res?.key_id) {
        throw new Error(res?.message || "Failed to create payment order");
      }

      openRazorpayCheckout({
        key: res.key_id,
        amount: res.amount,
        order_id: res.razorpay_order_id,
        name: "Ashirvachana",
        description: `Pooja: ${pooja?.title}`,
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerPhone,
        },
        handler: async (paymentResponse) => {
          try {
            const placePayload = {
              order_type: "pooja",
              items: [{ item_type: "pooja", item_id: pooja.id, quantity: 1 }],
              pooja_id: pooja.id,
              pooja_date: poojaDate,
              pooja_time: poojaTime || undefined,
              address,
              city,
              state,
              pincode,
              customer_name: customerName,
              customer_phone: customerPhone,
              customer_email: customerEmail,
              notes: notes || undefined,
              payment_method: "razorpay",
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_signature: paymentResponse.razorpay_signature,
            };
            const placeOrder = isLoggedIn ? ordersApi.place : ordersApi.placeGuest;
            const result = await placeOrder(placePayload);
            toast({
              title: "Booking confirmed! 🙏",
              description: `Order ${result?.data?.order_number}. Our team will contact you shortly.`,
            });
            navigate("/");
          } catch (e: any) {
            toast({
              title: "Booking failed",
              description: e.message || "Could not confirm order.",
              variant: "destructive",
            });
          } finally {
            setPlacing(false);
          }
        },
        modal: {
          ondismiss: () => setPlacing(false),
        },
      });
    } catch (e: any) {
      toast({
        title: "Payment error",
        description: e.message || "Could not initiate payment.",
        variant: "destructive",
      });
      setPlacing(false);
    }
  };

  if (loading || !pooja) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse font-body text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 container mx-auto px-4 py-12 max-w-2xl">
        <Link
          to={`/poojas/${id}`}
          className="inline-flex items-center gap-2 font-body text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Pooja
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl shadow-card p-6 md:p-8"
        >
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">
            Checkout — {pooja.title}
          </h1>
          <p className="font-body text-muted-foreground mb-6">
            Fill in your details below. Payment is required to confirm your booking.
          </p>

          <div className="space-y-4">
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
              placeholder="Email *"
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="bg-secondary/50 font-body"
            />
            <Input
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="bg-secondary/50 font-body"
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="bg-secondary/50 font-body"
              />
              <Input
                placeholder="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="bg-secondary/50 font-body"
              />
            </div>
            <Input
              placeholder="Pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              className="bg-secondary/50 font-body"
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-body text-sm text-muted-foreground block mb-1">
                  Pooja Date *
                </label>
                <Input
                  type="date"
                  value={poojaDate}
                  onChange={(e) => setPoojaDate(e.target.value)}
                  className="bg-secondary/50 font-body"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div>
                <label className="font-body text-sm text-muted-foreground block mb-1">
                  Preferred Time
                </label>
                <Input
                  type="time"
                  value={poojaTime}
                  onChange={(e) => setPoojaTime(e.target.value)}
                  className="bg-secondary/50 font-body"
                />
              </div>
            </div>
            <Input
              placeholder="Notes (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-secondary/50 font-body"
            />
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
            <div>
              <span className="font-body text-muted-foreground">Amount to pay</span>
              <p className="font-display text-xl font-bold text-foreground">
                ₹{price.toLocaleString()}
              </p>
            </div>
            <Button
              onClick={handlePayment}
              disabled={placing}
              className="h-12 px-8 bg-gradient-gold text-primary-foreground font-body font-semibold hover:opacity-90 glow-saffron rounded-xl"
            >
              {placing ? (
                "Opening payment..."
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Pay & Confirm Booking
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default PoojaCheckout;
