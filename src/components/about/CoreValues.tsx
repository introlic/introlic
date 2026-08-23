"use client";

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Shield, Cpu, Globe, Users } from 'lucide-react';
import { staggerContainer, staggerItem } from '@/constants/animations';
import { COLORS } from '@/constants/branding';

// ── DATA ──────────────────────────────────────────────────────────────────────
const PILLARS = [
  {
    index: '01',
    icon: Shield,
    tag: 'Research Independence',
    headline: 'Building foundational model architectures from first principles.',
    body: 'Investigating alternatives like Discrete Diffusion (SEDD) so our technology stack is built on reproducible mathematical foundations rather than complete dependency on foreign closed-source APIs.',
    signal: 'Foundational Depth',
  },
  {
    index: '02',
    icon: Cpu,
    tag: 'Compute Efficiency',
    headline: 'Maximizing performance under constrained compute budgets.',
    body: 'Developing sample-efficient training pipelines and optimized noise schedules to make training and evaluating non-autoregressive models practical and cost-effective.',
    signal: 'Compute Optimization',
  },
  {
    index: '03',
    icon: Globe,
    tag: 'Empirical Transparency',
    headline: 'Open-access benchmarks, weights, and reproducible papers.',
    body: 'Publishing raw loss curves, ablation studies, and evaluation results openly. True scientific progress requires sharing what works and honestly documenting what fails.',
    signal: 'Open Science',
  },
  {
    index: '04',
    icon: Users,
    tag: 'Community & Ecosystem',
    headline: 'Empowering young engineers to build, modify, and question AI.',
    body: 'Through the IN1 initiative, we foster an open research culture in India where developers can explore deep-tech and foundational AI architectures from the ground up.',
    signal: 'IN1 Initiative',
  },
];

