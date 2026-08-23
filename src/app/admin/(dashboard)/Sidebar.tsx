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
  ChevronLeft
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
  const pathname = usePathname();

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
    <aside 
      className={`bg-[#09090b] border-r border-white/5 flex flex-col justify-between shrink-0 z-20 transition-all duration-300 ${
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
  );
}
