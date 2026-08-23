"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Zap, Database, LayoutPanelLeft, Share2 } from 'lucide-react';

const services = [
  {
    id: "01",
    title: "Native Runtime",
    subtitle: "Hardware-Native Execution",
    desc: "Designing native execution paths to minimize high-level runtime bottlenecks, targeting close-to-silicon execution speeds.",
    icon: Cpu,
    tags: ["Native Speed", "Hardware-Close", "Optimized Path"]
  },
  {
    id: "02",
    title: "Kernel Research",
    subtitle: "Low-Level Optimizations",
    desc: "Researching Triton and CUDA kernel configurations to optimize GPU memory footprint and maximize throughput on local hardware.",
    icon: Zap,
    tags: ["Triton", "CUDA Kernels", "Memory Control"]
  },
  {
    id: "03",
    title: "Sovereign Infrastructure",
    subtitle: "Private Edge Deployment",
    desc: "Developing local deployment frameworks to run foundational models privately with complete data isolation and zero external dependencies.",
    icon: Database,
    tags: ["Edge-Native", "Zero-Egress", "Air-Gapped"]
  },
  {
    id: "04",
    title: "Distillation Research",
    subtitle: "Consistency Distillation",
    desc: "Exploring mathematical distillation techniques to collapse iterative generative steps, aiming for fast parallel response cycles.",
    icon: LayoutPanelLeft,
    tags: ["Distillation", "Fast Parallelism", "Research Goal"]
  }
];

export default function ProjectGrid() {
  return (
    <section className="relative bg-[#020202] py-32 md:py-48">
      {/* Background Polish */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="mb-24 flex flex-col lg:flex-row lg:items-end justify-between gap-12">
          <div className="max-w-2xl">
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="flex items-center gap-4 mb-8"
            >
               <div className="p-2 bg-[#00a3ff]/10 rounded-lg">
                  <Share2 className="w-5 h-5 text-[#00a3ff]" />
               </div>
               <span className="text-[#00a3ff] font-black tracking-[0.4em] uppercase text-xs">Section 01 // Core Capabilities</span>
            </motion.div>
            <motion.h2 
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               className="text-5xl md:text-7xl font-black text-white tracking-tightest leading-[0.85] break-words"
            >
               Operational<br />
               <span className="italic opacity-40">Taxonomy.</span>
            </motion.h2>
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="lg:max-w-md text-xl text-gray-500 font-medium leading-relaxed border-l-2 border-white/10 pl-8"
          >
            We don&apos;t build software layers; we build hardware interfaces. Every project is a direct channel to efficiency.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5 rounded-[32px] overflow-hidden">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#050505] p-10 md:p-16 hover:bg-[#080808] transition-colors group relative"
            >
              <div className="flex justify-between items-start mb-12">
                 <div className="p-5 bg-white/[0.03] border border-white/5 rounded-2xl group-hover:bg-[#00a3ff]/10 group-hover:border-[#00a3ff]/20 transition-all duration-500">
                    <service.icon className="w-8 h-8 text-gray-400 group-hover:text-[#00a3ff] transition-colors" />
                 </div>
                 <span className="text-4xl font-black text-white/5 group-hover:text-[#00a3ff]/10 transition-colors">{service.id}</span>
              </div>
              
              <div className="flex flex-col gap-2 mb-6">
                <span className="text-[10px] font-mono tracking-widest uppercase text-[#00a3ff] opacity-60">
                   {service.subtitle}
                </span>
                <h3 className="text-3xl font-black text-white tracking-tighter">
                   {service.title}
                </h3>
              </div>

              <p className="text-gray-500 text-lg font-medium leading-relaxed mb-10 group-hover:text-gray-400 transition-colors">
                 {service.desc}
              </p>

              <div className="flex flex-wrap gap-2">
                 {service.tags.map(tag => (
                   <span key={tag} className="text-[9px] font-bold text-gray-600 uppercase tracking-widest px-3 py-1.5 border border-white/5 rounded-full bg-black">
                      {tag}
                   </span>
                 ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
