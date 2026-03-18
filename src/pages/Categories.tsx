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
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    description: "",
    color: "#3b82f6",
  });

  // =========================
  // FETCH
  // =========================
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await categoriesApi.getAll();
        setCategories(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // =========================
  // FILTER
  // =========================
  const filtered = categories.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase())
  );

  // =========================
  // OPEN MODALS
  // =========================
  const openNew = () => {
    setEditId(null);
    setForm({ name: "", description: "", color: "#3b82f6" });
    setShowModal(true);
  };

  const openEdit = (c: Category) => {
    setEditId(c.id);
    setForm({
      name: c.name,
      description: c.description || "",
      color: c.color || "#3b82f6",
    });
    setShowModal(true);
  };

  // =========================
  // SAVE (FIXED)
  // =========================
  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }

    try {
      if (editId) {
        const updated = await categoriesApi.update(editId, form);

        setCategories((prev) =>
          prev.map((c) => (c.id === editId ? updated : c))
        );

        toast.success("Category updated");
      } else {
        const created = await categoriesApi.create(form);

        setCategories((prev) => [...prev, created]);

        toast.success("Category created");
      }

      setShowModal(false);
    } catch (err) {
      console.error(err);
      toast.error("Save failed");
    }
  };

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (id: string) => {
    try {
      await categoriesApi.delete(id);

      setCategories((prev) => prev.filter((c) => c.id !== id));

      toast.success("Category deleted");
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 text-center text-muted-foreground">
          Loading categories...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-muted-foreground text-sm">
            Organize your content with categories
          </p>
        </div>

        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-white"
        >
          <Plus size={16} /> New Category
        </button>
      </div>

      {/* SEARCH */}
      <div className="relative max-w-sm mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search categories..."
          className="w-full pl-9 pr-4 py-2 border rounded-md"
        />
        <FolderOpen
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2"
        />
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((c) => (
          <div key={c.id} className="border rounded-lg p-5">
            <div className="flex justify-between mb-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: c.color }}
                />
                <h3 className="font-semibold">{c.name}</h3>
              </div>

              <div className="flex gap-1">
                <button onClick={() => openEdit(c)}>
                  <Edit size={13} />
                </button>

                <button onClick={() => handleDelete(c.id)}>
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-3">
              {c.description}
            </p>

            <p className="text-xs text-muted-foreground">
              📄 {c.articleCount || 0} articles
            </p>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center p-6">No categories found</div>
      )}
    </DashboardLayout>
  );
};

export default Categories;