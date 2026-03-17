import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { articlesApi, categoriesApi, type Article, type Category } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Bold, Italic, Heading2, List, Link as LinkIcon, Image, Code } from "lucide-react";
import { toast } from "sonner";

const ArticleEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const isEdit = !!id;
  const editorRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    categoriesApi.getAll().then(setCategories);
    if (isEdit) {
      articlesApi.getById(id).then((a) => {
        if (a) {
          setTitle(a.title);
          setCategory(a.category);
          setStatus(a.status);
          if (editorRef.current) {
            editorRef.current.innerHTML = a.content;
          }
        }
      });
    }
  }, [id, isEdit]);

  // Set initial empty paragraph for new articles
  useEffect(() => {
    if (!isEdit && editorRef.current && !initializedRef.current) {
      initializedRef.current = true;
      editorRef.current.innerHTML = "<p><br></p>";
      editorRef.current.focus();
    }
  }, [isEdit]);

  const execCommand = useCallback((cmd: string, value?: string) => {
    document.execCommand(cmd, false, value);
    editorRef.current?.focus();
  }, []);

  const handleSave = async (saveStatus: "draft" | "published") => {
    if (!title.trim()) { toast.error("Title is required"); return; }
    setLoading(true);
    const htmlContent = editorRef.current?.innerHTML || "";
    try {
      if (isEdit) {
        await articlesApi.update(id, { title, content: htmlContent, category, status: saveStatus });
        toast.success("Article updated");
      } else {
        await articlesApi.create({ title, content: htmlContent, category: category || "Uncategorized", status: saveStatus, author: user?.name || "Unknown" });
        toast.success("Article created");
      }
      navigate("/articles");
    } catch { toast.error("Failed to save"); }
    setLoading(false);
  };

  const toolbarButtons = [
    { icon: Bold, action: () => execCommand("bold"), label: "Bold" },
    { icon: Italic, action: () => execCommand("italic"), label: "Italic" },
    { icon: Heading2, action: () => execCommand("formatBlock", "h2"), label: "Heading" },
    { icon: List, action: () => execCommand("insertUnorderedList"), label: "List" },
    { icon: Code, action: () => execCommand("formatBlock", "pre"), label: "Code" },
    { icon: LinkIcon, action: () => { const url = prompt("Enter URL:"); if (url) execCommand("createLink", url); }, label: "Link" },
    { icon: Image, action: () => { const url = prompt("Enter image URL:"); if (url) execCommand("insertImage", url); }, label: "Image" },
  ];

  return (
    <DashboardLayout>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate("/articles")} className="p-2 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">{isEdit ? "Edit Article" : "New Article"}</h1>
          <p className="text-muted-foreground text-sm">
            {isEdit ? "Update your article content" : "Create a new article for your CMS"}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => handleSave("draft")} disabled={loading}
            className="px-4 py-2 rounded-md bg-secondary text-foreground text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50">
            Save Draft
          </button>
          <button onClick={() => handleSave("published")} disabled={loading}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-gold-hover transition-colors disabled:opacity-50">
            {loading ? "Saving..." : "Publish"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Article title..."
            className="w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground text-lg font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />

          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="flex items-center gap-1 p-2 border-b border-border bg-secondary/50">
              {toolbarButtons.map(({ icon: Icon, action, label }) => (
                <button key={label} onClick={(e) => { e.preventDefault(); action(); }} title={label}
                  className="p-2 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                  <Icon size={16} />
                </button>
              ))}
            </div>
            <div
              ref={editorRef}
              contentEditable
              dir="ltr"
              className="min-h-[400px] p-6 text-foreground focus:outline-none prose prose-invert max-w-none
                [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-4 [&_h2]:mb-2
                [&_p]:text-foreground [&_p]:mb-2
                [&_a]:text-primary [&_a]:underline
                [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:text-foreground
                [&_pre]:bg-secondary [&_pre]:p-3 [&_pre]:rounded [&_pre]:text-sm [&_pre]:text-foreground
                [&_code]:bg-secondary [&_code]:px-1 [&_code]:rounded [&_code]:text-sm"
              suppressContentEditableWarning
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <label className="block text-sm font-medium text-foreground mb-2">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <label className="block text-sm font-medium text-foreground mb-2">Status</label>
            <div className="flex gap-2">
              {(["draft", "published"] as const).map((s) => (
                <button key={s} onClick={() => setStatus(s)}
                  className={`flex-1 px-3 py-2 rounded-md text-sm font-medium capitalize transition-colors ${status === s ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <label className="block text-sm font-medium text-foreground mb-2">Author</label>
            <p className="text-sm text-muted-foreground">{user?.name || "Unknown"}</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ArticleEditor;
