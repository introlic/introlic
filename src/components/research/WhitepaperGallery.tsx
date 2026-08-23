"use client";
 
 import React, { useState, useMemo, useRef, useEffect } from 'react';
 import { motion, AnimatePresence } from 'framer-motion';
 import { BookOpen, ChevronUp, Search, Grid, List, ChevronDown, Calendar, User, X, Download, Users, ArrowUpDown, Check, SlidersHorizontal, Link2, ArrowUpRight } from 'lucide-react';
 import Link from 'next/link';
 import { XIcon, LinkedinIcon, GithubIcon, InstagramIcon, YouTubeIcon, DiscordIcon } from '../SocialIcons';
 
 interface ResearchPaper {
   id: string;
   title: string;
   abstract: string;
   type: 'Publication' | 'Conclusion' | 'Milestone' | 'Release';
   author: string;
   date: string;
   timestamp: number; // For date sorting
   fullText: React.ReactNode;
   keywords?: string[];
   doi?: string;
   institution?: string;
   externalUrl?: string;
   showContributors?: boolean;
   contributors?: { name: string; role?: string }[];
 }
 
const papers: ResearchPaper[] = [];

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
        <span className={value && !value.startsWith('All') && value !== 'newest' ? 'text-white' : ''}>{selected}</span>
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
 
 export default function WhitepaperGallery() {
   const [searchQuery, setSearchQuery] = useState('');
   const [activeCategory, setActiveCategory] = useState<string>('All');
   const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title'>('newest');
   const [viewLayout, setViewLayout] = useState<'list' | 'grid'>('list');
 
   const [expandedPaper, setExpandedPaper] = useState<string | null>(null);
   const [drawerPaper, setDrawerPaper] = useState<ResearchPaper | null>(null);
   const [selectedAuthor, setSelectedAuthor] = useState('All Authors');
   const [allPapersList, setAllPapersList] = useState<ResearchPaper[]>([]);
   const [authorsList, setAuthorsList] = useState<any[]>([]);
   const [typesList, setTypesList] = useState<{ value: string; label: string }[]>([
     { value: 'All', label: 'All' },
     { value: 'Publication', label: 'Publications' },
     { value: 'Conclusion', label: 'Conclusions' },
     { value: 'Milestone', label: 'Milestones' },
     { value: 'Release', label: 'Releases' },
   ]);
 
   useEffect(() => {
     fetch("/api/categories?type=research")
       .then(res => res.json())
       .then(data => {
         if (Array.isArray(data) && data.length > 0) {
           setTypesList([
             { value: 'All', label: 'All' },
             ...data.map(c => ({
               value: c.name,
               label: c.name.endsWith('s') ? c.name : c.name + 's'
             }))
           ]);
         }
       })
       .catch(err => console.error("Error loading research types:", err));

     fetch("/api/authors")
       .then(res => res.json())
       .then(data => {
         if (Array.isArray(data)) {
           setAuthorsList(data);
         }
       })
       .catch(err => console.error("Error loading authors:", err));
 
     // Fetch DB research papers
     fetch("/api/research?status=published&limit=100")
       .then(res => res.json())
       .then(data => {
         const dbPapers = (data.papers || []).map((p: any) => {
           return {
             ...p,
             timestamp: p.createdAt ? new Date(p.createdAt).getTime() : Date.now(),
             fullText: (
               <div className="space-y-4">
                 <p className="text-gray-400 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                   {p.fullText || p.abstract}
                 </p>
               </div>
             )
           };
         });
         setAllPapersList([...dbPapers, ...papers]);
       })
       .catch(err => {
         console.error("Error loading research papers from DB:", err);
         if (typeof window !== "undefined") {
           const stored = localStorage.getItem("introlic_custom_research");
           if (stored) {
             try {
               interface CustomResearchPaper {
                 id: string;
                 title: string;
                 abstract: string;
                 type: 'Publication' | 'Conclusion' | 'Milestone' | 'Release';
                 author: string;
                 date: string;
                 timestamp: number;
                 fullTextRaw?: string;
               }
               const custom: CustomResearchPaper[] = JSON.parse(stored);
               const customWithFullText = custom.map((p) => ({
                 ...p,
                 fullText: (
                   <div className="space-y-4">
                     <p className="text-gray-400 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                       {p.fullTextRaw || p.abstract}
                     </p>
                   </div>
                 )
               }));
               setAllPapersList([...customWithFullText, ...papers]);
             } catch (e) {
               console.error(e);
             }
           }
         }
       });
   }, []);

    const getAuthorDetails = (authorName: string) => {
      if (!authorName) return { authorObj: null, ageAndDOB: "" };
      const nameLower = authorName.toLowerCase().trim();
      const authorObj = authorsList.find(a => a.name.toLowerCase().trim() === nameLower);
      if (!authorObj) return { authorObj: null, ageAndDOB: "" };

      let ageAndDOB = "";
      if (authorObj.dateOfBirth) {
        const d = new Date(authorObj.dateOfBirth);
        if (!isNaN(d.getTime())) {
          const today = new Date();
          let age = today.getFullYear() - d.getFullYear();
          const m = today.getMonth() - d.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < d.getDate())) {
            age--;
          }
          const formattedDate = d.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
          ageAndDOB = `${formattedDate} (Age ${age})`;
        }
      }
      return { authorObj, ageAndDOB };
    };

    const renderAuthorCard = (authorName: string) => {
      const { authorObj, ageAndDOB } = getAuthorDetails(authorName);
      if (!authorObj) return null;

      return (
        <div className="mt-12 p-6 rounded-2xl bg-[#09090a]/50 border border-white/[0.06] overflow-hidden group shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] max-w-xl text-left relative">
          {/* Subtle background gradient glow */}
          <div className="absolute -inset-px bg-gradient-to-r from-[#00a3ff]/10 via-[#00d1ff]/5 to-[#00a3ff]/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col gap-4">
            <p className="text-[9px] font-mono text-[#00a3ff] tracking-[0.3em] uppercase">Document Author Profile</p>
            
            <div className="flex items-center gap-3">
              {/* Avatar Initials */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00a3ff]/20 to-[#00d1ff]/10 border border-[#00a3ff]/30 flex items-center justify-center text-white font-black text-sm select-none shadow-[0_4px_12px_rgba(0,163,255,0.15)]">
                {authorObj.name ? authorObj.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) : 'A'}
              </div>
              
              <div className="flex flex-col">
                <h4 className="text-sm font-black text-white tracking-tight">{authorObj.name}</h4>
                {ageAndDOB && (
                  <span className="text-[10px] text-gray-500 font-mono mt-0.5">{ageAndDOB}</span>
                )}
              </div>
            </div>

            {authorObj.bio && (
              <p className="text-xs text-gray-400 leading-relaxed font-medium">
                {authorObj.bio}
              </p>
            )}

            {/* Social Handles */}
            {authorObj.socialLinks && Object.values(authorObj.socialLinks).some(link => link) && (
              <div className="flex flex-wrap items-center gap-2.5 mt-2 pt-4 border-t border-white/[0.04]">
                {authorObj.socialLinks.twitter && (
                  <a href={authorObj.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-lg bg-white/[0.02] border border-white/5 hover:border-[#00a3ff]/30 hover:bg-[#00a3ff]/5 text-gray-400 hover:text-[#00a3ff] flex items-center justify-center transition-all duration-300" title="Twitter/X">
                    <XIcon className="w-3.5 h-3.5" />
                  </a>
                )}
                {authorObj.socialLinks.linkedin && (
                  <a href={authorObj.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-lg bg-white/[0.02] border border-white/5 hover:border-[#00a3ff]/30 hover:bg-[#00a3ff]/5 text-gray-400 hover:text-[#00a3ff] flex items-center justify-center transition-all duration-300" title="LinkedIn">
                    <LinkedinIcon className="w-3.5 h-3.5" />
                  </a>
                )}
                {authorObj.socialLinks.github && (
                  <a href={authorObj.socialLinks.github} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-lg bg-white/[0.02] border border-white/5 hover:border-[#00a3ff]/30 hover:bg-[#00a3ff]/5 text-gray-400 hover:text-[#00a3ff] flex items-center justify-center transition-all duration-300" title="GitHub">
                    <GithubIcon className="w-3.5 h-3.5" />
                  </a>
                )}
                {authorObj.socialLinks.instagram && (
                  <a href={authorObj.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-lg bg-white/[0.02] border border-white/5 hover:border-[#00a3ff]/30 hover:bg-[#00a3ff]/5 text-gray-400 hover:text-[#00a3ff] flex items-center justify-center transition-all duration-300" title="Instagram">
                    <InstagramIcon className="w-3.5 h-3.5" />
                  </a>
                )}
                {authorObj.socialLinks.youtube && (
                  <a href={authorObj.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-lg bg-white/[0.02] border border-white/5 hover:border-[#00a3ff]/30 hover:bg-[#00a3ff]/5 text-gray-400 hover:text-[#00a3ff] flex items-center justify-center transition-all duration-300" title="YouTube">
                    <YouTubeIcon className="w-3.5 h-3.5" />
                  </a>
                )}
                {authorObj.socialLinks.discord && (
                  <a href={authorObj.socialLinks.discord} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-lg bg-white/[0.02] border border-white/5 hover:border-[#00a3ff]/30 hover:bg-[#00a3ff]/5 text-gray-400 hover:text-[#00a3ff] flex items-center justify-center transition-all duration-300" title="Discord">
                    <DiscordIcon className="w-3.5 h-3.5" />
                  </a>
                )}
                {authorObj.socialLinks.website && (
                  <a href={authorObj.socialLinks.website} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-lg bg-white/[0.02] border border-white/5 hover:border-[#00a3ff]/30 hover:bg-[#00a3ff]/5 text-gray-400 hover:text-[#00a3ff] flex items-center justify-center transition-all duration-300" title="Website">
                    <Link2 className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      );
    };

   const uniqueAuthors = useMemo(() => {
     const dbAuthorNames = authorsList.map(a => a.name);
     const paperAuthorNames = allPapersList.map(p => p.author);
     const combined = Array.from(new Set([...dbAuthorNames, ...paperAuthorNames]));
     combined.sort((a, b) => a.localeCompare(b));
     return ['All Authors', ...combined];
   }, [authorsList, allPapersList]);

   const authorOptions = useMemo(() => {
     return uniqueAuthors.map(a => ({ value: a, label: a }));
   }, [uniqueAuthors]);

   const sortOptions = useMemo(() => [
     { value: 'newest', label: 'Newest First' },
     { value: 'oldest', label: 'Oldest First' },
     { value: 'title', label: 'Title A → Z' },
   ], []);

   // Search & Filter & Sort Pipeline
   const processedPapers = useMemo(() => {
     let result = [...allPapersList];
 
     // 1. Search filter
     if (searchQuery.trim()) {
       const query = searchQuery.toLowerCase();
       result = result.filter(
         p =>
           p.title.toLowerCase().includes(query) ||
           p.abstract.toLowerCase().includes(query) ||
           p.author.toLowerCase().includes(query) ||
           p.id.toLowerCase().includes(query)
       );
     }
 
     // 2. Category tab filter
     if (activeCategory !== 'All') {
       result = result.filter(p => p.type === activeCategory);
     }

     // 3. Author selection filter
     if (selectedAuthor !== 'All Authors') {
       result = result.filter(p => p.author === selectedAuthor);
     }
 
     // 4. Sorting
     result.sort((a, b) => {
       if (sortBy === 'newest') return b.timestamp - a.timestamp;
       if (sortBy === 'oldest') return a.timestamp - b.timestamp;
       if (sortBy === 'title') return a.title.localeCompare(b.title);
       return 0;
     });
 
     return result;
   }, [searchQuery, activeCategory, selectedAuthor, sortBy, allPapersList]);
 
   const [currentPage, setCurrentPage] = useState(1);
   const ITEMS_PER_PAGE = 3;
 
   const totalPages = Math.ceil(processedPapers.length / ITEMS_PER_PAGE);
 
   const paginatedPapers = useMemo(() => {
     const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
     return processedPapers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
   }, [processedPapers, currentPage]);
 
   const hasFilters = searchQuery.trim() !== '' || activeCategory !== 'All' || selectedAuthor !== 'All Authors';
 
   const clearAll = () => {
     setSearchQuery('');
     setActiveCategory('All');
     setSelectedAuthor('All Authors');
     setSortBy('newest');
     setCurrentPage(1);
   };
 
   const toggleExpand = (id: string) => {
     setExpandedPaper(prev => (prev === id ? null : id));
   };
 
   const handleReadPaper = (paper: ResearchPaper) => {
     if (viewLayout === 'list') {
       toggleExpand(paper.id);
     } else {
       setDrawerPaper(paper);
     }
   };
 
   return (
    <section className="relative bg-[#020202] pt-36 pb-24 md:pt-40 md:pb-32 selection:bg-[#00a3ff]/30">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12">
         
         {/* HEADER */}
         <div className="mb-20 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
           <div className="max-w-2xl">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 mb-6"
              >
                 <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                    <BookOpen className="w-5 h-5 text-gray-400" />
                 </div>
                 <span className="text-gray-500 font-black tracking-[0.4em] uppercase text-[10px]">Technical Archives // Public Access</span>
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tightest leading-none">
                 Published<br />
                 <span className="italic opacity-40">Intelligence.</span>
              </h2>
           </div>
           <p className="text-gray-500 text-base md:text-lg font-medium max-w-sm leading-relaxed border-l-2 border-white/10 pl-8">
              Explore technical dispatches spanning advanced computation, mathematics, physics, and hardware architectures. Read directly online.
           </p>
         </div>
 
          {/* ── Controls bar ── */}
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
                  type="text"
                  value={searchQuery}
                  onChange={e => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search dispatches, tags, authors..."
                  className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-xl py-2.5 pl-10 pr-9 text-[11px] font-medium text-white placeholder-gray-600 focus:outline-none focus:border-[#00a3ff]/40 transition-all cursor-text"
                />
                {searchQuery && (
                  <button onClick={() => { setSearchQuery(''); setCurrentPage(1); }} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600 hover:text-white transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Dropdowns & Switcher */}
              <div className="flex items-center gap-2 flex-wrap">
                <CustomDropdown
                  label="All Authors"
                  value={selectedAuthor}
                  options={authorOptions}
                  onChange={v => { setSelectedAuthor(v); setCurrentPage(1); }}
                  icon={Users}
                />
                <CustomDropdown
                  label="Sort By"
                  value={sortBy}
                  options={sortOptions}
                  onChange={v => { setSortBy(v as 'newest' | 'oldest' | 'title'); setCurrentPage(1); }}
                  icon={ArrowUpDown}
                />

                {/* View Layout Switcher */}
                <div className="flex border border-white/[0.08] rounded-xl overflow-hidden bg-[#0a0a0a]">
                  <button
                    onClick={() => setViewLayout('list')}
                    className="p-2.5 cursor-pointer transition-colors"
                    style={{
                      color: viewLayout === 'list' ? '#00a3ff' : '#4b5563',
                      backgroundColor: viewLayout === 'list' ? 'rgba(0,163,255,0.1)' : 'transparent',
                    }}
                    title="List View"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewLayout('grid')}
                    className="p-2.5 cursor-pointer transition-colors"
                    style={{
                      color: viewLayout === 'grid' ? '#00a3ff' : '#4b5563',
                      backgroundColor: viewLayout === 'grid' ? 'rgba(0,163,255,0.1)' : 'transparent',
                    }}
                    title="Grid View"
                  >
                    <Grid className="w-3.5 h-3.5" />
                  </button>
                </div>

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
              {typesList.map(({ value, label }) => {
                const count = value === 'All'
                  ? allPapersList.length
                  : allPapersList.filter(p => p.type === value).length;
                const isActive = activeCategory === value;
                return (
                  <button
                    key={value}
                    onClick={() => {
                      setActiveCategory(value);
                      setCurrentPage(1);
                    }}
                    className="px-3 md:px-4 py-1.5 rounded-full text-[9px] font-black tracking-[0.3em] uppercase transition-all duration-300 border flex items-center gap-2 cursor-pointer"
                    style={{
                      backgroundColor: isActive ? '#00a3ff' : 'transparent',
                      color: isActive ? '#000' : '#6b7280',
                      borderColor: isActive ? '#00a3ff' : 'rgba(255,255,255,0.08)',
                      boxShadow: isActive ? '0 0 16px rgba(0,163,255,0.25)' : 'none',
                    }}
                  >
                    <span>{label}</span>
                    <span className={`text-[8px] px-1 py-0.5 rounded transition-all font-bold ${
                      isActive
                        ? 'bg-black/10 text-black font-black'
                        : 'bg-white/[0.04] text-gray-500 hover:text-gray-400'
                    }`}>
                      {String(count).padStart(2,'0')}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
 
         {/* DISPATCH LISTINGS CONTAINER */}
         <AnimatePresence mode="wait">
           {processedPapers.length === 0 ? (
             <motion.div
               key="empty"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0 }}
               className="py-24 text-center border border-dashed border-white/5 rounded-3xl bg-[#050505] flex flex-col items-center justify-center gap-4"
             >
               <BookOpen className="w-8 h-8 text-gray-700 animate-pulse" />
               <p className="text-gray-500 text-sm font-semibold tracking-wider uppercase font-mono">No research dispatches found matching filters.</p>
             </motion.div>
           ) : viewLayout === 'list' ? (
             /* LIST VIEW */
             <motion.div
               key="list-layout"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="flex flex-col gap-px bg-white/5 border border-white/5 rounded-[32px] overflow-hidden"
             >
                {paginatedPapers.map((paper) => {
                  const isExpanded = expandedPaper === paper.id;
                  return (
                    <div 
                      key={paper.id}
                      className="group bg-[#050505] p-5 sm:p-8 md:p-12 transition-all duration-500 border-b border-white/[0.02] relative cursor-pointer"
                    >
                       {/* Prefetching Link Overlay covering entire row */}
                       <Link href={`/research/${paper.id}`} className="absolute inset-0 z-10" aria-label={`Read details of ${paper.title}`} />

                       <div className="flex flex-col lg:flex-row lg:items-center gap-10 relative z-0">
                          <div className="flex-1">
                             <div className="flex flex-wrap items-center gap-4 mb-4 font-mono text-[9px] tracking-widest uppercase text-gray-500">
                                <span className="text-[#00a3ff] font-bold">{paper.id}</span>
                                <span>·</span>
                                <span className="text-gray-600 font-bold">{paper.type}</span>
                                <span>·</span>
                                <div className="flex items-center gap-1">
                                  <User className="w-3 h-3 text-gray-700" />
                                  <span>{paper.author}</span>
                                </div>
                             </div>
                             <h3 className="text-2xl md:text-3xl font-black text-white tracking-tighter mb-4 group-hover:text-[#00a3ff] transition-colors">
                                {paper.title}
                             </h3>
                             {paper.keywords && paper.keywords.length > 0 && (
                               <div className="flex flex-wrap gap-2.5 mb-4">
                                 {paper.keywords.map((kw, i) => (
                                   <span key={i} className="text-[9px] font-mono text-[#00a3ff]/70 bg-[#00a3ff]/05 border border-[#00a3ff]/10 px-2 py-0.5 rounded">
                                     #{kw}
                                   </span>
                                 ))}
                               </div>
                             )}
                             <p className="text-gray-400 text-sm md:text-base font-medium leading-relaxed max-w-3xl line-clamp-2">
                                {paper.abstract}
                             </p>
                          </div>
                          
                          <div className="flex items-center gap-8 border-t lg:border-t-0 lg:border-l border-white/5 pt-8 lg:pt-0 lg:pl-12">
                             <div className="flex flex-col text-right hidden sm:flex font-mono">
                                <span className="text-[9px] font-black text-gray-700 uppercase tracking-widest leading-none mb-1">Release</span>
                                <span className="text-sm font-black text-white uppercase">{paper.date}</span>
                             </div>
                             <div 
                                className="flex items-center gap-3 px-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl hover:bg-white/5 hover:border-[#00a3ff]/30 hover:text-[#00a3ff] transition-all group/btn cursor-pointer relative z-20 pointer-events-none"
                             >
                                <BookOpen className="w-5 h-5 text-gray-500 group-hover/btn:text-[#00a3ff] transition-colors" />
                                <span className="text-xs font-black uppercase tracking-widest">Read Dispatch</span>
                             </div>
                          </div>
                       </div>
                    </div>
                  );
                })}
             </motion.div>
           ) : (
             /* GRID VIEW */
             <motion.div
               key="grid-layout"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
             >
                {paginatedPapers.map((paper) => (
                  <div 
                    key={paper.id}
                    className="group bg-[#050505] hover:bg-[#07070a] border border-white/5 hover:border-[#00a3ff]/30 p-5 sm:p-8 rounded-[24px] flex flex-col justify-between min-h-[360px] transition-all duration-500 relative cursor-pointer"
                  >
                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-white/10 group-hover:border-[#00a3ff]/30 transition-colors z-10" />
                    <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-white/10 group-hover:border-[#00a3ff]/30 transition-colors z-10" />
                    <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-white/10 group-hover:border-[#00a3ff]/30 transition-colors z-10" />
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-white/10 group-hover:border-[#00a3ff]/30 transition-colors z-10" />
 
                    {/* Prefetching Link Overlay covering entire card */}
                    <Link href={`/research/${paper.id}`} className="absolute inset-0 z-10" aria-label={`Read details of ${paper.title}`} />

                    <div className="space-y-4">
                      <div className="flex justify-between items-center font-mono text-[8px] tracking-widest uppercase text-gray-500">
                        <span className="text-[#00a3ff] font-bold">{paper.id}</span>
                        <span className="bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-sm">{paper.type}</span>
                      </div>
                      
                      <h3 className="text-xl font-black text-white tracking-tighter leading-snug line-clamp-2 group-hover:text-[#00a3ff] transition-colors">
                        {paper.title}
                      </h3>
                      {paper.keywords && paper.keywords.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {paper.keywords.map((kw, i) => (
                            <span key={i} className="text-[8px] font-mono text-[#00a3ff]/70 bg-[#00a3ff]/05 border border-[#00a3ff]/10 px-2 py-0.5 rounded">
                              #{kw}
                            </span>
                          ))}
                        </div>
                      )}
                      <p className="text-gray-500 text-xs font-medium leading-relaxed line-clamp-3">
                        {paper.abstract}
                      </p>
                    </div>
 
                    <div className="mt-8 pt-5 border-t border-white/[0.04] space-y-4">
                      {/* Meta information tags */}
                      <div className="flex justify-between items-center text-[9px] font-mono text-gray-600">
                        <div className="flex items-center gap-1.5 truncate max-w-[120px]">
                          <User className="w-3 h-3 text-gray-700" />
                          <span className="truncate">{paper.author}</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <Calendar className="w-3 h-3 text-gray-700" />
                          <span>{paper.date}</span>
                        </div>
                      </div>
 
                      <div 
                        className="w-full flex items-center justify-center gap-2 py-3 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-[#00a3ff]/10 hover:border-[#00a3ff]/30 hover:text-[#00a3ff] transition-all text-[10px] font-black uppercase tracking-wider cursor-pointer relative z-20 pointer-events-none"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        Read Dispatch
                      </div>
                    </div>
                  </div>
                ))}
             </motion.div>
           )}
         </AnimatePresence>

         {/* PAGINATION CONTROLS */}
         {totalPages > 1 && (
           <div className="flex items-center justify-center gap-2 mt-12 pt-8 border-t border-white/[0.04]">
             <button
               type="button"
               onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
               disabled={currentPage === 1}
               className={`px-4 py-2.5 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all ${
                 currentPage === 1
                   ? 'border-white/5 bg-transparent text-gray-700 cursor-not-allowed'
                   : 'border-white/10 bg-[#0a0a0c] text-gray-400 hover:border-[#00a3ff]/30 hover:text-white cursor-pointer'
               }`}
             >
               Prev
             </button>

             {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
               <button
                 key={pageNum}
                 type="button"
                 onClick={() => setCurrentPage(pageNum)}
                 className={`w-9 h-9 rounded-xl border text-[9px] font-mono font-black transition-all flex items-center justify-center cursor-pointer ${
                   currentPage === pageNum
                     ? 'bg-[#00a3ff]/10 border-[#00a3ff]/20 text-[#00a3ff] shadow-[0_0_15px_rgba(0,163,255,0.1)]'
                     : 'border-white/10 bg-[#0a0a0c] text-gray-500 hover:border-white/20 hover:text-white'
                 }`}
               >
                 {pageNum}
               </button>
             ))}

             <button
               type="button"
               onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
               disabled={currentPage === totalPages}
               className={`px-4 py-2.5 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all ${
                 currentPage === totalPages
                   ? 'border-white/5 bg-transparent text-gray-700 cursor-not-allowed'
                   : 'border-white/10 bg-[#0a0a0c] text-gray-400 hover:border-[#00a3ff]/30 hover:text-white cursor-pointer'
               }`}
             >
               Next
             </button>
           </div>
         )}
 
       </div>
 
       {/* PREMIUM SLIDE-OVER READER DRAWER (For Grid View) */}
       <AnimatePresence>
         {drawerPaper && (
           <>
             {/* Backdrop */}
             <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 0.6 }}
               exit={{ opacity: 0 }}
               onClick={() => setDrawerPaper(null)}
               className="fixed inset-0 bg-black z-[1000] cursor-pointer"
             />
             
             {/* Slide-over Drawer Panel */}
             <motion.div
               initial={{ x: '100%' }}
               animate={{ x: 0 }}
               exit={{ x: '100%' }}
               transition={{ type: 'spring', damping: 25, stiffness: 220 }}
               className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-[#050505] border-l border-white/10 z-[1001] shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col"
             >
               {/* Drawer Header */}
               <div className="p-6 md:p-8 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#050505] z-10">
                 <div className="flex items-center gap-3 font-mono text-[9px] tracking-widest text-[#00a3ff] uppercase">
                   <span>{drawerPaper.id}</span>
                   <span>·</span>
                   <span className="text-gray-500 font-bold">{drawerPaper.type}</span>
                 </div>
                 
                 <button 
                   onClick={() => setDrawerPaper(null)}
                   className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 text-gray-400 hover:text-white transition-all cursor-pointer"
                 >
                   <X className="w-4 h-4" />
                 </button>
               </div>
 
               {/* Scrollable Document Area */}
               <div className="flex-1 overflow-y-auto p-6 md:p-12 custom-scrollbar">
                 <div className="space-y-8 max-w-prose">
                   
                   {/* Main details */}
                   <div>
                     <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter leading-snug mb-6">
                       {drawerPaper.title}
                     </h2>
 
                     <div className="flex flex-wrap items-center gap-6 font-mono text-[10px] text-gray-500 border-b border-t border-white/5 py-4 my-6">
                       <div className="flex items-center gap-1.5 font-bold">
                         <User className="w-3.5 h-3.5 text-gray-700" />
                         <span>Author // {drawerPaper.author}</span>
                       </div>
                       <div className="flex items-center gap-1.5 font-bold">
                         <Calendar className="w-3.5 h-3.5 text-gray-700" />
                         <span>Release // {drawerPaper.date}</span>
                       </div>
                       {drawerPaper.institution && (
                         <div className="flex items-center gap-1.5">
                           <span className="text-gray-700 font-bold">Institution //</span>
                           <span className="text-white">{drawerPaper.institution}</span>
                         </div>
                       )}
                       {drawerPaper.doi && (
                         <div className="flex items-center gap-1.5">
                           <span className="text-gray-700 font-bold">DOI //</span>
                           {drawerPaper.externalUrl ? (
                             <a href={drawerPaper.externalUrl} target="_blank" rel="noopener noreferrer" className="text-[#00a3ff] hover:underline flex items-center gap-0.5">
                               {drawerPaper.doi} <ArrowUpRight className="w-3 h-3" />
                             </a>
                           ) : (
                             <span className="text-white">{drawerPaper.doi}</span>
                           )}
                         </div>
                       )}
                     </div>
 
                     <p className="text-base text-gray-400 font-medium leading-relaxed italic border-l-2 border-[#00a3ff] pl-6 py-1 bg-white/[0.01]">
                       {drawerPaper.abstract}
                     </p>
                   </div>
 
                   {/* Main body content */}
                   <div className="text-gray-300 text-sm md:text-base leading-relaxed">
                     {drawerPaper.fullText}

                     {/* Contributors Section in Drawer */}
                     {drawerPaper.showContributors && drawerPaper.contributors && drawerPaper.contributors.length > 0 && (
                       <div className="mt-12 pt-8 border-t border-white/5 text-left">
                         <p className="text-[9px] font-mono text-gray-500 tracking-[0.35em] uppercase mb-6">
                           Document Contributors
                         </p>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           {drawerPaper.contributors.map((contrib, idx) => {
                             const { authorObj } = getAuthorDetails(contrib.name);
                             const initials = contrib.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
                             return (
                               <div key={idx} className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.04] flex gap-3 items-start group/contrib hover:border-[#00a3ff]/20 transition-all">
                                 {authorObj?.avatar ? (
                                   <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-white/10 shrink-0">
                                     <img src={authorObj.avatar} alt={contrib.name} className="object-cover w-full h-full" />
                                   </div>
                                 ) : (
                                   <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 flex items-center justify-center text-white/80 font-black text-xs select-none shrink-0">
                                     {initials || "U"}
                                   </div>
                                 )}
                                 <div className="flex flex-col min-w-0">
                                   <span className="text-xs font-bold text-white group-hover/contrib:text-[#00a3ff] transition-colors">{contrib.name}</span>
                                   <span className="text-[9px] text-gray-500 font-mono uppercase tracking-wider mt-0.5">{contrib.role || "Contributor"}</span>
                                 </div>
                               </div>
                             );
                           })}
                         </div>
                       </div>
                     )}

                     {renderAuthorCard(drawerPaper.author)}
                   </div>
 
                   {/* Dispatch Action Footers */}
                   <div className="pt-12 border-t border-white/5 flex gap-4">
                     <button className="flex-1 flex items-center justify-center gap-3 py-4 bg-white/[0.03] border border-white/10 rounded-2xl hover:bg-white/5 hover:border-white/20 text-xs font-black uppercase tracking-widest transition-all group/btn cursor-pointer">
                       <Download className="w-4 h-4 text-gray-500 group-hover/btn:text-white transition-colors" />
                       Save PDF Copy
                     </button>
                   </div>
 
                 </div>
               </div>
             </motion.div>
           </>
         )}
       </AnimatePresence>
     </section>
   );
 }
