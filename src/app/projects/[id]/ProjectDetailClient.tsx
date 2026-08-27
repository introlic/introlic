"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Gamepad2, FlaskConical, Globe, BookOpen, Cpu, Music,
  ArrowLeft, ArrowRight, Users, ExternalLink,
  Calendar, Link2, CheckCircle2, Terminal,
  Copy, Check, ChevronRight, Sparkles, Activity,
  Code2, BadgeCheck
} from "lucide-react";
import { motion } from "framer-motion";
import { XIcon, LinkedinIcon, GithubIcon, InstagramIcon, YouTubeIcon, DiscordIcon } from "@/components/SocialIcons";
import { parseMarkdown } from "@/components/projects/ProjectsGallery";

// ─── Types ───────────────────────────────────────────────────────────────────

type Status = "Active" | "Planning" | "Recruiting" | "Paused";

interface Project {
  id: string;
  category: string;
  title: string;
  topic: string | null;
  why: string | null;
  factors: string[] | null;
  status: string;
  tags: string[] | null;
  openTo: string | null;
  started: string | null;
  author: string;
  authorRole?: string | null;
  readme?: string | null;
  postedDate?: string | null;
  githubUrl?: string | null;
  demoUrl?: string | null;
  logoUrl?: string | null;
}

// ─── Constants & Utilities ────────────────────────────────────────────────────

const STATUS_STYLES: Record<Status, { bg: string; text: string; dot: string; border: string }> = {
  Active:     { bg: "rgba(0,163,255,0.08)",   text: "#00a3ff", dot: "#00a3ff",  border: "rgba(0,163,255,0.25)"   },
  Planning:   { bg: "rgba(168,85,247,0.08)",  text: "#a855f7", dot: "#a855f7",  border: "rgba(168,85,247,0.25)"  },
  Recruiting: { bg: "rgba(16,185,129,0.08)",  text: "#10b981", dot: "#10b981",  border: "rgba(16,185,129,0.25)"  },
  Paused:     { bg: "rgba(107,114,128,0.08)", text: "#6b7280", dot: "#6b7280",  border: "rgba(107,114,128,0.25)" },
};

const getCategoryIcon = (category: string): React.ElementType => {
  if (category === "Game") return Gamepad2;
  if (category === "Research") return FlaskConical;
  if (category === "Tool") return Globe;
  if (category === "Community") return Users;
  if (category === "Science") return Cpu;
  if (category === "Education") return BookOpen;
  return Music;
};

const formatDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [year, month, day] = dateStr.split("-");
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    return `${months[parseInt(month, 10) - 1]} ${parseInt(day, 10)}, ${year}`;
  }
  return dateStr;
};

const getTechBadgeStyle = (tag: string) => {
  const t = tag.toLowerCase().trim();
  if (t === "next.js" || t === "nextjs" || t === "next") {
    return "bg-[#000000]/80 text-white border-white/20 hover:border-white/50 shadow-[0_0_12px_rgba(255,255,255,0.08)]";
  }
  if (t === "typescript" || t === "ts") {
    return "bg-[#3178c6]/15 text-[#60a5fa] border-[#3178c6]/40 hover:bg-[#3178c6]/25 shadow-[0_0_12px_rgba(49,120,198,0.15)]";
  }
  if (t === "bun") {
    return "bg-[#fbf0df]/10 text-[#fde047] border-[#fbf0df]/30 hover:bg-[#fbf0df]/20 shadow-[0_0_12px_rgba(253,224,71,0.15)]";
  }
  if (t === "go" || t === "golang") {
    return "bg-[#00add8]/15 text-[#38bdf8] border-[#00add8]/40 hover:bg-[#00add8]/25 shadow-[0_0_12px_rgba(0,173,216,0.15)]";
  }
  if (t === "rust") {
    return "bg-[#cea472]/15 text-[#fb923c] border-[#cea472]/40 hover:bg-[#cea472]/25 shadow-[0_0_12px_rgba(206,164,114,0.15)]";
  }
  if (t === "tailwindcss" || t === "tailwind") {
    return "bg-[#38bdf8]/15 text-[#38bdf8] border-[#38bdf8]/40 hover:bg-[#38bdf8]/25 shadow-[0_0_12px_rgba(56,189,248,0.15)]";
  }
  if (t === "python") {
    return "bg-[#3776ab]/15 text-[#60a5fa] border-[#3776ab]/40 hover:bg-[#3776ab]/25 shadow-[0_0_12px_rgba(55,118,171,0.15)]";
  }
  if (t === "react" || t === "reactjs") {
    return "bg-[#61dafb]/15 text-[#61dafb] border-[#61dafb]/40 hover:bg-[#61dafb]/25 shadow-[0_0_12px_rgba(97,218,251,0.15)]";
  }
  return "bg-[#00a3ff]/10 text-[#00a3ff] border-[#00a3ff]/25 hover:bg-[#00a3ff]/20 shadow-[0_0_10px_rgba(0,163,255,0.1)]";
};

