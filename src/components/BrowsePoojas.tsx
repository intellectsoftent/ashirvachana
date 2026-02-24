import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAdmin } from "@/context/AdminContext";

const BrowsePoojas = () => {
  const { poojas = [] } = useAdmin();
  const displayPoojas = (poojas || []).slice(0, 6);

  return (
    <section id="poojas" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <span className="font-body text-sm uppercase tracking-[0.25em] text-primary font-medium">🙏 Browse</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-3">All Poojas</h2>
            <div className="w-24 h-1 bg-gradient-gold mt-4 rounded-full" />
          </div>
          <Link
            to="/poojas"
            className="hidden md:flex items-center gap-2 font-body text-sm font-medium text-primary hover:text-saffron transition-colors group"
          >
            View All
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayPoojas.map((pooja, i) => (
            <motion.div
              key={pooja.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group"
            >
              <Link to={`/poojas/${pooja.id}`}>
                <div className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-500 border border-border hover:border-primary/30">
                  <div className="relative overflow-hidden h-52">
                    <img
                      src={pooja.image_url || pooja.image}
                      alt={pooja.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full bg-background/90 backdrop-blur-sm text-xs font-body font-medium text-foreground">
                        {pooja.category}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-temple-brown/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {pooja.title}
                    </h3>
                    <div className="flex items-center justify-between mt-3">
                      <div>
                        <span className="font-body text-xs text-muted-foreground">Packages Starting From</span>
                        <div className="font-display text-xl font-bold text-primary">₹{pooja.price.toLocaleString()}</div>
                      </div>
                      <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center mt-10 md:hidden">
          <Link
            to="/poojas"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-body font-medium text-sm"
          >
            View All Poojas
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BrowsePoojas;
