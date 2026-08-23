"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { 
  User, ChevronRight, Plus, Search, Edit, Trash2, X, 
  ChevronDown, Calendar, Loader2, UserCheck, AlertTriangle, 
  RefreshCw, Link2, Globe
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AuthorType {
  id: string;
  name: string;
  dateOfBirth: string | null;
  bio: string | null;
  avatar: string | null;
  socialLinks: {
    twitter?: string;
    instagram?: string;
    youtube?: string;
    linkedin?: string;
    github?: string;
    discord?: string;
    website?: string;
  };
  createdAt: string | Date;
}

interface AuthorsClientProps {
  initialAuthors: AuthorType[];
}

function formatDateDeterministic(date: Date | string | null | undefined) {
  if (!date) return "Not Provided";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "Not Provided";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function formatSocialLink(value: string, platform: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  
  const clean = trimmed.startsWith("@") ? trimmed.slice(1) : trimmed;
  
  switch (platform) {
    case "twitter":
      return `https://x.com/${clean}`;
    case "instagram":
      return `https://instagram.com/${clean}`;
    case "youtube":
      const ytHandle = clean.startsWith("@") ? clean : `@${clean}`;
      return `https://youtube.com/${ytHandle}`;
    case "linkedin":
      if (clean.startsWith("in/")) {
        return `https://linkedin.com/${clean}`;
      }
      return `https://linkedin.com/in/${clean}`;
    case "github":
      return `https://github.com/${clean}`;
    case "discord":
      if (clean.includes("/") || clean.includes("discord.gg") || clean.includes("discord.com")) {
        return clean.startsWith("http") ? clean : `https://${clean}`;
      }
      return `https://discord.gg/${clean}`;
    case "website":
      return `https://${clean}`;
    default:
      return trimmed;
  }
}

export default function AuthorsClient({ initialAuthors }: AuthorsClientProps) {
  const [authorsList, setAuthorsList] = useState<AuthorType[]>(initialAuthors);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Filters state
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState<AuthorType | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    dateOfBirth: "",
    bio: "",
    avatar: "",
    twitter: "",
    instagram: "",
    youtube: "",
    linkedin: "",
    github: "",
    discord: "",
    website: ""
  });

  const refreshAuthors = async () => {
    setIsProcessing(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/authors");
      if (res.ok) {
        const data = await res.json();
        setAuthorsList(data);
      } else {
        setErrorMsg("Failed to refresh authors catalog.");
      }
    } catch (e) {
      setErrorMsg("Error communicating with server.");
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    refreshAuthors();
  }, []);

  const filteredAuthors = useMemo(() => {
    let list = [...authorsList];

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(a => 
        a.name.toLowerCase().includes(q) ||
        (a.bio && a.bio.toLowerCase().includes(q))
      );
    }

    // Sorting
    list.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();

      if (sortOrder === "newest") return dateB - dateA;
      if (sortOrder === "oldest") return dateA - dateB;
      if (sortOrder === "name_az") return a.name.localeCompare(b.name);
      if (sortOrder === "name_za") return b.name.localeCompare(a.name);
      return 0;
    });

    return list;
  }, [authorsList, search, sortOrder]);

  const handleOpenAddModal = () => {
    setFormData({
      name: "",
      dateOfBirth: "",
      bio: "",
      avatar: "",
      twitter: "",
      instagram: "",
      youtube: "",
      linkedin: "",
      github: "",
      discord: "",
      website: ""
    });
    setErrorMsg("");
    setSuccessMsg("");
    setShowAddModal(true);
  };

  const handleOpenEditModal = (author: AuthorType) => {
    setSelectedAuthor(author);
    setFormData({
      name: author.name,
      dateOfBirth: author.dateOfBirth ? author.dateOfBirth.split("T")[0] : "",
      bio: author.bio || "",
      avatar: author.avatar || "",
      twitter: author.socialLinks.twitter || "",
      instagram: author.socialLinks.instagram || "",
      youtube: author.socialLinks.youtube || "",
      linkedin: author.socialLinks.linkedin || "",
      github: author.socialLinks.github || "",
      discord: author.socialLinks.discord || "",
      website: author.socialLinks.website || ""
    });
    setErrorMsg("");
    setSuccessMsg("");
    setShowEditModal(true);
  };

  const handleOpenDeleteConfirm = (author: AuthorType) => {
    setSelectedAuthor(author);
    setErrorMsg("");
    setSuccessMsg("");
    setShowDeleteConfirm(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMsg("");
    setSuccessMsg("");

    const hasAtLeastOneSocial = [
      formData.twitter,
      formData.instagram,
      formData.youtube,
      formData.linkedin,
      formData.github,
      formData.discord,
      formData.website
    ].some(val => val.trim().length > 0);

    if (!hasAtLeastOneSocial) {
      setErrorMsg("At least one social profile or website link is required.");
      setIsProcessing(false);
      return;
    }

    const socialLinks = {
      twitter: formatSocialLink(formData.twitter, "twitter") || undefined,
      instagram: formatSocialLink(formData.instagram, "instagram") || undefined,
      youtube: formatSocialLink(formData.youtube, "youtube") || undefined,
      linkedin: formatSocialLink(formData.linkedin, "linkedin") || undefined,
      github: formatSocialLink(formData.github, "github") || undefined,
      discord: formatSocialLink(formData.discord, "discord") || undefined,
      website: formatSocialLink(formData.website, "website") || undefined
    };

    try {
      const res = await fetch("/api/authors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          dateOfBirth: formData.dateOfBirth || null,
          bio: formData.bio || null,
          avatar: formData.avatar || null,
          socialLinks
        })
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(`Author profile "${formData.name}" created successfully!`);
        setShowAddModal(false);
        refreshAuthors();
      } else {
        setErrorMsg(data.error || "Failed to create author.");
      }
    } catch (err) {
      setErrorMsg("Failed to communicate with server.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAuthor) return;
    setIsProcessing(true);
    setErrorMsg("");
    setSuccessMsg("");

    const hasAtLeastOneSocial = [
      formData.twitter,
      formData.instagram,
      formData.youtube,
      formData.linkedin,
      formData.github,
      formData.discord,
      formData.website
    ].some(val => val.trim().length > 0);

    if (!hasAtLeastOneSocial) {
      setErrorMsg("At least one social profile or website link is required.");
      setIsProcessing(false);
      return;
    }

    const socialLinks = {
      twitter: formatSocialLink(formData.twitter, "twitter") || undefined,
      instagram: formatSocialLink(formData.instagram, "instagram") || undefined,
      youtube: formatSocialLink(formData.youtube, "youtube") || undefined,
      linkedin: formatSocialLink(formData.linkedin, "linkedin") || undefined,
      github: formatSocialLink(formData.github, "github") || undefined,
      discord: formatSocialLink(formData.discord, "discord") || undefined,
      website: formatSocialLink(formData.website, "website") || undefined
    };

    try {
      const res = await fetch(`/api/authors/${selectedAuthor.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          dateOfBirth: formData.dateOfBirth || null,
          bio: formData.bio || null,
          avatar: formData.avatar || null,
          socialLinks
        })
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(`Author profile updated successfully!`);
        setShowEditModal(false);
        refreshAuthors();
      } else {
        setErrorMsg(data.error || "Failed to update author.");
      }
    } catch (err) {
      setErrorMsg("Failed to communicate with server.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteSubmit = async () => {
    if (!selectedAuthor) return;
    setIsProcessing(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch(`/api/authors/${selectedAuthor.id}`, {
        method: "DELETE"
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg("Author profile deleted successfully.");
        setShowDeleteConfirm(false);
        refreshAuthors();
      } else {
        setErrorMsg(data.error || "Failed to delete author.");
      }
    } catch (err) {
      setErrorMsg("Failed to communicate with server.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn text-left">
      {/* Breadcrumb Header */}
      <header className="pb-6 border-b border-white/5 mb-6">
        <div className="flex items-center gap-2 mb-1.5 text-xs text-gray-500 font-sans">
          <span>Admin</span>
          <ChevronRight className="w-3 h-3 text-gray-600" />
          <span className="text-gray-300 font-medium">Author Registry</span>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            <User className="w-6 h-6 text-[#00a3ff] shadow-[0_0_20px_rgba(0,163,255,0.2)]" />
            Author Profiles
            <span className="text-xs bg-white/5 text-gray-400 font-mono font-normal px-2.5 py-0.5 rounded-full border border-white/10 ml-2">
              {filteredAuthors.length} profiles
            </span>
          </h1>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 bg-[#00a3ff] hover:bg-[#2dc0ff] active:scale-95 text-black font-bold font-mono text-[10px] uppercase tracking-widest px-4.5 py-2.5 rounded-xl shadow-[0_0_30px_rgba(0,163,255,0.25)] transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3px]" />
            Add Author Profile
          </button>
        </div>
      </header>

      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-center gap-2 font-mono">
          <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center gap-2 font-mono">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Filter and control bar */}
      <div className="bg-[#050505] border border-white/5 rounded-2xl p-5 space-y-4 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by author name or biography details..."
              className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-xl py-2.5 pl-10 pr-9 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#00a3ff]/40 transition-all font-sans"
            />
            {search && (
              <button 
                onClick={() => setSearch("")} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-2.5">
            {isProcessing && <Loader2 className="w-4 h-4 animate-spin text-[#00a3ff]" />}
            
            <select
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value)}
              className="bg-[#0a0a0a] border border-white/[0.08] hover:border-white/20 px-3.5 py-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-[#00a3ff]/40 transition-all"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name_az">Name A-Z</option>
              <option value="name_za">Name Z-A</option>
            </select>

            <button
              onClick={refreshAuthors}
              disabled={isProcessing}
              className="p-2.5 bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-xl hover:bg-white/[0.04] transition-all text-gray-400 hover:text-white disabled:opacity-50 cursor-pointer"
              title="Refresh Catalog"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Authors table list */}
      {filteredAuthors.length === 0 ? (
        <div className="text-center py-16 bg-[#050505] rounded-2xl border border-white/5 text-gray-600 font-mono text-sm shadow-inner">
          {authorsList.length === 0 ? "NO REGISTERED AUTHORS FOUND IN DATABASE." : "NO AUTHORS MATCHING FILTERS FOUND."}
        </div>
      ) : (
        <div className="bg-[#050505] rounded-2xl border border-white/5 overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)] animate-fadeIn">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-[#0a0a0a] text-[10px] text-gray-500 uppercase tracking-wider font-mono">
                  <th className="p-4 pl-6">Author Profile</th>
                  <th className="p-4">Date of Birth</th>
                  <th className="p-4">Biography Summary</th>
                  <th className="p-4">Connected Handles</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-white/5 font-sans">
                {filteredAuthors.map((author) => (
                  <tr key={author.id} className="hover:bg-white/[0.01] transition-colors duration-200">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#00a3ff]/10 border border-[#00a3ff]/20 text-[#00a3ff] flex items-center justify-center font-bold text-xs uppercase font-mono">
                          {author.name.substring(0, 2)}
                        </div>
                        <span className="font-bold text-white text-sm">{author.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-400 font-mono">
                      {formatDateDeterministic(author.dateOfBirth)}
                    </td>
                    <td className="p-4 text-gray-500 max-w-xs truncate leading-relaxed">
                      {author.bio || "No biography provided."}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        {Object.entries(author.socialLinks || {}).map(([platform, url]) => {
                          if (!url) return null;
                          return (
                            <a
                              key={platform}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2 py-0.5 rounded bg-white/5 hover:bg-[#00a3ff]/10 text-gray-400 hover:text-[#00a3ff] border border-white/10 hover:border-[#00a3ff]/20 text-[9px] uppercase tracking-wider font-mono flex items-center gap-1 transition-all"
                            >
                              <Link2 className="w-2.5 h-2.5" />
                              {platform}
                            </a>
                          );
                        })}
                        {Object.keys(author.socialLinks || {}).length === 0 && (
                          <span className="text-gray-600 italic">None</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(author)}
                          className="p-2 bg-white/5 border border-white/5 hover:border-[#00a3ff]/25 hover:bg-[#00a3ff]/5 rounded-lg text-gray-400 hover:text-[#00a3ff] transition-all cursor-pointer"
                          title="Edit Profile"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenDeleteConfirm(author)}
                          className="p-2 bg-white/5 border border-white/5 hover:border-red-500/25 hover:bg-red-500/5 rounded-lg text-gray-400 hover:text-red-400 transition-all cursor-pointer"
                          title="Delete Profile"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Author Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-[#050505] border border-white/10 rounded-2xl w-full max-w-xl p-6 relative z-10 shadow-[0_25px_60px_rgba(0,0,0,0.9)] max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-6">
                <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <User className="w-5 h-5 text-[#00a3ff]" />
                  Add New Author Profile
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-500 hover:text-white p-1 hover:bg-white/5 rounded-lg transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest font-mono">Author Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. MR.Faiz"
                      className="w-full bg-[#0a0a0a] border border-white/[0.08] focus:border-[#00a3ff]/40 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-sans"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest font-mono">Date of Birth <span className="text-gray-600 font-normal lowercase italic">(optional)</span></label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="w-full bg-[#0a0a0a] border border-white/[0.08] focus:border-[#00a3ff]/40 rounded-xl px-3.5 py-2 text-xs text-white outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest font-mono">Biography</label>
                  <textarea
                    required
                    value={formData.bio}
                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Describe the author's credentials, role and background..."
                    rows={3}
                    className="w-full bg-[#0a0a0a] border border-white/[0.08] focus:border-[#00a3ff]/40 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-sans resize-none"
                  />
                </div>

                <div className="border-t border-white/5 pt-4">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest font-mono block mb-3">Social Profiles & Links</span>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-semibold text-gray-500">X / Twitter</label>
                      <input
                        type="text"
                        value={formData.twitter}
                        onChange={e => setFormData({ ...formData, twitter: e.target.value })}
                        placeholder="https://x.com/username"
                        className="bg-[#0a0a0a] border border-white/[0.08] focus:border-[#00a3ff]/40 rounded-xl px-3.5 py-2 text-xs text-white outline-none font-sans"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-semibold text-gray-500">Instagram</label>
                      <input
                        type="text"
                        value={formData.instagram}
                        onChange={e => setFormData({ ...formData, instagram: e.target.value })}
                        placeholder="https://instagram.com/username"
                        className="bg-[#0a0a0a] border border-white/[0.08] focus:border-[#00a3ff]/40 rounded-xl px-3.5 py-2 text-xs text-white outline-none font-sans"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-semibold text-gray-500">YouTube</label>
                      <input
                        type="text"
                        value={formData.youtube}
                        onChange={e => setFormData({ ...formData, youtube: e.target.value })}
                        placeholder="https://youtube.com/@channel"
                        className="bg-[#0a0a0a] border border-white/[0.08] focus:border-[#00a3ff]/40 rounded-xl px-3.5 py-2 text-xs text-white outline-none font-sans"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-semibold text-gray-500">LinkedIn</label>
                      <input
                        type="text"
                        value={formData.linkedin}
                        onChange={e => setFormData({ ...formData, linkedin: e.target.value })}
                        placeholder="https://linkedin.com/in/username"
                        className="bg-[#0a0a0a] border border-white/[0.08] focus:border-[#00a3ff]/40 rounded-xl px-3.5 py-2 text-xs text-white outline-none font-sans"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-semibold text-gray-500">GitHub</label>
                      <input
                        type="text"
                        value={formData.github}
                        onChange={e => setFormData({ ...formData, github: e.target.value })}
                        placeholder="https://github.com/username"
                        className="bg-[#0a0a0a] border border-white/[0.08] focus:border-[#00a3ff]/40 rounded-xl px-3.5 py-2 text-xs text-white outline-none font-sans"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-semibold text-gray-500">Discord</label>
                      <input
                        type="text"
                        value={formData.discord}
                        onChange={e => setFormData({ ...formData, discord: e.target.value })}
                        placeholder="https://discord.gg/invite"
                        className="bg-[#0a0a0a] border border-white/[0.08] focus:border-[#00a3ff]/40 rounded-xl px-3.5 py-2 text-xs text-white outline-none font-sans"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 col-span-2">
                      <label className="text-[9px] font-semibold text-gray-500">Website / Custom Link</label>
                      <input
                        type="text"
                        value={formData.website}
                        onChange={e => setFormData({ ...formData, website: e.target.value })}
                        placeholder="https://example.com"
                        className="bg-[#0a0a0a] border border-white/[0.08] focus:border-[#00a3ff]/40 rounded-xl px-3.5 py-2 text-xs text-white outline-none font-sans"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-bold text-gray-400 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="px-5 py-2.5 rounded-xl bg-[#00a3ff] hover:bg-[#2dc0ff] active:scale-95 text-black font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isProcessing ? "Creating Profile..." : "Create Author Profile"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Author Modal */}
      <AnimatePresence>
        {showEditModal && selectedAuthor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEditModal(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-[#050505] border border-white/10 rounded-2xl w-full max-w-xl p-6 relative z-10 shadow-[0_25px_60px_rgba(0,0,0,0.9)] max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-6">
                <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <Edit className="w-5 h-5 text-[#00a3ff]" />
                  Edit Author Profile
                </h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-500 hover:text-white p-1 hover:bg-white/5 rounded-lg transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest font-mono">Author Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. MR.Faiz"
                      className="w-full bg-[#0a0a0a] border border-white/[0.08] focus:border-[#00a3ff]/40 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-sans"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest font-mono">Date of Birth <span className="text-gray-600 font-normal lowercase italic">(optional)</span></label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="w-full bg-[#0a0a0a] border border-white/[0.08] focus:border-[#00a3ff]/40 rounded-xl px-3.5 py-2 text-xs text-white outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest font-mono">Biography</label>
                  <textarea
                    required
                    value={formData.bio}
                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Describe the author's credentials, role and background..."
                    rows={3}
                    className="w-full bg-[#0a0a0a] border border-white/[0.08] focus:border-[#00a3ff]/40 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-sans resize-none"
                  />
                </div>

                <div className="border-t border-white/5 pt-4">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest font-mono block mb-3">Social Profiles & Links</span>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-semibold text-gray-500">X / Twitter</label>
                      <input
                        type="text"
                        value={formData.twitter}
                        onChange={e => setFormData({ ...formData, twitter: e.target.value })}
                        placeholder="https://x.com/username"
                        className="bg-[#0a0a0a] border border-white/[0.08] focus:border-[#00a3ff]/40 rounded-xl px-3.5 py-2 text-xs text-white outline-none font-sans"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-semibold text-gray-500">Instagram</label>
                      <input
                        type="text"
                        value={formData.instagram}
                        onChange={e => setFormData({ ...formData, instagram: e.target.value })}
                        placeholder="https://instagram.com/username"
                        className="bg-[#0a0a0a] border border-white/[0.08] focus:border-[#00a3ff]/40 rounded-xl px-3.5 py-2 text-xs text-white outline-none font-sans"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-semibold text-gray-500">YouTube</label>
                      <input
                        type="text"
                        value={formData.youtube}
                        onChange={e => setFormData({ ...formData, youtube: e.target.value })}
                        placeholder="https://youtube.com/@channel"
                        className="bg-[#0a0a0a] border border-white/[0.08] focus:border-[#00a3ff]/40 rounded-xl px-3.5 py-2 text-xs text-white outline-none font-sans"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-semibold text-gray-500">LinkedIn</label>
                      <input
                        type="text"
                        value={formData.linkedin}
                        onChange={e => setFormData({ ...formData, linkedin: e.target.value })}
                        placeholder="https://linkedin.com/in/username"
                        className="bg-[#0a0a0a] border border-white/[0.08] focus:border-[#00a3ff]/40 rounded-xl px-3.5 py-2 text-xs text-white outline-none font-sans"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-semibold text-gray-500">GitHub</label>
                      <input
                        type="text"
                        value={formData.github}
                        onChange={e => setFormData({ ...formData, github: e.target.value })}
                        placeholder="https://github.com/username"
                        className="bg-[#0a0a0a] border border-white/[0.08] focus:border-[#00a3ff]/40 rounded-xl px-3.5 py-2 text-xs text-white outline-none font-sans"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-semibold text-gray-500">Discord</label>
                      <input
                        type="text"
                        value={formData.discord}
                        onChange={e => setFormData({ ...formData, discord: e.target.value })}
                        placeholder="https://discord.gg/invite"
                        className="bg-[#0a0a0a] border border-white/[0.08] focus:border-[#00a3ff]/40 rounded-xl px-3.5 py-2 text-xs text-white outline-none font-sans"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 col-span-2">
                      <label className="text-[9px] font-semibold text-gray-500">Website / Custom Link</label>
                      <input
                        type="text"
                        value={formData.website}
                        onChange={e => setFormData({ ...formData, website: e.target.value })}
                        placeholder="https://example.com"
                        className="bg-[#0a0a0a] border border-white/[0.08] focus:border-[#00a3ff]/40 rounded-xl px-3.5 py-2 text-xs text-white outline-none font-sans"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-bold text-gray-400 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="px-5 py-2.5 rounded-xl bg-[#00a3ff] hover:bg-[#2dc0ff] active:scale-95 text-black font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isProcessing ? "Updating Profile..." : "Update Author Profile"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && selectedAuthor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteConfirm(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-[#050505] border border-red-500/20 rounded-2xl w-full max-w-md p-6 relative z-10 shadow-[0_20px_50px_rgba(0,0,0,0.9)] text-center"
            >
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4 animate-bounce" />
              <h2 className="text-lg font-bold text-white tracking-tight mb-2">Delete Author Profile?</h2>
              <p className="text-gray-400 text-xs leading-relaxed mb-6 font-sans">
                Are you sure you want to delete the author profile for <strong className="text-white">"{selectedAuthor.name}"</strong>? This will clear all their bios and social links from the database registry.
              </p>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-bold text-gray-400 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteSubmit}
                  disabled={isProcessing}
                  className="px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 active:scale-95 text-white font-bold text-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? "Deleting..." : "Confirm Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
