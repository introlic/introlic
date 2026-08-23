"use client";

import React from 'react';
import { motion } from 'framer-motion';
import InkBackground from './InkBackground';

export default function BlogHero() {
  return (
    <section className="relative flex flex-col items-center justify-center bg-[#000000] overflow-hidden pt-28 pb-6">
      {/* ── INTERACTIVE CANVAS BACKGROUND ── */}
      <InkBackground />

      {/* Atmospheric Soft Glow & Dark Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-[radial-gradient(circle_at_center,rgba(0,163,255,0.05)_0%,transparent_70%)] pointer-events-none z-[2] blur-[30px]" />
      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-[#020202] to-transparent z-[3]" />

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 relative z-10 w-full flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center py-6"
        >
          {/* Refined clean label */}
          <span className="text-[10px] font-mono tracking-[0.45em] uppercase text-gray-500 mb-4 select-none">
            Introlic // Dispatches
          </span>

          {/* Clean Cinematic Headline */}
          <h1 className="text-4xl sm:text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-black text-white tracking-tightest leading-none select-none">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00a3ff] to-[#00d1ff] font-extrabold italic">Press.</span>
          </h1>
        </motion.div>
      </div>
    </section>
  );
}
