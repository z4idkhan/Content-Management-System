import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { articlesApi, type Article } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Search, Plus, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";

const Articles = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [articles, setArticles] = useState<Article[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH ARTICLES (FIXED)
  // =========================
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);

        const res = await articlesApi.getAll();

        // 🔥 HANDLE BOTH API FORMATS
        const all = res || [];

        // 🔥 IMPORTANT FIX:
        // Only filter if user exists
        let myArticles = all;

        if (user?.name) {
          myArticles = all.filter((a: Article) => a.author === user.name);
        }

        setArticles(myArticles);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load articles");
      } finally {
        setLoading(false);
      }
    };

    // 🔥 WAIT FOR USER TO LOAD
    if (user !== undefined) {
      fetchArticles();
    }
  }, [user]);

  // =========================
  // FILTER LOGIC
  // =========================
  const filtered = articles.filter((a) => {
    const matchSearch = a.title?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || a.status === filter;
    return matchSearch && matchFilter;
  });

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (id: string) => {
    try {
      await articlesApi.delete(id);
      setArticles((prev) => prev.filter((a) => a.id !== id));
      toast.success("Article deleted");
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
          Loading articles...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Articles</h1>
          <p className="text-muted-foreground text-sm">
            Manage your content library
          </p>
        </div>

        <button
          onClick={() => navigate("/articles/new")}
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-white"
        >
          <Plus size={16} /> New Article
        </button>
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex items-center gap-4 mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search articles..."
          className="px-4 py-2 border rounded-md"
        />

        <div className="flex gap-2">
          {(["all", "published", "draft"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded ${
                filter === f ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Author</th>
              <th>Views</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((a) => (
              <tr key={a.id}>
                <td>{a.title}</td>
                <td>{a.category}</td>
                <td>{a.status}</td>
                <td>{a.author}</td>
                <td>{a.views}</td>

                <td>
                  <button onClick={() => navigate(`/articles/edit/${a.id}`)}>
                    <Edit size={14} />
                  </button>

                  <button onClick={() => handleDelete(a.id)}>
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center p-6">No articles found</div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Articles;