// ── PILLAR ROW (scroll-activated) ────────────────────────────────────────────
function PillarRow({ pillar, i }: { pillar: typeof PILLARS[0]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: '-30% 0px -30% 0px' });
  const Icon = pillar.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: i * 0.06 }}
      className={`group grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-10 py-10 lg:py-14 border-t transition-all duration-700 ${
        isInView ? 'border-[#00a3ff]/30' : 'border-white/[0.06]'
      }`}
    >
      {/* ── LEFT: Index + Icon ── */}
      <div className="lg:col-span-2 flex lg:flex-col items-center lg:items-start gap-5 lg:gap-3 pt-1">
        <span
          className={`font-mono text-4xl lg:text-5xl font-black leading-none transition-colors duration-700 tabular-nums ${
            isInView ? 'text-[#00a3ff]/25' : 'text-white/[0.06]'
          }`}
        >
          {pillar.index}
        </span>
        <div
          className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-700 ${
            isInView ? 'bg-[#00a3ff]/15 shadow-[0_0_20px_rgba(0,163,255,0.1)]' : 'bg-white/[0.04]'
          }`}
        >
          <Icon
            className={`w-5 h-5 transition-colors duration-700 ${isInView ? 'text-[#00a3ff]' : 'text-gray-700'}`}
          />
        </div>
      </div>

      {/* ── CENTER: Tag + Headline ── */}
      <div className="lg:col-span-4">
        <span
          className={`block text-[10px] font-black tracking-[0.25em] uppercase mb-3 transition-colors duration-700 ${
            isInView ? 'text-[#00a3ff]/70' : 'text-gray-700'
          }`}
        >
          {pillar.tag}
        </span>
        <h3
          className={`text-xl sm:text-2xl font-black tracking-tight leading-snug transition-colors duration-700 ${
            isInView ? 'text-white' : 'text-white/50'
          }`}
        >
          {pillar.headline}
        </h3>
      </div>

      {/* ── RIGHT: Body + Signal ── */}
      <div className="lg:col-span-5 lg:col-start-8 flex flex-col justify-between gap-6">
        <p
          className={`leading-relaxed font-medium text-sm sm:text-base transition-colors duration-700 ${
            isInView ? 'text-gray-400' : 'text-gray-700'
          }`}
        >
          {pillar.body}
        </p>
        <div className="flex items-center gap-3">
          <div
            className={`w-1.5 h-1.5 rounded-full transition-all duration-700 ${
              isInView ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' : 'bg-gray-800'
            }`}
          />
          <span
            className={`text-[9px] font-black uppercase tracking-[0.3em] transition-colors duration-700 ${
              isInView ? 'text-emerald-400/70' : 'text-gray-800'
            }`}
          >
            {pillar.signal}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ── MAIN SECTION ──────────────────────────────────────────────────────────────
export default function CoreValues() {
  return (
    <section className="relative bg-[#020202] overflow-hidden selection:bg-[#00a3ff]/30">

      {/* ── TOP ACCENT ── */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#00a3ff]/20 to-transparent" />

      {/* ── AMBIENT GLOWS ── */}
      <div className="absolute top-1/4 -left-40 w-[600px] h-[600px] bg-blue-600/[0.04] blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -right-40 w-[500px] h-[500px] bg-blue-900/[0.04] blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 relative z-10">

        {/* ══════════════════════════════════════════════════════════════════════
            PART 1 — MANIFESTO HEADER (full-width, typographic anchor)
        ══════════════════════════════════════════════════════════════════════ */}
        <motion.div
          variants={staggerContainer(0.2, 0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="pt-24 lg:pt-40 pb-20 lg:pb-28 border-b border-white/[0.06]"
        >
          {/* Label row */}
          <motion.div variants={staggerItem} className="flex items-center gap-4 mb-10">
            <div className="w-12 h-px" style={{ backgroundColor: `${COLORS.brand.blue}66` }} />
            <span
              className="font-black tracking-[0.35em] uppercase text-[10px]"
              style={{ color: COLORS.brand.blue }}
            >
              Strategic Impact
            </span>
            <div className="flex-1 h-px max-w-xs bg-gradient-to-r from-[#00a3ff]/20 to-transparent" />
          </motion.div>

          {/* The two-column manifesto split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-end">

            {/* Left: Big headline */}
            <motion.div variants={staggerItem} className="lg:col-span-7">
              <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] font-black text-white tracking-tighter leading-[0.88]">
                How Introlic
                <br />
                Will Help{' '}
                <span
                  className="italic"
                  style={{
                    WebkitTextStroke: `2px ${COLORS.brand.blue}`,
                    color: 'transparent',
                  }}
                >
                  India.
                </span>
              </h2>
              <p className="mt-5 text-[10px] font-mono text-gray-700 uppercase tracking-[0.3em]">
                If Successful.
              </p>
            </motion.div>

            {/* Right: Opening statement */}
            <motion.div variants={staggerItem} className="lg:col-span-5 pb-2 space-y-6">
              <p className="text-lg sm:text-xl text-gray-300 font-medium leading-relaxed border-l-2 pl-6"
                style={{ borderColor: `${COLORS.brand.blue}33` }}
              >
                Our goal is to build foundational deep-tech research capacity in India, investigating new architectures rather than only consuming existing models through APIs.
              </p>
              <p className="text-sm text-gray-500 font-medium leading-relaxed pl-6">
                By focusing on discrete diffusion, compute efficiency, and open research, we aim to help engineers in India reproduce, modify, and build frontier AI systems from the ground up.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* ══════════════════════════════════════════════════════════════════════
            PART 2 — PILLAR ROWS (scroll-activated, OurVision-style)
        ══════════════════════════════════════════════════════════════════════ */}
        <div className="flex flex-col">
          {PILLARS.map((pillar, i) => (
            <PillarRow key={pillar.index} pillar={pillar} i={i} />
          ))}
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            PART 3 — FOUNDER QUOTE FOOTER (full-width blueprint block)
        ══════════════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 mb-24 lg:mb-40"
        >
          <div className="relative p-8 sm:p-12 lg:p-16 rounded-3xl overflow-hidden border border-white/[0.06] bg-white/[0.015]">

            {/* Corner labels */}
            <div className="absolute top-5 left-6 text-[9px] font-mono text-[#00a3ff]/30 uppercase tracking-[0.3em]">
              Founder // Research Mandate
            </div>
            <div className="absolute top-5 right-6 text-[9px] font-mono text-gray-700 uppercase tracking-[0.3em]">
              Est. 2026
            </div>
            <div className="absolute bottom-5 left-6 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00a3ff] animate-pulse" />
              <span className="text-[9px] font-mono text-[#00a3ff]/40 uppercase tracking-[0.3em]">Active Research</span>
            </div>

            {/* Quote content */}
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
              <div className="lg:col-span-8">
                <div
                  className="text-5xl sm:text-6xl font-black leading-none mb-6 select-none"
                  style={{ color: `${COLORS.brand.blue}20` }}
                >
                  &ldquo;
                </div>
                <blockquote className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-snug -mt-8">
                  We don&apos;t just want to consume technology. We want to understand the mathematics and build the research foundations ourselves.
                  <span style={{ color: COLORS.brand.blue }}>{' '}That is how genuine engineering independence begins.</span>
                </blockquote>
              </div>
              <div className="lg:col-span-4 flex flex-col gap-4">
                <cite className="not-italic">
                  <div className="text-sm font-black text-white uppercase tracking-[0.2em]">— mr.Faiz</div>
                  <div className="text-[10px] font-mono text-gray-600 uppercase tracking-[0.25em] mt-1">
                    Founder, Introlic
                  </div>
                </cite>
                <p className="text-xs text-gray-600 font-medium leading-relaxed">
                  Building open, foundational AI research and fostering a culture of deep-tech engineering from India.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

      </div>

      {/* ── BOTTOM ACCENT ── */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
    </section>
  );
}
