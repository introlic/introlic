"use client";

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { fadeUp } from '@/constants/animations';

const pillars = [
  {
    index: '01',
    tag: 'Web & Mobile Apps',
    headline: 'Building consumer applications that achieve rapid user adoption.',
    body: 'Developing and scaling websites and mobile apps that solve real problems. Our focus is on frictionless UX, high performance, and rapid deployment to capture market share and validate product-market fit.',
  },
  {
    index: '02',
    tag: 'Interactive Games',
    headline: 'Developing games and digital tools that engage users globally.',
    body: 'Building interactive experiences that captivate users and generate viral growth. By focusing on entertainment and engagement, we create sticky products that bring massive visibility to our brand.',
  },
  {
    index: '03',
    tag: 'The Visibility Engine',
    headline: 'Using our products to build a brand, audience, and revenue stream.',
    body: 'Every app, website, and game we build is a step towards our larger goal. They serve as an engine to generate the visibility, user base, and financial leverage needed to scale our infrastructure.',
  },
  {
    index: '04',
    tag: 'The Ultimate AI Goal',
    headline: 'Preparing the groundwork for when we have the capital to train frontier models.',
    body: 'We are not abandoning AI; we are being smart about it. Once our products generate the necessary traction and funding, we will scale our infrastructure to build the next generation of foundational Artificial Intelligence.',
  },
  {
    index: '05',
    tag: 'Total Transparency',
    headline: 'Sharing our learnings, tools, and startup journey openly.',
    body: 'We believe genuine progress requires total transparency. We openly share our journey, engineering challenges, and insights so the broader community can learn and build alongside us.',
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
              We are building high-impact digital products to create a massive footprint. With visibility comes leverage. We use that leverage to fund and build the future of AI.
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
            { value: '1M+', label: 'Target Audience' },
            { value: 'Zero', label: 'Wasted Capital' },
            { value: 'Global', label: 'Product Reach' },
            { value: 'AI Lab', label: 'Ultimate Goal' },
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
