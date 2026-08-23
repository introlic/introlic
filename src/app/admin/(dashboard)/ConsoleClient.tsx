"use client";

import React, { useState } from "react";
import { 
  Users, Mail, Shield, 
  MessageSquare, ChevronRight,
  Eye, Globe,
  TrendingUp, Calendar, ShieldAlert
} from "lucide-react";
import { allPosts } from "@/components/blog/BlogData";
import Link from "next/link";
import { Sparkles, Cpu, BookOpen, FileText } from "lucide-react";

interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: Date;
}

interface User {
  id: string;
  name: string | null;
  username: string;
  email: string;
  role: string;
  createdAt: Date;
}

interface ConsoleClientProps {
  totalUsers: number;
  totalContacts: number;
  totalAdmins: number;
  totalVisits: number;
  totalUniqueVisitors: number;
  recentContacts: Contact[];
  recentUsers: User[];
  registrationGrowth: { date: string; count: number }[];
  visitGrowth: { date: string; count: number }[];
  genderStats: { gender: string | null; count: number }[];
  ageGroupStats: { group: string; count: number }[];
  topPaths: { path: string; uniqueViews: number; totalHits: number }[];
  countryStats: { country: string; count: number }[];
  sharedIps: { ipAddress: string; count: number; usernames: string }[];
  sharedFingerprints: { deviceFingerprint: string; count: number; usernames: string }[];
}

function decodeHtml(text: string) {
  if (!text) return "";
  return text
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'");
}

