"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Activity, Hexagon } from 'lucide-react';

export default function LabTelemetry() {
  const [activeNode, setActiveNode] = useState(0);
  
  return (
    <section className="relative bg-[#020202] py-32 md:py-48 selection:bg-[#00a3ff]/30">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
           
           {/* Left Hub - Telemetry Data Nav */}
           <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="flex items-center gap-4 mb-12">
                 <div className="w-12 h-px bg-[#00a3ff]" />
                 <span className="text-[10px] font-black tracking-[0.4em] uppercase text-[#00a3ff]">Telemetry Control Hub</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tightest leading-none mb-12">
                 Live Performance<br />
                 <span className="italic opacity-50">Instrumentation.</span>
              </h2>

              <div className="space-y-4">
                 {[
                   { id: "NODE_01", label: "Kernel Allocation Matrix", status: "STABLE", icon: Cpu },
                   { id: "NODE_02", label: "Temporal Distillation Path", status: "ACTIVE", icon: Activity },
                   { id: "NODE_03", label: "Hardware-Affinity Bridge", status: "LOCKED", icon: Hexagon }
                 ].map((node, i) => (
                   <button 
                     key={node.id}
                     onClick={() => setActiveNode(i)}
                     className={`w-full group p-6 rounded-2xl border transition-all duration-500 text-left flex items-center justify-between ${
                        activeNode === i 
                        ? 'bg-[#00a3ff]/10 border-[#00a3ff]/30' 
                        : 'bg-[#050505] border-white/5 hover:border-white/10'
                     }`}
                   >
                      <div className="flex items-center gap-6">
                         <div className={`p-4 rounded-xl transition-colors ${activeNode === i ? 'bg-[#00a3ff]/20 text-[#00a3ff]' : 'bg-white/5 text-gray-700'}`}>
                            <node.icon className="w-6 h-6" />
                         </div>
                         <div className="flex flex-col">
                            <span className="text-[9px] font-mono text-gray-700 tracking-[0.3em] uppercase mb-1">{node.id}</span>
                            <span className={`text-lg font-bold tracking-tight transition-colors ${activeNode === i ? 'text-white' : 'text-gray-500'}`}>
                               {node.label}
                            </span>
                         </div>
                      </div>
                      <div className="flex items-center gap-3">
                         <div className={`w-1.5 h-1.5 rounded-full ${activeNode === i ? 'bg-emerald-500 animate-pulse' : 'bg-gray-800'}`} />
                         <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">{node.status}</span>
                      </div>
                   </button>
                 ))}
              </div>
           </div>

           {/* Right Hub - The Visualization Stage */}
           <div className="lg:col-span-7 relative flex items-center justify-center p-px bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-[40px] min-h-[500px] overflow-hidden">
              <div className="absolute inset-0 bg-black rounded-[39px] overflow-hidden">
                 {/* Visual HUD components */}
                 <div className="absolute inset-0 opacity-10 bg-[url('/noise.svg')] mix-blend-overlay pointer-events-none" />
                 <div className="absolute top-10 left-10 text-[10px] font-mono text-gray-700 uppercase tracking-widest">
                    Telemetry Stream // v2.8.4
                 </div>
                 <div className="absolute bottom-10 right-10 flex gap-4">
                    <div className="w-20 h-1 bg-white/5 rounded-full overflow-hidden">
                       <motion.div 
                         animate={{ x: ["-100%", "100%"] }} 
                         transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                         className="w-full h-full bg-[#00a3ff]" 
                       />
                    </div>
                 </div>

                 <AnimatePresence mode="wait">
                    <motion.div 
                      key={activeNode}
                      initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                       {activeNode === 0 && <AllocationVisual />}
                       {activeNode === 1 && <TemporalVisual />}
                       {activeNode === 2 && <AffinityVisual />}
                    </motion.div>
                 </AnimatePresence>
              </div>
           </div>

        </div>
      </div>
    </section>
  );
}

function AllocationVisual() {
  return (
    <div className="grid grid-cols-8 gap-2 w-2/3 opacity-40">
       {[...Array(64)].map((_, i) => (
         <motion.div 
           key={i} 
           animate={{ 
             opacity: [0.1, 1, 0.1],
             backgroundColor: i % 7 === 0 ? '#00a3ff' : '#111111'
           }}
           transition={{ duration: 3, delay: i * 0.05, repeat: Infinity }}
           className="aspect-square bg-[#111111] rounded-sm" 
         />
       ))}
    </div>
  );
}

function TemporalVisual() {
  return (
    <div className="relative w-2/3 h-48 flex items-center">
       <svg className="absolute inset-0 w-full h-full">
          <motion.path 
            d="M 0 96 Q 200 10, 400 96 T 800 96"
            fill="none"
            stroke="#00a3ff"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, repeat: Infinity }}
          />
       </svg>
       <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
          <span className="text-4xl font-black text-white italic tracking-tighter shadow-2xl">4.2ms</span>
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mt-2">Latency Floor</span>
       </div>
    </div>
  );
}

function AffinityVisual() {
  return (
    <div className="relative flex flex-col items-center">
       <div className="relative">
          <Hexagon className="w-32 h-32 text-[#00a3ff] animate-pulse" />
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border border-white/10 rounded-full scale-150 border-dashed" 
          />
       </div>
       <div className="mt-20 grid grid-cols-2 gap-10">
          <div className="flex flex-col items-center">
             <span className="text-[10px] font-mono text-gray-700 uppercase tracking-widest leading-none mb-1">Metal Sync</span>
             <span className="text-xl font-bold text-white uppercase italic">Active</span>
          </div>
          <div className="flex flex-col items-center">
             <span className="text-[10px] font-mono text-gray-700 uppercase tracking-widest leading-none mb-1">Egress Control</span>
             <span className="text-xl font-bold text-emerald-500 uppercase italic">Locked</span>
          </div>
       </div>
    </div>
  );
}
