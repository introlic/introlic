"use client";

import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, Mail, Trash2, Send, PenSquare, ChevronRight, CheckCircle,
  Eye, Loader2, ExternalLink, ShieldCheck, Copy, Check, Phone,
  MapPin, Calendar, User, Sparkles, MessageSquare, RotateCcw
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminDialog from "@/components/admin/AdminDialog";
import { motion, AnimatePresence } from "framer-motion";

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
  socialHandles?: any;
  createdAt: Date | string;
}

interface MessageDetailClientProps {
  contact: Contact;
}

// ── Dictionaries & Formatters ──

const SUBJECT_MAP: Record<string, { label: string; tagColor: string }> = {
  FUNDING_PARTNERS: { label: "Funding & Partnerships", tagColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  JOIN_MOVEMENT: { label: "Joining the Movement", tagColor: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  GENERAL_QUERY: { label: "General Inquiry", tagColor: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  BUG_REPORT: { label: "Bug Report & Feedback", tagColor: "bg-red-500/10 text-red-400 border-red-500/20" },
  CAREERS: { label: "Career Opportunities", tagColor: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  PROJECT_IDEA: { label: "Project Proposal", tagColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" },
  SUPPORT: { label: "Technical Support", tagColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" },
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
  if (SUBJECT_MAP[raw]) return SUBJECT_MAP[raw].label;
  return raw
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function getSubjectBadge(raw: string | undefined | null) {
  if (raw && SUBJECT_MAP[raw]) {
    return SUBJECT_MAP[raw];
  }
  return { label: formatSubjectLabel(raw), tagColor: "bg-white/5 text-gray-300 border-white/10" };
}

function formatStateLabel(state: string | null | undefined): string {
  if (!state) return "Not Specified";
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

function formatDateDeterministic(date: Date | string | number | null | undefined) {
  if (!date) return "Not Provided";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "Not Provided";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function formatDateTimeDeterministic(date: Date | string | number | null | undefined) {
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

function calculateAge(dobStr: string | null | undefined): string {
  if (!dobStr) return "";
  const dob = new Date(dobStr);
  if (isNaN(dob.getTime())) return "";
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) {
    age--;
  }
  return age > 0 ? ` (${age} yrs)` : "";
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

// ── Smart Quick Response Templates ──

interface TemplatePreset {
  id: string;
  name: string;
  subjectSuffix: string;
  generateBody: (name: string) => string;
}

const TEMPLATES: TemplatePreset[] = [
  {
    id: "movement",
    name: "Join Movement",
    subjectSuffix: "Joining the Introlic Movement",
    generateBody: (name: string) => 
`Hi ${name || "there"},

Thank you for reaching out and wanting to join the Introlic movement!

We are building sovereign, high-performance foundation models and digital systems from first principles. We are thrilled to connect with people who share our passion for independent research and open engineering.

Feel free to follow our latest updates and project releases at https://introlic.in or connect with us on GitHub and social channels. We look forward to staying in touch!`,
  },
  {
    id: "funding",
    name: "Partnership / Funding",
    subjectSuffix: "Funding & Partnerships Inquiry",
    generateBody: (name: string) => 
`Hi ${name || "there"},

Thank you for reaching out to Introlic regarding potential funding and strategic partnerships.

We are actively advancing our foundational AI research roadmap and evaluate strategic collaborations that align with our long-term mission.

Could you please share any relevant overview documents, proposal details, or preferred timeline? We would be glad to review them and discuss potential next steps.`,
  },
  {
    id: "developer",
    name: "Developer & Technical",
    subjectSuffix: "Developer Inquiry Response",
    generateBody: (name: string) => 
`Hi ${name || "there"},

Thank you for reaching out to the Introlic team!

We are always excited to connect with developers, researchers, and technical builders in our community. If you have any technical proposals, code links, or specific questions about our architecture, please feel free to share them.

We look forward to collaborating and building together.`,
  },
  {
    id: "careers",
    name: "Careers & Opportunities",
    subjectSuffix: "Career Opportunities at Introlic",
    generateBody: (name: string) => 
`Hi ${name || "there"},

Thank you for expressing interest in career and research opportunities at Introlic!

We evaluate candidates driven by first-principles problem solving in AI systems and engineering. Please feel free to reply with your CV, portfolio, or GitHub profile so our team can review your application.`,
  },
  {
    id: "support",
    name: "Technical Support",
    subjectSuffix: "Support Ticket Response",
    generateBody: (name: string) => 
`Hi ${name || "there"},

Thank you for bringing your query to our attention. Our team has received your message and is investigating.

If you have any additional details or error logs to share, please reply directly to this email so we can assist you effectively.`,
  },
  {
    id: "general",
    name: "General Acknowledgment",
    subjectSuffix: "Inquiry Response",
    generateBody: (name: string) => 
`Hi ${name || "there"},

Thank you for contacting Introlic. We have received your message and our team is reviewing your inquiry.

We will follow up with you as soon as possible. If you need to share any additional context, please reply directly to this email.`,
  }
];

export default function MessageDetailClient({ contact }: MessageDetailClientProps) {
  const router = useRouter();
  
  const [repliedContacts, setRepliedContacts] = useState<string[]>([]);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [replyLogs, setReplyLogs] = useState<Record<string, { replyText: string; sentAt: string; messageId?: string }>>({});
  
  // Clean Formatted Subject
  const displaySubjectName = formatSubjectLabel(contact.subject);
  const subjectBadge = getSubjectBadge(contact.subject);

  // Composer state
  const [composerTab, setComposerTab] = useState<"write" | "preview">("write");
  const [customSubject, setCustomSubject] = useState(`Regarding your inquiry: ${displaySubjectName} - Introlic`);
  const [isSending, setIsSending] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

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

  // Copy helper
  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Load from localStorage & Auto-mark as Read
  useEffect(() => {
    if (typeof window !== "undefined") {
      const read = localStorage.getItem("introlic_read_contacts");
      let readList: string[] = [];
      if (read) {
        try {
          readList = JSON.parse(read);
        } catch {
          readList = [];
        }
      }
      if (!readList.includes(contact.id)) {
        readList.push(contact.id);
        localStorage.setItem("introlic_read_contacts", JSON.stringify(readList));
      }

      const replied = localStorage.getItem("introlic_replied_contacts");
      if (replied) {
        try {
          setRepliedContacts(JSON.parse(replied));
        } catch {
          setRepliedContacts([]);
        }
      }

      const drafts = localStorage.getItem("introlic_reply_drafts");
      if (drafts) {
        try {
          setReplyDrafts(JSON.parse(drafts));
        } catch {
          setReplyDrafts({});
        }
      }

      const logs = localStorage.getItem("introlic_reply_logs");
      if (logs) {
        try {
          setReplyLogs(JSON.parse(logs));
        } catch {
          setReplyLogs({});
        }
      }
    }
  }, [contact.id]);

  const isReplied = repliedContacts.includes(contact.id);
  const currentDraft = replyDrafts[contact.id] || "";
  const existingLog = replyLogs[contact.id];

  const handleDraftChange = (text: string) => {
    const updated = { ...replyDrafts, [contact.id]: text };
    setReplyDrafts(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("introlic_reply_drafts", JSON.stringify(updated));
    }
  };

  // Apply template
  const applyTemplate = (template: TemplatePreset) => {
    const generated = template.generateBody(contact.name);
    handleDraftChange(generated);
    setCustomSubject(`Regarding: ${template.subjectSuffix} - Introlic`);
  };

  const handleClearDraft = () => {
    handleDraftChange("");
    setCustomSubject(`Regarding your inquiry: ${displaySubjectName} - Introlic`);
  };

  // Direct Resend Email Dispatch
  const handleSendViaResend = async () => {
    if (!currentDraft.trim()) {
      showAlertDialog("Empty Message", "Please write a response before sending.", "warning");
      return;
    }

    setIsSending(true);

    try {
      const res = await fetch("/api/admin/messages/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactId: contact.id,
          toEmail: contact.email,
          recipientName: contact.name,
          replyText: currentDraft.trim(),
          customSubject: customSubject.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (!isReplied) {
          const updatedReplied = [...repliedContacts, contact.id];
          setRepliedContacts(updatedReplied);
          if (typeof window !== "undefined") {
            localStorage.setItem("introlic_replied_contacts", JSON.stringify(updatedReplied));
          }
        }

        const updatedLogs = {
          ...replyLogs,
          [contact.id]: {
            replyText: currentDraft.trim(),
            sentAt: new Date().toISOString(),
            messageId: data.messageId,
          }
        };
        setReplyLogs(updatedLogs);
        if (typeof window !== "undefined") {
          localStorage.setItem("introlic_reply_logs", JSON.stringify(updatedLogs));
        }

        showAlertDialog(
          "Email Dispatched",
          `Your email response was successfully delivered to ${contact.email} from ${data.from} via Resend.`,
          "success"
        );
      } else {
        showAlertDialog(
          "Email Sending Failed",
          data.error || "Failed to send email. Please verify your Resend API configuration.",
          "error"
        );
      }
    } catch (err: any) {
      console.error(err);
      showAlertDialog(
        "Network Error",
        "Could not connect to the email dispatch server. Please try again.",
        "error"
      );
    } finally {
      setIsSending(false);
    }
  };

  // Fallback Mailto
  const handleOpenEmailClient = () => {
    if (!currentDraft.trim()) {
      showAlertDialog("Empty Draft", "Please compose a reply message before opening the email client.", "warning");
      return;
    }

    const mailtoUrl = `mailto:${encodeURIComponent(contact.email)}?subject=${encodeURIComponent(
      customSubject.trim() || `Re: ${displaySubjectName} - Introlic`
    )}&body=${encodeURIComponent(
      `${currentDraft}\n\nBest regards,\nThe Introlic Team\nhttps://introlic.in`
    )}`;

    window.open(mailtoUrl, "_blank");

    if (!isReplied) {
      const updatedReplied = [...repliedContacts, contact.id];
      setRepliedContacts(updatedReplied);
      if (typeof window !== "undefined") {
        localStorage.setItem("introlic_replied_contacts", JSON.stringify(updatedReplied));
      }
    }

    const updatedLogs = {
      ...replyLogs,
      [contact.id]: {
        replyText: currentDraft,
        sentAt: new Date().toISOString()
      }
    };
    setReplyLogs(updatedLogs);
    if (typeof window !== "undefined") {
      localStorage.setItem("introlic_reply_logs", JSON.stringify(updatedLogs));
    }

    showAlertDialog("Email Dispatched", "Opened your system default email client and marked message as replied.", "info");
  };

  const handleToggleReplied = () => {
    let updatedReplied: string[];
    if (isReplied) {
      updatedReplied = repliedContacts.filter(id => id !== contact.id);
      showAlertDialog("Status Updated", "Marked message as pending reply.", "info");
    } else {
      updatedReplied = [...repliedContacts, contact.id];
      showAlertDialog("Status Updated", "Marked message as replied.", "success");
    }
    setRepliedContacts(updatedReplied);
    if (typeof window !== "undefined") {
      localStorage.setItem("introlic_replied_contacts", JSON.stringify(updatedReplied));
    }
  };

  const deleteContact = async () => {
    showConfirmDialog(
      "Confirm Deletion",
      "Are you sure you want to delete this message? This action cannot be undone.",
      async () => {
        try {
          const res = await fetch("/api/contact", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: contact.id })
          });
          if (res.ok) {
            router.push("/admin/messages");
            router.refresh();
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

  return (
    <div className="space-y-6 animate-fadeIn text-white font-sans">
      
      {/* ── Top Header Navigation Bar ── */}
      <header className="pb-4 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Link href="/admin" className="hover:text-white transition-colors">Admin</Link>
            <ChevronRight className="w-3 h-3 text-gray-600" />
            <Link href="/admin/messages" className="hover:text-white transition-colors">Messages</Link>
            <ChevronRight className="w-3 h-3 text-gray-600" />
            <span className="text-gray-300 font-medium truncate max-w-[150px]">{contact.name}</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Mail className="w-5 h-5 text-white/80" />
            Message Details
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleToggleReplied}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              isReplied 
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20" 
                : "bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isReplied ? "bg-emerald-500" : "bg-amber-500 animate-pulse"}`} />
            {isReplied ? "Replied" : "Pending Reply"}
          </button>

          <button
            onClick={deleteContact}
            className="p-2 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 rounded-xl text-xs transition-all cursor-pointer"
            title="Delete Message"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <Link 
            href="/admin/messages"
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white font-bold cursor-pointer border border-white/5 bg-white/[0.02] px-3.5 py-2 rounded-xl hover:bg-white/5 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </Link>
        </div>
      </header>

      {/* ── Main 12-Column Grid Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ── Left 4 Columns: Sender Profile & Metadata ── */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Sender Identity Card */}
          <div className="bg-[#050505] border border-white/5 rounded-2xl p-6 space-y-5 shadow-sm">
            <div className="flex items-start gap-4 pb-5 border-b border-white/5">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-lg font-black text-white uppercase shrink-0">
                {contact.name.substring(0, 2)}
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <h3 className="font-bold text-white text-base truncate">{contact.name}</h3>
                <div className="flex items-center gap-1.5">
                  <a 
                    href={`mailto:${contact.email}`} 
                    className="text-xs font-mono text-gray-400 hover:text-white transition-colors truncate block"
                    title={contact.email}
                  >
                    {contact.email}
                  </a>
                  <button
                    onClick={() => handleCopy(contact.email, "email")}
                    className="p-1 hover:bg-white/10 rounded text-gray-500 hover:text-white transition-colors"
                    title="Copy Email"
                  >
                    {copiedField === "email" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Subject Badge */}
            <div>
              <span className="text-gray-500 uppercase text-[9px] font-mono tracking-widest block mb-1.5">Inquiry Category</span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border ${subjectBadge.tagColor}`}>
                {displaySubjectName}
              </span>
            </div>

            {/* Details Grid */}
            <div className="space-y-3.5 text-xs pt-1">
              
              {/* Phone */}
              <div className="flex items-center justify-between py-2 border-b border-white/[0.03]">
                <span className="text-gray-500 flex items-center gap-1.5 text-[11px]">
                  <Phone className="w-3.5 h-3.5 text-gray-600" /> Phone
                </span>
                {contact.phone ? (
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-gray-200">{contact.phone}</span>
                    <button
                      onClick={() => handleCopy(contact.phone || "", "phone")}
                      className="p-1 hover:bg-white/10 rounded text-gray-500 hover:text-white"
                      title="Copy Phone"
                    >
                      {copiedField === "phone" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                ) : (
                  <span className="text-gray-600 font-mono text-[11px]">Not Provided</span>
                )}
              </div>

              {/* State / Location */}
              <div className="flex items-center justify-between py-2 border-b border-white/[0.03]">
                <span className="text-gray-500 flex items-center gap-1.5 text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-gray-600" /> Location
                </span>
                <span className="font-semibold text-gray-200">
                  {formatStateLabel(contact.state)}
                </span>
              </div>

              {/* Gender */}
              <div className="flex items-center justify-between py-2 border-b border-white/[0.03]">
                <span className="text-gray-500 flex items-center gap-1.5 text-[11px]">
                  <User className="w-3.5 h-3.5 text-gray-600" /> Gender
                </span>
                <span className="font-medium text-gray-300">
                  {formatGender(contact.gender)}
                </span>
              </div>

              {/* Date of Birth & Age */}
              <div className="flex items-center justify-between py-2 border-b border-white/[0.03]">
                <span className="text-gray-500 flex items-center gap-1.5 text-[11px]">
                  <Calendar className="w-3.5 h-3.5 text-gray-600" /> Birth Date
                </span>
                <span className="font-mono text-gray-300">
                  {formatDateDeterministic(contact.dateOfBirth)}
                  <span className="text-gray-500 font-sans">{calculateAge(contact.dateOfBirth)}</span>
                </span>
              </div>

              {/* Received Timestamp */}
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-500 text-[11px]">Received At</span>
                <span className="font-mono text-gray-400 text-[11px]">
                  {formatDateTimeDeterministic(contact.createdAt)}
                </span>
              </div>
            </div>

            {/* Social Handles if present */}
            {contact.socialHandles && Object.keys(contact.socialHandles).length > 0 && (
              <div className="pt-4 border-t border-white/5">
                <span className="text-gray-500 uppercase text-[9px] font-mono tracking-widest block mb-2">Connected Handles</span>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(contact.socialHandles).map(([platform, handle]) => (
                    <span key={platform} className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-[11px] font-mono text-gray-300">
                      <strong className="text-gray-500 capitalize">{platform}:</strong> {String(handle)}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* ── Right 8 Columns: Original Message & Response Composer ── */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 1. Original Incoming Message Card */}
          <div className="bg-[#050505] border border-white/5 rounded-2xl p-6 space-y-3.5 shadow-sm">
            <div className="flex justify-between items-center pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-white/80" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Original Inquiry Message
                </span>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-gray-500 font-mono">
                <span>{decodeHtml(contact.message).split(/\s+/).length} words</span>
                <span>&bull;</span>
                <button
                  onClick={() => handleCopy(decodeHtml(contact.message), "orig_msg")}
                  className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {copiedField === "orig_msg" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  Copy Text
                </button>
              </div>
            </div>
            
            <div className="bg-[#09090b] border border-white/5 rounded-xl p-5 relative">
              <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap font-sans">
                {decodeHtml(contact.message)}
              </p>
            </div>
          </div>

          {/* 2. Response Composer Workspace with Resend & Templates */}
          <div className="bg-[#050505] border border-white/5 rounded-2xl p-6 space-y-4 shadow-sm">
            
            {/* Header with Title & Tab Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <PenSquare className="w-4 h-4 text-white/80" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Compose Email Response
                </h3>
                <span className="text-[9px] bg-emerald-500/10 text-emerald-400 font-mono px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Resend Active
                </span>
              </div>

              {/* Tab Switcher (Write / Preview) */}
              <div className="flex items-center bg-white/[0.03] border border-white/5 p-0.5 rounded-lg shrink-0">
                <button
                  type="button"
                  onClick={() => setComposerTab("write")}
                  className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                    composerTab === "write" ? "bg-white text-black" : "text-gray-400 hover:text-white"
                  }`}
                >
                  <PenSquare className="w-3 h-3" />
                  Write
                </button>
                <button
                  type="button"
                  onClick={() => setComposerTab("preview")}
                  className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                    composerTab === "preview" ? "bg-white text-black" : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Eye className="w-3 h-3" />
                  Preview Email
                </button>
              </div>
            </div>

            {/* Quick Response Templates Selector */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" /> QUICK RESPONSE TEMPLATES
                </span>
                {currentDraft && (
                  <button
                    type="button"
                    onClick={handleClearDraft}
                    className="text-gray-500 hover:text-red-400 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-2.5 h-2.5" /> Clear Draft
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => applyTemplate(tmpl)}
                    className="px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/10 border border-white/10 hover:border-white/20 text-[11px] font-medium text-gray-300 hover:text-white transition-all cursor-pointer"
                  >
                    {tmpl.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Email Subject Line Field */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono">
                <span>EMAIL SUBJECT LINE</span>
                <span className="text-gray-400">To: {contact.email}</span>
              </div>
              <input
                type="text"
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                placeholder="Enter subject..."
                className="w-full bg-[#0a0a0c] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-white/20 transition-all font-sans font-medium"
              />
            </div>

            {/* Composer Tab: Write Mode vs Preview Mode */}
            {composerTab === "write" ? (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono">
                  <span>RESPONSE MESSAGE BODY</span>
                  <span>{currentDraft.split(/\s+/).filter(Boolean).length} words</span>
                </div>
                <textarea
                  rows={9}
                  value={currentDraft}
                  onChange={(e) => handleDraftChange(e.target.value)}
                  placeholder={`Hi ${contact.name},\n\nThank you for contacting Introlic...`}
                  className="w-full bg-[#0a0a0c] border border-white/10 rounded-xl p-4 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-white/20 transition-all font-sans leading-relaxed resize-none"
                />
              </div>
            ) : (
              /* Live Preview of Rendered Dark Email */
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono">
                  <span>LIVE RECIPIENT EMAIL PREVIEW</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Introlic Branded Template
                  </span>
                </div>

                <div className="bg-[#050505] border border-white/10 rounded-xl p-6 space-y-4 text-xs font-sans text-gray-200">
                  <div className="flex justify-between items-center pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                      <img 
                        src="/introlic-white-icon.png" 
                        alt="Introlic Logo" 
                        className="w-7 h-7 object-contain opacity-95 shrink-0" 
                      />
                      <span className="font-extrabold text-sm tracking-tight text-white">INTROLiC</span>
                    </div>
                    <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest border border-white/10 px-2.5 py-1 rounded-full bg-white/[0.03]">
                      Official Response
                    </span>
                  </div>

                  <div className="space-y-2 text-gray-300 whitespace-pre-wrap leading-relaxed min-h-[80px]">
                    {currentDraft.trim() ? (
                      currentDraft
                    ) : (
                      <span className="text-gray-600 italic">No message drafted yet. Click a template above or switch to &apos;Write&apos; to compose.</span>
                    )}
                  </div>

                  <div className="p-3.5 bg-[#0d0d0d] border-l-2 border-white/20 rounded text-[11px] text-gray-400 space-y-1">
                    <span className="text-[9px] uppercase font-mono text-gray-500 block">
                      Previous Inquiry: {displaySubjectName}
                    </span>
                    <p className="italic text-gray-500 line-clamp-2">&quot;{decodeHtml(contact.message)}&quot;</p>
                  </div>

                  <div className="pt-3 border-t border-white/10 text-[11px] text-gray-400 space-y-0.5">
                    <p className="font-bold text-white text-xs">The Introlic Team</p>
                    <p className="text-[10px] text-gray-500">Foundational AI Research & Engineering</p>
                    <p className="text-[10px] text-gray-300 font-mono pt-1">https://introlic.in</p>
                  </div>

                  <div className="pt-2 text-center text-[10px] text-gray-600 border-t border-white/5 font-mono">
                    &copy; {new Date().getFullYear()} Introlic. All rights reserved. Sent via introlic.in
                  </div>
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/5">
              <div className="text-[10px] text-gray-500 flex items-center gap-1.5">
                <span>Sender: <strong className="text-gray-300 font-mono font-normal">Introlic &lt;team@introlic.in&gt;</strong></span>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleOpenEmailClient}
                  className="w-full sm:w-auto px-3.5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white rounded-xl text-xs font-semibold tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  title="Open in system mail app (mailto)"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Mailto App
                </button>

                <button
                  type="button"
                  disabled={isSending || !currentDraft.trim()}
                  onClick={handleSendViaResend}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-white hover:bg-gray-200 disabled:opacity-40 disabled:hover:bg-white text-black font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-white/5 active:scale-98"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Send Email (Resend)
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* History of Previous Dispatches */}
            {existingLog && (
              <div className="mt-4 p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs space-y-1">
                <div className="flex items-center justify-between text-emerald-400 font-bold text-[10px] uppercase font-mono">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="w-3 h-3" />
                    Last Response Dispatched
                  </span>
                  {existingLog.messageId && (
                    <span className="text-gray-600 font-normal">Resend ID: {existingLog.messageId.slice(0, 14)}...</span>
                  )}
                </div>
                <p className="text-gray-400 italic text-[11px] whitespace-pre-wrap">&quot;{existingLog.replyText}&quot;</p>
                <span className="text-[9px] text-gray-600 font-mono block">{formatDateTimeDeterministic(existingLog.sentAt)}</span>
              </div>
            )}
          </div>

        </div>

      </div>

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
