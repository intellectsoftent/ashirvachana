import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import logoIcon from "@/assets/logo-icon.jpeg";
import mandalaPattern from "@/assets/mandala-pattern.jpg";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(email, password);
    if (success) {
      toast({ title: "Welcome back! 🙏", description: "You have been logged in successfully." });
      navigate("/");
    } else {
      toast({ title: "Invalid credentials", description: "Use user@test.com / password123", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Decorative Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-hero items-center justify-center">
        <img src={mandalaPattern} alt="" className="absolute inset-0 w-full h-full object-cover opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-br from-maroon/90 via-temple-brown/80 to-maroon/90" />
        
        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 rounded-full bg-gold/20"
            style={{ left: `${10 + i * 12}%`, top: `${15 + (i % 4) * 20}%` }}
            animate={{ y: [0, -40, 0], opacity: [0.2, 0.6, 0.2], scale: [1, 1.3, 1] }}
            transition={{ duration: 4 + i * 0.5, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-12"
        >
          <motion.img
            src={logoIcon}
            alt="DivineConnect"
            className="w-32 h-32 mx-auto mb-8 rounded-3xl shadow-elevated"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <h2 className="font-display text-4xl font-bold text-cream mb-4">Welcome Back</h2>
          <p className="font-body text-cream/70 text-lg">Continue your spiritual journey with us</p>
          <div className="mt-8 flex justify-center gap-6">
            {["500+ Poojas", "50+ Priests", "20+ Cities"].map((stat, i) => (
              <motion.div
                key={stat}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.2 }}
                className="text-center"
              >
                <div className="font-display text-gold text-sm font-semibold">{stat}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="flex items-center gap-3 mb-10 lg:hidden">
            <img src={logoIcon} alt="DivineConnect" className="w-12 h-12 rounded-xl" />
            <span className="font-display font-bold text-2xl text-foreground">DivineConnect</span>
          </Link>

          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground">Sign In</h1>
            <p className="font-body text-muted-foreground mt-2">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <label className="font-body text-sm font-medium text-foreground mb-2 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 h-12 bg-secondary/50 border-border font-body"
                />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <label className="font-body text-sm font-medium text-foreground mb-2 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 pr-11 h-12 bg-secondary/50 border-border font-body"
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

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-border" />
                <span className="font-body text-sm text-muted-foreground">Remember me</span>
              </label>
              <a href="#" className="font-body text-sm text-primary hover:underline">Forgot password?</a>
            </div>

            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Button type="submit" className="w-full h-12 bg-gradient-gold text-primary-foreground font-body font-semibold text-base hover:opacity-90 transition-all glow-saffron">
                <Sparkles className="w-5 h-5 mr-2" />
                Sign In
              </Button>
            </motion.div>
          </form>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-8">
            <div className="ornament-divider text-muted-foreground text-sm font-body mb-6">or continue with</div>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-12 font-body">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Google
              </Button>
              <Button variant="outline" className="h-12 font-body">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                GitHub
              </Button>
            </div>
          </motion.div>

          <p className="text-center font-body text-sm text-muted-foreground mt-8">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary font-semibold hover:underline">Sign Up</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
