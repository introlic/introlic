"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { COLORS } from '@/constants/branding';

type SectorProps = {
  id: string;
  tag?: string;
  metric: string;
  label: string;
  body: string;
  className?: string;
  metricSize?: 'xl' | 'lg' | 'md';
};

const Sector = ({ tag, metric, label, body, className = "", metricSize = 'md' }: SectorProps) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const sizeClasses = {
    xl: 'text-6xl sm:text-7xl md:text-[14rem]',
    lg: 'text-5xl sm:text-6xl md:text-[9rem]',
    md: 'text-5xl md:text-[6rem]'
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative px-6 py-10 md:p-14 group border-white/[0.03] transition-colors duration-500 ${className}`}
      style={{ backgroundColor: isHovered ? COLORS.brand.blueDim : 'transparent' }}
    >
      {/* Blueprint IDs */}
      {tag && (
        <div className="flex justify-between items-start mb-12">
          <div className="flex items-center gap-2">
            <div
              className={`w-1.5 h-1.5 rounded-full ${isHovered ? 'animate-pulse' : ''}`}
              style={{ backgroundColor: isHovered ? COLORS.brand.blue : 'rgba(156, 163, 175, 0.4)' }}
            />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] transition-colors duration-300" style={{ color: isHovered ? COLORS.brand.blue : 'rgba(255, 255, 255, 0.4)' }}>
              {tag}
            </span>
          </div>
        </div>
      )}

      {/* Main Metric */}
      <div className="relative mb-8">
        <motion.div
          animate={isHovered ? {
            opacity: [1, 0.8, 1],
            x: [0, -1, 1, 0],
          } : {}}
          transition={{ duration: 0.1, repeat: isHovered ? Infinity : 0 }}
          className={`font-black tracking-tighter leading-none text-white transition-all duration-700 ${sizeClasses[metricSize]}`}
          style={{ color: isHovered ? COLORS.brand.blue : 'white' }}
        >
          {metric}
        </motion.div>
        <div className="flex items-center gap-3 mt-4">
          <div className="w-4 h-px" style={{ backgroundColor: COLORS.brand.blueMuted }} />
          <div className="text-xs font-black text-gray-600 uppercase tracking-[0.4em]">
            {label}
          </div>
        </div>
      </div>

      {/* Body Technical Description */}
      <div className="max-w-md relative">
        <p className="text-gray-500 text-sm font-medium leading-relaxed group-hover:text-gray-400 transition-colors duration-500">
          {body}
        </p>
      </div>

      {/* Grid scanning effect */}
      <div
        className="absolute top-0 right-0 w-px h-0 transition-all duration-1000 group-hover:h-full"
        style={{ background: `linear-gradient(to bottom, transparent, ${COLORS.brand.blueDim}, transparent)` }}
      />
      <div
        className="absolute bottom-0 left-0 w-0 h-px transition-all duration-1000 group-hover:w-full"
        style={{ background: `linear-gradient(to right, transparent, ${COLORS.brand.blueDim}, transparent)` }}
      />

      {/* Corner Brackets */}
      <div
        className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/10 group-hover:border-opacity-40 transition-colors"
        style={{ borderColor: isHovered ? COLORS.brand.blue : undefined }}
      />
      <div
        className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/10 group-hover:border-opacity-40 transition-colors"
        style={{ borderColor: isHovered ? COLORS.brand.blue : undefined }}
      />
    </div>
  );
};

export default function Capabilities() {
  return (
    <section id="capabilities" className="relative bg-[#020202] py-32 overflow-hidden selection:bg-[#00a3ff]/30 border-t border-white/5">

      {/* Background Blueprint Mesh */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '48px 48px' }} />

      <div className="max-w-[1600px] mx-auto px-8 md:px-12 relative z-10">

        {/* HEADER AREA - Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-20 items-end">
          <div className="lg:col-span-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-px" style={{ backgroundColor: COLORS.brand.blue }} />
              <span className="font-black tracking-[0.4em] uppercase text-xs" style={{ color: COLORS.brand.blue }}>LAUNCH PROTOCOL // V1</span>
            </div>
            <h2 className="text-5xl md:text-7xl lg:text-9xl font-black tracking-tightest leading-[0.85] text-white break-words">
              Core<br />
              <span className="italic" style={{ color: COLORS.brand.blue }}>Initiatives.</span>
            </h2>
          </div>
          <div className="lg:col-span-4 lg:text-right">
            <p className="text-xl text-gray-400 font-medium leading-relaxed mb-6">
              We are building the sovereign digital foundation. Introlic operates outside standard dependencies, engineering an independent system of models, search, and networks. <br />
              <span className="text-white">Zero foreign wrappers. Native metal execution.</span>
            </p>
            <div className="inline-flex items-center gap-3 border border-[#00a3ff]/20 px-5 py-3 bg-[#00a3ff]/5">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Introlic Runtime Environment // Active</span>
            </div>
          </div>
        </div>

        {/* ── THE PRODUCTION BLUEPRINT GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 border border-white/10">

          {/* Row 1: Sovereign LLM & Search */}
          <Sector
            id="01"
            tag="SOVEREIGN_LLM // MODEL"
            metric="First"
            label="Indian Foundational LLM"
            metricSize="xl"
            body="Engineered from the ground up in India, for the global stage. We are building the first fully sovereign, parallel-diffusion-based Large Language Model, breaking reliance on foreign model providers."
            className="lg:col-span-7 border-r lg:border-b"
          />

          <Sector
            id="02"
            tag="SEARCH_ENGINE // NODE"
            metric="Zero"
            label="Surveillance Search"
            metricSize="lg"
            body="A search index built on objective truth and mathematical retrieval. No tracking pixels, no ad-blocker wars, and zero data profiling. True independent discovery powered by parallel token reasoning."
            className="lg:col-span-5 lg:border-b"
          />

          {/* Row 2: Social, Self-dependence, Kernels */}
          <Sector
            id="03"
            tag="SOCIAL_NETWORK // PORTAL"
            metric="Own"
            label="Independent Social Engine"
            metricSize="md"
            body="Reclaiming the digital public square with an independent social platform. Decentralized data ownership and mathematical sovereignty to ensure free communication without narrative steering."
            className="lg:col-span-4 border-r lg:border-b"
          />

          <Sector
            id="04"
            tag="SELF_DEPENDENT // INFRA"
            metric="100%"
            label="Geographic Independence"
            metricSize="md"
            body="Aiming for full independence across our stack. Designing systems that bypass proprietary Western APIs and runtime locks, engineering localized infrastructure we own and control."
            className="lg:col-span-4 border-r lg:border-b"
          />

          <Sector
            id="05"
            tag="HARDWARE_KERNEL // BYPASS"
            metric="Silicon"
            label="Kernel Research"
            metricSize="md"
            body="Exploring direct hardware execution. Researching custom Triton/CUDA kernels to run code close to silicon, avoiding standard runtime layers to optimize efficiency on edge units."
            className="lg:col-span-4 lg:border-b"
          />

          {/* Row 3: Mission Summary Banner & Parallel Reasoning */}
          <div className="lg:col-span-8 p-8 md:p-14 border-r flex flex-col justify-center bg-white/[0.01]">
            <div className="flex gap-10 items-start">
              <div className="flex flex-col gap-6">
                <h4 className="text-3xl font-black text-white tracking-tighter">Sovereign Digital Infrastructure.</h4>
                <p className="text-gray-500 text-lg leading-relaxed max-w-2xl">
                  We are not building wrappers or white-label applications. We are engineering the full-stack substrate—from the model weights to the decentralized protocols—to put India at the center of the world&apos;s next technology wave.
                </p>
              </div>
            </div>
          </div>

          <Sector
            id="06"
            tag="PARALLEL_REASONING // LOGIC"
            metric="Parallel"
            label="Denoising Research"
            metricSize="md"
            body="Exploring parallel token generation to replace sequential autoregressive bottlenecks. Researching consistency denoising models for faster, mathematically predictable inference sweeps."
            className="lg:col-span-4"
          />
        </div>

      </div>

      {/* Blueprint Visual Brackets */}
      <div className="absolute top-10 left-10 w-20 h-20 border-t border-l border-white/10 pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-20 h-20 border-b border-r border-white/10 pointer-events-none" />
    </section>
  );
}
