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

  useEffect(() => {
    articlesApi.getAll().then((all) => {
      // Only show articles created by the logged-in user
      const myArticles = all.filter((a) => a.author === user?.name);
      setArticles(myArticles);
    });
  }, [user]);

  const filtered = articles.filter((a) => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || a.status === filter;
    return matchSearch && matchFilter;
  });

  const handleDelete = async (id: string) => {
    await articlesApi.delete(id);
    setArticles((prev) => prev.filter((a) => a.id !== id));
    toast.success("Article deleted");
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Articles</h1>
          <p className="text-muted-foreground text-sm">Manage your content library</p>
        </div>
        <button onClick={() => navigate("/articles/new")} className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground font-medium text-sm hover:bg-gold-hover transition-colors">
          <Plus size={16} /> New Article
        </button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search articles..."
            className="w-full pl-9 pr-4 py-2 rounded-md bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div className="flex gap-1 bg-secondary rounded-md p-0.5">
          {(["all", "published", "draft"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded text-xs font-medium capitalize transition-colors ${filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase">Title</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase">Category</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase">Status</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase">Author</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-muted-foreground uppercase">Views</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-muted-foreground uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors">
                <td className="px-5 py-3">
                  <p className="text-sm font-medium text-foreground">{a.title}</p>
                </td>
                <td className="px-5 py-3 text-sm text-muted-foreground">{a.category}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${a.status === "published" ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"}`}>
                    {a.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-sm text-muted-foreground">{a.author}</td>
                <td className="px-5 py-3 text-sm text-muted-foreground text-right">{a.views.toLocaleString()}</td>
                <td className="px-5 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => navigate(`/articles/edit/${a.id}`)} className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                      <Edit size={14} />
                    </button>
                    <button onClick={() => handleDelete(a.id)} className="p-1.5 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">No articles found</div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Articles;
