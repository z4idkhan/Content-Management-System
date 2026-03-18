import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  articlesApi,
  categoriesApi,
  type Category,
  type Article, // ✅ IMPORTANT
} from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import {
  ArrowLeft,
  Bold,
  Italic,
  Heading2,
  List,
  Link as LinkIcon,
  Image,
  Code,
} from "lucide-react";
import { toast } from "sonner";

const ArticleEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // ✅ FIXED
  const { user } = useAuth();

  const isEdit = Boolean(id);
  const editorRef = useRef<HTMLDivElement>(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // =========================
  // LOAD DATA
  // =========================
  useEffect(() => {
    const loadData = async () => {
      try {
        setInitialLoading(true);

        const cats = await categoriesApi.getAll();
        setCategories(cats ?? []);

        if (isEdit && id) {
          const article: Article = await articlesApi.getById(id);

          if (!article) {
            toast.error("Article not found");
            navigate("/articles");
            return;
          }

          setTitle(article.title ?? "");
          setCategory(article.category ?? "");
          setStatus(article.status ?? "draft");

          requestAnimationFrame(() => {
            if (editorRef.current) {
              editorRef.current.innerHTML =
                article.content ?? "<p><br></p>";
            }
          });
        } else {
          requestAnimationFrame(() => {
            if (editorRef.current) {
              editorRef.current.innerHTML = "<p><br></p>";
            }
          });
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load data");
      } finally {
        setInitialLoading(false);
      }
    };

    loadData();
  }, [id, isEdit, navigate]);

  // =========================
  // TEXT FORMATTING
  // =========================
  const execCommand = useCallback((cmd: string, value?: string) => {
    document.execCommand(cmd, false, value);
    editorRef.current?.focus();
  }, []);

  // =========================
  // SAVE HANDLER (CLEAN)
  // =========================
  const handleSave = async (saveStatus: "draft" | "published") => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    try {
      setLoading(true);

      const htmlContent =
        editorRef.current?.innerHTML || "<p><br></p>";

      const payload = {
        title: title.trim(),
        content: htmlContent,
        category: category || "Uncategorized",
        status: saveStatus,
        author: user?.name || "Unknown",
      };

      if (isEdit && id) {
        await articlesApi.update(id, payload);
        toast.success("Article updated");
      } else {
        await articlesApi.create(payload);
        toast.success("Article created");
      }

      navigate("/articles");
    } catch (err: any) {
      console.error(err);
      toast.error(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to save article"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // TOOLBAR
  // =========================
  const toolbarButtons = [
    { icon: Bold, action: () => execCommand("bold"), label: "Bold" },
    { icon: Italic, action: () => execCommand("italic"), label: "Italic" },
    {
      icon: Heading2,
      action: () => execCommand("formatBlock", "h2"),
      label: "Heading",
    },
    {
      icon: List,
      action: () => execCommand("insertUnorderedList"),
      label: "List",
    },
    {
      icon: Code,
      action: () => execCommand("formatBlock", "pre"),
      label: "Code",
    },
    {
      icon: LinkIcon,
      action: () => {
        const url = prompt("Enter URL:");
        if (url) execCommand("createLink", url);
      },
      label: "Link",
    },
    {
      icon: Image,
      action: () => {
        const url = prompt("Enter image URL:");
        if (url) execCommand("insertImage", url);
      },
      label: "Image",
    },
  ];

  // =========================
  // LOADING
  // =========================
  if (initialLoading) {
    return (
      <DashboardLayout>
        <div className="p-6 text-center text-muted-foreground">
          Loading editor...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/articles")}
          className="p-2 rounded-md hover:bg-secondary"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="flex-1">
          <h1 className="text-2xl font-bold">
            {isEdit ? "Edit Article" : "New Article"}
          </h1>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handleSave("draft")}
            disabled={loading}
            className="px-4 py-2 bg-secondary rounded-md"
          >
            Save Draft
          </button>

          <button
            onClick={() => handleSave("published")}
            disabled={loading}
            className="px-4 py-2 bg-primary text-white rounded-md"
          >
            {loading ? "Saving..." : "Publish"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Article title..."
            className="w-full px-4 py-3 border rounded-lg"
          />

          <div className="border rounded-lg overflow-hidden">
            <div className="flex gap-1 p-2 border-b">
              {toolbarButtons.map(({ icon: Icon, action, label }) => (
                <button
                  key={label}
                  onClick={(e) => {
                    e.preventDefault();
                    action();
                  }}
                  title={label}
                  className="p-2 hover:bg-gray-200 rounded"
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>

            <div
              ref={editorRef}
              contentEditable
              className="min-h-[400px] p-6 outline-none"
              suppressContentEditableWarning
            />
          </div>
        </div>

        <div className="space-y-4">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <div>
            <p>Status:</p>
            {(["draft", "published"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`px-3 py-1 m-1 ${
                  status === s
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <p>Author: {user?.name || "Unknown"}</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ArticleEditor;