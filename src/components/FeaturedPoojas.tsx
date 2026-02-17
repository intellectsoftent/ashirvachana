import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAdmin } from "@/context/AdminContext";

const FeaturedPoojas = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const { poojas } = useAdmin();
  const featured = poojas.slice(0, 5);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
      setTimeout(checkScroll, 400);
    }
  };

  return (
    <section className="py-20 bg-gradient-warm overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="font-body text-sm uppercase tracking-[0.25em] text-primary font-medium">✨ Curated for You ✨</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-3">Featured Poojas</h2>
          <div className="w-24 h-1 bg-gradient-gold mx-auto mt-4 rounded-full" />
        </motion.div>

        <div className="relative">
          {canScrollLeft && (
            <button onClick={() => scroll("left")} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-background/90 shadow-card flex items-center justify-center hover:bg-background transition-colors">
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
          )}
          {canScrollRight && (
            <button onClick={() => scroll("right")} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-background/90 shadow-card flex items-center justify-center hover:bg-background transition-colors">
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
          )}

          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory px-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {featured.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex-shrink-0 w-72 snap-center group"
              >
                <Link to={`/poojas/${item.id}`}>
                  <div className="relative rounded-2xl overflow-hidden shadow-card">
                    <img src={item.image} alt={item.title} className="w-72 h-96 object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-temple-brown/90 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="font-display text-xl font-bold text-gold-foreground">{item.title}</h3>
                      <p className="font-body text-sm text-gold-foreground/70 mt-1">{item.category} · ₹{item.price.toLocaleString()}</p>
                    </div>
                    <div className="absolute inset-0 border-2 border-gold/0 rounded-2xl transition-all duration-300 group-hover:border-gold/40" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPoojas;
