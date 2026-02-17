import { motion } from "framer-motion";
import { ArrowLeft, Mail, AlertTriangle, Clock, RefreshCw, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const sections = [
  {
    icon: AlertTriangle,
    title: "Cancellations",
    items: [
      "2+ days before Pooja: Full refund",
      "Within 2 days / 48 hours: 50% refund",
      "On event day / during Muhurth time: No refund",
    ],
  },
  {
    icon: RefreshCw,
    title: "Refunds",
    items: [
      "Processed within 12 working days",
      "Email support@ashirvachana.com to initiate",
      "Bank transfer charges may apply",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Exceptions",
    items: [
      "Non-delivery of service",
      "Significant service issues",
      "Contact Support Team (support@ashirvachana.com) for approval",
    ],
  },
];

const CancellationPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 container mx-auto px-4 py-12 max-w-3xl">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Link to="/" className="inline-flex items-center gap-2 font-body text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2"
        >
          Cancellations & Refund Policy
        </motion.h1>
        <p className="font-body text-muted-foreground mb-10">For Pooja bookings at Ashirvachana</p>

        <div className="space-y-8">
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-2xl shadow-card p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <section.icon className="w-5 h-5 text-primary" />
                </div>
                <h2 className="font-display text-xl font-bold text-foreground">{section.title}</h2>
              </div>
              <ol className="space-y-2 list-decimal list-inside">
                {section.items.map((item) => (
                  <li key={item} className="font-body text-sm text-muted-foreground leading-relaxed">{item}</li>
                ))}
              </ol>
            </motion.div>
          ))}

          {/* Note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-2xl shadow-card p-6"
          >
            <h2 className="font-display text-xl font-bold text-foreground mb-3">Important Notes</h2>
            <ul className="space-y-2">
              <li className="font-body text-sm text-muted-foreground">• Refunds are subject to verification.</li>
              <li className="font-body text-sm text-muted-foreground">• Policy applies to all purchases.</li>
              <li className="font-body text-sm text-muted-foreground">• If Naes Tech Services Pvt. Ltd completes your Pooja order, refunds aren't applicable.</li>
              <li className="font-body text-sm text-muted-foreground">• By purchasing, you agree to our refund policy.</li>
            </ul>
          </motion.div>

          {/* Non-responsive */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-destructive/5 border border-destructive/20 rounded-2xl p-6"
          >
            <h2 className="font-display text-xl font-bold text-foreground mb-3">Non-Responsive Customer Policy</h2>
            <p className="font-body text-sm text-muted-foreground leading-relaxed mb-3">
              If you don't respond to calls, messages, or emails from Ashirvachana before the previous day's working hours of your scheduled Pooja, we may:
            </p>
            <ul className="space-y-1">
              <li className="font-body text-sm text-muted-foreground">• Cancel your booking</li>
              <li className="font-body text-sm text-muted-foreground">• Retain full payment (no refund)</li>
            </ul>
            <p className="font-body text-xs text-muted-foreground mt-3">This helps us coordinate with our pandit and avoid last-minute issues.</p>
          </motion.div>

          {/* Payment Policy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card rounded-2xl shadow-card p-6"
          >
            <h2 className="font-display text-xl font-bold text-foreground mb-3">Payment Policy</h2>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              Registration will be confirmed only after we receive advance or full payment. If payment isn't received before the Pooja, we won't be able to provide our services. You can pay using Cash, Cheque, Visa, MasterCard, or Net Banking.
            </p>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center py-6"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-5 py-2">
              <Mail className="w-4 h-4 text-primary" />
              <a href="mailto:support@ashirvachana.com" className="font-body text-sm text-primary font-medium hover:underline">
                support@ashirvachana.com
              </a>
            </div>
            <p className="font-body text-xs text-muted-foreground mt-2">We'll respond within 12–24 hours</p>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CancellationPolicy;
