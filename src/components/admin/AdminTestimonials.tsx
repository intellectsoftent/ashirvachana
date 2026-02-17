import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Save, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdmin } from "@/context/AdminContext";
import type { Testimonial } from "@/data/testimonials";

const emptyTestimonial: Omit<Testimonial, "id"> = {
  name: "", location: "", language: "", title: "", text: "", rating: 5,
};

const AdminTestimonials = () => {
  const { testimonials, addTestimonial, updateTestimonial, deleteTestimonial } = useAdmin();
  const [editing, setEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState<Omit<Testimonial, "id">>(emptyTestimonial);

  const handleEdit = (t: Testimonial) => { setEditing(t.id); setForm({ ...t }); setIsAdding(false); };

  const handleSave = () => {
    if (isAdding) {
      addTestimonial({ ...form, id: `t-${Date.now()}` } as Testimonial);
    } else if (editing) {
      updateTestimonial(editing, form);
    }
    setEditing(null);
    setIsAdding(false);
    setForm(emptyTestimonial);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Delete this testimonial?")) deleteTestimonial(id);
  };

  const startAdd = () => { setIsAdding(true); setEditing("new"); setForm(emptyTestimonial); };
  const cancel = () => { setEditing(null); setIsAdding(false); setForm(emptyTestimonial); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground">Manage Testimonials</h2>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button onClick={startAdd} className="bg-gradient-gold text-primary-foreground font-body gap-2">
            <Plus className="w-4 h-4" /> Add Testimonial
          </Button>
        </motion.div>
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-card rounded-2xl shadow-card border border-border p-6 mb-6 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-semibold text-foreground">{isAdding ? "Add Testimonial" : "Edit Testimonial"}</h3>
              <button onClick={cancel}><X className="w-5 h-5 text-muted-foreground hover:text-foreground" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: "name", label: "Name" },
                { key: "location", label: "Location" },
                { key: "language", label: "Language" },
                { key: "title", label: "Title" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="font-body text-sm font-medium text-foreground mb-1 block">{f.label}</label>
                  <Input value={(form as any)[f.key]} onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))} className="bg-secondary/50 font-body" />
                </div>
              ))}
              <div className="md:col-span-2">
                <label className="font-body text-sm font-medium text-foreground mb-1 block">Review Text</label>
                <textarea value={form.text} onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))} rows={3} className="w-full rounded-lg bg-secondary/50 border border-border p-3 font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="font-body text-sm font-medium text-foreground mb-1 block">Rating (1-5)</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((r) => (
                    <button key={r} onClick={() => setForm((f) => ({ ...f, rating: r }))}>
                      <Star className={`w-6 h-6 transition-colors ${r <= form.rating ? "fill-gold text-gold" : "text-border"}`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={cancel} className="font-body">Cancel</Button>
              <Button onClick={handleSave} className="bg-gradient-gold text-primary-foreground font-body gap-2">
                <Save className="w-4 h-4" /> {isAdding ? "Add" : "Save"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="flex items-start gap-4 p-4 bg-card rounded-xl shadow-card border border-border hover:border-primary/20 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-gold flex items-center justify-center text-primary-foreground font-display font-bold text-lg flex-shrink-0">
              {t.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-display text-sm font-semibold text-foreground">{t.title}</h4>
              <p className="font-body text-xs text-muted-foreground mt-1 line-clamp-2">"{t.text}"</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="font-body text-xs text-foreground font-medium">{t.name}</span>
                <span className="font-body text-xs text-muted-foreground">{t.location}</span>
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-3 h-3 fill-gold text-gold" />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleEdit(t)} className="p-2 rounded-lg hover:bg-secondary transition-colors">
                <Pencil className="w-4 h-4 text-muted-foreground" />
              </motion.button>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleDelete(t.id)} className="p-2 rounded-lg hover:bg-destructive/10 transition-colors">
                <Trash2 className="w-4 h-4 text-destructive" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminTestimonials;
