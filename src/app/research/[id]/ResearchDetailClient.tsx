"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen, ArrowLeft, ArrowRight, Users, Calendar, Link2,
  ChevronRight, FileText, Globe, Tag, ExternalLink, Terminal,
  Copy, Check, Hash, UserCheck, CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";
import { XIcon, LinkedinIcon, GithubIcon, InstagramIcon, YouTubeIcon, DiscordIcon } from "@/components/SocialIcons";
import { parseMarkdown, extractHeadings } from "@/components/blog/MarkdownRenderer";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Contributor {
  name: string;
  role?: string;
}

interface ResearchPaper {
  id: string;
  title: string;
  abstract: string | null;
  type: string;
  author: string | null;
  date: string | null;
  fullText?: string | null;
  keywords?: string[] | null;
  doi?: string | null;
  institution?: string | null;
  externalUrl?: string | null;
  showContributors?: boolean;
  contributors?: Contributor[] | null;
}

interface ResearchDetailClientProps {
  id: string;
  initialPaper?: ResearchPaper | null;
  initialAuthors?: any[];
}

// ─── Micro-components ────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <button
      onClick={() => navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); })}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.03] hover:border-[#00a3ff]/30 hover:bg-[#00a3ff]/5 text-gray-500 hover:text-[#00a3ff] transition-all duration-200 text-xs font-medium"
    >
      {copied
        ? <><Check className="w-3.5 h-3.5 text-emerald-400" /><span className="text-emerald-400">Copied</span></>
        : <><Copy className="w-3.5 h-3.5" /><span>Copy link</span></>}
    </button>
  );
}

// ─── Table of Contents ────────────────────────────────────────────────────────

