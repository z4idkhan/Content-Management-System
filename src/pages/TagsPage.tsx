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
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH TAGS (FIXED)
  // =========================
  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);

        const data = await tagsApi.getAll(); // ✅ FIXED

        setTags(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load tags");
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  // =========================
  // FILTER
  // =========================
  const filtered = tags.filter((t) =>
    t.name?.toLowerCase().includes(search.toLowerCase())
  );

  // =========================
  // ADD TAG (FIXED)
  // =========================
  const handleAdd = async () => {
    if (!newTag.trim()) return;

    if (
      tags.some(
        (t) => t.name.toLowerCase() === newTag.toLowerCase()
      )
    ) {
      toast.error("Tag already exists");
      return;
    }

    try {
      const created = await tagsApi.create(newTag.trim()); // ✅ FIXED

      setTags((prev) => [...prev, created]);

      setNewTag("");
      setShowInput(false);

      toast.success("Tag created");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create tag");
    }
  };

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (id: string) => {
    try {
      await tagsApi.delete(id);

      setTags((prev) => prev.filter((t) => t.id !== id));

      toast.success("Tag deleted");
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  // =========================
  // LOADING STATE
  // =========================
  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 text-center text-muted-foreground">
          Loading tags...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Tags</h1>
          <p className="text-muted-foreground text-sm">
            Label and organize articles with tags
          </p>
        </div>

        <button
          onClick={() => setShowInput(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-white"
        >
          <Plus size={16} /> New Tag
        </button>
      </div>

      {/* SEARCH */}
      <div className="relative max-w-sm mb-6">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2"
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tags..."
          className="w-full pl-9 pr-4 py-2 border rounded-md"
        />
      </div>

      {/* ADD INPUT */}
      {showInput && (
        <div className="flex gap-2 mb-6">
          <input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Tag name..."
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            className="px-3 py-2 border rounded-md"
            autoFocus
          />

          <button
            onClick={handleAdd}
            className="px-3 py-2 bg-blue-500 text-white rounded"
          >
            Add
          </button>

          <button
            onClick={() => {
              setShowInput(false);
              setNewTag("");
            }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* TAGS */}
      <div className="border rounded-lg p-6">
        <div className="flex flex-wrap gap-2">
          {filtered.map((t) => (
            <div
              key={t.id}
              className="flex items-center gap-2 px-3 py-1.5 border rounded-full"
            >
              <span>{t.name}</span>
              <span className="text-xs text-gray-500">
                {t.articleCount || 0}
              </span>

              <button onClick={() => handleDelete(t.id)}>
                <X size={12} />
              </button>
            </div>
          ))}

          {filtered.length === 0 && (
            <p className="text-gray-500 text-sm">
              No tags found
            </p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Tags;