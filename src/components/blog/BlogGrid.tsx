"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Search, X, SlidersHorizontal, ChevronDown, Clock, TrendingUp, CalendarDays, Users, ArrowUpDown, Check } from 'lucide-react';
import Link from 'next/link';
import NextImage from 'next/image';
import { allPosts, BlogPost, categories, CoverIntrolicDWaves, CoverIntrolicKMemory, CoverXTStrategy, CoverEdgeInference, CoverKernelFusion } from './BlogData';

// Sort options config
const SORT_OPTIONS = [
  { id: 'recent',   label: 'Recent',   icon: CalendarDays },
  { id: 'oldest',   label: 'Oldest',   icon: Clock },
  { id: 'popular',  label: 'Popular',  icon: TrendingUp },
] as const;
type SortId = typeof SORT_OPTIONS[number]['id'];

// Parse read-time minutes from "N min read" string
function parseReadTime(rt: string): number {
  const m = rt.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
}

// Parse month/year date string to a sortable number
function parseDateScore(d: string): number {
  const months: Record<string, number> = {
    Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
    Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12,
  };
  const parts = d.trim().split(' ');
  const mon = months[parts[0]] ?? 0;
  const yr = parseInt(parts[1] ?? '2024', 10);
  return yr * 100 + mon;
}

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
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#0a0a0a] border border-white/[0.08] hover:border-[#00a3ff]/30 transition-all duration-300 text-[10px] font-bold tracking-widest uppercase text-gray-400 hover:text-white cursor-pointer"
        style={{ borderColor: open ? 'rgba(0,163,255,0.35)' : undefined }}
      >
        {Icon && <Icon className="w-3.5 h-3.5 text-[#00a3ff]/60" />}
        <span className={value && !value.startsWith('All') && value !== 'recent' ? 'text-white' : ''}>{selected}</span>
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
                className="w-full px-4 py-2.5 text-left text-[10px] font-bold tracking-widest uppercase flex items-center justify-between gap-3 hover:bg-white/[0.04] transition-colors cursor-pointer"
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

