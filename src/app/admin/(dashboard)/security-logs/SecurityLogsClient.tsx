"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { 
  Shield, ChevronRight, Search, X, Loader2, RefreshCw, 
  AlertTriangle, UserCheck, UserX, Calendar, ChevronDown, 
  Monitor, Globe, Info, Activity, Database
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LogType {
  id: string;
  userId: string | null;
  username: string | null;
  ipAddress: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  deviceFingerprint: string | null;
  userAgent: string | null;
  status: string;
  createdAt: string;
  userFullName: string | null;
  userEmail: string | null;
  userRole: string | null;
}

interface SecurityLogsClientProps {
  initialLogs: LogType[];
}

function formatDateDeterministic(dateStr: string) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "Unknown";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// Premium custom select component
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
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
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
            {options.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
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

export default function SecurityLogsClient({ initialLogs }: SecurityLogsClientProps) {
  const [logsList, setLogsList] = useState<LogType[]>(initialLogs);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Filters state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [privilegeFilter, setPrivilegeFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");

  // Date Filtering
  const [dateFilter, setDateFilter] = useState("All"); // All, Today, 7days, 30days, Custom
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const refreshLogs = async () => {
    setIsProcessing(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/users"); // Wait, we need to load logs of all users. How to refresh?
      // Since we want all security logs, let's load a custom API endpoint that retrieves all security logs!
      // Let's create `/api/security-logs` or fetch it directly.
      // Wait, is there a global endpoint? Let's check `/api/users/[id]/logs`. That is per-user.
      // Let's fetch from the route that returns all user logs. Do we have a global route?
      // We can easily call `window.location.reload()` or define a quick API endpoint `/api/admin/security-logs` or `/api/users/logs`!
      // Wait, let's look at the database fetching in page.tsx:
      // page.tsx runs SSR. If we reload the window or do router.refresh(), it will fetch fresh SSR data.
      // Let's implement router.refresh() or window.location.reload() for a quick refresh!
      window.location.reload();
    } catch (e) {
      setErrorMsg("Error communicating with security servers.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Filter and sort computation
  const filteredLogs = useMemo(() => {
    let list = [...logsList];

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(log => 
        (log.username && log.username.toLowerCase().includes(q)) ||
        (log.userFullName && log.userFullName.toLowerCase().includes(q)) ||
        (log.userEmail && log.userEmail.toLowerCase().includes(q)) ||
        (log.ipAddress && log.ipAddress.toLowerCase().includes(q)) ||
        (log.city && log.city.toLowerCase().includes(q)) ||
        (log.state && log.state.toLowerCase().includes(q)) ||
        (log.country && log.country.toLowerCase().includes(q)) ||
        (log.userAgent && log.userAgent.toLowerCase().includes(q))
      );
    }

    // Status filter
    if (statusFilter !== "All") {
      list = list.filter(log => log.status === statusFilter);
    }

    // Privilege filter
    if (privilegeFilter !== "All") {
      if (privilegeFilter === "anonymous") {
        list = list.filter(log => !log.userId);
      } else {
        list = list.filter(log => log.userRole === privilegeFilter);
      }
    }

    // Date filter
    const now = new Date();
    if (dateFilter === "Today") {
      const todayStr = now.toISOString().split('T')[0];
      list = list.filter(log => {
        const logDate = new Date(log.createdAt).toISOString().split('T')[0];
        return logDate === todayStr;
      });
    } else if (dateFilter === "7days") {
      const limit = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      list = list.filter(log => new Date(log.createdAt) >= limit);
    } else if (dateFilter === "30days") {
      const limit = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      list = list.filter(log => new Date(log.createdAt) >= limit);
    } else if (dateFilter === "Custom" && (startDate || endDate)) {
      list = list.filter(log => {
        const logDate = new Date(log.createdAt);
        if (startDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          if (logDate < start) return false;
        }
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          if (logDate > end) return false;
        }
        return true;
      });
    }

    // Sorting
    list.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();

      if (sortOrder === "newest") return dateB - dateA;
      if (sortOrder === "oldest") return dateA - dateB;
      return 0;
    });

    return list;
  }, [logsList, search, statusFilter, privilegeFilter, dateFilter, startDate, endDate, sortOrder]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = logsList.length;
    const success = logsList.filter(l => l.status === "success").length;
    const failed = total - success;
    const successRate = total > 0 ? Math.round((success / total) * 100) : 100;
    return { total, success, failed, successRate };
  }, [logsList]);

  return (
    <div className="space-y-6 animate-fadeIn text-left">
      {/* Breadcrumb Header */}
      <header className="pb-6 border-b border-white/5 mb-6">
        <div className="flex items-center gap-2 mb-1.5 text-xs text-gray-500">
          <span>Admin</span>
          <ChevronRight className="w-3 h-3 text-gray-600" />
          <span>Data Management</span>
          <ChevronRight className="w-3 h-3 text-gray-600" />
          <span className="text-gray-300 font-medium">Security Logs</span>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            <Shield className="w-6 h-6 text-[#00a3ff] shadow-[0_0_20px_rgba(0,163,255,0.2)]" />
            Security Auditing Portal
            <span className="text-xs bg-white/5 text-gray-400 font-mono font-normal px-2.5 py-0.5 rounded-full border border-white/10 ml-2">
              {filteredLogs.length} Shards Loaded
            </span>
          </h1>
        </div>
      </header>

      {errorMsg && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center gap-2 font-mono">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Audit Stats Panel */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#050505] rounded-2xl border border-white/5 p-5 relative overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
          <div className="flex justify-between items-start mb-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/5 border border-white/10">
              <Database className="w-4 h-4 text-white/75" />
            </div>
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">total attempts</span>
          </div>
          <h3 className="text-3xl font-bold tracking-tight text-white mb-0.5">{stats.total}</h3>
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Access Requests Logged</p>
        </div>

        <div className="bg-[#050505] rounded-2xl border border-white/5 p-5 relative overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
          <div className="flex justify-between items-start mb-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#10b981]/5 border border-[#10b981]/10">
              <UserCheck className="w-4 h-4 text-[#10b981]" />
            </div>
            <span className="text-[10px] font-mono text-[#10b981] uppercase tracking-widest">success audits</span>
          </div>
          <h3 className="text-3xl font-bold tracking-tight text-[#10b981] mb-0.5">{stats.success}</h3>
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Successful logins</p>
        </div>

        <div className="bg-[#050505] rounded-2xl border border-white/5 p-5 relative overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
          <div className="flex justify-between items-start mb-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-red-500/5 border border-red-500/10">
              <UserX className="w-4 h-4 text-red-400" />
            </div>
            <span className="text-[10px] font-mono text-red-500 uppercase tracking-widest">failed audits</span>
          </div>
          <h3 className="text-3xl font-bold tracking-tight text-red-400 mb-0.5">{stats.failed}</h3>
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Unverified access</p>
        </div>

        <div className="bg-[#050505] rounded-2xl border border-white/5 p-5 relative overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
          <div className="flex justify-between items-start mb-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#00a3ff]/5 border border-[#00a3ff]/10">
              <Activity className="w-4 h-4 text-[#00a3ff]" />
            </div>
            <span className="text-[10px] font-mono text-[#00a3ff] uppercase tracking-widest">health score</span>
          </div>
          <h3 className="text-3xl font-bold tracking-tight text-[#00a3ff] mb-0.5">{stats.successRate}%</h3>
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Credentials verification rate</p>
        </div>
      </div>

      {/* Control bar */}
      <div className="bg-[#050505] border border-white/5 rounded-2xl p-5 space-y-4 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by identity, email, IP address, state, or location..."
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
            <button
              onClick={refreshLogs}
              disabled={isProcessing}
              className="p-2.5 bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-xl hover:bg-white/[0.04] transition-all text-gray-400 hover:text-white disabled:opacity-50 cursor-pointer flex items-center gap-1.5 font-mono text-[10px] uppercase font-bold tracking-wider"
              title="Refresh Registry"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </button>
          </div>
        </div>

        {/* Custom selectors filter bar */}
        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/5">
          <CustomSelect
            label="Verification Status"
            value={statusFilter}
            options={[
              { value: "All", label: "All Statuses" },
              { value: "success", label: "Success Logins" },
              { value: "failed", label: "Failed Attempts" }
            ]}
            onChange={setStatusFilter}
            className="w-44"
          />

          <CustomSelect
            label="Node Privileges"
            value={privilegeFilter}
            options={[
              { value: "All", label: "All Privileges" },
              { value: "user", label: "User Accounts" },
              { value: "author", label: "Author Accounts" },
              { value: "admin", label: "Admin Accounts" },
              { value: "anonymous", label: "Anonymous / Unregistered" }
            ]}
            onChange={setPrivilegeFilter}
            className="w-48"
          />

          <CustomSelect
            label="Date Bound"
            value={dateFilter}
            options={[
              { value: "All", label: "All Time" },
              { value: "Today", label: "Today Only" },
              { value: "7days", label: "Past 7 Days" },
              { value: "30days", label: "Past 30 Days" },
              { value: "Custom", label: "Custom Range..." }
            ]}
            onChange={setDateFilter}
            className="w-44"
          />

          <CustomSelect
            label="Sort Chrono"
            value={sortOrder}
            options={[
              { value: "newest", label: "Newest First" },
              { value: "oldest", label: "Oldest First" }
            ]}
            onChange={setSortOrder}
            className="w-40"
          />
        </div>

        {/* Custom date range fields (conditional) */}
        <AnimatePresence>
          {dateFilter === "Custom" && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col sm:flex-row items-center gap-3 pt-3 border-t border-white/5 overflow-hidden"
            >
              <div className="flex flex-col gap-1 w-full sm:w-auto">
                <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest font-mono">Start Date</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="bg-[#0a0a0a] border border-white/[0.08] focus:border-[#00a3ff]/40 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-700 outline-none"
                />
              </div>
              <div className="flex flex-col gap-1 w-full sm:w-auto">
                <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest font-mono">End Date</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="bg-[#0a0a0a] border border-white/[0.08] focus:border-[#00a3ff]/40 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-700 outline-none"
                />
              </div>
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

      {/* Logs Table */}
      {filteredLogs.length === 0 ? (
        <div className="text-center py-16 bg-[#050505] rounded-2xl border border-white/5 text-gray-600 font-mono text-sm shadow-inner">
          {logsList.length === 0 ? "NO SECURITY AUDITING RECORDS REGISTERED IN DATABASE." : "NO SECURITY LOGS MATCHING SEARCH OR FILTERS FOUND."}
        </div>
      ) : (
        <div className="bg-[#050505] rounded-2xl border border-white/5 overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-[#0a0a0a] text-[10px] text-gray-500 uppercase tracking-wider font-mono">
                  <th className="p-4 pl-6">Profile / Username</th>
                  <th className="p-4">Timestamp & IP</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Geolocation Location</th>
                  <th className="p-4 pr-6">Client Fingerprint & Agent</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-white/5 font-sans">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.01] transition-colors duration-200">
                    <td className="p-4 pl-6">
                      <div className="flex flex-col gap-0.5 text-left">
                        {log.userId ? (
                          <>
                            <span className="font-bold text-white text-sm">{log.userFullName || "Anonymous Node"}</span>
                            <span className="text-[10px] text-gray-500 font-mono">@{log.username} ({log.userRole})</span>
                          </>
                        ) : (
                          <>
                            <span className="font-bold text-gray-400 text-sm italic">Unregistered Identity</span>
                            <span className="text-[10px] text-red-400 font-mono">Input: @{log.username || "None"}</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-0.5 text-left">
                        <span className="text-white font-mono">
                          {formatDateDeterministic(log.createdAt)} {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                        <span className="text-gray-500 font-mono text-[10px]">{log.ipAddress || "Unknown IP"}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      {log.status === "success" ? (
                        <span className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] uppercase font-mono font-bold tracking-wider inline-flex items-center gap-1 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                          Success
                        </span>
                      ) : (
                        <span className="px-2.5 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 text-[9px] uppercase font-mono font-bold tracking-wider inline-flex items-center gap-1 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                          Failed
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-gray-400">
                      <div className="flex flex-col gap-0.5 text-left">
                        <span className="font-medium text-gray-300">
                          {log.city || "Unknown City"}
                          {log.state ? `, ${log.state}` : ""}
                        </span>
                        <span className="text-[9px] text-gray-500 font-mono uppercase tracking-widest">
                          {log.country || "Unknown Country"}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 pr-6 text-gray-500 font-mono max-w-[250px] truncate" title={log.userAgent || "No Agent"}>
                      <div className="flex flex-col gap-0.5 text-left">
                        <span className="truncate text-gray-400 font-bold text-[10px]" title={`Fingerprint: ${log.deviceFingerprint || "None"}`}>
                          FP: {log.deviceFingerprint ? log.deviceFingerprint.slice(0, 16) + "..." : "None"}
                        </span>
                        <span className="truncate text-[9px] text-gray-600" title={log.userAgent || "No Agent"}>
                          {log.userAgent || "No Agent"}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