function TableOfContents({ content }: { content: string }) {
  const headings = React.useMemo(() => extractHeadings(content).filter(h => h.level <= 3), [content]);
  const [activeId, setActiveId] = React.useState<string>("");

  React.useEffect(() => {
    if (!headings.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );
    headings.forEach(h => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 3) return null;

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#060609] overflow-hidden shadow-2xl">
      <div className="px-5 py-4 border-b border-white/[0.06] bg-[#08080c]">
        <div className="flex items-center gap-2">
          <Hash className="w-3.5 h-3.5 text-[#00a3ff]" />
          <p className="text-[10px] font-black tracking-[0.25em] uppercase text-[#00a3ff]/70">Contents</p>
        </div>
      </div>
      <nav className="p-4 max-h-[420px] overflow-y-auto">
        <ul className="space-y-0.5">
          {headings.map((h) => (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                  setActiveId(h.id);
                }}
                className={`block py-1.5 text-[11px] font-medium leading-snug transition-all duration-200 rounded-lg px-2 ${
                  h.level === 2 ? "pl-2" : h.level === 3 ? "pl-5" : "pl-8"
                } ${
                  activeId === h.id
                    ? "text-[#00a3ff] bg-[#00a3ff]/[0.08] border-l-2 border-[#00a3ff]"
                    : "text-gray-500 hover:text-gray-200 hover:bg-white/[0.02] border-l-2 border-transparent"
                }`}
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}


function SideLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-black tracking-[0.3em] uppercase text-[#00a3ff]/60 mb-3">
      {children}
    </p>
  );
}

// ─── Author Card ─────────────────────────────────────────────────────────────

function AuthorCard({ authorName, authorsList, label = "Author" }: {
  authorName: string | null | undefined;
  authorsList: any[];
  label?: string;
}) {
  if (!authorName) return null;

  const nameLower = authorName.toLowerCase().replace(/\s+/g, ' ').trim();
  let authorObj = authorsList.find(a => a.name?.toLowerCase().replace(/\s+/g, ' ').trim() === nameLower) || null;

  if (!authorObj && ["mr.faiz", "faiz", "mr. faiz", "mr faiz", "shah faiz", "shah  faiz"].includes(nameLower)) {
    authorObj = {
      name: "SHAH  FAIZ",
      dateOfBirth: null,
      bio: "Founder & systems builder. Engineering sovereign digital systems from first principles, built without institutional backing or venture safety nets.",
      socialLinks: {
        twitter: "https://x.com/MrUniqers",
        instagram: "https://www.instagram.com/mr.uniqers/",
        youtube: "https://youtube.com/@channel",
        linkedin: "https://www.linkedin.com/in/iamrealshahfaiz/",
        github: "https://github.com/mruniqers",
        discord: "https://discord.com/invite/introlic"
      }
    };
  }

  if (!authorObj && ["riddhi sinha", "riddhi"].includes(nameLower)) {
    authorObj = {
      name: "Riddhi Sinha",
      dateOfBirth: "2009-03-26",
      bio: "rn looking for co founder",
      socialLinks: null
    };
  }

  const displayObj = authorObj || { name: authorName, bio: null, dateOfBirth: null, socialLinks: null };

  const initials = displayObj.name
    ? displayObj.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "R";

  let ageAndDOB = "";
  if (displayObj.dateOfBirth) {
    const d = new Date(displayObj.dateOfBirth);
    if (!isNaN(d.getTime())) {
      const today = new Date();
      let age = today.getFullYear() - d.getFullYear();
      const m = today.getMonth() - d.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
      ageAndDOB = `${d.toLocaleDateString("en-US", { timeZone: "UTC", year: "numeric", month: "long", day: "numeric" })} (Age ${age})`;
    }
  }

  const socials = [
    { key: "twitter",   icon: XIcon,          label: "Twitter/X" },
    { key: "linkedin",  icon: LinkedinIcon,   label: "LinkedIn" },
    { key: "github",    icon: GithubIcon,     label: "GitHub" },
    { key: "instagram", icon: InstagramIcon,  label: "Instagram" },
    { key: "youtube",   icon: YouTubeIcon,    label: "YouTube" },
    { key: "discord",   icon: DiscordIcon,    label: "Discord" },
    { key: "website",   icon: Link2,          label: "Website" },
  ].filter(s => displayObj.socialLinks?.[s.key]);

  return (
    <div className="rounded-2xl overflow-hidden border border-white/[0.08] bg-[#060609] shadow-2xl relative group transition-all duration-300 hover:border-[#00a3ff]/30">
      {/* Top accent glow */}
      <div className="h-[2px] w-full bg-gradient-to-r from-[#00a3ff] via-[#00d1ff] to-transparent" />

      <div className="p-6 sm:p-7">
        {/* Header label */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00a3ff] animate-pulse" />
            <span className="text-[10px] font-mono font-bold tracking-[0.25em] uppercase text-[#00a3ff]">
              {label}
            </span>
          </div>
          <span className="text-[9px] font-mono text-gray-600 uppercase tracking-widest">Verified Profile</span>
        </div>

        {/* Profile Details */}
        <div className="flex items-center gap-4 mb-5">
          {displayObj.avatar || displayObj.imageUrl || displayObj.avatarUrl ? (
            <div className="w-14 h-14 rounded-2xl overflow-hidden border border-[#00a3ff]/40 shadow-[0_0_25px_rgba(0,163,255,0.2)] shrink-0 bg-black">
              <img src={displayObj.avatar || displayObj.imageUrl || displayObj.avatarUrl} alt={displayObj.name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00a3ff]/20 via-[#0055ff]/15 to-[#00d1ff]/10 border border-[#00a3ff]/40 flex items-center justify-center shrink-0 select-none shadow-[0_0_25px_rgba(0,163,255,0.2)] group-hover:border-[#00a3ff]/60 transition-colors">
              <UserCheck className="w-6 h-6 text-[#00a3ff]" />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#00a3ff] border-2 border-[#060609] flex items-center justify-center text-[9px] font-black text-black">
                {initials}
              </div>
            </div>
          )}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-white tracking-tight leading-none">{displayObj.name}</h3>
              <CheckCircle2 className="w-4 h-4 text-[#00a3ff] shrink-0" />
            </div>
            {ageAndDOB && (
              <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono text-gray-400 font-medium">
                {ageAndDOB}
              </span>
            )}
          </div>
        </div>

        {/* Bio */}
        {displayObj.bio && (
          <p className="text-xs text-gray-300 leading-relaxed font-medium mb-6 bg-white/[0.015] border border-white/[0.05] p-4 rounded-xl">
            {displayObj.bio}
          </p>
        )}

        {/* Social Links */}
        {socials.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-white/[0.06]">
            {socials.map(({ key, icon: Icon, label }) => (
              <a key={key} href={displayObj.socialLinks[key]} target="_blank" rel="noopener noreferrer" title={label}
                className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-[#00a3ff]/40 hover:bg-[#00a3ff]/10 text-gray-400 hover:text-[#00a3ff] flex items-center justify-center transition-all duration-300 shadow-sm">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ResearchDetailClient({ id, initialPaper = null, initialAuthors = [] }: ResearchDetailClientProps) {
  const router = useRouter();
  const [paper, setPaper] = useState<ResearchPaper | null>(initialPaper);
  const [authorsList, setAuthorsList] = useState<any[]>(initialAuthors);
  const [loading, setLoading] = useState(!initialPaper);
  const [pageUrl, setPageUrl] = useState(`https://introlic.site/research/${id}`);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPageUrl(window.location.href);
    }
    if (initialPaper && initialAuthors && initialAuthors.length > 0) {
      setLoading(false);
      return;
    }
    fetch("/api/authors").then(r => r.json()).then(d => { if (Array.isArray(d)) setAuthorsList(d); }).catch(() => {});
    fetch(`/api/research/${id}`)
      .then(r => { if (!r.ok) throw new Error("Not found"); return r.json(); })
      .then(d => { if (d.paper) setPaper(d.paper); })
      .catch(() => {
        if (typeof window !== "undefined") {
          const stored = localStorage.getItem("introlic_custom_research");
          if (stored) {
            try {
              const list: any[] = JSON.parse(stored);
              const found = list.find(p => p.id === id);
              if (found) setPaper({ ...found, fullText: found.fullTextRaw || found.abstract });
            } catch {}
          }
        }
      })
      .finally(() => setLoading(false));
  }, [id, initialPaper, initialAuthors]);

  // ── Loading ──
  if (loading) {
    return (
      <main className="min-h-screen bg-[#020202] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-9 h-9 rounded-full border-2 border-white/10 border-t-[#00a3ff] animate-spin" />
          <p className="text-sm font-mono text-gray-600">Querying research archive...</p>
        </div>
      </main>
    );
  }

  // ── Not found ──
  if (!paper) {
    return (
      <main className="min-h-screen bg-[#020202] flex flex-col items-center justify-center p-6 text-center text-white font-sans">
        <div className="max-w-md space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-center mx-auto">
            <BookOpen className="w-7 h-7 text-red-500/60 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white uppercase tracking-tight mb-2">Paper Not Found</h1>
            <p className="text-gray-500 text-sm leading-relaxed">
              No research document matched <span className="font-mono text-[#00a3ff]">{id}</span>.
            </p>
          </div>
          <Link href="/research" className="inline-flex items-center gap-2 px-5 py-3 bg-white text-black text-sm font-black uppercase tracking-wider rounded-xl hover:bg-gray-100 transition-all">
            <ArrowLeft className="w-4 h-4" /> Return to Gallery
          </Link>
        </div>
      </main>
    );
  }

  const fullContent = paper.fullText || paper.abstract || "";

  return (
    <main suppressHydrationWarning className="min-h-screen bg-[#020202] font-sans relative text-white">

      {/* ── Ambient glows ── */}
      <div className="absolute top-0 left-0 w-[700px] h-[700px] bg-[#00a3ff]/[0.04] blur-[220px] rounded-full pointer-events-none -translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#0055bb]/[0.05] blur-[180px] rounded-full pointer-events-none translate-x-1/4 translate-y-1/4" />

      {/* ═══════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════ */}
      <section className="relative border-b border-white/[0.05]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 pt-28 pb-14 md:pt-36 md:pb-20 relative z-10">

          {/* Nav row */}
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="flex items-center justify-between mb-12">
            <Link href="/research"
              className="group flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-white uppercase tracking-widest transition-colors">
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              Research
            </Link>
            <div className="flex items-center gap-3">
              <CopyButton text={pageUrl} />
              <span suppressHydrationWarning className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest hidden sm:block">Share Document</span>
            </div>
          </motion.div>

          {/* Title block */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end">

            <div className="lg:col-span-8 space-y-6">
              {/* Type breadcrumb */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center border shrink-0"
                  style={{ background: "rgba(0,163,255,0.08)", borderColor: "rgba(0,163,255,0.18)" }}>
                  <BookOpen className="w-5 h-5 text-[#00a3ff]" />
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-gray-600 uppercase tracking-widest min-w-0">
                  <span>Research</span>
                  <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-[#00a3ff]/70 shrink-0">{paper.type}</span>
                  <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-gray-400 font-bold max-w-[180px] sm:max-w-[340px] truncate">{paper.title}</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-black text-white tracking-tighter leading-[0.95] uppercase">
                {paper.title}
              </h1>

              {/* Author + date */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                {paper.author && (
                  <span className="text-base text-gray-400 font-medium">
                    by <span className="text-white font-bold">{paper.author}</span>
                  </span>
                )}
                {paper.date && (
                  <>
                    <span className="w-1.5 h-1.5 bg-gray-700 rounded-full" />
                    <span className="flex items-center gap-1.5 text-sm text-gray-500 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-[#00a3ff]/60" />
                      {paper.date}
                    </span>
                  </>
                )}
                {paper.institution && (
                  <>
                    <span className="w-1.5 h-1.5 bg-gray-700 rounded-full" />
                    <span className="text-sm text-gray-500 font-mono">{paper.institution}</span>
                  </>
                )}
              </div>
            </div>

            {/* Status + type badge */}
            <div className="lg:col-span-4 flex lg:justify-end">
              <div className="flex flex-wrap lg:flex-col items-center lg:items-end gap-2.5">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#00a3ff]/20 bg-[#00a3ff]/[0.06] text-[#00a3ff] text-xs font-black tracking-widest uppercase shrink-0">
                  <span className="w-2 h-2 rounded-full bg-[#00a3ff] animate-pulse" />
                  {paper.type}
                </span>
                {paper.keywords && paper.keywords.slice(0, 3).map(kw => (
                  <span key={kw} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.07] text-[11px] font-bold uppercase tracking-wider text-gray-400 shrink-0">
                    <Hash className="w-2.5 h-2.5 text-[#00a3ff]/60" />{kw}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          MAIN CONTENT GRID
      ═══════════════════════════════════════════════════════ */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 py-12 md:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">

          {/* ── LEFT: Main Content ───────────────────────── */}
          <div className="lg:col-span-8 space-y-8">

            {/* Full Document — GitHub README style */}
            {fullContent && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
                className="rounded-2xl border border-white/[0.07] bg-[#060609] overflow-hidden">

                {/* Terminal toolbar */}
                <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-white/[0.06] bg-[#08080c] gap-2">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                      <div className="w-3 h-3 rounded-full bg-red-500/40 border border-red-500/20" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/40 border border-yellow-500/20" />
                      <div className="w-3 h-3 rounded-full bg-green-500/40 border border-green-500/20" />
                    </div>
                    <div className="flex items-center gap-2 sm:ml-2 min-w-0">
                      <Terminal className="w-3.5 h-3.5 text-[#00a3ff] shrink-0" />
                      <span className="text-xs font-mono font-bold text-white tracking-tight truncate max-w-[200px] sm:max-w-[380px] md:max-w-[540px]">
                        {paper.title}
                      </span>
                      <span className="text-[10px] font-mono text-[#00a3ff]/70 uppercase tracking-widest font-semibold shrink-0 hidden sm:inline-block">
                        — Whitepaper
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Published</span>
                  </div>
                </div>

                {/* Full paper content */}
                <div className="p-4 sm:p-8 md:p-10">
                  {parseMarkdown(fullContent)}
                </div>
              </motion.div>
            )}

            {/* Contributors */}
            {paper.showContributors && paper.contributors && paper.contributors.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
                className="rounded-2xl border border-white/[0.07] bg-[#060609] p-7">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/[0.06]">
                  <Users className="w-4 h-4 text-[#00a3ff]" />
                  <p className="text-xs font-black tracking-[0.3em] uppercase text-[#00a3ff]/60">Document Contributors</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {paper.contributors.map((contrib, idx) => {
                    const initials = contrib.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
                    return (
                      <div key={idx} className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-[#00a3ff]/20 transition-all">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 flex items-center justify-center text-white/80 font-black text-xs shrink-0">
                          {initials}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">{contrib.name}</div>
                          <div className="text-xs text-gray-500 font-mono uppercase tracking-wider mt-0.5">{contrib.role || "Contributor"}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>

          {/* ── RIGHT: Sidebar ───────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-4 lg:sticky lg:top-28 self-start space-y-6"
          >
            {/* Table of Contents — shown only for papers with enough headings */}
            {fullContent && <TableOfContents content={fullContent} />}

            {/* Author */}
            <AuthorCard authorName={paper.author} authorsList={authorsList} label="Author" />


            {/* Parameters panel */}
            <div className="rounded-2xl border border-white/[0.08] bg-[#060609] divide-y divide-white/[0.05] shadow-2xl overflow-hidden">

              {paper.date && (
                <div className="p-6">
                  <SideLabel>Published</SideLabel>
                  <div className="flex items-center gap-2.5 text-sm text-white font-bold mt-1">
                    <div className="w-8 h-8 rounded-lg bg-[#00a3ff]/10 border border-[#00a3ff]/20 flex items-center justify-center shrink-0">
                      <Calendar className="w-4 h-4 text-[#00a3ff]" />
                    </div>
                    <span>{paper.date}</span>
                  </div>
                </div>
              )}

              <div className="p-6">
                <SideLabel>Document Type</SideLabel>
                <div className="flex items-center gap-2.5 text-sm text-white font-bold mt-1">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="uppercase tracking-wider font-mono text-xs text-emerald-400">{paper.type}</span>
                </div>
              </div>

              {paper.keywords && paper.keywords.length > 0 && (
                <div className="p-6">
                  <SideLabel>Keywords</SideLabel>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {paper.keywords.map(kw => (
                      <span key={kw}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-[11px] font-bold uppercase tracking-wider text-gray-300 hover:border-[#00a3ff]/30 transition-all">
                        <Hash className="w-2.5 h-2.5 text-[#00a3ff]" />{kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Links / DOI */}
            {(paper.doi || paper.externalUrl) && (
              <div className="rounded-2xl border border-white/[0.08] bg-[#060609] p-6 space-y-4 shadow-2xl">
                <SideLabel>References & Citations</SideLabel>
                <div className="space-y-3">
                  {paper.doi && (
                    <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                      <Tag className="w-4 h-4 text-[#00a3ff] mt-0.5 shrink-0" />
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-0.5">DOI Identifier</div>
                        <div className="text-xs font-mono text-gray-200 break-all">{paper.doi}</div>
                      </div>
                    </div>
                  )}
                  {paper.externalUrl && (
                    <a href={paper.externalUrl} target="_blank" rel="noopener noreferrer"
                      className="group flex items-center justify-between w-full px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-[#00a3ff]/25 hover:bg-[#00a3ff]/5 transition-all duration-200">
                      <span className="flex items-center gap-3 text-sm font-semibold text-gray-400 group-hover:text-white">
                        <Link2 className="w-4 h-4 text-[#00a3ff]" />
                        External Reference
                      </span>
                      <ExternalLink className="w-4 h-4 text-gray-700 group-hover:text-[#00a3ff] transition-colors" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* ═══════════════════════════════════════════════════════
            BOTTOM CTA — Ultra-Premium Glassmorphic Card
        ═══════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="mt-16 md:mt-24"
        >
          <div className="relative rounded-3xl border border-white/[0.08] bg-gradient-to-r from-[#060609] via-[#0b0e17] to-[#060609] p-6 sm:p-10 md:p-12 overflow-hidden shadow-2xl group">
            {/* Ambient background glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#00a3ff]/[0.06] blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
              <div className="lg:col-span-7 space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00a3ff] animate-pulse" />
                  <p className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.25em] uppercase text-[#00a3ff]">
                    Explore Further
                  </p>
                </div>
                <h4 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
                  Dive into our research archive
                </h4>
                <p className="text-xs sm:text-sm text-gray-400 font-medium leading-relaxed max-w-xl">
                  Browse our full catalogue of whitepapers, technical documents, and milestone publications.
                </p>
              </div>

              <div className="lg:col-span-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 lg:justify-end">
                <Link href="/research"
                  className="flex items-center justify-center gap-2 px-5 py-3 sm:px-6 sm:py-3.5 rounded-xl border border-white/[0.10] bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/20 text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-200 text-gray-200 shrink-0">
                  Research Gallery
                </Link>
                <Link href="/contact"
                  className="group flex items-center justify-center gap-2 px-5 py-3 sm:px-6 sm:py-3.5 rounded-xl bg-[#00a3ff] hover:bg-[#0090e0] text-black font-black text-xs sm:text-sm tracking-wider uppercase transition-all duration-200 shadow-[0_0_30px_rgba(0,163,255,0.25)] hover:shadow-[0_0_50px_rgba(0,163,255,0.4)] shrink-0">
                  Contact Research Team
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </main>
  );
}
