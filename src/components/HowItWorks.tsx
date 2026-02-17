import { motion } from "framer-motion";
import { Search, CalendarCheck, UserCheck, Heart } from "lucide-react";

const steps = [
  { icon: Search, title: "Choose Your Pooja", desc: "Browse our curated list of authentic rituals for every occasion." },
  { icon: CalendarCheck, title: "Select Date & Time", desc: "Pick a convenient slot. We'll confirm your booking instantly." },
  { icon: UserCheck, title: "Expert Priest Arrives", desc: "A verified, experienced priest arrives with all pooja essentials." },
  { icon: Heart, title: "Receive Blessings", desc: "Experience a divine, hassle-free pooja at your home." },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 bg-card relative overflow-hidden">
      {/* Subtle mandala background */}
      <div className="absolute top-0 right-0 w-96 h-96 opacity-[0.03] pointer-events-none">
        <div className="w-full h-full rounded-full border-[40px] border-primary" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="font-body text-sm uppercase tracking-[0.25em] text-primary font-medium">Simple Process</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-3">How It Works</h2>
          <div className="w-24 h-1 bg-gradient-gold mx-auto mt-4 rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="text-center relative"
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-primary/30 to-primary/10" />
              )}

              <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6">
                <step.icon className="w-8 h-8 text-primary" />
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gradient-gold text-primary-foreground font-body text-sm font-bold flex items-center justify-center">
                  {i + 1}
                </span>
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
