"use client";

import React from 'react';
import { motion } from 'framer-motion';
import ForgeBackground from './ForgeBackground';

export default function ProjectsHero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-[#000000] overflow-hidden pt-24">

      {/* ── PARTICLE MESH ── */}
      <ForgeBackground />

      {/* Radial vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(0,0,0,0.88)_100%)] z-[2]" />
      <div className="absolute bottom-0 left-0 w-full h-28 bg-gradient-to-t from-[#020202] to-transparent z-[3]" />

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          {/* Label */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-px bg-[#00a3ff]" />
            <span className="text-[10px] md:text-xs font-black tracking-[0.4em] uppercase text-[#00a3ff]">
              Initiative Board // Active & Upcoming
            </span>
            <div className="w-12 h-px bg-[#00a3ff]" />
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl sm:text-6xl md:text-8xl lg:text-[10rem] font-black text-white tracking-tightest leading-[0.85] mb-8 sm:mb-12">
            What We Are<br />
            <span className="italic text-[#00a3ff]">Building.</span>
          </h1>

          {/* Subtext */}
          <p className="text-base sm:text-lg md:text-3xl text-gray-500 font-medium max-w-3xl leading-relaxed px-2 sm:px-4">
            Projects we start, share, and open to contributors.{' '}
            <span className="text-white">Read about the why, or join the effort.</span>
          </p>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-20 z-10 pointer-events-none"
      >
        <span className="text-[9px] font-mono tracking-widest uppercase">Browse Projects</span>
        <div className="w-px h-10 bg-gradient-to-b from-[#00a3ff] to-transparent" />
      </motion.div>
    </section>
  );
}
