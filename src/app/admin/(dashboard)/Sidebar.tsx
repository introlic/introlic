"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard,
  MessageSquare,
  Cpu,
  BookOpen,
  FileText,
  Users,
  UserCheck,
  ShieldAlert,
  Activity,
  ChevronRight,
  ChevronLeft,
  Menu,
  X
} from "lucide-react";
import LogoutButton from "../LogoutButton";

interface SidebarProps {
  currentAdmin: {
    name: string | null;
    username: string;
    email: string;
    lastLoginIp: string | null;
    role: string;
  };
}

export default function Sidebar({ currentAdmin }: SidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on page navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const response = await originalFetch(...args);
      if (response.status === 401) {
        window.location.href = "/admin/login";
      }
      return response;
    };
    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const getActiveTab = () => {
    if (pathname.includes("/messages") || pathname.includes("/transmissions")) return "messages";
    if (pathname.includes("/projects")) return "projects";
    if (pathname.includes("/users") || pathname.includes("/recruits")) return "users";
    if (pathname.includes("/authors")) return "authors";
    if (pathname.includes("/research")) return "research";
    if (pathname.includes("/blog")) return "blog";
    if (pathname.includes("/security-logs")) return "security-logs";
    if (pathname.includes("/visitor-logs")) return "visitor-logs";
    return "overview";
  };

  const activeTab = getActiveTab();

  const getActivePageName = () => {
    switch (activeTab) {
      case "overview": return "Overview";
      case "messages": return "Messages";
      case "projects": return "Projects";
      case "research": return "Research";
      case "blog": return "Blog";
      case "users": return "Users";
      case "authors": return "Authors";
      case "security-logs": return "Security";
      case "visitor-logs": return "Analytics";
      default: return "Portal";
    }
  };

  const coreNavItems = [
    { id: "overview", label: "Overview", href: "/admin", icon: LayoutDashboard },
    { id: "messages", label: "Messages", href: "/admin/messages", icon: MessageSquare },
    { id: "projects", label: "Projects", href: "/admin/projects", icon: Cpu },
    { id: "research", label: "Research", href: "/admin/research", icon: BookOpen },
    { id: "blog", label: "Blog Posts", href: "/admin/blog", icon: FileText },
  ];

  const managementNavItems = [
    { id: "users", label: "Users", href: "/admin/users", icon: Users },
    { id: "authors", label: "Authors", href: "/admin/authors", icon: UserCheck },
    { id: "security-logs", label: "Security Logs", href: "/admin/security-logs", icon: ShieldAlert },
    { id: "visitor-logs", label: "Visitor Analytics", href: "/admin/visitor-logs", icon: Activity },
  ];

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* ─── 1. MOBILE TOP NAVIGATION BAR (lg:hidden) ────────────────────── */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-[#070709]/95 backdrop-blur-xl border-b border-white/[0.08] z-40 px-4 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center shrink-0 group-hover:border-[#00a3ff]/40 transition-colors">
            <img 
              src="/icon.png" 
              alt="Introlic" 
              className="w-5 h-5 object-contain filter brightness-0 invert opacity-95" 
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black tracking-wider text-white uppercase">Introlic</span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#00a3ff]/10 text-[#00a3ff] border border-[#00a3ff]/20 uppercase">
              {getActivePageName()}
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-mono font-bold text-gray-300">
            {currentAdmin.username.substring(0, 2).toUpperCase()}
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-white/[0.04] border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4 text-red-400" /> : <Menu className="w-4 h-4 text-[#00a3ff]" />}
          </button>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* ─── 2. MOBILE DRAWER OVERLAY (lg:hidden) ────────────────────────── */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-fadeIn"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Sidebar */}
          <div className="relative w-[82%] max-w-xs bg-[#09090b] border-r border-white/10 h-full flex flex-col justify-between p-4 shadow-2xl z-10 animate-slideRight">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center shrink-0">
                    <img 
                      src="/icon.png" 
                      alt="Introlic" 
                      className="w-5 h-5 object-contain filter brightness-0 invert opacity-95" 
                    />
                  </div>
                  <div>
                    <h2 className="text-sm font-black tracking-wider text-white uppercase">Introlic</h2>
                    <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block mt-0.5">Control Center</span>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 border border-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Navigation list */}
              <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-220px)] pr-1 custom-scrollbar">
                {/* Platform */}
                <div>
                  <span className="px-3 text-[9px] font-bold text-gray-500 tracking-widest uppercase block mb-2 font-mono">
                    Platform
                  </span>
                  <div className="space-y-1">
                    {coreNavItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <Link 
                          key={item.id} 
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                            isActive 
                              ? "bg-[#00a3ff]/15 text-white font-bold border border-[#00a3ff]/30 shadow-[0_0_15px_rgba(0,163,255,0.15)]" 
                              : "text-gray-400 hover:text-white hover:bg-white/[0.03]"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#00a3ff]" : "text-gray-400"}`} />
                            <span>{item.label}</span>
                          </div>
                          {isActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00a3ff] shadow-[0_0_8px_#00a3ff]" />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Management & Logs */}
                <div>
                  <span className="px-3 text-[9px] font-bold text-gray-500 tracking-widest uppercase block mb-2 font-mono">
                    Management & Logs
                  </span>
                  <div className="space-y-1">
                    {managementNavItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <Link 
                          key={item.id} 
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                            isActive 
                              ? "bg-[#00a3ff]/15 text-white font-bold border border-[#00a3ff]/30 shadow-[0_0_15px_rgba(0,163,255,0.15)]" 
                              : "text-gray-400 hover:text-white hover:bg-white/[0.03]"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#00a3ff]" : "text-gray-400"}`} />
                            <span>{item.label}</span>
                          </div>
                          {isActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00a3ff] shadow-[0_0_8px_#00a3ff]" />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Drawer Footer */}
            <div className="pt-3 border-t border-white/10">
              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-[#00a3ff]/10 border border-[#00a3ff]/20 flex items-center justify-center text-xs font-mono font-bold text-[#00a3ff] shrink-0">
                    {currentAdmin.username.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-white truncate leading-tight">
                      {currentAdmin.name || currentAdmin.username}
                    </p>
                    <p className="text-[9px] font-mono text-gray-500 uppercase tracking-wider mt-0.5">
                      {currentAdmin.role}
                    </p>
                  </div>
                </div>
                <LogoutButton compact={true} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* ─── 3. DESKTOP SIDEBAR (hidden lg:flex) ─────────────────────────── */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <aside 
        className={`hidden lg:flex bg-[#09090b] border-r border-white/5 flex-col justify-between shrink-0 z-20 transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className={`h-16 flex items-center border-b border-white/[0.08] bg-[#070709] ${sidebarOpen ? "px-5 justify-between" : "px-2 justify-center"}`}>
            {sidebarOpen ? (
              <div className="flex items-center justify-between w-full">
                <Link href="/admin" className="flex items-center gap-3.5 group">
                  <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center shrink-0 group-hover:border-[#00a3ff]/40 group-hover:bg-[#00a3ff]/5 transition-all">
                    <img 
                      src="/icon.png" 
                      alt="Introlic Logo" 
                      className="w-6 h-6 object-contain filter brightness-0 invert opacity-95 shrink-0 group-hover:scale-105 transition-transform" 
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h2 className="text-sm font-black tracking-wider text-white uppercase leading-none">Introlic</h2>
                    <span className="text-[9px] font-mono font-bold text-gray-500 tracking-widest uppercase mt-1">Admin Portal</span>
                  </div>
                </Link>
                
                <button 
                  onClick={() => setSidebarOpen(false)}
                  className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all cursor-pointer"
                  title="Collapse Sidebar"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setSidebarOpen(true)}
                className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center hover:bg-white/5 hover:border-white/20 transition-all cursor-pointer group"
                title="Expand Sidebar"
              >
                <img 
                  src="/icon.png" 
                  alt="Introlic Logo" 
                  className="w-6 h-6 object-contain filter brightness-0 invert opacity-95 shrink-0 group-hover:scale-110 transition-transform" 
                />
              </button>
            )}
          </div>

          {/* Navigation Items */}
          <div className="px-3 py-5 space-y-6">
            {/* Section: Platform */}
            <div>
              {sidebarOpen && (
                <span className="px-4 text-[9px] font-bold text-gray-600 tracking-widest uppercase block mb-3 font-mono">
                  Platform
                </span>
              )}
              
              <div className="space-y-1">
                {coreNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <Link key={item.id} href={item.href} className="relative flex items-center">
                      {isActive && (
                        <div className="absolute left-1 w-1 h-5 bg-[#00a3ff] rounded-full shadow-[0_0_10px_rgba(0,163,255,0.8)]" />
                      )}
                      <div className={`w-full flex items-center gap-3 py-2.5 rounded-xl transition-all text-xs font-semibold tracking-wide cursor-pointer ${
                        sidebarOpen ? "pl-6 text-left" : "justify-center px-0"
                      } ${
                        isActive ? "bg-white/[0.06] text-white font-bold" : "text-gray-400 hover:text-white hover:bg-white/[0.02]"
                      }`} title={!sidebarOpen ? item.label : undefined}>
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#00a3ff]" : "text-gray-400"}`} />
                        {sidebarOpen && <span>{item.label}</span>}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Section: Management & Logs */}
            <div>
              {sidebarOpen && (
                <span className="px-4 text-[9px] font-bold text-gray-600 tracking-widest uppercase block mb-3 font-mono">
                  Management & Logs
                </span>
              )}
              
              <div className="space-y-1">
                {managementNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <Link key={item.id} href={item.href} className="relative flex items-center">
                      {isActive && (
                        <div className="absolute left-0 w-1 h-5 bg-[#00a3ff] rounded-r-full" />
                      )}
                      <div className={`w-full flex items-center gap-3 py-2.5 rounded-xl transition-all text-xs font-semibold tracking-wide cursor-pointer ${
                        sidebarOpen ? "pl-6 text-left" : "justify-center px-0"
                      } ${
                        isActive ? "bg-white/[0.04] text-white font-bold" : "text-gray-400 hover:text-white hover:bg-white/[0.02]"
                      }`} title={!sidebarOpen ? item.label : undefined}>
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#00a3ff]" : "text-gray-400"}`} />
                        {sidebarOpen && <span>{item.label}</span>}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Admin Profile Footer */}
        <div className="p-3 border-t border-white/5">
          {sidebarOpen ? (
            <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between gap-3 w-full">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs font-mono font-bold text-gray-300 shrink-0">
                  {currentAdmin.username.substring(0, 2).toUpperCase()}
                </div>
                <div className="truncate">
                  <p className="text-xs font-medium text-white truncate leading-tight">
                    {currentAdmin.name || currentAdmin.username}
                  </p>
                  <p className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mt-0.5">
                    {currentAdmin.role}
                  </p>
                </div>
              </div>
              <LogoutButton compact={true} />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-1">
              <div 
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs font-mono font-bold text-gray-300 shrink-0 cursor-pointer"
                title={`${currentAdmin.name || currentAdmin.username} (${currentAdmin.role})`}
                onClick={() => setSidebarOpen(true)}
              >
                {currentAdmin.username.substring(0, 2).toUpperCase()}
              </div>
              <LogoutButton compact={true} />
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
