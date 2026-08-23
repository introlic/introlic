"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { 
  Mail, ChevronRight,
  Trash2, Search, X, ArrowLeft, ArrowRight,
  AlertCircle, ChevronDown, CheckCircle, MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import AdminDialog from "@/components/admin/AdminDialog";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  dateOfBirth: string | null;
  gender: string;
  state: string | null;
  subject: string;
  message: string;
  createdAt: Date;
}

interface MessagesClientProps {
  recentContacts: Contact[];
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

function formatDateTimeDeterministic(date: Date | string | null | undefined) {
  if (!date) return "Not Provided";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "Not Provided";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
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

const SUBJECT_MAP: Record<string, string> = {
  FUNDING_PARTNERS: "Funding & Partnerships",
  JOIN_MOVEMENT: "Joining the Movement",
  GENERAL_QUERY: "General Inquiry",
  BUG_REPORT: "Bug Report & Feedback",
  CAREERS: "Career Opportunities",
  PROJECT_IDEA: "Project Proposal",
  SUPPORT: "Technical Support",
};

const STATE_MAP: Record<string, string> = {
  AN_PRADESH: "Andhra Pradesh",
  ARUNACHAL: "Arunachal Pradesh",
  ASSAM: "Assam",
  BIHAR: "Bihar",
  CHHATTISGARH: "Chhattisgarh",
  GOA: "Goa",
  GUJARAT: "Gujarat",
  HARYANA: "Haryana",
  HP: "Himachal Pradesh",
  JHARKHAND: "Jharkhand",
  KARNATAKA: "Karnataka",
  KERALA: "Kerala",
  MP: "Madhya Pradesh",
  MAHARASHTRA: "Maharashtra",
  MANIPUR: "Manipur",
  MEGHALAYA: "Meghalaya",
  MIZORAM: "Mizoram",
  NAGALAND: "Nagaland",
  ODISHA: "Odisha",
  PUNJAB: "Punjab",
  RAJASTHAN: "Rajasthan",
  SIKKIM: "Sikkim",
  TAMIL_NADU: "Tamil Nadu",
  TELANGANA: "Telangana",
  TRIPURA: "Tripura",
  UP: "Uttar Pradesh",
  UTTARAKHAND: "Uttarakhand",
  WEST_BENGAL: "West Bengal",
  AN_ISLANDS: "Andaman & Nicobar Islands",
  CHANDIGARH: "Chandigarh",
  DNH_DD: "Dadra & Nagar Haveli and Daman & Diu",
  DELHI: "Delhi (NCT)",
  JAMMU_KASHMIR: "Jammu & Kashmir",
  LADAKH: "Ladakh",
  LAKSHADWEEP: "Lakshadweep",
  PUDUCHERRY: "Puducherry",
};

function formatSubjectLabel(raw: string | undefined | null): string {
  if (!raw) return "General Inquiry";
  if (SUBJECT_MAP[raw]) return SUBJECT_MAP[raw];
  return raw
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatStateLabel(state: string | null | undefined): string {
  if (!state) return "N/A";
  if (STATE_MAP[state]) return STATE_MAP[state];
  return state.replace(/_/g, " ");
}

function formatGender(gender: string | null | undefined): string {
  if (!gender) return "Not Specified";
  const g = gender.toUpperCase();
  if (g === "MALE") return "Male";
  if (g === "FEMALE") return "Female";
  if (g === "NON_BINARY") return "Non-Binary";
  if (g === "PREFER_NOT_TO_SAY") return "Prefer Not to Say";
  return gender.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

const STATUS_OPTIONS = [
  { id: "All", label: "All Statuses" },
  { id: "Unread", label: "Unread Only" },
  { id: "Pending Reply", label: "Pending Reply" },
  { id: "Replied", label: "Replied Only" }
];

const SORT_OPTIONS = [
  { id: "newest", label: "Newest First" },
  { id: "oldest", label: "Oldest First" },
  { id: "name_az", label: "Name A-Z" },
  { id: "name_za", label: "Name Z-A" }
];

export default function MessagesClient({ recentContacts }: MessagesClientProps) {
  const router = useRouter();
  const [contactsList, setContactsList] = useState<Contact[]>(recentContacts);
  const [contactSearch, setContactSearch] = useState("");
  const [contactSubjectFilter, setContactSubjectFilter] = useState("All");
  const [contactStatusFilter, setContactStatusFilter] = useState("All");
  const [contactSort, setContactSort] = useState("newest");
  const [contactLayout, setContactLayout] = useState<"linewise" | "onebyone">("linewise");
  const [oneByOneIndex, setOneByOneIndex] = useState(0);
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

  // Custom Dropdown Open States
  const [subjectDropdownOpen, setSubjectDropdownOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  // Custom Dropdown Refs
  const subjectRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  const [readContacts, setReadContacts] = useState<string[]>([]);
  const [repliedContacts, setRepliedContacts] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const read = localStorage.getItem("introlic_read_contacts");
      const replied = localStorage.getItem("introlic_replied_contacts");
      setTimeout(() => {
        if (read) setReadContacts(JSON.parse(read));
        if (replied) setRepliedContacts(JSON.parse(replied));
      }, 0);
    }
  }, []);

  // Click outside dropdown handler
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (subjectRef.current && !subjectRef.current.contains(e.target as Node)) {
        setSubjectDropdownOpen(false);
      }
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) {
        setStatusDropdownOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const deleteContact = async (id: string) => {
    showConfirmDialog(
      "Confirm Deletion",
      "Are you sure you want to delete this message? This action cannot be undone.",
      async () => {
        try {
          const res = await fetch("/api/contact", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
          });
          if (res.ok) {
            setContactsList(prev => prev.filter(c => c.id !== id));
            setOneByOneIndex(0);
            showAlertDialog("Message Deleted", "The message has been successfully deleted.", "success");
          } else {
            const data = await res.json();
            showAlertDialog("Failed to Delete", data.error || "Failed to delete message", "error");
          }
        } catch (err) {
          console.error(err);
          showAlertDialog("Error", "Error deleting message", "error");
        }
      },
      "error"
    );
  };

  const uniqueSubjects = useMemo(() => {
    const list = Array.from(new Set(contactsList.map(c => c.subject)));
    return ["All", ...list];
  }, [contactsList]);

  const processedContacts = useMemo(() => {
    let list = [...contactsList];

    if (contactSearch.trim()) {
      const q = contactSearch.toLowerCase();
      list = list.filter(c => 
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.subject.toLowerCase().includes(q) ||
        c.message.toLowerCase().includes(q) ||
        (c.state && c.state.toLowerCase().includes(q))
      );
    }

    if (contactSubjectFilter !== "All") {
      list = list.filter(c => c.subject === contactSubjectFilter);
    }

    if (contactStatusFilter === "Unread") {
      list = list.filter(c => !readContacts.includes(c.id));
    } else if (contactStatusFilter === "Replied") {
      list = list.filter(c => repliedContacts.includes(c.id));
    } else if (contactStatusFilter === "Pending Reply") {
      list = list.filter(c => !repliedContacts.includes(c.id));
    }

    list.sort((a, b) => {
      if (contactSort === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (contactSort === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (contactSort === "name_az") {
        return a.name.localeCompare(b.name);
      }
      if (contactSort === "name_za") {
        return b.name.localeCompare(a.name);
      }
      return 0;
    });

    return list;
  }, [contactsList, contactSearch, contactSubjectFilter, contactStatusFilter, contactSort, readContacts, repliedContacts]);

  return (
    <div className="space-y-8 animate-fadeIn text-white font-sans relative">
      {/* Title Header */}
      <div className="pb-2 flex items-center gap-3">
        <Mail className="w-7 h-7 text-white/80" />
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Messages & Inquiries</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage contact submissions, inquiries, and email responses.</p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-white/5 w-full my-4" />

      {/* Dynamic Network Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#050505] rounded-2xl border border-white/5 p-5 relative overflow-hidden">
          <div className="flex justify-between items-start mb-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/5 border border-white/10">
              <MessageSquare className="w-4 h-4 text-white/75" />
            </div>
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Total Inquiries</span>
          </div>
          <h3 className="text-3xl font-bold tracking-tight text-white mb-0.5">{contactsList.length}</h3>
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Total Received</p>
        </div>

        <div className="bg-[#050505] rounded-2xl border border-white/5 p-5 relative overflow-hidden">
          <div className="flex justify-between items-start mb-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/5 border border-white/10">
              <AlertCircle className="w-4 h-4 text-[#f59e0b]" />
            </div>
            <span className="text-[10px] font-mono text-[#f59e0b] uppercase tracking-widest">Pending Reply</span>
          </div>
          <h3 className="text-3xl font-bold tracking-tight text-[#f59e0b] mb-0.5">
            {contactsList.filter(c => !repliedContacts.includes(c.id)).length}
          </h3>
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Pending Response</p>
        </div>

        <div className="bg-[#050505] rounded-2xl border border-white/5 p-5 relative overflow-hidden">
          <div className="flex justify-between items-start mb-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/5 border border-white/10">
              <CheckCircle className="w-4 h-4 text-[#10b981]" />
            </div>
            <span className="text-[10px] font-mono text-[#10b981] uppercase tracking-widest">Replied</span>
          </div>
          <h3 className="text-3xl font-bold tracking-tight text-[#10b981] mb-0.5">
            {contactsList.filter(c => repliedContacts.includes(c.id)).length}
          </h3>
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Responses Sent</p>
        </div>
      </div>

      <div className="bg-[#050505] border border-white/5 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={contactSearch}
              onChange={e => { setContactSearch(e.target.value); setOneByOneIndex(0); }}
              placeholder="Search by name, email, subject or message..."
              className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-xl py-2.5 pl-10 pr-9 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-white/20 transition-all font-sans"
            />
            {contactSearch && (
              <button 
                onClick={() => { setContactSearch(""); setOneByOneIndex(0); }} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center bg-white/[0.03] border border-white/5 p-0.5 rounded-lg shrink-0">
            <button
              onClick={() => setContactLayout("linewise")}
              className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                contactLayout === "linewise" ? "bg-white text-black" : "text-gray-400 hover:text-white"
              }`}
            >
              Line-wise
            </button>
            <button
              onClick={() => { setContactLayout("onebyone"); setOneByOneIndex(0); }}
              className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                contactLayout === "onebyone" ? "bg-white text-black" : "text-gray-400 hover:text-white"
              }`}
            >
              One-by-one
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-white/5">
          {/* Subject Dropdown */}
          <div ref={subjectRef} className="relative">
            <button
              type="button"
              onClick={() => setSubjectDropdownOpen(v => !v)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-white/[0.06] bg-[#0a0a0a] hover:bg-white/[0.04] hover:border-white/10 text-[10px] font-mono font-bold uppercase tracking-widest text-gray-400 hover:text-gray-200 transition-all duration-200 cursor-pointer whitespace-nowrap"
            >
              <span className="text-gray-600">Subject:</span>
              <span>{contactSubjectFilter === "All" ? "All Subjects" : formatSubjectLabel(contactSubjectFilter)}</span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${subjectDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {subjectDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-full mt-2 w-56 bg-[#080808]/98 backdrop-blur-xl border border-white/[0.08] rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9)] z-50 max-h-60 overflow-y-auto custom-scrollbar"
                >
                  {uniqueSubjects.map((sub) => (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => { setContactSubjectFilter(sub); setSubjectDropdownOpen(false); setOneByOneIndex(0); }}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-[10px] font-mono font-bold uppercase tracking-widest text-left transition-colors duration-150 cursor-pointer ${
                        contactSubjectFilter === sub
                          ? 'text-white bg-white/10'
                          : 'text-gray-500 hover:text-gray-200 hover:bg-white/[0.03]'
                      }`}
                    >
                      <span className="truncate mr-2">{sub === "All" ? "All Subjects" : formatSubjectLabel(sub)}</span>
                      {contactSubjectFilter === sub && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Status Dropdown */}
          <div ref={statusRef} className="relative">
            <button
              type="button"
              onClick={() => setStatusDropdownOpen(v => !v)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-white/[0.06] bg-[#0a0a0a] hover:bg-white/[0.04] hover:border-white/10 text-[10px] font-mono font-bold uppercase tracking-widest text-gray-400 hover:text-gray-200 transition-all duration-200 cursor-pointer whitespace-nowrap"
            >
              <span className="text-gray-600">Status:</span>
              <span>{STATUS_OPTIONS.find(o => o.id === contactStatusFilter)?.label}</span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${statusDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {statusDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-full mt-2 w-44 bg-[#080808]/98 backdrop-blur-xl border border-white/[0.08] rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9)] z-50"
                >
                  {STATUS_OPTIONS.map(({ id, label }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => { setContactStatusFilter(id); setStatusDropdownOpen(false); setOneByOneIndex(0); }}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-[10px] font-mono font-bold uppercase tracking-widest text-left transition-colors duration-150 cursor-pointer ${
                        contactStatusFilter === id
                          ? 'text-white bg-white/10'
                          : 'text-gray-500 hover:text-gray-200 hover:bg-white/[0.03]'
                      }`}
                    >
                      <span>{label}</span>
                      {contactStatusFilter === id && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sort Dropdown */}
          <div ref={sortRef} className="relative ml-auto">
            <button
              type="button"
              onClick={() => setSortDropdownOpen(v => !v)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-white/[0.06] bg-[#0a0a0a] hover:bg-white/[0.04] hover:border-white/10 text-[10px] font-mono font-bold uppercase tracking-widest text-gray-400 hover:text-gray-200 transition-all duration-200 cursor-pointer whitespace-nowrap"
            >
              <span className="text-gray-600">Sort:</span>
              <span>{SORT_OPTIONS.find(o => o.id === contactSort)?.label}</span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${sortDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {sortDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-44 bg-[#080808]/98 backdrop-blur-xl border border-white/[0.08] rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9)] z-50"
                >
                  {SORT_OPTIONS.map(({ id, label }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => { setContactSort(id); setSortDropdownOpen(false); setOneByOneIndex(0); }}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-[10px] font-mono font-bold uppercase tracking-widest text-left transition-colors duration-150 cursor-pointer ${
                        contactSort === id
                          ? 'text-white bg-white/10'
                          : 'text-gray-500 hover:text-gray-200 hover:bg-white/[0.03]'
                      }`}
                    >
                      <span>{label}</span>
                      {contactSort === id && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {processedContacts.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-16 bg-[#050505] rounded-2xl border border-white/5 space-y-4 animate-fadeIn">
          <div className="w-12 h-12 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-center text-gray-500 shadow-inner mx-auto">
            <Mail className="w-5 h-5 opacity-40 text-white" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              No Messages Found
            </h3>
            <p className="text-xs text-gray-500 max-w-xs font-sans mx-auto">
              No contact messages matching the active filters or search queries are currently stored.
            </p>
          </div>
        </div>
      ) : contactLayout === "linewise" ? (
        <div className="overflow-x-auto bg-[#050505] rounded-2xl border border-white/5">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-[#0a0a0a] text-[10px] text-gray-500 uppercase tracking-wider">
                <th className="p-4 pl-6">Status</th>
                <th className="p-4">Sender</th>
                <th className="p-4">Subject</th>
                <th className="p-4">Location</th>
                <th className="p-4">Received Date</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-white/5">
              {processedContacts.map((contact) => {
                const isRead = readContacts.includes(contact.id);
                const isReplied = repliedContacts.includes(contact.id);

                return (
                  <tr 
                    key={contact.id} 
                    onClick={() => {
                      router.push(`/admin/messages/${contact.id}`);
                    }}
                    className="hover:bg-white/[0.01] transition-colors cursor-pointer"
                  >
                    <td className="p-4 pl-6">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        isReplied ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                        isRead ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                        "bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          isReplied ? "bg-emerald-500" :
                          isRead ? "bg-blue-400" :
                          "bg-amber-500"
                        }`} />
                        {isReplied ? "Replied" : isRead ? "Read" : "Unread"}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-white">
                      <div>
                        <p>{contact.name}</p>
                        <p className="text-[10px] text-gray-500 font-normal font-mono">{contact.email}</p>
                      </div>
                    </td>
                    <td className="p-4 text-gray-300 font-semibold uppercase tracking-wider text-[10px]">
                      {formatSubjectLabel(contact.subject)}
                    </td>
                    <td className="p-4 text-gray-400">{formatStateLabel(contact.state)}</td>
                    <td className="p-4 text-gray-500 font-mono">
                      {formatDateTimeDeterministic(contact.createdAt)}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-1.5" onClick={e => e.stopPropagation()}>
                        <button 
                          onClick={() => {
                            router.push(`/admin/messages/${contact.id}`);
                          }}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all cursor-pointer inline-flex items-center"
                          title="View Message Details"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deleteContact(contact.id)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer inline-flex items-center"
                          title="Delete Message"
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
      ) : (
        (() => {
          const index = Math.min(Math.max(0, oneByOneIndex), processedContacts.length - 1);
          const contact = processedContacts[index];
          if (!contact) return null;

          const isReplied = repliedContacts.includes(contact.id);

          return (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-[#050505] border border-white/5 p-4 rounded-xl">
                <button
                  onClick={() => setOneByOneIndex(prev => Math.max(0, prev - 1))}
                  disabled={index === 0}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-white/5 rounded-lg hover:bg-white/5 text-[10px] font-bold uppercase tracking-wider transition-all disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer font-sans"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Previous Message
                </button>
                <span className="text-xs font-mono text-gray-500">
                  MESSAGE {index + 1} OF {processedContacts.length}
                </span>
                <button
                  onClick={() => setOneByOneIndex(prev => Math.min(processedContacts.length - 1, prev + 1))}
                  disabled={index === processedContacts.length - 1}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-white/5 rounded-lg hover:bg-white/5 text-[10px] font-bold uppercase tracking-wider transition-all disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer font-sans"
                >
                  Next Message
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
                <div className="bg-[#050505] border border-white/5 rounded-2xl p-6 space-y-6">
                  <div className="flex flex-col items-center text-center space-y-3 pb-6 border-b border-white/5">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl font-black text-white uppercase">
                      {contact.name.substring(0, 2)}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">{contact.name}</h3>
                      <span className="text-xs font-mono text-gray-400 break-all">{contact.email}</span>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase ${
                      isReplied ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : 
                      "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}>
                      {isReplied ? "Reply Sent" : "Action Required"}
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <span className="text-gray-500 uppercase text-[9px] tracking-wider block mb-1">Subject</span>
                      <span className="font-bold text-white text-xs uppercase">{formatSubjectLabel(contact.subject)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 uppercase text-[9px] tracking-wider block mb-1">Received Timestamp</span>
                      <span className="font-mono text-gray-300 text-xs">{formatDateTimeDeterministic(contact.createdAt)}</span>
                    </div>
                    <div className="pt-4 border-t border-white/5 space-y-2">
                      <button
                        onClick={() => router.push(`/admin/messages/${contact.id}`)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-black hover:bg-gray-200 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer font-sans"
                      >
                        Open Details & Reply
                      </button>
                      <button
                        onClick={() => deleteContact(contact.id)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-red-500/20 text-red-400 hover:bg-red-500/10 rounded-xl text-xs font-bold tracking-wider transition-all cursor-pointer font-sans"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete Message
                      </button>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2 bg-[#050505] border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
                  <div className="space-y-2 flex-1">
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest font-mono">Message Content</span>
                    <p className="text-sm text-gray-300 leading-relaxed bg-[#0a0a0c] border border-white/5 rounded-xl p-5 whitespace-pre-wrap font-sans min-h-[180px]">
                      {decodeHtml(contact.message)}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-white/[0.01] border border-white/[0.03] text-[11px] mt-6">
                    <div>
                      <span className="text-gray-500 uppercase text-[9px] tracking-wider block mb-0.5">Birth Date</span>
                      <span className="font-semibold text-gray-300">{formatDateDeterministic(contact.dateOfBirth)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 uppercase text-[9px] tracking-wider block mb-0.5">Gender</span>
                      <span className="font-semibold text-gray-300 capitalize">{formatGender(contact.gender)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 uppercase text-[9px] tracking-wider block mb-0.5">Location</span>
                      <span className="font-semibold text-gray-300">{formatStateLabel(contact.state)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 uppercase text-[9px] tracking-wider block mb-0.5">Phone</span>
                      <span className="font-semibold text-gray-300 font-mono">{contact.phone || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()
      )}

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
