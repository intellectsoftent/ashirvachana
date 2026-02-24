import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Save, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdmin } from "@/context/AdminContext";
import { useToast } from "@/hooks/use-toast";
import { toArray } from "@/lib/normalize";
import { buildFormData } from "@/lib/formdata";
import ImageUploadField from "./ImageUploadField";

const emptyForm = {
  title: "", category: "Protection", price: 0, original_price: 0, image_url: "",
  duration: "", description: "", benefits: [] as string[], includes: [] as string[],
  is_featured: false, badge: "", advance_percent: 30, location_ids: [] as number[],
};

const AdminPoojas = () => {
  const { poojas, addPooja, updatePooja, deletePooja } = useAdmin();
  const [editing, setEditing] = useState<string | number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [benefitInput, setBenefitInput] = useState("");
  const [includeInput, setIncludeInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleEdit = (pooja: any) => {
    setEditing(pooja.id);
    setForm({
      title: pooja.title || "",
      category: pooja.category || "Protection",
      price: pooja.price || 0,
      original_price: pooja.original_price || pooja.originalPrice || 0,
      image_url: pooja.image_url || pooja.image || "",
      duration: pooja.duration || "",
      description: pooja.description || "",
      benefits: toArray(pooja.benefits),
      includes: toArray(pooja.includes),
      is_featured: pooja.is_featured || false,
      badge: pooja.badge || "",
      advance_percent: pooja.advance_percent || 30,
      location_ids: pooja.location_ids || [],
    });
    setImageFile(null);
    setIsAdding(false);
  };

  const handleSave = async () => {
    try {
      const body = imageFile ? buildFormData(form, imageFile) : form;
      if (isAdding) {
        await addPooja(body);
        toast({ title: "Pooja added successfully" });
      } else if (editing) {
        await updatePooja(editing, body);
        toast({ title: "Pooja updated successfully" });
      }
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
    setEditing(null);
    setIsAdding(false);
    setForm(emptyForm);
    setImageFile(null);
  };

  const handleDelete = async (id: string | number) => {
    if (!window.confirm("Delete this pooja?")) return;
    try {
      await deletePooja(id);
      toast({ title: "Pooja deleted" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const startAdd = () => { setIsAdding(true); setEditing("new"); setForm(emptyForm); setImageFile(null); };
  const cancel = () => { setEditing(null); setIsAdding(false); setForm(emptyForm); setImageFile(null); };

  const addBenefit = () => {
    if (benefitInput.trim()) {
      setForm((f) => ({ ...f, benefits: [...f.benefits, benefitInput.trim()] }));
      setBenefitInput("");
    }
  };

  const addInclude = () => {
    if (includeInput.trim()) {
      setForm((f) => ({ ...f, includes: [...f.includes, includeInput.trim()] }));
      setIncludeInput("");
    }
  };

  const getImage = (p: any) => p.image_url || p.image || "";
  const getTitle = (p: any) => p.title || "";
  const getPrice = (p: any) => p.price || 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground">Manage Poojas</h2>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button onClick={startAdd} className="bg-gradient-gold text-primary-foreground font-body gap-2">
            <Plus className="w-4 h-4" /> Add Pooja
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
              <h3 className="font-display text-lg font-semibold text-foreground">{isAdding ? "Add New Pooja" : "Edit Pooja"}</h3>
              <button onClick={cancel}><X className="w-5 h-5 text-muted-foreground hover:text-foreground" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Image upload at top */}
              <ImageUploadField
                imageUrl={form.image_url}
                onImageUrlChange={(url) => setForm((f) => ({ ...f, image_url: url }))}
                onFileSelect={setImageFile}
                selectedFile={imageFile}
              />
              <div>
                <label className="font-body text-sm font-medium text-foreground mb-1 block">Title</label>
                <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="bg-secondary/50 font-body" />
              </div>
              <div>
                <label className="font-body text-sm font-medium text-foreground mb-1 block">Category</label>
                <Input value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="bg-secondary/50 font-body" />
              </div>
              <div>
                <label className="font-body text-sm font-medium text-foreground mb-1 block">Price (₹)</label>
                <Input type="number" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))} className="bg-secondary/50 font-body" />
              </div>
              <div>
                <label className="font-body text-sm font-medium text-foreground mb-1 block">Original Price (₹)</label>
                <Input type="number" value={form.original_price} onChange={(e) => setForm((f) => ({ ...f, original_price: Number(e.target.value) }))} className="bg-secondary/50 font-body" />
              </div>
              <div>
                <label className="font-body text-sm font-medium text-foreground mb-1 block">Duration</label>
                <Input value={form.duration} onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))} placeholder="e.g. 3-4 Hours" className="bg-secondary/50 font-body" />
              </div>
              <div>
                <label className="font-body text-sm font-medium text-foreground mb-1 block">Badge</label>
                <Input value={form.badge} onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))} placeholder="e.g. Prosperity" className="bg-secondary/50 font-body" />
              </div>
              <div>
                <label className="font-body text-sm font-medium text-foreground mb-1 block">Advance %</label>
                <Input type="number" value={form.advance_percent} onChange={(e) => setForm((f) => ({ ...f, advance_percent: Number(e.target.value) }))} className="bg-secondary/50 font-body" />
              </div>
              <div className="md:col-span-2">
                <label className="font-body text-sm font-medium text-foreground mb-1 block">Description</label>
                <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} className="w-full rounded-lg bg-secondary/50 border border-border p-3 font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="font-body text-sm font-medium text-foreground mb-1 block">Benefits</label>
                <div className="flex gap-2">
                  <Input value={benefitInput} onChange={(e) => setBenefitInput(e.target.value)} placeholder="Add benefit" className="bg-secondary/50 font-body" onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addBenefit())} />
                  <Button type="button" size="sm" onClick={addBenefit} variant="outline">+</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.benefits.map((b, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-body flex items-center gap-1">
                      {b}
                      <button onClick={() => setForm((f) => ({ ...f, benefits: f.benefits.filter((_, j) => j !== i) }))}><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="font-body text-sm font-medium text-foreground mb-1 block">Includes</label>
                <div className="flex gap-2">
                  <Input value={includeInput} onChange={(e) => setIncludeInput(e.target.value)} placeholder="Add item" className="bg-secondary/50 font-body" onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addInclude())} />
                  <Button type="button" size="sm" onClick={addInclude} variant="outline">+</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.includes.map((inc, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-gold/10 text-gold text-xs font-body flex items-center gap-1">
                      {inc}
                      <button onClick={() => setForm((f) => ({ ...f, includes: f.includes.filter((_, j) => j !== i) }))}><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <label className="font-body text-sm font-medium text-foreground">Featured</label>
                <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm((f) => ({ ...f, is_featured: e.target.checked }))} className="rounded" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={cancel} className="font-body">Cancel</Button>
              <Button onClick={handleSave} className="bg-gradient-gold text-primary-foreground font-body gap-2">
                <Save className="w-4 h-4" /> {isAdding ? "Add Pooja" : "Save Changes"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {poojas.map((pooja: any, i: number) => (
          <motion.div
            key={String(pooja.id)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="flex items-center gap-4 p-4 bg-card rounded-xl shadow-card border border-border hover:border-primary/20 transition-colors"
          >
            <img src={getImage(pooja)} alt={getTitle(pooja)} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h4 className="font-display text-sm font-semibold text-foreground truncate">{getTitle(pooja)}</h4>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <span className="font-body text-xs text-muted-foreground">{pooja.category}</span>
                <span className="font-body text-xs font-medium text-primary">₹{getPrice(pooja).toLocaleString()}</span>
                {pooja.rating && <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-gold text-gold" /><span className="font-body text-xs">{pooja.rating}</span></span>}
              </div>
            </div>
            <div className="flex gap-2">
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleEdit(pooja)} className="p-2 rounded-lg hover:bg-secondary transition-colors">
                <Pencil className="w-4 h-4 text-muted-foreground" />
              </motion.button>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleDelete(pooja.id)} className="p-2 rounded-lg hover:bg-destructive/10 transition-colors">
                <Trash2 className="w-4 h-4 text-destructive" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminPoojas;
