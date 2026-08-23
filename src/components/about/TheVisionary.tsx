"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Flame, Users, AlertTriangle, Rocket } from 'lucide-react';
import { COLORS } from '@/constants/branding';

const timeline = [
  {
    year: '2019',
    icon: Flame,
    color: '#f97316',
    title: 'The Question',
    body: 'A 12-year-old asked: why is there no Indian company among Google, Microsoft, or Tesla? That gap became an obsession.',
    tag: 'ORIGIN_SIGNAL',
  },
  {
    year: '2024',
    icon: Users,
    color: '#00a3ff',
    title: 'The Platform',
    subtitle: 'Oct 6, 2024',
    body: 'A side project grew into a live platform: 13,000+ users at peak. Zero capital. Zero team. Zero institutional backing.',
    tag: 'PROOF_OF_CONCEPT',
    callout: '13,000+ users · No team · No VC',
  },
  {
    year: '2025',
    icon: AlertTriangle,
    color: '#e2b340',
    title: 'Strategic Shutdown',
    subtitle: 'Oct 6, 2025',
    body: 'Exactly one year after launch: goal complete. Maintenance costs outpaced revenue. The decision to wind down was deliberate, not a collapse.',
    tag: 'STRATEGIC_RESET',
  },
  {
    year: '2026',
    icon: Rocket,
    color: '#10b981',
    title: 'Introlic',
    body: 'The real mission. Not a product. An infrastructure company — building the hardware-native layers India needs to compete at the world\'s highest levels.',
    tag: 'ACTIVE_DEPLOYMENT',
    isActive: true,
  },
];

const stats = [
  { value: '15', label: 'Age at first platform' },
  { value: '13K+', label: 'Peak users' },
  { value: '₹0', label: 'VC funding (Faiz-funded)' },
  { value: '2019', label: 'Year of origin' },
];

