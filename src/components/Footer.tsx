"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Terminal, Home, Info, Briefcase, TestTube, Edit3, Mail,
  Cpu, Map, Database, Users, Newspaper,
  BookOpen, Code, Activity,
  FileText, Shield, Cookie, Flag
} from 'lucide-react';
const LiquidBackground = dynamic(() => import('./LiquidBackground'), { ssr: false });
import { COLORS } from '@/constants/branding';

interface SocialLinkItem {
  name: string;
  icon: React.ComponentType<{ color?: string }>;
  href: string;
  hoverColor: string;
}

// ── Custom Brand SVG Icons ──
const SocialLink = ({ s }: { s: SocialLinkItem }) => {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = s.icon;
  return (
    <a
      href={s.href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="text-gray-600 hover:scale-110 transition-all duration-300"
      title={s.name}
    >
      <Icon color={isHovered ? s.hoverColor : "currentColor"} />
    </a>
  );
};

const IconYouTube = ({ color = "currentColor", className = "w-4 h-4 transition-colors duration-300" }: { color?: string; className?: string }) => (
  <svg viewBox="0 0 24 24" fill={color} className={className}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);
const IconInstagram = ({ color = "currentColor", className = "w-4 h-4 transition-all duration-500" }: { color?: string; className?: string }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <defs>
      <linearGradient id="insta-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#f09433" />
        <stop offset="25%" stopColor="#e6683c" />
        <stop offset="50%" stopColor="#dc2743" />
        <stop offset="75%" stopColor="#cc2366" />
        <stop offset="100%" stopColor="#bc1888" />
      </linearGradient>
    </defs>
    <path
      fill={color === "#E4405F" ? "url(#insta-gradient)" : color}
      d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.058-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4.162 4.162 0 1 1 0-8.324 4.162 4.162 0 0 1 0 8.324zM18.406 4.164a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"
    />
  </svg>
);
const IconX = ({ color = "currentColor", className = "w-3.5 h-3.5 transition-colors duration-300" }: { color?: string; className?: string }) => (
  <svg viewBox="0 0 24 24" fill={color} className={className}>
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.931zm-1.294 19.497h2.039L6.486 3.24H4.298l13.309 17.41z" />
  </svg>
);
const IconLinkedIn = ({ color = "currentColor", className = "w-4 h-4 transition-colors duration-300" }: { color?: string; className?: string }) => (
  <svg viewBox="0 0 24 24" fill={color} className={className}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 .001-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);
const IconGitHub = ({ color = "currentColor", className = "w-4 h-4 transition-colors duration-300" }: { color?: string; className?: string }) => (
  <svg viewBox="0 0 24 24" fill={color} className={className}>
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.82 1.102.82 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);
const IconThreads = ({ color = "currentColor", className = "w-4 h-4 transition-colors duration-300" }: { color?: string; className?: string }) => (
  <svg viewBox="0 0 24 24" fill={color} className={className}>
    <path d="M14.88 11.53c0 .81-.07 1.41-.21 1.81-.14.4-.33.59-.57.59s-.42-.16-.54-.48c-.12-.32-.18-.79-.18-1.41 0-.79.05-1.39.15-1.81.1-.42.27-.63.5-.63.26 0 .46.2.6.61.14.41.25 1 .25 1.32zm6.25.43c0 2.24-.54 4.02-1.62 5.34-1.08 1.32-2.66 1.98-4.74 1.98-.8 0-1.53-.1-2.19-.3s-1.21-.49-1.65-.87a8.5 8.5 0 0 1-1.35-1.51l-1.35 1.41c-.49.52-1.08.93-1.77 1.23a5.55 5.55 0 0 1-2.28.45c-1.4 0-2.52-.41-3.36-1.23s-1.26-1.99-1.26-3.51c0-1.55.45-2.76 1.35-3.63s2.1-1.305 3.6-1.305c.82 0 1.56.16 2.22.48s1.23.82 1.71 1.41l1.11-1.17a10.65 10.65 0 0 1 2.58-1.86c1-.48 2.14-.72 3.42-.72.9 0 1.72.11 2.46.33s1.39.54 1.95.96c.56.42 1.01.96 1.35 1.62s.51 1.45.51 2.37zm-2.01-.15c0-.62-.1-1.16-.3-1.62s-.49-.84-.87-1.14c-.38-.3-.85-.53-1.41-.69s-1.21-.24-1.95-.24c-.96 0-1.84.18-2.64.54s-1.48.88-2.04 1.56c-.56.68-.98 1.52-1.26 2.52s-.42 2.1-.42 3.3.14 2.24.42 3.12.7 1.56 1.26 2.04c.56.48 1.29.72 2.19.72 1.56 0 2.7-.42 3.42-1.26s1.08-2.06 1.08-3.66c0-1.08-.21-1.9-.63-2.46s-1.05-.84-1.89-.84c-.42 0-.82.1-1.2.3s-.69.49-.93.87c-.24.38-.41.855-.51 1.425s-.15 1.23-.15 1.995c0 .72.06 1.32.18 1.8.12.48.33.84.63 1.08s.66.36 1.08.36.75-.11 1.02-.33c.27-.22.45-.58.54-1.08.09-.5.13-1.21.13-2.13 0-.15-.02-.3-.06-.45l-.42-.06-1.14-.3-.21-.06c-.46-.11-.87-.3-1.23-.57s-.63-.61-.81-1.02-.27-.89-.27-1.44c0-.85.16-1.58.48-2.19s.77-1.08 1.35-1.41 1.25-.495 2.01-.495c-.84-.13-1.52-.36-2.04-.69s-.91-.77-1.17-1.32c-.26-.55-.39-1.22-.39-2.01 0-1.03.29-1.88.87-2.55s1.42-1.005 2.52-1.005c1.1 0 1.94.335 2.52 1.005s.87 1.52.87 2.55zm-14.28 2.22c0 .91.24 1.63.72 2.16s1.17.795 2.07.795c.52 0 .97-.08 1.35-.24s.71-.38.99-.66l-2.01-2.1c-.48-.5-.87-.9-1.17-1.2s-.52-.52-.66-.66c-.34.1-.63.26-.87.48s-.42.52-.54.9zm1.38-2.22c-.37 0-.69.13-.96.39-.27.26-.45.65-.54 1.17-.09.52-.13 1.18-.13 1.98s.04 1.46.13 1.98c.09.52.27.91.54 1.17s.59.39.96.39.69-.13.96-.39.45-.65.54-1.17c.09-.52.13-1.18.13-1.98s-.04-1.46-.13-1.98-.27-.91-.54-1.17-.59-.39-.96-.39z" />
  </svg>
);

const socialLinks = [
  { name: 'X / Twitter', icon: IconX, href: 'https://x.com/introlics', hoverColor: '#ffffff' },
  { name: 'LinkedIn', icon: IconLinkedIn, href: 'https://www.linkedin.com/company/introlic', hoverColor: '#0077B5' },
  { name: 'GitHub', icon: IconGitHub, href: 'https://github.com/introlic', hoverColor: '#ffffff' },
  { name: 'YouTube', icon: IconYouTube, href: 'https://youtube.com/@introlics', hoverColor: '#FF0000' },
  { name: 'Instagram', icon: IconInstagram, href: 'https://www.instagram.com/introlics/', hoverColor: '#E4405F' },
  { name: 'Threads', icon: IconThreads, href: 'https://www.threads.net/@introlics', hoverColor: '#ffffff' },
];

const footerNav = [
  {
    label: 'NAVIGATE',
    links: [
      { name: 'Home', href: '/', icon: Home },
      { name: 'About', href: '/about', icon: Info },
      { name: 'Projects', href: '/projects', icon: Briefcase },
      { name: 'Research', href: '/research', icon: TestTube },
      { name: 'Blogs', href: '/blog', icon: Edit3 },
      { name: 'Contact', href: '/contact', icon: Mail },
    ]
  },
  {
    label: 'ECOSYSTEM',
    links: [
      { name: 'Capabilities', href: '/#capabilities', icon: Cpu },
      { name: 'Roadmap', href: '/#roadmap', icon: Map },
      { name: 'Introlic Engine', href: '/#anatomy', icon: Database },
      { name: 'About the Lab', href: '/about', icon: Users },
      { name: 'Press / Blog', href: '/#blog', icon: Newspaper },
    ]
  },
  {
    label: 'RESOURCES',
    links: [
      { name: 'Documentation', href: '/docs', icon: BookOpen },
      { name: 'API Reference', href: '/docs?tab=api-reference', icon: Code },
      { name: 'GitHub', href: 'https://github.com/introlic', icon: IconGitHub },
    ]
  },
  {
    label: 'COMPLIANCE',
    links: [
      { name: 'Terms of Service', href: '/terms', icon: FileText },
      { name: 'Privacy Policy', href: '/privacy', icon: Shield },
      { name: 'Cookie Policy', href: '/cookies', icon: Cookie },
      { name: 'Ethics Manifest', href: '/ethics', icon: Flag },
      { name: 'Sitemap Index', href: '/sitemap', icon: Map },
    ]
  },
];

export default function Footer() {
  const pathname = usePathname();

  if (pathname && (pathname.startsWith('/admin') || pathname.startsWith('/docs') || pathname.startsWith('/ppt'))) return null;

  return (
    <footer suppressHydrationWarning className="relative bg-[#000000] overflow-hidden">

      {/* ── INTERACTIVE LIQUID BACKGROUND ── */}
      <LiquidBackground />

      {/* ── SUPER-THIN LASER BORDER ── */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(to right, transparent, ${COLORS.brand.blue}4D, transparent)` }} />

      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 md:px-16 pt-14 md:pt-24 pb-10 sm:pb-12 relative z-10 pointer-events-none">


        {/* ── ASYMMETRICAL 12-COLUMN GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 mb-16 md:mb-24 pointer-events-none">

          {/* LEFT 4-COLS: The Foundation Core */}
          <div className="lg:col-span-4 flex flex-col justify-between items-center lg:items-start text-center lg:text-left pointer-events-none mb-16 lg:mb-0">
            <div className="pointer-events-auto flex flex-col items-center lg:items-start w-full">
              <div className="flex items-center gap-3 mb-6 md:mb-8 justify-center lg:justify-start">
                <Terminal className="w-4 h-4" style={{ color: COLORS.brand.blue }} />
                <span className="text-[10px] font-mono text-gray-500 tracking-[0.3em] uppercase">SYSTEM_INDEX_01</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tightest mb-4 md:mb-6">
                INTROLIC<span style={{ color: COLORS.brand.blue }}>.</span>
              </h2>
              <p className="text-gray-500 font-medium text-xs md:text-sm leading-[1.8] max-w-[320px] mb-8 md:mb-12 mx-auto lg:mx-0">
                Forging high-performance XT-Class architectures for the next production cycle. Sovereign Intelligence starts here.
              </p>
            </div>

            {/* ── Social Navigation Cluster ── */}
            <div className="flex flex-col gap-6 items-center lg:items-start pointer-events-auto w-full">
              <div className="flex items-center gap-3">
                <div className="w-1 h-px" style={{ backgroundColor: COLORS.brand.blue }} />
                <span className="text-[10px] font-mono text-gray-500 tracking-[0.3em] uppercase">COMM_CHANNELS</span>
              </div>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 md:gap-8">
                {socialLinks.map((s) => (
                  <SocialLink key={s.name} s={s} />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT 8-COLS: The Technical Index */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-x-2 sm:gap-x-4 md:gap-x-8 gap-y-8 md:gap-y-12 pointer-events-none">
            {footerNav.map((col) => (
              <div key={col.label} className="pointer-events-none">
                <div className="text-[9px] font-bold text-white uppercase tracking-[0.3em] font-mono mb-6 opacity-40 select-none">
                  {col.label}
                </div>
                <ul className="space-y-1 md:space-y-1.5 -ml-2 md:-ml-3 pointer-events-auto">
                  {col.links.map((link) => {
                    const LinkIcon = link.icon;
                    const isInternal = link.href.startsWith('/') && !link.href.includes('#') && !link.href.startsWith('http');
                    const linkProps = isInternal ? {} : { target: link.href.startsWith('http') ? '_blank' : undefined, rel: link.href.startsWith('http') ? 'noopener noreferrer' : undefined };

                    const linkContent = (
                      <>
                        <LinkIcon className="w-3 md:w-3.5 h-3 md:h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                        <span className="truncate">{link.name}</span>
                      </>
                    );

                    const linkClassName = "group flex items-center gap-2 md:gap-3 px-2 md:px-3 py-2 rounded-md text-gray-500 font-bold text-[12px] md:text-[13px] tracking-tight hover:bg-white hover:text-black hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all duration-300";

                    return (
                      <li key={link.name}>
                        {isInternal ? (
                          <Link
                            href={link.href}
                            className={linkClassName}
                          >
                            {linkContent}
                          </Link>
                        ) : (
                          <a
                            href={link.href}
                            className={linkClassName}
                            {...linkProps}
                          >
                            {linkContent}
                          </a>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

        </div>

        {/* ── BOTTOM STRIP: Copyright ── */}
        <div className="pt-8 border-t border-white/[0.05] flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden pointer-events-none">
          <div className="text-[8px] md:text-[9px] font-mono text-gray-700 tracking-[0.4em] uppercase text-center md:text-left select-none pointer-events-auto">
            © 2026 INTROLIC CORP // ALL PROTOCOLS RESERVED.
          </div>

        </div>

      </div>
    </footer>
  );
}
