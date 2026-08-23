"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Cpu, Atom, Network, ArrowUpRight, BookOpen } from "lucide-react";

// ── Neural particle canvas (Subtle drift, no flashing sweeps) ────────────────
function NeuralCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const nodes: { x: number; y: number; vx: number; vy: number; r: number }[] = [];
    for (let i = 0; i < 40; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.1,
        vy: (Math.random() - 0.5) * 0.1,
        r: Math.random() * 1.2 + 0.4,
      });
    }

    let frame = 0;
    let animId: number;

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      nodes.forEach(n => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      });

      // Connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 163, 255, ${0.04 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Nodes
      nodes.forEach(n => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 163, 255, 0.2)";
        ctx.fill();
      });

      // Oscilloscope wave at the bottom - slow and very subtle
      const midY = H * 0.88;
      ctx.beginPath();
      for (let x = 0; x <= W; x += 3) {
        const y = midY
          + Math.sin(x * 0.008 + frame * 0.008) * 8
          + Math.sin(x * 0.016 + frame * 0.005) * 3;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "rgba(0, 163, 255, 0.05)";
      ctx.lineWidth = 1.0;
      ctx.stroke();

      frame++;
      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    />
  );
}

// ── Research pillars data ───────────────────────────────────────────────────
const PILLARS = [
  {
    icon: Cpu,
    title: "Parallel Intelligence",
    tag: "Systems & Kernels",
    desc: "Implementing direct bare-metal inference, fused GPU kernels, and custom hardware scaling pathways to bypass traditional stack latency layers.",
    color: "text-[#00a3ff]",
    borderColor: "group-hover:border-[#00a3ff]/35",
    glowColor: "rgba(0, 163, 255, 0.04)",
  },
  {
    icon: Atom,
    title: "Physics-Native AI",
    tag: "Mathematical Foundations",
    desc: "Developing continuous-time Neural ODE models, topological manifold projection theories, and architecture designs informed by physics.",
    color: "text-emerald-400",
    borderColor: "group-hover:border-emerald-400/35",
    glowColor: "rgba(52, 211, 153, 0.03)",
  },
  {
    icon: Network,
    title: "Sovereign Models",
    tag: "Weights & Distillation",
    desc: "Pretraining self-dependent model weights from scratch with proprietary optimization strategies, entirely free of commercial licensing dependencies.",
    color: "text-purple-400",
    borderColor: "group-hover:border-purple-400/35",
    glowColor: "rgba(168, 85, 247, 0.03)",
  },
];

const KEYWORDS = [
  "Neural ODEs", "Sparse Attention", "Topological ML",
  "Physics-Native AI", "Parallel Intelligence", "Hardware Affinity",
  "VRAM Compression", "Zero-Dependency Kernels",
];

export default function ResearchHero() {
  return (
    <section className="relative flex flex-col items-center justify-center bg-[#000000] overflow-hidden pt-36 pb-20 min-h-[95vh] selection:bg-[#00a3ff]/30">

      {/* Background layer: neural canvas with gentle drifting */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <NeuralCanvas />
      </div>

      {/* Radial glow overlays - soft & slow breathing */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(0,163,255,0.06)_0%,transparent_70%)] pointer-events-none z-[1] blur-[80px]" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.03)_0%,transparent_70%)] pointer-events-none z-[1] blur-[80px]" />

      {/* Futuristic dotted matrix overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-[1] opacity-[0.015]"
        style={{
          backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 md:px-12 relative z-10 flex flex-col items-center">
        
        {/* Top telemetry status bar */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.02] border border-white/[0.08] shadow-[0_0_15px_rgba(255,255,255,0.02)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00a3ff] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00a3ff]"></span>
            </span>
            <span className="text-[9px] font-mono text-gray-400 uppercase tracking-[0.25em]">
              Lab Status: Active // Core v2.8
            </span>
          </div>
        </motion.div>

        {/* Lab Branding Label */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-center gap-3 mb-4"
        >
          <div className="w-6 h-px bg-[#00a3ff]" />
          <span className="text-[10px] font-mono font-bold tracking-[0.4em] uppercase text-[#00a3ff]">
            Introlic // R&D // Labs
          </span>
          <div className="w-6 h-px bg-[#00a3ff]" />
        </motion.div>

        {/* Centered Headline */}
        <div className="text-center max-w-4xl mb-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(2.2rem,5vw,4.5rem)] font-black text-white tracking-tightest leading-[1.05] select-none"
          >
            Foundational{" "}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00a3ff] via-[#38d6ff] to-[#0070d1] italic">
                Research
              </span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-[#00a3ff]/60 via-[#00a3ff]/30 to-transparent origin-left"
              />
            </span>{" "}
            <span className="text-white/90 italic">Lab.</span>
          </motion.h1>
        </div>

        {/* Centered Description */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-center text-sm sm:text-base md:text-lg text-gray-400 leading-relaxed max-w-[700px] mb-8"
        >
          Pioneering next-generation computation paradigms. We publish open-access dispatches
          and engineering whitepapers outlining critical breakthroughs in intelligence architectures,
          extreme math optimization, and systems design.
        </motion.p>

        {/* CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-12"
        >
          <a
            href="#papers"
            className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-[#00a3ff] text-black font-bold text-xs uppercase tracking-wider transition-all hover:bg-[#38d6ff] hover:shadow-[0_0_30px_rgba(0,163,255,0.35)] active:scale-95 cursor-pointer"
          >
            Explore Papers
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
          <a
            href="#papers"
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/[0.08] text-gray-400 font-bold text-xs uppercase tracking-wider transition-all hover:border-white/20 hover:text-white cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Technical Archives
          </a>
        </motion.div>

        {/* Keyword pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mb-20"
        >
          {KEYWORDS.map((kw, i) => (
            <motion.span
              key={kw}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.5 + i * 0.03 }}
              className="px-3 py-1 rounded-lg bg-white/[0.02] border border-white/[0.06] text-[9px] font-mono text-gray-500 uppercase tracking-widest hover:border-[#00a3ff]/20 hover:text-[#00a3ff]/70 transition-all cursor-default"
            >
              {kw}
            </motion.span>
          ))}
        </motion.div>

        {/* ── Research Pillars Showcase (Replaced Stats and Orbital visual) ── */}
        <div className="w-full max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PILLARS.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group relative p-6 rounded-2xl bg-[#050505]/45 backdrop-blur-md border border-white/[0.04] transition-all duration-300 hover:bg-[#07070a]/60 hover:border-white/[0.08]"
                style={{
                  boxShadow: `0 4px 30px rgba(0, 0, 0, 0.4)`,
                }}
              >
                {/* Subtle backglow gradient on card hover */}
                <div 
                  className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none blur-sm"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${pillar.glowColor} 0%, transparent 60%)`,
                  }}
                />

                <div className="relative z-10 flex flex-col h-full gap-4 text-left">
                  {/* Icon wrap */}
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] ${pillar.color}`}>
                      <pillar.icon className="w-5 h-5" strokeWidth={1.5} />
                    </div>
                    <span className="text-[8px] font-mono text-gray-600 uppercase tracking-widest bg-white/[0.02] border border-white/[0.04] px-2 py-0.5 rounded">
                      {pillar.tag}
                    </span>
                  </div>

                  {/* Title & Desc */}
                  <div className="space-y-2 mt-2">
                    <h3 className="text-base font-black text-white tracking-tight uppercase group-hover:text-white transition-colors">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom transition fade */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#020202] to-transparent z-[4] pointer-events-none" />
    </section>
  );
}
