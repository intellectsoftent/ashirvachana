import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

const Testimonials = () => {
  const { testimonials = [] } = useAdmin();

  return (
    <section
      id="testimonials"
      className="py-20 bg-gradient-hero relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full border-[20px] border-gold" />
        <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full border-[15px] border-gold" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="font-body text-sm uppercase tracking-[0.25em] text-gold font-medium">
            Speaking From Their Hearts
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-gold-foreground mt-3">
            Testimonials
          </h2>
          <div className="w-24 h-1 bg-gradient-gold mx-auto mt-4 rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(testimonials || []).slice(0, 6).map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="bg-maroon-foreground/10 backdrop-blur-md border border-gold/20 rounded-2xl p-6 hover:border-gold/40 transition-all duration-300"
            >
              <Quote className="w-8 h-8 text-gold/40 mb-4" />
              <h4 className="font-display text-lg font-semibold text-gold mb-2">
                {t.title}
              </h4>
              <p className="font-body text-sm text-gold-foreground/80 leading-relaxed mb-6">
                "{t.review_text}"
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-gold/10">
                <div>
                  <div className="font-body font-semibold text-gold-foreground text-sm">
                    {t.name}
                  </div>
                  <div className="font-body text-xs text-gold-foreground/60">
                    {t.location} · {t.language}
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