export default function TheVisionary() {
  return (
    <section
      className="relative bg-[#020202] overflow-hidden"
      style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
    >

      {/* ── Ambient glow ── */}
      <div
        className="absolute top-0 left-1/4 w-[900px] h-[900px] rounded-full blur-[240px] pointer-events-none"
        style={{ backgroundColor: `${COLORS.brand.blue}07`, transform: 'translate(-40%, -40%)' }}
      />

      {/* ─────────────────────────────────────────────
          PART 1 — EDITORIAL HEADER (full width)
      ───────────────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 pt-24 md:pt-36">

        {/* Section tag */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-10"
        >
          <div className="w-8 h-px" style={{ backgroundColor: COLORS.brand.blue }} />
          <span className="text-[9px] font-black tracking-[0.5em] uppercase" style={{ color: COLORS.brand.blue }}>
            Founder Profile // Origin & Systems Creator
          </span>
        </motion.div>

        {/* ── SPLIT: name left / mandate right ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-end pb-16 md:pb-20"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          {/* Left: display name */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="text-[10px] font-mono tracking-[0.4em] uppercase text-[#00a3ff] font-bold mb-5 flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#00a3ff] animate-pulse" />
              Founder & Systems Creator
            </div>
            <h2
              className="font-black leading-none tracking-tighter text-white"
              style={{ fontSize: 'clamp(4rem, 10vw, 9rem)' }}
            >
              mr.Faiz
            </h2>
            <p className="text-gray-600 font-bold text-lg md:text-xl tracking-tight mt-4 italic">
              The Builder India Needed.
            </p>

            {/* Social handle */}
            <a
              href="https://x.com/MF9CODING"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-8 text-[11px] font-black tracking-[0.3em] uppercase transition-opacity duration-200 hover:opacity-60"
              style={{ color: COLORS.brand.blue }}
            >
              @MF9CODING
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </motion.div>

          {/* Right: mandate quote */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-end"
          >
            <div
              className="pl-8"
              style={{ borderLeft: `2px solid ${COLORS.brand.blue}` }}
            >
              <div className="text-[9px] font-mono tracking-[0.4em] uppercase mb-5" style={{ color: COLORS.brand.blue }}>
                The Founding Mandate
              </div>
              <p className="text-white font-black text-xl md:text-2xl lg:text-3xl leading-snug tracking-tight">
                &ldquo;India built the engineers who built the world&apos;s greatest companies.{' '}
                <span style={{ color: COLORS.brand.blue }}>Now India builds the companies.</span>&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#10b981' }} />
                <span className="text-[10px] font-mono text-gray-600 tracking-widest uppercase">
                  mr.Faiz · Introlic
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── STAT ROW ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="grid grid-cols-4 py-6 md:py-12"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`flex flex-col gap-1.5 md:gap-2 py-2 md:py-0 ${
                i > 0 ? 'border-l border-white/[0.06] pl-2 sm:pl-4 md:pl-8' : 'pl-0'
              }`}
            >
              <div className="text-base min-[360px]:text-lg sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tabular-nums leading-none">
                {s.value}
              </div>
              <div className="text-[7px] min-[360px]:text-[8px] sm:text-[10px] md:text-xs font-bold text-gray-600 uppercase tracking-normal min-[360px]:tracking-[0.1em] sm:tracking-[0.2em] leading-tight">
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>

      </div>

      {/* ─────────────────────────────────────────────
          PART 2 — HORIZONTAL TIMELINE (full width)
      ───────────────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-20 md:py-28">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-[9px] font-mono tracking-[0.45em] uppercase mb-14"
          style={{ color: COLORS.brand.blue }}
        >
          Chronology // Origin to Present
        </motion.div>

        {/* 4-column horizontal timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-0">
          {timeline.map((node, i) => {
            const Icon = node.icon;
            return (
              <motion.div
                key={node.year}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex flex-col group"
                style={{
                  borderLeft: i === 0 ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(255,255,255,0.08)',
                  borderRight: i === 3 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                }}
              >
                {/* Top accent bar */}
                <div
                  className="h-px w-full transition-all duration-500 group-hover:opacity-100"
                  style={{ backgroundColor: node.color, opacity: 0.5 }}
                />

                <div className="p-7 md:p-8 flex flex-col flex-1">

                  {/* Icon + Year row */}
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
                      style={{
                        backgroundColor: `${node.color}15`,
                        border: `1px solid ${node.color}25`,
                      }}
                    >
                      <Icon className="w-4.5 h-4.5" style={{ color: node.color }} />
                    </div>

                    {node.isActive ? (
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-1.5 h-1.5 rounded-full animate-pulse"
                          style={{ backgroundColor: '#10b981' }}
                        />
                        <span className="text-[9px] font-mono tracking-[0.25em] uppercase" style={{ color: '#10b981' }}>
                          Live
                        </span>
                      </div>
                    ) : (
                      <span
                        className="text-[8px] font-mono tracking-[0.2em] uppercase px-2 py-0.5 rounded"
                        style={{
                          color: node.color,
                          backgroundColor: `${node.color}10`,
                          border: `1px solid ${node.color}20`,
                        }}
                      >
                        {node.tag.split('_')[0]}
                      </span>
                    )}
                  </div>

                  {/* Year */}
                  <div
                    className="text-5xl font-black leading-none mb-1 tabular-nums"
                    style={{ color: node.color }}
                  >
                    {node.year}
                  </div>

                  {/* Subtitle date */}
                  {'subtitle' in node && node.subtitle && (
                    <div className="text-[10px] font-mono text-gray-600 tracking-wider mb-4">
                      {node.subtitle}
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="text-base md:text-lg font-black text-white tracking-tight mb-3 mt-2">
                    {node.title}
                  </h3>

                  {/* Body */}
                  <p className="text-gray-600 text-sm leading-relaxed font-medium group-hover:text-gray-500 transition-colors duration-400 flex-1">
                    {node.body}
                  </p>

                  {/* Callout */}
                  {'callout' in node && node.callout && (
                    <div
                      className="mt-5 text-[10px] font-black tracking-widest uppercase py-2.5 px-3"
                      style={{
                        color: node.color,
                        borderTop: `1px solid ${node.color}20`,
                      }}
                    >
                      {node.callout}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ─────────────────────────────────────────────
          PART 3 — MISSION STATEMENT (full width)
      ───────────────────────────────────────────── */}
      <div
        className="border-t border-b"
        style={{ borderColor: 'rgba(255,255,255,0.05)' }}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-12 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="text-[9px] font-mono tracking-[0.5em] uppercase text-gray-600 mb-6 md:mb-8">
              The Mission
            </div>

            <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-6 xl:gap-20">
              {/* Big statement text */}
              <h3
                className="font-black text-white leading-[1.05] tracking-tighter max-w-4xl"
                style={{ fontSize: 'clamp(1.8rem, 5vw, 5rem)' }}
              >
                Put India on the map of{' '}
                <span style={{ color: COLORS.brand.blue }}>foundational</span>
                <br />
                <span style={{ color: COLORS.brand.blue }}>technology companies.</span>
                <br />
                <span className="text-gray-600 mt-2 block" style={{ fontSize: 'clamp(1.1rem, 2.5vw, 2.8rem)' }}>
                  Not wrappers.{' '}
                  <span className="text-white">Infrastructure.</span>
                </span>
              </h3>

              {/* CTA */}
              <a
                href="/contact"
                className="flex items-center gap-3 self-start xl:self-end shrink-0 px-6 py-4 md:px-8 md:py-5 font-black text-xs md:text-sm tracking-[0.15em] uppercase transition-all duration-300 hover:gap-4"
                style={{
                  color: COLORS.brand.blue,
                  border: `1px solid ${COLORS.brand.blue}40`,
                }}
              >
                Join the Build
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>

    </section>
  );
}
