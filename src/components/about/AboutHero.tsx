"use client";

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { heroContainer, heroItem } from '@/constants/animations';

// Animated counter hook
function useCountUp(target: number, duration: number = 2000, start: boolean = false) {
  const [value, setValue] = React.useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return value;
}

const STATS = [
  { value: 13, suffix: 'K+', label: 'Peak Users', sublabel: '2024–2025 Platform' },
  { value: 7,  suffix: ' Yrs', label: 'In the Build', sublabel: 'Since 2019' },
  { value: 0,  suffix: '$',   label: 'VC Funding', sublabel: 'Faiz-Funded / Seeking' },
  { value: 1,  suffix: '',   label: 'Mission', sublabel: 'Indian Tech on Top' },
];

export default function AboutHero() {
  const [statsVisible, setStatsVisible] = React.useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const c0 = useCountUp(STATS[0].value, 2000, statsVisible);
  const c1 = useCountUp(STATS[1].value, 1500, statsVisible);
  const c2 = useCountUp(STATS[2].value, 1000, statsVisible);
  const c3 = useCountUp(STATS[3].value, 1200, statsVisible);
  const counts = [c0, c1, c2, c3];

  return (
    <section className="relative min-h-screen flex flex-col justify-center bg-[#000000] overflow-hidden">

      {/* ── GRID BACKGROUND ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,163,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,163,255,1) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* ── RADIAL GLOW CENTER ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full blur-[200px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(0,163,255,0.08) 0%, transparent 70%)' }}
      />

      {/* ── TOP ACCENT LINE ── */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#00a3ff]/40 to-transparent" />

      {/* ── MAIN CONTENT ── */}
      <motion.div
        variants={heroContainer}
        initial="hidden"
        animate="visible"
        className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 relative z-10 pt-24 sm:pt-32 pb-16 sm:pb-20"
      >

        {/* Section label */}
        <motion.div variants={heroItem} className="flex items-center gap-4 mb-10">
          <div className="w-8 h-px bg-[#00a3ff]" />
          <span className="text-[10px] font-black tracking-[0.45em] uppercase text-[#00a3ff]">
            Origin Protocol // Est. 2019
          </span>
          <div className="w-8 h-px bg-[#00a3ff]" />
        </motion.div>

        {/* ── THE QUESTION ── Hero headline */}
        <motion.div variants={heroItem} className="mb-8 overflow-hidden">
          <div className="text-[11px] font-mono text-gray-600 tracking-[0.3em] uppercase mb-4">
            The Question That Started Everything
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-[6.5rem] xl:text-[8rem] font-black text-white leading-[0.85] tracking-tighter">
            Why is there
            <br />
            no Indian{' '}
            <span
              className="italic"
              style={{
                WebkitTextStroke: '2px #00a3ff',
                color: 'transparent',
              }}
            >
              Google?
            </span>
          </h1>
        </motion.div>

        {/* ── SUPPORTING STATEMENT ── */}
        <motion.div variants={heroItem} className="mb-16 max-w-3xl">
          <p className="text-lg sm:text-xl md:text-2xl text-gray-400 font-medium leading-relaxed">
            In 2019, one question changed everything.{' '}
            <span className="text-white">
              No Indian company ranked among the world&apos;s great technology builders.
            </span>{' '}
            That gap became the obsession — and the mandate — that built Introlic.
          </p>
        </motion.div>

        {/* ── INDIA FLAG STRIP ── */}
        <motion.div variants={heroItem} className="flex items-center gap-4 mb-16">
          <div className="flex items-center gap-2 px-4 py-2 border border-white/10 bg-white/[0.02] rounded-full">
            {/* Tricolor micro strip */}
            <div className="flex flex-col h-4 w-6 rounded-[2px] overflow-hidden border border-white/10 shrink-0">
              <div className="flex-1 bg-[#FF9933]" />
              <div className="flex-1 bg-white flex items-center justify-center relative">
                <div className="w-1.5 h-1.5 rounded-full border border-[#000080]/60 flex items-center justify-center">
                  <div className="w-0.5 h-0.5 rounded-full bg-[#000080]" />
                </div>
              </div>
              <div className="flex-1 bg-[#138808]" />
            </div>
            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-gray-400">
              Built in India · For the World
            </span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent max-w-xs" />
        </motion.div>

        {/* ── STAT ROW ── */}
        <motion.div
          ref={statsRef}
          variants={heroItem}
          className="grid grid-cols-4 gap-px bg-white/10 border border-white/5 overflow-hidden rounded-2xl"
        >
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className="flex flex-col gap-1.5 px-2 py-5 sm:px-6 sm:py-8 bg-black hover:bg-[#00a3ff]/[0.04] transition-colors duration-500 group"
            >
              <div className="text-base min-[360px]:text-lg sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-none tabular-nums">
                {counts[i]}
                <span className="text-[#00a3ff]">{stat.suffix}</span>
              </div>
              <div className="text-[7px] min-[360px]:text-[8px] sm:text-[10px] md:text-xs font-bold text-gray-300 uppercase tracking-normal min-[360px]:tracking-wide sm:tracking-widest mt-1.5">
                {stat.label}
              </div>
              <div className="text-[6px] min-[360px]:text-[7px] sm:text-[9px] md:text-[10px] font-mono text-gray-600 tracking-wider">
                {stat.sublabel}
              </div>
            </div>
          ))}
        </motion.div>

      </motion.div>

      {/* ── BOTTOM SCROLL INDICATOR ── */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-25"
      >
        <span className="text-[9px] font-mono tracking-[0.35em] uppercase text-gray-400">
          The Origin
        </span>
        <div className="w-px h-14 bg-gradient-to-b from-[#00a3ff] to-transparent" />
      </motion.div>

      {/* ── BOTTOM ACCENT LINE ── */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    </section>
  );
}
