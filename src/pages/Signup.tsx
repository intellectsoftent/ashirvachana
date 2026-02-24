import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Phone, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import logoIcon from "@/assets/logo-icon.jpeg";
import mandalaPattern from "@/assets/mandala-pattern.jpg";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const { signup } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const success = await signup(formData);
    setSubmitting(false);
    if (success) {
      toast({ title: "Account created! 🙏", description: "Welcome to Ashirvachana." });
      navigate("/");
    } else {
      toast({ title: "Signup failed", description: "Please try again or use a different email.", variant: "destructive" });
    }
  };

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const fields = [
    { key: "name", label: "Full Name", icon: User, type: "text", placeholder: "Your full name" },
    { key: "email", label: "Email", icon: Mail, type: "email", placeholder: "your@email.com" },
    { key: "phone", label: "Phone", icon: Phone, type: "tel", placeholder: "+91 XXXXX XXXXX" },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="flex items-center gap-3 mb-8 lg:hidden">
            <img src={logoIcon} alt="DivineConnect" className="w-12 h-12 rounded-xl" />
            <span className="font-display font-bold text-2xl text-foreground">DivineConnect</span>
          </Link>

          <div className="mb-6">
            <h1 className="font-display text-3xl font-bold text-foreground">Create Account</h1>
            <p className="font-body text-muted-foreground mt-2">Begin your spiritual journey with us</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((f, i) => (
              <motion.div key={f.key} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 * i }}>
                <label className="font-body text-sm font-medium text-foreground mb-2 block">{f.label}</label>
                <div className="relative">
                  <f.icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type={f.type}
                    placeholder={f.placeholder}
                    value={formData[f.key as keyof typeof formData]}
                    onChange={update(f.key)}
                    className="pl-11 h-12 bg-secondary/50 border-border font-body"
                    required
                  />
                </div>
              </motion.div>
            ))}

            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
              <label className="font-body text-sm font-medium text-foreground mb-2 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={update("password")}
                  className="pl-11 pr-11 h-12 bg-secondary/50 border-border font-body"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-12 bg-gradient-gold text-primary-foreground font-body font-semibold text-base hover:opacity-90 glow-saffron mt-2"
              >
                {submitting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Sparkles className="w-5 h-5 mr-2" />}
                {submitting ? "Creating account..." : "Create Account"}
              </Button>
            </motion.div>
          </form>

          <p className="text-center font-body text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">Sign In</Link>
          </p>
        </motion.div>
      </div>

      {/* Right - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-hero items-center justify-center">
        <img src={mandalaPattern} alt="" className="absolute inset-0 w-full h-full object-cover opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-bl from-maroon/90 via-temple-brown/80 to-maroon/90" />
        
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 rounded-full bg-gold/20"
            style={{ left: `${10 + i * 12}%`, top: `${15 + (i % 4) * 20}%` }}
            animate={{ y: [0, -40, 0], opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 4 + i * 0.5, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}

        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="relative z-10 text-center px-12">
          <motion.img
            src={logoIcon}
            alt="DivineConnect"
            className="w-32 h-32 mx-auto mb-8 rounded-3xl shadow-elevated"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <h2 className="font-display text-4xl font-bold text-cream mb-4">Join Our Community</h2>
          <p className="font-body text-cream/70 text-lg">Thousands trust us for sacred rituals and divine idols</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
