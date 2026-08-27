"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Radio,
  FolderKanban,
  FileCode2,
  Users2,
  ExternalLink,
  Globe,
  Sparkles,
  ShieldCheck,
  Terminal,
  Activity,
  ArrowUpRight,
  BookOpen,
  Cpu,
  Layers,
  CheckCircle2,
  Calendar,
  MessageSquare,
  Clock,
  Tag,
  Zap,
  Code2,
  User,
  Mail,
  Lock,
  KeyRound,
  Shield,
  Save,
  Loader2,
  AlertCircle,
  Check
} from "lucide-react";
import { GithubIcon } from "@/components/SocialIcons";

interface ProjectItem {
  id: string;
  title: string;
  category: string;
  author: string;
  authorRole?: string | null;
  status: string;
  started?: string | null;
  openTo?: string | null;
  tags?: string[] | null;
  topic?: string | null;
  githubUrl?: string | null;
  demoUrl?: string | null;
  logoUrl?: string | null;
}

interface PaperItem {
  id: string;
  title: string;
  category: string;
  type: string;
  author: string;
  date: string;
  abstract: string;
}

interface MemberDashboardClientProps {
  initialProjects: ProjectItem[];
  initialPapers: PaperItem[];
}

export default function MemberDashboardClient({
  initialProjects = [],
  initialPapers = [],
}: MemberDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "announcements" | "projects" | "resources">("overview");

  // Member Profile & Credentials State
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");
  const [profile, setProfile] = useState({
    name: "",
    username: "",
    email: "",
    gender: "",
    dateOfBirth: "",
    socialHandle: "",
    role: "member",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const fetchProfile = async () => {
    setProfileLoading(true);
    try {
      const res = await fetch("/api/member/profile");
      if (res.ok) {
        const data = await res.json();
        setProfile((prev) => ({
          ...prev,
          name: data.name || "",
          username: data.username || "",
          email: data.email || "",
          gender: data.gender || "",
          dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split("T")[0] : "",
          socialHandle: data.socialHandle || "",
          role: data.role || "member",
        }));
      }
    } catch (e) {
      console.error("Failed to load member profile:", e);
    } finally {
      setProfileLoading(false);
    }
  };

  React.useEffect(() => {
    fetchProfile();
  }, []);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");

    if (profile.newPassword && profile.newPassword !== profile.confirmPassword) {
      setProfileError("New password and confirm password do not match");
      return;
    }

    if (profile.newPassword && !profile.currentPassword) {
      setProfileError("Current password is required to change password");
      return;
    }

    setProfileSaving(true);
    try {
      const res = await fetch("/api/member/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          email: profile.email,
          gender: profile.gender || null,
          dateOfBirth: profile.dateOfBirth || null,
          socialHandle: profile.socialHandle || null,
          currentPassword: profile.currentPassword || undefined,
          newPassword: profile.newPassword || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setProfileSuccess("Member profile updated successfully!");
        setProfile((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      } else {
        setProfileError(data.error || "Failed to update profile");
      }
    } catch (err) {
      setProfileError("Communication error with server");
    } finally {
      setProfileSaving(false);
    }
  };

  // Curated internal announcements & engineering dispatches
  const announcements = [
    {
      id: "ANN-001",
      title: "Sovereign Engineering Standard // V1.0 Protocol Activated",
      date: "August 2026",
      tag: "CORE PROTOCOL",
      urgent: true,
      content: "All Introlic digital products—ranging from web systems and high-throughput applications to games and experimental frameworks—must adhere to first-principles sovereign architecture. Zero dependency on bloated third-party frameworks without explicit audit.",
      author: "SHAH FAIZ (Chief Architect)"
    },
    {
      id: "ANN-002",
      title: "Members Portal & Collaborative Workspace Launch",
      date: "August 2026",
      tag: "PLATFORM MILESTONE",
      urgent: false,
      content: "The dedicated /introlic members space is now live. Core contributors and verified builders can view active engineering initiatives, review internal technical documentation, and collaborate directly on sovereign projects.",
      author: "Systems Operations"
    },
    {
      id: "ANN-003",
      title: "Master Roadmap: Scale First, Foundation AI Lab Long-Term",
      date: "August 2026",
      tag: "STRATEGIC VISION",
      urgent: false,
      content: "Our strategic trajectory is focused on rapid product execution: consumer apps, games, and web tools to generate global visibility and sustainable revenue before deploying sovereign custom foundational AI training clusters.",
      author: "SHAH FAIZ"
    }
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* ── 1. WELCOME HERO CARD ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-3xl border border-white/[0.08] bg-gradient-to-b from-[#080d18] via-[#04060a] to-[#020306] p-6 sm:p-10 md:p-12 overflow-hidden shadow-2xl"
      >
        {/* Glowing backdrop elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00a3ff]/10 blur-[120px] rounded-full pointer-events-none -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#0055ff]/10 blur-[100px] rounded-full pointer-events-none translate-y-1/3 -translate-x-1/3" />
        
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              SOVEREIGN NODE // VERIFIED ACCESS
            </div>
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider hidden sm:inline">
              SYS_ID: #INTROLIC_CORE
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Welcome to the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-[#00a3ff]">
              Members Mission Control.
            </span>
          </h1>

          <p className="text-gray-400 text-sm sm:text-base font-normal leading-relaxed max-w-2xl">
            This is the sovereign internal portal for Introlic contributors and builders. Track live engineering initiatives, inspect system dispatches, access lab resources, and coordinate sovereign digital systems.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="#announcements"
              className="px-5 py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-gray-200 transition-all flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <Radio className="w-3.5 h-3.5 text-black" />
              Latest Announcements
            </a>
            <a
              href="#projects"
              className="px-5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.12] text-white font-bold text-xs hover:border-[#00a3ff]/50 hover:bg-[#00a3ff]/10 transition-all flex items-center gap-2 cursor-pointer"
            >
              <FolderKanban className="w-3.5 h-3.5 text-[#00a3ff]" />
              Active Projects ({initialProjects.length})
            </a>
            <Link
              href="/docs"
              className="px-5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.12] text-gray-300 font-bold text-xs hover:text-white hover:border-white/30 transition-all flex items-center gap-2"
            >
              <FileCode2 className="w-3.5 h-3.5 text-gray-400" />
              Documentation
            </Link>
          </div>
        </div>
      </motion.div>

      {/* ── 2. METRICS & TELEMETRY STRIP ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-6 rounded-2xl border border-white/[0.06] bg-[#05070c] space-y-2 relative overflow-hidden group hover:border-[#00a3ff]/30 transition-all">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase">Active Initiatives</span>
            <FolderKanban className="w-4 h-4 text-[#00a3ff]" />
          </div>
          <div className="text-3xl font-black text-white tracking-tight">{initialProjects.length}</div>
          <div className="text-[10px] font-mono text-gray-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Live & In Development</span>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-white/[0.06] bg-[#05070c] space-y-2 relative overflow-hidden group hover:border-[#00a3ff]/30 transition-all">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase">Research Dispatches</span>
            <BookOpen className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-black text-white tracking-tight">{initialPapers.length}</div>
          <div className="text-[10px] font-mono text-gray-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            <span>Published Technical Archives</span>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-white/[0.06] bg-[#05070c] space-y-2 relative overflow-hidden group hover:border-[#00a3ff]/30 transition-all">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase">System Integrity</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white tracking-tight">100%</div>
          <div className="text-[10px] font-mono text-gray-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>All Nodes Operational</span>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-white/[0.06] bg-[#05070c] space-y-2 relative overflow-hidden group hover:border-[#00a3ff]/30 transition-all">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase">Membership Tier</span>
            <ShieldCheck className="w-4 h-4 text-[#00a3ff]" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white tracking-tight">Core Member</div>
          <div className="text-[10px] font-mono text-[#00a3ff] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00a3ff]" />
            <span>Authorized Contributor</span>
          </div>
        </div>
      </div>

      {/* ── 3. ANNOUNCEMENTS & TRANSMISSIONS SECTION ── */}
      <section id="announcements" className="space-y-6 pt-4 scroll-mt-24">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#00a3ff]/10 border border-[#00a3ff]/20">
              <Radio className="w-5 h-5 text-[#00a3ff]" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Announcements & Transmissions</h2>
              <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">Internal organization dispatches</p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#00a3ff] bg-[#00a3ff]/10 px-3 py-1 rounded-full border border-[#00a3ff]/20">
            3 Active Dispatches
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {announcements.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className={`p-6 rounded-2xl border flex flex-col justify-between relative group ${
                item.urgent
                  ? "bg-gradient-to-b from-[#0a1220] to-[#04070d] border-[#00a3ff]/30 shadow-[0_10px_30px_rgba(0,163,255,0.1)]"
                  : "bg-[#05070c] border-white/[0.06] hover:border-white/20"
              } transition-all duration-300`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono font-bold tracking-widest uppercase px-2.5 py-0.5 rounded bg-white/[0.05] border border-white/10 text-gray-300">
                    {item.tag}
                  </span>
                  <span className="text-[9px] font-mono text-gray-500">{item.date}</span>
                </div>

                <h3 className="text-base font-bold text-white tracking-tight leading-snug group-hover:text-[#00a3ff] transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-gray-400 font-normal leading-relaxed">
                  {item.content}
                </p>
              </div>

              <div className="pt-5 mt-5 border-t border-white/[0.05] flex items-center justify-between text-[10px] font-mono text-gray-500">
                <span>By {item.author}</span>
                <span className="text-[#00a3ff] font-bold">#{item.id}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 4. PROJECTS ENGINE ── */}
      <section id="projects" className="space-y-6 pt-4 scroll-mt-24">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <FolderKanban className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Active Projects Engine</h2>
              <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">Engineering initiatives & products</p>
            </div>
          </div>
          <Link
            href="/projects"
            className="text-xs font-mono font-bold text-[#00a3ff] hover:underline flex items-center gap-1.5"
          >
            <span>Public Gallery</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {initialProjects.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-white/10 bg-[#05070c]">
            <p className="text-xs font-mono text-gray-500 uppercase">No active projects found in database.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {initialProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="p-6 rounded-2xl border border-white/[0.06] bg-[#05070c] hover:border-[#00a3ff]/30 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Top status */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[9px] font-mono tracking-widest uppercase text-gray-500">
                      {project.category} // {project.id}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f0f3f6] text-[#0a0d12] text-[9px] font-black tracking-widest uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
                      {project.status || "Active"}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-white tracking-tight group-hover:text-[#00a3ff] transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs text-gray-400 font-medium mt-2 line-clamp-2 leading-relaxed">
                      {project.topic || "Sovereign digital engineering initiative."}
                    </p>
                  </div>

                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {project.tags.slice(0, 4).map((tag) => (
                        <span key={tag} className="text-[9px] font-mono text-gray-400 bg-white/[0.03] border border-white/[0.06] px-2 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="pt-6 mt-6 border-t border-white/[0.05] flex items-center justify-between">
                  <Link
                    href={`/projects/${project.id}`}
                    className="text-xs font-bold text-gray-300 hover:text-white flex items-center gap-1.5 group/link"
                  >
                    <span>Inspect Details</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#00a3ff] group-hover/link:translate-x-0.5 transition-transform" />
                  </Link>

                  <div className="flex items-center gap-2">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-white/[0.02] border border-white/10 hover:border-white/30 text-gray-400 hover:text-white transition-all"
                        title="Repository"
                      >
                        <GithubIcon className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-[#00a3ff]/10 border border-[#00a3ff]/20 hover:border-[#00a3ff]/40 text-[#00a3ff] hover:text-white transition-all"
                        title="Live Demo"
                      >
                        <Globe className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* ── 5. SOVEREIGN LAB & DEVELOPER RESOURCES ── */}
      <section id="resources" className="space-y-6 pt-4 scroll-mt-24">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <FileCode2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Sovereign Developer Tooling & Docs</h2>
              <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">Internal standards & public documentation</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Link
            href="/docs"
            className="p-6 rounded-2xl border border-white/[0.06] bg-[#05070c] hover:border-[#00a3ff]/40 hover:bg-[#060912] transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#00a3ff]/10 border border-[#00a3ff]/20 flex items-center justify-center text-[#00a3ff] mb-4 group-hover:scale-110 transition-transform">
              <Terminal className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight group-hover:text-[#00a3ff] transition-colors">
              System Documentation
            </h3>
            <p className="text-xs text-gray-400 mt-1.5 font-normal leading-relaxed">
              API specifications, terminal setup, and sovereign development principles.
            </p>
          </Link>

          <Link
            href="/research"
            className="p-6 rounded-2xl border border-white/[0.06] bg-[#05070c] hover:border-purple-500/40 hover:bg-[#080612] transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight group-hover:text-purple-300 transition-colors">
              Research Archives
            </h3>
            <p className="text-xs text-gray-400 mt-1.5 font-normal leading-relaxed">
              Whitepapers, algorithmic proofs, and experimental system architectures.
            </p>
          </Link>

          <a
            href="https://github.com/mruniqers"
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 rounded-2xl border border-white/[0.06] bg-[#05070c] hover:border-white/30 hover:bg-[#0a0a0f] transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
              <GithubIcon className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight group-hover:text-white transition-colors">
              GitHub Repositories
            </h3>
            <p className="text-xs text-gray-400 mt-1.5 font-normal leading-relaxed">
              Direct source code repositories, issue trackers, and pull requests.
            </p>
          </a>

          <Link
            href="/contact?subject=MEMBER_DISPATCH"
            className="p-6 rounded-2xl border border-white/[0.06] bg-[#05070c] hover:border-emerald-500/40 hover:bg-[#050d0a] transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight group-hover:text-emerald-300 transition-colors">
              Sovereign Uplink
            </h3>
            <p className="text-xs text-gray-400 mt-1.5 font-normal leading-relaxed">
              Direct encrypted transmission channel for member feedback & proposals.
            </p>
          </Link>
        </div>
      </section>

      {/* ── 6. TEAM & LEADERSHIP ROSTER ── */}
      <section id="team" className="space-y-6 pt-4 scroll-mt-24">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/[0.04] border border-white/10">
              <Users2 className="w-5 h-5 text-gray-300" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Core Architects & Builders</h2>
              <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">Sovereign leadership directory</p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl border border-white/[0.08] bg-gradient-to-r from-[#060a14] via-[#04060a] to-[#060a14] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00a3ff]/30 to-[#0055ff]/20 border border-[#00a3ff]/40 flex items-center justify-center text-white font-black text-xl shadow-[0_0_30px_rgba(0,163,255,0.25)] shrink-0">
              SF
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-lg font-black text-white tracking-tight">SHAH FAIZ</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#00a3ff]/10 text-[#00a3ff] border border-[#00a3ff]/20 text-[10px] font-mono font-bold">
                  Chief Architect
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1 max-w-lg leading-relaxed">
                Founder & systems builder. Engineering sovereign digital systems from first principles, built without institutional backing or venture safety nets.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end md:self-center">
            <a
              href="https://x.com/MrUniqers"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#00a3ff]/40 hover:text-[#00a3ff] text-xs font-mono font-bold text-gray-300 transition-all flex items-center gap-1.5"
            >
              <span>X / Twitter</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://github.com/mruniqers"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/30 text-xs font-mono font-bold text-gray-300 hover:text-white transition-all flex items-center gap-1.5"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </section>

      {/* ── 7. MY PROFILE & CREDENTIALS SETTINGS ── */}
      <section id="profile" className="space-y-6 pt-4 scroll-mt-24">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#00a3ff]/10 border border-[#00a3ff]/20">
              <User className="w-5 h-5 text-[#00a3ff]" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">My Member Profile & Credentials</h2>
              <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">Update your contact info, socials, and sovereign security</p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Node: @{profile.username || "member"}
          </span>
        </div>

        <form onSubmit={handleProfileSubmit} className="p-6 sm:p-10 rounded-3xl border border-white/[0.08] bg-[#05070c] space-y-8 shadow-2xl">
          {/* Status Feedback Banners */}
          {profileSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-medium text-emerald-300 flex items-center gap-3">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{profileSuccess}</span>
            </div>
          )}

          {profileError && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs font-medium text-red-300 flex items-center gap-3">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{profileError}</span>
            </div>
          )}

          {/* Core Profile Fields */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-[#00a3ff]" />
              Basic Identity & Contact
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="Your full name"
                  className="w-full bg-[#0a0a0e] border border-white/[0.08] focus:border-[#00a3ff]/40 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 outline-none font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400">
                  Username <span className="text-gray-600">(Immutable ID)</span>
                </label>
                <input
                  type="text"
                  disabled
                  value={profile.username}
                  className="w-full bg-[#07070a] border border-white/[0.05] rounded-xl px-4 py-2.5 text-xs text-gray-400 outline-none font-mono cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400">
                  Email Address
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  placeholder="your.email@example.com"
                  className="w-full bg-[#0a0a0e] border border-white/[0.08] focus:border-[#00a3ff]/40 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 outline-none font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400">
                  Social / GitHub Profile Link
                </label>
                <input
                  type="url"
                  value={profile.socialHandle}
                  onChange={(e) => setProfile({ ...profile, socialHandle: e.target.value })}
                  placeholder="https://github.com/yourhandle"
                  className="w-full bg-[#0a0a0e] border border-white/[0.08] focus:border-[#00a3ff]/40 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 outline-none font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400">
                  Gender
                </label>
                <select
                  value={profile.gender}
                  onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                  className="w-full bg-[#0a0a0e] border border-white/[0.08] focus:border-[#00a3ff]/40 rounded-xl px-4 py-2.5 text-xs text-white outline-none font-sans"
                >
                  <option value="">Not Specified</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not">Prefer Not to Say</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={profile.dateOfBirth}
                  onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                  className="w-full bg-[#0a0a0e] border border-white/[0.08] focus:border-[#00a3ff]/40 rounded-xl px-4 py-2.5 text-xs text-white outline-none font-sans"
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-white/[0.06]" />

          {/* Password Security Update */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <KeyRound className="w-3.5 h-3.5 text-[#00a3ff]" />
              Security & Password (Optional)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400">
                  Current Password
                </label>
                <input
                  type="password"
                  value={profile.currentPassword}
                  onChange={(e) => setProfile({ ...profile, currentPassword: e.target.value })}
                  placeholder="Verify existing password..."
                  className="w-full bg-[#0a0a0e] border border-white/[0.08] focus:border-[#00a3ff]/40 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 outline-none font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400">
                  New Password
                </label>
                <input
                  type="password"
                  value={profile.newPassword}
                  onChange={(e) => setProfile({ ...profile, newPassword: e.target.value })}
                  placeholder="Min 8 chars, mixed case & symbol..."
                  className="w-full bg-[#0a0a0e] border border-white/[0.08] focus:border-[#00a3ff]/40 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 outline-none font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={profile.confirmPassword}
                  onChange={(e) => setProfile({ ...profile, confirmPassword: e.target.value })}
                  placeholder="Repeat new password..."
                  className="w-full bg-[#0a0a0e] border border-white/[0.08] focus:border-[#00a3ff]/40 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
            <p className="text-[11px] font-mono text-gray-500">
              Changes are immediately applied to your sovereign member node.
            </p>

            <button
              type="submit"
              disabled={profileSaving}
              className="px-6 py-3 rounded-xl bg-white text-black font-bold text-xs hover:bg-gray-200 transition-all flex items-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
            >
              {profileSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving Updates...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Profile</span>
                </>
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
