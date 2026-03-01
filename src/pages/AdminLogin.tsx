import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Shield, Sparkles, Loader2, Mail, KeyRound, ArrowLeft, CheckCircle2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useAdmin } from "@/context/AdminContext";
import { adminAuthApi } from "@/lib/api";
import logoIcon from "@/assets/logo-icon.jpeg";

type Step = "login" | "forgot-email" | "forgot-otp" | "forgot-reset" | "forgot-success";

const AdminLogin = () => {
  const [step, setStep] = useState<Step>("login");

  // Login state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Forgot password state
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { login, isAdmin } = useAdmin();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAdmin) {
      navigate("/admin/dashboard");
    }
  }, [isAdmin, navigate]);

  const clearError = () => setError("");

  // ─── Login ──────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Username and password are required.");
      return;
    }
    setSubmitting(true);
    const success = await login(username.trim(), password);
    setSubmitting(false);
    if (success) {
      navigate("/admin/dashboard");
    } else {
      setError("Invalid username or password.");
      setPassword("");
    }
  };

  // ─── Step 1: Send OTP ──────────────────────────────
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    setSubmitting(true);
    try {
      await adminAuthApi.forgotPassword(email.trim());
      setStep("forgot-otp");
      setError("");
    } catch (err: any) {
      setError(err.message || "Failed to send OTP.");
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Step 2: Verify OTP ────────────────────────────
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await adminAuthApi.verifyOtp(email.trim(), otp);
      setResetToken(res.reset_token);
      setStep("forgot-reset");
      setError("");
    } catch (err: any) {
      setError(err.message || "Invalid or expired OTP.");
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Step 3: Reset Password ────────────────────────
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    try {
      await adminAuthApi.resetPassword(resetToken, newPassword);
      setStep("forgot-success");
      setError("");
    } catch (err: any) {
      setError(err.message || "Failed to reset password.");
    } finally {
      setSubmitting(false);
    }
  };

  const goBackToLogin = () => {
    setStep("login");
    setError("");
    setEmail("");
    setOtp("");
    setResetToken("");
    setNewPassword("");
    setConfirmPassword("");
  };

  // ─── Step title & subtitle ─────────────────────────
  const stepInfo: Record<Step, { icon: React.ReactNode; title: string; subtitle: string }> = {
    login: {
      icon: <Shield className="w-5 h-5 text-primary" />,
      title: "Admin Panel",
      subtitle: "Enter your credentials to continue",
    },
    "forgot-email": {
      icon: <Mail className="w-5 h-5 text-primary" />,
      title: "Forgot Password",
      subtitle: "Enter your registered email to receive an OTP",
    },
    "forgot-otp": {
      icon: <KeyRound className="w-5 h-5 text-primary" />,
      title: "Verify OTP",
      subtitle: `Enter the 6-digit OTP sent to ${email}`,
    },
    "forgot-reset": {
      icon: <Lock className="w-5 h-5 text-primary" />,
      title: "Reset Password",
      subtitle: "Set your new admin password",
    },
    "forgot-success": {
      icon: <CheckCircle2 className="w-5 h-5 text-green-600" />,
      title: "Password Reset!",
      subtitle: "Your password has been updated successfully",
    },
  };

  const info = stepInfo[step];

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating particles */}
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
        {/* Header */}
        <div className="text-center mb-8">
          <motion.img
            src={logoIcon}
            alt="Admin"
            className="w-16 h-16 rounded-2xl mx-auto mb-4"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <div className="flex items-center justify-center gap-2 mb-2">
            {info.icon}
            <h1 className="font-display text-2xl font-bold text-foreground">{info.title}</h1>
          </div>
          <p className="font-body text-sm text-muted-foreground">{info.subtitle}</p>
        </div>

        <AnimatePresence mode="wait">
          {/* ─── LOGIN STEP ──────────────────────────── */}
          {step === "login" && (
            <motion.form
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleLogin}
              className="space-y-5"
            >
              <div>
                <label className="font-body text-sm font-medium text-foreground mb-2 block">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Enter admin username"
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); clearError(); }}
                    className="pl-11 h-12 bg-secondary/50 border-border font-body"
                  />
                </div>
              </div>
              <div>
                <label className="font-body text-sm font-medium text-foreground mb-2 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); clearError(); }}
                    className="pl-11 h-12 bg-secondary/50 border-border font-body"
                  />
                </div>
              </div>

              {error && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-destructive text-sm font-body">
                  {error}
                </motion.p>
              )}

              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-12 bg-gradient-gold text-primary-foreground font-body font-semibold glow-saffron"
              >
                {submitting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Sparkles className="w-5 h-5 mr-2" />}
                {submitting ? "Verifying..." : "Access Admin Panel"}
              </Button>

              <button
                type="button"
                onClick={() => { setStep("forgot-email"); clearError(); }}
                className="block w-full text-center font-body text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Forgot Password?
              </button>
            </motion.form>
          )}

          {/* ─── FORGOT: EMAIL STEP ──────────────────── */}
          {step === "forgot-email" && (
            <motion.form
              key="forgot-email"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSendOtp}
              className="space-y-5"
            >
              <div>
                <label className="font-body text-sm font-medium text-foreground mb-2 block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); clearError(); }}
                    className="pl-11 h-12 bg-secondary/50 border-border font-body"
                  />
                </div>
              </div>

              {error && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-destructive text-sm font-body">
                  {error}
                </motion.p>
              )}

              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-12 bg-gradient-gold text-primary-foreground font-body font-semibold glow-saffron"
              >
                {submitting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Mail className="w-5 h-5 mr-2" />}
                {submitting ? "Sending OTP..." : "Send OTP"}
              </Button>

              <button type="button" onClick={goBackToLogin} className="flex items-center justify-center gap-1 w-full font-body text-sm text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Login
              </button>
            </motion.form>
          )}

          {/* ─── FORGOT: OTP STEP ────────────────────── */}
          {step === "forgot-otp" && (
            <motion.form
              key="forgot-otp"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleVerifyOtp}
              className="space-y-5"
            >
              <div className="flex flex-col items-center">
                <label className="font-body text-sm font-medium text-foreground mb-4 block">Enter 6-digit OTP</label>
                <InputOTP maxLength={6} value={otp} onChange={(val) => { setOtp(val); clearError(); }}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {error && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-destructive text-sm font-body text-center">
                  {error}
                </motion.p>
              )}

              <Button
                type="submit"
                disabled={submitting || otp.length !== 6}
                className="w-full h-12 bg-gradient-gold text-primary-foreground font-body font-semibold glow-saffron"
              >
                {submitting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <KeyRound className="w-5 h-5 mr-2" />}
                {submitting ? "Verifying..." : "Verify OTP"}
              </Button>

              <div className="flex items-center justify-between">
                <button type="button" onClick={goBackToLogin} className="flex items-center gap-1 font-body text-sm text-muted-foreground hover:text-primary transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back to Login
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await adminAuthApi.forgotPassword(email.trim());
                      setOtp("");
                    } catch { /* ignore */ }
                  }}
                  className="font-body text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  Resend OTP
                </button>
              </div>
            </motion.form>
          )}

          {/* ─── FORGOT: NEW PASSWORD STEP ───────────── */}
          {step === "forgot-reset" && (
            <motion.form
              key="forgot-reset"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleResetPassword}
              className="space-y-5"
            >
              <div>
                <label className="font-body text-sm font-medium text-foreground mb-2 block">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Min. 8 characters"
                    value={newPassword}
                    onChange={(e) => { setNewPassword(e.target.value); clearError(); }}
                    className="pl-11 h-12 bg-secondary/50 border-border font-body"
                  />
                </div>
              </div>
              <div>
                <label className="font-body text-sm font-medium text-foreground mb-2 block">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); clearError(); }}
                    className="pl-11 h-12 bg-secondary/50 border-border font-body"
                  />
                </div>
              </div>

              {error && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-destructive text-sm font-body">
                  {error}
                </motion.p>
              )}

              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-12 bg-gradient-gold text-primary-foreground font-body font-semibold glow-saffron"
              >
                {submitting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Lock className="w-5 h-5 mr-2" />}
                {submitting ? "Resetting..." : "Reset Password"}
              </Button>
            </motion.form>
          )}

          {/* ─── SUCCESS STEP ────────────────────────── */}
          {step === "forgot-success" && (
            <motion.div
              key="forgot-success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center space-y-5"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              >
                <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto" />
              </motion.div>
              <p className="font-body text-muted-foreground">You can now log in with your new password.</p>
              <Button
                onClick={goBackToLogin}
                className="w-full h-12 bg-gradient-gold text-primary-foreground font-body font-semibold glow-saffron"
              >
                <ArrowLeft className="w-5 h-5 mr-2" /> Go to Login
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {step === "login" && (
          <Link to="/" className="block text-center font-body text-sm text-muted-foreground hover:text-primary mt-6 transition-colors">
            ← Back to Home
          </Link>
        )}
      </motion.div>
    </div>
  );
};

export default AdminLogin;
