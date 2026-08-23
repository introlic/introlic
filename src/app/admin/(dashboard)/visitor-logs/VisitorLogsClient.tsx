"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  Activity, Globe, Monitor, Smartphone, Tablet, Search, X,
  RefreshCw, Loader2, ChevronRight, ChevronDown, ChevronLeft,
  Eye, Cpu, Wifi, Calendar, MapPin, Laptop
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface VisitRow {
  id: string;
  ipAddress: string;
  userAgent: string | null;
  path: string;
  referer: string | null;
  country: string | null;
  state: string | null;
  deviceType: string | null;
  deviceBrand: string | null;
  deviceModel: string | null;
  visitorId: string | null;
  visitCount: number;
  os: string | null;
  browser: string | null;
  screenResolution: string | null;
  cpuCores: number | null;
  language: string | null;
  sessionId: string | null;
  createdAt: string;
}

interface Props {
  initialVisits: VisitRow[];
}

// ── Sub-components ────────────────────────────────────────────────────────────

interface CustomSelectProps {
  label?: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (val: string) => void;
  className?: string;
}

function CustomSelect({ label, value, options, onChange, className = "" }: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectedLabel = options.find(o => o.value === value)?.label || value;

  return (
    <div ref={ref} className={`flex flex-col gap-1.5 relative ${className}`}>
      {label && (
        <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest font-mono">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between bg-[#0a0a0a] border border-white/[0.08] hover:border-white/20 px-3.5 py-2.5 rounded-xl text-xs text-white text-left transition-all duration-300 cursor-pointer font-sans"
        style={{ borderColor: open ? "rgba(0,163,255,0.4)" : undefined }}
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-300 shrink-0 ${open ? "rotate-180 text-[#00a3ff]" : ""}`} />
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
            {options.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs text-left transition-colors duration-150 cursor-pointer ${
                  value === opt.value
                    ? "text-[#00a3ff] bg-[#00a3ff]/08 font-bold"
                    : "text-gray-400 hover:text-white hover:bg-white/[0.03]"
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

// Device icon
function DeviceIcon({ type }: { type: string | null }) {
  if (type === "mobile") return <Smartphone className="w-3.5 h-3.5 text-[#00a3ff]" />;
  if (type === "tablet") return <Tablet className="w-3.5 h-3.5 text-purple-400" />;
  if (type === "laptop") return <Laptop className="w-3.5 h-3.5 text-amber-400" />;
  return <Monitor className="w-3.5 h-3.5 text-gray-400" />;
}

// Path badge
function PathBadge({ path }: { path: string }) {
  const isHome = path === "/";
  const segments = path.split("/").filter(Boolean);
  const label = isHome ? "Home" : segments[segments.length - 1] || path;
  
  const colorMap: Record<string, string> = {
    about: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    blog: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    research: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    projects: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    contact: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  };
  const color = Object.entries(colorMap).find(([k]) => path.includes(k))?.[1] 
    || "bg-white/5 text-gray-300 border-white/10";

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${color}`}>
      {label}
    </span>
  );
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "Unknown";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function VisitorLogsClient({ initialVisits }: Props) {
  const [visitList, setVisitList] = useState<VisitRow[]>(initialVisits);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [deviceFilter, setDeviceFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  // Pagination
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 50;

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/visits?limit=200&page=1");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setVisitList(data.visits);
      setPage(1);
    } catch {
      setError("Failed to refresh visitor logs.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Stats
  const stats = useMemo(() => {
    const total = visitList.length;
    const uniqueIps = new Set(visitList.map(v => v.ipAddress)).size;
    const uniquePages = new Set(visitList.map(v => v.path)).size;
    const uniqueSessions = new Set(visitList.map(v => v.sessionId).filter(Boolean)).size;
    const mobile = visitList.filter(v => v.deviceType === "mobile").length;
    const desktop = visitList.filter(v => v.deviceType === "desktop").length;
    const tablet = visitList.filter(v => v.deviceType === "tablet").length;
    return { total, uniqueIps, uniquePages, uniqueSessions, mobile, desktop, tablet };
  }, [visitList]);

  // Filtered & sorted list
  const filtered = useMemo(() => {
    let list = [...visitList];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(v =>
        v.ipAddress.toLowerCase().includes(q) ||
        v.path.toLowerCase().includes(q) ||
        (v.os && v.os.toLowerCase().includes(q)) ||
        (v.browser && v.browser.toLowerCase().includes(q)) ||
        (v.country && v.country.toLowerCase().includes(q)) ||
        (v.state && v.state.toLowerCase().includes(q)) ||
        (v.deviceBrand && v.deviceBrand.toLowerCase().includes(q)) ||
        (v.deviceModel && v.deviceModel.toLowerCase().includes(q)) ||
        (v.visitorId && v.visitorId.toLowerCase().includes(q)) ||
        (v.sessionId && v.sessionId.toLowerCase().includes(q))
      );
    }

    if (deviceFilter !== "All") {
      list = list.filter(v => v.deviceType === deviceFilter);
    }

    const now = new Date();
    if (dateFilter === "Today") {
      const todayStr = now.toISOString().split("T")[0];
      list = list.filter(v => new Date(v.createdAt).toISOString().split("T")[0] === todayStr);
    } else if (dateFilter === "7days") {
      const limit = new Date(now.getTime() - 7 * 86400_000);
      list = list.filter(v => new Date(v.createdAt) >= limit);
    } else if (dateFilter === "30days") {
      const limit = new Date(now.getTime() - 30 * 86400_000);
      list = list.filter(v => new Date(v.createdAt) >= limit);
    } else if (dateFilter === "Custom" && (startDate || endDate)) {
      list = list.filter(v => {
        const d = new Date(v.createdAt);
        if (startDate) { const s = new Date(startDate); s.setHours(0,0,0,0); if (d < s) return false; }
        if (endDate) { const e = new Date(endDate); e.setHours(23,59,59,999); if (d > e) return false; }
        return true;
      });
    }

    list.sort((a, b) => {
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      return sortOrder === "newest" ? db - da : da - db;
    });

    return list;
  }, [visitList, search, deviceFilter, dateFilter, startDate, endDate, sortOrder]);

  // Paginated
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6 animate-fadeIn text-left">
      {/* Header */}
      <header className="pb-6 border-b border-white/5 mb-6">
        <div className="flex items-center gap-2 mb-1.5 text-xs text-gray-500">
          <span>Admin</span>
          <ChevronRight className="w-3 h-3 text-gray-600" />
          <span>Analytics</span>
          <ChevronRight className="w-3 h-3 text-gray-600" />
          <span className="text-gray-300 font-medium">Visitor Logs</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            <Activity className="w-6 h-6 text-[#00a3ff] shadow-[0_0_20px_rgba(0,163,255,0.2)]" />
            Visitor Intelligence
            <span className="text-xs bg-white/5 text-gray-400 font-mono font-normal px-2.5 py-0.5 rounded-full border border-white/10 ml-2">
              {filtered.length} Records
            </span>
          </h1>
          <div className="flex items-center gap-2">
            {isLoading && <Loader2 className="w-4 h-4 animate-spin text-[#00a3ff]" />}
            <button
              onClick={refresh}
              disabled={isLoading}
              className="p-2.5 bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-xl hover:bg-white/[0.04] transition-all text-gray-400 hover:text-white disabled:opacity-50 cursor-pointer flex items-center gap-1.5 font-mono text-[10px] uppercase font-bold tracking-wider"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </button>
          </div>
        </div>
      </header>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl font-mono">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {[
          { icon: Eye, label: "Total Hits", value: stats.total, color: "text-white" },
          { icon: Wifi, label: "Unique IPs", value: stats.uniqueIps, color: "text-[#00a3ff]" },
          { icon: Globe, label: "Pages Seen", value: stats.uniquePages, color: "text-purple-400" },
          { icon: Activity, label: "Sessions", value: stats.uniqueSessions, color: "text-emerald-400" },
          { icon: Monitor, label: "Desktop", value: stats.desktop, color: "text-gray-300" },
          { icon: Smartphone, label: "Mobile", value: stats.mobile, color: "text-[#00a3ff]" },
          { icon: Tablet, label: "Tablet", value: stats.tablet, color: "text-purple-400" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-[#050505] rounded-2xl border border-white/5 p-4 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`w-3.5 h-3.5 ${color}`} />
              <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">{label}</span>
            </div>
            <h3 className={`text-2xl font-bold tracking-tight ${color}`}>{value}</h3>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="bg-[#050505] border border-white/5 rounded-2xl p-5 space-y-4 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by IP, page, OS, browser, country..."
              className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-xl py-2.5 pl-10 pr-9 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#00a3ff]/40 transition-all font-sans"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 pt-4 border-t border-white/5">
          <CustomSelect
            label="Device Type"
            value={deviceFilter}
            options={[
              { value: "All", label: "All Devices" },
              { value: "desktop", label: "Desktop" },
              { value: "mobile", label: "Mobile" },
              { value: "tablet", label: "Tablet" },
            ]}
            onChange={v => { setDeviceFilter(v); setPage(1); }}
            className="w-40"
          />
          <CustomSelect
            label="Date Range"
            value={dateFilter}
            options={[
              { value: "All", label: "All Time" },
              { value: "Today", label: "Today Only" },
              { value: "7days", label: "Past 7 Days" },
              { value: "30days", label: "Past 30 Days" },
              { value: "Custom", label: "Custom Range..." },
            ]}
            onChange={v => { setDateFilter(v); setPage(1); }}
            className="w-44"
          />
          <CustomSelect
            label="Sort Order"
            value={sortOrder}
            options={[
              { value: "newest", label: "Newest First" },
              { value: "oldest", label: "Oldest First" },
            ]}
            onChange={setSortOrder}
            className="w-40"
          />
        </div>

        <AnimatePresence>
          {dateFilter === "Custom" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-wrap items-center gap-3 pt-3 border-t border-white/5 overflow-hidden"
            >
              {[
                { label: "Start Date", val: startDate, set: setStartDate },
                { label: "End Date", val: endDate, set: setEndDate },
              ].map(({ label, val, set }) => (
                <div key={label} className="flex flex-col gap-1">
                  <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest font-mono">{label}</span>
                  <input
                    type="date"
                    value={val}
                    onChange={e => { set(e.target.value); setPage(1); }}
                    className="bg-[#0a0a0a] border border-white/[0.08] focus:border-[#00a3ff]/40 rounded-xl px-3.5 py-2 text-xs text-white outline-none"
                  />
                </div>
              ))}
              <button
                onClick={() => { setStartDate(""); setEndDate(""); }}
                className="mt-5 text-[9px] text-gray-500 hover:text-white uppercase font-bold font-mono tracking-wider"
              >
                Clear Range
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Table */}
      {paginated.length === 0 ? (
        <div className="text-center py-16 bg-[#050505] rounded-2xl border border-white/5 text-gray-600 font-mono text-sm shadow-inner">
          {visitList.length === 0 ? "NO VISITOR RECORDS IN DATABASE YET." : "NO RECORDS MATCH YOUR FILTERS."}
        </div>
      ) : (
        <div className="bg-[#050505] rounded-2xl border border-white/5 overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-[#0a0a0a] text-[10px] text-gray-500 uppercase tracking-wider font-mono">
                  <th className="p-4 pl-6">Timestamp</th>
                  <th className="p-4">IP · Country</th>
                  <th className="p-4">Page Visited</th>
                  <th className="p-4">Device · OS</th>
                  <th className="p-4">Browser</th>
                  <th className="p-4">Screen · CPU</th>
                  <th className="p-4 pr-6">Session</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-white/5 font-sans">
                {paginated.map(v => (
                  <tr key={v.id} className="hover:bg-white/[0.015] transition-colors duration-200">
                    {/* Timestamp */}
                    <td className="p-4 pl-6 font-mono text-[10px] text-gray-400 whitespace-nowrap">
                      {formatDate(v.createdAt)}
                    </td>

                    {/* IP + Country & State */}
                    <td className="p-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-mono font-bold text-white text-[11px]">{v.ipAddress}</span>
                        <span className="flex items-center gap-1 text-[9px] text-gray-500 uppercase tracking-wider">
                          <MapPin className="w-2.5 h-2.5" />
                          {v.country || "Unknown"}{v.state ? `, ${v.state}` : ""}
                        </span>
                      </div>
                    </td>

                    {/* Page */}
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <PathBadge path={v.path} />
                        <span className="text-[9px] text-gray-600 font-mono truncate max-w-[160px]" title={v.path}>
                          {v.path}
                        </span>
                      </div>
                    </td>

                    {/* Device + OS */}
                    <td className="p-4">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5">
                          <DeviceIcon type={v.deviceType} />
                          <span className="text-[10px] text-gray-300 font-semibold capitalize">
                            {v.deviceBrand || "Generic"} {v.deviceModel || "Device"}
                          </span>
                        </div>
                        <span className="text-[9px] text-gray-500 font-mono">
                          {v.os || "—"} ({v.deviceType || "unknown"})
                        </span>
                      </div>
                    </td>

                    {/* Browser */}
                    <td className="p-4">
                      <span className="text-[10px] text-gray-300 font-medium">{v.browser || "—"}</span>
                    </td>

                    {/* Screen + CPU */}
                    <td className="p-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="flex items-center gap-1 text-[10px] text-gray-400 font-mono">
                          <Monitor className="w-3 h-3" />
                          {v.screenResolution || "—"}
                        </span>
                        <span className="flex items-center gap-1 text-[9px] text-gray-500">
                          <Cpu className="w-2.5 h-2.5" />
                          {v.cpuCores != null ? `${v.cpuCores} cores` : "—"}
                        </span>
                      </div>
                    </td>

                    {/* Session & Visitor ID */}
                    <td className="p-4 pr-6">
                      <div className="flex flex-col gap-0.5 font-mono text-[9px] text-gray-500">
                        <span className="truncate block max-w-[110px]" title={`Visitor ID: ${v.visitorId || 'None'}`}>
                          <span className="text-gray-600 font-sans font-semibold uppercase text-[8px] tracking-wider">Vid:</span> {v.visitorId ? v.visitorId.slice(0, 8) : "—"}
                        </span>
                        <span className="truncate block max-w-[110px]" title={`Session ID: ${v.sessionId || 'None'}`}>
                          <span className="text-gray-600 font-sans font-semibold uppercase text-[8px] tracking-wider">Sid:</span> {v.sessionId ? v.sessionId.slice(0, 8) : "—"}
                        </span>
                        <span className="text-gray-500 font-sans">
                          <span className="text-gray-600 font-sans font-semibold uppercase text-[8px] tracking-wider">Visits:</span> {v.visitCount}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-white/5">
              <span className="text-[10px] font-mono text-gray-500">
                Page {page} of {totalPages} · {filtered.length} results
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg bg-white/[0.02] border border-white/5 text-gray-400 hover:text-white hover:bg-white/[0.04] disabled:opacity-30 transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-1.5 rounded-lg bg-white/[0.02] border border-white/5 text-gray-400 hover:text-white hover:bg-white/[0.04] disabled:opacity-30 transition-all cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
