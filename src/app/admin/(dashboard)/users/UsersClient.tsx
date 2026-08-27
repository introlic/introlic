"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { 
  Users, ChevronRight, Plus, Search, Edit, Trash2, X, 
  ChevronDown, Calendar, Loader2, UserCheck, UserX, Shield,
  Filter, AlertTriangle, RefreshCw, Mail, User, Info, Link2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface UserType {
  id: string;
  name: string | null;
  username: string;
  email: string;
  role: string;
  status: string;
  gender: string | null;
  dateOfBirth: string | null;
  socialHandle: string | null;
  createdAt: string | Date;
  loginAttemptsCount?: number;
}

interface UsersClientProps {
  recentUsers: UserType[];
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
        className="w-full flex items-center justify-between bg-[#0a0a0a] border border-white/[0.08] hover:border-white/20 px-3.5 py-2 rounded-xl text-xs text-white text-left transition-all duration-300 cursor-pointer font-sans"
        style={{ borderColor: open ? "rgba(255,255,255,0.4)" : undefined }}
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-300 shrink-0 ${open ? 'rotate-180 text-white' : ''}`} />
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
                    ? "text-white bg-white/10 font-bold"
                    : "text-gray-400 hover:text-white hover:bg-white/[0.03]"
                }`}
              >
                <span>{opt.label}</span>
                {value === opt.value && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function UsersClient({ recentUsers: initialUsers }: UsersClientProps) {
  const [usersList, setUsersList] = useState<UserType[]>(initialUsers);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Filters state
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");
  
  // Date Filtering
  const [dateFilter, setDateFilter] = useState("All"); // All, Today, 7days, 30days, Custom
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Security Auditing state
  const [activeModalTab, setActiveModalTab] = useState<"profile" | "logs">("profile");
  const [userLogs, setUserLogs] = useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    role: "user",
    status: "active",
    gender: "",
    dateOfBirth: "",
    socialHandle: ""
  });

  // Load all users from API to ensure fresh state
  const refreshUsers = async () => {
    setIsProcessing(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        setUsersList(data);
      } else {
        setErrorMsg("Failed to refresh users catalog.");
      }
    } catch (e) {
      setErrorMsg("Error communicating with server.");
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    refreshUsers();
  }, []);

  useEffect(() => {
    if (selectedUser && showEditModal && activeModalTab === "logs") {
      const fetchLogs = async () => {
        setLoadingLogs(true);
        try {
          const res = await fetch(`/api/users/${selectedUser.id}/logs`);
          if (res.ok) {
            const data = await res.json();
            setUserLogs(data);
          } else {
            console.error("Failed to load logs");
          }
        } catch (e) {
          console.error("Error fetching logs", e);
        } finally {
          setLoadingLogs(false);
        }
      };
      fetchLogs();
    }
  }, [selectedUser, showEditModal, activeModalTab]);

  // Filter and sort computation
  const filteredUsers = useMemo(() => {
    let list = [...usersList];

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(u => 
        (u.name && u.name.toLowerCase().includes(q)) ||
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
      );
    }

    // Role filter
    if (roleFilter !== "All") {
      list = list.filter(u => u.role === roleFilter);
    }

    // Status filter
    if (statusFilter !== "All") {
      list = list.filter(u => u.status === statusFilter);
    }

    // Date filter
    const now = new Date();
    if (dateFilter === "Today") {
      const todayStr = now.toISOString().split('T')[0];
      list = list.filter(u => {
        const uDate = new Date(u.createdAt).toISOString().split('T')[0];
        return uDate === todayStr;
      });
    } else if (dateFilter === "7days") {
      const limit = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      list = list.filter(u => new Date(u.createdAt) >= limit);
    } else if (dateFilter === "30days") {
      const limit = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      list = list.filter(u => new Date(u.createdAt) >= limit);
    } else if (dateFilter === "Custom" && (startDate || endDate)) {
      list = list.filter(u => {
        const uDate = new Date(u.createdAt);
        if (startDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          if (uDate < start) return false;
        }
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          if (uDate > end) return false;
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
      if (sortOrder === "name_az") {
        const nameA = a.name || a.username;
        const nameB = b.name || b.username;
        return nameA.localeCompare(nameB);
      }
      if (sortOrder === "name_za") {
        const nameA = a.name || a.username;
        const nameB = b.name || b.username;
        return nameB.localeCompare(nameA);
      }
      return 0;
    });

    return list;
  }, [usersList, search, roleFilter, statusFilter, dateFilter, startDate, endDate, sortOrder]);

  const handleOpenAddModal = () => {
    setFormData({
      name: "",
      username: "",
      email: "",
      password: "",
      role: "user",
      status: "active",
      gender: "",
      dateOfBirth: "",
      socialHandle: ""
    });
    setErrorMsg("");
    setSuccessMsg("");
    setShowAddModal(true);
  };

  const handleOpenEditModal = (user: UserType) => {
    setSelectedUser(user);
    setActiveModalTab("profile");
    setUserLogs([]);
    setFormData({
      name: user.name || "",
      username: user.username,
      email: user.email,
      password: "",
      role: user.role,
      status: user.status,
      gender: user.gender || "",
      dateOfBirth: user.dateOfBirth || "",
      socialHandle: user.socialHandle || ""
    });
    setErrorMsg("");
    setSuccessMsg("");
    setShowEditModal(true);
  };

  const handleOpenDeleteConfirm = (user: UserType) => {
    setSelectedUser(user);
    setErrorMsg("");
    setSuccessMsg("");
    setShowDeleteConfirm(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          dateOfBirth: formData.dateOfBirth || null,
          gender: formData.gender || null,
          socialHandle: formData.socialHandle || null
        })
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(`User @${formData.username} created successfully!`);
        setShowAddModal(false);
        refreshUsers();
      } else {
        setErrorMsg(data.error || "Failed to create user.");
      }
    } catch (err) {
      setErrorMsg("Failed to communicate with server.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setIsProcessing(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const updatePayload: any = {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        role: formData.role,
        status: formData.status,
        gender: formData.gender || null,
        dateOfBirth: formData.dateOfBirth || null,
        socialHandle: formData.socialHandle || null
      };

      if (formData.password.trim()) {
        updatePayload.password = formData.password;
      }

      const res = await fetch(`/api/users/${selectedUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload)
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(`User updated successfully!`);
        setShowEditModal(false);
        refreshUsers();
      } else {
        setErrorMsg(data.error || "Failed to update user.");
      }
    } catch (err) {
      setErrorMsg("Failed to communicate with server.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteSubmit = async () => {
    if (!selectedUser) return;
    setIsProcessing(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch(`/api/users/${selectedUser.id}`, {
        method: "DELETE"
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg("User deleted successfully.");
        setShowDeleteConfirm(false);
        refreshUsers();
      } else {
        setErrorMsg(data.error || "Failed to delete user.");
      }
    } catch (err) {
      setErrorMsg("Failed to communicate with server.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn text-left font-sans">
      {/* Breadcrumb Header */}
      <header className="pb-6 border-b border-white/5 mb-6">
        <div className="flex items-center gap-2 mb-1.5 text-xs text-gray-500">
          <span>Admin</span>
          <ChevronRight className="w-3 h-3 text-gray-600" />
          <span className="text-gray-300 font-medium">Users</span>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            <Users className="w-6 h-6 text-white/80" />
            Users
            <span className="text-xs bg-white/5 text-gray-400 font-mono font-normal px-2.5 py-0.5 rounded-full border border-white/10 ml-2">
              {filteredUsers.length} of {usersList.length} Users
            </span>
          </h1>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 bg-white hover:bg-gray-200 active:scale-95 text-black font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-lg shadow-white/5"
          >
            <Plus className="w-4 h-4" />
            Add User
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

      {/* Control bar */}
      <div className="bg-[#050505] border border-white/5 rounded-2xl p-5 space-y-4 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, username or email..."
              className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-xl py-2.5 pl-10 pr-9 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-white/20 transition-all font-sans"
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
            {isProcessing && <Loader2 className="w-4 h-4 animate-spin text-white" />}
            <button
              onClick={refreshUsers}
              disabled={isProcessing}
              className="p-2.5 bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-xl hover:bg-white/[0.04] transition-all text-gray-400 hover:text-white disabled:opacity-50 cursor-pointer"
              title="Refresh Users"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Custom selectors filter bar */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-4 border-t border-white/5">
          <CustomSelect
            label="Role Privilege"
            value={roleFilter}
            options={[
              { value: "All", label: "All Roles" },
              { value: "user", label: "User" },
              { value: "member", label: "Member" },
              { value: "author", label: "Author" },
              { value: "admin", label: "Admin" }
            ]}
            onChange={setRoleFilter}
            className="w-full sm:w-36"
          />

          <CustomSelect
            label="Status Mode"
            value={statusFilter}
            options={[
              { value: "All", label: "All Statuses" },
              { value: "active", label: "Active" },
              { value: "suspended", label: "Suspended" }
            ]}
            onChange={setStatusFilter}
            className="w-full sm:w-36"
          />

          <CustomSelect
            label="Date Registered"
            value={dateFilter}
            options={[
              { value: "All", label: "All Time" },
              { value: "Today", label: "Registered Today" },
              { value: "7days", label: "Past 7 Days" },
              { value: "30days", label: "Past 30 Days" },
              { value: "Custom", label: "Custom Range..." }
            ]}
            onChange={setDateFilter}
            className="w-full sm:w-44"
          />

          <CustomSelect
            label="Sort Order"
            value={sortOrder}
            options={[
              { value: "newest", label: "Newest First" },
              { value: "oldest", label: "Oldest First" },
              { value: "name_az", label: "Name A-Z" },
              { value: "name_za", label: "Name Z-A" }
            ]}
            onChange={setSortOrder}
            className="w-full sm:w-36"
          />
        </div>

        {/* Custom date range fields */}
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
                  className="bg-[#0a0a0a] border border-white/[0.08] focus:border-white/20 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-700 outline-none"
                />
              </div>
              <div className="flex flex-col gap-1 w-full sm:w-auto">
                <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest font-mono">End Date</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="bg-[#0a0a0a] border border-white/[0.08] focus:border-white/20 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-700 outline-none"
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

      {/* Users table */}
      {filteredUsers.length === 0 ? (
        <div className="text-center py-16 bg-[#050505] rounded-2xl border border-white/5 text-gray-500 text-sm shadow-inner">
          {usersList.length === 0 ? "No registered users found." : "No users matching search or filters found."}
        </div>
      ) : (
        <div className="bg-[#050505] rounded-2xl border border-white/5 overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-[#0a0a0a] text-[10px] text-gray-500 uppercase tracking-wider font-mono">
                  <th className="p-4 pl-6">User Profile</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Registered Date</th>
                  <th className="p-4">Login Attempts</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-white/5 font-sans">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/[0.01] transition-colors duration-200">
                    <td className="p-4 pl-6">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-white text-sm">{user.name || "Anonymous User"}</span>
                        <span className="text-[10px] text-gray-500 font-mono">@{user.username}</span>
                        {user.socialHandle && (
                          <a 
                             href={user.socialHandle} 
                             target="_blank" 
                             rel="noopener noreferrer" 
                             className="text-[9px] text-gray-400 hover:text-white flex items-center gap-1 font-mono mt-0.5"
                          >
                            <Link2 className="w-2.5 h-2.5" /> Social Profile
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-gray-400 font-mono">{user.email}</td>
                    <td className="p-4 text-gray-500 font-mono">
                      {formatDateDeterministic(user.createdAt)}
                    </td>
                    <td className="p-4 text-gray-400 font-mono">
                      {user.loginAttemptsCount ?? 0}
                    </td>
                    <td className="p-4">
                      {user.role === "admin" && (
                        <span className="px-2.5 py-1.5 rounded-lg bg-white/10 text-white border border-white/20 text-[9px] uppercase font-mono font-bold tracking-wider inline-flex items-center gap-1">
                          <Shield className="w-2.5 h-2.5" /> admin
                        </span>
                      )}
                      {user.role === "author" && (
                        <span className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] uppercase font-mono font-bold tracking-wider inline-flex items-center gap-1">
                          <Info className="w-2.5 h-2.5" /> author
                        </span>
                      )}
                      {user.role !== "admin" && user.role !== "author" && (
                        <span className="px-2.5 py-1.5 rounded-lg bg-white/5 text-gray-400 border border-white/10 text-[9px] uppercase font-mono font-bold tracking-wider">
                          {user.role}
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      {user.status === "active" ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] uppercase font-mono font-bold tracking-wider">
                          active
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-[9px] uppercase font-mono font-bold tracking-wider">
                          suspended
                        </span>
                      )}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(user)}
                          className="p-2 bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all cursor-pointer"
                          title="Edit User"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenDeleteConfirm(user)}
                          className="p-2 bg-white/5 border border-white/5 hover:border-red-500/25 hover:bg-red-500/5 rounded-lg text-gray-400 hover:text-red-400 transition-all cursor-pointer"
                          title="Delete User"
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

      {/* Add User Modal */}
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
              className="bg-[#050505] border border-white/10 rounded-2xl w-full max-w-lg p-6 relative z-10 shadow-[0_25px_60px_rgba(0,0,0,0.9)] max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-6">
                <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <User className="w-5 h-5 text-white/80" />
                  Add New User
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
                    <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest font-mono">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. John Doe"
                      className="w-full bg-[#0a0a0a] border border-white/[0.08] focus:border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-sans"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest font-mono">Username</label>
                    <input
                      type="text"
                      required
                      value={formData.username}
                      onChange={e => setFormData({ ...formData, username: e.target.value })}
                      placeholder="e.g. johndoe"
                      className="w-full bg-[#0a0a0a] border border-white/[0.08] focus:border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest font-mono">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. john@example.com"
                      className="w-full bg-[#0a0a0a] border border-white/[0.08] focus:border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-mono"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest font-mono">Set Password</label>
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={e => setFormData({ ...formData, password: e.target.value })}
                      placeholder="At least 8 chars..."
                      className="w-full bg-[#0a0a0a] border border-white/[0.08] focus:border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <CustomSelect
                    label="Assign Role"
                    value={formData.role}
                    options={[
                      { value: "user", label: "User" },
                      { value: "member", label: "Member" },
                      { value: "author", label: "Author" },
                      { value: "admin", label: "Admin" }
                    ]}
                    onChange={val => setFormData({ ...formData, role: val })}
                  />

                  <CustomSelect
                    label="Status Mode"
                    value={formData.status}
                    options={[
                      { value: "active", label: "Active" },
                      { value: "suspended", label: "Suspended" }
                    ]}
                    onChange={val => setFormData({ ...formData, status: val })}
                  />
                </div>

                <div className="h-px bg-white/5 my-2" />

                <div className="grid grid-cols-2 gap-4">
                  <CustomSelect
                    label="Gender Profile"
                    value={formData.gender}
                    options={[
                      { value: "", label: "Not Specified" },
                      { value: "male", label: "Male" },
                      { value: "female", label: "Female" },
                      { value: "other", label: "Other" },
                      { value: "prefer-not", label: "Prefer Not to Say" }
                    ]}
                    onChange={val => setFormData({ ...formData, gender: val })}
                  />

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest font-mono">Date of Birth</label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="w-full bg-[#0a0a0a] border border-white/[0.08] focus:border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-sans"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest font-mono">Social Profile Link</label>
                  <input
                    type="url"
                    value={formData.socialHandle}
                    onChange={e => setFormData({ ...formData, socialHandle: e.target.value })}
                    placeholder="e.g. https://github.com/username"
                    className="w-full bg-[#0a0a0a] border border-white/[0.08] focus:border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-mono"
                  />
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 rounded-xl text-xs font-mono font-bold text-gray-400 hover:text-white transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="flex items-center gap-2 bg-white hover:bg-gray-200 disabled:opacity-50 font-bold text-black text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer"
                  >
                    {isProcessing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    Add User
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit User Modal */}
      <AnimatePresence>
        {showEditModal && selectedUser && (
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
              className={`bg-[#050505] border border-white/10 rounded-2xl w-full ${activeModalTab === "logs" ? "max-w-2xl" : "max-w-lg"} p-6 relative z-10 shadow-[0_25px_60px_rgba(0,0,0,0.9)] max-h-[90vh] overflow-y-auto custom-scrollbar transition-all duration-300`}
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-6">
                <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <Edit className="w-5 h-5 text-white/80" />
                  Edit User
                </h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-500 hover:text-white p-1 hover:bg-white/5 rounded-lg transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Dynamic tab switcher */}
              <div className="flex border-b border-white/5 mb-6">
                <button
                  type="button"
                  onClick={() => setActiveModalTab("profile")}
                  className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider text-center border-b-2 transition-all ${
                    activeModalTab === "profile"
                      ? "text-white border-white"
                      : "text-gray-500 border-transparent hover:text-gray-300"
                  }`}
                >
                  Profile
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModalTab("logs")}
                  className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider text-center border-b-2 transition-all ${
                    activeModalTab === "logs"
                      ? "text-white border-white"
                      : "text-gray-500 border-transparent hover:text-gray-300"
                  }`}
                >
                  Login Logs ({selectedUser.loginAttemptsCount ?? 0})
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-4">
                {activeModalTab === "profile" ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest font-mono">Full Name</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={e => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. John Doe"
                          className="w-full bg-[#0a0a0a] border border-white/[0.08] focus:border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-sans"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest font-mono">Username</label>
                        <input
                          type="text"
                          required
                          value={formData.username}
                          onChange={e => setFormData({ ...formData, username: e.target.value })}
                          placeholder="e.g. johndoe"
                          className="w-full bg-[#0a0a0a] border border-white/[0.08] focus:border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest font-mono">Email Address</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={e => setFormData({ ...formData, email: e.target.value })}
                          placeholder="e.g. john@example.com"
                          className="w-full bg-[#0a0a0a] border border-white/[0.08] focus:border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-mono"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest font-mono">Reset Password (Optional)</label>
                        <input
                          type="password"
                          value={formData.password}
                          onChange={e => setFormData({ ...formData, password: e.target.value })}
                          placeholder="Leave blank to keep unchanged..."
                          className="w-full bg-[#0a0a0a] border border-white/[0.08] focus:border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <CustomSelect
                        label="Assign Role"
                        value={formData.role}
                        options={[
                          { value: "user", label: "User" },
                          { value: "member", label: "Member" },
                          { value: "author", label: "Author" },
                          { value: "admin", label: "Admin" }
                        ]}
                        onChange={val => setFormData({ ...formData, role: val })}
                      />

                      <CustomSelect
                        label="Status Mode"
                        value={formData.status}
                        options={[
                          { value: "active", label: "Active" },
                          { value: "suspended", label: "Suspended" }
                        ]}
                        onChange={val => setFormData({ ...formData, status: val })}
                      />
                    </div>

                    <div className="h-px bg-white/5 my-2" />

                    <div className="grid grid-cols-2 gap-4">
                      <CustomSelect
                        label="Gender Profile"
                        value={formData.gender}
                        options={[
                          { value: "", label: "Not Specified" },
                          { value: "male", label: "Male" },
                          { value: "female", label: "Female" },
                          { value: "other", label: "Other" },
                          { value: "prefer-not", label: "Prefer Not to Say" }
                        ]}
                        onChange={val => setFormData({ ...formData, gender: val })}
                      />

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest font-mono">Date of Birth</label>
                        <input
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
                          className="w-full bg-[#0a0a0a] border border-white/[0.08] focus:border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-sans"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest font-mono">Social Profile Link</label>
                      <input
                        type="url"
                        value={formData.socialHandle}
                        onChange={e => setFormData({ ...formData, socialHandle: e.target.value })}
                        placeholder="e.g. https://github.com/username"
                        className="w-full bg-[#0a0a0a] border border-white/[0.08] focus:border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-mono"
                      />
                    </div>

                    <div className="pt-4 border-t border-white/5 flex items-center justify-end gap-3 mt-6">
                      <button
                        type="button"
                        onClick={() => setShowEditModal(false)}
                        className="px-4 py-2 bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 rounded-xl text-xs font-mono font-bold text-gray-400 hover:text-white transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="flex items-center gap-2 bg-white hover:bg-gray-200 disabled:opacity-50 font-bold text-black text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer"
                      >
                        {isProcessing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        Save Changes
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4 min-h-[300px]">
                    {loadingLogs ? (
                      <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-white" />
                        <span className="text-xs text-gray-500 font-mono">Retrieving login logs...</span>
                      </div>
                    ) : userLogs.length === 0 ? (
                      <div className="text-center py-20 bg-white/[0.01] border border-white/5 rounded-xl text-gray-500 text-xs">
                        No login attempts found for this user.
                      </div>
                    ) : (
                      <div className="max-h-[380px] overflow-y-auto custom-scrollbar border border-white/5 rounded-xl bg-[#030303]">
                        <table className="w-full text-left border-collapse text-[10.5px] font-sans">
                          <thead>
                            <tr className="border-b border-white/5 bg-[#080808] text-[8.5px] text-gray-500 uppercase tracking-widest font-mono sticky top-0 z-10">
                              <th className="p-3">Timestamp / IP</th>
                              <th className="p-3">Status</th>
                              <th className="p-3">Geolocation</th>
                              <th className="p-3">Agent & Fingerprint</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {userLogs.map((log) => (
                              <tr key={log.id} className="hover:bg-white/[0.01] transition-colors">
                                <td className="p-3">
                                  <div className="flex flex-col gap-0.5">
                                    <span className="text-white font-mono">
                                      {formatDateDeterministic(log.createdAt)} {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                    </span>
                                    <span className="text-gray-500 font-mono text-[9px]">{log.ipAddress || "Unknown IP"}</span>
                                  </div>
                                </td>
                                <td className="p-3 align-middle">
                                  {log.status === "success" ? (
                                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[8.5px] font-mono font-bold uppercase tracking-wider inline-block">
                                      Success
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 text-[8.5px] font-mono font-bold uppercase tracking-wider inline-block">
                                      Failed
                                    </span>
                                  )}
                                </td>
                                <td className="p-3 text-gray-400">
                                  <div className="flex flex-col gap-0.5">
                                    <span>
                                      {log.city || "Unknown City"}
                                      {log.state ? `, ${log.state}` : ""}
                                    </span>
                                    <span className="text-[8.5px] text-gray-500 font-mono uppercase tracking-widest">
                                      {log.country || "Unknown Country"}
                                    </span>
                                  </div>
                                </td>
                                <td className="p-3 text-gray-500 font-mono max-w-[160px]">
                                  <div className="flex flex-col gap-0.5">
                                    <span className="truncate text-gray-400" title={`Fingerprint: ${log.deviceFingerprint || "None"}`}>
                                      FP: {log.deviceFingerprint ? log.deviceFingerprint.slice(0, 12) + "..." : "None"}
                                    </span>
                                    <span className="truncate text-[8.5px] text-gray-600" title={log.userAgent}>
                                      {log.userAgent || "No Agent"}
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    <div className="pt-4 border-t border-white/5 flex items-center justify-end mt-6">
                      <button
                        type="button"
                        onClick={() => setShowEditModal(false)}
                        className="px-5 py-2.5 bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 rounded-xl text-xs font-bold text-gray-400 hover:text-white transition-all cursor-pointer"
                      >
                        Close Logs
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteConfirm(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-[#050505] border border-red-500/20 rounded-2xl w-full max-w-md p-6 relative z-10 shadow-[0_25px_60px_rgba(239,68,68,0.15)] text-center"
            >
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-500 mb-4 animate-bounce">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <h2 className="text-base font-bold text-white tracking-tight mb-2">
                Confirm User Deletion
              </h2>
              <p className="text-xs text-gray-500 leading-relaxed mb-6">
                Are you sure you want to delete user <span className="text-white font-bold">@{selectedUser.username}</span> ({selectedUser.name})? This action cannot be undone.
              </p>

              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 rounded-xl text-xs font-mono font-bold text-gray-400 hover:text-white transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteSubmit}
                  disabled={isProcessing}
                  className="flex items-center gap-2 bg-red-500 hover:bg-red-400 disabled:opacity-50 font-bold text-white text-xs px-5 py-2.5 rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all cursor-pointer"
                >
                  {isProcessing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Confirm Deletion
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
