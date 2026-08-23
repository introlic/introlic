"use client";
import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { heroContainer, heroItem } from '@/constants/animations';
import { COLORS } from '@/constants/branding';
import { Zap, BookOpen, ArrowRight, Cpu, Layers, Globe } from 'lucide-react';

const FluidBackground = dynamic(() => import('./FluidBackground'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-white" />,
});

export default function Hero() {
  return (
    <section className="relative w-full min-h-svh bg-white overflow-hidden flex flex-col items-center justify-center pt-[92px] pb-12 sm:pb-0 sm:pt-[100px] md:pt-[80px]">

      {/* ── Fluid Canvas ── */}
      <div className="absolute inset-x-0 bottom-0 top-[80px] z-0 overflow-hidden">
        <FluidBackground />
      </div>

      {/* ── White center focus, lets fluid show on edges ── */}
      <div className="absolute inset-0 z-[1] pointer-events-none bg-[radial-gradient(ellipse_80%_70%_at_50%_50%,rgba(255,255,255,0.88)_0%,rgba(255,255,255,0.35)_60%,transparent_100%)]" />

      {/* ── Core Content ── */}
      <motion.div
        variants={heroContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 md:px-8 max-w-6xl w-full"
      >

        {/* ── Origin / Eyebrow Marker ── */}
        <motion.div
          variants={heroItem}
          className="flex items-center gap-2.5 sm:gap-3 mb-4 select-none"
        >
          {/* Desktop accent line */}
          <div className="hidden sm:block w-8 h-px" style={{ backgroundColor: `${COLORS.brand.blue}33` }} />
          
          {/* Mobile Badge / Desktop Text */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 sm:px-0 sm:py-0 rounded-full sm:rounded-none bg-white/90 sm:bg-transparent border sm:border-0 border-black/[0.08] shadow-sm sm:shadow-none backdrop-blur-md">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-40" style={{ backgroundColor: COLORS.brand.blue }}></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ backgroundColor: COLORS.brand.blue }}></span>
            </span>
            <span
              className="text-[9.5px] sm:text-[11px] font-black tracking-[0.18em] sm:tracking-[0.3em] uppercase text-gray-700 sm:text-gray-500 font-mono sm:font-sans"
            >
              INDEPENDENT AI RESEARCH & SYSTEMS LAB
            </span>
          </div>
          
          {/* Desktop accent line */}
          <div className="hidden sm:block w-8 h-px" style={{ backgroundColor: `${COLORS.brand.blue}33` }} />
        </motion.div>

        {/* ── Main Headline: Balanced +15% Scale, Single Line on Desktop, Crisp on Mobile ── */}
        <div className="relative mb-3.5 sm:mb-4 w-full flex justify-center">
          {/* Backlit Atmospheric Glow */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-28 w-[105%] blur-[70px] rounded-full pointer-events-none" style={{ background: `linear-gradient(to right, transparent, ${COLORS.brand.blue}14, transparent)` }} />
          
          <motion.h1
            variants={heroItem}
            className="relative text-[1.95rem] xs:text-[2.2rem] sm:text-2xl md:text-[1.95rem] lg:text-[2.5rem] xl:text-[2.85rem] font-black tracking-tight sm:tracking-tightest leading-[1.18] sm:leading-tight text-center text-gray-900 sm:whitespace-nowrap max-w-[340px] xs:max-w-[400px] sm:max-w-none"
          >
            <span className="block sm:inline">Engineering High-Performance </span>
            <span 
              className="text-transparent bg-clip-text drop-shadow-[0_0_15px_rgba(0,163,255,0.3)] block sm:inline"
              style={{ backgroundImage: `linear-gradient(to bottom right, ${COLORS.brand.blue}, ${COLORS.brand.blueDeep}, ${COLORS.brand.blue})` }}
            >
              AI & Software Systems.
            </span>
          </motion.h1>
        </div>

        {/* ── Mobile Capability Badges (Mobile-only visual enhancement) ── */}
        <motion.div
          variants={heroItem}
          className="flex sm:hidden items-center justify-center gap-1.5 flex-wrap my-3 select-none"
        >
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] font-medium bg-black/[0.04] text-gray-700 border border-black/[0.06]">
            <Cpu className="w-3 h-3 text-[#00a3ff]" />
            Discrete Diffusion (DLM)
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] font-medium bg-black/[0.04] text-gray-700 border border-black/[0.06]">
            <Zap className="w-3 h-3 text-[#00a3ff]" />
            SEDD Architectures
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] font-medium bg-black/[0.04] text-gray-700 border border-black/[0.06]">
            <Layers className="w-3 h-3 text-[#00a3ff]" />
            Sovereign AI Systems
          </span>
        </motion.div>

        {/* ── Context Description ── */}
        <div className="flex flex-col items-center">
          <motion.p
            variants={heroItem}
            className="text-[0.92rem] sm:text-[1.05rem] md:text-[1.1rem] font-normal sm:font-medium text-gray-600 leading-[1.65] sm:leading-[1.7] max-w-[650px] mb-4 sm:mb-5 text-center px-1 sm:px-0"
          >
            Introlic is an independent technology lab focused on Discrete Diffusion Language Models (DLMs), SEDD architectures, and sovereign AI systems. We build self-correcting, unconstrained technology from first principles.
          </motion.p>

          {/* Tag */}
          <motion.div
            variants={heroItem}
            className="mb-6 sm:mb-8"
          >
            <span className="inline-flex items-center gap-2 text-[10.5px] sm:text-[11px] md:text-xs font-mono font-semibold tracking-[0.16em] sm:tracking-[0.25em] uppercase text-gray-500 sm:text-gray-400 bg-black/[0.03] sm:bg-transparent px-3 py-1 sm:px-0 sm:py-0 rounded-full sm:rounded-none border sm:border-0 border-black/[0.05]">
              <Globe className="w-3 h-3 text-gray-400 sm:hidden" />
              Founded in India • Building for the World
            </span>
          </motion.div>
        </div>

        {/* ── Action Buttons ── */}
        <motion.div
          variants={heroItem}
          className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-4 mt-2 sm:mt-1 w-full max-w-[320px] sm:max-w-none"
        >
          {/* Primary */}
          <Link
            href="/contact?subject=JOIN_MOVEMENT"
            className="group flex items-center justify-center gap-2.5 sm:gap-3 h-[48px] sm:h-[54px] w-full sm:w-[240px] rounded-full text-[14px] sm:text-[15px] font-black text-white transition-all duration-300 hover:scale-[1.03] active:scale-95 border border-transparent shadow-[0_6px_20px_rgba(0,163,255,0.3)] sm:shadow-[0_8px_28px_rgba(0,163,255,0.4)]"
            style={{
              backgroundColor: COLORS.brand.blue,
            }}
          >
            <Zap className="w-4 h-4 text-white group-hover:scale-110 transition-transform duration-300" />
            <span>Join the Movement</span>
          </Link>

          {/* Secondary: Direct Link to Documentation */}
          <Link
            href="/docs"
            className="group flex items-center justify-center gap-2.5 sm:gap-3 h-[48px] sm:h-[54px] w-full sm:w-[240px] rounded-full text-[14px] sm:text-[15px] font-bold text-gray-800 sm:text-gray-700 border border-gray-300/80 sm:border-gray-200 bg-white/90 sm:bg-white/80 backdrop-blur-md transition-all duration-300 hover:border-gray-400 hover:text-black hover:bg-white active:scale-95 shadow-sm"
          >
            <BookOpen className="w-4 h-4 text-gray-500 group-hover:text-black transition-colors duration-300" />
            <span>Introlic Documentation</span>
          </Link>
        </motion.div>

      </motion.div>

    </section>
  );
}
