"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { allPosts } from './BlogData';

export default function FeaturedPost() {
  const post = allPosts[0];
  if (!post) return null;
  const Cover = post.cover;

  return (
    <section className="relative bg-[#020202] pt-12 pb-0">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        
        {/* Header Label */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-8 h-px bg-[#00a3ff]/30" />
          <span className="text-[9px] font-mono text-[#00a3ff] tracking-[0.3em] uppercase">Featured Dispatch</span>
          <div className="flex-1 h-px bg-white/[0.04]" />
        </div>

        <Link href={`/blog/${post.slug}`} className="block group">
          <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden bg-[#070707] border border-white/[0.06] rounded-[24px] grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] min-h-[580px] group-hover:border-[#00a3ff]/30 group-hover:shadow-[0_0_50px_rgba(0,163,255,0.06)] transition-all duration-700"
          >
            {/* Cyber Brackets */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-white/20 group-hover:border-[#00a3ff]/50 transition-all duration-500" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/20 group-hover:border-[#00a3ff]/50 transition-all duration-500" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-white/20 group-hover:border-[#00a3ff]/50 transition-all duration-500" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white/20 group-hover:border-[#00a3ff]/50 transition-all duration-500" />

            {/* Left — Cover art */}
            <div className="relative overflow-hidden min-h-[320px] lg:min-h-0 rounded-t-[24px] lg:rounded-l-[24px] lg:rounded-tr-none border-b lg:border-b-0 lg:border-r border-white/[0.06] group-hover:border-[#00a3ff]/10 transition-colors duration-700">
              <div className="absolute inset-0 scale-100 group-hover:scale-[1.03] transition-transform duration-1000 ease-out">
                <Cover />
              </div>
              
              {/* Scanline / CRT overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0),rgba(255,255,255,0)_50%,rgba(0,163,255,0.04)_50%,rgba(0,163,255,0.04))] bg-[size:100%_4px] pointer-events-none opacity-40" />
              
              {/* Overlay shadow gradient */}
              <div className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-r from-transparent via-black/20 to-black/80 lg:to-[#070707]" />

              {/* Floating ID badge */}
              <div className="absolute top-6 left-6 flex items-center gap-2">
                <span className="text-[8px] font-black text-[#00a3ff] bg-black/80 backdrop-blur-sm border border-[#00a3ff]/30 px-3 py-1.5 uppercase tracking-[0.25em] rounded-sm">
                  {post.category}
                </span>
                <span className="text-[8px] font-mono text-gray-500 bg-black/80 backdrop-blur-sm border border-white/10 px-2.5 py-1.5 uppercase tracking-widest rounded-sm">
                  INTEL // {post.id}
                </span>
              </div>
            </div>

            {/* Right — Article content */}
            <div className="flex flex-col justify-between p-8 md:p-12 xl:p-16">
              <div>
                {/* Meta Row */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-[9px] font-mono text-gray-500 tracking-widest uppercase">{post.date}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00a3ff]/40" />
                  <span className="text-[9px] font-mono text-gray-500 tracking-widest uppercase">{post.readTime}</span>
                </div>

                {/* Title */}
                <h2 className="text-3xl md:text-4xl xl:text-5xl font-black text-white tracking-tighter leading-[1.05] mb-6 group-hover:text-[#00a3ff] transition-colors duration-500">
                  {post.title}
                </h2>

                {/* Excerpt */}
                <p className="text-gray-400 text-sm md:text-base font-medium leading-relaxed mb-8">
                  {post.excerpt}
                </p>

                {/* Spec Table (Cyberpunk touch) */}
                <div className="border border-white/[0.04] bg-white/[0.01] rounded-lg p-4 font-mono text-[9px] text-gray-500 flex flex-col gap-2.5 max-w-sm">
                  <div className="flex justify-between border-b border-white/[0.04] pb-1.5">
                    <span className="uppercase tracking-wider">Classification</span>
                    <span className="text-white font-bold">PUBLIC STREAM</span>
                  </div>
                  <div className="flex justify-between border-b border-white/[0.04] pb-1.5">
                    <span className="uppercase tracking-wider">Protocol Tag</span>
                    <span className="text-[#00a3ff] font-bold">{post.tag}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="uppercase tracking-wider">Revision Hash</span>
                    <span className="text-gray-400">0x88A3F...{post.id}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-6 mt-8 border-t border-white/[0.06]">
                <span className="text-[9px] font-mono text-[#00a3ff]/60 tracking-[0.2em] uppercase font-bold">
                  {"// READ INSTRUCTION SET"}
                </span>
                <div className="flex items-center gap-2 text-[#00a3ff] translate-x-2 group-hover:translate-x-0 transition-transform duration-500">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-400">Open Dispatch</span>
                  <div className="w-8 h-8 rounded-full bg-[#00a3ff]/5 border border-[#00a3ff]/15 flex items-center justify-center group-hover:bg-[#00a3ff] group-hover:text-black transition-colors duration-300">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </motion.article>
        </Link>

      </div>
    </section>
  );
}
