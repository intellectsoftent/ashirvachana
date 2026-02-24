import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, User, Tag, BookOpen, Share2 } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const BlogDetail = () => {
  const { id } = useParams();
  const { blogs } = useAdmin();
  const blog = blogs.find((b) => String(b.id) === id);

  if (!blog) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-20 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="font-display text-3xl text-foreground mb-2">Article Not Found</h1>
            <p className="font-body text-muted-foreground mb-6">The article you're looking for doesn't exist.</p>
            <Link to="/blog" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-gold text-primary-foreground font-body font-medium">
              <ArrowLeft className="w-4 h-4" /> Back to Blog
            </Link>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  const relatedBlogs = blogs.filter((b) => b.id !== blog.id && b.category === blog.category).slice(0, 2);
  const otherBlogs = relatedBlogs.length < 2
    ? [...relatedBlogs, ...blogs.filter((b) => b.id !== blog.id && !relatedBlogs.find(r => r.id === b.id)).slice(0, 2 - relatedBlogs.length)]
    : relatedBlogs;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Banner */}
      <section className="pt-20 relative">
        <div className="relative h-[35vh] md:h-[45vh] overflow-hidden">
          <motion.img
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src={blog.image_url || blog.image}
            alt={blog.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&q=80";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/10" />

          {/* Floating particles */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-gold/30"
              style={{ left: `${15 + i * 18}%`, bottom: `${20 + (i % 3) * 15}%` }}
              animate={{ y: [0, -20, 0], opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
            />
          ))}
        </div>
      </section>

      {/* Article Content */}
      <div className="container mx-auto px-4 -mt-28 relative z-10 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Article Card */}
          <motion.article
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-card rounded-3xl shadow-elevated border border-border overflow-hidden"
          >
            {/* Article Header */}
            <div className="p-6 md:p-10">
              {/* Back + Share Row */}
              <div className="flex items-center justify-between mb-6">
                <Link to="/blog" className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-primary transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back to Blog
                </Link>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigator.clipboard.writeText(window.location.href)}
                  className="p-2 rounded-lg hover:bg-secondary transition-colors"
                  title="Copy link"
                >
                  <Share2 className="w-4 h-4 text-muted-foreground" />
                </motion.button>
              </div>

              {/* Category + Date Row */}
              <div className="flex items-center gap-3 mb-5">
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="px-4 py-1.5 rounded-full bg-gradient-gold text-primary-foreground text-xs font-body font-semibold"
                >
                  {blog.category}
                </motion.span>
                <span className="font-body text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {blog.read_time || blog.readTime}
                </span>
              </div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-tight mb-4"
              >
                {blog.title}
              </motion.h1>

              {/* Excerpt */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="font-body text-base text-muted-foreground leading-relaxed mb-6"
              >
                {blog.excerpt}
              </motion.p>

              {/* Author + Date Bar */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 border border-border"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-body text-sm font-semibold text-foreground">{blog.author}</p>
                  <p className="font-body text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(blog.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Divider */}
            <div className="mx-6 md:mx-10 h-px bg-border" />

            {/* Article Body */}
            <div className="p-6 md:p-10">
              {(blog.content || "").split("\n\n").map((paragraph, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.08 }}
                  className="font-body text-foreground/85 leading-[1.85] text-base md:text-[17px] mb-6 last:mb-0"
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>

            {/* Tags */}
            {(blog.tags || []).length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="px-6 md:px-10 pb-8"
              >
                <div className="flex items-center gap-2 flex-wrap pt-6 border-t border-border">
                  <Tag className="w-4 h-4 text-muted-foreground" />
                  {(blog.tags || []).map((tag) => (
                    <motion.span
                      key={tag}
                      whileHover={{ scale: 1.05 }}
                      className="px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-body font-medium hover:bg-primary/10 hover:text-primary transition-colors cursor-default"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.article>

          {/* More Articles */}
          {otherBlogs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-12"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground">More Articles</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {otherBlogs.map((rb, i) => (
                  <motion.div
                    key={rb.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + i * 0.1 }}
                  >
                    <Link to={`/blog/${rb.id}`} className="group block">
                      <div className="bg-card rounded-2xl overflow-hidden shadow-card border border-border hover:border-primary/30 hover:shadow-elevated transition-all duration-500">
                        <div className="relative h-40 overflow-hidden">
                          <img
                            src={rb.image_url || rb.image}
                            alt={rb.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&q=80";
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-temple-brown/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <div className="p-5">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-body font-semibold">
                              {rb.category}
                            </span>
                            <span className="font-body text-[10px] text-muted-foreground">{rb.read_time || rb.readTime}</span>
                          </div>
                          <h4 className="font-display text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                            {rb.title}
                          </h4>
                          <p className="font-body text-xs text-muted-foreground mt-2 line-clamp-2">{rb.excerpt}</p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BlogDetail;
