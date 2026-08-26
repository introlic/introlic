"use client";

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Zap, Crown, Target, Terminal, MoveDown } from 'lucide-react';
import { fadeUp } from '@/constants/animations';
import { COLORS } from '@/constants/branding';

const xtModels = [
  { params: '7.2M', name: 'XT-Proof', status: 'Test Complete', done: true, current: false },
  { params: '220M', name: 'XT-Micro', status: 'In Planning', done: false, current: true },
  { params: '500M', name: 'XT-Mini', status: 'Upcoming', done: false, current: false },
  { params: '1B', name: 'XT-Base', status: 'Upcoming', done: false, current: false },
  { params: '3B', name: 'XT-Plus', status: 'Upcoming', done: false, current: false },
  { params: '7B', name: 'XT-Pro', status: 'Upcoming', done: false, current: false },
];

export default function Roadmap() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section id="roadmap" ref={containerRef} className="relative bg-black text-white overflow-hidden pt-20 pb-10 md:pt-40 md:pb-16 selection:bg-white/10">
      {/* Editorial Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="h-full w-full bg-[size:100px_100px]" style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px)' }} />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">

        {/* ── HEADER ── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          transition={{ staggerChildren: 0.2 }}
          className="mb-20 md:mb-32 max-w-5xl"
        >
          <motion.div variants={fadeUp} className="flex items-center gap-4 mb-6 md:mb-8">
            <div className="w-12 md:w-16 h-[1px]" style={{ backgroundColor: COLORS.brand.blue }} />
            <span className="font-bold tracking-[0.2em] uppercase text-[10px] md:text-xs" style={{ color: COLORS.brand.blue }}>03 / Roadmap</span>
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl md:text-7xl lg:text-9xl font-black tracking-tightest leading-[0.85] text-white break-words">
            The Architecture of<br />
            <span className="italic" style={{ color: COLORS.brand.blue }}>Scaling & Progression.</span>
          </motion.h2>
        </motion.div>

        {/* ── EDITORIAL SPLIT: THE HONEST STRATEGY ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 mb-24 md:mb-40 border-t border-b border-white/10 py-12 md:py-20 relative">
          
          {/* Subtle connecting line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/5 disabled:block hidden lg:block" />

          {/* Left Column: The Raw Truth */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="lg:col-span-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                 <Target className="w-5 h-5" style={{ color: COLORS.brand.blue }} />
                 <h3 className="text-[11px] md:text-sm font-bold uppercase tracking-widest" style={{ color: COLORS.brand.blue }}>The Honest Strategy</h3>
              </div>
              <p className="text-xl md:text-2xl font-medium tracking-tight text-white leading-snug max-w-md">
                Why not build the 390B flagship directly?
              </p>
            </div>

            <div className="mt-12 md:mt-20">
              {/* Massive typographic art */}
              <div className="relative">
                <span className="text-[100px] sm:text-[120px] md:text-[180px] leading-[0.8] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10">
                  17
                </span>
                <div className="absolute bottom-2 md:bottom-4 left-20 sm:left-24 md:left-44">
                  <span className="text-[10px] md:text-sm font-bold uppercase tracking-[0.3em]" style={{ color: COLORS.brand.blue }}>Years Old. <br/>Building Anyway.</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: The Prose */}
          <motion.div 
             initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } }}
            className="lg:col-span-7 lg:pl-10 flex flex-col justify-center gap-10 md:gap-12"
          >
            <motion.p variants={fadeUp} className="text-lg md:text-2xl text-gray-400 font-medium leading-relaxed">
              mr.Faiz is 17 years old. There is no institutional backing, no family capital, no VC safety net. 
              The resources available right now are limited — and that is a fact, not an excuse. 
              <span 
                className="text-white block mt-4 border-l-2 pl-4 md:pl-6 py-1 md:py-2 text-base md:text-2xl"
                style={{ borderColor: COLORS.brand.blue }}
              >
                Waiting until conditions are perfect is not a strategy. It is surrender.
              </span>
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 md:gap-y-10">
              <motion.div variants={fadeUp} className="group">
                <h4 className="text-base md:text-lg font-bold text-white mb-2 md:mb-3 flex items-center gap-2">
                  <span style={{ color: COLORS.brand.blue }}>01 //</span> No Money? Start Smaller.
                </h4>
                <p className="text-gray-500 text-sm md:text-base font-medium leading-relaxed">
                  If the 390B flagship is beyond current reach, the logical move is not to stop — it is to build what you can afford now. A 220M model is a real model with real output. That is where we begin.
                </p>
              </motion.div>

              <motion.div variants={fadeUp} className="group">
                <h4 className="text-base md:text-lg font-bold text-white mb-2 md:mb-3 flex items-center gap-2">
                  <span style={{ color: COLORS.brand.blue }}>02 //</span> Prove, Then Scale.
                </h4>
                <p className="text-gray-500 text-sm md:text-base font-medium leading-relaxed">
                  Every XT-Class milestone is evidence. Compounding evidence attracts the right funding partners. Currently running completely on MR.FAIZ&apos;s funds, the path to the flagship is built milestone by milestone.
                </p>
              </motion.div>

              <motion.div variants={fadeUp} className="group md:col-span-2 mt-2 md:mt-4 pt-8 md:pt-10 border-t border-white/5">
                <h4 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4">
                  Efficiency Over Capital.
                </h4>
                <p className="text-gray-400 text-base md:text-lg font-medium leading-relaxed">
                  DeepSeek demonstrated that $6.3M and extreme mathematical discipline can outpace billion-dollar labs. The constraint is not the bottleneck — it is the competitive advantage. The flagship is the destination. The XT-Class models are the engine that pays for the journey.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
        <div className="mb-24 md:mb-40 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
            <div className="lg:col-span-4 flex flex-col justify-center pr-4">
                <div className="flex items-center gap-2 mb-3">
                    <Terminal className="w-3.5 h-3.5" style={{ color: COLORS.brand.blue }} />
                    <span className="text-[9px] font-bold uppercase tracking-[0.3em]" style={{ color: COLORS.brand.blue }}>Telemetry & Logs</span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter text-white leading-[0.95] mb-4">
                    Execution<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-[#00a3ff] to-[#007acc]">Log.</span>
                </h2>
                <p className="text-xs md:text-sm text-gray-500 font-medium leading-relaxed max-w-sm">
                    Verifiable phases of the Introlic architecture. Real-world runtime records mapping our transition from small proofs to high-density models.
                </p>
            </div>
            
            <div className="lg:col-span-8 relative mt-8 lg:mt-0">
                {/* Continuous Vertical Line with dynamic gradient */}
                <div className="absolute left-[11px] sm:left-[23px] md:left-[27px] top-4 bottom-4 w-px bg-gradient-to-b from-emerald-500/30 via-[#00a3ff]/30 to-white/5" />

                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.2 } } }} className="flex flex-col gap-8 md:gap-10">
                    {/* Log 01: Completed */}
                    <motion.div variants={fadeUp} className="relative pl-10 sm:pl-16 md:pl-20 group">
                        {/* Bullet Icon */}
                        <div className="absolute left-0 sm:left-3 md:left-4 top-8 w-5 h-5 md:w-6 md:h-6 rounded-full bg-black border border-emerald-500/80 flex items-center justify-center shadow-[0_0_12px_rgba(16,185,129,0.2)] group-hover:scale-105 transition-transform duration-300">
                            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-500" />
                        </div>
                        
                        {/* Card Wrap */}
                        <div className="bg-[#050508] border border-white/[0.04] rounded-lg p-6 sm:p-8 hover:border-emerald-500/20 hover:bg-[#060b08]/30 transition-all duration-300 shadow-2xl relative overflow-hidden group">
                            {/* Subtle inner grid glow */}
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                            
                            <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-4 relative z-10">
                                <span className="text-[10px] md:text-xs font-black text-emerald-500 tracking-[0.2em] uppercase px-2 py-0.5 bg-emerald-500/10 rounded">Test Complete</span>
                                <span className="text-white/20 hidden sm:inline">—</span>
                                <span className="text-[11px] md:text-sm font-bold text-gray-500 uppercase tracking-widest font-mono">7.2M PARAMS</span>
                            </div>
                            <p className="text-base sm:text-lg md:text-xl font-medium text-white max-w-2xl leading-snug relative z-10">
                                 Our first real experiment with the Introlic stack. Proof that the protocol compiles, runs, and generates coherent output. The foundation proof that the architecture is viable.
                            </p>
                        </div>
                    </motion.div>

                    {/* Log 02: Active Target */}
                    <motion.div variants={fadeUp} className="relative pl-10 sm:pl-16 md:pl-20 group">
                        {/* Bullet Icon */}
                        <div 
                          className="absolute left-0 sm:left-3 md:left-4 top-8 w-5 h-5 md:w-6 md:h-6 rounded-full bg-black border flex items-center justify-center shadow-[0_0_15px_rgba(0,163,255,0.4)] group-hover:scale-105 transition-transform duration-300"
                          style={{ borderColor: COLORS.brand.blue }}
                        >
                            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full animate-ping absolute" style={{ backgroundColor: COLORS.brand.blue }} />
                            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full" style={{ backgroundColor: COLORS.brand.blue }} />
                        </div>
                        
                        {/* Card Wrap */}
                        <div className="bg-[#050508] border border-white/[0.04] rounded-lg p-6 sm:p-8 hover:border-[#00a3ff]/20 hover:bg-[#05080c]/30 transition-all duration-300 shadow-2xl relative overflow-hidden group">
                            {/* Subtle inner grid glow */}
                            <div className="absolute inset-0 bg-gradient-to-r from-[#00a3ff]/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                            
                            <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-4 relative z-10">
                                <span className="text-[10px] md:text-xs font-black tracking-[0.2em] uppercase px-2 py-0.5 rounded bg-[#00a3ff]/10" style={{ color: COLORS.brand.blue }}>Active Vector</span>
                                <span className="text-white/20 hidden sm:inline">—</span>
                                <span className="text-[11px] md:text-sm font-bold text-gray-400 uppercase tracking-widest font-mono">220M PARAMS</span>
                            </div>
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white max-w-2xl leading-snug mb-3 relative z-10">
                                Why 220M, not 100M–150M?
                            </h3>
                            <p className="text-xs sm:text-sm md:text-base text-gray-400 font-medium leading-relaxed max-w-2xl relative z-10">
                                Below 150M, a model is too small to surface meaningful emergent behaviors. At 220M, we learn denoising stability, memory pressure under load, and true inference dynamics — the highest-knowledge threshold we can reach within current resource constraints.
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>

        {/* ── HIERARCHICAL CLASS STRUCTURE ── */}
        <div className="mb-24 md:mb-32">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-10 md:mb-16">
                <h2 className="text-[10px] md:text-sm font-bold text-gray-500 tracking-[0.3em] uppercase ml-2 text-center lg:text-left">Model Taxonomy</h2>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.3 } } }} className="flex flex-col gap-6 md:gap-8">
                
                {/* XT-Class : The Engine */}
                <motion.div 
                  variants={fadeUp} 
                  className="relative border-l border-t border-r bg-[#000510] group"
                  style={{ borderColor: `${COLORS.brand.blue}33` }}
                >
                    <div className="absolute top-0 right-0 p-4 md:p-8">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: COLORS.brand.blue }} />
                            <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest" style={{ color: COLORS.brand.blue }}>Active Engine</span>
                        </div>
                    </div>

                    <div className="px-4 py-6 sm:p-8 md:p-16 grid grid-cols-1 xl:grid-cols-12 gap-6 md:gap-12 items-center relative overflow-hidden">
                        {/* Glow effect */}
                        <div 
                          className="absolute top-1/2 -left-32 w-96 h-96 blur-[120px] rounded-full pointer-events-none -translate-y-1/2" 
                          style={{ backgroundColor: COLORS.brand.blueDim }}
                        />

                        <div className="xl:col-span-5 relative z-10">
                            <Zap className="w-4 h-4 md:w-8 md:h-8 mb-2 md:mb-6 opacity-80" style={{ color: COLORS.brand.blue }} />
                            <h3 className="text-xl sm:text-3xl md:text-5xl lg:text-7xl font-black tracking-tighter text-white mb-1 md:mb-2">XT-Class</h3>
                            <p className="text-[9px] sm:text-[11px] md:text-sm font-bold tracking-[0.2em] uppercase font-mono mb-3 md:mb-8" style={{ color: `${COLORS.brand.blue}b3` }}>220M — 7B Parameters</p>
                            <p className="text-xs sm:text-sm md:text-lg text-gray-400 font-medium leading-relaxed">
                                The Inference Pioneers. While we seek matching long-term funding, we build with what we have. Currently funded completely by MR.FAIZ, revenue and validation data from XT models directly fuel the path to the ARC One flagship.
                            </p>
                        </div>

                        <div className="xl:col-span-7 relative z-10 grid grid-cols-3 gap-px" style={{ backgroundColor: `${COLORS.brand.blue}33` }}>
                            {[
                                { value: 'Edge-First', label: 'Deployment' },
                                { value: 'Sub-100ms', label: 'Latency' },
                                { value: '25×', label: 'Speedup' }
                            ].map(stat => (
                                <div 
                                  key={stat.label} 
                                  className="bg-[#00030a] py-3 px-1 sm:p-6 md:p-8 flex flex-col justify-center items-center transition-colors hover:bg-white/[0.02]"
                                >
                                    <span className="text-[10px] min-[360px]:text-xs sm:text-lg md:text-xl lg:text-2xl font-black text-white text-center">{stat.value}</span>
                                    <span className="text-[6px] min-[360px]:text-[8px] sm:text-[9px] md:text-[10px] font-bold text-gray-500 uppercase tracking-normal min-[360px]:tracking-wider sm:tracking-widest mt-1 text-center">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Connecting structure */}
                <div className="flex justify-center -my-9 z-20 relative px-12 lg:px-0 lg:justify-end lg:pr-32">
                    <div className="w-px h-16 bg-gradient-to-b relative" style={{ background: `linear-gradient(to bottom, ${COLORS.brand.blue}80, rgba(255,255,255,0.1))` }}>
                         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-black border flex items-center justify-center" style={{ borderColor: `${COLORS.brand.blue}80` }}>
                              <MoveDown className="w-2 h-2" style={{ color: COLORS.brand.blue }} />
                         </div>
                    </div>
                </div>

                {/* ARC One-Class : The Horizon */}
                <motion.div variants={fadeUp} className="relative border border-white/5 bg-[#030303] overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 md:p-8">
                        <span className="text-[8px] md:text-[10px] font-bold text-gray-600 uppercase tracking-widest">The Horizon</span>
                    </div>

                    <div className="px-4 py-6 sm:p-8 md:p-16 grid grid-cols-1 xl:grid-cols-12 gap-6 md:gap-12 items-center">
                        <div className="xl:col-span-5">
                            <Crown className="w-4 h-4 md:w-8 md:h-8 text-white/20 mb-2 md:mb-6" />
                            <h3 className="text-xl sm:text-3xl md:text-5xl lg:text-7xl font-black tracking-tighter text-white mb-1 md:mb-2">ARC One-Class</h3>
                            <p className="text-[9px] sm:text-[11px] md:text-sm font-bold text-white/40 tracking-[0.2em] uppercase font-mono mb-3 md:mb-8">390B Parameters — Flagship</p>
                            <p className="text-xs sm:text-sm md:text-lg text-gray-500 font-medium leading-relaxed">
                                The Cognitive Peak. ARC One is the destination that every XT-Class milestone builds toward. A 390B parameter sovereign Diffusion LLM. When we arrive, it will not just be large. It will be the most efficient large model built from a native engineering foundation.
                            </p>
                        </div>

                        <div className="xl:col-span-7 grid grid-cols-3 gap-px bg-white/10">
                            {[
                                { value: '390B', label: 'Parameters', highlight: true },
                                { value: 'Sovereign', label: 'Infrastructure' },
                                { value: 'Flagship', label: 'Performance' }
                            ].map(stat => (
                                <div key={stat.label} className="bg-[#050505] py-3 px-1 sm:p-6 md:p-8 flex flex-col justify-center items-center">
                                    <span className={`text-[10px] min-[360px]:text-xs sm:text-lg md:text-xl lg:text-2xl font-black text-center ${stat.highlight ? 'text-white' : 'text-gray-400'}`}>{stat.value}</span>
                                    <span className="text-[6px] min-[360px]:text-[8px] sm:text-[9px] md:text-[10px] font-bold text-gray-600 uppercase tracking-normal min-[360px]:tracking-wider sm:tracking-widest mt-1 text-center">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

            </motion.div>
        </div>

        {/* ── XT-CLASS SCALING STRIP (MASSIVE DESTINATION FOCUS) ── */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="pt-20 md:pt-32 border-t border-white/10 flex flex-col gap-12 md:gap-16 relative">
            <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 md:gap-8 mb-4 md:mb-8">
                 <div className="max-w-2xl">
                     <div className="flex items-center gap-3 mb-4 md:mb-6">
                        <Terminal className="w-5 h-5" style={{ color: COLORS.brand.blue }} />
                        <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.25em]" style={{ color: COLORS.brand.blue }}>Telemetry & Progression</span>
                     </div>
                     <h3 className="text-3xl md:text-4xl text-white font-black tracking-tighter mb-3 md:mb-4">The Route to 390B.</h3>
                     <p className="text-gray-500 text-base md:text-lg font-medium leading-relaxed">
                        Each component in the XT-Class unlocks capital, computing resources, and vital infrastructure telemetry. This is not a random sequence of models. This is a deliberate, force-multiplying path to the ARC One-Class flagship. 
                     </p>
                 </div>
                 
                 <div 
                  className="text-left lg:text-right border-l-[2px] md:border-l-[3px] lg:border-l-0 lg:border-r-[3px] pl-4 md:pl-6 lg:pl-0 lg:pr-6 py-1 md:py-2"
                  style={{ borderColor: COLORS.brand.blue }}
                 >
                     <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] block mb-1 md:mb-2" style={{ color: `${COLORS.brand.blue}b3` }}>Absolute Destination</span>
                     <span className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">ARC One 390B</span>
                 </div>
            </div>

            <div className="relative w-full py-4 md:py-8 mt-4 md:mt-12 mb-4 md:mb-6">
                 {/* Massive track background */}
                 <div className="absolute top-1/2 left-0 right-0 h-2 md:h-3 bg-white/5 -translate-y-1/2 rounded-full overflow-hidden hidden md:block">
                     {/* Filled progress up to current */}
                     <div 
                        className="absolute top-0 left-0 bottom-0 w-[20%] rounded-full shadow-[0_0_30px_rgba(0,163,255,0.5)]" 
                        style={{ background: `linear-gradient(to right, ${COLORS.brand.blueDim}, ${COLORS.brand.blue})` }}
                     />
                 </div>
                 
                 {/* Mobile vertical track line */}
                 <div className="absolute left-[24px] top-4 bottom-4 w-1 bg-white/5 -translate-x-1/2 rounded-full overflow-hidden block md:hidden">
                     <div 
                        className="absolute top-0 left-0 bottom-[80%] right-0 rounded-full" 
                        style={{ background: `linear-gradient(to bottom, ${COLORS.brand.blueDim}, ${COLORS.brand.blue})` }}
                     />
                 </div>
                 
                 <div className="flex flex-col md:flex-row justify-between items-center relative z-10 md:px-6 gap-8 md:gap-0">
                      {xtModels.map((model) => (
                        <div key={model.params} className="flex flex-row md:flex-col items-center gap-6 md:gap-6 w-full md:w-[100px] justify-start md:justify-center">
                            {/* Node Point Wrapper for Mobile Axis Alignment */}
                            <div className="w-12 h-12 md:w-auto md:h-auto flex items-center justify-center shrink-0 relative">
                                {model.done ? (
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-4 border-emerald-500 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)] z-10 bg-black shrink-0">
                                        <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-emerald-500" />
                                    </div>
                                ) : model.current ? (
                                    <div 
                                      className="w-12 h-12 md:w-16 md:h-16 rounded-full border-4 bg-black flex items-center justify-center relative z-10 transition-transform hover:scale-110 cursor-pointer shrink-0"
                                      style={{ borderColor: COLORS.brand.blue, boxShadow: `0 0 50px ${COLORS.brand.blueMuted}` }}
                                    >
                                        <div className="w-3.5 h-3.5 md:w-4 md:h-4 rounded-full animate-ping absolute" style={{ backgroundColor: COLORS.brand.blue }} />
                                        <div className="w-4 h-4 md:w-5 md:h-5 rounded-full" style={{ backgroundColor: COLORS.brand.blue }} />
                                    </div>
                                ) : (
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white/20 bg-black flex items-center justify-center z-10 shrink-0">
                                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white/20" />
                                    </div>
                                )}
                            </div>

                            {/* Node Label */}
                            <div className="text-left md:text-center font-mono flex flex-col gap-0 md:gap-2">
                                <span className={`text-xl md:text-2xl font-black tracking-tight ${model.done ? 'text-emerald-500' : model.current ? 'text-white' : 'text-gray-500'}`}>{model.params}</span>
                                <span className={`text-[10px] md:text-[11px] font-bold uppercase tracking-widest ${model.done ? 'text-emerald-500/60' : model.current ? 'text-[#00a3ff]' : 'text-gray-600'}`} style={{ color: model.current ? COLORS.brand.blue : undefined }}>{model.name}</span>
                            </div>
                        </div>
                     ))}
                 </div>
            </div>
        </motion.div>

      </div>
    </section>
  );
}

