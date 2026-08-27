"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Link2, Check, ArrowRight, ArrowUpRight, User } from 'lucide-react';
import Link from 'next/link';
import NextImage from 'next/image';
import { allPosts, BlogPost, CoverIntrolicDWaves, CoverIntrolicKMemory, CoverXTStrategy, CoverEdgeInference, CoverKernelFusion } from './BlogData';
import { XIcon, LinkedinIcon, GithubIcon, InstagramIcon, YouTubeIcon, DiscordIcon } from '../SocialIcons';

interface ArticleLayoutProps {
  slug: string;
}

export default function ArticleLayout({ slug }: ArticleLayoutProps) {
  // Reading progress state
  const [scrollProgress, setScrollProgress] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [allBlogPosts, setAllBlogPosts] = useState<BlogPost[]>(allPosts);
  const [authorsList, setAuthorsList] = useState<any[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Fetch authors from DB API
    fetch("/api/authors")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setAuthorsList(data);
        }
      })
      .catch(err => console.error("Error loading authors:", err));

    let customWithCovers: BlogPost[] = [];
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("introlic_blog");
      if (stored) {
        try {
          interface CustomBlogPost extends Omit<BlogPost, 'cover'> {
            coverName?: string;
          }
          const custom: CustomBlogPost[] = JSON.parse(stored);
          customWithCovers = custom.map((post) => {
            let CoverComponent = CoverIntrolicDWaves;
            if (post.coverName === "CoverIntrolicKMemory") CoverComponent = CoverIntrolicKMemory;
            else if (post.coverName === "CoverXTStrategy") CoverComponent = CoverXTStrategy;
            else if (post.coverName === "CoverEdgeInference") CoverComponent = CoverEdgeInference;
            else if (post.coverName === "CoverKernelFusion") CoverComponent = CoverKernelFusion;

            return {
              ...post,
              cover: CoverComponent
            };
          });
        } catch {
          // Ignore parsing errors
        }
      }
    }

    // Try fetching the specific post from DB first
    fetch(`/api/blog/${slug}`)
      .then(res => {
        if (!res.ok) throw new Error("Not found in DB");
        return res.json();
      })
      .then(data => {
        const dbPost = data.post;
        if (dbPost) {
          let CoverComponent = CoverIntrolicDWaves;
          const cn = dbPost.coverName || dbPost.cover_name;
          if (cn === "CoverIntrolicKMemory") CoverComponent = CoverIntrolicKMemory;
          else if (cn === "CoverXTStrategy") CoverComponent = CoverXTStrategy;
          else if (cn === "CoverEdgeInference") CoverComponent = CoverEdgeInference;
          else if (cn === "CoverKernelFusion") CoverComponent = CoverKernelFusion;

          const formattedPost = {
            ...dbPost,
            readTime: dbPost.readTime || dbPost.read_time || "5 min read",
            thumbnailUrl: dbPost.thumbnailUrl || dbPost.thumbnail_url || "",
            cover: CoverComponent
          };
          setAllBlogPosts(prev => {
            const exists = prev.some(p => p.slug === slug);
            if (exists) {
              return prev.map(p => p.slug === slug ? formattedPost : p);
            }
            return [formattedPost, ...prev];
          });
        }
      })
      .catch((err) => {
        console.warn("DB fetch failed, falling back to static/local:", err);
      })
      .finally(() => {
        setIsMounted(true);
        if (customWithCovers.length > 0) {
          setAllBlogPosts(prev => {
            const existingSlugs = new Set(prev.map(p => p.slug));
            const filteredCustom = customWithCovers.filter(p => !existingSlugs.has(p.slug));
            return [...prev, ...filteredCustom];
          });
        }
      });
  }, [slug]);

  const post = allBlogPosts.find(p => p.slug === slug);

  // Table of Contents state and observer
  const headings = useMemo(() => {
    if (!post) return [];
    return post.body
      .trim()
      .split('\n\n')
      .filter(segment => segment.startsWith('**') && segment.endsWith('**'))
      .map(segment => segment.slice(2, -2));
  }, [post]);

  const [activeHeading, setActiveHeading] = useState('');

  useEffect(() => {
    if (!post) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting);
        if (visibleEntry) {
          setActiveHeading(visibleEntry.target.id);
        }
      },
      { rootMargin: '-120px 0px -70% 0px', threshold: 0 }
    );

    headings.forEach((heading) => {
      const id = heading.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [post, headings]);

  // Link copy state
  const [copied, setCopied] = useState(false);
  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isMounted) {
    return (
      <main className="min-h-screen bg-[#020202] flex flex-col items-center justify-center p-6 text-center text-white font-sans">
        <div className="max-w-md space-y-4">
          <div className="w-12 h-12 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-center mx-auto text-gray-500 shadow-inner">
            <Clock className="w-5 h-5 opacity-40 animate-spin text-[#00a3ff]" />
          </div>
          <p className="text-gray-500 text-xs font-mono tracking-widest uppercase">Resolving Dispatch...</p>
        </div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="min-h-screen bg-[#020202] flex flex-col items-center justify-center p-6 text-center text-white font-sans">
        <div className="max-w-md space-y-4">
          <h1 className="text-xl font-bold tracking-tight text-white uppercase">Dispatch Not Found</h1>
          <p className="text-gray-500 text-xs leading-relaxed">
            The technical dispatch requested could not be resolved from local index database.
          </p>
          <Link href="/blog" className="inline-block px-5 py-2.5 bg-white text-black hover:bg-gray-200 text-xs font-bold uppercase tracking-wider rounded-xl transition-all">
            Return to Dispatches
          </Link>
        </div>
      </main>
    );
  }

  const Cover = post.cover;
  const postAuthorObj = useMemo(() => {
    if (!post || !post.author) return null;
    const authorName = post.author.toLowerCase().replace(/\s+/g, ' ').trim();
    return authorsList.find(a => a.name.toLowerCase().replace(/\s+/g, ' ').trim() === authorName);
  }, [post, authorsList]);

  const authorAgeAndDOB = useMemo(() => {
    if (!postAuthorObj || !postAuthorObj.dateOfBirth) return "";
    
    // Parse DOB string
    const d = new Date(postAuthorObj.dateOfBirth);
    if (isNaN(d.getTime())) return "";

    // Age calculation
    const today = new Date();
    let age = today.getFullYear() - d.getFullYear();
    const m = today.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < d.getDate())) {
      age--;
    }

    // Format birth date
    const formattedDate = d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return `${formattedDate} (Age ${age})`;
  }, [postAuthorObj]);
  const related = allBlogPosts.filter(p => p.id !== post.id && p.category === post.category).slice(0, 2);
  const relatedFallback = allBlogPosts.filter(p => p.id !== post.id).slice(0, 2);
  const relatedPosts = related.length > 0 ? related : relatedFallback;

  // Parse body into premium visual segments
  const segments = post.body.trim().split('\n\n').map((segment, i) => {
    // 1. Headings: **Heading**
    if (segment.startsWith('**') && segment.endsWith('**')) {
      const headingText = segment.slice(2, -2);
      const headingId = headingText.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return (
        <h3 key={i} id={headingId} className="scroll-mt-36 text-2xl md:text-3xl font-black text-white tracking-tight mt-16 mb-6">
          {headingText}
        </h3>
      );
    }

    // 2. Progression Chain: e.g. "220M → 500M → 1B → 3B → 7B → 13B → 70B → 390B"
    if (segment.includes('→') && (segment.includes('220M') || segment.includes('7B'))) {
      const items = segment.split('→').map(s => s.trim());
      return (
        <div key={i} className="my-10 p-8 bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-x-auto scrollbar-hide">
          <p className="text-[9px] font-mono text-[#00a3ff] tracking-[0.3em] uppercase mb-6">Execution Phase Progression</p>
          <div className="flex items-center gap-4 min-w-[620px] py-2">
            {items.map((item, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && (
                  <div className="flex items-center">
                    <ArrowRight className="w-3.5 h-3.5 text-[#00a3ff]/40" />
                  </div>
                )}
                <div className={`px-4 py-3 rounded-lg border font-mono text-xs flex flex-col items-center justify-center min-w-[80px] transition-all duration-500 ${
                  idx === 0
                    ? 'bg-[#00a3ff]/10 border-[#00a3ff]/40 text-[#00a3ff] shadow-[0_0_15px_rgba(0,163,255,0.2)]'
                    : idx === items.length - 1
                    ? 'bg-white/10 border-white/20 text-white font-bold'
                    : 'bg-white/[0.02] border-white/5 text-gray-500'
                }`}>
                  <span className="text-[7px] opacity-40 uppercase tracking-widest mb-1">STAGE {idx+1}</span>
                  <span className="font-black">{item}</span>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      );
    }

    // 3. Percentage breakdown parser: e.g. "tensors (60%), cache (30%), fragmentation (10%)"
    const pctMatches = [...segment.matchAll(/([A-Za-z0-9\s\-_',]+)\s*\((\d+)%\)/g)];
    if (pctMatches.length >= 2) {
      return (
        <div key={i} className="my-10 p-8 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
          <p className="text-[9px] font-mono text-[#00a3ff] tracking-[0.3em] uppercase mb-6">Optimization Contribution Breakdown</p>
          <div className="flex flex-col gap-6">
            {pctMatches.map((match, idx) => {
              const label = match[1].replace(/^(and|source:)\s+/i, '').trim();
              const pct = parseInt(match[2]);
              return (
                <div key={idx} className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-gray-400 font-medium capitalize">{label}</span>
                    <span className="text-[#00a3ff] font-bold">{pct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-[#00a3ff] to-[#00d1ff] rounded-full shadow-[0_0_8px_rgba(0,163,255,0.4)]"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // 4. Standard text paragraphs
    const parts = segment.split(/(\*\*[^*]+\*\*)/g);
    return (
      <p key={i} className="text-gray-400 text-base md:text-lg font-medium leading-[1.9] mb-0">
        {parts.map((part, j) =>
          part.startsWith('**') && part.endsWith('**')
            ? <strong key={j} className="text-white font-black">{part.slice(2, -2)}</strong>
            : part
        )}
      </p>
    );
  });

  return (
    <main className="min-h-screen bg-[#020202] relative overflow-hidden">
      
      {/* Subtle background glows */}
      <div className="absolute top-[15%] left-[-15%] w-[50%] h-[40%] bg-[#00a3ff]/3 blur-[140px] rounded-full pointer-events-none z-0" />
      <div className="absolute top-[60%] right-[-15%] w-[45%] h-[35%] bg-[#00a3ff]/2 blur-[130px] rounded-full pointer-events-none z-0" />

      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-[3px] bg-white/[0.02] z-[101]">
        <div
          className="h-full bg-gradient-to-r from-[#00a3ff] via-[#00d1ff] to-[#00a3ff] shadow-[0_0_10px_rgba(0,163,255,0.8)] transition-all duration-100 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Back nav */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 pt-32 pb-8 relative z-10">
        <Link href="/blog" className="inline-flex items-center gap-3 text-gray-600 hover:text-white transition-colors group cursor-pointer">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] font-mono">Back to Dispatch</span>
        </Link>
      </div>

      {/* Article header */}
      <header className="max-w-[1400px] mx-auto px-6 md:px-12 pb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-[900px]"
        >
          <div className="flex flex-wrap items-center gap-4 mb-8 font-mono">
            <span className="text-[9px] font-black text-[#00a3ff] bg-[#00a3ff]/10 border border-[#00a3ff]/20 px-3 py-1.5 uppercase tracking-[0.3em] rounded-sm">
              {post.category}
            </span>
            <span className="text-[9px] font-mono text-gray-600 tracking-widest">{post.tag}</span>
            <div className="w-px h-3 bg-white/10" />
            <div className="flex items-center gap-1.5 text-gray-600">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-[9px] font-mono tracking-widest">{post.readTime}</span>
            </div>
            <div className="w-px h-3 bg-white/10" />
            <span className="text-[9px] font-mono text-gray-600 tracking-widest">{post.date}</span>
            <div className="w-px h-3 bg-white/10" />
            <span className="text-[9px] font-mono text-[#00a3ff] tracking-widest uppercase">by {post.author || "Introlic Team"}</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-[1.05] mb-10">
            {post.title}
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 font-medium leading-relaxed border-l-4 border-[#00a3ff] pl-8 py-2">
            {post.excerpt}
          </p>
        </motion.div>
      </header>

      {/* Cover art container */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 mb-24 relative z-10">
        <div className="relative h-64 md:h-[480px] rounded-[32px] overflow-hidden border border-white/5 shadow-2xl group">
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0),rgba(255,255,255,0)_50%,rgba(0,163,255,0.02)_50%,rgba(0,163,255,0.02))] bg-[size:100%_4px] pointer-events-none opacity-30 z-10" />
          {post.thumbnailUrl || post.thumbnail_url ? (
            <NextImage
              src={post.thumbnailUrl || post.thumbnail_url || ""}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-[1.02] transition-transform duration-1000 ease-out"
              priority
            />
          ) : (
            <Cover />
          )}
          {/* Cyber corners */}
          <div className="absolute top-0 left-0 w-4.5 h-4.5 border-t border-l border-white/30 z-10" />
          <div className="absolute top-0 right-0 w-4.5 h-4.5 border-t border-r border-white/30 z-10" />
          <div className="absolute bottom-0 left-0 w-4.5 h-4.5 border-b border-l border-white/30 z-10" />
          <div className="absolute bottom-0 right-0 w-4.5 h-4.5 border-b border-r border-white/30 z-10" />
        </div>
      </div>

      {/* Main Grid Layout for Editorial Content */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 pb-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Left Column: Article Content */}
          <motion.article
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="lg:col-span-8 flex flex-col gap-8 text-gray-300 relative z-10"
          >
            {segments}

            {/* Contributors Section */}
            {post.showContributors && post.contributors && post.contributors.length > 0 && (
              <div className="mt-20 pt-10 border-t border-white/[0.06]">
                <p className="text-[9px] font-mono text-gray-500 tracking-[0.35em] uppercase mb-8">
                  Contributors & Researchers
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {post.contributors.map((contrib, idx) => {
                    const matchedAuthor = authorsList.find(
                      a => a.name.toLowerCase().replace(/\s+/g, ' ').trim() === contrib.name.toLowerCase().replace(/\s+/g, ' ').trim()
                    );
                    
                    const initials = contrib.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2);

                    return (
                      <div
                        key={idx}
                        className="relative p-5 rounded-2xl bg-white/[0.01] border border-white/[0.04] flex gap-4 items-start group hover:border-[#00a3ff]/20 hover:bg-white/[0.02] transition-all duration-350"
                      >
                        {/* Avatar */}
                        {matchedAuthor?.avatar ? (
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-white/10 shrink-0">
                            <NextImage
                              src={matchedAuthor.avatar}
                              alt={contrib.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 flex items-center justify-center text-white/80 font-black text-sm select-none shrink-0 group-hover:from-[#00a3ff]/10 group-hover:border-[#00a3ff]/20 transition-all duration-300">
                            {initials || "U"}
                          </div>
                        )}

                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="text-sm font-bold text-white tracking-tight group-hover:text-[#00a3ff] transition-colors duration-300">
                            {contrib.name}
                          </span>
                          <span className="text-[10px] text-gray-500 font-mono mt-0.5 uppercase tracking-wider">
                            {contrib.role || "Contributor"}
                          </span>
                          {matchedAuthor?.bio && (
                            <p className="text-xs text-gray-400 mt-2 font-normal leading-relaxed line-clamp-2">
                              {matchedAuthor.bio}
                            </p>
                          )}

                          {/* Social links */}
                          {matchedAuthor?.socialLinks && Object.values(matchedAuthor.socialLinks).some(link => link) && (
                            <div className="flex items-center gap-2.5 mt-3 pt-3 border-t border-white/[0.04]">
                              {matchedAuthor.socialLinks.twitter && (
                                <a
                                  href={matchedAuthor.socialLinks.twitter}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-6 h-6 rounded-md bg-white/[0.02] border border-white/5 hover:border-[#00a3ff]/30 hover:bg-[#00a3ff]/5 text-gray-400 hover:text-[#00a3ff] flex items-center justify-center transition-all duration-300"
                                  title="Twitter/X"
                                >
                                  <XIcon className="w-3 h-3" />
                                </a>
                              )}
                              {matchedAuthor.socialLinks.linkedin && (
                                <a
                                  href={matchedAuthor.socialLinks.linkedin}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-6 h-6 rounded-md bg-white/[0.02] border border-white/5 hover:border-[#00a3ff]/30 hover:bg-[#00a3ff]/5 text-gray-400 hover:text-[#00a3ff] flex items-center justify-center transition-all duration-300"
                                  title="LinkedIn"
                                >
                                  <LinkedinIcon className="w-3 h-3" />
                                </a>
                              )}
                              {matchedAuthor.socialLinks.github && (
                                <a
                                  href={matchedAuthor.socialLinks.github}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-6 h-6 rounded-md bg-white/[0.02] border border-white/5 hover:border-[#00a3ff]/30 hover:bg-[#00a3ff]/5 text-gray-400 hover:text-[#00a3ff] flex items-center justify-center transition-all duration-300"
                                  title="GitHub"
                                >
                                  <GithubIcon className="w-3 h-3" />
                                </a>
                              )}
                              {matchedAuthor.socialLinks.website && (
                                <a
                                  href={matchedAuthor.socialLinks.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-6 h-6 rounded-md bg-white/[0.02] border border-white/5 hover:border-[#00a3ff]/30 hover:bg-[#00a3ff]/5 text-gray-400 hover:text-[#00a3ff] flex items-center justify-center transition-all duration-300"
                                  title="Website"
                                >
                                  <Link2 className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Mobile Author section */}
            {postAuthorObj && (
              <div className="mt-16 pt-8 border-t border-white/[0.04] flex flex-col gap-4 lg:hidden">
                <p className="text-[9px] font-mono text-gray-600 tracking-[0.3em] uppercase">About the Author</p>
                <div className="relative p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden group shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                  {/* Subtle background gradient glow */}
                  <div className="absolute -inset-px bg-gradient-to-r from-[#00a3ff]/10 via-[#00d1ff]/5 to-[#00a3ff]/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                  
                  <div className="relative z-10 flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      {/* Avatar Initials */}
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00a3ff]/20 to-[#00d1ff]/10 border border-[#00a3ff]/30 flex items-center justify-center text-white font-black text-sm select-none shadow-[0_4px_12px_rgba(0,163,255,0.15)]">
                        {postAuthorObj.name ? postAuthorObj.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) : 'A'}
                      </div>
                      <div className="flex flex-col">
                        <h4 className="text-sm font-black text-white tracking-tight">{postAuthorObj.name}</h4>
                        {authorAgeAndDOB && (
                          <span className="text-[10px] text-gray-500 font-mono mt-0.5">{authorAgeAndDOB}</span>
                        )}
                      </div>
                    </div>
                    {postAuthorObj.bio && (
                      <p className="text-xs text-gray-400 leading-relaxed font-medium">
                        {postAuthorObj.bio}
                      </p>
                    )}
                    {postAuthorObj.socialLinks && Object.values(postAuthorObj.socialLinks).some(link => link) && (
                      <div className="flex flex-wrap items-center gap-2.5 mt-2 pt-4 border-t border-white/[0.04]">
                        {postAuthorObj.socialLinks.twitter && (
                          <a href={postAuthorObj.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-lg bg-white/[0.02] border border-white/5 hover:border-[#00a3ff]/30 hover:bg-[#00a3ff]/5 text-gray-400 hover:text-[#00a3ff] flex items-center justify-center transition-all duration-300" title="Twitter/X">
                            <XIcon className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {postAuthorObj.socialLinks.linkedin && (
                          <a href={postAuthorObj.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-lg bg-white/[0.02] border border-white/5 hover:border-[#00a3ff]/30 hover:bg-[#00a3ff]/5 text-gray-400 hover:text-[#00a3ff] flex items-center justify-center transition-all duration-300" title="LinkedIn">
                            <LinkedinIcon className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {postAuthorObj.socialLinks.github && (
                          <a href={postAuthorObj.socialLinks.github} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-lg bg-white/[0.02] border border-white/5 hover:border-[#00a3ff]/30 hover:bg-[#00a3ff]/5 text-gray-400 hover:text-[#00a3ff] flex items-center justify-center transition-all duration-300" title="GitHub">
                            <GithubIcon className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {postAuthorObj.socialLinks.instagram && (
                          <a href={postAuthorObj.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-lg bg-white/[0.02] border border-white/5 hover:border-[#00a3ff]/30 hover:bg-[#00a3ff]/5 text-gray-400 hover:text-[#00a3ff] flex items-center justify-center transition-all duration-300" title="Instagram">
                            <InstagramIcon className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {postAuthorObj.socialLinks.youtube && (
                          <a href={postAuthorObj.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-lg bg-white/[0.02] border border-white/5 hover:border-[#00a3ff]/30 hover:bg-[#00a3ff]/5 text-gray-400 hover:text-[#00a3ff] flex items-center justify-center transition-all duration-300" title="YouTube">
                            <YouTubeIcon className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {postAuthorObj.socialLinks.discord && (
                          <a href={postAuthorObj.socialLinks.discord} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-lg bg-white/[0.02] border border-white/5 hover:border-[#00a3ff]/30 hover:bg-[#00a3ff]/5 text-gray-400 hover:text-[#00a3ff] flex items-center justify-center transition-all duration-300" title="Discord">
                            <DiscordIcon className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {postAuthorObj.socialLinks.website && (
                          <a href={postAuthorObj.socialLinks.website} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-lg bg-white/[0.02] border border-white/5 hover:border-[#00a3ff]/30 hover:bg-[#00a3ff]/5 text-gray-400 hover:text-[#00a3ff] flex items-center justify-center transition-all duration-300" title="Website">
                            <Link2 className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Share section */}
            <div className="mt-16 pt-8 border-t border-white/[0.04] flex flex-col gap-4 lg:hidden">
              <p className="text-[9px] font-mono text-gray-600 tracking-[0.3em] uppercase">Share Dispatch</p>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    const url = encodeURIComponent(window.location.href);
                    const text = encodeURIComponent(post.title);
                    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
                  }}
                  className="px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] text-[10px] font-mono uppercase tracking-wider text-gray-400 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <svg className="w-3 h-3 text-[#00a3ff]" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.261 5.633zM17.08 20.08h1.833L7.084 4.126H5.117z"/></svg>
                  X / Twitter
                </button>
                <button
                  onClick={() => {
                    const url = encodeURIComponent(window.location.href);
                    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
                  }}
                  className="px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] text-[10px] font-mono uppercase tracking-wider text-gray-400 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <svg className="w-3 h-3 text-[#00a3ff]" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  LinkedIn
                </button>
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] text-[10px] font-mono uppercase tracking-wider text-gray-400 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-green-500" /> : <Link2 className="w-3 h-3 text-[#00a3ff]" />}
                  {copied ? 'Copied' : 'Copy Link'}
                </button>
              </div>
            </div>
          </motion.article>

          {/* Right Column: Sticky Sidebar (TOC & Share) */}
          <aside className="lg:col-span-4 hidden lg:block relative z-10">
            <div className="sticky top-[140px] flex flex-col gap-10 border-l border-white/[0.04] pl-8">
              
              {/* About the Author Card */}
              {postAuthorObj && (
                <div className="relative p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden group shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                  {/* Subtle background gradient glow */}
                  <div className="absolute -inset-px bg-gradient-to-r from-[#00a3ff]/10 via-[#00d1ff]/5 to-[#00a3ff]/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                  
                  <div className="relative z-10 flex flex-col gap-4">
                    <p className="text-[9px] font-mono text-gray-600 tracking-[0.3em] uppercase">About the Author</p>
                    
                    <div className="flex items-center gap-3">
                      {/* Avatar Initials */}
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00a3ff]/20 to-[#00d1ff]/10 border border-[#00a3ff]/30 flex items-center justify-center text-white font-black text-sm select-none shadow-[0_4px_12px_rgba(0,163,255,0.15)]">
                        {postAuthorObj.name ? postAuthorObj.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) : 'A'}
                      </div>
                      
                      <div className="flex flex-col">
                        <h4 className="text-sm font-black text-white tracking-tight">{postAuthorObj.name}</h4>
                        {authorAgeAndDOB && (
                          <span className="text-[10px] text-gray-500 font-mono mt-0.5">{authorAgeAndDOB}</span>
                        )}
                      </div>
                    </div>

                    {postAuthorObj.bio && (
                      <p className="text-xs text-gray-400 leading-relaxed font-medium">
                        {postAuthorObj.bio}
                      </p>
                    )}

                    {/* Social Handles */}
                    {postAuthorObj.socialLinks && Object.values(postAuthorObj.socialLinks).some(link => link) && (
                      <div className="flex flex-wrap items-center gap-2.5 mt-2 pt-4 border-t border-white/[0.04]">
                        {postAuthorObj.socialLinks.twitter && (
                          <a href={postAuthorObj.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-lg bg-white/[0.02] border border-white/5 hover:border-[#00a3ff]/30 hover:bg-[#00a3ff]/5 text-gray-400 hover:text-[#00a3ff] flex items-center justify-center transition-all duration-300" title="Twitter/X">
                            <XIcon className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {postAuthorObj.socialLinks.linkedin && (
                          <a href={postAuthorObj.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-lg bg-white/[0.02] border border-white/5 hover:border-[#00a3ff]/30 hover:bg-[#00a3ff]/5 text-gray-400 hover:text-[#00a3ff] flex items-center justify-center transition-all duration-300" title="LinkedIn">
                            <LinkedinIcon className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {postAuthorObj.socialLinks.github && (
                          <a href={postAuthorObj.socialLinks.github} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-lg bg-white/[0.02] border border-white/5 hover:border-[#00a3ff]/30 hover:bg-[#00a3ff]/5 text-gray-400 hover:text-[#00a3ff] flex items-center justify-center transition-all duration-300" title="GitHub">
                            <GithubIcon className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {postAuthorObj.socialLinks.instagram && (
                          <a href={postAuthorObj.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-lg bg-white/[0.02] border border-white/5 hover:border-[#00a3ff]/30 hover:bg-[#00a3ff]/5 text-gray-400 hover:text-[#00a3ff] flex items-center justify-center transition-all duration-300" title="Instagram">
                            <InstagramIcon className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {postAuthorObj.socialLinks.youtube && (
                          <a href={postAuthorObj.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-lg bg-white/[0.02] border border-white/5 hover:border-[#00a3ff]/30 hover:bg-[#00a3ff]/5 text-gray-400 hover:text-[#00a3ff] flex items-center justify-center transition-all duration-300" title="YouTube">
                            <YouTubeIcon className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {postAuthorObj.socialLinks.discord && (
                          <a href={postAuthorObj.socialLinks.discord} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-lg bg-white/[0.02] border border-white/5 hover:border-[#00a3ff]/30 hover:bg-[#00a3ff]/5 text-gray-400 hover:text-[#00a3ff] flex items-center justify-center transition-all duration-300" title="Discord">
                            <DiscordIcon className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {postAuthorObj.socialLinks.website && (
                          <a href={postAuthorObj.socialLinks.website} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-lg bg-white/[0.02] border border-white/5 hover:border-[#00a3ff]/30 hover:bg-[#00a3ff]/5 text-gray-400 hover:text-[#00a3ff] flex items-center justify-center transition-all duration-300" title="Website">
                            <Link2 className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Table of Contents */}
              {headings.length > 0 && (
                <div className="flex flex-col gap-4">
                  <p className="text-[9px] font-mono text-gray-600 tracking-[0.3em] uppercase">Table of Contents</p>
                  <nav className="flex flex-col gap-3">
                    {headings.map((heading) => {
                      const id = heading.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                      const isActive = activeHeading === id;
                      return (
                        <a
                          key={id}
                          href={`#${id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className={`group flex items-center gap-3 text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
                            isActive ? 'text-[#00a3ff] pl-2' : 'text-gray-500 hover:text-gray-300'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                            isActive ? 'bg-[#00a3ff] scale-100' : 'bg-transparent scale-0 group-hover:scale-100 group-hover:bg-gray-700'
                          }`} />
                          <span className="truncate">{heading}</span>
                        </a>
                      );
                    })}
                  </nav>
                </div>
              )}

              {/* Share Widget */}
              <div className="flex flex-col gap-4">
                <p className="text-[9px] font-mono text-gray-600 tracking-[0.3em] uppercase">Share Dispatch</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      const url = encodeURIComponent(window.location.href);
                      const text = encodeURIComponent(post.title);
                      window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
                    }}
                    className="w-9 h-9 rounded-full bg-white/[0.03] border border-white/[0.06] hover:border-[#00a3ff]/30 hover:bg-[#00a3ff]/5 text-gray-400 hover:text-[#00a3ff] flex items-center justify-center transition-all duration-300 cursor-pointer"
                    title="Share on X"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.261 5.633zM17.08 20.08h1.833L7.084 4.126H5.117z"/></svg>
                  </button>
                  <button
                    onClick={() => {
                      const url = encodeURIComponent(window.location.href);
                      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
                    }}
                    className="w-9 h-9 rounded-full bg-white/[0.03] border border-white/[0.06] hover:border-[#00a3ff]/30 hover:bg-[#00a3ff]/5 text-gray-400 hover:text-[#00a3ff] flex items-center justify-center transition-all duration-300 cursor-pointer"
                    title="Share on LinkedIn"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </button>
                  <button
                    onClick={handleCopyLink}
                    className="w-9 h-9 rounded-full bg-white/[0.03] border border-white/[0.06] hover:border-[#00a3ff]/30 hover:bg-[#00a3ff]/5 text-gray-400 hover:text-[#00a3ff] flex items-center justify-center transition-all duration-300 relative cursor-pointer"
                    title="Copy Link"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-green-500" />
                    ) : (
                      <Link2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                  {copied && (
                    <span className="text-[10px] font-mono text-green-500">Copied!</span>
                  )}
                </div>
              </div>

            </div>
          </aside>
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-24" />
      </div>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-6 md:px-12 pb-32 relative z-10">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-8 h-px bg-[#00a3ff]" />
            <span className="text-[10px] font-black text-[#00a3ff] tracking-[0.4em] uppercase font-mono">Continue Reading</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedPosts.map((related) => {
              const RelatedCover = related.cover;
              return (
                <Link key={related.id} href={`/blog/${related.slug}`} className="group block cursor-pointer">
                  <div className="relative bg-[#070707] border border-white/[0.06] rounded-[20px] overflow-hidden hover:border-[#00a3ff]/30 hover:shadow-[0_0_30px_rgba(0,163,255,0.06)] transition-all duration-700 flex flex-col justify-between min-h-[300px]">
                    
                    {/* Cyber corners */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20 group-hover:border-[#00a3ff]/45 transition-colors" />
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20 group-hover:border-[#00a3ff]/45 transition-colors" />
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20 group-hover:border-[#00a3ff]/45 transition-colors" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20 group-hover:border-[#00a3ff]/45 transition-colors" />

                    <div className="relative flex flex-col flex-1">
                      {/* Cover */}
                      <div className="relative h-32 overflow-hidden shrink-0 border-b border-white/[0.06]">
                        <div className="absolute inset-0 scale-100 group-hover:scale-[1.04] transition-transform duration-700">
                          <RelatedCover />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-transparent to-transparent" />
                        <div className="absolute top-3 left-3">
                          <span className="text-[7px] font-black text-[#00a3ff] bg-black/85 backdrop-blur-sm border border-[#00a3ff]/20 px-2.5 py-1 uppercase tracking-[0.2em] rounded-sm">
                            {related.category}
                          </span>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="relative flex flex-col flex-1 p-5 gap-3">
                        <div className="flex items-center gap-2 font-mono text-[8px] text-gray-500 tracking-wider">
                          <span>{related.date}</span>
                          <div className="w-1.5 h-1.5 rounded-full bg-[#00a3ff]/40" />
                          <span>{related.readTime}</span>
                        </div>
                        <h3 className="text-base font-black text-white tracking-tight leading-snug group-hover:text-[#00a3ff] transition-colors duration-450">
                          {related.title}
                        </h3>
                      </div>
                    </div>

                    {/* Bottom strip */}
                    <div className="relative p-5 pt-0">
                      <div className="flex items-center justify-between pt-3 border-t border-white/[0.05]">
                        <span className="text-[8px] font-mono text-[#00a3ff]/50 tracking-widest uppercase">{related.tag}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-[#00a3ff] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                      </div>
                    </div>

                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}

