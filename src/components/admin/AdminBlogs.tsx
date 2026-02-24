import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Save, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAdmin } from "@/context/AdminContext";
import { useToast } from "@/hooks/use-toast";
import { toArray } from "@/lib/normalize";
import { buildFormData } from "@/lib/formdata";
import ImageUploadField from "./ImageUploadField";

const emptyForm = {
  title: "", excerpt: "", full_content: "", category: "Rituals", image_url: "",
  author: "", date: new Date().toISOString().split("T")[0], read_time: "5 min read", tags: [] as string[],
};

const AdminBlogs = () => {
  const { blogs, addBlog, updateBlog, deleteBlog } = useAdmin();
  const [editing, setEditing] = useState<string | number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [tagInput, setTagInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleEdit = (blog: any) => {
    setEditing(blog.id);
    setForm({
      title: blog.title || "",
      excerpt: blog.excerpt || "",
      full_content: blog.full_content || blog.content || "",
      category: blog.category || "Rituals",
      image_url: blog.image_url || blog.image || "",
      author: blog.author || "",
      date: blog.date || new Date().toISOString().split("T")[0],
      read_time: blog.read_time || blog.readTime || "5 min read",
      tags: toArray(blog.tags),
    });
    setImageFile(null);
    setIsAdding(false);
  };

  const handleSave = async () => {
    try {
      const body = imageFile ? buildFormData(form, imageFile) : form;
      if (isAdding) {
        await addBlog(body);
        toast({ title: "Blog published successfully" });
      } else if (editing) {
        await updateBlog(editing, body);
        toast({ title: "Blog updated successfully" });
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
    if (!window.confirm("Delete this blog post?")) return;
    try {
      await deleteBlog(id);
      toast({ title: "Blog deleted" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const startAdd = () => { setIsAdding(true); setEditing("new"); setForm(emptyForm); setImageFile(null); };
  const cancel = () => { setEditing(null); setIsAdding(false); setForm(emptyForm); setImageFile(null); };

  const addTag = () => {
    if (tagInput.trim()) {
      setForm((f) => ({ ...f, tags: [...f.tags, tagInput.trim()] }));
      setTagInput("");
    }
  };

  const getImage = (b: any) => b.image_url || b.image || "";
  const getDate = (b: any) => b.date || b.created_at || "";
  const getReadTime = (b: any) => b.read_time || b.readTime || "";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground">Manage Blog Posts</h2>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button onClick={startAdd} className="bg-gradient-gold text-primary-foreground font-body gap-2">
            <Plus className="w-4 h-4" /> New Post
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
              <h3 className="font-display text-lg font-semibold text-foreground">{isAdding ? "New Blog Post" : "Edit Post"}</h3>
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
              <div className="md:col-span-2">
                <label className="font-body text-sm font-medium text-foreground mb-1 block">Title</label>
                <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="bg-secondary/50 font-body" />
              </div>
              <div>
                <label className="font-body text-sm font-medium text-foreground mb-1 block">Category</label>
                <Input value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="bg-secondary/50 font-body" />
              </div>
              <div>
                <label className="font-body text-sm font-medium text-foreground mb-1 block">Author</label>
                <Input value={form.author} onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))} className="bg-secondary/50 font-body" />
              </div>
              <div>
                <label className="font-body text-sm font-medium text-foreground mb-1 block">Date</label>
                <Input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} className="bg-secondary/50 font-body" />
              </div>
              <div>
                <label className="font-body text-sm font-medium text-foreground mb-1 block">Read Time</label>
                <Input value={form.read_time} onChange={(e) => setForm((f) => ({ ...f, read_time: e.target.value }))} className="bg-secondary/50 font-body" />
              </div>
              <div className="md:col-span-2">
                <label className="font-body text-sm font-medium text-foreground mb-1 block">Excerpt</label>
                <Textarea value={form.excerpt} onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))} rows={2} className="bg-secondary/50 font-body" />
              </div>
              <div className="md:col-span-2">
                <label className="font-body text-sm font-medium text-foreground mb-1 block">Full Content</label>
                <Textarea value={form.full_content} onChange={(e) => setForm((f) => ({ ...f, full_content: e.target.value }))} rows={6} className="bg-secondary/50 font-body" placeholder="Use double line breaks for paragraphs..." />
              </div>
              <div>
                <label className="font-body text-sm font-medium text-foreground mb-1 block">Tags</label>
                <div className="flex gap-2">
                  <Input value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="Add tag" className="bg-secondary/50 font-body" onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())} />
                  <Button type="button" size="sm" onClick={addTag} variant="outline">+</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-body flex items-center gap-1">
                      {tag}
                      <button onClick={() => setForm((f) => ({ ...f, tags: f.tags.filter((_, j) => j !== i) }))}><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={cancel} className="font-body">Cancel</Button>
              <Button onClick={handleSave} className="bg-gradient-gold text-primary-foreground font-body gap-2">
                <Save className="w-4 h-4" /> {isAdding ? "Publish" : "Save"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {blogs.map((blog: any, i: number) => (
          <motion.div
            key={String(blog.id)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="flex items-center gap-4 p-4 bg-card rounded-xl shadow-card border border-border hover:border-primary/20 transition-colors"
          >
            <img src={getImage(blog)} alt={blog.title} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h4 className="font-display text-sm font-semibold text-foreground truncate">{blog.title}</h4>
              <div className="flex items-center gap-3 mt-1">
                <span className="font-body text-xs text-muted-foreground">{blog.category}</span>
                {getDate(blog) && (
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span className="font-body text-xs">{new Date(getDate(blog)).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                  </span>
                )}
                <span className="font-body text-xs text-muted-foreground">{blog.author}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleEdit(blog)} className="p-2 rounded-lg hover:bg-secondary transition-colors">
                <Pencil className="w-4 h-4 text-muted-foreground" />
              </motion.button>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleDelete(blog.id)} className="p-2 rounded-lg hover:bg-destructive/10 transition-colors">
                <Trash2 className="w-4 h-4 text-destructive" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminBlogs;
