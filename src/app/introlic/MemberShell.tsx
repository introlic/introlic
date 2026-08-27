"use client";

import React, { useState } from "react";
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Radio,
  FolderKanban,
  FileCode2,
  Users2,
  User,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Menu,
  X,
  Sparkles,
  Terminal,
  Activity,
  ChevronRight,
  Globe
} from "lucide-react";

export interface MemberData {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  gender?: string | null;
  socialHandle?: string | null;
  createdAt?: string | null;
}

interface MemberShellProps {
  member: MemberData;
  children: React.ReactNode;
}

export default function MemberShell({ member, children }: MemberShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/";
    } catch (e) {
      console.error("Logout error:", e);
      window.location.href = "/";
    }
  };

  const navItems = [
    { label: "Mission Control", href: "/introlic", icon: LayoutDashboard },
    { label: "Announcements", href: "/introlic#announcements", icon: Radio },
    { label: "Projects Engine", href: "/introlic#projects", icon: FolderKanban },
    { label: "Sovereign Docs", href: "/introlic#resources", icon: FileCode2 },
    { label: "Team & Builders", href: "/introlic#team", icon: Users2 },
  ];

  const initials = member.name
    ? member.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : member.username.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col font-sans selection:bg-[#00a3ff]/30">
      {/* ── TOP HEADER / HUD BAR ── */}
      <header className="sticky top-0 z-40 bg-[#04060a]/90 backdrop-blur-xl border-b border-white/[0.06] px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-4">
          <NextLink href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:border-[#00a3ff]/50 group-hover:bg-[#00a3ff]/10 transition-all duration-300">
              <span className="font-black text-base text-white tracking-tighter group-hover:text-[#00a3ff] transition-colors">I</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-black text-sm text-white tracking-tight group-hover:text-[#00a3ff] transition-colors">INTROLIC</span>
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#00a3ff]/10 text-[#00a3ff] border border-[#00a3ff]/20">
                  PORTAL
                </span>
              </div>
              <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Sovereign Members Hub</span>
            </div>
          </NextLink>
        </div>

        {/* Center Live Badge (Desktop) */}
        <div className="hidden md:flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/[0.02] border border-white/[0.06]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-gray-300">
            SOVEREIGN GRID // ONLINE
          </span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <NextLink
            href="/"
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.02] border border-white/[0.08] hover:border-[#00a3ff]/40 hover:text-white text-xs font-mono font-medium text-gray-400 transition-all"
          >
            <Globe className="w-3.5 h-3.5 text-[#00a3ff]" />
            <span>Public Site</span>
          </NextLink>

          {/* User badge */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08]">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#00a3ff]/30 to-[#0055ff]/20 border border-[#00a3ff]/40 flex items-center justify-center text-[10px] font-black text-white shrink-0">
              {initials}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-white tracking-tight truncate max-w-[120px]">{member.name}</span>
              <span className="text-[9px] font-mono text-[#00a3ff] uppercase">{member.role}</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            title="Sign Out"
            className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.08] hover:border-red-500/40 hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-gray-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* ── MOBILE NAV DRAWER ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-[#06080d] border-b border-white/[0.08] px-6 py-5 space-y-3 z-30"
          >
            <div className="pb-3 border-b border-white/[0.06] flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white">{member.name}</p>
                <p className="text-[10px] font-mono text-[#00a3ff] uppercase">@{member.username} · {member.role}</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold">
                Active
              </span>
            </div>
            <div className="space-y-1">
              {navItems.map((item) => (
                <NextLink
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-gray-300 hover:bg-white/[0.05] hover:text-white transition-colors"
                >
                  <item.icon className="w-4 h-4 text-[#00a3ff]" />
                  <span>{item.label}</span>
                </NextLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {children}
      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/[0.05] bg-[#030407] py-6 px-4 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-gray-500">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00a3ff]" />
            <span>Introlic Sovereign Digital Systems // Member Node</span>
          </div>
          <div className="flex items-center gap-4">
            <NextLink href="/privacy" className="hover:text-gray-300 transition-colors">Privacy</NextLink>
            <NextLink href="/terms" className="hover:text-gray-300 transition-colors">Terms</NextLink>
            <NextLink href="/ethics" className="hover:text-gray-300 transition-colors">Ethics</NextLink>
          </div>
        </div>
      </footer>
    </div>
  );
}
