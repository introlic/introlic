"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen, Cpu, FlaskConical, Layers, Target, Zap, ArrowRight,
  ChevronRight, Menu, X, ExternalLink, Clock, GitBranch, Map,
  Microscope, Globe, Users, AlertCircle
} from 'lucide-react';
import { COLORS } from '@/constants/branding';

// ── Navigation ──
const NAV_GROUPS = [
  {
    groupName: "OVERVIEW",
    links: [
      { id: "intro", name: "What is Introlic?" },
      { id: "mission", name: "The Mission" },
      { id: "why-dlm", name: "Why Discrete Diffusion?" },
    ]
  },
  {
    groupName: "RESEARCH PLAN",
    links: [
      { id: "phase-1", name: "Phase 1 — XT-Proof (7.2M)" },
      { id: "phase-2", name: "Phase 2 — XT-Micro (220M)" },
      { id: "phase-3", name: "Phase 3 — Scale & Open" },
    ]
  },
  {
    groupName: "ARCHITECTURE",
    links: [
      { id: "sedd", name: "SEDD — Score Entropy Diffusion" },
      { id: "dlm-vs-transformer", name: "DLM vs Transformer" },
      { id: "context-window", name: "Context Window Problem" },
    ]
  },
  {
    groupName: "THE LAB",
    links: [
      { id: "founder", name: "About the Founder" },
      { id: "in1", name: "The 'in1' Movement" },
      { id: "fellowship", name: "Kothari Fellowship" },
    ]
  }
];

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState("intro");
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleTab = (id: string) => {
    setActiveTab(id);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#020202] text-gray-300 font-sans antialiased flex flex-col selection:bg-cyan-500/30 selection:text-white">

      {/* ── HEADER ── */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-md border-b border-white/5 z-40 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            <img src="/icon.png" alt="Introlic" className="w-8 h-8 object-contain group-hover:rotate-[30deg] transition-transform duration-500 ease-out" />
            <div className="flex items-center gap-2 select-none">
              <span className="font-black tracking-tight text-base" style={{ color: COLORS.brand.blue }}>INTROLiC</span>
              <div className="h-3 w-px bg-white/20" />
              <span className="text-[10px] font-bold text-gray-500 tracking-wider font-mono">RESEARCH DOCS</span>
            </div>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xs font-semibold text-gray-400 hover:text-white transition-colors">Back to Home</Link>
          <a href="https://introlic.in/ppt" target="_blank" rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all">
            <ExternalLink className="w-3.5 h-3.5" />
            Pitch Deck
          </a>
          <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 text-gray-400 hover:text-white">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 pt-16">

        {/* ── SIDEBAR (DESKTOP) ── */}
        <aside className="hidden lg:flex flex-col w-72 border-r border-white/5 bg-[#050505] fixed top-16 bottom-0 left-0 p-6 overflow-y-auto z-20">
          <nav className="space-y-8">
            {NAV_GROUPS.map(group => (
              <div key={group.groupName} className="space-y-1">
                <h5 className="text-[10px] font-bold text-gray-600 tracking-[0.2em] font-mono uppercase mb-3">{group.groupName}</h5>
                {group.links.map(link => (
                  <button
                    key={link.id}
                    onClick={() => handleTab(link.id)}
                    className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg flex items-center justify-between transition-all group ${
                      activeTab === link.id
                        ? 'bg-cyan-500/10 text-cyan-400 border-l-2 border-cyan-400 pl-2.5'
                        : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.02]'
                    }`}
                  >
                    <span>{link.name}</span>
                    <ChevronRight className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition-opacity ${activeTab === link.id ? 'opacity-100 text-cyan-400' : ''}`} />
                  </button>
                ))}
              </div>
            ))}
          </nav>

          {/* Fellowship badge in sidebar */}
          <div className="mt-auto pt-6 border-t border-white/5">
            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/15 space-y-2">
              <div className="text-[10px] font-bold text-cyan-400 font-mono tracking-wider uppercase">Kothari Fellowship</div>
              <p className="text-[11px] text-gray-500 leading-relaxed">Applying for $5,000–$7,000 to fund GPU compute for our 220M SEDD prototype.</p>
              <a href="/ppt" className="text-[11px] text-cyan-400 flex items-center gap-1 hover:gap-2 transition-all font-semibold">
                View Pitch Deck <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </aside>

        {/* ── MOBILE DRAWER ── */}
        {mobileOpen && (
          <>
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 lg:hidden" onClick={() => setMobileOpen(false)} />
            <div className="fixed top-0 right-0 bottom-0 w-80 bg-[#080808] border-l border-white/10 p-6 z-50 flex flex-col pt-16 overflow-y-auto">
              <button onClick={() => setMobileOpen(false)} className="absolute top-5 right-5 p-2 text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
              <nav className="space-y-6">
                {NAV_GROUPS.map(group => (
                  <div key={group.groupName} className="space-y-1">
                    <h5 className="text-[10px] font-bold text-gray-600 tracking-[0.2em] font-mono uppercase mb-2">{group.groupName}</h5>
                    {group.links.map(link => (
                      <button
                        key={link.id}
                        onClick={() => handleTab(link.id)}
                        className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
                          activeTab === link.id ? 'bg-cyan-950/30 text-cyan-400' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {link.name}
                      </button>
                    ))}
                  </div>
                ))}
              </nav>
            </div>
          </>
        )}

        {/* ── MAIN CONTENT ── */}
        <main className="flex-1 lg:pl-72 min-h-[calc(100vh-4rem)]">
          <div className="max-w-[900px] mx-auto px-6 md:px-12 py-12 md:py-16">

            {/* ─────────── INTRO ─────────── */}
            {activeTab === "intro" && (
              <div className="space-y-10">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 font-mono tracking-widest uppercase">
                    <BookOpen className="w-3.5 h-3.5" /> Overview
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none">What is Introlic?</h1>
                  <p className="text-lg text-gray-400 leading-relaxed max-w-2xl">
                    Introlic is an independent AI research lab founded in India in March 2026, focused entirely on <strong className="text-white">Discrete Diffusion Language Models (DLMs)</strong> and <strong className="text-white">SEDD (Score Entropy Discrete Diffusion)</strong> architectures.
                  </p>
                </div>

                <hr className="border-white/5" />

                <div className="p-6 rounded-2xl bg-cyan-950/10 border border-cyan-500/20 space-y-3">
                  <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-sm">
                    <AlertCircle className="w-4 h-4" /> Important Transparency Note
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    We do not have a working API or SDK yet. This documentation is our <strong className="text-white">research plan, architecture vision, and lab roadmap</strong> — honest, open, and in-progress. We are a 17-year-old founder with a clear thesis and a concrete prototype goal. Nothing here is marketing fluff.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {[
                    { icon: <FlaskConical className="w-5 h-5" />, title: "Research-First Lab", desc: "We focus on understanding and validating DLM architectures before claiming any product. Science before slides." },
                    { icon: <Cpu className="w-5 h-5" />, title: "Discrete Diffusion (SEDD)", desc: "Our core architecture: non-autoregressive text generation through iterative score-based denoising across the full sequence." },
                    { icon: <Globe className="w-5 h-5" />, title: "Built in India", desc: "Founded and led from India. Our goal is to build sovereign AI infrastructure that India owns end-to-end." },
                    { icon: <GitBranch className="w-5 h-5" />, title: "Open Research", desc: "Once our 220M SEDD prototype is trained, we will open-source our benchmarks, findings, and failure analysis." },
                  ].map(c => (
                    <div key={c.title} className="p-5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all flex flex-col gap-3">
                      <div className="p-2.5 bg-cyan-950/30 text-cyan-400 w-fit rounded-lg border border-cyan-500/10">{c.icon}</div>
                      <h3 className="text-sm font-bold text-white">{c.title}</h3>
                      <p className="text-xs text-gray-400 leading-relaxed">{c.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-4 border-t border-white/5">
                  <button onClick={() => handleTab("mission")} className="flex items-center gap-2 text-xs font-bold text-white hover:text-cyan-400 transition-colors">
                    Next: The Mission <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ─────────── MISSION ─────────── */}
            {activeTab === "mission" && (
              <div className="space-y-10">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 font-mono tracking-widest uppercase">
                    <Target className="w-3.5 h-3.5" /> Mission
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">The Mission.</h1>
                  <p className="text-lg text-gray-400 leading-relaxed max-w-2xl">
                    Introlic exists to open the Discrete Diffusion frontier in India — to discover, optimize, and build non-autoregressive sovereign AI from first principles.
                  </p>
                </div>

                <hr className="border-white/5" />

                <div className="space-y-6">
                  <p className="text-base text-gray-400 leading-relaxed border-l-2 border-cyan-500/40 pl-6">
                    The global AI race is dominated by Transformer-based autoregressive models. Everyone — OpenAI, Anthropic, Google, Meta — is doubling down on the same architecture. This creates a predictable, crowded field. But like DeepSeek proved with Mixture of Experts, the biggest breakthroughs come from going where others haven't looked yet.
                  </p>
                  <p className="text-base text-gray-400 leading-relaxed">
                    We believe <strong className="text-white">Discrete Diffusion Language Models (DLMs)</strong> represent exactly that kind of unexplored gold mine. The math is real. Inception Labs and Stanford SEDD have validated the foundational approach. What nobody in India has done yet — and what we intend to do — is validate it, push deeper into it, find its failure points, and optimize it from the ground up.
                  </p>
                  <p className="text-base text-gray-400 leading-relaxed">
                    This is not just about building a model. It's about building the <strong className="text-white">first foundational DLM research capability in India</strong>, open-sourcing our findings, and rallying a generation of Indian engineers around sovereign, non-autoregressive AI.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: "Immediate Goal", value: "220M SEDD Prototype", sub: "Validate the architecture" },
                    { label: "Mid-Term Goal", value: "'in1' Movement", sub: "Build a developer alliance" },
                    { label: "Long-Term Goal", value: "ARC One — 390B DLM", sub: "Sovereign flagship model" },
                  ].map(s => (
                    <div key={s.label} className="p-5 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col gap-1">
                      <div className="text-[10px] font-mono font-bold text-gray-600 uppercase tracking-widest">{s.label}</div>
                      <div className="text-base font-black text-white mt-1">{s.value}</div>
                      <div className="text-xs text-gray-500">{s.sub}</div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between pt-4 border-t border-white/5">
                  <button onClick={() => handleTab("intro")} className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-white transition-colors">
                    <ChevronRight className="w-4 h-4 rotate-180" /> Previous
                  </button>
                  <button onClick={() => handleTab("why-dlm")} className="flex items-center gap-2 text-xs font-bold text-white hover:text-cyan-400 transition-colors">
                    Next: Why Discrete Diffusion? <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ─────────── WHY DLM ─────────── */}
            {activeTab === "why-dlm" && (
              <div className="space-y-10">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 font-mono tracking-widest uppercase">
                    <Microscope className="w-3.5 h-3.5" /> Core Thesis
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Why Discrete Diffusion?</h1>
                  <p className="text-lg text-gray-400 leading-relaxed max-w-2xl">
                    The gold mine everyone is ignoring while they pile into Transformers.
                  </p>
                </div>

                <hr className="border-white/5" />

                <div className="space-y-5">
                  <h2 className="text-xl font-bold text-white">The Transformer Problem</h2>
                  <p className="text-sm text-gray-400 leading-relaxed">Standard autoregressive Transformers generate text strictly left-to-right, one token at a time. This creates two hard, fundamental limits:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { title: "❌ Cannot Fix Mistakes Mid-Generation", desc: "Once a wrong token is generated, it compounds forward. The model cannot go back and self-correct. This causes hallucinations to cascade." },
                      { title: "❌ Quadratic Context Window Cost", desc: "Attention is O(N²) — doubling the context length quadruples the compute. This is why long-context is so expensive and limited." },
                    ].map(p => (
                      <div key={p.title} className="p-5 rounded-xl bg-red-950/10 border border-red-500/10 space-y-2">
                        <div className="text-sm font-bold text-red-400">{p.title}</div>
                        <p className="text-xs text-gray-400 leading-relaxed">{p.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-5">
                  <h2 className="text-xl font-bold text-white">The DLM Advantage</h2>
                  <p className="text-sm text-gray-400 leading-relaxed">Discrete Diffusion Language Models generate text by starting with a fully noised/masked sequence and iteratively denoising the entire sequence simultaneously. This unlocks fundamentally different capabilities:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { title: "✅ Real-Time Self-Correction", desc: "The model can revise any token in the sequence at any denoising step. Errors surface and get corrected mid-generation." },
                      { title: "✅ Bidirectional Context", desc: "Unlike left-to-right attention, every token can attend to all others simultaneously during denoising, enabling richer reasoning." },
                      { title: "✅ Parallel Generation", desc: "All tokens can be refined in parallel rather than sequentially, opening the door to much faster and more efficient inference." },
                      { title: "✅ Unexplored Territory", desc: "The field is early. Inception Labs and Stanford SEDD proved it works — but the optimization landscape is wide open." },
                    ].map(p => (
                      <div key={p.title} className="p-5 rounded-xl bg-green-950/10 border border-green-500/10 space-y-2">
                        <div className="text-sm font-bold text-green-400">{p.title}</div>
                        <p className="text-xs text-gray-400 leading-relaxed">{p.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-white/5">
                  <button onClick={() => handleTab("mission")} className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-white transition-colors">
                    <ChevronRight className="w-4 h-4 rotate-180" /> Previous
                  </button>
                  <button onClick={() => handleTab("phase-1")} className="flex items-center gap-2 text-xs font-bold text-white hover:text-cyan-400 transition-colors">
                    Next: Phase 1 Research <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ─────────── PHASE 1 ─────────── */}
            {activeTab === "phase-1" && (
              <div className="space-y-10">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-green-400 font-mono tracking-widest uppercase">
                    <Clock className="w-3.5 h-3.5" /> Phase 1 — Complete
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">XT-Proof — 7.2M Params</h1>
                  <p className="text-lg text-gray-400 leading-relaxed max-w-2xl">
                    Our first real experiment with the Introlic stack. Proof that the protocol compiles, runs, and generates coherent output.
                  </p>
                </div>

                <hr className="border-white/5" />

                <div className="p-6 rounded-2xl bg-green-950/10 border border-green-500/20 space-y-3">
                  <div className="flex items-center gap-2 text-green-400 font-bold text-sm">
                    <Zap className="w-4 h-4" /> Status: Test Complete
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    The XT-Proof run confirmed that our discrete diffusion pipeline compiles end-to-end, produces legible outputs, and surfaces the first real engineering challenges in training a SEDD model. It was not about making a good model — it was about proving the stack is real.
                  </p>
                </div>

                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-white">What We Learned</h2>
                  <div className="space-y-3">
                    {[
                      "The SEDD training loop is substantially different from standard Transformer training — loss behavior is non-trivial to interpret.",
                      "Denoising schedule design has a large effect on output quality at small parameter counts.",
                      "At 7.2M params, emergent reasoning does not appear — but coherence does, which validates the pipeline.",
                      "Memory footprint at this scale is manageable on a single consumer GPU, validating our efficiency thesis.",
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5 text-sm text-gray-400">
                        <span className="text-cyan-400 font-mono font-bold shrink-0">{String(i + 1).padStart(2, '0')}</span>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-white/5">
                  <button onClick={() => handleTab("why-dlm")} className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-white transition-colors">
                    <ChevronRight className="w-4 h-4 rotate-180" /> Previous
                  </button>
                  <button onClick={() => handleTab("phase-2")} className="flex items-center gap-2 text-xs font-bold text-white hover:text-cyan-400 transition-colors">
                    Next: Phase 2 — 220M <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ─────────── PHASE 2 ─────────── */}
            {activeTab === "phase-2" && (
              <div className="space-y-10">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 font-mono tracking-widest uppercase">
                    <Clock className="w-3.5 h-3.5" /> Phase 2 — Active Target
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">XT-Micro — 220M Params</h1>
                  <p className="text-lg text-gray-400 leading-relaxed max-w-2xl">
                    The critical milestone. At 220M parameters, SEDD models begin to surface meaningful emergent behaviors — the real test of whether discrete diffusion can self-correct at scale.
                  </p>
                </div>

                <hr className="border-white/5" />

                <div className="p-6 rounded-2xl bg-cyan-950/10 border border-cyan-500/20 space-y-3">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                    <AlertCircle className="w-4 h-4" /> Blocked By: Compute Budget
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Training a 220M SEDD model requires cloud GPU access (H100 or A100 instances). This is the exact gap the <strong className="text-white">Kothari Fellowship ($5,000–$7,000)</strong> would close. We have the architecture, the pipeline from Phase 1, and the plan. We need the compute hours.
                  </p>
                </div>

                <div className="space-y-5">
                  <h2 className="text-lg font-bold text-white">Why 220M, Not Smaller?</h2>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Below 150M parameters, SEDD models do not produce meaningful emergent behaviors — the denoising dynamics are too shallow to surface real reasoning patterns. At 220M, we reach the lowest threshold where:
                  </p>
                  <div className="space-y-2">
                    {[
                      "Denoising stability patterns become visible across the full sequence",
                      "Bidirectional context advantages begin to manifest in output quality",
                      "Self-correction behavior under iterative refinement can be measured",
                      "Memory pressure and inference dynamics match real-world deployment conditions",
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5 text-sm text-gray-400">
                        <span className="text-cyan-400 font-mono font-bold shrink-0 text-xs">{String(i + 1).padStart(2, '0')}</span>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-white">Compute Budget Breakdown</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 text-gray-500 font-mono uppercase tracking-widest">
                          <th className="py-3 pr-6 font-semibold">Item</th>
                          <th className="py-3 pr-6 font-semibold">Allocation</th>
                          <th className="py-3 font-semibold">Purpose</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {[
                          ["GPU Compute (H100/A100)", "~70%", "Training runs & ablation experiments"],
                          ["Dataset Storage & I/O", "~20%", "Benchmark datasets, checkpoint storage"],
                          ["Open-Source Tooling", "~10%", "Documentation, reproducibility scripts"],
                        ].map(([item, alloc, purpose]) => (
                          <tr key={item}>
                            <td className="py-3 pr-6 font-bold text-white">{item}</td>
                            <td className="py-3 pr-6 text-cyan-400 font-mono font-bold">{alloc}</td>
                            <td className="py-3 text-gray-400">{purpose}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-white/5">
                  <button onClick={() => handleTab("phase-1")} className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-white transition-colors">
                    <ChevronRight className="w-4 h-4 rotate-180" /> Previous
                  </button>
                  <button onClick={() => handleTab("phase-3")} className="flex items-center gap-2 text-xs font-bold text-white hover:text-cyan-400 transition-colors">
                    Next: Phase 3 <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ─────────── PHASE 3 ─────────── */}
            {activeTab === "phase-3" && (
              <div className="space-y-10">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-500 font-mono tracking-widest uppercase">
                    <Map className="w-3.5 h-3.5" /> Phase 3 — Future
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Scale, Open, and Prove.</h1>
                  <p className="text-lg text-gray-400 leading-relaxed max-w-2xl">
                    After validating the 220M SEDD prototype, we open-source everything and scale the architecture toward the ARC One flagship.
                  </p>
                </div>

                <hr className="border-white/5" />

                <div className="space-y-4">
                  {[
                    {
                      title: "Open-Source Research Benchmarks",
                      desc: "Every training run, failure log, ablation study, and benchmark result from XT-Micro will be published openly. Real research means showing what broke, not just what worked.",
                      status: "Planned after Phase 2",
                      color: "cyan"
                    },
                    {
                      title: "XT-Class Model Scaling (500M → 7B)",
                      desc: "Scale the validated SEDD architecture progressively: XT-Mini (500M), XT-Base (1B), XT-Plus (3B), XT-Pro (7B). Each stage funds the next through research partnerships and grants.",
                      status: "Planned after open-source",
                      color: "blue"
                    },
                    {
                      title: "ARC One — 390B DLM Flagship",
                      desc: "The long-term destination. A 390B parameter Discrete Diffusion Language Model — sovereign, non-autoregressive, and built entirely from India. This is the goal everything else leads to.",
                      status: "Long-term horizon",
                      color: "white"
                    },
                  ].map(p => (
                    <div key={p.title} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-white">{p.title}</h3>
                        <span className="text-[10px] font-mono font-bold text-gray-600 uppercase tracking-wider">{p.status}</span>
                      </div>
                      <p className="text-sm text-gray-400 leading-relaxed">{p.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between pt-4 border-t border-white/5">
                  <button onClick={() => handleTab("phase-2")} className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-white transition-colors">
                    <ChevronRight className="w-4 h-4 rotate-180" /> Previous
                  </button>
                  <button onClick={() => handleTab("sedd")} className="flex items-center gap-2 text-xs font-bold text-white hover:text-cyan-400 transition-colors">
                    Next: SEDD Architecture <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ─────────── SEDD ─────────── */}
            {activeTab === "sedd" && (
              <div className="space-y-10">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 font-mono tracking-widest uppercase">
                    <Layers className="w-3.5 h-3.5" /> Architecture
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">SEDD — Score Entropy Discrete Diffusion</h1>
                  <p className="text-lg text-gray-400 leading-relaxed max-w-2xl">
                    The mathematical foundation behind our DLM research.
                  </p>
                </div>

                <hr className="border-white/5" />

                <div className="space-y-5 text-sm text-gray-400 leading-relaxed">
                  <p>
                    <strong className="text-white">SEDD (Score Entropy Discrete Diffusion)</strong> was introduced by Lou et al. (Stanford, 2023) and further developed by Inception Labs. It is the most promising discrete diffusion formulation for language modeling. Here's how it works, explained plainly:
                  </p>

                  <div className="space-y-3">
                    {[
                      { step: "01", title: "Start With Noise", desc: "Begin with a fully masked or corrupted version of the target sequence — every token is unknown." },
                      { step: "02", title: "Learn a Score Function", desc: "Train a neural network to predict the \"score\" — the gradient of the log-probability with respect to the noised sequence. This tells the model which direction to denoise." },
                      { step: "03", title: "Iterative Denoising", desc: "Apply the score function repeatedly, refining all tokens simultaneously over many steps. Each pass, the sequence gets clearer and more coherent." },
                      { step: "04", title: "Self-Correction Emerges", desc: "Because all tokens are revised at every step, mistakes made early can be corrected in later steps — unlike autoregressive models where mistakes compound." },
                    ].map(s => (
                      <div key={s.step} className="flex gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                        <span className="text-2xl font-black text-cyan-400/30 font-mono shrink-0">{s.step}</span>
                        <div>
                          <div className="text-sm font-bold text-white mb-1">{s.title}</div>
                          <div className="text-xs text-gray-400 leading-relaxed">{s.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                    <h3 className="text-sm font-bold text-white">Key Reference Papers</h3>
                    <div className="space-y-1 text-xs font-mono">
                      <div className="text-gray-400">→ Lou et al. (2023) — "Score-Based Generative Modeling through SDEs"</div>
                      <div className="text-gray-400">→ Inception Labs — "Mercury: Discrete Diffusion Language Model"</div>
                      <div className="text-gray-400">→ Austin et al. (2021) — "Structured Denoising Diffusion Models in Discrete State-Spaces"</div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-white/5">
                  <button onClick={() => handleTab("phase-3")} className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-white transition-colors">
                    <ChevronRight className="w-4 h-4 rotate-180" /> Previous
                  </button>
                  <button onClick={() => handleTab("dlm-vs-transformer")} className="flex items-center gap-2 text-xs font-bold text-white hover:text-cyan-400 transition-colors">
                    Next: DLM vs Transformer <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ─────────── DLM VS TRANSFORMER ─────────── */}
            {activeTab === "dlm-vs-transformer" && (
              <div className="space-y-10">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 font-mono tracking-widest uppercase">
                    <Layers className="w-3.5 h-3.5" /> Comparison
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">DLM vs Transformer</h1>
                </div>

                <hr className="border-white/5" />

                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="py-3 pr-6 text-gray-500 font-mono text-xs uppercase tracking-widest font-semibold">Property</th>
                        <th className="py-3 pr-6 text-gray-500 font-mono text-xs uppercase tracking-widest font-semibold">Autoregressive Transformer</th>
                        <th className="py-3 text-cyan-400 font-mono text-xs uppercase tracking-widest font-semibold">Discrete Diffusion (DLM)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {[
                        ["Generation Direction", "Left-to-right only", "Bidirectional — all tokens at once"],
                        ["Error Correction", "Cannot fix mistakes mid-generation", "Iterative self-correction at every step"],
                        ["Context Scaling", "O(N²) quadratic cost", "More efficient attention patterns possible"],
                        ["Inference Speed", "Sequential — one token at a time", "Parallel denoising — all tokens together"],
                        ["Maturity", "Highly mature, well-optimized", "Early stage — huge research opportunity"],
                        ["India Research Activity", "Widely replicated", "Almost zero — completely open frontier"],
                      ].map(([prop, transformer, dlm]) => (
                        <tr key={prop}>
                          <td className="py-3 pr-6 font-bold text-white text-xs">{prop}</td>
                          <td className="py-3 pr-6 text-gray-500 text-xs">{transformer}</td>
                          <td className="py-3 text-cyan-400 text-xs font-semibold">{dlm}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between pt-4 border-t border-white/5">
                  <button onClick={() => handleTab("sedd")} className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-white transition-colors">
                    <ChevronRight className="w-4 h-4 rotate-180" /> Previous
                  </button>
                  <button onClick={() => handleTab("context-window")} className="flex items-center gap-2 text-xs font-bold text-white hover:text-cyan-400 transition-colors">
                    Next: Context Window Problem <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ─────────── CONTEXT WINDOW ─────────── */}
            {activeTab === "context-window" && (
              <div className="space-y-10">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 font-mono tracking-widest uppercase">
                    <Cpu className="w-3.5 h-3.5" /> Known Problem
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">The Context Window Problem</h1>
                  <p className="text-lg text-gray-400 leading-relaxed max-w-2xl">
                    One of the core reasons we are betting on DLMs — and one of the hardest problems we intend to work on.
                  </p>
                </div>

                <hr className="border-white/5" />

                <div className="space-y-5 text-sm text-gray-400 leading-relaxed">
                  <p>
                    Standard Transformers use self-attention, which computes pairwise relationships between every token. This means: if your context has N tokens, attention costs O(N²). Double the context, quadruple the compute. This is why even the most powerful models struggle with truly long documents, conversations, or code files.
                  </p>
                  <p>
                    Discrete Diffusion models process the entire sequence differently — not through pairwise attention in the same quadratic form, but through iterative global denoising. This opens the door to significantly more efficient long-context handling, though <strong className="text-white">we are honest: this is an active open research problem, not a solved one</strong>. Exactly the kind of problem we intend to investigate.
                  </p>

                  <div className="p-6 rounded-2xl bg-cyan-950/10 border border-cyan-500/20 space-y-3">
                    <div className="text-sm font-bold text-cyan-400">Our Research Position</div>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      We do not claim to have solved context window scaling. What we claim is that DLMs represent the most promising architectural direction for attacking this problem — and that nobody in India is seriously working on it. Our 220M SEDD prototype will surface the real engineering challenges around long-context SEDD training, and we will publish everything we find.
                    </p>
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-white/5">
                  <button onClick={() => handleTab("dlm-vs-transformer")} className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-white transition-colors">
                    <ChevronRight className="w-4 h-4 rotate-180" /> Previous
                  </button>
                  <button onClick={() => handleTab("founder")} className="flex items-center gap-2 text-xs font-bold text-white hover:text-cyan-400 transition-colors">
                    Next: About the Founder <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ─────────── FOUNDER ─────────── */}
            {activeTab === "founder" && (
              <div className="space-y-10">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 font-mono tracking-widest uppercase">
                    <Users className="w-3.5 h-3.5" /> The Lab
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">About the Founder</h1>
                </div>

                <hr className="border-white/5" />

                <div className="space-y-5 text-sm text-gray-400 leading-relaxed">
                  <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-cyan-950/50 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-black text-lg">F</div>
                      <div>
                        <div className="text-base font-bold text-white">Faiz (mr.Faiz)</div>
                        <div className="text-xs text-gray-500 font-mono">Founder, Introlic — Age 17 — India</div>
                      </div>
                    </div>
                    <p className="leading-relaxed">
                      I started coding in 2018 at age 9 on a 5-inch Android phone — no computer, no mentor, just YouTube tutorials and Spck Editor. By 2022 I was freelancing building Minecraft server plugins in Java. By 2024, I had scaled a gaming platform to 13,000 users. By 2025, I built an AI food scanner and pitched it to investors. They rejected me because of my age. I asked them what my mistakes were so I could learn.
                    </p>
                    <p className="leading-relaxed">
                      In 2026, I founded Introlic. Not because I have money or a team or credentials. Because I followed the math, saw what the world is missing, and decided to build it anyway.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { val: "17", label: "Years Old" },
                      { val: "2018", label: "Started Coding" },
                      { val: "13K+", label: "Peak Users Built" },
                      { val: "0", label: "VC Backing" },
                    ].map(s => (
                      <div key={s.label} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                        <div className="text-xl font-black text-white">{s.val}</div>
                        <div className="text-[10px] font-mono text-gray-600 uppercase tracking-wider mt-1">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-white/5">
                  <button onClick={() => handleTab("context-window")} className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-white transition-colors">
                    <ChevronRight className="w-4 h-4 rotate-180" /> Previous
                  </button>
                  <button onClick={() => handleTab("in1")} className="flex items-center gap-2 text-xs font-bold text-white hover:text-cyan-400 transition-colors">
                    Next: The 'in1' Movement <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ─────────── IN1 ─────────── */}
            {activeTab === "in1" && (
              <div className="space-y-10">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 font-mono tracking-widest uppercase">
                    <Globe className="w-3.5 h-3.5" /> Developer Movement
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">The 'in1' Movement</h1>
                  <p className="text-lg text-gray-400 leading-relaxed max-w-2xl">
                    Once our 220M SEDD prototype is validated, we launch a public developer movement to build sovereign Indian AI.
                  </p>
                </div>

                <hr className="border-white/5" />

                <div className="space-y-5 text-sm text-gray-400 leading-relaxed">
                  <p>
                    <strong className="text-white">'in1'</strong> is the developer alliance we will launch after validating our SEDD prototype. The name means two things: <em className="text-gray-300">India + One</em> — one unified movement of Indian engineers building sovereign, non-autoregressive AI together.
                  </p>
                  <p>
                    The goal is simple: open-source everything from our research, create learning resources around DLMs and SEDD, and rally Indian engineers around a frontier that is wide open and completely uncrowded.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { title: "Open Research", desc: "All benchmarks, training logs, and failure analyses published publicly." },
                      { title: "Developer Rallying", desc: "Social media movement to attract Indian engineers to the DLM frontier." },
                      { title: "Sovereign AI", desc: "Build the infrastructure India needs — not dependent on foreign closed APIs." },
                    ].map(c => (
                      <div key={c.title} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                        <div className="text-sm font-bold text-white">{c.title}</div>
                        <p className="text-xs text-gray-400 leading-relaxed">{c.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                    <div className="text-xs font-mono font-bold text-gray-500 uppercase tracking-widest">Status</div>
                    <p className="text-sm text-gray-400">Planned after Phase 2 (220M SEDD prototype validation). Not launched yet — we move when the science is ready, not the other way around.</p>
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-white/5">
                  <button onClick={() => handleTab("founder")} className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-white transition-colors">
                    <ChevronRight className="w-4 h-4 rotate-180" /> Previous
                  </button>
                  <button onClick={() => handleTab("fellowship")} className="flex items-center gap-2 text-xs font-bold text-white hover:text-cyan-400 transition-colors">
                    Next: Kothari Fellowship <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ─────────── FELLOWSHIP ─────────── */}
            {activeTab === "fellowship" && (
              <div className="space-y-10">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 font-mono tracking-widest uppercase">
                    <Target className="w-3.5 h-3.5" /> Funding
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Kothari Fellowship</h1>
                  <p className="text-lg text-gray-400 leading-relaxed max-w-2xl">
                    We are applying for the Kothari Fellowship to fund GPU compute for our 220M SEDD prototype.
                  </p>
                </div>

                <hr className="border-white/5" />

                <div className="space-y-6">
                  <div className="p-6 rounded-2xl bg-cyan-950/10 border border-cyan-500/20 space-y-4">
                    <h2 className="text-base font-bold text-white">The Ask: $5,000 — $7,000 (or whatever you can provide)</h2>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      The entire grant goes toward cloud GPU compute (H100/A100 instances) to train and validate our 220M SEDD prototype. We have the architecture. We have the pipeline proven at 7.2M. We have the plan. We need the compute hours to prove what we believe is true.
                    </p>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      I'm 17, self-funded, working from India. This is not a startup looking for a salary. This is a researcher looking for the tool to do the work.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h2 className="text-base font-bold text-white">What We Commit to In Return</h2>
                    {[
                      "Full public open-sourcing of all training benchmarks, loss curves, and ablation results",
                      "Honest failure analysis published — what broke and why",
                      "A complete reproducibility guide so others can replicate our SEDD training pipeline",
                      "If rejected: we will ask what our mistakes are and learn from them",
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5 text-sm text-gray-400">
                        <span className="text-cyan-400 shrink-0">→</span>
                        {item}
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <a href="/ppt" className="flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold text-white border border-cyan-500/30 bg-cyan-950/20 hover:bg-cyan-950/40 transition-all">
                      <ExternalLink className="w-3.5 h-3.5" /> View Full Pitch Deck
                    </a>
                    <a href="https://introlic.in" className="flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold text-gray-400 border border-white/10 hover:text-white hover:border-white/20 transition-all">
                      <Globe className="w-3.5 h-3.5" /> introlic.in
                    </a>
                  </div>
                </div>

                <div className="flex justify-start pt-4 border-t border-white/5">
                  <button onClick={() => handleTab("in1")} className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-white transition-colors">
                    <ChevronRight className="w-4 h-4 rotate-180" /> Previous: in1 Movement
                  </button>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
