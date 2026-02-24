import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Save, Star, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdmin } from "@/context/AdminContext";
import { useToast } from "@/hooks/use-toast";
import { pujarisApi } from "@/lib/api";
import { useEffect, useCallback } from "react";

export interface Pujari {
  id: number | string;
  full_name?: string;
  name?: string;
  experience: string;
  specializations: string[];
  locations?: string[];
  service_location_ids?: number[];
  phone: string;
  rating: number;
  is_available?: boolean;
  isAvailable?: boolean;
  bio?: string;
}

const getPujariName = (p: Pujari) => p.full_name || p.name || "";
const isPujariAvailable = (p: Pujari) => p.is_available ?? p.isAvailable ?? true;

// Export for use by other components
export const getPujaris = async (): Promise<Pujari[]> => {
  try {
    const data = await pujarisApi.getAll();
    return Array.isArray(data) ? data : (data as any)?.pujaris ?? (data as any)?.data ?? [];
  } catch {
    return [];
  }
};

const emptyForm = {
  full_name: "", experience: "", specializations: [] as string[],
  service_location_ids: [] as number[], phone: "", rating: 5, is_available: true, bio: "",
};

const AdminPujari = () => {
  const [pujaris, setPujaris] = useState<Pujari[]>([]);
  const [editing, setEditing] = useState<string | number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [specInput, setSpecInput] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const data = await pujarisApi.adminGetAll();
      const list = Array.isArray(data) ? data : (data as any)?.pujaris ?? (data as any)?.data ?? [];
      setPujaris(list);
    } catch {
      // try public
      const data = await pujarisApi.getAll().catch(() => []);
      setPujaris(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const handleEdit = (p: Pujari) => {
    setEditing(p.id);
    setForm({
      full_name: getPujariName(p),
      experience: p.experience,
      specializations: p.specializations || [],
      service_location_ids: p.service_location_ids || [],
      phone: p.phone || "",
      rating: p.rating || 5,
      is_available: isPujariAvailable(p),
      bio: p.bio || "",
    });
    setIsAdding(false);
  };

  const handleSave = async () => {
    try {
      if (isAdding) {
        await pujarisApi.adminCreate(form);
        toast({ title: "Pujari added successfully" });
      } else if (editing) {
        await pujarisApi.adminUpdate(editing, form);
        toast({ title: "Pujari updated successfully" });
      }
      await refresh();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
    setEditing(null);
    setIsAdding(false);
    setForm(emptyForm);
  };

  const handleDelete = async (id: string | number) => {
    if (!window.confirm("Delete this Pujari?")) return;
    try {
      await pujarisApi.adminDelete(id);
      toast({ title: "Pujari deleted" });
      await refresh();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const startAdd = () => { setIsAdding(true); setEditing("new"); setForm(emptyForm); };
  const cancel = () => { setEditing(null); setIsAdding(false); setForm(emptyForm); };

  const addSpec = () => {
    const trimmed = specInput.trim();
    if (!trimmed) return;
    setForm((f) => ({ ...f, specializations: [...f.specializations, trimmed] }));
    setSpecInput("");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground">Pujari Master</h2>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button onClick={startAdd} className="bg-gradient-gold text-primary-foreground font-body gap-2">
            <Plus className="w-4 h-4" /> Add Pujari
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
              <h3 className="font-display text-lg font-semibold text-foreground">{isAdding ? "Add New Pujari" : "Edit Pujari"}</h3>
              <button onClick={cancel}><X className="w-5 h-5 text-muted-foreground hover:text-foreground" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-body text-sm font-medium text-foreground mb-1 block">Full Name</label>
                <Input value={form.full_name} onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))} className="bg-secondary/50 font-body" placeholder="Pandit..." />
              </div>
              <div>
                <label className="font-body text-sm font-medium text-foreground mb-1 block">Experience</label>
                <Input value={form.experience} onChange={(e) => setForm((f) => ({ ...f, experience: e.target.value }))} className="bg-secondary/50 font-body" placeholder="e.g. 10+ years" />
              </div>
              <div>
                <label className="font-body text-sm font-medium text-foreground mb-1 block">Phone Number</label>
                <Input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="bg-secondary/50 font-body" placeholder="+91 XXXXX XXXXX" />
              </div>
              <div>
                <label className="font-body text-sm font-medium text-foreground mb-1 block">Rating</label>
                <Input type="number" min={1} max={5} step={0.1} value={form.rating} onChange={(e) => setForm((f) => ({ ...f, rating: Number(e.target.value) }))} className="bg-secondary/50 font-body" />
              </div>
              <div className="md:col-span-2">
                <label className="font-body text-sm font-medium text-foreground mb-1 block">Bio</label>
                <textarea value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} rows={2} className="w-full rounded-lg bg-secondary/50 border border-border p-3 font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div className="flex items-center gap-3 md:col-span-2">
                <label className="font-body text-sm font-medium text-foreground">Available for Booking</label>
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, is_available: !f.is_available }))}
                  className={`w-12 h-6 rounded-full transition-colors relative ${form.is_available ? "bg-primary" : "bg-muted"}`}
                >
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${form.is_available ? "left-7" : "left-1"}`} />
                </button>
                <span className={`font-body text-xs ${form.is_available ? "text-primary" : "text-muted-foreground"}`}>
                  {form.is_available ? "Available" : "Unavailable"}
                </span>
              </div>
              <div>
                <label className="font-body text-sm font-medium text-foreground mb-1 block">Specializations</label>
                <div className="flex gap-2">
                  <Input value={specInput} onChange={(e) => setSpecInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSpec())} placeholder="Add specialization" className="bg-secondary/50 font-body" />
                  <Button type="button" size="sm" onClick={addSpec} variant="outline">+</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.specializations.map((s, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-body flex items-center gap-1">
                      {s}
                      <button onClick={() => setForm((f) => ({ ...f, specializations: f.specializations.filter((_, j) => j !== i) }))}><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={cancel} className="font-body">Cancel</Button>
              <Button onClick={handleSave} className="bg-gradient-gold text-primary-foreground font-body gap-2">
                <Save className="w-4 h-4" /> {isAdding ? "Add Pujari" : "Save Changes"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="text-center py-16 text-muted-foreground font-body">Loading...</div>
      ) : (
        <div className="space-y-3">
          {pujaris.map((p, i) => (
            <motion.div
              key={String(p.id)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-4 p-4 bg-card rounded-xl shadow-card border border-border hover:border-primary/20 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-display text-sm font-semibold text-foreground truncate">{getPujariName(p)}</h4>
                  <span className={`text-xs font-body px-2 py-0.5 rounded-full ${isPujariAvailable(p) ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    {isPujariAvailable(p) ? "Available" : "Unavailable"}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <span className="font-body text-xs text-muted-foreground">{p.experience}</span>
                  <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-gold text-gold" /><span className="font-body text-xs">{p.rating}</span></span>
                  {(p.specializations || []).length > 0 && (
                    <span className="font-body text-xs text-muted-foreground">{p.specializations.slice(0, 2).join(", ")}</span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleEdit(p)} className="p-2 rounded-lg hover:bg-secondary transition-colors">
                  <Pencil className="w-4 h-4 text-muted-foreground" />
                </motion.button>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleDelete(p.id)} className="p-2 rounded-lg hover:bg-destructive/10 transition-colors">
                  <Trash2 className="w-4 h-4 text-destructive" />
                </motion.button>
              </div>
            </motion.div>
          ))}
          {pujaris.length === 0 && !loading && (
            <div className="text-center py-16 text-muted-foreground font-body">No pujaris added yet.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPujari;
