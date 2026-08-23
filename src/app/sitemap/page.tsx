import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { 
  Globe, Home, Users, Cpu, BookOpen, Mail, Shield, 
  FileText, Cookie, Flag, ExternalLink, Terminal, 
  CheckCircle2, ChevronRight, FileCode, Layers, Map, Database
} from "lucide-react";
import { db } from "@/db";
import { projects, researchPapers, blogPosts } from "@/db/schema";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "Introlic | Site Navigation & System Index" },
  description: "Comprehensive site index and sitemap for Introlic. Explore all computational projects, research dispatches, engineering blogs, and system protocols.",
  alternates: {
    canonical: "/sitemap",
  },
  openGraph: {
    title: "Introlic | Site Navigation & System Index",
    description: "Explore all pages, projects, research dispatches, and protocol endpoints at Introlic.",
    url: "https://introlic.in/sitemap",
    type: "website",
  },
};

export default async function SitemapPage() {
  // Fetch dynamic items from database
  let dbProjects: any[] = [];
  let dbPapers: any[] = [];
  let dbPosts: any[] = [];

  try {
    dbProjects = await db.select().from(projects).orderBy(desc(projects.started));
  } catch (e) {
    console.error("Error fetching projects for sitemap:", e);
  }

  try {
    dbPapers = await db.select().from(researchPapers).orderBy(desc(researchPapers.createdAt));
  } catch (e) {
    console.error("Error fetching research papers for sitemap:", e);
  }

  try {
    dbPosts = await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  } catch (e) {
    console.error("Error fetching blog posts for sitemap:", e);
  }

  const primaryNav = [
    { title: "Home", href: "/", desc: "Main portal & foundational overview", icon: Home },
    { title: "About Us", href: "/about", desc: "Mission, vision, and system architecture", icon: Users },
    { title: "Projects Index", href: "/projects", desc: "All computational and engineering initiatives", icon: Cpu },
    { title: "Research Dispatches", href: "/research", desc: "Technical research papers and dispatches", icon: Globe },
    { title: "Engineering Blog", href: "/blog", desc: "Articles and technical updates", icon: BookOpen },
    { title: "Contact & Collab", href: "/contact", desc: "Direct transmissions and collaboration inquiries", icon: Mail },
    { title: "Documentation", href: "/docs", desc: "System architecture & API reference", icon: FileCode },
  ];

  const ecosystemNav = [
    { title: "Capabilities", href: "/#capabilities", desc: "Core computational capabilities & speed metrics", icon: Cpu },
    { title: "Roadmap", href: "/#roadmap", desc: "Strategic development timeline & phases", icon: Map },
    { title: "Introlic Engine", href: "/#anatomy", desc: "Bare-metal kernel fusion & inference pipeline", icon: Database },
    { title: "About the Lab", href: "/about", desc: "Origins, mission, and system architecture", icon: Users },
  ];

  const legalNav = [
    { title: "Terms of Service", href: "/terms", desc: "Usage terms and service agreements", icon: FileText },
    { title: "Privacy Policy", href: "/privacy", desc: "Data protection and privacy guidelines", icon: Shield },
    { title: "Cookie Policy", href: "/cookies", desc: "Cookie compliance and preferences", icon: Cookie },
    { title: "Ethics Manifest", href: "/ethics", desc: "Responsible AI engineering principles", icon: Flag },
  ];

  return (
    <main className="min-h-screen bg-[#020202] text-white font-sans relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#00a3ff]/[0.04] blur-[200px] rounded-full pointer-events-none -translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#0055aa]/[0.04] blur-[180px] rounded-full pointer-events-none translate-x-1/4 translate-y-1/4" />

      {/* Hero Header */}
      <section className="relative pt-32 pb-16 border-b border-white/[0.05]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
          <div className="flex items-center gap-2 mb-6 text-xs font-mono text-[#00a3ff] uppercase tracking-widest">
            <Terminal className="w-4 h-4 text-[#00a3ff]" />
            <span>SYSTEM_INDEX // SITEMAP_PROTOCOL</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter uppercase mb-4">
            System Index & Sitemap
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl font-medium leading-relaxed">
            Full directory of all public endpoints, active projects, technical research dispatches, and protocol indexes across the Introlic platform.
          </p>

          {/* Machine Indexes Pill Box (Google Console Ready) */}
          <div className="mt-8 flex flex-wrap items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">Search Console Feeds:</span>
            <a 
              href="/sitemap.xml" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#00a3ff]/10 border border-[#00a3ff]/30 text-xs font-mono text-[#00a3ff] hover:bg-[#00a3ff]/20 transition-all"
            >
              sitemap.xml <ExternalLink className="w-3 h-3" />
            </a>
            <a 
              href="/robots.txt" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-gray-300 hover:text-white transition-all"
            >
              robots.txt <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </section>

      {/* Sitemap Sections Grid */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-12 py-16 space-y-16 relative z-10">

        {/* SECTION 1: Core Navigation */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/[0.05] pb-3">
            <h2 className="text-xl font-black uppercase text-white tracking-wider flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#00a3ff]" />
              Core Navigation Pages
            </h2>
            <span className="text-xs font-mono text-gray-500">{primaryNav.length} Routes</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {primaryNav.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group p-5 rounded-2xl bg-[#060609] border border-white/[0.06] hover:border-[#00a3ff]/30 hover:bg-[#00a3ff]/[0.03] transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center group-hover:border-[#00a3ff]/40 transition-colors">
                      <Icon className="w-5 h-5 text-[#00a3ff]" />
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-[#00a3ff] group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-[#00a3ff] transition-colors">{item.title}</h3>
                  <p className="text-xs text-gray-400 font-medium mt-1 leading-snug">{item.desc}</p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* SECTION 2: Platform Ecosystem */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/[0.05] pb-3">
            <h2 className="text-xl font-black uppercase text-white tracking-wider flex items-center gap-2">
              <Database className="w-5 h-5 text-[#00a3ff]" />
              Ecosystem & Feature Sections
            </h2>
            <span className="text-xs font-mono text-gray-500">{ecosystemNav.length} Sections</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ecosystemNav.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group p-5 rounded-2xl bg-[#060609] border border-white/[0.06] hover:border-[#00a3ff]/30 hover:bg-[#00a3ff]/[0.03] transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center group-hover:border-[#00a3ff]/40 transition-colors">
                      <Icon className="w-4 h-4 text-[#00a3ff]" />
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-[#00a3ff] transition-all" />
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-[#00a3ff] transition-colors">{item.title}</h3>
                  <p className="text-xs text-gray-400 font-medium mt-1 leading-snug">{item.desc}</p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* SECTION 3: Projects Directory */}
        {dbProjects.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/[0.05] pb-3">
              <h2 className="text-xl font-black uppercase text-white tracking-wider flex items-center gap-2">
                <Cpu className="w-5 h-5 text-[#00a3ff]" />
                Projects Directory
              </h2>
              <span className="text-xs font-mono text-gray-500">{dbProjects.length} Initiatives</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {dbProjects.map((proj) => (
                <Link
                  key={proj.id}
                  href={`/projects/${proj.id}`}
                  className="group p-5 rounded-2xl bg-[#060609] border border-white/[0.06] hover:border-[#00a3ff]/30 hover:bg-[#00a3ff]/[0.03] transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold text-[#00a3ff] uppercase tracking-wider bg-[#00a3ff]/10 px-2 py-0.5 rounded border border-[#00a3ff]/20">
                      {proj.category || "Project"}
                    </span>
                    <span className="text-[10px] font-mono text-gray-500">{proj.status}</span>
                  </div>
                  <h3 className="text-base font-black text-white group-hover:text-[#00a3ff] transition-colors mt-2">{proj.title}</h3>
                  <p className="text-xs text-gray-400 font-medium mt-1 line-clamp-2 leading-relaxed">
                    {proj.topic || proj.why || "Computational initiative at Introlic."}
                  </p>
                  <div className="mt-3 pt-3 border-t border-white/[0.04] flex items-center justify-between text-xs text-gray-500 font-mono">
                    <span>by {proj.author}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-[#00a3ff] transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 4: Research Dispatches */}
        {dbPapers.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/[0.05] pb-3">
              <h2 className="text-xl font-black uppercase text-white tracking-wider flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#00a3ff]" />
                Research Dispatches & Papers
              </h2>
              <span className="text-xs font-mono text-gray-500">{dbPapers.length} Papers</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {dbPapers.map((paper) => (
                <Link
                  key={paper.id}
                  href={`/research/${paper.id}`}
                  className="group p-5 rounded-2xl bg-[#060609] border border-white/[0.06] hover:border-[#00a3ff]/30 hover:bg-[#00a3ff]/[0.03] transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-wider bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                      Research Paper
                    </span>
                    <span className="text-[10px] font-mono text-gray-500">{paper.category || "Dispatch"}</span>
                  </div>
                  <h3 className="text-base font-black text-white group-hover:text-[#00a3ff] transition-colors mt-2">{paper.title}</h3>
                  <p className="text-xs text-gray-400 font-medium mt-1 line-clamp-2 leading-relaxed">
                    {paper.abstract || "Technical research publication by Introlic."}
                  </p>
                  <div className="mt-3 pt-3 border-t border-white/[0.04] flex items-center justify-between text-xs text-gray-500 font-mono">
                    <span>by {paper.author}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-[#00a3ff] transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 5: Engineering Blog */}
        {dbPosts.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/[0.05] pb-3">
              <h2 className="text-xl font-black uppercase text-white tracking-wider flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#00a3ff]" />
                Engineering Blog & Posts
              </h2>
              <span className="text-xs font-mono text-gray-500">{dbPosts.length} Articles</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {dbPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group p-5 rounded-2xl bg-[#060609] border border-white/[0.06] hover:border-[#00a3ff]/30 hover:bg-[#00a3ff]/[0.03] transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Blog
                    </span>
                  </div>
                  <h3 className="text-base font-black text-white group-hover:text-[#00a3ff] transition-colors mt-2">{post.title}</h3>
                  <p className="text-xs text-gray-400 font-medium mt-1 line-clamp-2 leading-relaxed">
                    {post.summary || post.excerpt || "Engineering blog post at Introlic."}
                  </p>
                  <div className="mt-3 pt-3 border-t border-white/[0.04] flex items-center justify-between text-xs text-gray-500 font-mono">
                    <span>by {post.author}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-[#00a3ff] transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 6: Legal & Compliance */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/[0.05] pb-3">
            <h2 className="text-xl font-black uppercase text-white tracking-wider flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#00a3ff]" />
              Compliance & Legal Protocols
            </h2>
            <span className="text-xs font-mono text-gray-500">{legalNav.length} Documents</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {legalNav.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group p-5 rounded-2xl bg-[#060609] border border-white/[0.06] hover:border-[#00a3ff]/30 hover:bg-[#00a3ff]/[0.03] transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center group-hover:border-[#00a3ff]/40 transition-colors">
                      <Icon className="w-4 h-4 text-[#00a3ff]" />
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-[#00a3ff] transition-all" />
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-[#00a3ff] transition-colors">{item.title}</h3>
                  <p className="text-xs text-gray-400 font-medium mt-1 leading-snug">{item.desc}</p>
                </Link>
              );
            })}
          </div>
        </div>

      </section>
    </main>
  );
}