export default function BlogGrid() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery]   = useState('');
  const [activeAuthor, setAuthor]       = useState('All Authors');
  const [sortBy, setSortBy]             = useState<SortId>('recent');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [allBlogPosts, setAllBlogPosts] = useState<(BlogPost & { thumbnailUrl?: string; thumbnail_url?: string })[]>(allPosts);
  const [authorsList, setAuthorsList] = useState<any[]>([]);
  const [loadedCategories, setLoadedCategories] = useState<string[]>(categories);

  useEffect(() => {
    // Fetch categories dynamically
    fetch("/api/categories")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setLoadedCategories(["All", ...data.map((c: any) => c.name)]);
        }
      })
      .catch(err => console.error("Error loading categories:", err));

    // Fetch authors for filter dropdown
    fetch("/api/authors")
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setAuthorsList(data); })
      .catch(err => console.error("Error loading authors:", err));

    // Fetch DB blog posts
    fetch("/api/blog?status=published&limit=50")
      .then(res => res.json())
      .then(data => {
        const dbPosts: BlogPost[] = (data.posts || []).map((post: any) => {
          // Map DB snake_case fields + attach a CSS cover component as fallback
          let CoverComponent = CoverIntrolicDWaves;
          const cn = post.coverName || post.cover_name;
          if (cn === "CoverIntrolicKMemory") CoverComponent = CoverIntrolicKMemory;
          else if (cn === "CoverXTStrategy") CoverComponent = CoverXTStrategy;
          else if (cn === "CoverEdgeInference") CoverComponent = CoverEdgeInference;
          else if (cn === "CoverKernelFusion") CoverComponent = CoverKernelFusion;
          return {
            ...post,
            readTime: post.readTime || post.read_time || "5 min read",
            thumbnailUrl: post.thumbnailUrl || post.thumbnail_url || "",
            cover: CoverComponent,
          };
        });
        setAllBlogPosts([...dbPosts, ...allPosts]);
      })
      .catch(err => {
        console.error("Error loading blog posts from DB:", err);
        // Fallback to static posts only
        setAllBlogPosts(allPosts);
      });
  }, []);

  // Keyboard shortcut: '/' focuses search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const authorOptions = useMemo(() => {
    const dbAuthorNames = authorsList.map(a => a.name);
    const postAuthorNames = allBlogPosts.map(p => p.author || 'Introlic Team');
    const combined = Array.from(new Set([...dbAuthorNames, ...postAuthorNames]));
    combined.sort((a, b) => a.localeCompare(b));
    return [{ value: 'All Authors', label: 'All Authors' }, ...combined.map(name => ({ value: name, label: name }))];
  }, [authorsList, allBlogPosts]);

  const sortOptions = useMemo(() => {
    return SORT_OPTIONS.map(s => ({ value: s.id, label: s.label }));
  }, []);

  // Filter + Sort pipeline
  const filtered = useMemo(() => {
    let posts = allBlogPosts.filter((post) => {
      const matchesCategory = activeFilter === 'All' || post.category === activeFilter;
      const matchesAuthor = activeAuthor === 'All Authors' || (post.author || 'Introlic Team') === activeAuthor;
      
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.tag.toLowerCase().includes(q) ||
        (post.author || 'Introlic Team').toLowerCase().includes(q) ||
        post.body.toLowerCase().includes(q);

      return matchesCategory && matchesAuthor && matchesSearch;
    });

    if (sortBy === 'recent')  posts = [...posts].sort((a, b) => parseDateScore(b.date) - parseDateScore(a.date));
    if (sortBy === 'oldest')  posts = [...posts].sort((a, b) => parseDateScore(a.date) - parseDateScore(b.date));
    if (sortBy === 'popular') posts = [...posts].sort((a, b) => parseReadTime(b.readTime) - parseReadTime(a.readTime));

    return posts;
  }, [allBlogPosts, activeFilter, searchQuery, sortBy, activeAuthor]);

  const hasFilters = searchQuery.trim() !== '' || activeFilter !== 'All' || activeAuthor !== 'All Authors';

  const clearAll = () => {
    setSearchQuery('');
    setActiveFilter('All');
    setAuthor('All Authors');
    setSortBy('recent');
  };

  return (
    <section id="dispatches-grid" className="relative bg-[#000000] pb-32 pt-24 overflow-hidden">

      {/* ── Ambient depth glows ── */}
      <div className="absolute top-0 left-[5%]  w-[50%] h-[40%] bg-[#00a3ff]/[0.025] blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0  w-[30%] h-[30%] bg-[#00a3ff]/[0.015] blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 relative z-10 w-full">

        {/* ── PAGE HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          <div className="flex items-end justify-between gap-6 pb-8 border-b border-white/[0.06]">
            <div>
              <p className="text-[10px] font-mono text-gray-600 tracking-[0.3em] uppercase mb-3">
                Intelligence Dispatch
              </p>
              <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none">
                The{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00a3ff] to-[#60d0ff] italic">
                  Press.
                </span>
              </h1>
            </div>
            <div className="hidden md:flex items-center gap-2 text-right shrink-0">
              <div className="text-right">
                <p className="text-2xl font-black text-white">{allBlogPosts.length.toString().padStart(2,'0')}</p>
                <p className="text-[9px] font-mono text-gray-600 tracking-widest uppercase">Dispatches</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── CONTROL BAR ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-4 mb-10"
        >
          {/* Row 1: Search + Dropdowns */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search dispatches, tags, authors..."
                className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-xl py-2.5 pl-10 pr-9 text-[11px] font-medium text-white placeholder-gray-600 focus:outline-none focus:border-[#00a3ff]/40 transition-all cursor-text"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600 hover:text-white transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Dropdowns */}
            <div className="flex items-center gap-2 flex-wrap">
              <CustomDropdown
                label="All Authors"
                value={activeAuthor}
                options={authorOptions}
                onChange={v => setAuthor(v)}
                icon={Users}
              />
              <CustomDropdown
                label="Sort By"
                value={sortBy}
                options={sortOptions}
                onChange={v => setSortBy(v as SortId)}
                icon={ArrowUpDown}
              />

              {/* Filters icon badge */}
              {hasFilters && (
                <button onClick={clearAll} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#00a3ff]/10 border border-[#00a3ff]/20 text-[9px] font-black tracking-widest uppercase text-[#00a3ff] hover:bg-[#00a3ff]/20 transition-all cursor-pointer">
                  <SlidersHorizontal className="w-3 h-3" />
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Row 2: Category pills */}
          <div className="flex flex-wrap gap-2">
            {loadedCategories.map((cat) => {
              const count = cat === 'All'
                ? allBlogPosts.length
                : allBlogPosts.filter(p => p.category === cat).length;
              const isActive = activeFilter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className="px-3 md:px-4 py-1.5 rounded-full text-[9px] font-black tracking-[0.3em] uppercase transition-all duration-300 border flex items-center gap-2 cursor-pointer"
                  style={{
                    backgroundColor: isActive ? '#00a3ff' : 'transparent',
                    color: isActive ? '#000' : '#6b7280',
                    borderColor: isActive ? '#00a3ff' : 'rgba(255,255,255,0.08)',
                    boxShadow: isActive ? '0 0 16px rgba(0,163,255,0.25)' : 'none',
                  }}
                >
                  <span>{cat}</span>
                  <span className={`text-[8px] px-1 py-0.5 rounded transition-all font-bold ${
                    isActive
                      ? 'bg-black/10 text-black font-black'
                      : 'bg-white/[0.04] text-gray-500 group-hover/pill:text-gray-400'
                  }`}>
                    {String(count).padStart(2,'0')}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* ── CONTENT AREA ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeFilter}-${searchQuery}-${sortBy}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
          >
            {filtered.length === 0 ? (
              <div className="py-40 text-center border border-white/[0.04] rounded-2xl">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-5 h-5 text-gray-700" />
                </div>
                <p className="text-gray-600 font-mono text-xs tracking-widest uppercase">No dispatches found</p>
                <button
                  onClick={() => { setActiveFilter('All'); setSearchQuery(''); }}
                  className="mt-4 text-[10px] font-mono text-[#00a3ff]/60 hover:text-[#00a3ff] uppercase tracking-widest transition-colors cursor-pointer"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-8">

                {/* ── FEATURED CARD (first result) ── */}
                <FeaturedCard post={filtered[0]} />

                {/* ── ARTICLE GRID (remaining) ── */}
                {filtered.length > 1 && (
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      <span className="text-[9px] font-mono text-gray-700 tracking-[0.3em] uppercase">
                        More Dispatches
                      </span>
                      <div className="flex-1 h-px bg-white/[0.04]" />
                      <span className="text-[9px] font-mono text-gray-700 tracking-widest">
                        {filtered.length - 1}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {filtered.slice(1).map((post, i) => (
                        <ArticleCard key={post.id} post={post} index={i} />
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
//  FEATURED CARD
// ─────────────────────────────────────────────────────────────
function FeaturedCard({ post }: { post: BlogPost & { thumbnailUrl?: string; thumbnail_url?: string } }) {
  const Cover = post.cover;
  const thumbUrl = (post as any).thumbnailUrl || (post as any).thumbnail_url || "";
  return (
    <Link href={`/blog/${post.slug}`} className="block group" aria-label={post.title}>
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-[28px] border border-white/[0.06] bg-[#070707] grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] min-h-[500px] group-hover:border-[#00a3ff]/20 transition-all duration-700 group-hover:shadow-[0_0_60px_rgba(0,163,255,0.05)]"
      >
        {/* Corner brackets */}
        {[
          'top-0 left-0 border-t border-l',
          'top-0 right-0 border-t border-r',
          'bottom-0 left-0 border-b border-l',
          'bottom-0 right-0 border-b border-r',
        ].map((cls, i) => (
          <div key={i} className={`absolute w-5 h-5 ${cls} border-white/15 group-hover:border-[#00a3ff]/40 transition-colors duration-500`} />
        ))}

        {/* LEFT: Cover art or thumbnail */}
        <div className="relative overflow-hidden aspect-[16/9] sm:aspect-[21/9] lg:aspect-auto lg:min-h-0 border-b lg:border-b-0 lg:border-r border-white/[0.06] group-hover:border-[#00a3ff]/10 transition-colors duration-700">
          {thumbUrl ? (
            <img src={thumbUrl} alt={post.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-1000 ease-out" />
          ) : (
            <div className="absolute inset-0 group-hover:scale-[1.04] transition-transform duration-1000 ease-out">
              <Cover />
            </div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-r from-transparent via-black/10 to-black/80 lg:to-[#070707]" />
          {/* Featured badge */}
          <div className="absolute top-5 left-5 flex items-center gap-2">
            <span className="text-[8px] font-black text-[#00a3ff] bg-[#00a3ff]/10 border border-[#00a3ff]/25 px-3 py-1.5 uppercase tracking-[0.25em] rounded-lg backdrop-blur-sm">
              Featured
            </span>
            <span className="text-[8px] font-black text-white/70 bg-black/60 border border-white/10 px-3 py-1.5 uppercase tracking-[0.2em] rounded-lg backdrop-blur-sm">
              {post.category}
            </span>
          </div>
          {/* Read time bar (bottom of cover) */}
          <div className="absolute bottom-5 left-5 right-5 flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[8px] font-mono text-gray-500 tracking-widest uppercase shrink-0">{post.readTime}</span>
          </div>
        </div>

        {/* RIGHT: Content */}
        <div className="flex flex-col justify-between p-5 xs:p-6 sm:p-8 md:p-10 xl:p-12">
          <div>
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-2 md:gap-2.5 mb-5 md:mb-6">
              <span className="text-[9px] font-mono text-gray-500 tracking-widest uppercase">{post.date}</span>
              <span className="w-px h-3 bg-white/15 shrink-0" />
              <span className="text-[9px] font-mono text-gray-500 tracking-widest uppercase">by {post.author || "Introlic Team"}</span>
              <span className="w-px h-3 bg-white/15 shrink-0" />
              <span className="text-[9px] font-mono text-[#00a3ff]/60 tracking-widest uppercase">{post.tag}</span>
            </div>

            {/* Title */}
            <h2 className="text-2xl md:text-3xl xl:text-[2rem] font-black text-white tracking-tight leading-[1.1] mb-4 group-hover:text-[#00a3ff] transition-colors duration-500">
              {post.title}
            </h2>

            {/* Excerpt */}
            <p className="text-gray-400 text-sm font-normal leading-relaxed mb-8">
              {post.excerpt}
            </p>

            {/* Tag chip */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[8px] font-mono font-bold text-[#00a3ff] bg-[#00a3ff]/08 border border-[#00a3ff]/15 px-3 py-1.5 rounded-lg uppercase tracking-widest">
                {post.tag}
              </span>
              <span className="text-[8px] font-mono text-gray-600 bg-white/[0.03] border border-white/[0.06] px-3 py-1.5 rounded-lg uppercase tracking-widest">
                {post.category}
              </span>
            </div>
          </div>

          {/* CTA footer */}
          <div className="flex items-center justify-between pt-7 mt-7 border-t border-white/[0.05]">
            <span className="text-[9px] font-mono text-gray-600 tracking-widest uppercase">{post.date}</span>
            <div className="flex items-center gap-2.5">
              <span className="text-[10px] font-black text-white uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Read
              </span>
              <div className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-[#00a3ff] group-hover:border-[#00a3ff] transition-all duration-300">
                <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-black transition-colors duration-300" />
              </div>
            </div>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────
//  ARTICLE CARD
// ─────────────────────────────────────────────────────────────
function ArticleCard({ post, index }: { post: BlogPost & { thumbnailUrl?: string; thumbnail_url?: string }; index: number }) {
  const Cover = post.cover;
  const readMins = parseReadTime(post.readTime);
  // Reading progress bar width (visual only, scaled from 1–15 mins)
  const barWidth = Math.min(100, Math.round((readMins / 12) * 100));
  const thumbUrl = post.thumbnailUrl || post.thumbnail_url || "";

  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full" aria-label={post.title}>
      <motion.article
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
        className="relative bg-[#060606] border border-white/[0.06] rounded-[22px] overflow-hidden h-full flex flex-col group-hover:border-[#00a3ff]/20 group-hover:shadow-[0_0_30px_rgba(0,163,255,0.05)] transition-all duration-500"
      >
        {/* Cover image area */}
        <div className="relative h-44 overflow-hidden shrink-0">
          {thumbUrl ? (
            <img src={thumbUrl} alt={post.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700 ease-out" />
          ) : (
            <div className="absolute inset-0 group-hover:scale-[1.05] transition-transform duration-700 ease-out">
              <Cover />
            </div>
          )}
          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#060606] via-[#060606]/30 to-transparent" />

          {/* Category badge */}
          <div className="absolute top-4 left-4">
            <span className="text-[7px] font-black text-[#00a3ff] bg-black/80 border border-[#00a3ff]/20 px-2.5 py-1 uppercase tracking-[0.2em] rounded-lg backdrop-blur-sm">
              {post.category}
            </span>
          </div>

          {/* Read time badge — top right */}
          <div className="absolute top-4 right-4">
            <span className="text-[7px] font-mono text-gray-500 bg-black/80 border border-white/10 px-2.5 py-1 uppercase tracking-widest rounded-lg backdrop-blur-sm">
              {post.readTime}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-5 gap-3">
          {/* Date + Tag row */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[8px] font-mono text-gray-600 tracking-widest uppercase">{post.date} · by {post.author || "Introlic Team"}</span>
            <span className="text-[7px] font-bold text-[#00a3ff]/60 bg-[#00a3ff]/06 border border-[#00a3ff]/10 px-2 py-0.5 rounded-md uppercase tracking-widest font-mono shrink-0">
              {post.tag}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-[15px] font-black text-white leading-snug tracking-tight group-hover:text-[#00a3ff] transition-colors duration-300 flex-1">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-gray-500 text-[12px] font-normal leading-relaxed line-clamp-2">
            {post.excerpt}
          </p>
        </div>

        {/* Bottom: Read-time progress bar + CTA */}
        <div className="px-5 pb-5">
          {/* Progress bar */}
          <div className="h-px bg-white/[0.05] rounded-full mb-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#00a3ff]/40 to-[#00a3ff]/10 rounded-full"
              style={{ width: `${barWidth}%` }}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[8px] font-mono text-gray-700 tracking-widest uppercase">
              {post.readTime}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-black text-gray-600 group-hover:text-white uppercase tracking-wider transition-colors duration-300 opacity-0 group-hover:opacity-100">
                Read
              </span>
              <div className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#00a3ff]/40 group-hover:bg-[#00a3ff]/08 transition-all duration-300">
                <ArrowUpRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-[#00a3ff] group-hover:translate-x-px group-hover:-translate-y-px transition-all duration-300" />
              </div>
            </div>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}
