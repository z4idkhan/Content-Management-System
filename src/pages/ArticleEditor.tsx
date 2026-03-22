import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  articlesApi,
  categoriesApi,
  type Category,
  type Article,
} from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import {
  ArrowLeft,
  Bold,
  Italic,
  Heading2,
  List,
  Image as ImageIcon,
  Code,
} from "lucide-react";
import { toast } from "sonner";

// TIPTAP (FIXED)
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";

// SHADCN SELECT
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const ArticleEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const isEdit = Boolean(id);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // =========================
  // EDITOR (SAFE)
  // =========================
  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExtension,
      Placeholder.configure({
        placeholder: "Start writing...",
      }),
    ],
    content: "<p></p>",
    immediatelyRender: false,
  });

  // =========================
  // LOAD DATA (FIXED)
  // =========================
  useEffect(() => {
    if (!editor) return;

    const loadData = async () => {
      try {
        setInitialLoading(true);

        const res = await categoriesApi.getAll();

        // ✅ FIX: normalize response
        const cats: Category[] = Array.isArray(res)
          ? res
          : (res as any)?.data ||
            (res as any)?.categories ||
            [];

        setCategories(cats);

        if (isEdit && id) {
          const articleRes = await articlesApi.getById(id);

          if (!articleRes || typeof articleRes !== "object") {
            toast.error("Article not found");
            navigate("/articles");
            return;
          }

          const article: Article =
            (articleRes as any)?.data || articleRes;

          setTitle(article.title || "");
          setCategory(article.category || "");
          setStatus(article.status || "draft");

          editor?.commands.setContent(article.content || "<p></p>");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load data");
      } finally {
        setInitialLoading(false);
      }
    };

    loadData();
  }, [editor, id]);

  // =========================
  // SAVE
  // =========================
  const handleSave = async (saveStatus: "draft" | "published") => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        title: title.trim(),
        content: editor?.getHTML() || "<p></p>",
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
    } catch (err) {
      console.error(err);
      toast.error("Failed to save article");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOADING
  // =========================
  if (initialLoading) {
    return (
      <DashboardLayout>
        <div className="p-6 text-center">Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* HEADER */}
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
            className="px-4 py-2 bg-secondary rounded-md"
          >
            Save Draft
          </button>

          <button
            onClick={() => handleSave("published")}
            className="px-4 py-2 bg-gold text-black rounded-md"
          >
            {loading ? "Saving..." : "Publish"}
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex gap-6">
        {/* EDITOR */}
        <div className="flex-1 space-y-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Article title..."
            className="w-full px-4 py-3 bg-secondary border rounded-lg"
          />

          {/* TOOLBAR */}
          <div className="flex gap-2 border-b p-2">
            <button onClick={() => editor?.chain().focus().toggleBold().run()}>
              <Bold size={16} />
            </button>

            <button onClick={() => editor?.chain().focus().toggleItalic().run()}>
              <Italic size={16} />
            </button>

            <button
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 2 }).run()
              }
            >
              <Heading2 size={16} />
            </button>

            <button
              onClick={() =>
                editor?.chain().focus().toggleBulletList().run()
              }
            >
              <List size={16} />
            </button>

            <button
              onClick={() =>
                editor?.chain().focus().toggleCodeBlock().run()
              }
            >
              <Code size={16} />
            </button>

            <button
              onClick={() => {
                const url = prompt("Enter image URL");
                if (url) {
                  editor?.chain().focus().setImage({ src: url }).run();
                }
              }}
            >
              <ImageIcon size={16} />
            </button>
          </div>

          {/* EDITOR */}
          {editor && (
            <EditorContent
              editor={editor}
              className="min-h-[400px] p-4 border rounded"
            />
          )}
        </div>

        {/* SIDEBAR */}
        <div className="w-[300px] space-y-4">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>

            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.name}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <p>Author: {user?.name}</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ArticleEditor;