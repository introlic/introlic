"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Settings, FileCode, Layers, Radio } from 'lucide-react';

const steps = [
  {
    title: "Schema Analysis",
    id: "01",
    desc: "Rigorous formal logic check on the target environment architecture.",
    icon: Settings
  },
  {
    title: "Kernel Fusion",
    id: "02",
    desc: "Bypassing the Python interpreter to talk directly with the hardware.",
    icon: FileCode
  },
  {
    title: "State Distillation",
    id: "03",
    desc: "Collapsing complex inference steps into parallel state resolutions.",
    icon: Layers
  },
  {
    title: "Live Deployment",
    id: "04",
    desc: "Real-time edge execution with zero-latency synchronization.",
    icon: Radio
  }
];

export default function OperationalPipeline() {
  return (
    <section className="relative bg-[#050505] py-32 md:py-48 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-center mb-32 relative z-10">
        <motion.h2 
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="text-4xl md:text-6xl font-black text-white tracking-tightest leading-none mb-8"
        >
           The Deployment Lifecycle.
        </motion.h2>
        <p className="text-gray-500 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
           From mathematical intent to silicon-native execution. Our process is designed for absolute predictability.
        </p>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
           {/* Connecting Line */}
           <div className="absolute top-1/2 left-0 w-full h-px bg-white/5 -translate-y-1/2 hidden lg:block" />
           
           {steps.map((step, i) => (
             <motion.div
               key={step.title}
               initial={{ opacity: 0, y: 40 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.15 }}
               className="flex flex-col items-center group"
             >
                <div className="relative mb-10">
                   <div className="w-24 h-24 bg-black border border-white/10 rounded-full flex items-center justify-center group-hover:border-[#00a3ff] group-hover:shadow-[0_0_30px_rgba(0,163,255,0.2)] transition-all duration-500 z-10 relative">
                      <step.icon className="w-8 h-8 text-gray-400 group-hover:text-[#00a3ff] transition-colors" />
                   </div>
                   <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 bg-[#00a3ff] text-black text-[10px] font-black px-2 py-1 rounded-sm z-20">
                      STP_{step.id}
                   </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-[#00a3ff] transition-colors">
                   {step.title}
                </h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed group-hover:text-gray-400 transition-colors">
                   {step.desc}
                </p>
             </motion.div>
           ))}
        </div>
      </div>
    </section>
  );
}
