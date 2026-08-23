"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, BookOpen } from 'lucide-react';

// ── Dynamic covers are imported from blog/BlogData ──

import { 
  BlogPost, 
  CoverIntrolicDWaves, 
  CoverIntrolicKMemory, 
  CoverXTStrategy, 
  CoverEdgeInference, 
  CoverKernelFusion 
} from './blog/BlogData';

export default function Blog() {
  const [allBlogPosts, setAllBlogPosts] = React.useState<BlogPost[]>([]);

  React.useEffect(() => {
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

    setTimeout(() => {
      setAllBlogPosts(customWithCovers);
    }, 0);
  }, []);

  if (allBlogPosts.length === 0) return null;

  const heroBlog = allBlogPosts[0];
  const sideBlog = allBlogPosts.slice(1, 3);

  return (
    <section id="blog" className="relative bg-[#020202] overflow-hidden selection:bg-[#00a3ff]/30 border-t border-white/[0.05] py-40">

      <div className="max-w-[1400px] mx-auto px-8 md:px-12 relative z-10">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <BookOpen className="w-4 h-4 text-[#00a3ff]" />
              <span className="text-[#00a3ff] font-bold tracking-[0.22em] uppercase text-xs">
                07 / Intelligence Dispatch
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter text-white leading-[0.88]">
              Latest from<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-700">
                The Press.
              </span>
            </h2>
          </div>
          <Link
            href="/blog"
            className="self-start lg:self-end flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#00a3ff] uppercase tracking-widest transition-colors group"
          >
            All Articles
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* ── EDITORIAL SPREAD ── */}
        <div className={`grid grid-cols-1 ${sideBlog.length > 0 ? 'lg:grid-cols-[3fr_2fr]' : ''} gap-px bg-white/[0.05] border border-white/[0.05]`}>

          {/* BLOG 01 — HERO (Left 60%) */}
          <Link href={`/blog/${heroBlog.slug}`} className="group block h-full">
            <motion.article
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative overflow-hidden bg-[#020202] cursor-pointer flex flex-col h-full"
            >
              {/* Cover Art — fills most of the card */}
              <div className="relative flex-1 min-h-[420px] lg:min-h-[520px] overflow-hidden">
                <div className="absolute inset-0 scale-100 group-hover:scale-[1.03] transition-transform duration-700 ease-out">
                  <heroBlog.cover />
                </div>
                {/* Strong bottom gradient mask */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-[#020202]/50 to-transparent" />

                {/* FEATURED badge top-left */}
                <div className="absolute top-6 left-6 flex items-center gap-3">
                  <span className="text-[9px] font-black text-[#00a3ff] bg-[#00a3ff]/15 border border-[#00a3ff]/20 px-3 py-1 uppercase tracking-[0.3em]">
                    {heroBlog.category}
                  </span>
                  <span className="text-[9px] font-mono text-gray-500 tracking-widest">{heroBlog.tag}</span>
                </div>

                {/* Title overlaid at the bottom of the cover */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
                    {heroBlog.title}
                  </h3>
                </div>
              </div>

              {/* Metadata strip — flex wrap for mobile */}
              <div className="flex flex-wrap items-center justify-between px-6 md:px-8 py-6 border-t border-white/[0.06] shrink-0 bg-[#020202] gap-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-gray-600 tracking-widest">{heroBlog.date}</span>
                  <span className="text-gray-700">·</span>
                  <span className="text-[10px] font-mono text-gray-600 tracking-widest">{heroBlog.readTime}</span>
                  <span className="text-gray-700">·</span>
                  <span className="text-[10px] font-mono text-gray-500 tracking-widest line-clamp-1 max-w-[200px]">{heroBlog.excerpt.slice(0, 60)}...</span>
                </div>
                <span className="flex items-center gap-1.5 text-[11px] font-black text-gray-500 group-hover:text-[#00a3ff] uppercase tracking-widest transition-colors shrink-0 ml-4">
                  Read
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.article>
          </Link>

          {/* BLOGS 02 & 03 — Right Column Stack (40%) */}
          {sideBlog.length > 0 && (
            <div className="flex flex-col gap-px bg-white/[0.05]">
              {sideBlog.map((blog, i) => {
                const Cover = blog.cover;
                return (
                  <Link key={blog.id} href={`/blog/${blog.slug}`} className="group block flex-1 flex flex-col">
                    <motion.article
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, delay: i * 0.15 }}
                      className="relative overflow-hidden bg-[#020202] cursor-pointer flex-1 flex flex-col h-full"
                    >
                      {/* Cover Art (smaller) */}
                      <div className="relative h-[200px] overflow-hidden">
                        <div className="absolute inset-0 scale-100 group-hover:scale-[1.04] transition-transform duration-700 ease-out">
                          <Cover />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#020202]/80 to-transparent" />
                        {/* Category tag overlaid */}
                        <div className="absolute top-4 left-4 flex items-center gap-2">
                          <span className="text-[9px] font-black text-[#00a3ff] bg-black/60 backdrop-blur-sm px-2.5 py-1 uppercase tracking-[0.25em]">
                            {blog.category}
                          </span>
                        </div>
                      </div>

                      {/* Article text */}
                      <div className="p-6 border-t border-white/[0.06] flex flex-col flex-1 justify-between">
                        <div>
                          <h3 className="text-lg md:text-xl font-black text-white tracking-tight leading-snug mb-3 group-hover:text-[#00a3ff] transition-colors duration-300">
                            {blog.title}
                          </h3>
                          <p className="text-gray-600 text-sm font-medium leading-relaxed line-clamp-2">
                            {blog.excerpt}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center justify-between mt-5 pt-5 border-t border-white/[0.04] gap-y-3">
                          <div className="flex items-center gap-3">
                            <span className="text-[9px] font-mono text-gray-600 tracking-widest">{blog.date}</span>
                            <span className="text-gray-700">·</span>
                            <span className="text-[9px] font-mono text-gray-600 tracking-widest">{blog.readTime}</span>
                          </div>
                          <ArrowUpRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-[#00a3ff] transition-colors" />
                        </div>
                      </div>
                    </motion.article>
                  </Link>
                );
              })}
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
