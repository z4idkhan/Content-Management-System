import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { categoriesApi, type Category } from "@/lib/api";
import { Plus, Edit, Trash2, X, FolderOpen } from "lucide-react";
import { toast } from "sonner";

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", description: "", color: "#3b82f6" });

  useEffect(() => { categoriesApi.getAll().then(setCategories); }, []);

  const filtered = categories.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  const openNew = () => { setEditId(null); setForm({ name: "", description: "", color: "#3b82f6" }); setShowModal(true); };
  const openEdit = (c: Category) => { setEditId(c.id); setForm({ name: c.name, description: c.description, color: c.color }); setShowModal(true); };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    if (editId) {
      const updated = await categoriesApi.update(editId, form);
      setCategories((prev) => prev.map((c) => (c.id === editId ? updated : c)));
      toast.success("Category updated");
    } else {
      const created = await categoriesApi.create(form);
      setCategories((prev) => [...prev, created]);
      toast.success("Category created");
    }
    setShowModal(false);
  };

  const handleDelete = async (id: string) => {
    await categoriesApi.delete(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
    toast.success("Category deleted");
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Categories</h1>
          <p className="text-muted-foreground text-sm">Organize your content with categories</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground font-medium text-sm hover:bg-gold-hover transition-colors">
          <Plus size={16} /> New Category
        </button>
      </div>

      <div className="relative max-w-sm mb-6">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search categories..."
          className="w-full pl-9 pr-4 py-2 rounded-md bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
        <FolderOpen size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((c) => (
          <div key={c.id} className="bg-card border border-border rounded-lg p-5 hover:border-primary/50 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />
                <h3 className="font-semibold text-foreground">{c.name}</h3>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(c)} className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground"><Edit size={13} /></button>
                <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive"><Trash2 size={13} /></button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{c.description}</p>
            <p className="text-xs text-muted-foreground">📄 {c.articleCount} articles</p>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">{editId ? "Edit Category" : "New Category"}</h2>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-md bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
                  className="w-full px-3 py-2 rounded-md bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Color</label>
                <input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="w-10 h-10 rounded cursor-pointer" />
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-md bg-secondary text-foreground text-sm">Cancel</button>
                <button onClick={handleSave} className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-gold-hover transition-colors">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Categories;
