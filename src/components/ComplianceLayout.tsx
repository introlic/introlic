"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ArrowLeft, Clock, Terminal, FileText, Shield, Cookie, Flag } from 'lucide-react';

const iconMap = {
  terms: FileText,
  privacy: Shield,
  cookies: Cookie,
  ethics: Flag,
};

interface Section {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface ComplianceLayoutProps {
  title: string;
  subtitle: string;
  lastUpdated: string;
  iconName: 'terms' | 'privacy' | 'cookies' | 'ethics';
  sections: Section[];
}

export default function ComplianceLayout({
  title,
  subtitle,
  lastUpdated,
  iconName,
  sections,
}: ComplianceLayoutProps) {
  const Icon = iconMap[iconName] || FileText;
  const [activeSection, setActiveSection] = useState(sections[0]?.id || '');
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const currentRefs = sectionRefs.current;
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: '-20% 0px -60% 0px', // Trigger when section occupies center part of view
    });

    sections.forEach((section) => {
      const el = currentRefs[section.id];
      if (el) observer.observe(el);
    });

    return () => {
      sections.forEach((section) => {
        const el = currentRefs[section.id];
        if (el) observer.unobserve(el);
      });
    };
  }, [sections]);

  const scrollToSection = (id: string) => {
    const el = sectionRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Offset scroll for header height if needed (here we rely on scroll-margin-top in CSS)
      setActiveSection(id);
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-300 font-sans relative overflow-hidden selection:bg-[#00a3ff]/20 selection:text-white pb-24">
      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-[#00a3ff] z-[120] origin-left"
        style={{ scaleX }}
      />

      {/* Cyber Mesh Background Layer */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none z-0"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />

      {/* Futuristic Grid/Orb light glows */}
      <div className="absolute top-[-10%] left-[5%] w-[40vw] h-[40vw] rounded-full bg-[#00a3ff]/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-[#00a3ff]/3 blur-[100px] pointer-events-none z-0" />

      {/* Outer wrapper */}
      <div className="max-w-[1300px] mx-auto px-6 md:px-12 pt-32 md:pt-40 relative z-10">
        
        {/* Back Link */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-gray-500 hover:text-white uppercase transition-colors mb-8 group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Uplink Home
        </Link>

        {/* Hero Section */}
        <div className="border-b border-white/5 pb-12 mb-16">
          <div className="flex items-center gap-3.5 mb-4 text-[#00a3ff]">
            <div className="p-2.5 rounded-xl bg-[#00a3ff]/8 border border-[#00a3ff]/15 flex items-center justify-center">
              <Icon className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 opacity-60" />
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-gray-500">COMPLIANCE_PROTOCOL_V1</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tightest uppercase mb-4">
            {title}
          </h1>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <p className="text-gray-400 font-medium text-sm md:text-base max-w-[700px] leading-relaxed">
              {subtitle}
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-gray-500 shrink-0 border border-white/5 bg-white/[0.01] px-4 py-2 rounded-xl">
              <Clock className="w-3.5 h-3.5" />
              <span>LAST_UPDATE: {lastUpdated}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Multi-Column Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Sticky Left Navigation Sidebar */}
          <aside className="lg:col-span-4 sticky top-28 hidden lg:block z-20">
            <div className="border border-white/5 bg-black/40 backdrop-blur-md rounded-2xl p-6 space-y-6">
              <div className="flex items-center gap-2 pb-3 border-b border-white/5">
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-gray-500">Document Index</span>
              </div>
              <ul className="space-y-2">
                {sections.map((section) => {
                  const isActive = activeSection === section.id;
                  return (
                    <li key={section.id}>
                      <button
                        onClick={() => scrollToSection(section.id)}
                        className={`w-full text-left py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center gap-3 group cursor-pointer ${
                          isActive 
                            ? 'text-[#00a3ff] bg-[#00a3ff]/8 border-l-2 border-[#00a3ff] pl-3' 
                            : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.02]'
                        }`}
                      >
                        <span className="font-mono opacity-50 text-[10px]">
                          {sections.indexOf(section) + 1 < 10 ? `0${sections.indexOf(section) + 1}` : sections.indexOf(section) + 1}
                        </span>
                        <span className="truncate">{section.title}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>

          {/* Main Content Reader (Right) */}
          <main className="lg:col-span-8 space-y-16">
            {sections.map((section, index) => (
              <div
                key={section.id}
                id={section.id}
                ref={(el) => {
                  sectionRefs.current[section.id] = el;
                }}
                className="scroll-mt-32 border border-white/5 bg-[#030303]/60 backdrop-blur-2xl rounded-3xl p-8 md:p-10 transition-all hover:border-[#00a3ff]/10 group text-left"
              >
                {/* Monospace Section Number */}
                <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4">
                  <span className="text-[10px] font-mono font-black tracking-widest text-[#00a3ff] uppercase">
                    SECTION_0{index + 1}{" // ID_"}{section.id.toUpperCase()}
                  </span>
                </div>
                
                <h2 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase mb-6 group-hover:text-[#00a3ff] transition-colors">
                  {section.title}
                </h2>
                
                <div className="prose prose-invert max-w-none text-gray-400 text-sm md:text-base leading-[1.8] font-sans space-y-4">
                  {section.content}
                </div>
              </div>
            ))}
          </main>

        </div>
      </div>
    </div>
  );
}
