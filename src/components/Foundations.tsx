"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Target } from 'lucide-react';
import { staggerContainer, staggerItem } from '@/constants/animations';
import { COLORS } from '@/constants/branding';

const principles = [
  {
    index: "01",
    tag: "PRODUCTS",
    title: "Websites, Apps, & Games",
    text: "Building digital products that solve real problems and engage users today, establishing a strong brand and audience."
  },
  {
    index: "02",
    tag: "EFFICIENCY",
    title: "Capital Efficiency",
    text: "Focusing on product-market fit, traction, and revenue instead of burning money on unnecessary compute before we have a user base."
  },
  {
    index: "03",
    tag: "STRATEGY",
    title: "The Visibility Engine",
    text: "Using our software products to build massive global visibility, creating the leverage and funding needed for our ultimate goals."
  },
  {
    index: "04",
    tag: "THE FUTURE",
    title: "Foundational AI",
    text: "Keeping our long-term R&D vision alive. Once we hit our scale targets, we will invest our leverage into training the next generation of AI."
  },
  {
    index: "05",
    tag: "CAPACITY",
    title: "Deep-Tech from India",
    text: "Proving that world-class consumer and developer software can be built from the ground up in India, competing on a global stage."
  }
];

export default function Foundations() {
  return (
    <section id="anatomy" className="relative py-20 md:py-40 bg-black overflow-hidden selection:bg-primary/30">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/4 w-[300px] md:w-[800px] h-[300px] md:h-[800px] bg-blue-600/5 blur-[100px] md:blur-[150px] rounded-full pointer-events-none opacity-40 -translate-y-1/4" />
      <div className="absolute bottom-0 right-1/4 w-[250px] md:w-[600px] h-[250px] md:h-[600px] bg-blue-900/5 blur-[80px] md:blur-[130px] rounded-full pointer-events-none opacity-30 translate-y-1/4" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 relative z-10">

        {/* ── SECTION HEADER ── */}
        <motion.div
          variants={staggerContainer(0.25, 0.2)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mb-24"
        >
          <motion.div variants={staggerItem} className="flex items-center gap-4 mb-6">
            <div className="w-12 h-[1px]" style={{ backgroundColor: `${COLORS.brand.blue}66` }} />
            <span className="font-black tracking-[0.3em] uppercase text-xs" style={{ color: COLORS.brand.blue }}>Our Master Plan</span>
          </motion.div>
          <motion.h2 variants={staggerItem} className="text-4xl sm:text-5xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] max-w-4xl">
            Born in India.<br />
            <span style={{ color: COLORS.brand.blue }}>Engineered for the World.</span>
          </motion.h2>
        </motion.div>

        {/* ── MAIN GRID ── */}
        <motion.div
          variants={staggerContainer(0.25, 0.2)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start"
        >
          {/* ── LEFT: STORY ── */}
          <div className="lg:col-span-7 space-y-10">
            <motion.div variants={staggerItem} className="relative pl-8 border-l-2" style={{ borderColor: `${COLORS.brand.blue}33` }}>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-300 font-medium leading-relaxed">
                Introlic was founded on{' '}
                <span className="text-white font-bold underline decoration-[#00a3ff]/40 underline-offset-8">
                  March 26, 2026
                </span>{' '}
                by{' '}
                <span className="text-white font-bold">mr.Faiz</span> — at the age of{' '}
                <span className="text-[#00a3ff] font-black">17.</span>{' '}
                It was born from a question that first surfaced in 2019:{' '}
                <em className="text-white">
                  &quot;Why is there no Indian company among the ranks of Google, Microsoft, or Tesla?&quot;
                </em>
              </p>
            </motion.div>

            <motion.p variants={staggerItem} className="text-base sm:text-lg md:text-xl text-gray-500 font-medium leading-relaxed">
              That question became an obsession. Starting with just a computer and an internet connection,
              mr.Faiz taught himself programming through YouTube and ChatGPT, built and shipped live platforms,
              scaled to 13,000 monthly users, and learned exactly why most startups hit a ceiling.
            </motion.p>

            <motion.p variants={staggerItem} className="text-base sm:text-lg md:text-xl text-gray-500 font-medium leading-relaxed">
              You can&apos;t train frontier AI with just passion—it requires massive capital. Most startups burn their funding trying to build AI before they have users. At Introlic, we are doing it differently. We build websites, apps, and games first to build an audience and revenue. Once we have the visibility, we will build the AI.
            </motion.p>

            {/* Technology we're using */}
            <motion.div variants={staggerItem} className="mt-4 p-5 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
                <Target className="w-4 h-4 sm:w-5 sm:h-5 text-[#00a3ff]" />
                <span className="text-[10px] sm:text-xs font-black text-[#00a3ff] uppercase tracking-[0.2em] sm:tracking-[0.25em]">Strategic Focus</span>
              </div>
              <h3 className="text-lg sm:text-2xl font-black text-white mb-2 sm:mb-3 tracking-tight">
                The Visibility-First Roadmap
              </h3>
              <p className="text-xs sm:text-base text-gray-400 leading-relaxed mb-5 sm:mb-6">
                Our immediate focus is on fast execution in web, mobile, and gaming. We are building consumer-facing products that achieve rapid user adoption, creating the leverage needed to fund our future foundational AI research.
              </p>
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                {[
                  { metric: '1M+', label: 'Target Users' },
                  { metric: 'Global', label: 'Visibility' },
                  { metric: 'AI Lab', label: 'Ultimate Goal' },
                ].map((s) => (
                  <div key={s.label} className="bg-white/[0.02] rounded-xl p-3 sm:p-4 border border-white/[0.04] flex flex-col justify-center">
                    <div className="text-[12px] sm:text-xl font-black text-[#00a3ff] leading-tight">{s.metric}</div>
                    <div className="text-[8px] sm:text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1 leading-tight">{s.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.blockquote variants={staggerItem} className="border-l-4 pl-6 py-2 mt-4" style={{ borderColor: COLORS.brand.blue }}>
              <p className="text-base sm:text-lg text-gray-400 italic leading-snug">
                &quot;We don&apos;t build for one country. We build for the entire human horizon. If you want to scale, you must never limit your ambition with a geography.&quot;
              </p>
              <cite className="block mt-3 text-xs sm:text-sm font-black text-white uppercase tracking-widest">— mr.Faiz, Founder</cite>
            </motion.blockquote>
          </div>

          {/* ── RIGHT: COHESIVE CORE PRINCIPLES PANEL ── */}
          <motion.div variants={staggerItem} className="lg:col-span-5">
            <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 sm:p-7 relative backdrop-blur-sm shadow-2xl">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-5 mb-5 border-b border-white/[0.06]">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#00a3ff] shadow-[0_0_8px_#00a3ff]" />
                  <span className="text-[11px] font-mono font-bold tracking-[0.25em] uppercase text-gray-400">
                    Core Principles
                  </span>
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-gray-500">
                  5 PRINCIPLES
                </span>
              </div>

              {/* Principle Rows */}
              <div className="space-y-4">
                {principles.map((p) => (
                  <div
                    key={p.index}
                    className="group relative p-3 -mx-3 rounded-xl transition-all duration-200 hover:bg-white/[0.03]"
                  >
                    <div className="flex items-baseline gap-3 mb-1">
                      <span className="font-mono text-xs font-bold text-[#00a3ff] opacity-80 group-hover:opacity-100 transition-opacity">
                        {p.index}
                      </span>
                      <h4 className="text-[14px] sm:text-[15px] font-bold text-white tracking-tight flex-1">
                        {p.title}
                      </h4>
                      <span className="text-[9px] font-mono uppercase tracking-widest text-gray-600 group-hover:text-gray-400 transition-colors">
                        {p.tag}
                      </span>
                    </div>
                    <p className="text-[12px] sm:text-[13px] text-gray-500 leading-relaxed pl-6 group-hover:text-gray-400 transition-colors">
                      {p.text}
                    </p>
                  </div>
                ))}
              </div>

            </div>
          </motion.div>

        </motion.div>

        {/* ── MILESTONE FOOTER ── */}
        <motion.div
          variants={staggerItem}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16 sm:mt-24 pt-8 sm:pt-12 border-t border-white/5 flex flex-row items-start justify-between gap-2 sm:gap-6 lg:gap-8 overflow-x-auto no-scrollbar"
        >
          <Milestone year="2019" label="Curiosity Sparked" />
          <Milestone year="2024" label="The Strategic Dropout" />
          <Milestone year="2025" label="Traction Realization" />
          <Milestone year="2026" label="Introlic Founded" />
        </motion.div>
      </div>
    </section>
  );
}

function Milestone({ year, label }: { year: string; label: string }) {
  return (
    <div className="flex flex-col shrink-0 min-w-0 flex-1">
      <span className="text-xl sm:text-2xl md:text-3xl font-black text-white/20">{year}</span>
      <span className="text-[8px] sm:text-[10px] md:text-xs font-black text-gray-700 uppercase tracking-widest mt-0.5 sm:mt-1 break-words leading-tight">{label}</span>
    </div>
  );
}
