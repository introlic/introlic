"use client";

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { fadeUp } from '@/constants/animations';

const pillars = [
  {
    index: '01',
    tag: 'Discrete Diffusion',
    headline: 'Investigating non-autoregressive language models built on SEDD.',
    body: 'Exploring Score Entropy Discrete Diffusion (SEDD) architectures to move beyond sequential token-by-token generation. By refining thoughts bidirectionally, these models possess an innate ability to catch and self-correct reasoning mistakes during generation.',
  },
  {
    index: '02',
    tag: 'Compute Efficiency',
    headline: 'Optimizing training schedules under severe compute constraints.',
    body: 'Developing sample-efficient corruption schedules and noise optimizations to test whether discrete diffusion can be trained effectively without multi-million-dollar clusters.',
  },
  {
    index: '03',
    tag: '220M Prototype',
    headline: 'Empirical testing with our 220M-parameter SEDD benchmark.',
    body: 'Pre-training an initial 220M prototype to collect empirical evidence on loss convergence, self-correction fidelity, and compute trade-offs compared to autoregressive baselines.',
  },
  {
    index: '04',
    tag: 'IN1 Initiative',
    headline: 'Cultivating open foundational AI research in India.',
    body: 'Through the IN1 initiative, we encourage young Indian engineers to look under the hood—reproducing, questioning, and building upon frontier AI research rather than only consuming APIs.',
  },
  {
    index: '05',
    tag: 'Open Science',
    headline: 'Publishing raw loss curves, code, and benchmark papers openly.',
    body: 'We believe genuine scientific progress requires total transparency. We openly share our checkpoints, training pipelines, and negative findings so the broader community can learn and build upon our work.',
  },
];

function PillarRow({ pillar, i }: { pillar: typeof pillars[0]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: '-30% 0px -30% 0px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: i * 0.05 }}
      className={`group grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 py-10 lg:py-16 -mx-4 px-4 md:-mx-12 md:px-12 transition-all duration-700 border-l-2 ${
        isInView
          ? 'border-[#00a3ff] bg-[#00a3ff]/[0.03]'
          : 'border-transparent bg-transparent'
      }`}
    >
      {/* Index + Tag */}
      <div className="lg:col-span-2 flex lg:flex-col items-start gap-4 lg:gap-2 pt-1">
        <span
          className={`text-5xl font-black leading-none transition-colors duration-700 ${
            isInView ? 'text-[#00a3ff]/30' : 'text-white/10'
          }`}
        >
          {pillar.index}
        </span>
        <span
          className={`text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap mt-1 transition-colors duration-700 ${
            isInView ? 'text-[#00a3ff]/70' : 'text-gray-700'
          }`}
        >
          {pillar.tag}
        </span>
      </div>

      {/* Headline */}
      <div className="lg:col-span-4">
        <h3
          className={`text-xl sm:text-2xl font-black tracking-tight leading-snug transition-colors duration-700 ${
            isInView ? 'text-[#00a3ff]' : 'text-white'
          }`}
        >
          {pillar.headline}
        </h3>
      </div>

      {/* Body */}
      <div className="lg:col-span-5 lg:col-start-8 flex items-start gap-4 sm:gap-6">
        <p
          className={`leading-relaxed font-medium text-sm sm:text-base flex-1 transition-colors duration-700 ${
            isInView ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          {pillar.body}
        </p>
        <ArrowRight
          className={`w-5 h-5 shrink-0 mt-1 transition-colors duration-700 ${
            isInView ? 'text-[#00a3ff]/60' : 'text-white/10'
          }`}
        />
      </div>
    </motion.div>
  );
}

export default function OurVision() {
  return (
    <section className="relative bg-[#030303] overflow-hidden">
      {/* Top accent */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#00a3ff]/30 to-transparent" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 py-12 md:py-40">

        {/* ── HEADER ── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          transition={{ staggerChildren: 0.15 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-28 items-end"
        >
          <motion.div variants={fadeUp} className="lg:col-span-7">
            <p className="text-[#00a3ff] font-black tracking-[0.3em] uppercase text-xs mb-6">Our Vision</p>
            <h2 className="text-4xl sm:text-5xl md:text-8xl font-black text-white tracking-tighter leading-[0.88]">
              What Introlic<br />
              <span className="text-white/30">is here to achieve.</span>
            </h2>
          </motion.div>

          <motion.div variants={fadeUp} className="lg:col-span-5 pb-2">
            <p className="text-base sm:text-lg text-gray-500 font-medium leading-relaxed border-l border-white/10 pl-5 sm:pl-8">
              We are not building another model. We are engineering the infrastructure layer that brings
              Parallel Intelligence into production — with the precision of native systems and the ambition
              of a generation that refuses the ceiling.
            </p>
          </motion.div>
        </motion.div>

        {/* ── PILLAR ROWS (scroll-activated) ── */}
        <div className="flex flex-col divide-y divide-white/[0.04]">
          {pillars.map((pillar, i) => (
            <PillarRow key={pillar.index} pillar={pillar} i={i} />
          ))}
        </div>

        {/* ── METRIC STRIP ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mt-10 md:mt-24 grid grid-cols-4 gap-px overflow-hidden rounded-2xl border border-white/[0.05] bg-white/[0.05]"
        >
          {[
            { value: '100%', label: 'Independent Tech Stack' },
            { value: 'Zero', label: 'Foreign API Dependency' },
            { value: 'Limitless', label: 'Scaling Potential' },
            { value: 'Global', label: 'Deployment Radius' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="group flex flex-col items-center justify-center gap-1.5 md:gap-2 py-6 md:py-10 px-1 md:px-4 bg-[#030303] hover:bg-white/[0.03] transition-colors"
            >
              <span className="text-base min-[380px]:text-lg sm:text-2xl md:text-3xl lg:text-4xl font-black text-white group-hover:text-[#00a3ff] transition-colors">
                {stat.value}
              </span>
              <span className="text-[6px] min-[380px]:text-[7px] sm:text-[8px] md:text-[10px] font-black text-gray-700 uppercase tracking-normal min-[380px]:tracking-[0.05em] sm:tracking-[0.2em] text-center">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom accent */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    </section>
  );
}
