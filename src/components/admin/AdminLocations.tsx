import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Save, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { locationsApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Location {
  id: number | string;
  name: string;
  state?: string;
  is_active?: boolean;
}

const AdminLocations = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [newState, setNewState] = useState("");
  const [editingId, setEditingId] = useState<number | string | null>(null);
  const [editName, setEditName] = useState("");
  const [editState, setEditState] = useState("");
  const { toast } = useToast();

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const data = await locationsApi.adminGetAll();
      const list = Array.isArray(data) ? data : (data as any)?.locations ?? (data as any)?.data ?? [];
      setLocations(list);
    } catch {
      const data = await locationsApi.getAll().catch(() => []);
      setLocations(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const add = async () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    try {
      await locationsApi.adminCreate({ name: trimmed, state: newState.trim() });
      toast({ title: "Location added" });
      setNewName("");
      setNewState("");
      await refresh();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const remove = async (id: number | string) => {
    if (!window.confirm("Remove this location?")) return;
    try {
      await locationsApi.adminDelete(id);
      toast({ title: "Location deleted" });
      await refresh();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const startEdit = (loc: Location) => {
    setEditingId(loc.id);
    setEditName(loc.name);
    setEditState(loc.state || "");
  };

  const saveEdit = async () => {
    if (editingId === null) return;
    try {
      await locationsApi.adminUpdate(editingId, { name: editName.trim(), state: editState.trim() });
      toast({ title: "Location updated" });
      setEditingId(null);
      await refresh();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground">Location Master</h2>
        <span className="font-body text-sm text-muted-foreground">{locations.length} locations</span>
      </div>

      <div className="bg-card rounded-2xl shadow-card border border-border p-6 mb-6">
        <h3 className="font-display text-base font-semibold text-foreground mb-3">Add New Location</h3>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} placeholder="City name..." className="pl-10 bg-secondary/50 font-body" />
          </div>
          <Input value={newState} onChange={(e) => setNewState(e.target.value)} placeholder="State (optional)" className="bg-secondary/50 font-body max-w-[200px]" />
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button onClick={add} className="bg-gradient-gold text-primary-foreground font-body gap-2">
              <Plus className="w-4 h-4" /> Add
            </Button>
          </motion.div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-muted-foreground font-body">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <AnimatePresence>
            {locations.map((loc, idx) => (
              <motion.div
                key={String(loc.id)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.02 }}
                className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border hover:border-primary/20 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                {editingId === loc.id ? (
                  <div className="flex-1 flex gap-2">
                    <Input value={editName} onChange={(e) => setEditName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && saveEdit()} className="flex-1 h-8 text-sm font-body bg-secondary/50" autoFocus />
                  </div>
                ) : (
                  <div className="flex-1">
                    <span className="font-body text-sm text-foreground">{loc.name}</span>
                    {loc.state && <span className="font-body text-xs text-muted-foreground ml-2">({loc.state})</span>}
                  </div>
                )}
                <div className="flex gap-1">
                  {editingId === loc.id ? (
                    <>
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={saveEdit} className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors">
                        <Save className="w-3.5 h-3.5" />
                      </motion.button>
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setEditingId(null)} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
                        <X className="w-3.5 h-3.5 text-muted-foreground" />
                      </motion.button>
                    </>
                  ) : (
                    <>
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => startEdit(loc)} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
                        <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                      </motion.button>
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => remove(loc.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors">
                        <Trash2 className="w-3.5 h-3.5 text-destructive" />
                      </motion.button>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {locations.length === 0 && !loading && (
        <div className="text-center py-16 text-muted-foreground font-body">No locations added yet.</div>
      )}
    </div>
  );
};

export default AdminLocations;
