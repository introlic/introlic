"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { categories } from './BlogData';

interface BlogFilterBarProps {
  active: string;
  onChange: (cat: string) => void;
}

export default function BlogFilterBar({ active, onChange }: BlogFilterBarProps) {
  return (
    <div className="sticky top-20 z-40 bg-[#020202]/90 backdrop-blur-xl border-b border-white/5 py-5">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide pb-1">
          <span className="text-[9px] font-mono text-gray-700 tracking-[0.3em] uppercase shrink-0 hidden md:block">
            Filter //
          </span>
          <div className="flex items-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onChange(cat)}
                className="relative shrink-0 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300"
              >
                {active === cat && (
                  <motion.div
                    layoutId="filter-pill"
                    className="absolute inset-0 bg-[#00a3ff]/10 border border-[#00a3ff]/30 rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <span className={`relative z-10 transition-colors duration-300 ${active === cat ? 'text-[#00a3ff]' : 'text-gray-600 hover:text-gray-400'}`}>
                  {cat}
                </span>
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-3 shrink-0 hidden md:flex">
            <div className="w-px h-4 bg-white/10" />
            <span className="text-[9px] font-mono text-gray-700 tracking-widest uppercase">
              Sorted: Latest
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
