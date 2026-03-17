import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { tagsApi, type Tag } from "@/lib/api";
import { Plus, X, Search } from "lucide-react";
import { toast } from "sonner";

const Tags = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [search, setSearch] = useState("");
  const [newTag, setNewTag] = useState("");
  const [showInput, setShowInput] = useState(false);

  useEffect(() => { tagsApi.getAll().then(setTags); }, []);

  const filtered = tags.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = async () => {
    if (!newTag.trim()) return;
    if (tags.some((t) => t.name.toLowerCase() === newTag.toLowerCase())) { toast.error("Tag already exists"); return; }
    const created = await tagsApi.create(newTag.trim());
    setTags((prev) => [...prev, created]);
    setNewTag("");
    setShowInput(false);
    toast.success("Tag created");
  };

  const handleDelete = async (id: string) => {
    await tagsApi.delete(id);
    setTags((prev) => prev.filter((t) => t.id !== id));
    toast.success("Tag deleted");
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tags</h1>
          <p className="text-muted-foreground text-sm">Label and organize articles with tags</p>
        </div>
        <button onClick={() => setShowInput(true)} className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground font-medium text-sm hover:bg-gold-hover transition-colors">
          <Plus size={16} /> New Tag
        </button>
      </div>

      <div className="relative max-w-sm mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tags..."
          className="w-full pl-9 pr-4 py-2 rounded-md bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
      </div>

      {showInput && (
        <div className="flex items-center gap-2 mb-6 animate-fade-in">
          <input value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="Tag name..."
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            className="px-3 py-2 rounded-md bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            autoFocus />
          <button onClick={handleAdd} className="px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-gold-hover transition-colors">Add</button>
          <button onClick={() => { setShowInput(false); setNewTag(""); }} className="p-2 text-muted-foreground hover:text-foreground"><X size={16} /></button>
        </div>
      )}

      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex flex-wrap gap-2">
          {filtered.map((t) => (
            <div key={t.id} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary border border-border group hover:border-primary/50 transition-colors">
              <span className="text-sm text-foreground">{t.name}</span>
              <span className="text-xs text-muted-foreground">{t.articleCount}</span>
              <button onClick={() => handleDelete(t.id)} className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                <X size={12} />
              </button>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-muted-foreground text-sm">No tags found</p>}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Tags;
