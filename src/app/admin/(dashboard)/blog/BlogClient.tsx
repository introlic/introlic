"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { 
  FileText, Trash2, Loader2, Sparkles, Terminal,
  Edit, Plus, Search, X, ArrowLeft, ArrowRight,
  CheckCircle, Clock, Lock, BookOpen, Layers, ChevronDown,
  Image as ImageIcon, Users, ToggleLeft, ToggleRight, Upload, AlertCircle,
  LayoutGrid, List, Columns, ExternalLink, Copy, CheckCheck,
  FolderPlus, Bold, Italic, Code, Table, ListOrdered,
  Heading1, Heading2, Heading3, Quote, Minus, Link2, Hash
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { parseMarkdown } from "@/components/blog/MarkdownRenderer";
import { allPosts } from "@/components/blog/BlogData";
import AdminDialog from "@/components/admin/AdminDialog";

// ─── Markdown Toolbar ─────────────────────────────────────────────────────────

type ToolbarAction = {
  label: string;
  icon: React.ElementType;
  prefix: string;
  suffix: string;
  placeholder: string;
  block?: boolean;
};

const TOOLBAR_ACTIONS: ToolbarAction[] = [
  { label: "H1", icon: Heading1, prefix: "# ", suffix: "", placeholder: "Heading 1", block: true },
  { label: "H2", icon: Heading2, prefix: "## ", suffix: "", placeholder: "Heading 2", block: true },
  { label: "H3", icon: Heading3, prefix: "### ", suffix: "", placeholder: "Heading 3", block: true },
  { label: "Bold", icon: Bold, prefix: "**", suffix: "**", placeholder: "bold text" },
  { label: "Italic", icon: Italic, prefix: "*", suffix: "*", placeholder: "italic text" },
  { label: "Code", icon: Code, prefix: "`", suffix: "`", placeholder: "code" },
  { label: "Link", icon: Link2, prefix: "[", suffix: "](url)", placeholder: "link text" },
  { label: "Quote", icon: Quote, prefix: "> ", suffix: "", placeholder: "blockquote", block: true },
  { label: "UL", icon: List, prefix: "- ", suffix: "", placeholder: "list item", block: true },
  { label: "OL", icon: ListOrdered, prefix: "1. ", suffix: "", placeholder: "list item", block: true },
  { label: "Rule", icon: Minus, prefix: "\n---\n", suffix: "", placeholder: "", block: true },
  { label: "Table", icon: Table, prefix: "| Column 1 | Column 2 | Column 3 |\n| :--- | :---: | ---: |\n| ", suffix: " | data | data |", placeholder: "data", block: true },
  { label: "Code Block", icon: Terminal, prefix: "```\n", suffix: "\n```", placeholder: "code block", block: true },
];

