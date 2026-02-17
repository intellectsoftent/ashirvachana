import { motion } from "framer-motion";
import { Phone, ArrowRight } from "lucide-react";
import mandalaPattern from "@/assets/mandala-pattern.jpg";

const CTASection = () => {
  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden bg-gradient-sacred p-12 md:p-20 text-center"
        >
          {/* Mandala overlay */}
          <div className="absolute inset-0 opacity-10">
            <img src={mandalaPattern} alt="" className="w-full h-full object-cover" />
          </div>

          <div className="relative z-10">
            <h2 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
              Ready to Receive Divine Blessings?
            </h2>
            <p className="font-body text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Book your pooja today and experience the serenity of authentic Vedic rituals at home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#poojas"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-background text-primary font-body font-semibold text-base hover:bg-background/90 transition-all shadow-elevated"
              >
                Book a Pooja
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="tel:+918500087012"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-primary-foreground/30 text-primary-foreground font-body font-semibold text-base hover:bg-primary-foreground/10 transition-all"
              >
                <Phone className="w-5 h-5" />
                +91 85000-87012
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
