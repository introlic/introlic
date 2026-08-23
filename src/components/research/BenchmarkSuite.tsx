"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Activity, TrendingUp } from 'lucide-react';

const benchmarks = [
  { label: "Introlic Engine", value: 98, color: "#00a3ff", sub: "Silicon-Native" },
  { label: "vLLM Stack", value: 42, color: "#444444", sub: "Standard Cuda" },
  { label: "Ollama / Llama.cpp", value: 31, color: "#333333", sub: "Unified Memory" },
  { label: "Standard Python", value: 12, color: "#222222", sub: "Interpreter Base" }
];

export default function BenchmarkSuite() {
  return (
    <section className="relative bg-[#050505] py-32 md:py-48 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:60px_60px]" />
      
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center mb-32">
           <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="inline-flex items-center gap-3 px-4 py-2 bg-[#00a3ff]/10 border border-[#00a3ff]/30 rounded-full mb-8"
           >
              <Activity className="w-4 h-4 text-[#00a3ff]" />
              <span className="text-[10px] font-black tracking-widest text-[#00a3ff] uppercase">Audit Portfolio // 2026.04</span>
           </motion.div>
           <h2 className="text-4xl md:text-6xl font-black text-white tracking-tightest leading-tight mb-8">
              Comparative Performance Metrics.
           </h2>
           <p className="text-gray-500 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
              Standard stacks rely on abstraction layers. We communicate with the silicon directly. The delta is hardware-native efficiency.
           </p>
        </div>

        <div className="p-1 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-[40px] overflow-hidden">
           <div className="bg-[#080808] rounded-[39px] p-8 md:p-20 flex flex-col gap-12 border border-white/5">
              
              <div className="flex flex-col gap-16">
                 {benchmarks.map((b, i) => (
                   <div key={b.label} className="relative">
                      <div className="flex justify-between items-end mb-4">
                         <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-mono text-gray-700 tracking-[0.3em] uppercase">{b.sub}</span>
                            <span className={`text-xl font-bold tracking-tighter ${b.label === 'Introlic Engine' ? 'text-white' : 'text-gray-500'}`}>
                               {b.label}
                            </span>
                         </div>
                         <div className="text-right flex flex-col gap-1">
                            <span className="text-[10px] font-mono text-gray-700 tracking-[0.3em] uppercase">Efficiency Index</span>
                            <span className={`text-3xl font-black italic tracking-tighter ${b.label === 'Introlic Engine' ? 'text-[#00a3ff]' : 'text-gray-600'}`}>
                               {b.value}%
                            </span>
                         </div>
                      </div>

                      <div className="h-4 bg-white/[0.03] rounded-sm overflow-hidden border border-white/5 relative">
                         <motion.div 
                           initial={{ width: 0 }}
                           whileInView={{ width: `${b.value}%` }}
                           viewport={{ once: true }}
                           transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: i * 0.2 }}
                           style={{ backgroundColor: b.color }}
                           className={`h-full relative ${b.label === 'Introlic Engine' ? 'shadow-[0_0_20px_rgba(0,163,255,0.4)]' : ''}`}
                         >
                            {b.label === 'Introlic Engine' && (
                               <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[size:100px_100px] animate-[shimmer_2s_infinite]" />
                            )}
                         </motion.div>
                      </div>
                   </div>
                 ))}
              </div>

              <div className="mt-12 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between gap-10">
                 <div className="flex gap-10">
                    <div className="flex flex-col gap-1">
                       <span className="text-[10px] font-mono text-gray-700 tracking-widest uppercase leading-none">Mean Latency Δ</span>
                       <span className="text-2xl font-black text-white italic">-92%</span>
                    </div>
                    <div className="flex flex-col gap-1">
                       <span className="text-[10px] font-mono text-gray-700 tracking-widest uppercase leading-none">Memory Efficiency</span>
                       <span className="text-2xl font-black text-white italic">+4.2×</span>
                    </div>
                 </div>
                 <div className="bg-white/[0.03] border border-white/10 px-6 py-4 rounded-xl flex items-center gap-4">
                    <TrendingUp className="w-5 h-5 text-[#00a3ff]" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Aggregate Optimization Delta: High Priority</span>
                 </div>
              </div>

           </div>
        </div>

      </div>
    </section>
  );
}