function formatPathName(path: string) {
  if (!path || path === "/") return "Homepage";
  if (path === "/blog") return "Blog";
  if (path === "/research") return "Research";
  if (path === "/projects") return "Projects";
  if (path === "/contact") return "Contact";
  if (path === "/about") return "About";
  if (path === "/docs") return "Documentation";
  if (path === "/ppt") return "Presentation";
  if (path === "/terms") return "Terms";
  if (path === "/privacy") return "Privacy";
  if (path === "/cookies") return "Cookies";
  if (path === "/ethics") return "Ethics";

  if (path.startsWith("/blog/")) {
    const slug = path.substring(6);
    const post = allPosts.find(p => p.slug === slug);
    if (post) return post.title;
    return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }

  if (path.startsWith("/research/")) {
    const slug = path.substring(10);
    return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }

  if (path.startsWith("/projects/")) {
    const slug = path.substring(10);
    return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }

  const clean = path.replace(/^\/+/, "").replace(/[&?].*$/, "");
  const segments = clean.split('/').filter(Boolean);
  if (segments.length === 0) return "Homepage";
  return segments.map(s => {
    const words = s.split('-');
    return words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }).join(' / ');
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

function AnalyticsChart({ 
  data, 
  label, 
  color = "#00a3ff" 
}: { 
  data: { date: string; count: number }[]; 
  label: string; 
  color?: string;
}) {
  const [hoveredPoint, setHoveredPoint] = useState<{ index: number; x: number; y: number; date: string; count: number } | null>(null);

  const width = 600;
  const height = 220;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 35;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const maxVal = Math.max(...data.map(d => d.count), 1);
  const minVal = 0;

  const points = data.map((d, i) => {
    const x = paddingLeft + (i * chartWidth) / (Math.max(data.length - 1, 1));
    const y = paddingTop + chartHeight * (1 - d.count / maxVal);
    return { x, y, date: d.date, count: d.count };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, "");

  const areaD = points.length > 0 
    ? `${pathD} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z`
    : "";

  const formatDateLabel = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
    } catch (e) {
      return dateStr;
    }
  };

  const xTicksIndices = data.length > 0 ? [0, Math.floor(data.length / 3), Math.floor(2 * data.length / 3), data.length - 1] : [];
  const gridLines = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div className="relative w-full">
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{label} (Last 30 Days)</span>
        <span className="text-[10px] font-mono text-gray-400">Peak: {maxVal}</span>
      </div>

      <div className="relative bg-[#050505] rounded-2xl border border-white/5 p-4 overflow-visible">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={color} stopOpacity="0.00" />
            </linearGradient>
          </defs>

          {gridLines.map((gl, idx) => {
            const y = paddingTop + chartHeight * (1 - gl);
            const val = Math.round(minVal + (maxVal - minVal) * gl);
            return (
              <g key={idx} className="opacity-40">
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="rgba(255,255,255,0.03)"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3}
                  textAnchor="end"
                  fill="rgba(255,255,255,0.3)"
                  className="text-[9px] font-mono"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {areaD && (
            <path
              d={areaD}
              fill="url(#chartGradient)"
              className="transition-all duration-300"
            />
          )}

          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-300"
            />
          )}

          {points.map((p, i) => (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r="10"
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={(e) => {
                  const svgEl = e.currentTarget.ownerSVGElement;
                  if (!svgEl) return;
                  const rect = svgEl.getBoundingClientRect();
                  const scaleX = rect.width / width;
                  const scaleY = rect.height / height;
                  setHoveredPoint({
                    index: i,
                    x: p.x * scaleX,
                    y: p.y * scaleY,
                    date: p.date,
                    count: p.count
                  });
                }}
                onMouseLeave={() => setHoveredPoint(null)}
              />
              <circle
                cx={p.x}
                cy={p.y}
                r={hoveredPoint?.index === i ? "4.5" : "2"}
                fill={hoveredPoint?.index === i ? "#fff" : color}
                stroke={hoveredPoint?.index === i ? color : "none"}
                strokeWidth="1.5"
                className="transition-all duration-150 pointer-events-none"
              />
            </g>
          ))}

          {xTicksIndices.map((idx) => {
            const p = points[idx];
            if (!p) return null;
            return (
              <g key={idx}>
                <line
                  x1={p.x}
                  y1={height - paddingBottom}
                  x2={p.x}
                  y2={height - paddingBottom + 4}
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="1"
                />
                <text
                  x={p.x}
                  y={height - paddingBottom + 16}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.4)"
                  className="text-[9px] font-mono font-medium"
                >
                  {formatDateLabel(p.date)}
                </text>
              </g>
            );
          })}
        </svg>

        {hoveredPoint && (
          <div 
            className="absolute z-30 pointer-events-none bg-[#0a0a0c] border border-white/10 rounded-lg p-2 shadow-2xl text-left transition-all duration-75 text-xs font-semibold"
            style={{
              left: `${hoveredPoint.x}px`,
              top: `${hoveredPoint.y - 60}px`,
              transform: "translateX(-50%)"
            }}
          >
            <p className="text-[9px] text-gray-500 font-mono leading-none mb-1">{formatDateLabel(hoveredPoint.date)}</p>
            <p className="text-[11px] font-bold text-white leading-none">
              {hoveredPoint.count} {hoveredPoint.count === 1 ? "entry" : "entries"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ConsoleClient({
  totalUsers,
  totalContacts,
  totalAdmins,
  totalVisits,
  totalUniqueVisitors,
  recentContacts,
  recentUsers,
  registrationGrowth,
  visitGrowth,
  genderStats,
  ageGroupStats,
  topPaths,
  countryStats,
  sharedIps,
  sharedFingerprints
}: ConsoleClientProps) {
  const [chartMode, setChartMode] = useState<"visits" | "registrations">("visits");

  return (
    <div className="space-y-8 animate-fadeIn">
      <header className="pb-6 border-b border-white/5 mb-8">
        <div className="flex items-center gap-2 mb-1.5 text-xs text-gray-500">
          <span>Admin</span>
          <ChevronRight className="w-3 h-3 text-gray-600" />
          <span className="text-gray-300 font-medium">Overview</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Overview</h1>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-[#050505] rounded-2xl border border-white/5 p-5 relative group overflow-hidden">
          <div className="flex justify-between items-start mb-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/5 border border-white/10">
              <Users className="w-4 h-4 text-white/75" />
            </div>
          </div>
          <h3 className="text-3xl font-bold tracking-tight text-white mb-0.5">{totalUsers}</h3>
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Total Users</p>
        </div>

        <div className="bg-[#050505] rounded-2xl border border-white/5 p-5 relative group overflow-hidden">
          <div className="flex justify-between items-start mb-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/5 border border-white/10">
              <Eye className="w-4 h-4 text-white/75" />
            </div>
          </div>
          <h3 className="text-3xl font-bold tracking-tight text-white mb-0.5">{totalVisits}</h3>
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Page Views</p>
        </div>

        <div className="bg-[#050505] rounded-2xl border border-white/5 p-5 relative group overflow-hidden">
          <div className="flex justify-between items-start mb-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/5 border border-white/10">
              <Globe className="w-4 h-4 text-white/75" />
            </div>
          </div>
          <h3 className="text-3xl font-bold tracking-tight text-white mb-0.5">{totalUniqueVisitors}</h3>
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Unique Visitors</p>
        </div>

        <div className="bg-[#050505] rounded-2xl border border-white/5 p-5 relative group overflow-hidden">
          <div className="flex justify-between items-start mb-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/5 border border-white/10">
              <Mail className="w-4 h-4 text-white/75" />
            </div>
          </div>
          <h3 className="text-3xl font-bold tracking-tight text-white mb-0.5">{totalContacts}</h3>
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Contact Messages</p>
        </div>

        <div className="bg-[#050505] rounded-2xl border border-white/5 p-5 relative group overflow-hidden col-span-2 lg:col-span-1">
          <div className="flex justify-between items-start mb-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/5 border border-white/10">
              <Shield className="w-4 h-4 text-white/75" />
            </div>
          </div>
          <h3 className="text-3xl font-bold tracking-tight text-white mb-0.5">{totalAdmins}</h3>
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Admin Staff</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Quick Actions
          </h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Messages */}
          <Link 
            href="/admin/messages"
            className="bg-[#050505] rounded-2xl border border-white/5 p-5 hover:border-white/15 transition-all group flex flex-col justify-between shadow-sm"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/80 mb-3.5 group-hover:bg-white/10 transition-colors">
                <MessageSquare className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white tracking-tight">Messages</h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">Review and respond to contact form submissions and inquiries.</p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-1.5 text-xs text-gray-400 group-hover:text-white font-medium transition-colors">
              <span>View Messages</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          {/* Card 2: Projects */}
          <Link 
            href="/admin/projects"
            className="bg-[#050505] rounded-2xl border border-white/5 p-5 hover:border-white/15 transition-all group flex flex-col justify-between shadow-sm"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/80 mb-3.5 group-hover:bg-white/10 transition-colors">
                <Cpu className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white tracking-tight">Projects</h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">Manage project catalog, README documentation, and links.</p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-1.5 text-xs text-gray-400 group-hover:text-white font-medium transition-colors">
              <span>Manage Projects</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          {/* Card 3: Research */}
          <Link 
            href="/admin/research"
            className="bg-[#050505] rounded-2xl border border-white/5 p-5 hover:border-white/15 transition-all group flex flex-col justify-between shadow-sm"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/80 mb-3.5 group-hover:bg-white/10 transition-colors">
                <BookOpen className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white tracking-tight">Research</h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">Publish and manage whitepapers, abstracts, and publications.</p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-1.5 text-xs text-gray-400 group-hover:text-white font-medium transition-colors">
              <span>Manage Research</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          {/* Card 4: Blog Posts */}
          <Link 
            href="/admin/blog"
            className="bg-[#050505] rounded-2xl border border-white/5 p-5 hover:border-white/15 transition-all group flex flex-col justify-between shadow-sm"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/80 mb-3.5 group-hover:bg-white/10 transition-colors">
                <FileText className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white tracking-tight">Blog Posts</h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">Create and publish blog posts, announcements, and updates.</p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-1.5 text-xs text-gray-400 group-hover:text-white font-medium transition-colors">
              <span>Manage Blog</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      <div className="bg-[#050505] rounded-2xl border border-white/5 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4 mb-6">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-white/60" />
              Growth & Traffic Analytics
            </h3>
            <p className="text-[10px] text-gray-500 mt-1">Review active traffic patterns and community registration scales.</p>
          </div>
          
          <div className="flex items-center bg-white/[0.03] border border-white/5 p-0.5 rounded-lg shrink-0">
            <button
              onClick={() => setChartMode("visits")}
              className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                chartMode === "visits" ? "bg-white text-black" : "text-gray-400 hover:text-white"
              }`}
            >
              Page Views
            </button>
            <button
              onClick={() => setChartMode("registrations")}
              className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                chartMode === "registrations" ? "bg-white text-black" : "text-gray-400 hover:text-white"
              }`}
            >
              Registrations
            </button>
          </div>
        </div>

        {chartMode === "visits" ? (
          <AnalyticsChart data={visitGrowth} label="Visitor Path Hits" color="#00a3ff" />
        ) : (
          <AnalyticsChart data={registrationGrowth} label="User Registrations" color="#10b981" />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-[#050505] rounded-2xl border border-white/5 p-6">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-6 flex items-center gap-2">
            <Globe className="w-4 h-4 text-white/60" />
            Top Visited Pages
          </h3>
          <div className="space-y-4">
            {topPaths.map((item, index) => {
              const maxCount = Math.max(...topPaths.map(p => p.uniqueViews), 1);
              const percent = Math.round((item.uniqueViews / maxCount) * 100);
              const revisits = item.totalHits - item.uniqueViews;
              return (
                <div key={item.path} className="flex items-center gap-4">
                  <span className="text-xs font-mono text-gray-500 w-6">#{index + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-xs mb-1 items-end">
                      <div className="flex flex-col overflow-hidden">
                        <span className="font-bold text-white truncate pr-2">{formatPathName(item.path)}</span>
                        <span className="text-[9px] font-mono text-gray-500 truncate pr-2">{item.path}</span>
                      </div>
                      <div className="flex flex-col items-end shrink-0">
                        <span className="text-gray-300 font-mono">{item.uniqueViews} views</span>
                        {revisits > 0 && <span className="text-[9px] text-gray-500">{revisits} revisits</span>}
                      </div>
                    </div>
                    <div className="h-1.5 w-full bg-white/[0.03] rounded-full overflow-hidden border border-white/[0.02]">
                      <div 
                        className="h-full bg-white transition-all duration-500" 
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
            {topPaths.length === 0 && (
              <div className="text-center py-8 text-gray-500 text-xs">
                No visitor traffic recorded yet.
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#050505] rounded-2xl border border-white/5 p-6">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-6 flex items-center gap-2">
            <Globe className="w-4 h-4 text-white/60" />
            Top Locations
          </h3>
          <div className="space-y-5">
            {countryStats.map((stat) => {
              const percent = totalVisits > 0 ? Math.round((stat.count / totalVisits) * 100) : 0;
              let displayCountry = stat.country;
              if (!displayCountry || displayCountry.toLowerCase() === "unknown") displayCountry = "Unknown Location";
              if (displayCountry === "IN") displayCountry = "India";
              if (displayCountry === "US") displayCountry = "United States";
              if (displayCountry === "GB" || displayCountry === "UK") displayCountry = "United Kingdom";
              if (displayCountry === "CA") displayCountry = "Canada";
              if (displayCountry === "DE") displayCountry = "Germany";
              if (displayCountry === "FR") displayCountry = "France";
              if (displayCountry === "CN") displayCountry = "China";
              if (displayCountry === "JP") displayCountry = "Japan";
              if (displayCountry === "Localhost") displayCountry = "Local Development";
              
              return (
                <div key={stat.country} className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-semibold">
                    <span className="text-gray-300 truncate pr-2 text-sm">{displayCountry}</span>
                    <span className="text-gray-400 font-mono shrink-0">{stat.count} ({percent}%)</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/[0.03] rounded-full overflow-hidden border border-white/[0.02]">
                    <div 
                      className="h-full bg-white transition-all" 
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {countryStats.length === 0 && (
              <div className="text-center py-8 text-gray-500 text-xs">No location data recorded yet.</div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row lg:flex-col gap-6 bg-[#050505] rounded-2xl border border-white/5 p-6">
          <div className="space-y-4 flex-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-white/60" />
              Gender Distribution
            </h3>
            <div className="space-y-3.5">
              {genderStats.map((stat) => {
                const total = genderStats.reduce((acc, curr) => acc + curr.count, 0);
                const percent = total > 0 ? Math.round((stat.count / total) * 100) : 0;
                let genderLabel = stat.gender || "Not Specified";
                return (
                  <div key={stat.gender || "unknown"} className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold">
                      <span className="text-gray-300 capitalize">{genderLabel.replace('-', ' ')}</span>
                      <span className="text-gray-400 font-mono">{stat.count} ({percent}%)</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/[0.03] rounded-full overflow-hidden border border-white/[0.02]">
                      <div 
                        className="h-full bg-white transition-all" 
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              {genderStats.length === 0 && (
                <div className="text-center py-6 text-gray-500 text-xs">No demographic data recorded yet.</div>
              )}
            </div>
          </div>

          <div className="space-y-4 flex-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-white/60" />
              Age Groups
            </h3>
            <div className="space-y-3.5">
              {ageGroupStats.map((stat) => {
                const total = ageGroupStats.reduce((acc, curr) => acc + curr.count, 0);
                const percent = total > 0 ? Math.round((stat.count / total) * 100) : 0;
                return (
                  <div key={stat.group} className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold">
                      <span className="text-gray-300">{stat.group}</span>
                      <span className="text-gray-400 font-mono">{stat.count} ({percent}%)</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/[0.03] rounded-full overflow-hidden border border-white/[0.02]">
                      <div 
                        className="h-full bg-white transition-all" 
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              {ageGroupStats.reduce((acc, curr) => acc + curr.count, 0) === 0 && (
                <div className="text-center py-6 text-gray-500 text-xs">No date of birth data recorded yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#050505] rounded-2xl border border-white/5 p-6">
        <div className="border-b border-white/5 pb-4 mb-6">
          <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            Security Diagnostics & Account Anomalies
          </h3>
          <p className="text-xs text-gray-500 mt-1">Identifies potential automated registration attempts sharing identical IP signatures or device fingerprints.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Duplicate IP Matches</h4>
            {sharedIps.length === 0 ? (
              <div className="py-4 text-gray-500 text-xs">No duplicate IP anomalies detected.</div>
            ) : (
              <div className="space-y-3">
                {sharedIps.map((item) => (
                  <div key={item.ipAddress} className="p-4 bg-[#0c0c0e] border border-white/5 rounded-xl text-xs space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-white font-bold">{item.ipAddress}</span>
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/25 text-amber-400 text-[9px] font-bold uppercase">
                        {item.count} Accounts
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500 leading-relaxed">
                      <span className="font-semibold text-gray-600 block uppercase mb-0.5">Linked Usernames</span>
                      <span className="font-mono text-gray-400">{item.usernames}</span>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Duplicate Fingerprint Matches</h4>
            {sharedFingerprints.length === 0 ? (
              <div className="py-4 text-gray-500 text-xs">No duplicate device fingerprint anomalies detected.</div>
            ) : (
              <div className="space-y-3">
                {sharedFingerprints.map((item) => (
                  <div key={item.deviceFingerprint} className="p-4 bg-[#0c0c0e] border border-white/5 rounded-xl text-xs space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-white font-bold truncate max-w-[150px]" title={item.deviceFingerprint}>
                        {item.deviceFingerprint}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/25 text-amber-400 text-[9px] font-bold uppercase">
                        {item.count} Accounts
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500 leading-relaxed">
                      <span className="font-semibold text-gray-600 block uppercase mb-0.5">Linked Usernames</span>
                      <span className="font-mono text-gray-400">{item.usernames}</span>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#050505] rounded-2xl border border-white/5 p-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-white/60" />
              Recent Messages
            </h3>
            <Link 
              href="/admin/messages" 
              className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-all"
            >
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {recentContacts.slice(0, 3).length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-xs">
              No messages received yet.
            </div>
          ) : (
            <div className="space-y-3">
              {recentContacts.slice(0, 3).map((contact) => (
                <div key={contact.id} className="p-4 rounded-xl bg-[#0b0b0b] border border-white/5 text-xs">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-white">{contact.name}</span>
                    <span className="text-[10px] text-gray-500">{formatDateDeterministic(contact.createdAt)}</span>
                  </div>
                  <p className="text-gray-300 font-medium mb-1">{decodeHtml(contact.subject)}</p>
                  <p className="text-gray-500 truncate leading-relaxed">{decodeHtml(contact.message)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-[#050505] rounded-2xl border border-white/5 p-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-white/60" />
              Recent Users
            </h3>
            <Link 
              href="/admin/users" 
              className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-all"
            >
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {recentUsers.slice(0, 3).length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-xs">
              No registered users yet.
            </div>
          ) : (
            <div className="space-y-3">
              {recentUsers.slice(0, 3).map((user) => (
                <div key={user.id} className="p-4 rounded-xl bg-[#0b0b0b] border border-white/5 text-xs">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{user.name || user.username}</span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider bg-white/10 text-gray-300">
                        {user.role}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-500">{formatDateDeterministic(user.createdAt)}</span>
                  </div>
                  <p className="text-gray-500 font-mono">{user.email}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
