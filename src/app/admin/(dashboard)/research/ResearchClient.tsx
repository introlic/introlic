"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { 
  BookOpen, Trash2, Loader2, Sparkles, Terminal,
  Edit, Plus, Search, X, ArrowLeft, ArrowRight,
  FileText, CheckCircle, Clock, ChevronDown,
  Users, ToggleLeft, ToggleRight, Link2, Hash, Building2,
  Bold, Italic, Code, Table, List, ListOrdered,
  Heading1, Heading2, Heading3, Quote, Minus,
  LayoutGrid, Columns, ExternalLink, Copy, CheckCheck,
  FolderPlus, Layers, Globe, Calendar, Tag, Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { parseMarkdown } from "@/components/blog/MarkdownRenderer";
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
  const optionList = useMemo(() => options.map(opt => typeof opt === "string" ? { value: opt, label: opt } : opt), [options]);
  const selectedLabel = optionList.find(o => o.value === value)?.label || value || placeholder;
  return (
    <div ref={ref} className="flex flex-col gap-1.5 relative w-full">
      {label && <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest font-mono">{label}</label>}
      <button type="button" onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between bg-[#0a0a0a] border border-white/[0.08] hover:border-white/20 px-4 py-2.5 rounded-xl text-xs text-white text-left transition-all duration-300 cursor-pointer font-sans"
        style={{ borderColor: open ? "rgba(0,163,255,0.4)" : undefined }}>
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-300 shrink-0 ${open ? 'rotate-180 text-[#00a3ff]' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -6, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }} transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 w-full bg-[#080808]/98 backdrop-blur-xl border border-white/[0.08] rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9)] z-50 max-h-48 overflow-y-auto custom-scrollbar">
            {optionList.map(opt => (
              <button key={opt.value} type="button" onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-xs text-left transition-colors duration-150 cursor-pointer ${value === opt.value ? "text-[#00a3ff] bg-[#00a3ff]/08 font-bold" : "text-gray-400 hover:text-white hover:bg-white/[0.03]"}`}>
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

type Contributor = { name: string; role?: string };

const TYPE_COLORS: Record<string, { label: string; text: string; bg: string; border: string; dot: string }> = {
  Publication: { label: "Publication", text: "text-[#00a3ff]", bg: "bg-[#00a3ff]/10", border: "border-[#00a3ff]/20", dot: "bg-[#00a3ff]" },
  Milestone: { label: "Milestone", text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", dot: "bg-emerald-400" },
  Conclusion: { label: "Conclusion", text: "text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/20", dot: "bg-sky-400" },
  Release: { label: "Release", text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", dot: "bg-amber-400" },
};

const EMPTY_FORM = {
  title: "",
  type: "Publication",
  author: "",
  date: "",
  abstract: "",
  fullText: "",
  keywords: "",
  doi: "",
  institution: "",
  externalUrl: "",
  showContributors: false,
  contributors: [] as Contributor[],
  status: "published",
};

export default function ResearchClient() {
  const [isUploadingResearch, setIsUploadingResearch] = useState(false);
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
  const [editingPaperId, setEditingPaperId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"overview" | "forge" | "categories">("overview");
  const [fullTextTab, setFullTextTab] = useState<"write" | "preview">("write");
  const [researchForm, setResearchForm] = useState({ ...EMPTY_FORM });
  const fullTextRef = useRef<HTMLTextAreaElement | null>(null);

  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categoryForm, setCategoryForm] = useState({ name: "", slug: "" });

  // DB papers
  const [dbPapers, setDbPapers] = useState<any[]>([]);
  const [isLoadingPapers, setIsLoadingPapers] = useState(true);

  const [researchSearch, setResearchSearch] = useState("");
  const [researchTypeFilter, setResearchTypeFilter] = useState("All");
  const [researchSort, setResearchSort] = useState("newest");
  const [researchLayout, setResearchLayout] = useState<"grid" | "linewise" | "split">("grid");
  const [expandedPaperId, setExpandedPaperId] = useState<string | null>(null);

  // Type manager state
  const [registeredTypes, setRegisteredTypes] = useState<any[]>([]);
  const [isSavingType, setIsSavingType] = useState(false);
  const [showAddTypeModal, setShowAddTypeModal] = useState(false);
  const [newTypeName, setNewTypeName] = useState("");
  const [typeSearch, setTypeSearch] = useState("");
  const [typeViewLayout, setTypeViewLayout] = useState<"cards" | "table">("cards");
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const handleCopySlug = (slug: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(slug);
      setCopiedSlug(slug);
      setTimeout(() => setCopiedSlug(null), 2000);
    }
  };

  const fetchTypes = async () => {
    try {
      const res = await fetch("/api/categories?type=research");
      if (res.ok) {
        const data = await res.json();
        setRegisteredTypes(data || []);
      }
    } catch (err) {
      console.error("Error fetching research types:", err);
    }
  };

  const handleCreateTypeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTypeName.trim()) return;
    setIsSavingType(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTypeName.trim(), type: "research" })
      });
      if (res.ok) {
        const newType = await res.json();
        setResearchForm(prev => ({ ...prev, type: newType.name }));
        await fetchTypes();
        setShowAddTypeModal(false);
        setNewTypeName("");
      } else {
        const err = await res.json();
        showAlertDialog("Error", err.error || "Failed to create document type", "error");
      }
    } catch {
      showAlertDialog("Error", "Could not connect to the server", "error");
    } finally {
      setIsSavingType(false);
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) return;
    setIsSavingType(true);
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
          body: JSON.stringify({ ...categoryForm, type: "research" }),
        });
      }
      if (res.ok) {
        showAlertDialog(
          editingCategoryId ? "Type Updated" : "Type Created",
          editingCategoryId ? `"${categoryForm.name}" updated successfully.` : `"${categoryForm.name}" created successfully.`,
          "success"
        );
        setEditingCategoryId(null);
        setCategoryForm({ name: "", slug: "" });
        await fetchTypes();
      } else {
        const err = await res.json();
        showAlertDialog("Error", err.error || "Failed to save document type.", "error");
      }
    } catch {
      showAlertDialog("Network Error", "Could not connect to the server.", "error");
    } finally {
      setIsSavingType(false);
    }
  };

  const handleDeleteCategory = (id: string) => {
    const cat = registeredTypes.find(c => c.id === id);
    if (!cat) return;
    const count = dbPapers.filter(p => p.type === cat.name).length;
    if (count > 0) {
      showAlertDialog(
        "Cannot Delete",
        `Type "${cat.name}" is in use by ${count} documents. Please reassign those papers before deleting.`,
        "error"
      );
      return;
    }

    showConfirmDialog(
      "Confirm Deletion",
      `Are you sure you want to delete the document type "${cat.name}"?`,
      async () => {
        try {
          const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
          if (res.ok) {
            showAlertDialog("Type Deleted", "Document type has been removed.", "success");
            await fetchTypes();
          } else {
            const err = await res.json();
            showAlertDialog("Error", err.error || "Failed to delete document type.", "error");
          }
        } catch {
          showAlertDialog("Network Error", "Could not connect to the server.", "error");
        }
      },
      "error"
    );
  };

  // ── Fetch ──────────────────────────────────────────────────────────────
  const fetchPapers = async () => {
    setIsLoadingPapers(true);
    try {
      const res = await fetch("/api/research?status=all&limit=50");
      if (res.ok) {
        const data = await res.json();
        setDbPapers(data.papers || []);
      }
    } catch (err) {
      console.error("Error fetching research papers:", err);
    } finally {
      setIsLoadingPapers(false);
    }
  };

  useEffect(() => { 
    fetchPapers(); 
    fetchTypes();
  }, []);

  const resetForm = () => { setResearchForm({ ...EMPTY_FORM }); setIsCustomAuthor(false); };

  // ── Contributors helpers ───────────────────────────────────────────────
  const addContributor = () => setResearchForm(prev => ({ ...prev, contributors: [...prev.contributors, { name: "", role: "" }] }));
  const removeContributor = (i: number) => setResearchForm(prev => ({ ...prev, contributors: prev.contributors.filter((_, idx) => idx !== i) }));
  const updateContributor = (i: number, field: "name" | "role", val: string) => {
    setResearchForm(prev => {
      const updated = [...prev.contributors];
      updated[i] = { ...updated[i], [field]: val };
      return { ...prev, contributors: updated };
    });
  };

  const keywordsToArray = (str: string): string[] =>
    str.split(",").map(k => k.trim()).filter(Boolean);

  // ── Open forms ─────────────────────────────────────────────────────────
  const handleOpenCreateForm = () => { setEditingPaperId(null); resetForm(); setViewMode("forge"); };

  const handleOpenEditForm = (paper: any) => {
    setEditingPaperId(paper.id);
    const existingAuthor = registeredAuthors.find(a => a.name.toLowerCase().trim() === (paper.author || "").toLowerCase().trim());
    setIsCustomAuthor(!existingAuthor && !!paper.author);
    setResearchForm({
      title:           paper.title || "",
      type:            paper.type || "Publication",
      author:          paper.author || "",
      date:            paper.date || "",
      abstract:        paper.abstract || "",
      fullText:        paper.fullText || paper.full_text || "",
      keywords:        Array.isArray(paper.keywords) ? paper.keywords.join(", ") : (paper.keywords || ""),
      doi:             paper.doi || "",
      institution:     paper.institution || "",
      externalUrl:     paper.externalUrl || paper.external_url || "",
      showContributors: paper.showContributors ?? paper.show_contributors ?? false,
      contributors:    paper.contributors || [],
      status:          paper.status || "published",
    });
    setViewMode("forge");
  };

  // ── Submit ──────────────────────────────────────────────────────────────
  const handleUploadResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploadingResearch(true);
    setUploadProgress(0);
    setUploadLogs(editingPaperId ? ["[INIT] Initializing paper update..."] : ["[INIT] Initializing paper publication..."]);

    const logStep = async (msg: string, pct: number) => {
      await new Promise(r => setTimeout(r, 250 + Math.random() * 200));
      setUploadProgress(pct);
      setUploadLogs(prev => [...prev, msg]);
    };

    await logStep("Connecting to storage...", 25);
    await logStep("Validating document format...", 50);
    await logStep("Saving author information...", 75);

    const payload = {
      title:           researchForm.title,
      type:            researchForm.type,
      author:          researchForm.author,
      date:            researchForm.date,
      abstract:        researchForm.abstract,
      fullText:        researchForm.fullText,
      keywords:        keywordsToArray(researchForm.keywords),
      doi:             researchForm.doi || null,
      institution:     researchForm.institution || null,
      externalUrl:     researchForm.externalUrl || null,
      showContributors: researchForm.showContributors,
      contributors:    researchForm.showContributors ? researchForm.contributors.filter(c => c.name.trim()) : [],
      status:          researchForm.status,
    };

    try {
      let res: Response;
      if (editingPaperId) {
        res = await fetch(`/api/research/${editingPaperId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      } else {
        res = await fetch("/api/research", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      }
      if (!res.ok) {
        const err = await res.json();
        setUploadLogs(prev => [...prev, `[ERROR] ${err.error}`]);
        await new Promise(r => setTimeout(r, 800));
        setIsUploadingResearch(false);
        showAlertDialog("Error", err.error || "Failed to save paper.", "error");
        return;
      }
      setUploadProgress(100);
      setUploadLogs(prev => [...prev, editingPaperId ? "[SUCCESS] Research paper updated." : "[SUCCESS] Research paper published."]);
      await new Promise(r => setTimeout(r, 600));

      const titleSaved = researchForm.title;
      setIsUploadingResearch(false);
      setViewMode("overview");
      setEditingPaperId(null);
      resetForm();
      await fetchPapers();
      showAlertDialog(
        editingPaperId ? "Document Updated" : "Document Published",
        editingPaperId ? `"${titleSaved}" updated successfully.` : `"${titleSaved}" published successfully.`,
        "success"
      );
    } catch {
      setIsUploadingResearch(false);
      showAlertDialog("Network Error", "Could not connect to the server.", "error");
    }
  };

  // ── Delete ───────────────────────────────────────────────────────────────
  const handleDeleteResearch = (id: string) => {
    showConfirmDialog(
      "Confirm Deletion",
      "Are you sure you want to delete this research paper? This action cannot be undone.",
      async () => {
        const res = await fetch(`/api/research/${id}`, { method: "DELETE" });
        if (res.ok) {
          setDbPapers(prev => prev.filter(p => p.id !== id));
          if (expandedPaperId === id) setExpandedPaperId(null);
          showAlertDialog("Document Deleted", "The research document has been removed successfully.", "success");
        } else {
          showAlertDialog("Error", "Failed to delete the document.", "error");
        }
      },
      "error"
    );
  };

  // ── Filtered list ─────────────────────────────────────────────────────────
  const processedResearch = useMemo(() => {
    let list = [...dbPapers];
    if (researchSearch.trim()) {
      const q = researchSearch.toLowerCase();
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        (p.author || "").toLowerCase().includes(q) ||
        (p.abstract || "").toLowerCase().includes(q) ||
        (p.institution || "").toLowerCase().includes(q) ||
        (Array.isArray(p.keywords) ? p.keywords.join(" ") : "").toLowerCase().includes(q)
      );
    }
    if (researchTypeFilter !== "All") list = list.filter(p => p.type === researchTypeFilter);
    list.sort((a, b) => {
      const tA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const tB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      if (researchSort === "newest") return tB - tA;
      if (researchSort === "oldest") return tA - tB;
      if (researchSort === "title_az") return a.title.localeCompare(b.title);
      if (researchSort === "title_za") return b.title.localeCompare(a.title);
      return 0;
    });
    return list;
  }, [dbPapers, researchSearch, researchTypeFilter, researchSort]);

  const typeDropdownOptions = useMemo(() => {
    const list = registeredTypes.length > 0 
      ? registeredTypes.map(c => ({ value: c.name, label: c.name }))
      : ["Publication", "Milestone", "Conclusion", "Release"].map(c => ({ value: c, label: c }));
    return [...list, { value: "__add_new__", label: "+ Add Type..." }];
  }, [registeredTypes]);

  const typeStats = useMemo(() => {
    const total = registeredTypes.length;
    const inUse = registeredTypes.filter(c => dbPapers.some(p => p.type === c.name)).length;
    const unused = total - inUse;
    let topType = { name: "None", count: 0 };
    registeredTypes.forEach(c => {
      const cnt = dbPapers.filter(p => p.type === c.name).length;
      if (cnt > topType.count) {
        topType = { name: c.name, count: cnt };
      }
    });
    return { total, inUse, unused, topType };
  }, [registeredTypes, dbPapers]);

  const filteredTypes = useMemo(() => {
    if (!typeSearch.trim()) return registeredTypes;
    const q = typeSearch.toLowerCase();
    return registeredTypes.filter((c: any) => 
      c.name.toLowerCase().includes(q) || 
      c.slug.toLowerCase().includes(q)
    );
  }, [registeredTypes, typeSearch]);

  return (
    <div className="space-y-8 animate-fadeIn text-white font-sans relative">

      {/* Top Header & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#00a3ff]/10 border border-[#00a3ff]/20 flex items-center justify-center text-[#00a3ff] shadow-[0_0_20px_rgba(0,163,255,0.15)]">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
              Research Papers
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400 font-normal">
                {dbPapers.length} total
              </span>
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">Publish and manage whitepapers, milestone briefs, conclusions, and releases.</p>
          </div>
        </div>

        {viewMode === "overview" && (
          <button
            onClick={handleOpenCreateForm}
            className="px-4 py-2 bg-gradient-to-r from-[#00a3ff] to-[#0080ff] hover:from-[#0090e0] hover:to-[#0070e0] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-[0_4px_20px_rgba(0,163,255,0.3)] hover:scale-[1.02] active:scale-[0.98] shrink-0"
          >
            <Plus className="w-4 h-4" />
            Publish New Paper
          </button>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-white/10 pb-3 items-center justify-between gap-4">
        <div className="flex gap-2 sm:gap-4">
          <button
            onClick={() => {
              setViewMode("overview");
              setEditingPaperId(null);
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
              {dbPapers.length}
            </span>
          </button>
          
          <button
            onClick={() => {
              setViewMode("forge");
              setEditingPaperId(null);
              resetForm();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              viewMode === "forge" 
                ? "bg-white/10 text-white border border-white/15 shadow-sm" 
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {editingPaperId ? <Edit className="w-3.5 h-3.5 text-amber-400" /> : <Plus className="w-3.5 h-3.5 text-[#00a3ff]" />}
            {editingPaperId ? "Edit Paper" : "Publish Paper"}
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
            Type Manager
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-white/10 text-gray-300">
              {registeredTypes.length}
            </span>
          </button>
        </div>
      </div>

      {/* Publishing Progress Overlay */}
      {isUploadingResearch && (
        <div className="fixed inset-0 bg-[#020202]/90 backdrop-blur-md flex flex-col items-center justify-center z-[200] p-6 animate-fadeIn">
          <div className="w-full max-w-sm space-y-4 bg-[#0a0a0c] border border-white/10 p-6 rounded-2xl shadow-2xl">
            <div className="flex justify-between items-center text-xs font-mono text-gray-400">
              <span className="flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#00a3ff]" />
                {editingPaperId ? "UPDATING PAPER..." : "PUBLISHING PAPER..."}
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
              <h3 className="text-3xl font-bold tracking-tight text-white mb-0.5">{dbPapers.length}</h3>
              <p className="text-xs text-gray-400">Total Research Papers</p>
            </div>

            <div className="bg-gradient-to-br from-[#0c0c10] to-[#070709] rounded-2xl border border-white/[0.08] p-5 relative overflow-hidden group hover:border-[#00a3ff]/30 transition-all">
              <div className="flex justify-between items-start mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#00a3ff]/10 border border-[#00a3ff]/20 text-[#00a3ff]">
                  <BookOpen className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-[#00a3ff] uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00a3ff] animate-pulse" />
                  Papers
                </span>
              </div>
              <h3 className="text-3xl font-bold tracking-tight text-[#00a3ff] mb-0.5">
                {dbPapers.filter(p => p.type === "Publication").length}
              </h3>
              <p className="text-xs text-gray-400">Formal Publications</p>
            </div>

            <div className="bg-gradient-to-br from-[#0c0c10] to-[#070709] rounded-2xl border border-white/[0.08] p-5 relative overflow-hidden group hover:border-emerald-500/30 transition-all">
              <div className="flex justify-between items-start mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">Milestones</span>
              </div>
              <h3 className="text-3xl font-bold tracking-tight text-emerald-400 mb-0.5">
                {dbPapers.filter(p => p.type !== "Publication").length}
              </h3>
              <p className="text-xs text-gray-400">Milestones & Briefs</p>
            </div>

            <div className="bg-gradient-to-br from-[#0c0c10] to-[#070709] rounded-2xl border border-white/[0.08] p-5 relative overflow-hidden group hover:border-[#00a3ff]/30 transition-all">
              <div className="flex justify-between items-start mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#00a3ff]/10 border border-[#00a3ff]/20 text-[#00a3ff]">
                  <Layers className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-[#00a3ff] uppercase tracking-widest">Taxonomy</span>
              </div>
              <h3 className="text-3xl font-bold tracking-tight text-white mb-0.5">
                {registeredTypes.length}
              </h3>
              <p className="text-xs text-gray-400">Document Types</p>
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
                  value={researchSearch}
                  onChange={e => setResearchSearch(e.target.value)}
                  placeholder="Search papers by title, author, abstract, keywords..."
                  className="w-full bg-[#050505] border border-white/[0.08] hover:border-white/20 focus:border-[#00a3ff]/50 rounded-xl py-2.5 pl-10 pr-9 text-xs text-white placeholder-gray-500 focus:outline-none transition-all font-sans"
                />
                {researchSearch && (
                  <button onClick={() => setResearchSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Layout Switcher */}
              <div className="flex items-center bg-black/50 border border-white/10 p-1 rounded-xl shrink-0 gap-1">
                <button
                  onClick={() => setResearchLayout("grid")}
                  title="Grid View"
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                    researchLayout === "grid" ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-white"
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  Grid
                </button>
                <button
                  onClick={() => setResearchLayout("linewise")}
                  title="Table View"
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                    researchLayout === "linewise" ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-white"
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  Table
                </button>
                <button
                  onClick={() => setResearchLayout("split")}
                  title="Master-Detail View"
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                    researchLayout === "split" ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-white"
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
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Type:</span>
                  <select
                    value={researchTypeFilter}
                    onChange={e => setResearchTypeFilter(e.target.value)}
                    className="bg-[#050505] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#00a3ff]/40 cursor-pointer font-medium"
                  >
                    <option value="All">All Types</option>
                    {registeredTypes.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>

                <span className="text-gray-700 hidden sm:inline">•</span>

                <span className="text-gray-500 text-[11px] font-mono">
                  Showing {processedResearch.length} of {dbPapers.length} papers
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Sort:</span>
                <select
                  value={researchSort}
                  onChange={e => setResearchSort(e.target.value)}
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

          {/* Papers Render Area */}
          {isLoadingPapers ? (
            <div className="flex items-center justify-center p-16 bg-[#0a0a0c] rounded-2xl border border-white/[0.08]">
              <Loader2 className="w-6 h-6 animate-spin text-[#00a3ff]" />
            </div>
          ) : processedResearch.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center p-16 bg-[#0a0a0c] rounded-2xl border border-white/[0.08] space-y-4">
              <BookOpen className="w-10 h-10 text-gray-600 animate-pulse" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">No Papers Found</h3>
              <p className="text-xs text-gray-500 max-w-sm">No research documents matching your query were found.</p>
              <button 
                onClick={() => { setResearchSearch(""); setResearchTypeFilter("All"); }}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-300 transition-all cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          ) : researchLayout === "grid" ? (

            /* ─── GRID CARDS VIEW ─────────────────────────────────────────── */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {processedResearch.map((paper: any) => {
                const typeStyle = TYPE_COLORS[paper.type] || TYPE_COLORS.Publication;
                const kws: string[] = Array.isArray(paper.keywords) ? paper.keywords : [];

                return (
                  <div
                    key={paper.id}
                    className="bg-[#0a0a0c] border border-white/[0.08] hover:border-white/20 rounded-2xl p-5 flex flex-col justify-between space-y-4 group transition-all duration-200 hover:shadow-2xl text-left"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${typeStyle.bg} ${typeStyle.text} border ${typeStyle.border}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${typeStyle.dot}`} />
                          {paper.type}
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono">{paper.date}</span>
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-white group-hover:text-[#00a3ff] transition-colors line-clamp-2">
                          {paper.title}
                        </h3>
                        <p className="text-[11px] text-gray-400 mt-1">
                          by <span className="text-gray-300 font-medium">{paper.author}</span>
                          {paper.institution && <span className="text-gray-500 font-mono ml-1">({paper.institution})</span>}
                        </p>
                      </div>

                      <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                        {paper.abstract}
                      </p>

                      {kws.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {kws.slice(0, 3).map((kw, i) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-400 font-mono">
                              #{kw}
                            </span>
                          ))}
                          {kws.length > 3 && (
                            <span className="text-[10px] text-gray-600 font-mono self-center">
                              +{kws.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        {paper.doi && (
                          <span className="text-[10px] font-mono text-gray-500 truncate max-w-[100px]" title={paper.doi}>
                            DOI: {paper.doi}
                          </span>
                        )}
                        {(paper.externalUrl || paper.external_url) && (
                          <a
                            href={paper.externalUrl || paper.external_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] font-mono text-[#00a3ff] hover:underline flex items-center gap-1"
                          >
                            Link
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditForm(paper)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-[#00a3ff] hover:bg-[#00a3ff]/10 transition-all cursor-pointer"
                          title="Edit Paper"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteResearch(paper.id)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                          title="Delete Paper"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          ) : researchLayout === "linewise" ? (

            /* ─── DATA TABLE VIEW ─────────────────────────────────────────── */
            <div className="overflow-hidden border border-white/[0.08] rounded-2xl bg-[#0a0a0c] shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-[#070709] text-[10px] text-gray-400 uppercase tracking-wider font-mono">
                      <th className="p-4 pl-6">Paper Title</th>
                      <th className="p-4">Type</th>
                      <th className="p-4">Author</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 pr-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs divide-y divide-white/5">
                    {processedResearch.map((paper: any) => {
                      const typeStyle = TYPE_COLORS[paper.type] || TYPE_COLORS.Publication;
                      return (
                        <tr key={paper.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="p-4 pl-6">
                            <div>
                              <span className="font-bold text-white block">{paper.title}</span>
                              <span className="text-[10px] text-gray-500 font-mono">{paper.id}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${typeStyle.bg} ${typeStyle.text} border ${typeStyle.border}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${typeStyle.dot}`} />
                              {paper.type}
                            </span>
                          </td>
                          <td className="p-4 text-gray-300">
                            <div>{paper.author}</div>
                            {paper.institution && <span className="text-[10px] text-gray-500 font-mono">{paper.institution}</span>}
                          </td>
                          <td className="p-4 text-gray-400 font-mono text-[11px]">{paper.date}</td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              {paper.status || "published"}
                            </span>
                          </td>
                          <td className="p-4 pr-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => handleOpenEditForm(paper)}
                                className="p-1.5 rounded-lg text-gray-500 hover:text-[#00a3ff] hover:bg-[#00a3ff]/10 transition-all cursor-pointer"
                                title="Edit Paper"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => handleDeleteResearch(paper.id)}
                                className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                                title="Delete Paper"
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
              const selectedPaper = processedResearch.find(p => p.id === expandedPaperId) || processedResearch[0];
              if (!selectedPaper) return null;

              const typeStyle = TYPE_COLORS[selectedPaper.type] || TYPE_COLORS.Publication;
              const kws: string[] = Array.isArray(selectedPaper.keywords) ? selectedPaper.keywords : [];
              const contribs: Contributor[] = selectedPaper.contributors || [];

              return (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Column: List Selector */}
                  <div className="lg:col-span-4 space-y-2 max-h-[75vh] overflow-y-auto pr-1 custom-scrollbar">
                    <div className="text-[10px] font-mono uppercase tracking-widest text-gray-500 pb-2 border-b border-white/5 mb-2">
                      Research Papers ({processedResearch.length})
                    </div>
                    {processedResearch.map(p => {
                      const isSelected = p.id === selectedPaper.id;
                      return (
                        <div 
                          key={p.id}
                          onClick={() => setExpandedPaperId(p.id)}
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
                            <span>{p.author}</span>
                            <span className={`font-semibold ${TYPE_COLORS[p.type]?.text || "text-gray-400"}`}>
                              {p.type}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Right Column: Detailed Document Viewer */}
                  <div className="lg:col-span-8 bg-[#0a0a0c] border border-white/[0.08] rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-white/10">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-mono uppercase tracking-widest font-bold ${typeStyle.text}`}>
                            {selectedPaper.type}
                          </span>
                          <span className="text-gray-600">•</span>
                          <span className="text-[10px] font-mono text-gray-500">ID: {selectedPaper.id}</span>
                          <span className="text-gray-600">•</span>
                          <span className="text-[10px] font-mono text-gray-500">{selectedPaper.date}</span>
                        </div>
                        <h2 className="text-xl font-bold text-white tracking-tight mt-1">
                          {selectedPaper.title}
                        </h2>
                        <p className="text-xs text-gray-400 mt-1">
                          by <span className="text-white font-medium">{selectedPaper.author}</span>
                          {selectedPaper.institution && <span className="text-gray-500 font-mono ml-1">({selectedPaper.institution})</span>}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditForm(selectedPaper)}
                          className="p-2 rounded-xl border border-white/10 hover:border-[#00a3ff]/40 hover:bg-[#00a3ff]/10 text-gray-400 hover:text-[#00a3ff] transition-all cursor-pointer"
                          title="Edit Paper"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteResearch(selectedPaper.id)}
                          className="p-2 rounded-xl border border-white/10 hover:border-red-500/40 hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all cursor-pointer"
                          title="Delete Paper"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Keywords & Links */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      {kws.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {kws.map((kw, i) => (
                            <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300 font-mono">
                              #{kw}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-3">
                        {selectedPaper.doi && (
                          <span className="text-xs font-mono text-gray-400">
                            DOI: <span className="text-[#00a3ff]">{selectedPaper.doi}</span>
                          </span>
                        )}
                        {(selectedPaper.externalUrl || selectedPaper.external_url) && (
                          <a
                            href={selectedPaper.externalUrl || selectedPaper.external_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-mono text-[#00a3ff] hover:underline"
                          >
                            External Paper
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Abstract */}
                    <div>
                      <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mb-2">Abstract</span>
                      <p className="text-xs text-gray-300 leading-relaxed bg-[#050505] border border-white/5 rounded-xl p-4">
                        {selectedPaper.abstract}
                      </p>
                    </div>

                    {/* Contributors */}
                    {(selectedPaper.showContributors || selectedPaper.show_contributors) && contribs.length > 0 && (
                      <div>
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mb-2">Co-Authors & Contributors</span>
                        <div className="flex flex-wrap gap-2">
                          {contribs.map((c: Contributor, i: number) => (
                            <span key={i} className="text-xs px-3 py-1 bg-[#00a3ff]/5 border border-[#00a3ff]/20 rounded-lg text-[#00a3ff]">
                              {c.name}{c.role ? ` (${c.role})` : ""}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Full Document Markdown */}
                    {(selectedPaper.fullText || selectedPaper.full_text) && (
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center gap-2 text-xs font-mono text-gray-400 uppercase tracking-wider pb-2 border-b border-white/10">
                          <FileText className="w-4 h-4 text-[#00a3ff]" />
                          Full Document Body
                        </div>
                        <div className="prose prose-invert max-w-none text-xs bg-[#050505] border border-white/5 rounded-xl p-5">
                          {parseMarkdown(selectedPaper.fullText || selectedPaper.full_text)}
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              );
            })()
          )}

        </div>

      ) : viewMode === "categories" ? (

        /* ─────────────────────────────────────────────────────────────────── */
        /* ─── 2. TYPE MANAGER VIEW ────────────────────────────────────────── */
        /* ─────────────────────────────────────────────────────────────────── */
        <div className="space-y-6 animate-fadeIn">
          
          {/* Type Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-[#0c0c10] to-[#070709] rounded-2xl border border-white/[0.08] p-5 relative overflow-hidden group hover:border-[#00a3ff]/30 transition-all">
              <div className="flex justify-between items-start mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#00a3ff]/10 border border-[#00a3ff]/20 text-[#00a3ff]">
                  <Layers className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-[#00a3ff] uppercase tracking-widest">Total</span>
              </div>
              <h3 className="text-3xl font-bold tracking-tight text-white mb-0.5">{typeStats.total}</h3>
              <p className="text-xs text-gray-400">Registered Document Types</p>
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
              <h3 className="text-3xl font-bold tracking-tight text-emerald-400 mb-0.5">{typeStats.inUse}</h3>
              <p className="text-xs text-gray-400">Types With Papers</p>
            </div>

            <div className="bg-gradient-to-br from-[#0c0c10] to-[#070709] rounded-2xl border border-white/[0.08] p-5 relative overflow-hidden group hover:border-cyan-500/30 transition-all">
              <div className="flex justify-between items-start mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                  <FolderPlus className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">Available</span>
              </div>
              <h3 className="text-3xl font-bold tracking-tight text-cyan-400 mb-0.5">{typeStats.unused}</h3>
              <p className="text-xs text-gray-400">Unassigned Types</p>
            </div>

            <div className="bg-gradient-to-br from-[#0c0c10] to-[#070709] rounded-2xl border border-white/[0.08] p-5 relative overflow-hidden group hover:border-amber-500/30 transition-all">
              <div className="flex justify-between items-start mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest">Top Type</span>
              </div>
              <h3 className="text-lg font-bold tracking-tight text-white truncate mb-0.5">
                {typeStats.topType.name}
              </h3>
              <p className="text-xs text-gray-400">
                {typeStats.topType.count} {typeStats.topType.count === 1 ? "paper" : "papers"} assigned
              </p>
            </div>
          </div>

          {/* Main 2-Column Type Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ─── Left Column: Create/Edit Type Card ──────────────────────── */}
            <div className="lg:col-span-4 bg-[#0a0a0c] border border-white/[0.08] rounded-2xl p-6 space-y-5 shadow-2xl sticky top-6">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl border ${editingCategoryId ? "bg-amber-500/10 border-amber-500/20 text-amber-400" : "bg-[#00a3ff]/10 border-[#00a3ff]/20 text-[#00a3ff]"}`}>
                    {editingCategoryId ? <Edit className="w-4 h-4" /> : <FolderPlus className="w-4 h-4" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                      {editingCategoryId ? "Edit Type" : "New Type"}
                    </h3>
                    <p className="text-[10px] text-gray-500 font-mono">
                      {editingCategoryId ? "Updating existing type" : "Define taxonomy for research"}
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
                    {categoryForm.name || "Type Preview"}
                  </span>
                  <span className="text-[10px] text-gray-500 font-mono">
                    /{categoryForm.slug || "slug-preview"}
                  </span>
                </div>
                <div className="text-[10px] text-gray-500 font-mono truncate pt-1 border-t border-white/5">
                  <span className="text-gray-600">Route:</span> introlic.in/research?type={categoryForm.slug || "..."}
                </div>
              </div>

              {/* Type Form */}
              <form onSubmit={handleSaveCategory} className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">
                    Type Name <span className="text-red-400">*</span>
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
                    placeholder="e.g. Technical Brief"
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
                      placeholder="e.g. technical-brief"
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
                    disabled={isSavingType}
                    className={`flex-1 py-2.5 text-white rounded-xl text-xs font-bold uppercase cursor-pointer transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 ${
                      editingCategoryId 
                        ? "bg-amber-500 hover:bg-amber-600 text-black shadow-amber-500/20" 
                        : "bg-gradient-to-r from-[#00a3ff] to-[#0080ff] hover:from-[#0090e0] hover:to-[#0070e0] shadow-[0_4px_20px_rgba(0,163,255,0.25)]"
                    }`}
                  >
                    {isSavingType ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    {editingCategoryId ? "Update Type" : "Create Type"}
                  </button>
                </div>
              </form>
            </div>

            {/* ─── Right Column: Type Directory (Search + Cards/Table) ─────── */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* Type Search & Layout Toolbar */}
              <div className="bg-[#0a0a0c] border border-white/[0.08] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={typeSearch}
                    onChange={e => setTypeSearch(e.target.value)}
                    placeholder="Search document types by name or slug..."
                    className="w-full bg-[#050505] border border-white/[0.08] hover:border-white/20 focus:border-[#00a3ff]/50 rounded-xl py-2 pl-10 pr-9 text-xs text-white placeholder-gray-600 focus:outline-none transition-all font-sans"
                  />
                  {typeSearch && (
                    <button 
                      onClick={() => setTypeSearch("")} 
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <span className="text-xs font-mono text-gray-500">
                    {filteredTypes.length} of {registeredTypes.length}
                  </span>

                  <div className="flex items-center bg-black/50 border border-white/10 p-1 rounded-xl shrink-0 gap-1">
                    <button
                      onClick={() => setTypeViewLayout("cards")}
                      title="Cards View"
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                        typeViewLayout === "cards" ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-white"
                      }`}
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      Cards
                    </button>
                    <button
                      onClick={() => setTypeViewLayout("table")}
                      title="Table View"
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                        typeViewLayout === "table" ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-white"
                      }`}
                    >
                      <List className="w-3.5 h-3.5" />
                      Table
                    </button>
                  </div>
                </div>
              </div>

              {/* Empty Search State */}
              {filteredTypes.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center p-12 bg-[#0a0a0c] rounded-2xl border border-white/[0.08] space-y-3">
                  <Layers className="w-8 h-8 text-gray-600" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">No Types Match</h4>
                  <p className="text-xs text-gray-500">No document types found matching &quot;{typeSearch}&quot;.</p>
                  <button 
                    onClick={() => setTypeSearch("")}
                    className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-300 transition-all"
                  >
                    Clear Search
                  </button>
                </div>
              ) : typeViewLayout === "cards" ? (

                /* ─── CARDS GRID VIEW ─────────────────────────────────────── */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredTypes.map((cat: any) => {
                    const count = dbPapers.filter(p => p.type === cat.name).length;
                    const theme = TYPE_COLORS[cat.name] || TYPE_COLORS.Publication;
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
                              {count} {count === 1 ? "Paper" : "Papers"}
                            </span>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                          <a
                            href={`/research?type=${encodeURIComponent(cat.name)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-gray-400 hover:text-[#00a3ff] transition-colors"
                          >
                            View Papers
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
                              title="Edit Type"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => handleDeleteCategory(cat.id)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                              title="Delete Type"
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
                          <th className="p-4 pl-6">Document Type</th>
                          <th className="p-4">URL Slug</th>
                          <th className="p-4 text-center">Papers</th>
                          <th className="p-4 text-center">Status</th>
                          <th className="p-4 pr-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="text-xs divide-y divide-white/5">
                        {filteredTypes.map((cat: any) => {
                          const count = dbPapers.filter(p => p.type === cat.name).length;
                          const theme = TYPE_COLORS[cat.name] || TYPE_COLORS.Publication;
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
                                  {count} {count === 1 ? "paper" : "papers"}
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
                                    title="Edit Type"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteCategory(cat.id)}
                                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                                    title="Delete Type"
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
        /* ─── 3. PUBLISH / EDIT PAPER FORM ────────────────────────────────── */
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
                  {editingPaperId ? "Edit Research Paper" : "Publish New Research Paper"}
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#00a3ff]/10 text-[#00a3ff] border border-[#00a3ff]/20">
                    {editingPaperId ? "UPDATE MODE" : "NEW DRAFT"}
                  </span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Fill in the paper details and author affiliations below.</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => { setViewMode("overview"); setEditingPaperId(null); resetForm(); }}
              className="px-4 py-2 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/5 text-xs text-gray-400 hover:text-white font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Overview
            </button>
          </div>

          <form onSubmit={handleUploadResearch} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

              {/* Left Column: Core Details & Markdown Body */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Paper Title */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">
                    Paper Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={researchForm.title}
                    onChange={e => setResearchForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Scaling Mixture of Quantized Attentions"
                    className="bg-[#050505] border border-white/[0.08] hover:border-white/20 focus:border-[#00a3ff]/50 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none transition-all font-sans font-medium"
                  />
                </div>

                {/* Type & Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">
                      Document Type <span className="text-red-400">*</span>
                    </label>
                    <FormDropdown
                      label=""
                      value={researchForm.type}
                      options={typeDropdownOptions}
                      onChange={val => {
                        if (val === "__add_new__") {
                          setNewTypeName("");
                          setShowAddTypeModal(true);
                        } else {
                          setResearchForm(prev => ({ ...prev, type: val }));
                        }
                      }}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">
                      Publication Status
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(["published", "draft"] as const).map(s => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setResearchForm(prev => ({ ...prev, status: s }))}
                          className={`py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border cursor-pointer ${
                            researchForm.status === s
                              ? s === "published"
                                ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-sm"
                                : "bg-amber-500/10 border-amber-500/40 text-amber-400 shadow-sm"
                              : "bg-[#050505] border-white/5 text-gray-600 hover:text-gray-400"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Abstract Textarea */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">
                    Abstract Summary <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    required
                    value={researchForm.abstract}
                    onChange={e => setResearchForm(prev => ({ ...prev, abstract: e.target.value }))}
                    rows={4}
                    placeholder="Comprehensive executive abstract of the methodology, benchmarks, and experimental conclusions..."
                    className="bg-[#050505] border border-white/[0.08] hover:border-white/20 focus:border-[#00a3ff]/50 rounded-xl p-4 text-xs text-white placeholder-gray-600 focus:outline-none transition-all resize-none font-sans leading-relaxed"
                  />
                </div>

                {/* Full Document Body with Markdown Editor */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">
                      Full Paper Document (Markdown)
                    </label>
                    <div className="flex bg-black/50 border border-white/10 p-0.5 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setFullTextTab("write")}
                        className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          fullTextTab === "write" ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-white"
                        }`}
                      >
                        Write
                      </button>
                      <button
                        type="button"
                        onClick={() => setFullTextTab("preview")}
                        className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          fullTextTab === "preview" ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-white"
                        }`}
                      >
                        Live Preview
                      </button>
                    </div>
                  </div>

                  {fullTextTab === "write" ? (
                    <div className="space-y-2">
                      <MarkdownToolbar
                        textareaRef={fullTextRef}
                        value={researchForm.fullText}
                        onChange={val => setResearchForm(prev => ({ ...prev, fullText: val }))}
                      />
                      <textarea
                        ref={fullTextRef}
                        value={researchForm.fullText}
                        onChange={e => setResearchForm(prev => ({ ...prev, fullText: e.target.value }))}
                        rows={16}
                        placeholder={`# Abstract\n\n## 1. Introduction\n\n## 2. Mathematical Architecture\n\n## 3. Empirical Evaluation\n\n## 4. Conclusion`}
                        className="w-full bg-[#050505] border border-white/[0.08] hover:border-white/20 focus:border-[#00a3ff]/50 rounded-xl p-4 text-xs text-white placeholder-gray-600 focus:outline-none transition-all font-mono leading-relaxed resize-y min-h-[260px]"
                      />
                    </div>
                  ) : (
                    <div className="bg-[#050505] border border-white/[0.08] rounded-xl p-6 text-left overflow-y-auto max-h-[500px] min-h-[260px] prose prose-invert max-w-none text-xs">
                      {parseMarkdown(researchForm.fullText || "# Document Preview\n*No document text entered yet.*")}
                    </div>
                  )}
                </div>

              </div>

              {/* Right Column: Author Affiliations, Dates & Metadata */}
              <div className="lg:col-span-5 space-y-6">

                {/* Author & Affiliation */}
                <div className="bg-[#050505] border border-white/[0.08] rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                    <Users className="w-4 h-4 text-[#00a3ff]" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">Author & Affiliation</span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">Lead Author</label>
                    <FormDropdown
                      label=""
                      value={isCustomAuthor ? "__custom__" : (researchForm.author || "")}
                      options={authorOptions}
                      placeholder="Select Lead Author..."
                      onChange={val => {
                        if (val === "__custom__") {
                          setIsCustomAuthor(true);
                          setResearchForm(prev => ({ ...prev, author: "" }));
                        } else {
                          setIsCustomAuthor(false);
                          setResearchForm(prev => ({ ...prev, author: val }));
                        }
                      }}
                    />
                    {isCustomAuthor && (
                      <input
                        type="text"
                        required
                        value={researchForm.author}
                        onChange={e => setResearchForm(prev => ({ ...prev, author: e.target.value }))}
                        placeholder="e.g. Dr. Jane Doe"
                        className="bg-[#0a0a0a] border border-[#00a3ff]/30 focus:border-[#00a3ff]/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none transition-all font-sans mt-1"
                      />
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">Institution / Lab</label>
                    <div className="relative">
                      <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600" />
                      <input
                        type="text"
                        value={researchForm.institution}
                        onChange={e => setResearchForm(prev => ({ ...prev, institution: e.target.value }))}
                        placeholder="e.g. Introlic AI Research"
                        className="bg-[#0a0a0a] border border-white/[0.08] hover:border-white/20 focus:border-[#00a3ff]/50 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none transition-all font-sans w-full"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">Date Published</label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600" />
                      <input
                        type="text"
                        required
                        value={researchForm.date}
                        onChange={e => setResearchForm(prev => ({ ...prev, date: e.target.value }))}
                        placeholder="e.g. AUG 2026"
                        className="bg-[#0a0a0a] border border-white/[0.08] hover:border-white/20 focus:border-[#00a3ff]/50 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none transition-all font-sans w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Keywords & Identifiers */}
                <div className="bg-[#050505] border border-white/[0.08] rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                    <Tag className="w-4 h-4 text-[#00a3ff]" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">Identifiers & Tags</span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">Keywords (Comma-separated)</label>
                    <input
                      type="text"
                      value={researchForm.keywords}
                      onChange={e => setResearchForm(prev => ({ ...prev, keywords: e.target.value }))}
                      placeholder="e.g. Attention, Quantization, Transformer, CUDA"
                      className="bg-[#0a0a0a] border border-white/[0.08] hover:border-white/20 focus:border-[#00a3ff]/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none transition-all font-sans"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">DOI (Digital Object Identifier)</label>
                    <input
                      type="text"
                      value={researchForm.doi}
                      onChange={e => setResearchForm(prev => ({ ...prev, doi: e.target.value }))}
                      placeholder="e.g. 10.1000/182"
                      className="bg-[#0a0a0a] border border-white/[0.08] hover:border-white/20 focus:border-[#00a3ff]/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none transition-all font-mono"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">External URL / ArXiv Link</label>
                    <div className="relative">
                      <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600" />
                      <input
                        type="url"
                        value={researchForm.externalUrl}
                        onChange={e => setResearchForm(prev => ({ ...prev, externalUrl: e.target.value }))}
                        placeholder="https://arxiv.org/abs/..."
                        className="bg-[#0a0a0a] border border-white/[0.08] hover:border-white/20 focus:border-[#00a3ff]/50 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none transition-all font-sans w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Contributors Toggle & Manager */}
                <div className="bg-[#050505] border border-white/[0.08] rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#00a3ff]" />
                      <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">Co-Authors & Contributors</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setResearchForm(prev => ({ ...prev, showContributors: !prev.showContributors }))}
                      className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                    >
                      {researchForm.showContributors ? (
                        <><ToggleRight className="w-5 h-5 text-[#00a3ff]" /><span className="text-[#00a3ff]">Enabled</span></>
                      ) : (
                        <><ToggleLeft className="w-5 h-5 text-gray-600" /><span className="text-gray-600">Disabled</span></>
                      )}
                    </button>
                  </div>

                  {researchForm.showContributors && (
                    <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 pt-1">
                      <p className="text-[10px] text-gray-500">Co-authors will be cited on the published document page.</p>
                      {researchForm.contributors.map((contributor, i) => (
                        <div key={i} className="flex gap-2 items-start">
                          <div className="flex-1 grid grid-cols-2 gap-2">
                            <div className="relative">
                              <input
                                type="text"
                                value={contributor.name}
                                onChange={e => updateContributor(i, "name", e.target.value)}
                                placeholder="Co-Author Name"
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
                              placeholder="Role (e.g. Co-Lead)"
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
                        Add Co-Author
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
                onClick={() => { setViewMode("overview"); setEditingPaperId(null); resetForm(); }}
                className="px-6 py-2.5 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/5 text-xs text-gray-400 hover:text-white font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-8 py-2.5 rounded-xl bg-gradient-to-r from-[#00a3ff] to-[#0080ff] hover:from-[#0090e0] hover:to-[#0070e0] text-white font-bold text-xs uppercase tracking-wider cursor-pointer transition-all shadow-[0_4px_25px_rgba(0,163,255,0.3)] hover:scale-[1.02] active:scale-[0.98]"
              >
                <Sparkles className="w-4 h-4" />
                {editingPaperId ? "Update Paper" : "Publish Paper"}
              </button>
            </div>
          </form>

        </div>
      )}

      {/* Dynamic Type Modal */}
      <AnimatePresence>
        {showAddTypeModal && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddTypeModal(false)}
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
                onClick={() => setShowAddTypeModal(false)}
                className="absolute top-4 right-4 p-1 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-white/[0.02] border border-white/5 shrink-0">
                  <Plus className="w-5 h-5 text-[#00a3ff]" />
                </div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Add Document Type
                </h3>
              </div>

              <form onSubmit={handleCreateTypeSubmit} className="space-y-4 font-sans">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest font-mono">Type Name</label>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={newTypeName}
                    onChange={e => setNewTypeName(e.target.value)}
                    placeholder="e.g. Technical Brief"
                    className="bg-[#0a0a0a] border border-white/[0.08] focus:border-[#00a3ff]/40 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none transition-all w-full"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddTypeModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-white/5 hover:border-white/10 hover:bg-white/5 text-gray-400 hover:text-white text-xs font-bold transition-all text-center uppercase tracking-wider cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingType}
                    className="flex-1 py-2.5 rounded-xl bg-[#00a3ff] hover:bg-[#0090e0] text-white text-xs font-bold transition-all text-center uppercase tracking-wider shadow-lg flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isSavingType ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                    Add Type
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
