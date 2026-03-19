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
  Link as LinkIcon,
  Image as ImageIcon,
  Code,
} from "lucide-react";
import { toast } from "sonner";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Heading from "@tiptap/extension-heading";

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
  // TIPTAP EDITOR
  // =========================
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link,
      ImageExtension,
      Heading.configure({ levels: [1, 2, 3] }),
      Placeholder.configure({
        placeholder: "Start writing... Type '/' for commands",
      }),
    ],
    content: "<p></p>",
  });

  // =========================
  // LOAD DATA
  // =========================
  useEffect(() => {
    if (!editor) return;

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

          editor.commands.setContent(article.content || "<p></p>");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load data");
      } finally {
        setInitialLoading(false);
      }
    };

    loadData();
  }, [editor, id, isEdit, navigate]);

  // =========================
  // SLASH COMMAND
  // =========================
  const handleSlashCommand = (text: string) => {
    if (!editor) return;

    const cmd = text.trim().toLowerCase();

    if (cmd === "/h1") editor.chain().focus().toggleHeading({ level: 1 }).run();
    else if (cmd === "/h2") editor.chain().focus().toggleHeading({ level: 2 }).run();
    else if (cmd === "/bullet") editor.chain().focus().toggleBulletList().run();
    else if (cmd === "/code") editor.chain().focus().toggleCodeBlock().run();
    else if (cmd === "/quote") editor.chain().focus().toggleBlockquote().run();
  };

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

      const htmlContent = editor?.getHTML() || "<p></p>";

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
  if (initialLoading || !editor) {
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
        {/* EDITOR */}
        <div className="lg:col-span-3 space-y-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Article title..."
            className="w-full px-4 py-3 border rounded-lg"
          />

          <div className="border rounded-lg overflow-hidden">
            {/* TOOLBAR */}
            <div className="flex gap-2 p-2 border-b">
              <button onClick={() => editor.chain().focus().toggleBold().run()}>
                <Bold size={16} />
              </button>

              <button onClick={() => editor.chain().focus().toggleItalic().run()}>
                <Italic size={16} />
              </button>

              <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
                <Heading2 size={16} />
              </button>

              <button onClick={() => editor.chain().focus().toggleBulletList().run()}>
                <List size={16} />
              </button>

              <button onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
                <Code size={16} />
              </button>

              <button
                onClick={() => {
                  const url = prompt("Enter URL");
                  if (url) editor.chain().focus().setLink({ href: url }).run();
                }}
              >
                <LinkIcon size={16} />
              </button>

              <button
                onClick={() => {
                  const url = prompt("Enter image URL");
                  if (url) editor.chain().focus().setImage({ src: url }).run();
                }}
              >
                <ImageIcon size={16} />
              </button>
            </div>

            {/* EDITOR */}
            <EditorContent
              editor={editor}
              className="min-h-[400px] p-6 outline-none prose dark:prose-invert max-w-none"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const text = editor.getText();
                  const lines = text.split("\n");
                  const lastLine = lines[lines.length - 1];

                  if (lastLine.startsWith("/")) {
                    e.preventDefault();
                    handleSlashCommand(lastLine);

                    editor
                      .chain()
                      .focus()
                      .deleteRange({
                        from: editor.state.selection.from - lastLine.length,
                        to: editor.state.selection.from,
                      })
                      .run();
                  }
                }
              }}
            />
          </div>
        </div>

        {/* SIDEBAR */}
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