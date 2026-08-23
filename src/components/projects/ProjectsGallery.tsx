"use client";

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Gamepad2, FlaskConical, Globe, BookOpen, Cpu, Music,
  ArrowRight, Users, Clock, Tag, ChevronDown, ChevronUp,
  Search, SlidersHorizontal, LayoutGrid, AlignJustify,
  X, Check, ArrowUpDown, Link2
} from 'lucide-react';
import { XIcon, LinkedinIcon, GithubIcon, InstagramIcon, YouTubeIcon, DiscordIcon } from '@/components/SocialIcons';

// ─── DATA ────────────────────────────────────────────────────────────────────

type Status = 'Active' | 'Planning' | 'Recruiting' | 'Paused';

interface Project {
  id: string;
  icon: React.ElementType;
  category: string;
  title: string;
  topic: string;
  why: string;
  factors: string[];
  status: Status;
  tags: string[];
  openTo: string;
  started: string;
  author: string;
  authorRole?: string;
  readme?: string;
  postedDate: string;
  githubUrl?: string;
  demoUrl?: string;
  logoUrl?: string;
}

const STATUS_COLORS: Record<Status, { bg: string; text: string; dot: string }> = {
  Active:     { bg: 'rgba(0,163,255,0.08)',  text: '#00a3ff', dot: '#00a3ff' },
  Planning:   { bg: 'rgba(168,85,247,0.08)', text: '#a855f7', dot: '#a855f7' },
  Recruiting: { bg: 'rgba(16,185,129,0.08)', text: '#10b981', dot: '#10b981' },
  Paused:     { bg: 'rgba(107,114,128,0.08)',text: '#6b7280', dot: '#6b7280' },
};

const ALL_CATEGORIES = ['All', 'Game', 'Research', 'Tool', 'Community', 'Science', 'Creative', 'Infrastructure', 'AI / ML', 'Web3', 'Design', 'Education'];

const SORT_OPTIONS = [
  { value: 'newest',    label: 'Newest First' },
  { value: 'oldest',   label: 'Oldest First' },
  { value: 'title_az', label: 'Title A → Z' },
  { value: 'title_za', label: 'Title Z → A' },
];

const PROJECTS_PER_PAGE = 6;

const formatDateDeterministic = (dateStr: string) => {
  if (!dateStr) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [year, month, day] = dateStr.split('-');
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const monthIndex = parseInt(month, 10) - 1;
    const monthName = months[monthIndex] || month;
    return `${monthName} ${parseInt(day, 10)}, ${year}`;
  }
  return dateStr;
};

export function parseInlineMarkdown(text: string): React.ReactNode[] {
  const regex = /(!?\[[^\]]*\]\([^)]*\)|\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  const parts = text.split(regex);
  return parts.map((part, i) => {
    if (part.startsWith('![') && part.endsWith(')')) {
      const match = part.match(/!\[([^\]]*)\]\(([^)]*)\)/);
      if (match) {
        return <img key={i} src={match[2]} alt={match[1]} className="max-w-full rounded-xl my-2 border border-white/10" />;
      }
    }
    if (part.startsWith('[') && part.endsWith(')')) {
      const match = part.match(/\[([^\]]*)\]\(([^)]*)\)/);
      if (match) {
        return <a key={i} href={match[2]} target="_blank" rel="noopener noreferrer" className="text-[#00a3ff] hover:underline">{match[1]}</a>;
      }
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold text-white">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i} className="italic text-gray-300">{part.slice(1, -1)}</em>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} className="bg-white/10 px-1.5 py-0.5 rounded font-mono text-[11px] text-[#00a3ff]">{part.slice(1, -1)}</code>;
    }
    return part;
  });
}