function MarkdownToolbar({ textareaRef, value, onChange }: {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  value: string;
  onChange: (val: string) => void;
}) {
  const insert = useCallback((action: ToolbarAction) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end);
    const insertText = selected || action.placeholder;
    const newText =
      value.slice(0, start) +
      action.prefix +
      insertText +
      action.suffix +
      value.slice(end);
    onChange(newText);
    requestAnimationFrame(() => {
      el.focus();
      const newStart = start + action.prefix.length;
      const newEnd = newStart + insertText.length;
      el.setSelectionRange(newStart, newEnd);
    });
  }, [textareaRef, value, onChange]);

  const lines = value.split("\n").length;
  const chars = value.length;
  const words = value.trim() ? value.trim().split(/\s+/).length : 0;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-wrap items-center gap-1 p-2 bg-[#0a0b10] border border-white/[0.08] rounded-xl">
        {TOOLBAR_ACTIONS.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={() => insert(action)}
            title={action.label}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:bg-[#00a3ff]/10 hover:border-[#00a3ff]/30 hover:text-[#00a3ff] text-gray-400 transition-all duration-150 cursor-pointer text-[10px] font-mono font-bold shrink-0"
          >
            <action.icon className="w-3 h-3" />
            <span className="hidden sm:inline">{action.label}</span>
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3 text-[9px] font-mono text-gray-600 px-1">
        <span>{lines} lines</span>
        <span>{words} words</span>
        <span>{chars} chars</span>
        <span className="ml-auto text-[#00a3ff]/40">Full Markdown Supported</span>
      </div>
    </div>
  );
}

interface FormDropdownProps {
  label: string;
  value: string;
  options: string[] | { value: string; label: string }[];
  onChange: (val: string) => void;
  placeholder?: string;
}

function FormDropdown({ label, value, options, onChange, placeholder = "Select Option..." }: FormDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  const optionList = useMemo(() => {
    return options.map(opt => typeof opt === "string" ? { value: opt, label: opt } : opt);
  }, [options]);
  const selectedLabel = optionList.find(o => o.value === value)?.label || value || placeholder;
  return (
    <div ref={ref} className="flex flex-col gap-1.5 relative w-full">
      {label && <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest font-mono">{label}</label>}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between bg-[#0a0a0a] border border-white/[0.08] hover:border-white/20 px-4 py-2.5 rounded-xl text-xs text-white text-left transition-all duration-300 cursor-pointer font-sans"
        style={{ borderColor: open ? "rgba(0,163,255,0.4)" : undefined }}
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-300 shrink-0 ${open ? 'rotate-180 text-[#00a3ff]' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 w-full bg-[#080808]/98 backdrop-blur-xl border border-white/[0.08] rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9)] z-50 max-h-48 overflow-y-auto custom-scrollbar"
          >
            {optionList.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-xs text-left transition-colors duration-150 cursor-pointer ${
                  value === opt.value ? "text-[#00a3ff] bg-[#00a3ff]/08 font-bold" : "text-gray-400 hover:text-white hover:bg-white/[0.03]"
                }`}
              >
                <span>{opt.label}</span>
                {value === opt.value && <div className="w-1.5 h-1.5 rounded-full bg-[#00a3ff]" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const CATEGORY_THEMES: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  Architecture: { bg: "bg-[#00a3ff]/10", text: "text-[#00a3ff]", border: "border-[#00a3ff]/20", dot: "bg-[#00a3ff]" },
  Engineering: { bg: "bg-sky-500/10", text: "text-sky-400", border: "border-sky-500/20", dot: "bg-sky-400" },
  Strategy: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20", dot: "bg-blue-400" },
  Privacy: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", dot: "bg-emerald-400" },
  "AI Research": { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20", dot: "bg-amber-400" },
  Infrastructure: { bg: "bg-teal-500/10", text: "text-teal-400", border: "border-teal-500/20", dot: "bg-teal-400" },
};

type Contributor = { name: string; role?: string };

const EMPTY_FORM = {
  title: "",
  slug: "",
  category: "Architecture",
  tag: "",
  date: "",
  readTime: "5 min read",
  excerpt: "",
  coverName: "CoverIntrolicDWaves",
  body: "",
  author: "",
  thumbnailUrl: "",
  showContributors: false,
  contributors: [] as Contributor[],
  status: "published",
};

export default function BlogClient() {
  const [isUploadingBlog, setIsUploadingBlog] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadLogs, setUploadLogs] = useState<string[]>([]);
  const [dialog, setDialog] = useState<{
    isOpen: boolean; type: "alert" | "confirm"; title: string; message: string;
    onConfirm?: () => void; severity?: "info" | "success" | "error" | "warning";
  }>({ isOpen: false, type: "alert", title: "", message: "" });

  const showAlertDialog = (title: string, message: string, severity: "info" | "success" | "error" | "warning" = "info") => {
    setDialog({ isOpen: true, type: "alert", title, message, severity });
  };
  const showConfirmDialog = (title: string, message: string, onConfirm: () => void, severity: "info" | "success" | "error" | "warning" = "warning") => {
    setDialog({ isOpen: true, type: "confirm", title, message, onConfirm, severity });
  };

  const [registeredAuthors, setRegisteredAuthors] = useState<any[]>([]);
  const [isCustomAuthor, setIsCustomAuthor] = useState(false);
  useEffect(() => {
    fetch("/api/authors").then(r => r.json()).then(d => { if (Array.isArray(d)) setRegisteredAuthors(d); }).catch(console.error);
  }, []);
  const authorOptions = useMemo(() => [
    ...registeredAuthors.map(a => ({ value: a.name, label: a.name })),
    { value: "__custom__", label: "Custom Author (Text)..." }
  ], [registeredAuthors]);

  // ── State ──────────────────────────────────────────────────────────────
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"overview" | "forge" | "categories">("overview");
  const [bodyTab, setBodyTab] = useState<"write" | "preview">("write");
  const [blogForm, setBlogForm] = useState({ ...EMPTY_FORM });
  const bodyTextRef = useRef<HTMLTextAreaElement | null>(null);

  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categoryForm, setCategoryForm] = useState({ name: "", slug: "" });

  // Thumbnail upload
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [isUploadingThumb, setIsUploadingThumb] = useState(false);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  // DB posts
  const [dbPosts, setDbPosts] = useState<any[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [deletedStaticIds, setDeletedStaticIds] = useState<string[]>([]);

  const [blogSearch, setBlogSearch] = useState("");
  const [blogCategoryFilter, setBlogCategoryFilter] = useState("All");
  const [blogSort, setBlogSort] = useState("newest");
  const [blogLayout, setBlogLayout] = useState<"grid" | "linewise" | "split">("grid");
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);

  // Categories
  const [registeredCategories, setRegisteredCategories] = useState<any[]>([]);
  const [isSavingCategory, setIsSavingCategory] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [categoryViewLayout, setCategoryViewLayout] = useState<"cards" | "table">("cards");
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const handleCopySlug = (slug: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(slug);
      setCopiedSlug(slug);
      setTimeout(() => setCopiedSlug(null), 2000);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories?type=blog");
      if (res.ok) {
        const data = await res.json();
        setRegisteredCategories(data || []);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const handleCreateCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setIsSavingCategory(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName.trim(), type: "blog" })
      });
      if (res.ok) {
        const newCat = await res.json();
        setBlogForm(prev => ({ ...prev, category: newCat.name }));
        await fetchCategories();
        setShowAddCategoryModal(false);
        setNewCategoryName("");
      } else {
        const err = await res.json();
        showAlertDialog("Error", err.error || "Failed to create category", "error");
      }
    } catch {
      showAlertDialog("Error", "Could not connect to the server", "error");
    } finally {
      setIsSavingCategory(false);
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) return;
    setIsSavingCategory(true);
    try {
      let res: Response;
      if (editingCategoryId) {
        res = await fetch(`/api/categories/${editingCategoryId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(categoryForm),
        });
      } else {
        res = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...categoryForm, type: "blog" }),
        });
      }
      if (res.ok) {
        showAlertDialog(
          editingCategoryId ? "Category Updated" : "Category Created",
          editingCategoryId ? `"${categoryForm.name}" updated successfully.` : `"${categoryForm.name}" created successfully.`,
          "success"
        );
        setEditingCategoryId(null);
        setCategoryForm({ name: "", slug: "" });
        await fetchCategories();
      } else {
        const err = await res.json();
        showAlertDialog("Error", err.error || "Failed to save category.", "error");
      }
    } catch {
      showAlertDialog("Network Error", "Could not connect to the server.", "error");
    } finally {
      setIsSavingCategory(false);
    }
  };

  const handleDeleteCategory = (id: string) => {
    const cat = registeredCategories.find(c => c.id === id);
    if (!cat) return;
    const count = mergedBlogPosts.filter(p => p.category === cat.name).length;
    if (count > 0) {
      showAlertDialog(
        "Cannot Delete",
        `Category "${cat.name}" is in use by ${count} blog posts. Please reassign those posts before deleting.`,
        "error"
      );
      return;
    }

    showConfirmDialog(
      "Confirm Deletion",
      `Are you sure you want to delete the category "${cat.name}"?`,
      async () => {
        try {
          const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
          if (res.ok) {
            showAlertDialog("Category Deleted", "Category has been removed.", "success");
            await fetchCategories();
          } else {
            const err = await res.json();
            showAlertDialog("Error", err.error || "Failed to delete category.", "error");
          }
        } catch {
          showAlertDialog("Network Error", "Could not connect to the server.", "error");
        }
      },
      "error"
    );
  };

  // ── Fetch blog posts from DB ────────────────────────────────────────────
  const fetchPosts = async () => {
    setIsLoadingPosts(true);
    try {
      const res = await fetch("/api/blog?status=all&limit=50");
      if (res.ok) {
        const data = await res.json();
        setDbPosts(data.posts || []);
      }
    } catch (err) {
      console.error("Error fetching blog posts:", err);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchCategories();
    if (typeof window !== "undefined") {
      const deletedStored = localStorage.getItem("introlic_deleted_static_blog");
      if (deletedStored) setDeletedStaticIds(JSON.parse(deletedStored));
    }
  }, []);

  // Auto slug
  useEffect(() => {
    if (!editingPostId && blogForm.title) {
      const generated = blogForm.title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
      setBlogForm(prev => ({ ...prev, slug: generated }));
    }
  }, [blogForm.title, editingPostId]);

  const resetForm = () => {
    setBlogForm({ ...EMPTY_FORM });
    setThumbnailFile(null);
    setThumbnailPreview("");
    setIsCustomAuthor(false);
  };

  // ── Thumbnail handling ──────────────────────────────────────────────────
  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "image/webp") {
      showAlertDialog("Invalid Format", "Only WebP images are accepted. Please convert your image to WebP first.", "error");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      showAlertDialog("File Too Large", `Image must be under 3MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB.`, "error");
      return;
    }
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleUploadThumbnail = async (): Promise<string | null> => {
    if (!thumbnailFile) return blogForm.thumbnailUrl || null;
    setIsUploadingThumb(true);
    try {
      const fd = new FormData();
      fd.append("thumbnail", thumbnailFile);
      const res = await fetch("/api/upload/thumbnail", { method: "POST", body: fd });
      if (!res.ok) {
        const err = await res.json();
        showAlertDialog("Upload Failed", err.error || "Could not upload thumbnail.", "error");
        return null;
      }
      const { url } = await res.json();
      return url;
    } catch {
      showAlertDialog("Upload Failed", "Network error while uploading thumbnail.", "error");
      return null;
    } finally {
      setIsUploadingThumb(false);
    }
  };

  // ── Contributors helpers ────────────────────────────────────────────────
  const addContributor = () => {
    setBlogForm(prev => ({ ...prev, contributors: [...prev.contributors, { name: "", role: "" }] }));
  };
  const removeContributor = (i: number) => {
    setBlogForm(prev => ({ ...prev, contributors: prev.contributors.filter((_, idx) => idx !== i) }));
  };
  const updateContributor = (i: number, field: "name" | "role", val: string) => {
    setBlogForm(prev => {
      const updated = [...prev.contributors];
      updated[i] = { ...updated[i], [field]: val };
      return { ...prev, contributors: updated };
    });
  };

  // ── Open forms ────────────────────────────────────────────────────────
  const handleOpenCreateForm = () => {
    setEditingPostId(null);
    resetForm();
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const now = new Date();
    setBlogForm(prev => ({ ...prev, date: `${months[now.getMonth()]} ${now.getFullYear()}` }));
    setViewMode("forge");
  };

  const handleOpenEditForm = (post: any) => {
    setEditingPostId(post.id);
    const existingAuthor = registeredAuthors.find(a => a.name.toLowerCase().trim() === (post.author || "").toLowerCase().trim());
    setIsCustomAuthor(!existingAuthor && !!post.author);
    setBlogForm({
      title: post.title || "",
      slug: post.slug || "",
      category: post.category || "Architecture",
      tag: post.tag || "",
      date: post.date || "",
      readTime: post.readTime || post.read_time || "5 min read",
      excerpt: post.excerpt || "",
      coverName: post.coverName || post.cover_name || "CoverIntrolicDWaves",
      body: post.body || "",
      author: post.author || "",
      thumbnailUrl: post.thumbnailUrl || post.thumbnail_url || "",
      showContributors: post.showContributors ?? post.show_contributors ?? false,
      contributors: post.contributors || [],
      status: post.status || "published",
    });
    if (post.thumbnailUrl || post.thumbnail_url) {
      setThumbnailPreview(post.thumbnailUrl || post.thumbnail_url);
    }
    setViewMode("forge");
  };

  // ── Submit ────────────────────────────────────────────────────────────
  const handleUploadBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploadingBlog(true);
    setUploadProgress(0);
    setUploadLogs(editingPostId ? ["[INIT] Updating article metadata..."] : ["[INIT] Initializing article publication..."]);

    const logStep = async (msg: string, pct: number) => {
      await new Promise(r => setTimeout(r, 250 + Math.random() * 200));
      setUploadProgress(pct);
      setUploadLogs(prev => [...prev, msg]);
    };

    await logStep("Validating markdown structure...", 25);

    let finalThumbnailUrl = blogForm.thumbnailUrl;
    if (thumbnailFile) {
      await logStep("Uploading WebP thumbnail to storage...", 50);
      const uploadedUrl = await handleUploadThumbnail();
      if (!uploadedUrl && thumbnailFile) {
        setIsUploadingBlog(false);
        return;
      }
      finalThumbnailUrl = uploadedUrl || "";
    }

    await logStep("Saving author and taxonomy mapping...", 75);

    const payload = {
      title: blogForm.title,
      slug: blogForm.slug,
      category: blogForm.category,
      tag: blogForm.tag,
      date: blogForm.date,
      readTime: blogForm.readTime,
      excerpt: blogForm.excerpt,
      body: blogForm.body,
      author: blogForm.author,
      thumbnailUrl: finalThumbnailUrl,
      coverName: blogForm.coverName,
      showContributors: blogForm.showContributors,
      contributors: blogForm.showContributors ? blogForm.contributors.filter(c => c.name.trim()) : [],
      status: blogForm.status,
    };

    try {
      let res: Response;
      if (editingPostId) {
        res = await fetch(`/api/blog/${editingPostId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      } else {
        res = await fetch("/api/blog", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      }
      if (!res.ok) {
        const err = await res.json();
        setUploadLogs(prev => [...prev, `[ERROR] ${err.error}`]);
        await new Promise(r => setTimeout(r, 800));
        setIsUploadingBlog(false);
        showAlertDialog("Error", err.error || "Failed to save article.", "error");
        return;
      }
      setUploadProgress(100);
      setUploadLogs(prev => [...prev, editingPostId ? "[SUCCESS] Blog post updated." : "[SUCCESS] Blog post published."]);
      await new Promise(r => setTimeout(r, 600));

      const titleSaved = blogForm.title;
      setIsUploadingBlog(false);
      setViewMode("overview");
      setEditingPostId(null);
      resetForm();
      await fetchPosts();
      showAlertDialog(
        editingPostId ? "Post Updated" : "Post Published",
        editingPostId ? `"${titleSaved}" updated successfully.` : `"${titleSaved}" published successfully.`,
        "success"
      );
    } catch {
      setIsUploadingBlog(false);
      showAlertDialog("Network Error", "Could not connect to the server.", "error");
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────
  const handleDeleteBlog = (id: string, isStatic?: boolean) => {
    showConfirmDialog(
      "Confirm Deletion",
      "Are you sure you want to delete this article? This action cannot be undone.",
      async () => {
        if (isStatic) {
          const updated = [...deletedStaticIds, id];
          setDeletedStaticIds(updated);
          if (typeof window !== "undefined") {
            localStorage.setItem("introlic_deleted_static_blog", JSON.stringify(updated));
          }
          if (expandedPostId === id) setExpandedPostId(null);
          showAlertDialog("Post Removed", "The system post has been hidden.", "success");
        } else {
          const res = await fetch(`/api/blog/${id}`, { method: "DELETE" });
          if (res.ok) {
            setDbPosts(prev => prev.filter(p => p.id !== id));
            if (expandedPostId === id) setExpandedPostId(null);
            showAlertDialog("Post Deleted", "The article has been deleted successfully.", "success");
          } else {
            showAlertDialog("Error", "Failed to delete the article.", "error");
          }
        }
      },
      "error"
    );
  };

  // ── Merged + filtered posts ───────────────────────────────────────────
  const mergedBlogPosts = useMemo(() => {
    const dbWithFlag = dbPosts.map(p => ({ ...p, isStatic: false }));
    const staticWithFlag = allPosts.filter(p => !deletedStaticIds.includes(p.id)).map(p => ({ ...p, isStatic: true }));
    return [...dbWithFlag, ...staticWithFlag];
  }, [dbPosts, deletedStaticIds]);

  const processedBlogPosts = useMemo(() => {
    let list = [...mergedBlogPosts];
    if (blogSearch.trim()) {
      const q = blogSearch.toLowerCase();
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        (p.tag || "").toLowerCase().includes(q) ||
        (p.author || "").toLowerCase().includes(q) ||
        (p.excerpt || "").toLowerCase().includes(q)
      );
    }
    if (blogCategoryFilter !== "All") list = list.filter(p => p.category === blogCategoryFilter);
    list.sort((a, b) => {
      const tA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const tB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      if (blogSort === "newest") return tB - tA;
      if (blogSort === "oldest") return tA - tB;
      if (blogSort === "title_az") return a.title.localeCompare(b.title);
      if (blogSort === "title_za") return b.title.localeCompare(a.title);
      return 0;
    });
    return list;
  }, [mergedBlogPosts, blogSearch, blogCategoryFilter, blogSort]);

  const categoryDropdownOptions = useMemo(() => {
    const list = registeredCategories.length > 0 
      ? registeredCategories.map(c => ({ value: c.name, label: c.name }))
      : ["Architecture", "Engineering", "Strategy", "Privacy", "AI Research"].map(c => ({ value: c, label: c }));
    return [...list, { value: "__add_new__", label: "+ Add Category..." }];
  }, [registeredCategories]);

  const categoryStats = useMemo(() => {
    const total = registeredCategories.length;
    const inUse = registeredCategories.filter(c => mergedBlogPosts.some(p => p.category === c.name)).length;
    const unused = total - inUse;
    let topCategory = { name: "None", count: 0 };
    registeredCategories.forEach(c => {
      const cnt = mergedBlogPosts.filter(p => p.category === c.name).length;
      if (cnt > topCategory.count) {
        topCategory = { name: c.name, count: cnt };
      }
    });
    return { total, inUse, unused, topCategory };
  }, [registeredCategories, mergedBlogPosts]);

  const filteredCategories = useMemo(() => {
    if (!categorySearch.trim()) return registeredCategories;
    const q = categorySearch.toLowerCase();
    return registeredCategories.filter((c: any) => 
      c.name.toLowerCase().includes(q) || 
      c.slug.toLowerCase().includes(q)
    );
  }, [registeredCategories, categorySearch]);

  const thumbUrl = thumbnailPreview || blogForm.thumbnailUrl;

  return (
    <div className="space-y-8 animate-fadeIn text-white font-sans relative">

      {/* Top Header & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#00a3ff]/10 border border-[#00a3ff]/20 flex items-center justify-center text-[#00a3ff] shadow-[0_0_20px_rgba(0,163,255,0.15)]">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
              Blog Posts & Dispatches
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400 font-normal">
                {mergedBlogPosts.length} total
              </span>
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">Publish articles, updates, and engineering documentation.</p>
          </div>
        </div>

        {viewMode === "overview" && (
          <button
            onClick={handleOpenCreateForm}
            className="px-4 py-2 bg-gradient-to-r from-[#00a3ff] to-[#0080ff] hover:from-[#0090e0] hover:to-[#0070e0] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-[0_4px_20px_rgba(0,163,255,0.3)] hover:scale-[1.02] active:scale-[0.98] shrink-0"
          >
            <Plus className="w-4 h-4" />
            New Blog Post
          </button>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-white/10 pb-3 items-center justify-between gap-4">
        <div className="flex gap-2 sm:gap-4">
          <button
            onClick={() => {
              setViewMode("overview");
              setEditingPostId(null);
              resetForm();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              viewMode === "overview" 
                ? "bg-white/10 text-white border border-white/15 shadow-sm" 
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5 text-[#00a3ff]" />
            Overview
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-white/10 text-gray-300">
              {mergedBlogPosts.length}
            </span>
          </button>
          
          <button
            onClick={() => {
              setViewMode("forge");
              setEditingPostId(null);
              resetForm();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              viewMode === "forge" 
                ? "bg-white/10 text-white border border-white/15 shadow-sm" 
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {editingPostId ? <Edit className="w-3.5 h-3.5 text-amber-400" /> : <Plus className="w-3.5 h-3.5 text-[#00a3ff]" />}
            {editingPostId ? "Edit Post" : "New Post"}
          </button>

          <button
            onClick={() => {
              setViewMode("categories");
              setEditingCategoryId(null);
              resetForm();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              viewMode === "categories" 
                ? "bg-white/10 text-white border border-white/15 shadow-sm" 
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#00a3ff]" />
            Category Manager
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-white/10 text-gray-300">
              {registeredCategories.length}
            </span>
          </button>
        </div>
      </div>

      {/* Upload Progress Overlay */}
      {isUploadingBlog && (
        <div className="fixed inset-0 bg-[#020202]/90 backdrop-blur-md flex flex-col items-center justify-center z-[200] p-6 animate-fadeIn">
          <div className="w-full max-w-sm space-y-4 bg-[#0a0a0c] border border-white/10 p-6 rounded-2xl shadow-2xl">
            <div className="flex justify-between items-center text-xs font-mono text-gray-400">
              <span className="flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#00a3ff]" />
                {editingPostId ? "UPDATING POST..." : "SAVING POST..."}
              </span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/[0.02]">
              <div className="h-full bg-[#00a3ff] transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
            </div>
            <div className="bg-[#050505] border border-white/5 rounded-lg p-3 h-36 font-mono text-[10px] text-gray-400 overflow-y-auto space-y-1.5 scrollbar-thin">
              {uploadLogs.map((log, i) => (
                <div key={i} className={log.startsWith("[SUCCESS]") ? "text-emerald-400 font-bold" : log.startsWith("[ERROR]") ? "text-red-400" : "text-gray-400"}>
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* ─── 1. OVERVIEW VIEW ────────────────────────────────────────────── */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {viewMode === "overview" ? (
        <div className="space-y-6 animate-fadeIn">

          {/* Stat Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-[#0c0c10] to-[#070709] rounded-2xl border border-white/[0.08] p-5 relative overflow-hidden group hover:border-white/20 transition-all">
              <div className="flex justify-between items-start mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 text-white/80">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Total</span>
              </div>
              <h3 className="text-3xl font-bold tracking-tight text-white mb-0.5">{mergedBlogPosts.length}</h3>
              <p className="text-xs text-gray-400">Total Blog Posts</p>
            </div>

            <div className="bg-gradient-to-br from-[#0c0c10] to-[#070709] rounded-2xl border border-white/[0.08] p-5 relative overflow-hidden group hover:border-emerald-500/30 transition-all">
              <div className="flex justify-between items-start mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Database
                </span>
              </div>
              <h3 className="text-3xl font-bold tracking-tight text-emerald-400 mb-0.5">{dbPosts.length}</h3>
              <p className="text-xs text-gray-400">Dynamic DB Posts</p>
            </div>

            <div className="bg-gradient-to-br from-[#0c0c10] to-[#070709] rounded-2xl border border-white/[0.08] p-5 relative overflow-hidden group hover:border-[#00a3ff]/30 transition-all">
              <div className="flex justify-between items-start mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#00a3ff]/10 border border-[#00a3ff]/20 text-[#00a3ff]">
                  <BookOpen className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-[#00a3ff] uppercase tracking-widest">System</span>
              </div>
              <h3 className="text-3xl font-bold tracking-tight text-white mb-0.5">
                {mergedBlogPosts.filter(p => p.isStatic).length}
              </h3>
              <p className="text-xs text-gray-400">System Dispatches</p>
            </div>

            <div className="bg-gradient-to-br from-[#0c0c10] to-[#070709] rounded-2xl border border-white/[0.08] p-5 relative overflow-hidden group hover:border-[#00a3ff]/30 transition-all">
              <div className="flex justify-between items-start mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#00a3ff]/10 border border-[#00a3ff]/20 text-[#00a3ff]">
                  <Layers className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-[#00a3ff] uppercase tracking-widest">Taxonomy</span>
              </div>
              <h3 className="text-3xl font-bold tracking-tight text-white mb-0.5">
                {registeredCategories.length}
              </h3>
              <p className="text-xs text-gray-400">Registered Categories</p>
            </div>
          </div>

          {/* Control Bar: Search, Filters, and Layout Switcher */}
          <div className="bg-[#0a0a0c] border border-white/[0.08] rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              {/* Search Box */}
              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={blogSearch}
                  onChange={e => setBlogSearch(e.target.value)}
                  placeholder="Search posts by title, tag, excerpt, author..."
                  className="w-full bg-[#050505] border border-white/[0.08] hover:border-white/20 focus:border-[#00a3ff]/50 rounded-xl py-2.5 pl-10 pr-9 text-xs text-white placeholder-gray-500 focus:outline-none transition-all font-sans"
                />
                {blogSearch && (
                  <button onClick={() => setBlogSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Layout Switcher */}
              <div className="flex items-center bg-black/50 border border-white/10 p-1 rounded-xl shrink-0 gap-1">
                <button
                  onClick={() => setBlogLayout("grid")}
                  title="Grid View"
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                    blogLayout === "grid" ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-white"
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  Grid
                </button>
                <button
                  onClick={() => setBlogLayout("linewise")}
                  title="Table View"
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                    blogLayout === "linewise" ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-white"
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  Table
                </button>
                <button
                  onClick={() => setBlogLayout("split")}
                  title="Master-Detail View"
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                    blogLayout === "split" ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Columns className="w-3.5 h-3.5" />
                  Split
                </button>
              </div>
            </div>

            {/* Filter Pills & Sort */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5 text-xs">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Category:</span>
                  <select
                    value={blogCategoryFilter}
                    onChange={e => setBlogCategoryFilter(e.target.value)}
                    className="bg-[#050505] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#00a3ff]/40 cursor-pointer font-medium"
                  >
                    <option value="All">All Categories</option>
                    {registeredCategories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>

                <span className="text-gray-700 hidden sm:inline">•</span>

                <span className="text-gray-500 text-[11px] font-mono">
                  Showing {processedBlogPosts.length} of {mergedBlogPosts.length} posts
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Sort:</span>
                <select
                  value={blogSort}
                  onChange={e => setBlogSort(e.target.value)}
                  className="bg-[#050505] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#00a3ff]/40 cursor-pointer font-medium"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="title_az">Title (A - Z)</option>
                  <option value="title_za">Title (Z - A)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Posts Render Area */}
          {isLoadingPosts ? (
            <div className="flex items-center justify-center p-16 bg-[#0a0a0c] rounded-2xl border border-white/[0.08]">
              <Loader2 className="w-6 h-6 animate-spin text-[#00a3ff]" />
            </div>
          ) : processedBlogPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center p-16 bg-[#0a0a0c] rounded-2xl border border-white/[0.08] space-y-4">
              <FileText className="w-10 h-10 text-gray-600 animate-pulse" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">No Posts Found</h3>
              <p className="text-xs text-gray-500 max-w-sm">No blog posts matching your search query or filters were found.</p>
              <button 
                onClick={() => { setBlogSearch(""); setBlogCategoryFilter("All"); }}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-300 transition-all cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          ) : blogLayout === "grid" ? (

            /* ─── GRID CARDS VIEW ─────────────────────────────────────────── */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {processedBlogPosts.map((post: any) => {
                const theme = CATEGORY_THEMES[post.category] || {
                  bg: "bg-[#00a3ff]/10",
                  text: "text-[#00a3ff]",
                  border: "border-[#00a3ff]/20",
                  dot: "bg-[#00a3ff]"
                };
                const thumb = post.thumbnailUrl || post.thumbnail_url;

                return (
                  <div
                    key={post.id}
                    className="bg-[#0a0a0c] border border-white/[0.08] hover:border-white/20 rounded-2xl p-5 flex flex-col justify-between space-y-4 group transition-all duration-200 hover:shadow-2xl text-left"
                  >
                    <div className="space-y-3">
                      {/* Image Thumbnail or Monogram Header */}
                      {thumb ? (
                        <div className="relative w-full h-36 rounded-xl overflow-hidden border border-white/10 bg-[#050505]">
                          <Image src={thumb} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                          <div className="absolute top-2.5 left-2.5">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${theme.bg} ${theme.text} border ${theme.border} backdrop-blur-md bg-black/60`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${theme.dot}`} />
                              {post.category}
                            </span>
                          </div>
                          {post.isStatic && (
                            <div className="absolute top-2.5 right-2.5">
                              <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase bg-black/80 text-gray-400 border border-white/10 backdrop-blur-md">
                                System
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-start justify-between gap-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${theme.bg} ${theme.text} border ${theme.border}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${theme.dot}`} />
                            {post.category}
                          </span>
                          {post.isStatic ? (
                            <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-white/5 text-gray-500 border border-white/10">
                              System
                            </span>
                          ) : (
                            <span className="text-[10px] text-gray-500 font-mono">{post.date}</span>
                          )}
                        </div>
                      )}

                      <div>
                        <h3 className="text-base font-bold text-white group-hover:text-[#00a3ff] transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-[11px] text-gray-400 mt-1">
                          by <span className="text-gray-300 font-medium">{post.author || "Introlic Team"}</span>
                          <span className="text-gray-600 mx-1.5">•</span>
                          <span className="text-gray-500 font-mono">{post.readTime || post.read_time || "5 min read"}</span>
                        </p>
                      </div>

                      <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-2">
                      <a
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-gray-400 hover:text-[#00a3ff] transition-colors"
                      >
                        /blog/{post.slug}
                        <ExternalLink className="w-3 h-3" />
                      </a>

                      <div className="flex items-center gap-1.5">
                        {!post.isStatic && (
                          <button
                            onClick={() => handleOpenEditForm(post)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-[#00a3ff] hover:bg-[#00a3ff]/10 transition-all cursor-pointer"
                            title="Edit Post"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteBlog(post.id, post.isStatic)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                          title="Delete Post"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          ) : blogLayout === "linewise" ? (

            /* ─── DATA TABLE VIEW ─────────────────────────────────────────── */
            <div className="overflow-hidden border border-white/[0.08] rounded-2xl bg-[#0a0a0c] shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-[#070709] text-[10px] text-gray-400 uppercase tracking-wider font-mono">
                      <th className="p-4 pl-6">Article</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Author</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 pr-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs divide-y divide-white/5">
                    {processedBlogPosts.map((post: any) => {
                      const theme = CATEGORY_THEMES[post.category] || {
                        bg: "bg-[#00a3ff]/10",
                        text: "text-[#00a3ff]",
                        border: "border-[#00a3ff]/20",
                        dot: "bg-[#00a3ff]"
                      };
                      const thumb = post.thumbnailUrl || post.thumbnail_url;

                      return (
                        <tr key={post.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="p-4 pl-6">
                            <div className="flex items-center gap-3">
                              {thumb ? (
                                <div className="w-10 h-8 rounded-lg overflow-hidden relative border border-white/10 shrink-0 bg-[#050505]">
                                  <Image src={thumb} alt="" fill className="object-cover" />
                                </div>
                              ) : (
                                <div className="w-10 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-mono text-[10px] text-gray-400 font-bold shrink-0">
                                  {post.title.substring(0, 2).toUpperCase()}
                                </div>
                              )}
                              <div>
                                <span className="font-bold text-white block">{post.title}</span>
                                <span className="text-[10px] text-gray-500 font-mono">/blog/{post.slug}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${theme.bg} ${theme.text} border ${theme.border}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${theme.dot}`} />
                              {post.category}
                            </span>
                          </td>
                          <td className="p-4 text-gray-300">{post.author || "—"}</td>
                          <td className="p-4 text-gray-400 font-mono text-[11px]">{post.date}</td>
                          <td className="p-4">
                            {post.isStatic ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-white/5 text-gray-400 border border-white/10">
                                System
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                {post.status || "published"}
                              </span>
                            )}
                          </td>
                          <td className="p-4 pr-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {!post.isStatic && (
                                <button 
                                  onClick={() => handleOpenEditForm(post)}
                                  className="p-1.5 rounded-lg text-gray-500 hover:text-[#00a3ff] hover:bg-[#00a3ff]/10 transition-all cursor-pointer"
                                  title="Edit Post"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <button 
                                onClick={() => handleDeleteBlog(post.id, post.isStatic)}
                                className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                                title="Delete Post"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          ) : (

            /* ─── SPLIT MASTER-DETAIL VIEW ───────────────────────────────── */
            (() => {
              const selectedPost = processedBlogPosts.find(p => p.id === expandedPostId) || processedBlogPosts[0];
              if (!selectedPost) return null;

              const theme = CATEGORY_THEMES[selectedPost.category] || {
                bg: "bg-[#00a3ff]/10",
                text: "text-[#00a3ff]",
                border: "border-[#00a3ff]/20",
                dot: "bg-[#00a3ff]"
              };
              const thumb = selectedPost.thumbnailUrl || selectedPost.thumbnail_url;
              const contribs: Contributor[] = selectedPost.contributors || [];

              return (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Column: List Selector */}
                  <div className="lg:col-span-4 space-y-2 max-h-[75vh] overflow-y-auto pr-1 custom-scrollbar">
                    <div className="text-[10px] font-mono uppercase tracking-widest text-gray-500 pb-2 border-b border-white/5 mb-2">
                      Blog Articles ({processedBlogPosts.length})
                    </div>
                    {processedBlogPosts.map(p => {
                      const isSelected = p.id === selectedPost.id;
                      return (
                        <div 
                          key={p.id}
                          onClick={() => setExpandedPostId(p.id)}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                            isSelected 
                              ? "bg-[#00a3ff]/10 border-[#00a3ff]/40 shadow-[0_0_20px_rgba(0,163,255,0.1)]" 
                              : "bg-[#0a0a0c] border-white/5 hover:border-white/15"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-xs text-white truncate max-w-[160px]">{p.title}</span>
                            <span className="text-[9px] font-mono text-gray-500">{p.date}</span>
                          </div>
                          <div className="flex items-center justify-between mt-2 text-[10px] text-gray-400">
                            <span>{p.category}</span>
                            <span>{p.readTime || p.read_time || "5 min"}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Right Column: Detailed Post Viewer */}
                  <div className="lg:col-span-8 bg-[#0a0a0c] border border-white/[0.08] rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-white/10">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-mono uppercase tracking-widest font-bold ${theme.text}`}>
                            {selectedPost.category}
                          </span>
                          <span className="text-gray-600">•</span>
                          <span className="text-[10px] font-mono text-gray-500">{selectedPost.date}</span>
                          <span className="text-gray-600">•</span>
                          <span className="text-[10px] font-mono text-gray-500">{selectedPost.readTime || selectedPost.read_time || "5 min read"}</span>
                        </div>
                        <h2 className="text-xl font-bold text-white tracking-tight mt-1">
                          {selectedPost.title}
                        </h2>
                        <p className="text-xs text-gray-400 mt-1">
                          by <span className="text-white font-medium">{selectedPost.author || "Introlic Team"}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {!selectedPost.isStatic && (
                          <button
                            onClick={() => handleOpenEditForm(selectedPost)}
                            className="p-2 rounded-xl border border-white/10 hover:border-[#00a3ff]/40 hover:bg-[#00a3ff]/10 text-gray-400 hover:text-[#00a3ff] transition-all cursor-pointer"
                            title="Edit Post"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteBlog(selectedPost.id, selectedPost.isStatic)}
                          className="p-2 rounded-xl border border-white/10 hover:border-red-500/40 hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all cursor-pointer"
                          title="Delete Post"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Thumbnail banner */}
                    {thumb && (
                      <div className="relative w-full h-48 rounded-xl overflow-hidden border border-white/10 bg-[#050505]">
                        <Image src={thumb} alt={selectedPost.title} fill className="object-cover" />
                      </div>
                    )}

                    {/* Excerpt */}
                    <div>
                      <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mb-2">Excerpt Summary</span>
                      <p className="text-xs text-gray-300 leading-relaxed bg-[#050505] border border-white/5 rounded-xl p-4">
                        {selectedPost.excerpt}
                      </p>
                    </div>

                    {/* Contributors */}
                    {(selectedPost.showContributors || selectedPost.show_contributors) && contribs.length > 0 && (
                      <div>
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mb-2">Contributors</span>
                        <div className="flex flex-wrap gap-2">
                          {contribs.map((c: Contributor, i: number) => (
                            <span key={i} className="text-xs px-3 py-1 bg-[#00a3ff]/5 border border-[#00a3ff]/20 rounded-lg text-[#00a3ff]">
                              {c.name}{c.role ? ` (${c.role})` : ""}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Full Article Body */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center gap-2 text-xs font-mono text-gray-400 uppercase tracking-wider pb-2 border-b border-white/10">
                        <FileText className="w-4 h-4 text-[#00a3ff]" />
                        Article Body
                      </div>
                      <div className="prose prose-invert max-w-none text-xs bg-[#050505] border border-white/5 rounded-xl p-5">
                        {parseMarkdown(selectedPost.body || `# ${selectedPost.title}\n\n${selectedPost.excerpt}`)}
                      </div>
                    </div>

                  </div>
                </div>
              );
            })()
          )}

        </div>

      ) : viewMode === "categories" ? (

        /* ─────────────────────────────────────────────────────────────────── */
        /* ─── 2. CATEGORY MANAGER VIEW ────────────────────────────────────── */
        /* ─────────────────────────────────────────────────────────────────── */
        <div className="space-y-6 animate-fadeIn">
          
          {/* Category Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-[#0c0c10] to-[#070709] rounded-2xl border border-white/[0.08] p-5 relative overflow-hidden group hover:border-[#00a3ff]/30 transition-all">
              <div className="flex justify-between items-start mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#00a3ff]/10 border border-[#00a3ff]/20 text-[#00a3ff]">
                  <Layers className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-[#00a3ff] uppercase tracking-widest">Total</span>
              </div>
              <h3 className="text-3xl font-bold tracking-tight text-white mb-0.5">{categoryStats.total}</h3>
              <p className="text-xs text-gray-400">Registered Categories</p>
            </div>

            <div className="bg-gradient-to-br from-[#0c0c10] to-[#070709] rounded-2xl border border-white/[0.08] p-5 relative overflow-hidden group hover:border-emerald-500/30 transition-all">
              <div className="flex justify-between items-start mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  In Use
                </span>
              </div>
              <h3 className="text-3xl font-bold tracking-tight text-emerald-400 mb-0.5">{categoryStats.inUse}</h3>
              <p className="text-xs text-gray-400">Categories With Posts</p>
            </div>

            <div className="bg-gradient-to-br from-[#0c0c10] to-[#070709] rounded-2xl border border-white/[0.08] p-5 relative overflow-hidden group hover:border-cyan-500/30 transition-all">
              <div className="flex justify-between items-start mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                  <FolderPlus className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">Available</span>
              </div>
              <h3 className="text-3xl font-bold tracking-tight text-cyan-400 mb-0.5">{categoryStats.unused}</h3>
              <p className="text-xs text-gray-400">Unassigned Categories</p>
            </div>

            <div className="bg-gradient-to-br from-[#0c0c10] to-[#070709] rounded-2xl border border-white/[0.08] p-5 relative overflow-hidden group hover:border-amber-500/30 transition-all">
              <div className="flex justify-between items-start mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest">Top Category</span>
              </div>
              <h3 className="text-lg font-bold tracking-tight text-white truncate mb-0.5">
                {categoryStats.topCategory.name}
              </h3>
              <p className="text-xs text-gray-400">
                {categoryStats.topCategory.count} {categoryStats.topCategory.count === 1 ? "post" : "posts"} assigned
              </p>
            </div>
          </div>

          {/* Main 2-Column Category Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ─── Left Column: Create/Edit Category Card ──────────────────── */}
            <div className="lg:col-span-4 bg-[#0a0a0c] border border-white/[0.08] rounded-2xl p-6 space-y-5 shadow-2xl sticky top-6">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl border ${editingCategoryId ? "bg-amber-500/10 border-amber-500/20 text-amber-400" : "bg-[#00a3ff]/10 border-[#00a3ff]/20 text-[#00a3ff]"}`}>
                    {editingCategoryId ? <Edit className="w-4 h-4" /> : <FolderPlus className="w-4 h-4" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                      {editingCategoryId ? "Edit Category" : "New Category"}
                    </h3>
                    <p className="text-[10px] text-gray-500 font-mono">
                      {editingCategoryId ? "Updating existing category" : "Define taxonomy for blog posts"}
                    </p>
                  </div>
                </div>

                {editingCategoryId && (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                    Editing Mode
                  </span>
                )}
              </div>

              {/* Live Preview Box */}
              <div className="bg-[#050505] border border-white/5 rounded-xl p-4 space-y-2.5">
                <span className="text-[9px] font-mono uppercase tracking-widest text-gray-500 block">Live Preview</span>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase bg-[#00a3ff]/10 text-[#00a3ff] border border-[#00a3ff]/20">
                    {categoryForm.name || "Category Preview"}
                  </span>
                  <span className="text-[10px] text-gray-500 font-mono">
                    /{categoryForm.slug || "slug-preview"}
                  </span>
                </div>
                <div className="text-[10px] text-gray-500 font-mono truncate pt-1 border-t border-white/5">
                  <span className="text-gray-600">Route:</span> introlic.in/blog?category={categoryForm.slug || "..."}
                </div>
              </div>

              {/* Category Form */}
              <form onSubmit={handleSaveCategory} className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">
                    Category Name <span className="text-red-400">*</span>
                  </label>
                  <input 
                    type="text" 
                    required 
                    value={categoryForm.name}
                    onChange={e => {
                      const name = e.target.value;
                      const generated = name.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
                      setCategoryForm(prev => ({ ...prev, name, slug: generated }));
                    }}
                    placeholder="e.g. Cryptography"
                    className="bg-[#050505] border border-white/[0.08] hover:border-white/20 focus:border-[#00a3ff]/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none transition-all font-sans w-full" 
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">
                    URL Slug <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600" />
                    <input 
                      type="text" 
                      required 
                      value={categoryForm.slug}
                      onChange={e => setCategoryForm(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") }))}
                      placeholder="e.g. cryptography"
                      className="bg-[#050505] border border-white/[0.08] hover:border-white/20 focus:border-[#00a3ff]/50 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none transition-all font-mono w-full" 
                    />
                  </div>
                  <span className="text-[9px] text-gray-600 font-mono">Auto-generated, lowercase & hyphens only</span>
                </div>

                <div className="flex gap-2 pt-2">
                  {editingCategoryId && (
                    <button 
                      type="button" 
                      onClick={() => { setEditingCategoryId(null); setCategoryForm({ name: "", slug: "" }); }}
                      className="flex-1 py-2.5 rounded-xl border border-white/10 hover:border-white/20 text-xs font-bold text-gray-400 hover:text-white uppercase cursor-pointer transition-all"
                    >
                      Cancel
                    </button>
                  )}
                  <button 
                    type="submit" 
                    disabled={isSavingCategory}
                    className={`flex-1 py-2.5 text-white rounded-xl text-xs font-bold uppercase cursor-pointer transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 ${
                      editingCategoryId 
                        ? "bg-amber-500 hover:bg-amber-600 text-black shadow-amber-500/20" 
                        : "bg-gradient-to-r from-[#00a3ff] to-[#0080ff] hover:from-[#0090e0] hover:to-[#0070e0] shadow-[0_4px_20px_rgba(0,163,255,0.25)]"
                    }`}
                  >
                    {isSavingCategory ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    {editingCategoryId ? "Update Category" : "Create Category"}
                  </button>
                </div>
              </form>
            </div>

            {/* ─── Right Column: Category Directory (Search + Cards/Table) ──── */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* Category Search & Layout Toolbar */}
              <div className="bg-[#0a0a0c] border border-white/[0.08] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={categorySearch}
                    onChange={e => setCategorySearch(e.target.value)}
                    placeholder="Search categories by name or slug..."
                    className="w-full bg-[#050505] border border-white/[0.08] hover:border-white/20 focus:border-[#00a3ff]/50 rounded-xl py-2 pl-10 pr-9 text-xs text-white placeholder-gray-600 focus:outline-none transition-all font-sans"
                  />
                  {categorySearch && (
                    <button 
                      onClick={() => setCategorySearch("")} 
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <span className="text-xs font-mono text-gray-500">
                    {filteredCategories.length} of {registeredCategories.length}
                  </span>

                  <div className="flex items-center bg-black/50 border border-white/10 p-1 rounded-xl shrink-0 gap-1">
                    <button
                      onClick={() => setCategoryViewLayout("cards")}
                      title="Cards View"
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                        categoryViewLayout === "cards" ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-white"
                      }`}
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      Cards
                    </button>
                    <button
                      onClick={() => setCategoryViewLayout("table")}
                      title="Table View"
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                        categoryViewLayout === "table" ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-white"
                      }`}
                    >
                      <List className="w-3.5 h-3.5" />
                      Table
                    </button>
                  </div>
                </div>
              </div>

              {/* Empty Search State */}
              {filteredCategories.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center p-12 bg-[#0a0a0c] rounded-2xl border border-white/[0.08] space-y-3">
                  <Layers className="w-8 h-8 text-gray-600" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">No Categories Match</h4>
                  <p className="text-xs text-gray-500">No categories found matching &quot;{categorySearch}&quot;.</p>
                  <button 
                    onClick={() => setCategorySearch("")}
                    className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-300 transition-all"
                  >
                    Clear Search
                  </button>
                </div>
              ) : categoryViewLayout === "cards" ? (

                /* ─── CARDS GRID VIEW ─────────────────────────────────────── */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredCategories.map((cat: any) => {
                    const count = mergedBlogPosts.filter(p => p.category === cat.name).length;
                    const theme = CATEGORY_THEMES[cat.name] || {
                      bg: "bg-[#00a3ff]/10",
                      text: "text-[#00a3ff]",
                      border: "border-[#00a3ff]/20",
                      dot: "bg-[#00a3ff]"
                    };
                    const isCopied = copiedSlug === cat.slug;

                    return (
                      <div 
                        key={cat.id}
                        className="bg-[#0a0a0c] border border-white/[0.08] hover:border-white/20 rounded-2xl p-5 flex flex-col justify-between space-y-4 group transition-all duration-200 hover:shadow-xl"
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center font-mono font-bold text-sm ${theme.bg} ${theme.text} ${theme.border} shrink-0`}>
                                {cat.name.substring(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <h4 className="text-sm font-bold text-white group-hover:text-[#00a3ff] transition-colors">
                                  {cat.name}
                                </h4>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="text-[10px] font-mono text-gray-500 truncate max-w-[120px]">
                                    #{cat.slug}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleCopySlug(cat.slug)}
                                    title="Copy Slug"
                                    className="text-gray-600 hover:text-white transition-colors cursor-pointer"
                                  >
                                    {isCopied ? <CheckCheck className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                  </button>
                                </div>
                              </div>
                            </div>

                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase ${
                              count > 0 
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                                : "bg-white/5 text-gray-500 border border-white/10"
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${count > 0 ? "bg-emerald-400 animate-pulse" : "bg-gray-600"}`} />
                              {count} {count === 1 ? "Post" : "Posts"}
                            </span>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                          <a
                            href={`/blog?category=${encodeURIComponent(cat.name)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-gray-400 hover:text-[#00a3ff] transition-colors"
                          >
                            View Posts
                            <ExternalLink className="w-3 h-3" />
                          </a>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button 
                              onClick={() => { 
                                setEditingCategoryId(cat.id); 
                                setCategoryForm({ name: cat.name, slug: cat.slug }); 
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-[#00a3ff] hover:bg-[#00a3ff]/10 transition-colors cursor-pointer"
                              title="Edit Category"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => handleDeleteCategory(cat.id)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                              title="Delete Category"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

              ) : (

                /* ─── DATA TABLE VIEW ─────────────────────────────────────── */
                <div className="overflow-hidden border border-white/[0.08] rounded-2xl bg-[#0a0a0c] shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 bg-[#070709] text-[10px] text-gray-400 uppercase tracking-wider font-mono">
                          <th className="p-4 pl-6">Category</th>
                          <th className="p-4">URL Slug</th>
                          <th className="p-4 text-center">Posts</th>
                          <th className="p-4 text-center">Status</th>
                          <th className="p-4 pr-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="text-xs divide-y divide-white/5">
                        {filteredCategories.map((cat: any) => {
                          const count = mergedBlogPosts.filter(p => p.category === cat.name).length;
                          const theme = CATEGORY_THEMES[cat.name] || {
                            bg: "bg-[#00a3ff]/10",
                            text: "text-[#00a3ff]",
                            border: "border-[#00a3ff]/20"
                          };
                          const isCopied = copiedSlug === cat.slug;

                          return (
                            <tr key={cat.id} className="hover:bg-white/[0.02] transition-colors">
                              <td className="p-4 pl-6 font-bold text-white">
                                <div className="flex items-center gap-3">
                                  <div className={`w-8 h-8 rounded-lg border flex items-center justify-center font-mono font-bold text-xs ${theme.bg} ${theme.text} ${theme.border} shrink-0`}>
                                    {cat.name.substring(0, 2).toUpperCase()}
                                  </div>
                                  <span className="font-bold text-white">{cat.name}</span>
                                </div>
                              </td>
                              <td className="p-4 font-mono text-gray-400">
                                <div className="flex items-center gap-1.5">
                                  <span>{cat.slug}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleCopySlug(cat.slug)}
                                    title="Copy Slug"
                                    className="text-gray-600 hover:text-white transition-colors cursor-pointer"
                                  >
                                    {isCopied ? <CheckCheck className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                  </button>
                                </div>
                              </td>
                              <td className="p-4 text-center font-mono">
                                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                  count > 0 ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-white/5 text-gray-500"
                                }`}>
                                  {count} {count === 1 ? "post" : "posts"}
                                </span>
                              </td>
                              <td className="p-4 text-center font-mono text-[10px]">
                                <span className={`px-2 py-0.5 rounded-md ${
                                  count > 0 ? "text-emerald-400 bg-emerald-500/10" : "text-gray-500 bg-white/5"
                                }`}>
                                  {count > 0 ? "In Use" : "Available"}
                                </span>
                              </td>
                              <td className="p-4 pr-6 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button 
                                    onClick={() => { 
                                      setEditingCategoryId(cat.id); 
                                      setCategoryForm({ name: cat.name, slug: cat.slug }); 
                                      window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className="p-1.5 rounded-lg text-gray-400 hover:text-[#00a3ff] hover:bg-[#00a3ff]/10 transition-all cursor-pointer"
                                    title="Edit Category"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteCategory(cat.id)}
                                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                                    title="Delete Category"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

      ) : (

        /* ─────────────────────────────────────────────────────────────────── */
        /* ─── 3. CREATE / EDIT BLOG POST FORM ─────────────────────────────── */
        /* ─────────────────────────────────────────────────────────────────── */
        <div className="bg-[#0a0a0c] rounded-3xl border border-white/[0.08] p-6 sm:p-8 text-left animate-fadeIn shadow-2xl space-y-6">
          
          {/* Form Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#00a3ff]/10 border border-[#00a3ff]/20 flex items-center justify-center text-[#00a3ff]">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  {editingPostId ? "Edit Blog Post" : "Create New Blog Post"}
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#00a3ff]/10 text-[#00a3ff] border border-[#00a3ff]/20">
                    {editingPostId ? "UPDATE MODE" : "NEW POST"}
                  </span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Fill in the article details and markdown content below.</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => { setViewMode("overview"); setEditingPostId(null); resetForm(); }}
              className="px-4 py-2 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/5 text-xs text-gray-400 hover:text-white font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Overview
            </button>
          </div>

          <form onSubmit={handleUploadBlog} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

              {/* Left Column: Core Fields & Markdown Body */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Title & Slug */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">
                      Post Title <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={blogForm.title}
                      onChange={e => setBlogForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g. Scalable AI Systems"
                      className="bg-[#050505] border border-white/[0.08] hover:border-white/20 focus:border-[#00a3ff]/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none transition-all font-sans"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">
                      URL Slug <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600" />
                      <input
                        type="text"
                        required
                        value={blogForm.slug}
                        onChange={e => setBlogForm(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") }))}
                        placeholder="e.g. scalable-ai-systems"
                        className="bg-[#050505] border border-white/[0.08] hover:border-white/20 focus:border-[#00a3ff]/50 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none transition-all font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Category & Tag */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">
                      Category <span className="text-red-400">*</span>
                    </label>
                    <FormDropdown
                      label=""
                      value={blogForm.category}
                      options={categoryDropdownOptions}
                      onChange={val => {
                        if (val === "__add_new__") {
                          setNewCategoryName("");
                          setShowAddCategoryModal(true);
                        } else {
                          setBlogForm(prev => ({ ...prev, category: val }));
                        }
                      }}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">
                      Tag Prefix
                    </label>
                    <input
                      type="text"
                      value={blogForm.tag}
                      onChange={e => setBlogForm(prev => ({ ...prev, tag: e.target.value }))}
                      placeholder="e.g. ARCH-01"
                      className="bg-[#050505] border border-white/[0.08] hover:border-white/20 focus:border-[#00a3ff]/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none transition-all font-sans"
                    />
                  </div>
                </div>

                {/* Excerpt */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">
                    Excerpt Summary <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    required
                    value={blogForm.excerpt}
                    onChange={e => setBlogForm(prev => ({ ...prev, excerpt: e.target.value }))}
                    rows={3}
                    placeholder="Short summary excerpt displayed on the blog listing and metadata cards..."
                    className="bg-[#050505] border border-white/[0.08] hover:border-white/20 focus:border-[#00a3ff]/50 rounded-xl p-4 text-xs text-white placeholder-gray-600 focus:outline-none transition-all resize-none font-sans leading-relaxed"
                  />
                </div>

                {/* Article Body with Markdown Editor */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">
                      Article Body (Markdown)
                    </label>
                    <div className="flex bg-black/50 border border-white/10 p-0.5 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setBodyTab("write")}
                        className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          bodyTab === "write" ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-white"
                        }`}
                      >
                        Write
                      </button>
                      <button
                        type="button"
                        onClick={() => setBodyTab("preview")}
                        className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          bodyTab === "preview" ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-white"
                        }`}
                      >
                        Live Preview
                      </button>
                    </div>
                  </div>

                  {bodyTab === "write" ? (
                    <div className="space-y-2">
                      <MarkdownToolbar
                        textareaRef={bodyTextRef}
                        value={blogForm.body}
                        onChange={val => setBlogForm(prev => ({ ...prev, body: val }))}
                      />
                      <textarea
                        ref={bodyTextRef}
                        value={blogForm.body}
                        onChange={e => setBlogForm(prev => ({ ...prev, body: e.target.value }))}
                        rows={16}
                        placeholder={`# Article Title\n\nWrite your blog article here in Markdown...\n\n## Section 1: Overview\n\nContent here.`}
                        className="w-full bg-[#050505] border border-white/[0.08] hover:border-white/20 focus:border-[#00a3ff]/50 rounded-xl p-4 text-xs text-white placeholder-gray-600 focus:outline-none transition-all font-mono leading-relaxed resize-y min-h-[260px]"
                      />
                    </div>
                  ) : (
                    <div className="bg-[#050505] border border-white/[0.08] rounded-xl p-6 text-left overflow-y-auto max-h-[500px] min-h-[260px] prose prose-invert max-w-none text-xs">
                      {parseMarkdown(blogForm.body || "# Article Preview\n*No article content written yet.*")}
                    </div>
                  )}
                </div>

              </div>

              {/* Right Column: WebP Thumbnail, Author, Dates & Contributors */}
              <div className="lg:col-span-5 space-y-6">

                {/* WebP Thumbnail Upload */}
                <div className="bg-[#050505] border border-white/[0.08] rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-[#00a3ff]" />
                      <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">WebP Thumbnail</span>
                    </div>
                    <span className="text-[10px] text-gray-500 font-mono">Max 3MB</span>
                  </div>

                  <div className="relative">
                    {thumbUrl ? (
                      <div className="relative group">
                        <div className="relative w-full h-40 rounded-xl overflow-hidden border border-white/10 bg-[#0a0a0c]">
                          <Image src={thumbUrl} alt="Thumbnail Preview" fill className="object-cover" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => thumbInputRef.current?.click()}
                              className="px-3 py-1.5 bg-[#00a3ff] rounded-lg text-xs font-bold text-white cursor-pointer"
                            >
                              Change
                            </button>
                            <button
                              type="button"
                              onClick={() => { setThumbnailFile(null); setThumbnailPreview(""); setBlogForm(prev => ({ ...prev, thumbnailUrl: "" })); }}
                              className="px-3 py-1.5 bg-red-500/80 hover:bg-red-500 rounded-lg text-xs font-bold text-white cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => thumbInputRef.current?.click()}
                        className="w-full h-32 rounded-xl border-2 border-dashed border-white/10 hover:border-[#00a3ff]/40 bg-white/[0.01] hover:bg-[#00a3ff]/5 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer group"
                      >
                        <Upload className="w-5 h-5 text-gray-600 group-hover:text-[#00a3ff] transition-colors" />
                        <span className="text-[10px] text-gray-500 group-hover:text-[#00a3ff] font-semibold uppercase tracking-wider transition-colors">
                          Click to upload WebP image
                        </span>
                        <span className="text-[9px] text-gray-600">Only .webp format accepted · Max 3MB</span>
                      </button>
                    )}
                    <input ref={thumbInputRef} type="file" accept=".webp,image/webp" onChange={handleThumbnailSelect} className="hidden" />
                  </div>

                  {!thumbUrl && (
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center gap-2 p-2.5 bg-amber-500/5 border border-amber-500/15 rounded-xl">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="text-[10px] text-amber-300/80">Fallback: CSS Art Cover will render if no WebP is uploaded.</span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">CSS Art Cover Variant</label>
                        <select
                          value={blogForm.coverName}
                          onChange={e => setBlogForm(prev => ({ ...prev, coverName: e.target.value }))}
                          className="bg-[#0a0a0a] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#00a3ff]/40 transition-all font-sans cursor-pointer"
                        >
                          <option value="CoverIntrolicDWaves">Introlic-D Waves Cover</option>
                          <option value="CoverIntrolicKMemory">Introlic-K Memory Grid Cover</option>
                          <option value="CoverXTStrategy">XT Strategy Scaling Scatter Cover</option>
                          <option value="CoverEdgeInference">Edge Inference Hexagon Cover</option>
                          <option value="CoverKernelFusion">Kernel Fusion GPU Layers Cover</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* Author, Dates & Metadata */}
                <div className="bg-[#050505] border border-white/[0.08] rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                    <Users className="w-4 h-4 text-[#00a3ff]" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">Author & Publishing</span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">Author</label>
                    <FormDropdown
                      label=""
                      value={isCustomAuthor ? "__custom__" : (blogForm.author || "")}
                      options={authorOptions}
                      placeholder="Select Author..."
                      onChange={val => {
                        if (val === "__custom__") {
                          setIsCustomAuthor(true);
                          setBlogForm(prev => ({ ...prev, author: "" }));
                        } else {
                          setIsCustomAuthor(false);
                          setBlogForm(prev => ({ ...prev, author: val }));
                        }
                      }}
                    />
                    {isCustomAuthor && (
                      <input
                        type="text"
                        required
                        value={blogForm.author}
                        onChange={e => setBlogForm(prev => ({ ...prev, author: e.target.value }))}
                        placeholder="e.g. Introlic Team"
                        className="bg-[#0a0a0a] border border-[#00a3ff]/30 focus:border-[#00a3ff]/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none transition-all font-sans mt-1"
                      />
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">Date Published</label>
                      <input
                        type="text"
                        required
                        value={blogForm.date}
                        onChange={e => setBlogForm(prev => ({ ...prev, date: e.target.value }))}
                        placeholder="e.g. JUN 2026"
                        className="bg-[#0a0a0a] border border-white/[0.08] hover:border-white/20 focus:border-[#00a3ff]/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none transition-all font-sans"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">Read Time</label>
                      <input
                        type="text"
                        required
                        value={blogForm.readTime}
                        onChange={e => setBlogForm(prev => ({ ...prev, readTime: e.target.value }))}
                        placeholder="e.g. 5 min read"
                        className="bg-[#0a0a0a] border border-white/[0.08] hover:border-white/20 focus:border-[#00a3ff]/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none transition-all font-sans"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">Publication Status</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(["published", "draft"] as const).map(s => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setBlogForm(prev => ({ ...prev, status: s }))}
                          className={`py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border cursor-pointer ${
                            blogForm.status === s
                              ? s === "published"
                                ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-sm"
                                : "bg-amber-500/10 border-amber-500/40 text-amber-400 shadow-sm"
                              : "bg-[#0a0a0a] border-white/5 text-gray-600 hover:text-gray-400"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Contributors Section */}
                <div className="bg-[#050505] border border-white/[0.08] rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#00a3ff]" />
                      <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">Contributors</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setBlogForm(prev => ({ ...prev, showContributors: !prev.showContributors }))}
                      className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                    >
                      {blogForm.showContributors ? (
                        <><ToggleRight className="w-5 h-5 text-[#00a3ff]" /><span className="text-[#00a3ff]">Enabled</span></>
                      ) : (
                        <><ToggleLeft className="w-5 h-5 text-gray-600" /><span className="text-gray-600">Disabled</span></>
                      )}
                    </button>
                  </div>

                  {blogForm.showContributors && (
                    <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 pt-1">
                      <p className="text-[10px] text-gray-500">Contributors will be listed at the bottom of the article.</p>
                      {blogForm.contributors.map((contributor, i) => (
                        <div key={i} className="flex gap-2 items-start">
                          <div className="flex-1 grid grid-cols-2 gap-2">
                            <div className="relative">
                              <input
                                type="text"
                                value={contributor.name}
                                onChange={e => updateContributor(i, "name", e.target.value)}
                                placeholder="Name (or select author...)"
                                list={`contrib-names-${i}`}
                                className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#00a3ff]/40 transition-all font-sans"
                              />
                              <datalist id={`contrib-names-${i}`}>
                                {registeredAuthors.map(a => <option key={a.id} value={a.name} />)}
                              </datalist>
                            </div>
                            <input
                              type="text"
                              value={contributor.role || ""}
                              onChange={e => updateContributor(i, "role", e.target.value)}
                              placeholder="Role (e.g. Editor)"
                              className="bg-[#0a0a0a] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#00a3ff]/40 transition-all font-sans"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeContributor(i)}
                            className="p-2 text-gray-600 hover:text-red-400 transition-colors shrink-0 cursor-pointer mt-0.5"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addContributor}
                        className="flex items-center gap-1.5 text-[10px] text-[#00a3ff] hover:text-white font-bold uppercase tracking-wider transition-all cursor-pointer pt-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Contributor
                      </button>
                    </motion.div>
                  )}
                </div>

              </div>

            </div>

            {/* Sticky Action Footer */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/10">
              <button
                type="button"
                onClick={() => { setViewMode("overview"); setEditingPostId(null); resetForm(); }}
                className="px-6 py-2.5 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/5 text-xs text-gray-400 hover:text-white font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUploadingThumb}
                className="flex items-center justify-center gap-2 px-8 py-2.5 rounded-xl bg-gradient-to-r from-[#00a3ff] to-[#0080ff] hover:from-[#0090e0] hover:to-[#0070e0] text-white font-bold text-xs uppercase tracking-wider cursor-pointer transition-all shadow-[0_4px_25px_rgba(0,163,255,0.3)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                {editingPostId ? "Update Post" : "Publish Post"}
              </button>
            </div>
          </form>

        </div>
      )}

      {/* Dynamic Category Modal */}
      <AnimatePresence>
        {showAddCategoryModal && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddCategoryModal(false)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ type: "spring", duration: 0.4, ease: [0.16, 1, 0.3, 1] as any }}
              className="relative bg-[#050505] border border-[#00a3ff]/20 shadow-[0_0_50px_rgba(0,163,255,0.12)] p-6 rounded-2xl max-w-sm w-full overflow-hidden text-left z-[310]"
            >
              <button
                type="button"
                onClick={() => setShowAddCategoryModal(false)}
                className="absolute top-4 right-4 p-1 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-white/[0.02] border border-white/5 shrink-0">
                  <Plus className="w-5 h-5 text-[#00a3ff]" />
                </div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Add New Category
                </h3>
              </div>

              <form onSubmit={handleCreateCategorySubmit} className="space-y-4 font-sans">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest font-mono">Category Name</label>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={newCategoryName}
                    onChange={e => setNewCategoryName(e.target.value)}
                    placeholder="e.g. Cryptography"
                    className="bg-[#0a0a0a] border border-white/[0.08] focus:border-[#00a3ff]/40 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none transition-all w-full"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddCategoryModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-white/5 hover:border-white/10 hover:bg-white/5 text-gray-400 hover:text-white text-xs font-bold transition-all text-center uppercase tracking-wider cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingCategory}
                    className="flex-1 py-2.5 rounded-xl bg-[#00a3ff] hover:bg-[#0090e0] text-white text-xs font-bold transition-all text-center uppercase tracking-wider shadow-lg flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isSavingCategory ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                    Add Category
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AdminDialog isOpen={dialog.isOpen} onClose={() => setDialog(prev => ({ ...prev, isOpen: false }))}
        type={dialog.type} title={dialog.title} message={dialog.message}
        onConfirm={dialog.onConfirm} severity={dialog.severity} />
    </div>
  );
}