// ─── Micro-components ────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); })}
      title="Copy link"
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.03] hover:border-[#00a3ff]/30 hover:bg-[#00a3ff]/5 text-gray-500 hover:text-[#00a3ff] transition-all duration-200 text-xs font-medium"
    >
      {copied ? <><Check className="w-3.5 h-3.5 text-emerald-400" /><span className="text-emerald-400">Copied</span></> : <><Copy className="w-3.5 h-3.5" /><span>Copy link</span></>}
    </button>
  );
}

// ─── Author Card ─────────────────────────────────────────────────────────────

function AuthorCard({ authorObj, ageAndDOB }: { authorObj: any; ageAndDOB: string }) {
  const initials = authorObj.name
    ? authorObj.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "A";

  const socials = [
    { key: "twitter",   icon: XIcon,          label: "Twitter/X" },
    { key: "linkedin",  icon: LinkedinIcon,   label: "LinkedIn" },
    { key: "github",    icon: GithubIcon,     label: "GitHub" },
    { key: "instagram", icon: InstagramIcon,  label: "Instagram" },
    { key: "youtube",   icon: YouTubeIcon,    label: "YouTube" },
    { key: "discord",   icon: DiscordIcon,    label: "Discord" },
    { key: "website",   icon: Link2,          label: "Website" },
  ].filter(s => authorObj.socialLinks?.[s.key]);

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#060609] p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.05]">
        <p className="text-[10px] font-black tracking-[0.3em] uppercase text-[#00a3ff]">
          Project Lead
        </p>
        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Architect</span>
      </div>

      {/* Profile Info */}
      <div className="flex items-center gap-4">
        <div className="w-13 h-13 rounded-xl bg-[#00a3ff]/10 border border-[#00a3ff]/20 flex items-center justify-center text-[#00a3ff] font-black text-base shrink-0 select-none">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-base font-black text-white tracking-tight truncate">{authorObj.name}</div>
          {ageAndDOB && (
            <div className="text-xs text-gray-500 font-mono mt-0.5">{ageAndDOB}</div>
          )}
          <span className="inline-block mt-1 text-[11px] font-medium text-[#00a3ff] bg-[#00a3ff]/10 px-2 py-0.5 rounded border border-[#00a3ff]/20">
            Chief Architect
          </span>
        </div>
      </div>

      {/* Bio */}
      {authorObj.bio && (
        <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-medium border-l-2 border-[#00a3ff]/30 pl-3 py-0.5">
          {authorObj.bio}
        </p>
      )}

      {/* Social Links */}
      {socials.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-4 border-t border-white/[0.05]">
          {socials.map(({ key, icon: Icon, label }) => (
            <a
              key={key}
              href={authorObj.socialLinks[key]}
              target="_blank"
              rel="noopener noreferrer"
              title={label}
              className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:border-[#00a3ff]/40 hover:bg-[#00a3ff]/10 text-gray-400 hover:text-[#00a3ff] flex items-center justify-center transition-all duration-200"
            >
              <Icon className="w-4 h-4" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

function Sidebar({ project, authorObj, ageAndDOB }: { project: Project; authorObj: any; ageAndDOB: string }) {
  const s = STATUS_STYLES[project.status as Status] || STATUS_STYLES.Active;
  const openToList = project.openTo ? project.openTo.split(/[,\n]+/).map(s => s.trim()).filter(Boolean) : [];

  return (
    <div className="space-y-5">

      {/* 1. PROJECT LEAD FIRST */}
      {authorObj && <AuthorCard authorObj={authorObj} ageAndDOB={ageAndDOB} />}

      {/* 2. STATUS & TIMELINE */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#060609] divide-y divide-white/[0.05]">
        {/* Status */}
        <div className="p-5">
          <p className="text-[10px] font-black tracking-[0.3em] uppercase text-gray-500 mb-3">Status</p>
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-black tracking-wide"
            style={{ background: s.bg, color: s.text, borderColor: s.border }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot }} />
            {project.status}
          </span>
        </div>

        {/* Timeline Started */}
        {project.started && (
          <div className="p-5">
            <p className="text-[10px] font-black tracking-[0.3em] uppercase text-gray-500 mb-2">Timeline Started</p>
            <div className="flex items-center gap-2 text-sm text-white font-semibold font-mono">
              <Calendar className="w-4 h-4 text-[#00a3ff]/70 shrink-0" />
              {formatDate(project.started)}
            </div>
          </div>
        )}
      </div>

      {/* 3. TECH STACK */}
      {project.tags && project.tags.length > 0 && (
        <div className="rounded-2xl border border-white/[0.06] bg-[#060609] p-5">
          <p className="text-[10px] font-black tracking-[0.3em] uppercase text-gray-500 mb-3">Tech Stack</p>
          <div className="flex flex-wrap gap-2">
            {project.tags.map(tag => (
              <span key={tag}
                className="px-3 py-1 rounded-lg bg-white/[0.03] border border-white/[0.07] text-xs font-bold uppercase tracking-wider text-gray-300 hover:border-[#00a3ff]/30 hover:text-[#00a3ff] transition-colors">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 4. OPEN COLLABORATION */}
      {openToList.length > 0 && (
        <div className="rounded-2xl border border-white/[0.06] bg-[#060609] p-5">
          <p className="text-[10px] font-black tracking-[0.3em] uppercase text-gray-500 mb-3">Open Collaboration</p>
          <div className="flex flex-col gap-2">
            {openToList.map(role => (
              <div key={role} className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.04] text-xs font-medium text-gray-300">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span>{role}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. RESOURCES */}
      {(project.githubUrl || project.demoUrl) && (
        <div className="rounded-2xl border border-white/[0.06] bg-[#060609] p-5 space-y-3">
          <p className="text-[10px] font-black tracking-[0.3em] uppercase text-gray-500 mb-3">Resources</p>
          <div className="space-y-2">
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                className="group flex items-center justify-between w-full px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-[#00a3ff]/30 hover:bg-[#00a3ff]/5 transition-all duration-200">
                <span className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-gray-400 group-hover:text-white">
                  <GithubIcon className="w-4 h-4 text-[#00a3ff]" />
                  Source Repository
                </span>
                <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-[#00a3ff] transition-colors" />
              </a>
            )}
            {project.demoUrl && (
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer"
                className="group flex items-center justify-between w-full px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all duration-200">
                <span className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-gray-400 group-hover:text-white">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  Live Demo
                </span>
                <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-emerald-400 transition-colors" />
              </a>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface ProjectDetailClientProps {
  id: string;
  initialProject?: Project | null;
  initialAuthors?: any[];
}

export default function ProjectDetailClient({ id, initialProject = null, initialAuthors = [] }: ProjectDetailClientProps) {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(initialProject);
  const [authorsList, setAuthorsList] = useState<any[]>(initialAuthors);
  const [loading, setLoading] = useState(!initialProject);

  useEffect(() => {
    if (initialProject && initialAuthors?.length > 0) { setLoading(false); return; }
    fetch("/api/authors").then(r => r.json()).then(d => { if (Array.isArray(d)) setAuthorsList(d); }).catch(() => {});
    fetch(`/api/projects/${id}`)
      .then(r => { if (!r.ok) throw new Error("Not found"); return r.json(); })
      .then(d => { setProject(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id, initialProject, initialAuthors]);

  const { authorObj, ageAndDOB } = useMemo(() => {
    if (!project?.author) return { authorObj: null, ageAndDOB: "" };
    const nameLower = project.author.toLowerCase().replace(/\s+/g, ' ').trim();
    let authorObj = authorsList.find(a => a.name.toLowerCase().replace(/\s+/g, ' ').trim() === nameLower);

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
    if (!authorObj) return { authorObj: null, ageAndDOB: "" };

    let ageAndDOB = "";
    if (authorObj.dateOfBirth) {
      const d = new Date(authorObj.dateOfBirth);
      if (!isNaN(d.getTime())) {
        const today = new Date();
        let age = today.getFullYear() - d.getFullYear();
        const m = today.getMonth() - d.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
        ageAndDOB = `${d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} (Age ${age})`;
      }
    }
    return { authorObj, ageAndDOB };
  }, [project, authorsList]);

  // Loading
  if (loading) {
    return (
      <main className="min-h-screen bg-[#020202] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-9 h-9 rounded-full border-2 border-white/10 border-t-[#00a3ff] animate-spin" />
          <p className="text-sm font-mono text-gray-600">Loading project data...</p>
        </div>
      </main>
    );
  }

  // Not found
  if (!project) {
    return (
      <main className="min-h-screen bg-[#020202] flex flex-col items-center justify-center p-6 text-center text-white">
        <div className="max-w-sm space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-center mx-auto">
            <Cpu className="w-7 h-7 text-red-500/60 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white uppercase tracking-tight mb-2">Project Not Found</h1>
            <p className="text-gray-500 text-sm leading-relaxed">
              No project matched <span className="font-mono text-[#00a3ff]">{id}</span>.
            </p>
          </div>
          <Link href="/projects" className="inline-flex items-center gap-2 px-5 py-3 bg-white text-black text-sm font-black uppercase tracking-wider rounded-xl hover:bg-gray-100 transition-all">
            <ArrowLeft className="w-4 h-4" /> Back to Projects
          </Link>
        </div>
      </main>
    );
  }

  const s = STATUS_STYLES[project.status as Status] || STATUS_STYLES.Active;
  const IconComponent = getCategoryIcon(project.category);
  const readmeContent = project.readme || `# ${project.title}\n\n${project.topic || ""}\n\n### Why This Project?\n${project.why || ""}`;
  const pageUrl = typeof window !== "undefined" ? window.location.href : `https://introlic.site/projects/${project.id}`;

  return (
    <main className="min-h-screen bg-[#020202] text-white font-sans relative">

      {/* ── Ambient glows ── */}
      <div className="absolute top-0 left-0 w-[700px] h-[700px] bg-[#00a3ff]/[0.04] blur-[220px] rounded-full pointer-events-none -translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#0055aa]/[0.05] blur-[180px] rounded-full pointer-events-none translate-x-1/4 translate-y-1/4" />

      {/* ═══════════════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════════════ */}
      <section className="relative border-b border-white/[0.05]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 pt-28 pb-14 md:pt-36 md:pb-20 relative z-10">

          {/* Top nav row */}
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="flex items-center justify-between mb-12">
            <Link href="/projects"
              className="group flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-white uppercase tracking-widest transition-colors">
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              All Projects
            </Link>
            <CopyButton text={pageUrl} />
          </motion.div>

          {/* Hero identity */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end">

            {/* Left: Title block */}
            <div className="lg:col-span-8 space-y-6">
              {/* Category breadcrumb */}
              <div className="flex items-center gap-3">
                <div className={`flex items-center justify-center rounded-xl border overflow-hidden shrink-0 ${project.logoUrl ? "w-12 h-12 p-0" : "w-12 h-12"}`}
                  style={{ background: "rgba(0,163,255,0.08)", borderColor: "rgba(0,163,255,0.18)" }}>
                  {project.logoUrl
                    ? <img src={project.logoUrl} alt={project.title} className="w-full h-full object-cover" />
                    : <IconComponent className="w-5 h-5 text-[#00a3ff]" />}
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-gray-600 uppercase tracking-widest">
                  <span>Projects</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span className="text-[#00a3ff]/70">{project.category}</span>
                </div>
              </div>

              {/* Main title */}
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] font-black text-white tracking-tighter leading-none uppercase">
                {project.title}
              </h1>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="text-base text-gray-400 font-medium">
                  by <span className="text-white font-bold">{project.author}</span>
                </span>
                {project.authorRole && (
                  <>
                    <span className="w-1.5 h-1.5 bg-gray-700 rounded-full" />
                    <span className="text-sm text-[#00a3ff] font-mono">{project.authorRole}</span>
                  </>
                )}
                {project.started && (
                  <>
                    <span className="w-1.5 h-1.5 bg-gray-700 rounded-full" />
                    <span className="text-sm text-gray-500 font-mono">Started {formatDate(project.started)}</span>
                  </>
                )}
              </div>

              {/* Topic tagline */}
              {project.topic && (
                <p className="text-base sm:text-lg text-gray-400 font-medium leading-relaxed max-w-2xl border-l-2 border-[#00a3ff]/20 pl-5">
                  {project.topic}
                </p>
              )}
            </div>

            {/* Right: Status */}
            <div className="lg:col-span-4 flex lg:justify-end">
              <div className="flex flex-col gap-4">
                <span className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl border text-sm font-black tracking-widest uppercase"
                  style={{ background: s.bg, color: s.text, borderColor: s.border }}>
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: s.dot }} />
                  {project.status}
                </span>
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 max-w-[260px]">
                    {project.tags.slice(0, 5).map(tag => (
                      <span key={tag} className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.07] text-xs font-bold uppercase tracking-wider text-gray-500">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
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

          {/* ── LEFT MAIN ─────────────────────────────────── */}
          <div className="lg:col-span-8 space-y-8">

            {/* Why section */}
            {project.why && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
                className="rounded-2xl border border-white/[0.07] bg-[#060609] overflow-hidden">
                <div className="px-7 pt-7 pb-3">
                  <p className="text-xs font-black tracking-[0.3em] uppercase text-[#00a3ff]/60 mb-4">Why This Initiative</p>
                  <p className="text-base text-gray-300 font-medium leading-relaxed">
                    {project.why}
                  </p>
                </div>
                <div className="px-7 py-5" />
              </motion.div>
            )}

            {/* KPIs — redesigned as a feature grid */}
            {project.factors && project.factors.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
                className="rounded-2xl border border-white/[0.07] bg-[#060609] p-7">
                <p className="text-xs font-black tracking-[0.3em] uppercase text-[#00a3ff]/60 mb-6">Key Features & Indicators</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  {project.factors.map((f, i) => (
                    <div key={i}
                      className="group flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-[#00a3ff]/20 hover:bg-[#00a3ff]/[0.03] transition-all duration-200">
                      <CheckCircle2 className="w-4 h-4 text-[#00a3ff]/60 shrink-0 mt-0.5 group-hover:text-[#00a3ff] transition-colors" />
                      <span className="text-sm font-medium text-gray-300 leading-snug">{f}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* README — GitHub style */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
              className="rounded-2xl border border-white/[0.07] bg-[#060609] overflow-hidden">
              {/* Terminal toolbar */}
              <div className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.06] bg-white/[0.02]">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/40 border border-red-500/20" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/40 border border-yellow-500/20" />
                  <div className="w-3 h-3 rounded-full bg-green-500/40 border border-green-500/20" />
                </div>
                <div className="flex items-center gap-2.5 ml-3">
                  <Terminal className="w-4 h-4 text-[#00a3ff]/70" />
                  <span className="text-xs font-mono text-gray-500 tracking-widest uppercase">README.md</span>
                </div>
                <div className="ml-auto flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00a3ff] animate-pulse" />
                  <span className="text-[10px] font-mono text-[#00a3ff]/50 uppercase tracking-widest">Active</span>
                </div>
              </div>

              {/* README content — increased padding and prose sizing */}
              <div className="p-7 sm:p-10 readme-content">
                {parseMarkdown(readmeContent)}
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT SIDEBAR ─────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-4 lg:sticky lg:top-28 max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar pr-1"
          >
            <Sidebar project={project} authorObj={authorObj} ageAndDOB={ageAndDOB} />
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
                    Collaboration
                  </p>
                </div>
                <h4 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
                  Want to join this initiative?
                </h4>
                <p className="text-xs sm:text-sm text-gray-400 font-medium leading-relaxed max-w-xl">
                  Review the team, explore other projects, or send a direct transmission to get involved.
                </p>
              </div>

              <div className="lg:col-span-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 lg:justify-end">
                <Link href="/projects"
                  className="flex items-center justify-center gap-2 px-5 py-3 sm:px-6 sm:py-3.5 rounded-xl border border-white/[0.10] bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/20 text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-200 text-gray-200 shrink-0">
                  Browse Projects
                </Link>
                <button
                  onClick={() => router.push(`/contact?subject=PROJECT_COLLAB&project=${project.id}`)}
                  className="group flex items-center justify-center gap-2 px-5 py-3 sm:px-6 sm:py-3.5 rounded-xl bg-[#00a3ff] hover:bg-[#0090e0] text-black font-black text-xs sm:text-sm tracking-wider uppercase transition-all duration-200 shadow-[0_0_30px_rgba(0,163,255,0.25)] hover:shadow-[0_0_50px_rgba(0,163,255,0.4)] shrink-0"
                >
                  Join Project
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </main>
  );
}
