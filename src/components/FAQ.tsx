"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, HelpCircle } from 'lucide-react';
import { XIcon, LinkedinIcon } from './SocialIcons';

const defaultFaqs = [
  {
    id: "01",
    question: "What is Introlic's architectural approach, and how does it differ from standard AI?",
    answer: "Standard AI architectures generate text one token at a time in a strict left-to-right sequence. We are researching and designing model architectures based on Score-based Entropy Discrete Diffusion (SEDD) — a generative paradigm that starts with noise and refines the entire output simultaneously, in parallel. Our goal is to explore parallel token generation to bypass the sequential bottlenecks of autoregressive models, aiming for higher throughput and reduced memory requirements."
  },
  {
    id: "02",
    question: "What are XT-Class models, and why start there instead of the 390B flagship?",
    answer: "The XT-Class (XT-Proof at 7.2M params, through XT-Pro at 7B) is the deliberate phase-one execution vector. Building the 390B ARC One flagship directly requires capital, compute infrastructure, and real-world telemetry that does not yet exist. Every XT-Class model deployed in production generates revenue, validates our architecture under real load, and provides the precise engineering data needed to route the 390B architecture correctly. Waiting for perfect conditions is not a strategy — it is surrender."
  },
  {
    id: "03",
    question: "Who is behind Introlic, and how is the project funded?",
    answer: "Introlic is an independent systems lab founded by MR.FAIZ. Currently, the project is completely funded by MR.FAIZ's personal funds. We are actively seeking the right long-term funding partners who align with our values and support building sovereign digital systems from first principles."
  },
  {
    id: "04",
    question: "Will the XT-Class models be open-source or proprietary?",
    answer: "We plan to open-source the weights of our core XT-Class models once they pass baseline safety and alignment checks. Our goal is to enable self-hosting and digital sovereignty for developers, while offering commercial APIs for high-volume enterprise needs."
  },
  {
    id: "05",
    question: "How can systems engineers and researchers join the team?",
    answer: "We look for builders who prefer clean code over meetings and academic credentials. If you have experience in CUDA, Triton, distributed training, or low-level systems programming, you can reach out directly via our contact page or @introlics."
  },
  {
    id: "06",
    question: "Are Introlic models available for enterprise evaluation today?",
    answer: "The XT-Class roadmap is in active development. XT-Proof (7.2M) currently serves as the validation baseline. Enterprise access, API partnerships, and early integration programmes will be announced as the XT-Micro (220M) milestone completes. If you represent an enterprise looking to evaluate early access, the direct contact vector is available through the command profile above."
  },
  {
    id: "07",
    question: "What is Introlic's long-term sovereign mission?",
    answer: "Introlic is a sovereign research and engineering lab. Our mission is to build a self-dependent ecosystem of foundational models, search engines, and communication platforms. By developing our own infrastructure stack from the mathematical ground up, we aim to reduce foreign software dependencies and establish digital sovereignty."
  }
];

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQProps {
  items?: FAQItem[];
  title?: React.ReactNode;
  subtitle?: string;
}

export default function FAQ({
  items,
  title = (
    <>
      Common<br />
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-750">Queries.</span>
    </>
  ),
  subtitle = "Architecture questions, strategic clarifications, and technical briefings. Answered without hedging."
}: FAQProps) {
  const displayFaqs = items || defaultFaqs;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className="relative bg-[#020202] overflow-hidden selection:bg-[#00a3ff]/30 border-t border-white/[0.05]">

      {/* Background Radial Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-radial from-[#00a3ff]/02 to-transparent blur-[120px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-8 md:px-12 py-40 relative z-10">

        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-4 mb-8">
              <HelpCircle className="w-4 h-4 text-[#00a3ff]" />
              <span className="text-[#00a3ff] font-bold tracking-[0.22em] uppercase text-xs font-mono">08 / Briefing Log</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-[0.9]">
              {title}
            </h2>
          </div>
          <div className="lg:col-span-7 flex items-end">
            <p className="text-gray-500 font-medium text-lg leading-relaxed border-l-0 sm:border-l border-white/[0.08] pl-0 sm:pl-8 max-w-2xl">
              {subtitle}
            </p>
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="flex flex-col border-t border-white/[0.06]">
          {displayFaqs.map((faq, i) => {
            const isOpen = openIndex === i;

            return (
              <div
                key={faq.id}
                className={`border-b transition-colors duration-300 ${isOpen ? 'border-[#00a3ff]/20' : 'border-white/[0.06]'
                  }`}
              >
                {/* Question Row */}
                <button
                  onClick={() => toggle(i)}
                  className="w-full text-left flex items-start gap-4 sm:gap-8 py-8 group"
                >
                  {/* ID */}
                  <span className={`text-[10px] font-black font-mono tracking-widest pt-1 shrink-0 transition-colors duration-305 ${isOpen ? 'text-[#00a3ff]' : 'text-gray-700 group-hover:text-gray-500'
                    }`}>
                    [{faq.id}]
                  </span>

                  {/* Question text */}
                  <span className={`flex-1 text-lg md:text-xl font-bold tracking-tight leading-snug transition-colors duration-300 ${isOpen ? 'text-white' : 'text-gray-400 group-hover:text-gray-205'
                    }`}>
                    {faq.question}
                  </span>

                  {/* Toggle Icon (Rotatable Plus) */}
                  <div className="shrink-0 w-8 h-8 flex items-center justify-center transition-transform duration-300">
                    <Plus
                      className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'text-[#00a3ff] rotate-45' : 'text-gray-550 group-hover:text-white'
                        }`}
                    />
                  </div>
                </button>

                {/* Answer Panel */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pl-8 sm:pl-16 pr-4 sm:pr-12 pb-6 sm:pb-10">
                        <div className="border-l border-[#00a3ff]/20 pl-4 sm:pl-8">
                          <p className="text-gray-400 font-medium leading-relaxed text-base max-w-3xl">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA strip */}
        <div className="mt-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 border-t border-white/[0.06] pt-16">
          <div>
            <div className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2 font-mono">Further Briefings</div>
            <p className="text-gray-400 font-medium text-base max-w-md">Have a question not answered here? Contact the command directly.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full sm:w-auto font-mono">
            <a
              href="https://x.com/introlics"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 border border-white/[0.08] bg-white/[0.02] hover:bg-[#00a3ff]/05 hover:border-[#00a3ff]/40 px-6 py-3 rounded-full text-sm font-bold text-gray-400 hover:text-[#00a3ff] transition-all duration-300 uppercase tracking-widest hover:scale-105 active:scale-95 w-full sm:w-auto"
            >
              <XIcon className="w-4 h-4" />
              @introlics
            </a>
            <a
              href="https://www.linkedin.com/company/introlic"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 border border-white/[0.08] bg-white/[0.02] hover:bg-[#00a3ff]/05 hover:border-[#00a3ff]/40 px-6 py-3 rounded-full text-sm font-bold text-gray-400 hover:text-[#00a3ff] transition-all duration-300 uppercase tracking-widest hover:scale-105 active:scale-95 w-full sm:w-auto"
            >
              <LinkedinIcon className="w-4 h-4" />
              LinkedIn
            </a>
          </div>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": displayFaqs.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": faq.answer
                }
              }))
            })
          }}
        />
      </div>
    </section>
  );
}
