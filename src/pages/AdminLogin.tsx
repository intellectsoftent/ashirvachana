import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdmin } from "@/context/AdminContext";
import logoIcon from "@/assets/logo-icon.jpeg";

const AdminLogin = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, isAdmin } = useAdmin();
  const navigate = useNavigate();

  // Use useEffect for navigation to avoid calling navigate during render
  React.useEffect(() => {
    if (isAdmin) {
      navigate("/admin/dashboard");
    }
  }, [isAdmin, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      navigate("/admin/dashboard");
    } else {
      setError("Invalid password. Please try again.");
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4 relative overflow-hidden">
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-gold/15"
          style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
          animate={{ y: [0, -50, 0], opacity: [0.1, 0.4, 0.1] }}
          transition={{ duration: 4 + i * 0.5, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-card rounded-3xl shadow-elevated p-8 relative z-10"
      >
        <div className="text-center mb-8">
          <motion.img
            src={logoIcon}
            alt="Admin"
            className="w-16 h-16 rounded-2xl mx-auto mb-4"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-primary" />
            <h1 className="font-display text-2xl font-bold text-foreground">Admin Panel</h1>
          </div>
          <p className="font-body text-sm text-muted-foreground">Enter admin password to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="font-body text-sm font-medium text-foreground mb-2 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                className="pl-11 h-12 bg-secondary/50 border-border font-body"
              />
            </div>
            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-destructive text-sm font-body mt-2">
                {error}
              </motion.p>
            )}
          </div>

          <Button type="submit" className="w-full h-12 bg-gradient-gold text-primary-foreground font-body font-semibold glow-saffron">
            <Sparkles className="w-5 h-5 mr-2" /> Access Admin Panel
          </Button>
        </form>

        <Link to="/" className="block text-center font-body text-sm text-muted-foreground hover:text-primary mt-6 transition-colors">
          ← Back to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
