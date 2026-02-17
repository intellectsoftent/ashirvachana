import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Save, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdmin } from "@/context/AdminContext";
import type { Idol } from "@/data/idols";

const emptyIdol = {
  name: "", deity: "", price: 0, originalPrice: 0, image: "",
  material: "", height: "", weight: "", description: "",
  features: [] as string[], rating: 5, reviews: 0, inStock: true,
};

const AdminIdols = () => {
  const { idols, addIdol, updateIdol, deleteIdol } = useAdmin();
  const [editing, setEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState(emptyIdol);
  const [featureInput, setFeatureInput] = useState("");

  const handleEdit = (idol: Idol & { image: string }) => {
    setEditing(idol.id);
    setForm({ ...idol });
    setIsAdding(false);
  };

  const handleSave = () => {
    if (isAdding) {
      const id = form.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      addIdol({ ...form, id } as Idol & { image: string });
    } else if (editing) {
      updateIdol(editing, form);
    }
    setEditing(null);
    setIsAdding(false);
    setForm(emptyIdol);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Delete this idol?")) deleteIdol(id);
  };

  const startAdd = () => { setIsAdding(true); setEditing("new"); setForm(emptyIdol); };
  const cancel = () => { setEditing(null); setIsAdding(false); setForm(emptyIdol); };

  const addFeature = () => {
    if (featureInput.trim()) {
      setForm((f) => ({ ...f, features: [...f.features, featureInput.trim()] }));
      setFeatureInput("");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground">Manage Idols</h2>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button onClick={startAdd} className="bg-gradient-gold text-primary-foreground font-body gap-2">
            <Plus className="w-4 h-4" /> Add Idol
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
              <h3 className="font-display text-lg font-semibold text-foreground">{isAdding ? "Add New Idol" : "Edit Idol"}</h3>
              <button onClick={cancel}><X className="w-5 h-5 text-muted-foreground hover:text-foreground" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: "name", label: "Name", type: "text" },
                { key: "deity", label: "Deity", type: "text" },
                { key: "price", label: "Price (₹)", type: "number" },
                { key: "originalPrice", label: "Original Price (₹)", type: "number" },
                { key: "material", label: "Material", type: "text" },
                { key: "height", label: "Height", type: "text" },
                { key: "weight", label: "Weight", type: "text" },
                { key: "image", label: "Image URL", type: "text" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="font-body text-sm font-medium text-foreground mb-1 block">{f.label}</label>
                  <Input
                    type={f.type}
                    value={(form as any)[f.key]}
                    onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value }))}
                    className="bg-secondary/50 font-body"
                  />
                </div>
              ))}
              <div className="md:col-span-2">
                <label className="font-body text-sm font-medium text-foreground mb-1 block">Description</label>
                <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} className="w-full rounded-lg bg-secondary/50 border border-border p-3 font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="font-body text-sm font-medium text-foreground mb-1 block">Features</label>
                <div className="flex gap-2">
                  <Input value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} placeholder="Add feature" className="bg-secondary/50 font-body" onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())} />
                  <Button type="button" size="sm" onClick={addFeature} variant="outline">+</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.features.map((f, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-body flex items-center gap-1">
                      {f}
                      <button onClick={() => setForm((prev) => ({ ...prev, features: prev.features.filter((_, j) => j !== i) }))}><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <label className="font-body text-sm font-medium text-foreground">In Stock</label>
                <input type="checkbox" checked={form.inStock} onChange={(e) => setForm((f) => ({ ...f, inStock: e.target.checked }))} className="rounded" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={cancel} className="font-body">Cancel</Button>
              <Button onClick={handleSave} className="bg-gradient-gold text-primary-foreground font-body gap-2">
                <Save className="w-4 h-4" /> {isAdding ? "Add Idol" : "Save Changes"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {idols.map((idol, i) => (
          <motion.div
            key={idol.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="flex items-center gap-4 p-4 bg-card rounded-xl shadow-card border border-border hover:border-primary/20 transition-colors"
          >
            <img src={idol.image} alt={idol.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h4 className="font-display text-sm font-semibold text-foreground truncate">{idol.name}</h4>
              <div className="flex items-center gap-3 mt-1">
                <span className="font-body text-xs text-muted-foreground">{idol.deity}</span>
                <span className="font-body text-xs font-medium text-primary">₹{idol.price.toLocaleString()}</span>
                <span className={`font-body text-xs ${idol.inStock ? "text-primary" : "text-destructive"}`}>{idol.inStock ? "In Stock" : "Out of Stock"}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleEdit(idol)} className="p-2 rounded-lg hover:bg-secondary transition-colors">
                <Pencil className="w-4 h-4 text-muted-foreground" />
              </motion.button>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleDelete(idol.id)} className="p-2 rounded-lg hover:bg-destructive/10 transition-colors">
                <Trash2 className="w-4 h-4 text-destructive" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminIdols;
