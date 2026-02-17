import { motion } from "framer-motion";
import { Phone, ArrowDown, Sparkles } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img src={heroBanner} alt="Sacred fire ceremony" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-temple-brown/80 via-maroon/70 to-temple-brown/90" />
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-gold/30"
            style={{ left: `${15 + i * 15}%`, top: `${20 + (i % 3) * 25}%` }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.4,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col items-center gap-6"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-gold/20 border border-gold/30 backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="font-body text-sm text-gold-foreground">Trusted by 10,000+ Families</span>
          </motion.div>

          {/* Heading */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold text-gold-foreground leading-tight max-w-4xl">
            Sacred{" "}
            <span className="text-gold">Pooja Services</span>
            <br />
            At Your Doorstep
          </h1>

          <p className="font-body text-lg md:text-xl text-gold-foreground/80 max-w-2xl">
            Get blessed by experienced and verified priests in your city.
            From Homams to Havan, we bring divine rituals to your home.
          </p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 mt-4"
          >
            <a
              href="#poojas"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-gold text-primary-foreground font-body font-semibold text-base hover:opacity-90 transition-all shadow-warm glow-saffron"
            >
              <Sparkles className="w-5 h-5" />
              Explore Poojas
            </a>
            <a
              href="tel:+918500087012"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-gold/40 text-gold-foreground font-body font-semibold text-base hover:bg-gold/10 backdrop-blur-sm transition-all"
            >
              <Phone className="w-5 h-5" />
              Call Now
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="flex flex-wrap justify-center gap-8 md:gap-16 mt-8 pt-8 border-t border-gold/20"
          >
            {[
              { value: "500+", label: "Poojas Performed" },
              { value: "50+", label: "Expert Priests" },
              { value: "20+", label: "Cities Covered" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-3xl font-bold text-gold">{stat.value}</div>
                <div className="font-body text-sm text-gold-foreground/60 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ArrowDown className="w-6 h-6 text-gold/60" />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
