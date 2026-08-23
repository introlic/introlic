"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { 
  Cpu, Trash2, Search, X, ArrowLeft, ArrowRight,
  Loader2, Sparkles, BookOpen, Edit, Plus, FileText, CheckCircle, Users,
  Globe, Layers, Link2, ChevronDown, Tag, Compass, Calendar, Database,
  LayoutGrid, List, Columns, ExternalLink, Code, Bold, Italic,
  Quote, Heading2, Check, Eye, Pencil, RefreshCw, AlertCircle,
  Copy, CheckCheck, Hash, FolderPlus, Folder
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { parseMarkdown } from "@/components/blog/MarkdownRenderer";
import { GithubIcon } from "@/components/SocialIcons";
import AdminDialog from "@/components/admin/AdminDialog";

// Standard options matching public index page
const STATUSES = ["Active", "Planning", "Recruiting", "Paused"];

const POPULAR_TAGS = [
  "React", "Next.js", "TypeScript", "Python", "PyTorch", "Rust", 
  "C++", "C#", "Unity", "Unreal Engine", "WebGL", "Three.js", 
  "TailwindCSS", "Node.js", "AI / ML", "CUDA", "WASM", "PostgreSQL"
];

const CATEGORY_THEMES: Record<string, { bg: string; text: string; border: string; glow: string; dot: string }> = {
  "AI / ML": { bg: "bg-[#00a3ff]/10", text: "text-[#00a3ff]", border: "border-[#00a3ff]/20", glow: "shadow-[0_0_15px_rgba(0,163,255,0.15)]", dot: "bg-[#00a3ff]" },
  "Game": { bg: "bg-sky-500/10", text: "text-sky-400", border: "border-sky-500/20", glow: "shadow-[0_0_15px_rgba(56,189,248,0.15)]", dot: "bg-sky-400" },
  "Research": { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20", glow: "shadow-[0_0_15px_rgba(59,130,246,0.15)]", dot: "bg-blue-400" },
  "Science": { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", glow: "shadow-[0_0_15px_rgba(16,185,129,0.15)]", dot: "bg-emerald-400" },
  "Creative": { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20", glow: "shadow-[0_0_15px_rgba(245,158,11,0.15)]", dot: "bg-amber-400" },
  "Tool": { bg: "bg-[#00a3ff]/10", text: "text-[#00a3ff]", border: "border-[#00a3ff]/20", glow: "shadow-[0_0_15px_rgba(0,163,255,0.15)]", dot: "bg-[#00a3ff]" },
  "Community": { bg: "bg-teal-500/10", text: "text-teal-400", border: "border-teal-500/20", glow: "shadow-[0_0_15px_rgba(20,184,166,0.15)]", dot: "bg-teal-400" },
  "Infrastructure": { bg: "bg-white/5", text: "text-gray-300", border: "border-white/10", glow: "shadow-[0_0_15px_rgba(255,255,255,0.05)]", dot: "bg-gray-300" },
  "Web3": { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", glow: "shadow-[0_0_15px_rgba(16,185,129,0.15)]", dot: "bg-emerald-400" },
  "Design": { bg: "bg-[#00a3ff]/10", text: "text-[#00a3ff]", border: "border-[#00a3ff]/20", glow: "shadow-[0_0_15px_rgba(0,163,255,0.15)]", dot: "bg-[#00a3ff]" },
  "Education": { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20", glow: "shadow-[0_0_15px_rgba(59,130,246,0.15)]", dot: "bg-blue-400" },
};

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; border: string; dot: string }> = {
  Active: {
    label: "Active",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
    dot: "bg-emerald-400"
  },
  Recruiting: {
    label: "Recruiting",
    bg: "bg-[#00a3ff]/10",
    text: "text-[#00a3ff]",
    border: "border-[#00a3ff]/20",
    dot: "bg-[#00a3ff]"
  },
  Planning: {
    label: "Planning",
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/20",
    dot: "bg-amber-400"
  },
  Paused: {
    label: "Paused",
    bg: "bg-zinc-500/10",
    text: "text-zinc-400",
    border: "border-zinc-500/20",
    dot: "bg-zinc-400"
  }
};

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
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const optionList = useMemo(() => {
    return options.map(opt => {
      if (typeof opt === "string") {
        return { value: opt, label: opt };
      }
      return opt;
    });
  }, [options]);

  const selectedLabel = optionList.find(o => o.value === value)?.label || value || placeholder;

  return (
    <div ref={ref} className="flex flex-col gap-1.5 relative">
      {label && <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">{label}</label>}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between bg-[#0a0a0c] border border-white/[0.08] hover:border-white/20 px-4 py-2.5 rounded-xl text-xs text-white text-left transition-all duration-200 cursor-pointer font-sans shadow-sm"
        style={{ borderColor: open ? "rgba(0,163,255,0.5)" : undefined }}
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 shrink-0 ${open ? 'rotate-180 text-[#00a3ff]' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-1.5 w-full bg-[#0d0d10] border border-white/10 rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9)] z-50 max-h-56 overflow-y-auto custom-scrollbar"
          >
            {optionList.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-xs text-left transition-colors duration-150 cursor-pointer ${
                  value === opt.value
                    ? "text-[#00a3ff] bg-[#00a3ff]/10 font-bold"
                    : "text-gray-400 hover:text-white hover:bg-white/[0.04]"
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

const getTodayDateString = () => {
  return new Date().toISOString().split('T')[0];
};

const formatDateDeterministic = (dateStr: string) => {
  if (!dateStr) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [year, month, day] = dateStr.split('-');
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const monthIndex = parseInt(month, 10) - 1;
    const monthName = months[monthIndex] || month;
    return `${monthName} ${parseInt(day, 10)}, ${year}`;
  }
  return dateStr;
};

export default function ProjectsClient() {
  const [isUploadingProject, setIsUploadingProject] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadLogs, setUploadLogs] = useState<string[]>([]);
  const [dialog, setDialog] = useState<{
    isOpen: boolean;
    type: "alert" | "confirm";
    title: string;
    message: string;
    onConfirm?: () => void;
    severity?: "info" | "success" | "error" | "warning";
  }>({
    isOpen: false,
    type: "alert",
    title: "",
    message: "",
  });

  const showAlertDialog = (title: string, message: string, severity: "info" | "success" | "error" | "warning" = "info") => {
    setDialog({
      isOpen: true,
      type: "alert",
      title,
      message,
      severity,
    });
  };

  const showConfirmDialog = (title: string, message: string, onConfirm: () => void, severity: "info" | "success" | "error" | "warning" = "warning") => {
    setDialog({
      isOpen: true,
      type: "confirm",
      title,
      message,
      onConfirm,
      severity,
    });
  };

  const [registeredAuthors, setRegisteredAuthors] = useState<any[]>([]);
  const [isCustomAuthor, setIsCustomAuthor] = useState(false);

  useEffect(() => {
    fetch("/api/authors")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRegisteredAuthors(data);
        }
      })
      .catch(err => console.error("Error loading authors:", err));
  }, []);

  const authorOptions = useMemo(() => {
    const list = registeredAuthors.map(a => ({
      value: a.name,
      label: a.name
    }));
    return [
      ...list,
      { value: "__custom__", label: "Custom Author (Text)..." }
    ];
  }, [registeredAuthors]);

  const [authorRoles, setAuthorRoles] = useState(["Lead Developer", "Lead Researcher", "Core Contributor", "Art Director", "Writer", "Sound Designer"]);
  const [showNewRoleInput, setShowNewRoleInput] = useState(false);
  const [newRoleText, setNewRoleText] = useState("");

  const handleAddNewRole = () => {
    const trimmed = newRoleText.trim();
    if (trimmed && !authorRoles.includes(trimmed)) {
      const updated = [...authorRoles, trimmed];
      setAuthorRoles(updated);
      setProjectForm(prev => ({ ...prev, authorRole: trimmed }));
      if (typeof window !== "undefined") {
        localStorage.setItem("introlic_author_roles", JSON.stringify(updated));
      }
    }
    setNewRoleText("");
    setShowNewRoleInput(false);
  };

  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"overview" | "forge" | "categories">("overview");
  const [readmeTab, setReadmeTab] = useState<"write" | "preview">("write");

  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categoryForm, setCategoryForm] = useState({ name: "", slug: "" });

  const [projectForm, setProjectForm] = useState({
    title: "",
    category: "Game",
    author: "",
    authorRole: "Lead Developer",
    status: "Active",
    started: getTodayDateString(),
    openTo: "",
    tags: "",
    topic: "",
    why: "",
    factors: "",
    readme: "",
    githubUrl: "",
    demoUrl: "",
    logoUrl: ""
  });

  const [projectsList, setProjectsList] = useState<any[]>([]);

  // Logo upload state
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [projectSearch, setProjectSearch] = useState("");
  const [projectCategoryFilter, setProjectCategoryFilter] = useState("All");
  const [projectStatusFilter, setProjectStatusFilter] = useState("All");
  const [projectSort, setProjectSort] = useState("newest");
  const [projectLayout, setProjectLayout] = useState<"grid" | "linewise" | "split">("grid");
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);

  const [customTagInput, setCustomTagInput] = useState("");

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

  const categoryStats = useMemo(() => {
    const total = registeredCategories.length;
    const inUse = registeredCategories.filter(c => projectsList.some(p => p.category === c.name)).length;
    const unused = total - inUse;
    let topCategory = { name: "None", count: 0 };
    registeredCategories.forEach(c => {
      const cnt = projectsList.filter(p => p.category === c.name).length;
      if (cnt > topCategory.count) {
        topCategory = { name: c.name, count: cnt };
      }
    });
    return { total, inUse, unused, topCategory };
  }, [registeredCategories, projectsList]);

  const filteredCategories = useMemo(() => {
    if (!categorySearch.trim()) return registeredCategories;
    const q = categorySearch.toLowerCase();
    return registeredCategories.filter((c: any) => 
      c.name.toLowerCase().includes(q) || 
      c.slug.toLowerCase().includes(q)
    );
  }, [registeredCategories, categorySearch]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories?type=project");
      if (res.ok) {
        const data = await res.json();
        setRegisteredCategories(data || []);
      }
    } catch (err) {
      console.error("Error fetching project categories:", err);
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
        body: JSON.stringify({ name: newCategoryName.trim(), type: "project" })
      });
      if (res.ok) {
        const newCat = await res.json();
        setProjectForm(prev => ({ ...prev, category: newCat.name }));
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

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        setProjectsList(data || []);
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  // Load from database & local roles config
  useEffect(() => {
    fetchCategories();
    fetchProjects();
    if (typeof window !== "undefined") {
      const storedRoles = localStorage.getItem("introlic_author_roles");
      if (storedRoles) {
        setAuthorRoles(JSON.parse(storedRoles));
      }
    }
  }, []);

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
          body: JSON.stringify({ ...categoryForm, type: "project" }),
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
    const count = projectsList.filter(p => p.category === cat.name).length;
    if (count > 0) {
      showAlertDialog(
        "Cannot Delete",
        `Category "${cat.name}" is in use by ${count} project(s). Please reassign those projects before deleting.`,
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

  const resetForm = () => {
    setProjectForm({
      title: "",
      category: "Game",
      author: "",
      authorRole: "Lead Developer",
      status: "Active",
      started: getTodayDateString(),
      openTo: "",
      tags: "",
      topic: "",
      why: "",
      factors: "",
      readme: "",
      githubUrl: "",
      demoUrl: "",
      logoUrl: ""
    });
    setCustomTagInput("");
    setLogoFile(null);
    setLogoPreview("");
  };

  const handleOpenCreateForm = () => {
    setEditingProjectId(null);
    setIsCustomAuthor(false);
    resetForm();
    setViewMode("forge");
  };

  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleUploadLogo = async (): Promise<string | null> => {
    if (!logoFile) return projectForm.logoUrl || null;
    setIsUploadingLogo(true);
    try {
      const fd = new FormData();
      fd.append("thumbnail", logoFile);
      const res = await fetch("/api/upload/thumbnail", { method: "POST", body: fd });
      if (!res.ok) {
        const err = await res.json();
        showAlertDialog("Upload Failed", err.error || "Could not upload project logo.", "error");
        return null;
      }
      const { url } = await res.json();
      return url;
    } catch {
      showAlertDialog("Upload Failed", "Network error while uploading logo.", "error");
      return null;
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleOpenEditForm = (project: any) => {
    setEditingProjectId(project.id);
    const hasAuthor = registeredAuthors.some(a => a.name === project.author);
    setIsCustomAuthor(!hasAuthor);

    setProjectForm({
      title: project.title || "",
      category: project.category || "Game",
      author: project.author || "",
      authorRole: project.authorRole || "Lead Developer",
      status: project.status || "Active",
      started: project.started ? project.started.split('T')[0] : getTodayDateString(),
      openTo: project.openTo || "",
      tags: Array.isArray(project.tags) ? project.tags.join(", ") : (project.tags || ""),
      topic: project.topic || "",
      why: project.why || "",
      factors: Array.isArray(project.factors) ? project.factors.join("\n") : (project.factors || ""),
      readme: project.readme || "",
      githubUrl: project.githubUrl || "",
      demoUrl: project.demoUrl || "",
      logoUrl: project.logoUrl || ""
    });

    setLogoFile(null);
    setLogoPreview(project.logoUrl || "");
    setViewMode("forge");
  };

  const handleUploadProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploadingProject(true);
    setUploadProgress(0);
    setUploadLogs([editingProjectId ? "[INIT] Initializing project update..." : "[INIT] Initializing project creation..."]);

    const logStep = async (msg: string, pct: number) => {
      await new Promise(res => setTimeout(res, 200 + Math.random() * 200));
      setUploadProgress(pct);
      setUploadLogs(prev => [...prev, msg]);
    };

    await logStep("Saving project record and parameters...", 30);
    await logStep("Validating markdown content and tags...", 50);

    // Upload logo if a new file is selected
    let finalLogoUrl = projectForm.logoUrl;
    if (logoFile) {
      await logStep("Uploading project logo...", 70);
      const uploadedUrl = await handleUploadLogo();
      if (!uploadedUrl && logoFile) {
        setIsUploadingProject(false);
        return;
      }
      finalLogoUrl = uploadedUrl || "";
    }

    await logStep("Finalizing database entry...", 90);
    await logStep(editingProjectId ? "[SUCCESS] Project successfully updated." : "[SUCCESS] Project successfully created.", 100);

    const projectPayload = {
      title: projectForm.title,
      category: projectForm.category,
      author: projectForm.author,
      authorRole: projectForm.authorRole,
      status: projectForm.status,
      started: projectForm.started,
      openTo: projectForm.openTo,
      tags: typeof projectForm.tags === "string" ? projectForm.tags.split(",").map(t => t.trim()).filter(Boolean) : projectForm.tags,
      topic: projectForm.topic,
      why: projectForm.why,
      factors: typeof projectForm.factors === "string" ? projectForm.factors.split("\n").map(f => f.trim()).filter(Boolean) : projectForm.factors,
      readme: projectForm.readme,
      githubUrl: projectForm.githubUrl,
      demoUrl: projectForm.demoUrl,
      logoUrl: finalLogoUrl
    };

    try {
      let res: Response;
      if (editingProjectId) {
        res = await fetch(`/api/projects/${editingProjectId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(projectPayload),
        });
      } else {
        res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(projectPayload),
        });
      }

      if (res.ok) {
        await fetchProjects();
        setTimeout(() => {
          setIsUploadingProject(false);
          setUploadProgress(0);
          setUploadLogs([]);
          setViewMode("overview");
          const titleSaved = projectForm.title;
          setEditingProjectId(null);
          resetForm();
          showAlertDialog(
            editingProjectId ? "Project Updated" : "Project Created",
            editingProjectId ? `Project "${titleSaved}" Updated Successfully.` : `Project "${titleSaved}" Created Successfully.`,
            "success"
          );
        }, 500);
      } else {
        setIsUploadingProject(false);
        const err = await res.json();
        showAlertDialog("Error", err.error || "Failed to save project.", "error");
      }
    } catch {
      setIsUploadingProject(false);
      showAlertDialog("Network Error", "Could not connect to the server.", "error");
    }
  };

  const handleDeleteProject = (id: string) => {
    showConfirmDialog(
      "Confirm Deletion",
      "Are you sure you want to delete this project? This action cannot be undone.",
      async () => {
        try {
          const res = await fetch(`/api/projects/${id}`, {
            method: "DELETE",
          });
          if (res.ok) {
            setProjectsList(prev => prev.filter(p => p.id !== id));
            if (expandedProjectId === id) setExpandedProjectId(null);
            showAlertDialog("Project Deleted", "The project has been removed successfully.", "success");
          } else {
            const err = await res.json();
            showAlertDialog("Error", err.error || "Failed to delete project.", "error");
          }
        } catch {
          showAlertDialog("Network Error", "Could not connect to the server.", "error");
        }
      },
      "error"
    );
  };

  // ─── localStorage → DB Migration ────────────────────────────────────────────
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationResult, setMigrationResult] = useState<string | null>(null);

  const handleMigrateFromLocalStorage = async () => {
    setIsMigrating(true);
    setMigrationResult(null);
    try {
      const candidateKeys = ["introlic_projects", "projects", "project_list", "introlic-projects"];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && !candidateKeys.includes(k)) {
          candidateKeys.push(k);
        }
      }

      let localProjects: any[] = [];
      let foundKey = "";
      for (const key of candidateKeys) {
        try {
          const raw = localStorage.getItem(key);
          if (!raw) continue;
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.title) {
            localProjects = parsed;
            foundKey = key;
            break;
          }
        } catch { /* skip */ }
      }

      if (localProjects.length === 0) {
        setMigrationResult("No local project data found in localStorage. Nothing to migrate.");
        setIsMigrating(false);
        return;
      }

      let migrated = 0;
      let skipped = 0;
      const errors: string[] = [];

      for (const p of localProjects) {
        try {
          const res = await fetch("/api/projects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: p.id,
              title: p.title,
              category: p.category,
              author: p.author,
              authorRole: p.authorRole,
              status: p.status,
              started: p.started,
              openTo: p.openTo,
              tags: Array.isArray(p.tags) ? p.tags : [],
              topic: p.topic,
              why: p.why,
              factors: Array.isArray(p.factors) ? p.factors : [],
              readme: p.readme,
              githubUrl: p.githubUrl,
              demoUrl: p.demoUrl,
              logoUrl: p.logoUrl,
            }),
          });
          if (res.ok) {
            migrated++;
          } else {
            const err = await res.json();
            if (res.status === 409 || (err?.error || "").toLowerCase().includes("duplicate") || (err?.error || "").toLowerCase().includes("already")) {
              skipped++;
            } else {
              errors.push(`"${p.title}": ${err.error || res.status}`);
            }
          }
        } catch {
          errors.push(`"${p.title}": network error`);
        }
      }

      await fetchProjects();
      const parts = [`✅ Migrated ${migrated} of ${localProjects.length} project(s) from key "${foundKey}" to database.`];
      if (skipped > 0) parts.push(`⏭ ${skipped} already existed (skipped).`);
      if (errors.length > 0) parts.push(`❌ Errors: ${errors.join("; ")}`);
      setMigrationResult(parts.join(" "));
    } catch (e: any) {
      setMigrationResult(`❌ Migration failed: ${e.message}`);
    } finally {
      setIsMigrating(false);
    }
  };

  const currentTags = useMemo(() => {
    return projectForm.tags
      .split(",")
      .map(t => t.trim())
      .filter(Boolean);
  }, [projectForm.tags]);

  const toggleTag = (tag: string) => {
    let updatedTags: string[];
    if (currentTags.includes(tag)) {
      updatedTags = currentTags.filter(t => t !== tag);
    } else {
      updatedTags = [...currentTags, tag];
    }
    setProjectForm(prev => ({
      ...prev,
      tags: updatedTags.join(", ")
    }));
  };

  const handleAddCustomTag = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    const tag = customTagInput.trim();
    if (tag && !currentTags.includes(tag)) {
      const updatedTags = [...currentTags, tag];
      setProjectForm(prev => ({
        ...prev,
        tags: updatedTags.join(", ")
      }));
    }
    setCustomTagInput("");
  };

  const insertMarkdownSnippet = (snippet: string) => {
    setProjectForm(prev => ({
      ...prev,
      readme: prev.readme ? `${prev.readme}\n${snippet}` : snippet
    }));
  };

  const processedProjects = useMemo(() => {
    let list = [...projectsList];

    if (projectSearch.trim()) {
      const q = projectSearch.toLowerCase();
      list = list.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q) ||
        (p.authorRole && p.authorRole.toLowerCase().includes(q)) ||
        (p.topic && p.topic.toLowerCase().includes(q)) ||
        (p.tags && p.tags.some((t: string) => t.toLowerCase().includes(q)))
      );
    }

    if (projectCategoryFilter !== "All") {
      list = list.filter(p => p.category === projectCategoryFilter);
    }
    if (projectStatusFilter !== "All") {
      list = list.filter(p => p.status === projectStatusFilter);
    }

    list.sort((a, b) => {
      if (projectSort === "newest") return (b.createdAt || 0) - (a.createdAt || 0);
      if (projectSort === "oldest") return (a.createdAt || 0) - (b.createdAt || 0);
      if (projectSort === "title_az") return a.title.localeCompare(b.title);
      if (projectSort === "title_za") return b.title.localeCompare(a.title);
      return 0;
    });

    return list;
  }, [projectsList, projectSearch, projectCategoryFilter, projectStatusFilter, projectSort]);

  const categoryDropdownOptions = useMemo(() => {
    const list = registeredCategories.length > 0 
      ? registeredCategories.map(c => ({ value: c.name, label: c.name }))
      : ["Game", "Research", "Tool", "Community", "Science", "Creative", "Infrastructure", "AI / ML", "Web3", "Design", "Education"].map(c => ({ value: c, label: c }));
    return [...list, { value: "__add_new__", label: "+ Add Category..." }];
  }, [registeredCategories]);

  return (
    <div className="space-y-8 animate-fadeIn text-white font-sans relative">
      
      {/* ─── Top Header & Navigation Bar ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#00a3ff]/10 border border-[#00a3ff]/20 flex items-center justify-center text-[#00a3ff] shadow-[0_0_20px_rgba(0,163,255,0.15)]">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
              Projects
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400 font-normal">
                {projectsList.length} total
              </span>
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">Manage, create, and organize development initiatives published on Introlic.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {viewMode === "overview" && (
            <button
              onClick={handleOpenCreateForm}
              className="px-4 py-2 bg-gradient-to-r from-[#00a3ff] to-[#0080ff] hover:from-[#0090e0] hover:to-[#0070e0] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-[0_4px_20px_rgba(0,163,255,0.3)] hover:scale-[1.02] active:scale-[0.98] shrink-0"
            >
              <Plus className="w-4 h-4" />
              Add New Project
            </button>
          )}
        </div>
      </div>

      {/* ─── Navigation Tabs ──────────────────────────────────────────────── */}
      <div className="flex border-b border-white/10 pb-3 items-center justify-between gap-4">
        <div className="flex gap-2 sm:gap-4">
          <button
            onClick={() => {
              setViewMode("overview");
              setEditingProjectId(null);
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
              {projectsList.length}
            </span>
          </button>
          
          <button
            onClick={() => {
              setViewMode("forge");
              setEditingProjectId(null);
              resetForm();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              viewMode === "forge" 
                ? "bg-white/10 text-white border border-white/15 shadow-sm" 
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {editingProjectId ? <Edit className="w-3.5 h-3.5 text-amber-400" /> : <Plus className="w-3.5 h-3.5 text-[#00a3ff]" />}
            {editingProjectId ? "Edit Project" : "New Project"}
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

      {/* ─── Uploading Progress Overlay ───────────────────────────────────── */}
      {isUploadingProject && (
        <div className="fixed inset-0 bg-[#020202]/90 backdrop-blur-md flex flex-col items-center justify-center z-[200] p-6 animate-fadeIn">
          <div className="w-full max-w-sm space-y-4 bg-[#0a0a0c] border border-white/10 p-6 rounded-2xl shadow-2xl">
            <div className="flex justify-between items-center text-xs font-mono text-gray-400">
              <span className="flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#00a3ff]" />
                {editingProjectId ? "UPDATING PROJECT..." : "CREATING PROJECT..."}
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
              <h3 className="text-3xl font-bold tracking-tight text-white mb-0.5">{projectsList.length}</h3>
              <p className="text-xs text-gray-400">Total Projects Hosted</p>
            </div>

            <div className="bg-gradient-to-br from-[#0c0c10] to-[#070709] rounded-2xl border border-white/[0.08] p-5 relative overflow-hidden group hover:border-emerald-500/30 transition-all">
              <div className="flex justify-between items-start mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Active
                </span>
              </div>
              <h3 className="text-3xl font-bold tracking-tight text-emerald-400 mb-0.5">
                {projectsList.filter(p => p.status === "Active").length}
              </h3>
              <p className="text-xs text-gray-400">In Active Development</p>
            </div>

            <div className="bg-gradient-to-br from-[#0c0c10] to-[#070709] rounded-2xl border border-white/[0.08] p-5 relative overflow-hidden group hover:border-[#00a3ff]/30 transition-all">
              <div className="flex justify-between items-start mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#00a3ff]/10 border border-[#00a3ff]/20 text-[#00a3ff]">
                  <Users className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-[#00a3ff] uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00a3ff] animate-pulse" />
                  Recruiting
                </span>
              </div>
              <h3 className="text-3xl font-bold tracking-tight text-[#00a3ff] mb-0.5">
                {projectsList.filter(p => p.status === "Recruiting" || (p.openTo && p.openTo.trim().length > 0)).length}
              </h3>
              <p className="text-xs text-gray-400">Open For Collaboration</p>
            </div>

            <div className="bg-gradient-to-br from-[#0c0c10] to-[#070709] rounded-2xl border border-white/[0.08] p-5 relative overflow-hidden group hover:border-[#00a3ff]/30 transition-all">
              <div className="flex justify-between items-start mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#00a3ff]/10 border border-[#00a3ff]/20 text-[#00a3ff]">
                  <Layers className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-[#00a3ff] uppercase tracking-widest">Categories</span>
              </div>
              <h3 className="text-3xl font-bold tracking-tight text-white mb-0.5">
                {registeredCategories.length}
              </h3>
              <p className="text-xs text-gray-400">Active Categories</p>
            </div>
          </div>

          {/* Migration Result Notification */}
          {migrationResult && (
            <div className={`p-4 rounded-xl border text-xs flex items-start gap-3 ${
              migrationResult.startsWith("❌")
                ? "bg-red-500/10 border-red-500/20 text-red-400"
                : "bg-[#00a3ff]/10 border-[#00a3ff]/20 text-[#00a3ff]"
            }`}>
              <Database className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1 font-mono">{migrationResult}</div>
              <button onClick={() => setMigrationResult(null)} className="opacity-60 hover:opacity-100 transition-opacity">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Control Bar: Search, Filters, and Layout Switcher */}
          <div className="bg-[#0a0a0c] border border-white/[0.08] rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              {/* Search Box */}
              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={projectSearch}
                  onChange={e => setProjectSearch(e.target.value)}
                  placeholder="Search projects by title, author, role, topic, or tag..."
                  className="w-full bg-[#050505] border border-white/[0.08] hover:border-white/20 focus:border-[#00a3ff]/50 rounded-xl py-2.5 pl-10 pr-9 text-xs text-white placeholder-gray-500 focus:outline-none transition-all font-sans"
                />
                {projectSearch && (
                  <button 
                    onClick={() => setProjectSearch("")} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* View Layout Switcher */}
              <div className="flex items-center bg-black/50 border border-white/10 p-1 rounded-xl shrink-0 gap-1">
                <button
                  onClick={() => setProjectLayout("grid")}
                  title="Grid Cards View"
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                    projectLayout === "grid" ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-white"
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  Grid
                </button>
                <button
                  onClick={() => setProjectLayout("linewise")}
                  title="Table List View"
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                    projectLayout === "linewise" ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-white"
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  Table
                </button>
                <button
                  onClick={() => {
                    setProjectLayout("split");
                    if (!expandedProjectId && processedProjects.length > 0) {
                      setExpandedProjectId(processedProjects[0].id);
                    }
                  }}
                  title="Split Master-Detail View"
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                    projectLayout === "split" ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Columns className="w-3.5 h-3.5" />
                  Split
                </button>
              </div>
            </div>

            {/* Filter Pills / Dropdowns */}
            <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-white/5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider font-mono">Category:</span>
                <select
                  value={projectCategoryFilter}
                  onChange={e => setProjectCategoryFilter(e.target.value)}
                  className="bg-[#050505] border border-white/[0.08] hover:border-white/20 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#00a3ff]/40 cursor-pointer font-sans"
                >
                  {["All", ...registeredCategories.map(c => c.name)].map(c => (
                    <option key={c} value={c}>{c === "All" ? "All Categories" : c}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider font-mono">Status:</span>
                <select
                  value={projectStatusFilter}
                  onChange={e => setProjectStatusFilter(e.target.value)}
                  className="bg-[#050505] border border-white/[0.08] hover:border-white/20 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#00a3ff]/40 cursor-pointer font-sans"
                >
                  <option value="All">All Statuses</option>
                  {STATUSES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider font-mono">Sort:</span>
                <select
                  value={projectSort}
                  onChange={e => setProjectSort(e.target.value)}
                  className="bg-[#050505] border border-white/[0.08] hover:border-white/20 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#00a3ff]/40 cursor-pointer font-sans"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="title_az">Title A-Z</option>
                  <option value="title_za">Title Z-A</option>
                </select>
              </div>
            </div>
          </div>

          {/* Empty State */}
          {processedProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center p-16 bg-[#0a0a0c] rounded-2xl border border-white/5 space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-center text-gray-500">
                <Cpu className="w-6 h-6 text-[#00a3ff] opacity-40" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  No Projects Found
                </h3>
                <p className="text-xs text-gray-500 max-w-sm">
                  {projectSearch || projectCategoryFilter !== "All" || projectStatusFilter !== "All"
                    ? "No projects match your active search filter criteria. Try resetting filters."
                    : "You have not published any projects yet. Click 'Add New Project' to get started."}
                </p>
              </div>
              {(projectSearch || projectCategoryFilter !== "All" || projectStatusFilter !== "All") && (
                <button
                  onClick={() => {
                    setProjectSearch("");
                    setProjectCategoryFilter("All");
                    setProjectStatusFilter("All");
                  }}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-300 uppercase tracking-wider transition-all"
                >
                  Reset Filters
                </button>
              )}
            </div>
          ) : projectLayout === "grid" ? (
            
            /* ─── GRID CARDS VIEW ────────────────────────────────────────── */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {processedProjects.map(project => {
                const statusStyle = STATUS_CONFIG[project.status] || STATUS_CONFIG.Active;
                return (
                  <div
                    key={project.id}
                    className="bg-[#0a0a0c] border border-white/[0.08] hover:border-white/20 rounded-2xl p-5 flex flex-col justify-between space-y-4 group transition-all duration-200 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                  >
                    <div className="space-y-3.5">
                      {/* Card Top: Logo, Category & Status Badge */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {project.logoUrl ? (
                            <div className="w-11 h-11 rounded-xl bg-black border border-white/10 overflow-hidden shrink-0 shadow-inner">
                              <img src={project.logoUrl} alt="" className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#00a3ff]/20 to-[#0060df]/10 border border-[#00a3ff]/30 flex items-center justify-center text-sm font-black text-[#00a3ff] shrink-0 font-mono shadow-inner">
                              {project.title ? project.title.substring(0, 2).toUpperCase() : "PR"}
                            </div>
                          )}
                          <div>
                            <span className="text-[10px] font-mono uppercase tracking-widest text-[#00a3ff]">
                              {project.category}
                            </span>
                            <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-[#00a3ff] transition-colors">
                              {project.title}
                            </h3>
                          </div>
                        </div>

                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusStyle.bg} ${statusStyle.text} border ${statusStyle.border}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                          {project.status}
                        </span>
                      </div>

                      {/* Topic / Summary */}
                      <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                        {project.topic || "No summary provided."}
                      </p>

                      {/* Tags */}
                      {Array.isArray(project.tags) && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {project.tags.slice(0, 4).map((t: string) => (
                            <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/5 text-gray-400">
                              {t}
                            </span>
                          ))}
                          {project.tags.length > 4 && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 text-gray-600">
                              +{project.tags.length - 4}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Card Bottom: Author, Links & Action Buttons */}
                    <div className="pt-3.5 border-t border-white/5 flex items-center justify-between gap-2">
                      <div className="text-[11px] text-gray-400 truncate">
                        <span className="text-white font-medium">{project.author}</span>
                        {project.authorRole && (
                          <span className="text-gray-500 ml-1 text-[10px] font-mono">({project.authorRole})</span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
                            title="GitHub Repository"
                          >
                            <GithubIcon className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {project.demoUrl && (
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-gray-500 hover:text-emerald-400 hover:bg-white/5 transition-colors"
                            title="Live Demo"
                          >
                            <Globe className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <button
                          onClick={() => handleOpenEditForm(project)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-[#00a3ff] hover:bg-[#00a3ff]/10 transition-colors cursor-pointer"
                          title="Edit Project"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          ) : projectLayout === "linewise" ? (

            /* ─── DATA TABLE VIEW ────────────────────────────────────────── */
            <div className="overflow-hidden border border-white/[0.08] rounded-2xl bg-[#0a0a0c] shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-[#070709] text-[10px] text-gray-400 uppercase tracking-wider font-mono">
                      <th className="p-4 pl-6">Project</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Author</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Timeline</th>
                      <th className="p-4 pr-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs divide-y divide-white/5">
                    {processedProjects.map((project: any) => {
                      const statusStyle = STATUS_CONFIG[project.status] || STATUS_CONFIG.Active;
                      return (
                        <tr 
                          key={project.id} 
                          className="hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="p-4 pl-6 font-bold text-white">
                            <div className="flex items-center gap-3">
                              {project.logoUrl ? (
                                <div className="w-8 h-8 rounded-lg bg-black border border-white/10 overflow-hidden shrink-0">
                                  <img src={project.logoUrl} alt="" className="w-full h-full object-cover" />
                                </div>
                              ) : (
                                <div className="w-8 h-8 rounded-lg bg-[#00a3ff]/10 border border-[#00a3ff]/20 flex items-center justify-center text-[10px] font-black text-[#00a3ff] shrink-0 font-mono">
                                  {project.title.substring(0, 2).toUpperCase()}
                                </div>
                              )}
                              <div>
                                <span className="font-bold text-white block">{project.title}</span>
                                <span className="text-[10px] text-gray-500 font-mono">{project.id}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-gray-400 font-mono text-[11px]">
                            <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-gray-300 uppercase">
                              {project.category}
                            </span>
                          </td>
                          <td className="p-4 text-gray-300">
                            <div>{project.author}</div>
                            <span className="text-[10px] text-gray-500 font-mono">{project.authorRole || "Lead Developer"}</span>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusStyle.bg} ${statusStyle.text} border ${statusStyle.border}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                              {project.status}
                            </span>
                          </td>
                          <td className="p-4 text-gray-400 font-mono text-[11px]">
                            {formatDateDeterministic(project.started)}
                          </td>
                          <td className="p-4 pr-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {project.githubUrl && (
                                <a
                                  href={project.githubUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
                                  title="GitHub"
                                >
                                  <GithubIcon className="w-3.5 h-3.5" />
                                </a>
                              )}
                              <button 
                                onClick={() => handleOpenEditForm(project)}
                                className="p-1.5 rounded-lg text-gray-500 hover:text-[#00a3ff] hover:bg-[#00a3ff]/10 transition-all cursor-pointer"
                                title="Edit Project"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => handleDeleteProject(project.id)}
                                className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                                title="Delete Project"
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
              const selectedProject = processedProjects.find(p => p.id === expandedProjectId) || processedProjects[0];
              if (!selectedProject) return null;

              const statusStyle = STATUS_CONFIG[selectedProject.status] || STATUS_CONFIG.Active;

              return (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Column: Project Selector List */}
                  <div className="lg:col-span-4 space-y-2 max-h-[75vh] overflow-y-auto pr-1 custom-scrollbar">
                    <div className="text-[10px] font-mono uppercase tracking-widest text-gray-500 pb-2 border-b border-white/5 mb-2">
                      Projects ({processedProjects.length})
                    </div>
                    {processedProjects.map(proj => {
                      const isSelected = proj.id === selectedProject.id;
                      return (
                        <div 
                          key={proj.id}
                          onClick={() => setExpandedProjectId(proj.id)}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                            isSelected 
                              ? "bg-[#00a3ff]/10 border-[#00a3ff]/40 shadow-[0_0_20px_rgba(0,163,255,0.1)]" 
                              : "bg-[#0a0a0c] border-white/5 hover:border-white/15"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-xs text-white truncate max-w-[160px]">{proj.title}</span>
                            <span className="text-[9px] font-mono text-gray-500">{proj.category}</span>
                          </div>
                          <div className="flex items-center justify-between mt-2 text-[10px] text-gray-400">
                            <span>{proj.author}</span>
                            <span className={`font-semibold ${STATUS_CONFIG[proj.status]?.text || "text-gray-400"}`}>
                              {proj.status}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Right Column: Detailed Project Viewer */}
                  <div className="lg:col-span-8 bg-[#0a0a0c] border border-white/[0.08] rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-white/10">
                      <div className="flex items-start gap-4">
                        {selectedProject.logoUrl ? (
                          <div className="w-14 h-14 rounded-2xl bg-black border border-white/10 overflow-hidden shrink-0 shadow-md">
                            <img src={selectedProject.logoUrl} alt="" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00a3ff]/20 to-[#0060df]/10 border border-[#00a3ff]/30 flex items-center justify-center text-lg font-black text-[#00a3ff] shrink-0 font-mono">
                            {selectedProject.title ? selectedProject.title.substring(0, 2).toUpperCase() : "PR"}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono uppercase tracking-widest text-[#00a3ff]">
                              {selectedProject.category}
                            </span>
                            <span className="text-gray-600">•</span>
                            <span className="text-[10px] font-mono text-gray-500">ID: {selectedProject.id}</span>
                          </div>
                          <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
                            {selectedProject.title}
                          </h2>
                          <p className="text-xs text-gray-400 mt-1">
                            by <span className="text-white font-medium">{selectedProject.author}</span>
                            {selectedProject.authorRole && (
                              <span className="text-gray-500 font-mono ml-1">({selectedProject.authorRole})</span>
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${statusStyle.bg} ${statusStyle.text} border ${statusStyle.border}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                          {selectedProject.status}
                        </span>
                        <button
                          onClick={() => handleOpenEditForm(selectedProject)}
                          className="p-2 rounded-xl border border-white/10 hover:border-[#00a3ff]/40 hover:bg-[#00a3ff]/10 text-gray-400 hover:text-[#00a3ff] transition-all cursor-pointer"
                          title="Edit Project"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(selectedProject.id)}
                          className="p-2 rounded-xl border border-white/10 hover:border-red-500/40 hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all cursor-pointer"
                          title="Delete Project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Metadata Strip */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-black/40 border border-white/5 text-xs font-mono">
                      <div>
                        <span className="text-gray-500 uppercase text-[9px] block">Started</span>
                        <span className="text-gray-300 font-semibold">{formatDateDeterministic(selectedProject.started) || "—"}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 uppercase text-[9px] block">Open Roles</span>
                        <span className="text-gray-300 font-semibold">{selectedProject.openTo || "None"}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-500 uppercase text-[9px] block mb-1">Resource Links</span>
                        <div className="flex items-center gap-3">
                          {selectedProject.githubUrl ? (
                            <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer" className="text-[#00a3ff] hover:underline flex items-center gap-1">
                              <GithubIcon className="w-3 h-3" /> Repository
                            </a>
                          ) : (
                            <span className="text-gray-600">No Repo</span>
                          )}
                          {selectedProject.demoUrl && (
                            <a href={selectedProject.demoUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline flex items-center gap-1">
                              <Globe className="w-3 h-3" /> Live Demo
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    {Array.isArray(selectedProject.tags) && selectedProject.tags.length > 0 && (
                      <div>
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mb-2">Tech Stack Tags</span>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedProject.tags.map((t: string) => (
                            <span key={t} className="text-xs font-mono px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Topic Summary */}
                    <div>
                      <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mb-2">Summary / Topic</span>
                      <p className="text-xs text-gray-300 leading-relaxed bg-[#050505] border border-white/5 rounded-xl p-4">
                        {selectedProject.topic || "No topic summary provided."}
                      </p>
                    </div>

                    {/* Why This Project */}
                    {selectedProject.why && (
                      <div>
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mb-2">Why This Project (Motivation)</span>
                        <p className="text-xs text-gray-400 leading-relaxed bg-[#050505] border border-white/5 rounded-xl p-4">
                          {selectedProject.why}
                        </p>
                      </div>
                    )}

                    {/* Key Factors */}
                    {Array.isArray(selectedProject.factors) && selectedProject.factors.length > 0 && (
                      <div>
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mb-2">Key Factors</span>
                        <div className="flex flex-wrap gap-2">
                          {selectedProject.factors.map((f: string, i: number) => (
                            <span key={i} className="text-xs px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300 font-mono">
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Readme Section */}
                    {selectedProject.readme && (
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center gap-2 text-xs font-mono text-gray-400 uppercase tracking-wider pb-2 border-b border-white/10">
                          <BookOpen className="w-4 h-4 text-[#00a3ff]" />
                          README.md
                        </div>
                        <div className="prose prose-invert max-w-none text-xs bg-[#050505] border border-white/5 rounded-xl p-5">
                          {parseMarkdown(selectedProject.readme)}
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
              <p className="text-xs text-gray-400">Categories With Projects</p>
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
                {categoryStats.topCategory.count} {categoryStats.topCategory.count === 1 ? "project" : "projects"} assigned
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
                      {editingCategoryId ? "Updating existing category" : "Define taxonomy for projects"}
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
                  <span className="text-gray-600">Route:</span> introlic.in/projects?category={categoryForm.slug || "..."}
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
                    placeholder="e.g. Artificial Intelligence"
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
                      placeholder="e.g. artificial-intelligence"
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

            {/* ─── Right Column: Category Directory (Search + Cards/Table) ── */}
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
                    const count = projectsList.filter(p => p.category === cat.name).length;
                    const theme = CATEGORY_THEMES[cat.name] || {
                      bg: "bg-[#00a3ff]/10",
                      text: "text-[#00a3ff]",
                      border: "border-[#00a3ff]/20",
                      glow: "shadow-[0_0_15px_rgba(0,163,255,0.1)]",
                      dot: "bg-[#00a3ff]"
                    };
                    const isCopied = copiedSlug === cat.slug;

                    return (
                      <div 
                        key={cat.id}
                        className="bg-[#0a0a0c] border border-white/[0.08] hover:border-white/20 rounded-2xl p-5 flex flex-col justify-between space-y-4 group transition-all duration-200 hover:shadow-xl"
                      >
                        <div className="space-y-3">
                          {/* Card Header: Monogram + Name + Slug */}
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

                            {/* Project Count Pill */}
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase ${
                              count > 0 
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                                : "bg-white/5 text-gray-500 border border-white/10"
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${count > 0 ? "bg-emerald-400 animate-pulse" : "bg-gray-600"}`} />
                              {count} {count === 1 ? "Project" : "Projects"}
                            </span>
                          </div>
                        </div>

                        {/* Card Footer: Public Link & Actions */}
                        <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                          <a
                            href={`/projects?category=${encodeURIComponent(cat.name)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-gray-400 hover:text-[#00a3ff] transition-colors"
                          >
                            View Projects
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
                          <th className="p-4 text-center">Projects</th>
                          <th className="p-4 text-center">Status</th>
                          <th className="p-4 pr-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="text-xs divide-y divide-white/5">
                        {filteredCategories.map((cat: any) => {
                          const count = projectsList.filter(p => p.category === cat.name).length;
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
                                  {count} {count === 1 ? "project" : "projects"}
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
        /* ─── 3. NEW PROJECT / EDIT PROJECT FORM ──────────────────────────── */
        /* ─────────────────────────────────────────────────────────────────── */
        <div className="bg-[#0a0a0c] rounded-3xl border border-white/[0.08] p-6 sm:p-8 text-left animate-fadeIn shadow-2xl space-y-6">
          
          {/* Form Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#00a3ff]/10 border border-[#00a3ff]/20 flex items-center justify-center text-[#00a3ff]">
                {editingProjectId ? <Edit className="w-5 h-5 text-amber-400" /> : <Plus className="w-5 h-5 text-[#00a3ff]" />}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {editingProjectId ? "Edit Project Details" : "Create New Project"}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {editingProjectId ? "Modify project specifications and update the public listing." : "Configure attributes to publish a new project on Introlic."}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setViewMode("overview");
                setEditingProjectId(null);
                resetForm();
              }}
              className="flex items-center gap-2 text-xs text-gray-400 hover:text-white font-bold uppercase tracking-wider cursor-pointer border border-white/10 bg-white/[0.02] px-4 py-2 rounded-xl hover:bg-white/5 transition-all self-start sm:self-auto"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Overview
            </button>
          </div>

          <form onSubmit={handleUploadProject} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* ─── Left Column: Main Content & Story ──────────────────────── */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Title & Category Box */}
                <div className="bg-[#050505] border border-white/[0.08] rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <span className="text-[10px] font-mono tracking-widest uppercase text-[#00a3ff] flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5" />
                      Core Details
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">
                        Project Title <span className="text-red-400">*</span>
                      </label>
                      <input 
                        type="text" 
                        required
                        value={projectForm.title}
                        onChange={e => setProjectForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g. Neural Fluid Sandbox"
                        className="bg-[#0a0a0c] border border-white/[0.08] hover:border-white/20 focus:border-[#00a3ff]/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none transition-all font-sans"
                      />
                    </div>

                    <FormDropdown
                      label="Category"
                      value={projectForm.category}
                      options={categoryDropdownOptions}
                      onChange={val => {
                        if (val === "__add_new__") {
                          setNewCategoryName("");
                          setShowAddCategoryModal(true);
                        } else {
                          setProjectForm(prev => ({ ...prev, category: val }));
                        }
                      }}
                    />
                  </div>

                  {/* Summary / Topic */}
                  <div className="flex flex-col gap-1.5 pt-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">
                      Short Topic / Summary <span className="text-red-400">*</span>
                    </label>
                    <textarea 
                      required
                      value={projectForm.topic}
                      onChange={e => setProjectForm(prev => ({ ...prev, topic: e.target.value }))}
                      rows={2}
                      placeholder="A real-time procedural fluid dynamics simulation running directly in the browser via WebGPU..."
                      className="bg-[#0a0a0c] border border-white/[0.08] hover:border-white/20 focus:border-[#00a3ff]/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none transition-all resize-none font-sans leading-relaxed"
                    />
                  </div>
                </div>

                {/* Markdown README Editor */}
                <div className="bg-[#050505] border border-white/[0.08] rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <span className="text-[10px] font-mono tracking-widest uppercase text-[#00a3ff] flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      Project README.md
                    </span>

                    {/* Write / Preview Tab Switcher */}
                    <div className="flex bg-black/60 border border-white/10 p-0.5 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setReadmeTab("write")}
                        className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                          readmeTab === "write" ? "bg-white text-black font-black" : "text-gray-400 hover:text-white"
                        }`}
                      >
                        <Pencil className="w-3 h-3" />
                        Write
                      </button>
                      <button
                        type="button"
                        onClick={() => setReadmeTab("preview")}
                        className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                          readmeTab === "preview" ? "bg-white text-black font-black" : "text-gray-400 hover:text-white"
                        }`}
                      >
                        <Eye className="w-3 h-3" />
                        Live Preview
                      </button>
                    </div>
                  </div>

                  {readmeTab === "write" ? (
                    <div className="space-y-2">
                      {/* Markdown Toolbar */}
                      <div className="flex flex-wrap items-center gap-1 p-1 bg-black/40 border border-white/5 rounded-xl text-gray-400">
                        <button 
                          type="button" 
                          onClick={() => insertMarkdownSnippet("## Heading 2\n")}
                          className="p-1.5 rounded hover:bg-white/10 hover:text-white text-xs font-bold cursor-pointer"
                          title="Heading 2"
                        >
                          <Heading2 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          type="button" 
                          onClick={() => insertMarkdownSnippet("**Bold Text**")}
                          className="p-1.5 rounded hover:bg-white/10 hover:text-white text-xs font-bold cursor-pointer"
                          title="Bold"
                        >
                          <Bold className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          type="button" 
                          onClick={() => insertMarkdownSnippet("*Italic Text*")}
                          className="p-1.5 rounded hover:bg-white/10 hover:text-white text-xs font-bold cursor-pointer"
                          title="Italic"
                        >
                          <Italic className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          type="button" 
                          onClick={() => insertMarkdownSnippet("> Blockquote text")}
                          className="p-1.5 rounded hover:bg-white/10 hover:text-white text-xs font-bold cursor-pointer"
                          title="Quote"
                        >
                          <Quote className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          type="button" 
                          onClick={() => insertMarkdownSnippet("```typescript\n// Code snippet\n```")}
                          className="p-1.5 rounded hover:bg-white/10 hover:text-white text-xs font-bold cursor-pointer"
                          title="Code Block"
                        >
                          <Code className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          type="button" 
                          onClick={() => insertMarkdownSnippet("- Bullet item\n- Bullet item 2")}
                          className="p-1.5 rounded hover:bg-white/10 hover:text-white text-xs font-bold cursor-pointer"
                          title="List"
                        >
                          <List className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <textarea 
                        value={projectForm.readme}
                        onChange={e => setProjectForm(prev => ({ ...prev, readme: e.target.value }))}
                        rows={16}
                        placeholder="# Project Overview&#10;&#10;Explain architecture, goals, benchmarks, and installation guides using markdown..."
                        className="w-full bg-[#0a0a0c] border border-white/[0.08] hover:border-white/20 focus:border-[#00a3ff]/50 rounded-xl p-4 text-xs text-white placeholder-gray-600 focus:outline-none transition-all font-mono leading-relaxed resize-y custom-scrollbar"
                      />
                    </div>
                  ) : (
                    <div className="bg-[#0a0a0c] border border-white/[0.08] rounded-xl p-5 text-left overflow-y-auto max-h-[450px] min-h-[300px] prose prose-invert max-w-none text-xs custom-scrollbar">
                      {parseMarkdown(projectForm.readme || "# Preview\n*Write markdown in the Write tab to see the live preview here.*")}
                    </div>
                  )}
                </div>

                {/* Motivation & Key Factors */}
                <div className="bg-[#050505] border border-white/[0.08] rounded-2xl p-5 space-y-4">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-[#00a3ff] flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    Motivation & Highlights
                  </span>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">
                      Why This Project (Motivation)
                    </label>
                    <textarea 
                      value={projectForm.why}
                      onChange={e => setProjectForm(prev => ({ ...prev, why: e.target.value }))}
                      rows={3}
                      placeholder="Why did we build this? What problems does it address?"
                      className="bg-[#0a0a0c] border border-white/[0.08] hover:border-white/20 focus:border-[#00a3ff]/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none transition-all resize-none font-sans leading-relaxed"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">
                      Key Highlights (One Factor Per Line)
                    </label>
                    <textarea 
                      value={projectForm.factors}
                      onChange={e => setProjectForm(prev => ({ ...prev, factors: e.target.value }))}
                      rows={3}
                      placeholder="Zero Dependencies&#10;Sub-millisecond latency&#10;Open Source MIT License"
                      className="bg-[#0a0a0c] border border-white/[0.08] hover:border-white/20 focus:border-[#00a3ff]/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none transition-all resize-none font-mono"
                    />
                  </div>
                </div>

              </div>

              {/* ─── Right Column: Attributes & Media ──────────────────────── */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Project Logo Upload */}
                <div className="bg-[#050505] border border-white/[0.08] rounded-2xl p-5 space-y-4">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-[#00a3ff] flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5" />
                    Project Logo / Emblem
                  </span>
                  
                  <div>
                    {logoPreview ? (
                      <div className="p-4 bg-black/60 border border-white/10 rounded-xl flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl border border-white/10 bg-[#020202] relative overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
                          <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-xs font-bold text-white uppercase truncate">
                            {logoFile ? logoFile.name : "Active Logo Asset"}
                          </p>
                          <p className="text-[10px] text-gray-500 font-mono">
                            {logoFile ? `${(logoFile.size / 1024).toFixed(1)} KB` : "Stored WebP"}
                          </p>
                          <div className="flex gap-2 pt-1">
                            <button 
                              type="button" 
                              onClick={() => logoInputRef.current?.click()}
                              className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-[10px] font-bold text-white uppercase tracking-wider transition-colors cursor-pointer"
                            >
                              Change
                            </button>
                            <button 
                              type="button" 
                              onClick={() => { setLogoFile(null); setLogoPreview(""); setProjectForm(prev => ({ ...prev, logoUrl: "" })); }}
                              className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <button 
                        type="button" 
                        onClick={() => logoInputRef.current?.click()}
                        className="w-full h-28 rounded-xl border-2 border-dashed border-white/10 hover:border-[#00a3ff]/50 bg-white/[0.01] hover:bg-[#00a3ff]/5 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer group"
                      >
                        <Plus className="w-5 h-5 text-gray-500 group-hover:text-[#00a3ff] transition-colors" />
                        <span className="text-xs text-gray-400 group-hover:text-white font-medium transition-colors">
                          Click to upload WebP Logo
                        </span>
                        <span className="text-[10px] text-gray-600 font-mono">WebP format · Max 3MB</span>
                      </button>
                    )}
                    <input ref={logoInputRef} type="file" accept=".webp,image/webp" onChange={handleLogoSelect} className="hidden" />
                  </div>
                </div>

                {/* Status & Timeline */}
                <div className="bg-[#050505] border border-white/[0.08] rounded-2xl p-5 space-y-4">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-[#00a3ff] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    Status & Timeline
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormDropdown
                      label="Project Status"
                      value={projectForm.status}
                      options={STATUSES}
                      onChange={val => setProjectForm(prev => ({ ...prev, status: val }))}
                    />

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">
                        Started Date
                      </label>
                      <input 
                        type="date" 
                        required
                        value={projectForm.started || getTodayDateString()}
                        onChange={e => setProjectForm(prev => ({ ...prev, started: e.target.value }))}
                        className="bg-[#0a0a0c] border border-white/[0.08] hover:border-white/20 focus:border-[#00a3ff]/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none transition-all font-sans"
                      />
                    </div>
                  </div>
                </div>

                {/* Author & Team */}
                <div className="bg-[#050505] border border-white/[0.08] rounded-2xl p-5 space-y-4">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-[#00a3ff] flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    Author & Roles
                  </span>

                  <div className="space-y-4">
                    <div className="flex flex-col gap-1.5">
                      <FormDropdown
                        label="Author / Team"
                        value={isCustomAuthor ? "__custom__" : (projectForm.author || "")}
                        options={authorOptions}
                        placeholder="Select Author..."
                        onChange={val => {
                          if (val === "__custom__") {
                            setIsCustomAuthor(true);
                            setProjectForm(prev => ({ ...prev, author: "" }));
                          } else {
                            setIsCustomAuthor(false);
                            setProjectForm(prev => ({ ...prev, author: val }));
                          }
                        }}
                      />
                      {isCustomAuthor && (
                        <input 
                          type="text" 
                          required
                          value={projectForm.author}
                          onChange={e => setProjectForm(prev => ({ ...prev, author: e.target.value }))}
                          placeholder="Type custom author name..."
                          className="mt-2 bg-[#0a0a0c] border border-[#00a3ff]/40 rounded-xl px-4 py-2 text-xs text-white placeholder-gray-600 focus:outline-none transition-all font-sans"
                        />
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">Author Role</label>
                        <button
                          type="button"
                          onClick={() => setShowNewRoleInput(v => !v)}
                          className="text-[10px] text-[#00a3ff] hover:underline font-bold uppercase tracking-wider cursor-pointer"
                        >
                          {showNewRoleInput ? "Cancel" : "+ Add Role"}
                        </button>
                      </div>
                      
                      {showNewRoleInput ? (
                        <div className="flex gap-2">
                          <input 
                            type="text"
                            value={newRoleText}
                            onChange={e => setNewRoleText(e.target.value)}
                            placeholder="New Role Title"
                            className="bg-[#0a0a0c] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#00a3ff]/40 transition-all font-sans flex-1"
                          />
                          <button
                            type="button"
                            onClick={handleAddNewRole}
                            className="px-3.5 bg-[#00a3ff]/20 hover:bg-[#00a3ff]/30 text-[#00a3ff] rounded-xl text-xs font-bold border border-[#00a3ff]/30 cursor-pointer"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <FormDropdown
                          label=""
                          value={projectForm.authorRole}
                          options={authorRoles}
                          onChange={val => setProjectForm(prev => ({ ...prev, authorRole: val }))}
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Tech Stack & Tags */}
                <div className="bg-[#050505] border border-white/[0.08] rounded-2xl p-5 space-y-4">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-[#00a3ff] flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    Tech Stack & Tags
                  </span>

                  {/* Pre-seeded pills */}
                  <div className="flex flex-wrap gap-1.5 pb-2 border-b border-white/5">
                    {POPULAR_TAGS.map(tag => {
                      const isActive = currentTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleTag(tag)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition-all duration-150 cursor-pointer ${
                            isActive 
                              ? "bg-[#00a3ff]/20 text-[#00a3ff] border border-[#00a3ff]/40 shadow-sm"
                              : "bg-[#0a0a0c] text-gray-400 border border-white/[0.06] hover:text-white hover:border-white/20"
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Tags list */}
                  {currentTags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 p-3 bg-black/40 border border-white/5 rounded-xl">
                      <span className="text-[10px] font-mono text-gray-500 uppercase w-full mb-1">Selected Tags:</span>
                      {currentTags.map(tag => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleTag(tag)}
                          className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase bg-[#00a3ff]/15 text-[#00a3ff] border border-[#00a3ff]/30 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <span>{tag}</span>
                          <X className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Custom Tag Input */}
                  <div className="flex items-center gap-2">
                    <input 
                      type="text"
                      value={customTagInput}
                      onChange={e => setCustomTagInput(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleAddCustomTag(e); } }}
                      placeholder="Add custom tag (press Enter)"
                      className="bg-[#0a0a0c] border border-white/[0.08] hover:border-white/20 focus:border-[#00a3ff]/50 rounded-xl px-4 py-2 text-xs text-white placeholder-gray-600 focus:outline-none transition-all font-sans flex-1"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomTag}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      + Add
                    </button>
                  </div>
                </div>

                {/* External Links */}
                <div className="bg-[#050505] border border-white/[0.08] rounded-2xl p-5 space-y-4">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-[#00a3ff] flex items-center gap-1.5">
                    <Link2 className="w-3.5 h-3.5" />
                    External Links
                  </span>

                  <div className="space-y-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono flex items-center gap-1">
                        <GithubIcon className="w-3 h-3" />
                        GitHub Repository URL
                      </label>
                      <input 
                        type="url" 
                        value={projectForm.githubUrl}
                        onChange={e => setProjectForm(prev => ({ ...prev, githubUrl: e.target.value }))}
                        placeholder="https://github.com/introlic/..."
                        className="bg-[#0a0a0c] border border-white/[0.08] hover:border-white/20 focus:border-[#00a3ff]/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none transition-all font-sans"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        Live Demo URL
                      </label>
                      <input 
                        type="url" 
                        value={projectForm.demoUrl}
                        onChange={e => setProjectForm(prev => ({ ...prev, demoUrl: e.target.value }))}
                        placeholder="https://myproject.introlic.in"
                        className="bg-[#0a0a0c] border border-white/[0.08] hover:border-white/20 focus:border-[#00a3ff]/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none transition-all font-sans"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">
                        Collaboration / Open Roles
                      </label>
                      <input 
                        type="text" 
                        value={projectForm.openTo}
                        onChange={e => setProjectForm(prev => ({ ...prev, openTo: e.target.value }))}
                        placeholder="e.g. AI Researchers, Shader Developers, Beta Testers"
                        className="bg-[#0a0a0c] border border-white/[0.08] hover:border-white/20 focus:border-[#00a3ff]/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none transition-all font-sans"
                      />
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* Bottom Sticky Action Bar */}
            <div className="sticky bottom-4 z-40 bg-[#0a0a0c]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center justify-between shadow-2xl">
              <span className="text-xs text-gray-400 font-mono hidden sm:inline">
                {editingProjectId ? `Editing project: ${projectForm.title || "Untitled"}` : "New project draft"}
              </span>

              <div className="flex items-center gap-3 ml-auto">
                <button 
                  type="button"
                  onClick={() => {
                    setViewMode("overview");
                    setEditingProjectId(null);
                    resetForm();
                  }}
                  className="px-5 py-2.5 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/5 text-xs text-gray-400 hover:text-white font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isUploadingProject}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00a3ff] to-[#0080ff] hover:from-[#0090e0] hover:to-[#0070e0] text-white font-bold text-xs uppercase tracking-wider cursor-pointer transition-all shadow-[0_0_25px_rgba(0,163,255,0.3)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                >
                  {isUploadingProject ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {editingProjectId ? "Update Project" : "Create Project"}
                </button>
              </div>
            </div>

          </form>
        </div>
      )}

      {/* ─── Add Category Modal ───────────────────────────────────────────── */}
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
              transition={{ type: "spring", duration: 0.4 }}
              className="relative bg-[#0d0d10] border border-white/10 shadow-[0_0_50px_rgba(0,163,255,0.15)] p-6 rounded-2xl max-w-sm w-full overflow-hidden text-left z-[310]"
            >
              <button
                type="button"
                onClick={() => setShowAddCategoryModal(false)}
                className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-[#00a3ff]/10 border border-[#00a3ff]/20 text-[#00a3ff]">
                  <Plus className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Add New Category
                </h3>
              </div>

              <form onSubmit={handleCreateCategorySubmit} className="space-y-4 font-sans">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">Category Name</label>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={newCategoryName}
                    onChange={e => setNewCategoryName(e.target.value)}
                    placeholder="e.g. Creative"
                    className="bg-[#050505] border border-white/10 focus:border-[#00a3ff]/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none transition-all w-full"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddCategoryModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-white/10 hover:border-white/20 text-gray-400 hover:text-white text-xs font-bold transition-all text-center uppercase tracking-wider cursor-pointer"
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

      <AdminDialog
        isOpen={dialog.isOpen}
        onClose={() => setDialog(prev => ({ ...prev, isOpen: false }))}
        type={dialog.type}
        title={dialog.title}
        message={dialog.message}
        onConfirm={dialog.onConfirm}
        severity={dialog.severity}
      />
    </div>
  );
}