export function parseMarkdown(md: string): React.ReactNode {
  if (!md) return null;
  const lines = md.split('\n');
  const elements: React.ReactNode[] = [];
  
  let inCodeBlock = false;
  let codeLang = '';
  let codeLines: string[] = [];
  
  let inList = false;
  let listType: 'ul' | 'ol' | null = null;
  let listItems: React.ReactNode[] = [];
  
  let inBlockquote = false;
  let blockquoteLines: string[] = [];

  let inTable = false;
  let tableHeaders: string[] = [];
  let tableRows: string[][] = [];

  const flushList = (key: number) => {
    if (listItems.length > 0) {
      if (listType === 'ul') {
        elements.push(<ul key={`ul-${key}`} className="list-disc pl-6 my-4 space-y-2 text-gray-300 text-base marker:text-[#00a3ff]/70">{...listItems}</ul>);
      } else {
        elements.push(<ol key={`ol-${key}`} className="list-decimal pl-6 my-4 space-y-2 text-gray-300 text-base marker:text-[#00a3ff]/70 font-mono">{...listItems}</ol>);
      }
      listItems = [];
      inList = false;
      listType = null;
    }
  };

  const flushBlockquote = (key: number) => {
    if (blockquoteLines.length > 0) {
      elements.push(
        <blockquote key={`bq-${key}`} className="border-l-4 border-[#00a3ff]/30 pl-5 py-2 my-5 bg-[#00a3ff]/[0.04] rounded-r-xl italic text-gray-300 text-base">
          {blockquoteLines.map((line, idx) => <p key={idx} className="my-1.5 leading-relaxed">{parseInlineMarkdown(line)}</p>)}
        </blockquote>
      );
      blockquoteLines = [];
      inBlockquote = false;
    }
  };

  const flushTable = (key: number) => {
    if (inTable) {
      elements.push(
        <div key={`table-wrapper-${key}`} className="overflow-x-auto my-4 border border-white/10 rounded-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                {tableHeaders.map((h, idx) => (
                  <th key={idx} className="p-3 font-bold text-white uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {tableRows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-white/[0.02] transition-colors">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="p-3 text-gray-300">{parseInlineMarkdown(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableHeaders = [];
      tableRows = [];
      inTable = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <div key={`code-${i}`} className="my-4 rounded-xl border border-white/10 overflow-hidden bg-[#0c0c0e]">
            {codeLang && (
              <div className="bg-white/[0.02] border-b border-white/5 px-4 py-1.5 flex items-center justify-between">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{codeLang}</span>
              </div>
            )}
            <pre className="p-4 overflow-x-auto text-[11px] font-mono text-gray-300 leading-relaxed custom-scrollbar">
              <code>{codeLines.join('\n')}</code>
            </pre>
          </div>
        );
        codeLines = [];
        inCodeBlock = false;
        codeLang = '';
      } else {
        flushList(i);
        flushBlockquote(i);
        flushTable(i);
        inCodeBlock = true;
        codeLang = trimmed.substring(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    if (trimmed.startsWith('>')) {
      flushList(i);
      flushTable(i);
      inBlockquote = true;
      blockquoteLines.push(line.substring(line.indexOf('>') + 1).trim());
      continue;
    } else if (inBlockquote && trimmed !== '') {
      blockquoteLines.push(trimmed);
      continue;
    } else if (inBlockquote) {
      flushBlockquote(i);
    }

    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      flushList(i);
      flushBlockquote(i);
      const cells = trimmed.split('|').map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
      const isSeparator = cells.every(c => c.replace(/-+/g, '') === '' || c.replace(/:/g, '') === '');
      if (isSeparator) {
        continue;
      }
      if (!inTable) {
        inTable = true;
        tableHeaders = cells;
      } else {
        tableRows.push(cells);
      }
      continue;
    } else if (inTable) {
      flushTable(i);
    }

    const ulMatch = line.match(/^(\s*)[-*+]\s+(.*)/);
    const olMatch = line.match(/^(\s*)\d+\.\s+(.*)/);

    if (ulMatch) {
      flushBlockquote(i);
      flushTable(i);
      if (!inList || listType !== 'ul') {
        flushList(i);
        inList = true;
        listType = 'ul';
      }
      listItems.push(<li key={`li-${i}`} className="my-1.5 leading-relaxed text-base">{parseInlineMarkdown(ulMatch[2])}</li>);
      continue;
    } else if (olMatch) {
      flushBlockquote(i);
      flushTable(i);
      if (!inList || listType !== 'ol') {
        flushList(i);
        inList = true;
        listType = 'ol';
      }
      listItems.push(<li key={`li-${i}`} className="my-1.5 leading-relaxed text-base">{parseInlineMarkdown(olMatch[2])}</li>);
      continue;
    } else if (trimmed === '') {
      flushList(i);
      continue;
    } else {
      flushList(i);
    }

    if (trimmed.startsWith('# ')) {
      elements.push(<h1 key={i} className="text-3xl sm:text-4xl font-black text-white border-b border-white/10 pb-3 mt-8 mb-5 tracking-tight">{parseInlineMarkdown(trimmed.substring(2))}</h1>);
      continue;
    }
    if (trimmed.startsWith('## ')) {
      elements.push(<h2 key={i} className="text-2xl sm:text-3xl font-bold text-white border-b border-white/[0.07] pb-2 mt-8 mb-4 tracking-tight">{parseInlineMarkdown(trimmed.substring(3))}</h2>);
      continue;
    }
    if (trimmed.startsWith('### ')) {
      elements.push(<h3 key={i} className="text-xl sm:text-2xl font-bold text-white mt-7 mb-3 tracking-tight">{parseInlineMarkdown(trimmed.substring(4))}</h3>);
      continue;
    }
    if (trimmed.startsWith('#### ')) {
      elements.push(<h4 key={i} className="text-lg font-bold text-white mt-5 mb-2">{parseInlineMarkdown(trimmed.substring(5))}</h4>);
      continue;
    }

    if (trimmed === '---' || trimmed === '***') {
      elements.push(<hr key={i} className="my-8 border-white/[0.08]" />);
      continue;
    }

    elements.push(<p key={i} className="my-3 text-gray-300 text-base leading-relaxed">{parseInlineMarkdown(line)}</p>);
  }

  flushList(lines.length);
  flushBlockquote(lines.length);
  flushTable(lines.length);

  return <div className="space-y-1 font-sans">{elements}</div>;
}

const projects: Project[] = [];


// ─── CUSTOM DROPDOWN ─────────────────────────────────────────────────────────

interface DropdownProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
  icon?: React.ElementType;
}

function CustomDropdown({ label, value, options, onChange, icon: Icon }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find(o => o.value === value)?.label ?? label;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#0a0a0a] border border-white/[0.08] hover:border-[#00a3ff]/30 transition-all duration-300 text-[10px] font-bold tracking-widest uppercase text-gray-400 hover:text-white"
        style={{ borderColor: open ? 'rgba(0,163,255,0.35)' : undefined }}
      >
        {Icon && <Icon className="w-3.5 h-3.5 text-[#00a3ff]/60" />}
        <span className={value && !value.startsWith('All') ? 'text-white' : ''}>{selected}</span>
        <ChevronDown className={`w-3 h-3 ml-1 transition-transform duration-300 ${open ? 'rotate-180 text-[#00a3ff]' : 'text-gray-600'}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 z-50 bg-[#080808] border border-white/[0.08] rounded-xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)] min-w-[180px]"
          >
            {options.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className="w-full px-4 py-2.5 text-left text-[10px] font-bold tracking-widest uppercase flex items-center justify-between gap-3 hover:bg-white/[0.04] transition-colors"
                style={{ color: value === opt.value ? '#00a3ff' : '#6b7280' }}
              >
                {opt.label}
                {value === opt.value && <Check className="w-3 h-3 text-[#00a3ff]" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── PROJECT CARD (GRID) ──────────────────────────────────────────────────────

function ProjectCardGrid({ project, index }: { project: Project; index: number }) {
  const Icon = project.icon;
  const s = STATUS_COLORS[project.status];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="group relative bg-[#050505] border border-white/[0.05] rounded-[24px] overflow-hidden hover:border-[#00a3ff]/20 transition-all duration-500 flex flex-col cursor-pointer"
    >
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#00a3ff]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

      {/* Prefetching Link Overlay covering entire card */}
      <Link href={`/projects/${project.id}`} className="absolute inset-0 z-10" aria-label={`Read details of ${project.title}`} />

      <div className="p-8 flex flex-col flex-1 relative z-0">
        <div className="flex items-start justify-between gap-4 mb-7">
          <div className="flex items-center gap-4">
            <div className={`bg-white/[0.03] border border-white/[0.06] rounded-xl group-hover:bg-[#00a3ff]/10 group-hover:border-[#00a3ff]/20 transition-all duration-500 flex items-center justify-center overflow-hidden flex-shrink-0 ${
              project.logoUrl ? 'w-12 h-12 p-0' : 'p-3.5'
            }`}>
              {project.logoUrl ? (
                <img src={project.logoUrl} alt={project.title} className="w-full h-full object-cover" />
              ) : (
                <Icon className="w-6 h-6 text-gray-500 group-hover:text-[#00a3ff] transition-colors duration-500" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-mono tracking-[0.35em] uppercase text-gray-600">{project.category} / {project.id}</span>
              <span className="text-[9px] font-mono tracking-widest uppercase text-gray-700 mt-0.5">by {project.author} {project.authorRole ? `(${project.authorRole})` : ''}</span>
            </div>
          </div>
          <span className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black tracking-[0.25em] uppercase" style={{ backgroundColor: s.bg, color: s.text }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: s.dot }} />
            {project.status}
          </span>
        </div>

        <div className="block group">
          <h3 className="text-2xl font-black text-white tracking-tighter mb-3 group-hover:text-[#00a3ff] transition-colors duration-500">{project.title}</h3>
        </div>
        <p className="text-gray-400 text-sm font-medium leading-relaxed mb-5">{project.topic}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map(tag => (
            <span key={tag} className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-white/[0.06] bg-black text-gray-600">
              <Tag className="w-2.5 h-2.5" />{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 mb-2">
          <Users className="w-3.5 h-3.5 text-[#00a3ff]/60 flex-shrink-0" />
          <span className="text-[9px] font-mono tracking-widest uppercase text-gray-600">Open To: </span>
          <span className="text-[9px] font-mono uppercase tracking-wider text-gray-400">{project.openTo}</span>
        </div>
        {project.started && (
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-3.5 h-3.5 text-[#00a3ff]/60 flex-shrink-0" />
            <span className="text-[9px] font-mono tracking-widest uppercase text-gray-600">Started: </span>
            <span className="text-[9px] font-mono uppercase tracking-wider text-gray-400">{formatDateDeterministic(project.started)}</span>
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-white/[0.05] flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-600 group-hover:text-[#00a3ff] transition-colors">
            <ArrowRight className="w-3.5 h-3.5 text-[#00a3ff]" />
            Read details
          </div>
          {/* Join button stays interactive relative z-20 */}
          <div className="relative z-20">
            <Link href={`/contact?subject=PROJECT_COLLAB&project=${project.id}`} className="group/btn flex items-center gap-2 px-4 py-2 rounded-full border border-[#00a3ff]/20 hover:bg-[#00a3ff]/10 hover:border-[#00a3ff]/40 transition-all duration-300">
              <Users className="w-3 h-3 text-[#00a3ff] opacity-70 group-hover/btn:opacity-100" />
              <span className="text-[9px] font-black tracking-[0.3em] uppercase text-[#00a3ff] opacity-70 group-hover/btn:opacity-100">Join</span>
              <ArrowRight className="w-3 h-3 text-[#00a3ff] opacity-0 group-hover/btn:opacity-100 -translate-x-1 group-hover/btn:translate-x-0 transition-all duration-300" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── PROJECT ROW (LIST) ───────────────────────────────────────────────────────

function ProjectCardList({ project, index }: { project: Project; index: number }) {
  const Icon = project.icon;
  const s = STATUS_COLORS[project.status];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="group relative bg-[#050505] border border-white/[0.05] rounded-2xl overflow-hidden hover:border-[#00a3ff]/20 transition-all duration-500 cursor-pointer"
    >
      <div className="absolute left-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-[#00a3ff]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

      {/* Prefetching Link Overlay covering entire row */}
      <Link href={`/projects/${project.id}`} className="absolute inset-0 z-10" aria-label={`Read details of ${project.title}`} />

      {/* Row header */}
      <div className="flex items-center gap-6 px-8 py-6 relative z-0">
        <div className={`bg-white/[0.03] border border-white/[0.06] rounded-xl group-hover:bg-[#00a3ff]/10 group-hover:border-[#00a3ff]/20 transition-all duration-500 flex-shrink-0 flex items-center justify-center overflow-hidden ${
          project.logoUrl ? 'w-11 h-11 p-0' : 'p-3'
        }`}>
          {project.logoUrl ? (
            <img src={project.logoUrl} alt={project.title} className="w-full h-full object-cover" />
          ) : (
            <Icon className="w-5 h-5 text-gray-500 group-hover:text-[#00a3ff] transition-colors" />
          )}
        </div>

        <div className="flex-1 min-w-0 text-left">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-[9px] font-mono tracking-[0.35em] uppercase text-gray-600">{project.category}</span>
            <span className="text-gray-700">·</span>
            <span className="text-[9px] font-mono tracking-widest uppercase text-gray-700">by {project.author} {project.authorRole ? `(${project.authorRole})` : ''}</span>
          </div>
          <h3 className="text-lg font-black text-white tracking-tight group-hover:text-[#00a3ff] transition-colors duration-500 truncate">{project.title}</h3>
          <p className="text-gray-500 text-sm font-medium leading-snug mt-1 line-clamp-1">{project.topic}</p>
        </div>

        {project.started && (
          <div className="hidden lg:flex flex-col text-left shrink-0 min-w-[120px]">
            <span className="text-[8px] font-mono uppercase text-gray-600 tracking-wider">Started</span>
            <span className="text-[10px] text-gray-400 font-mono mt-0.5">{formatDateDeterministic(project.started)}</span>
          </div>
        )}

        <div className="hidden md:flex flex-wrap gap-1.5 max-w-[200px] flex-shrink-0">
          {project.tags.slice(0, 2).map(tag => (
            <span key={tag} className="text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border border-white/[0.06] bg-black text-gray-600">{tag}</span>
          ))}
        </div>

        <span className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black tracking-[0.25em] uppercase hidden sm:flex" style={{ backgroundColor: s.bg, color: s.text }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: s.dot }} />
          {project.status}
        </span>

        <ArrowRight className="w-4 h-4 text-gray-600 flex-shrink-0 transition-transform group-hover:translate-x-1" />
      </div>
    </motion.div>
  );
}

// ─── PAGINATION ───────────────────────────────────────────────────────────────

function Pagination({ current, total, onChange }: { current: number; total: number; onChange: (p: number) => void }) {
  if (total <= 1) return null;

  const pages = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-14">
      <button
        onClick={() => onChange(Math.max(1, current - 1))}
        disabled={current === 1}
        className="w-9 h-9 rounded-xl border border-white/[0.06] flex items-center justify-center text-gray-600 hover:text-white hover:border-[#00a3ff]/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronDown className="w-3.5 h-3.5 rotate-90" />
      </button>

      {pages.map(p => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className="w-9 h-9 rounded-xl border text-[11px] font-black tracking-widest transition-all duration-300"
          style={{
            borderColor: p === current ? '#00a3ff' : 'rgba(255,255,255,0.06)',
            backgroundColor: p === current ? 'rgba(0,163,255,0.12)' : 'transparent',
            color: p === current ? '#00a3ff' : '#6b7280',
            boxShadow: p === current ? '0 0 20px rgba(0,163,255,0.2)' : 'none',
          }}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onChange(Math.min(total, current + 1))}
        disabled={current === total}
        className="w-9 h-9 rounded-xl border border-white/[0.06] flex items-center justify-center text-gray-600 hover:text-white hover:border-[#00a3ff]/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
      </button>
    </div>
  );
}

// ─── GALLERY ─────────────────────────────────────────────────────────────────

export default function ProjectsGallery() {
  const router = useRouter();

  const [search, setSearch]           = useState('');
  const [activeCategory, setCategory] = useState('All');
  const [activeAuthor, setAuthor]     = useState('All Authors');
  const [sortBy, setSort]             = useState('newest');
  const [viewMode, setViewMode]       = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);

  const [allProjectsList, setAllProjectsList] = useState<Project[]>([]);
  const [authorsList, setAuthorsList] = useState<any[]>([]);
  const [categoriesList, setCategoriesList] = useState<string[]>(ALL_CATEGORIES);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch("/api/categories?type=project")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setCategoriesList(['All', ...data.map(c => c.name)]);
        }
      })
      .catch(err => console.error("Error loading categories:", err));

    fetch("/api/authors")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setAuthorsList(data);
        }
      })
      .catch(err => console.error("Error loading authors:", err));

    fetch("/api/projects")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const mapped = data.map((p: any) => ({
            ...p,
            // Normalize: the DB returns createdAt, not postedDate
            postedDate: p.postedDate || p.createdAt || new Date().toISOString(),
            icon: p.category === 'Game' ? Gamepad2 :
                  p.category === 'Research' ? FlaskConical :
                  p.category === 'Tool' ? Globe :
                  p.category === 'Community' ? Users :
                  p.category === 'Science' ? Cpu :
                  p.category === 'AI / ML' ? Cpu :
                  p.category === 'Web3' ? Globe :
                  p.category === 'Infrastructure' ? Cpu :
                  p.category === 'Education' ? BookOpen :
                  p.category === 'Design' ? Gamepad2 : Music,
          }));
          setAllProjectsList(mapped);
        }
      })
      .catch(err => console.error("Error loading projects:", err))
      .finally(() => setIsLoading(false));
  }, []);

  const authorOptions = useMemo(() => {
    const dbAuthorNames = authorsList.map(a => a.name);
    const projectAuthorNames = allProjectsList.map(p => p.author);
    const combined = Array.from(new Set([...dbAuthorNames, ...projectAuthorNames]));
    combined.sort((a, b) => a.localeCompare(b));
    return [{ value: 'All Authors', label: 'All Authors' }, ...combined.map(name => ({ value: name, label: name }))];
  }, [authorsList, allProjectsList]);

  const sortOptions   = SORT_OPTIONS;

  // Reset page on any filter/search change
  const resetPage = () => setCurrentPage(1);

  const filtered = useMemo(() => {
    let list = [...allProjectsList];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.topic.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q)) ||
        p.author.toLowerCase().includes(q)
      );
    }

    // Category
    if (activeCategory !== 'All') list = list.filter(p => p.category === activeCategory);

    // Author
    if (activeAuthor !== 'All Authors') list = list.filter(p => p.author === activeAuthor);

    // Sort
    list = list.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
      if (sortBy === 'oldest') return new Date(a.postedDate).getTime() - new Date(b.postedDate).getTime();
      if (sortBy === 'title_az') return a.title.localeCompare(b.title);
      if (sortBy === 'title_za') return b.title.localeCompare(a.title);
      return 0;
    });

    return list;
  }, [allProjectsList, search, activeCategory, activeAuthor, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PROJECTS_PER_PAGE));
  const paginated  = filtered.slice((currentPage - 1) * PROJECTS_PER_PAGE, currentPage * PROJECTS_PER_PAGE);

  const hasFilters = search || activeCategory !== 'All' || activeAuthor !== 'All Authors';

  const clearAll = () => {
    setSearch('');
    setCategory('All');
    setAuthor('All Authors');
    setSort('newest');
    setCurrentPage(1);
  };

  if (!mounted) {
    return (
      <section className="relative bg-[#020202] pt-28 pb-32 md:pt-36 md:pb-44">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 flex justify-center items-center py-24">
          <div className="w-10 h-10 border-2 border-[#00a3ff]/30 border-t-[#00a3ff] rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-[#020202] pt-28 pb-32 md:pt-36 md:pb-44">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12">

        {/* ── Section header ── */}
        <div className="mb-14 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#00a3ff]/10 rounded-lg">
                <Clock className="w-4 h-4 text-[#00a3ff]" />
              </div>
              <span className="text-[#00a3ff] font-black tracking-[0.3em] uppercase text-xs">Projects & Initiatives</span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tightest leading-[0.88]">
              Our<br /><span className="italic text-gray-500">Projects.</span>
            </motion.h1>
          </div>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="lg:max-w-md text-base sm:text-lg text-gray-400 font-medium leading-relaxed border-l-2 border-white/10 pl-6">
            Explore our active open-source repositories, model architectures, developer tools, and engineering initiatives.
          </motion.p>
        </div>

        {/* ── Controls bar ── */}
        <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col gap-4 mb-10">

          {/* Row 1: Search + right controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600" />
              <input
                type="text"
                value={search}
                onChange={e => { setSearch(e.target.value); resetPage(); }}
                placeholder="Search projects, tags, authors..."
                className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-xl py-2.5 pl-10 pr-9 text-[11px] font-medium text-white placeholder-gray-600 focus:outline-none focus:border-[#00a3ff]/40 transition-all"
              />
              {search && (
                <button onClick={() => { setSearch(''); resetPage(); }} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-3.5 h-3.5 text-gray-600 hover:text-white transition-colors" />
                </button>
              )}
            </div>

            {/* Dropdowns */}
            <div className="flex items-center gap-2 flex-wrap">
              <CustomDropdown
                label="All Authors"
                value={activeAuthor}
                options={authorOptions}
                onChange={v => { setAuthor(v); resetPage(); }}
                icon={Users}
              />
              <CustomDropdown
                label="Sort By"
                value={sortBy}
                options={sortOptions}
                onChange={v => { setSort(v); resetPage(); }}
                icon={ArrowUpDown}
              />

              {/* View toggle */}
              <div className="flex items-center border border-white/[0.08] rounded-xl overflow-hidden bg-[#0a0a0a]">
                <button onClick={() => setViewMode('grid')} className="p-2.5 transition-colors" style={{ color: viewMode === 'grid' ? '#00a3ff' : '#4b5563', backgroundColor: viewMode === 'grid' ? 'rgba(0,163,255,0.1)' : 'transparent' }}>
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setViewMode('list')} className="p-2.5 transition-colors" style={{ color: viewMode === 'list' ? '#00a3ff' : '#4b5563', backgroundColor: viewMode === 'list' ? 'rgba(0,163,255,0.1)' : 'transparent' }}>
                  <AlignJustify className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Filters icon badge */}
              {hasFilters && (
                <button onClick={clearAll} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#00a3ff]/10 border border-[#00a3ff]/20 text-[9px] font-black tracking-widest uppercase text-[#00a3ff] hover:bg-[#00a3ff]/20 transition-all">
                  <SlidersHorizontal className="w-3 h-3" />
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Row 2: Category pills */}
          <div className="flex flex-wrap gap-2">
            {categoriesList.map(cat => (
              <button
                key={cat}
                onClick={() => { setCategory(cat); resetPage(); }}
                className="px-3 md:px-4 py-1.5 rounded-full text-[9px] font-black tracking-[0.3em] uppercase transition-all duration-300 border"
                style={{
                  backgroundColor: activeCategory === cat ? '#00a3ff' : 'transparent',
                  color: activeCategory === cat ? '#000' : '#6b7280',
                  borderColor: activeCategory === cat ? '#00a3ff' : 'rgba(255,255,255,0.08)',
                  boxShadow: activeCategory === cat ? '0 0 16px rgba(0,163,255,0.25)' : 'none',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── Results meta ── */}
        <div className="flex items-center gap-3 mb-8">
          <span className="text-[10px] font-mono tracking-widest uppercase text-gray-700">
            {filtered.length} project{filtered.length !== 1 ? 's' : ''}
            {activeCategory !== 'All' ? ` · ${activeCategory}` : ''}
            {activeAuthor !== 'All Authors' ? ` · ${activeAuthor}` : ''}
            {search ? ` matching "${search}"` : ''}
          </span>
          <div className="flex-1 h-px bg-white/[0.04]" />
          <span className="text-[10px] font-mono tracking-widest uppercase text-gray-700">
            Page {currentPage} / {totalPages}
          </span>
        </div>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-24">
              <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-2 border-[#00a3ff]/30 border-t-[#00a3ff] rounded-full animate-spin" />
                <p className="text-gray-600 text-sm font-medium">Loading projects from network...</p>
              </div>
            </motion.div>
          ) : filtered.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-24">
              <p className="text-gray-600 text-lg font-medium mb-3">No projects found.</p>
              <button onClick={clearAll} className="text-[#00a3ff] text-sm font-bold hover:underline">Clear all filters</button>
            </motion.div>
          ) : viewMode === 'grid' ? (
            <motion.div key={`grid-${currentPage}-${activeCategory}-${activeAuthor}-${sortBy}-${search}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginated.map((p, i) => <ProjectCardGrid key={p.id} project={p} index={i} />)}
            </motion.div>
          ) : (
            <motion.div key={`list-${currentPage}-${activeCategory}-${activeAuthor}-${sortBy}-${search}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="flex flex-col gap-3">
              {paginated.map((p, i) => <ProjectCardList key={p.id} project={p} index={i} />)}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Pagination ── */}
        <Pagination
          current={currentPage}
          total={totalPages}
          onChange={p => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        />

        {/* ── Bottom CTA ── */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          className="mt-12 pt-10 md:mt-20 md:pt-16 border-t border-white/[0.05] flex flex-col md:flex-row items-start md:items-center justify-between gap-5 md:gap-8"
        >
          <div>
            <p className="text-xl md:text-3xl font-black text-white tracking-tight mb-1.5">Have a project idea?</p>
            <p className="text-gray-500 font-medium text-sm sm:text-base md:text-lg">We share and collaborate openly. Submit a project to the board.</p>
          </div>
          <button
            onClick={() => router.push('/contact?subject=PROJECT_IDEA')}
            className="group flex items-center gap-3 px-6 py-3 md:px-8 md:py-4 rounded-full bg-[#00a3ff] hover:bg-[#0090e0] text-black font-black text-xs md:text-sm tracking-widest uppercase transition-all duration-300 shadow-[0_0_30px_rgba(0,163,255,0.25)] hover:shadow-[0_0_50px_rgba(0,163,255,0.4)] whitespace-nowrap mt-2 md:mt-0"
          >
            Submit a Project
            <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>

      </div>
    </section>
  );
}
