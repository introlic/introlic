"use client";
// Cache bust 1

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, ShieldCheck, ArrowRight } from 'lucide-react';
import { COLORS } from '@/constants/branding';

export default function SovereignUplink() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const [isHandshaking, setIsHandshaking] = useState(false);
  const [handshakeStep, setHandshakeStep] = useState(0);
  const [handshakeVector, setHandshakeVector] = useState(0);

  const handshakeSteps = [
    "INITIALIZING_UPLINK",
    "ESTABLISHING_ENCRYPTION_LAYER",
    "VERIFYING_SOVEREIGN_ROOT",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setHandshakeVector(Math.floor(Math.random() * 1000));
    setIsHandshaking(true);
    setHandshakeStep(0);
    // Simulate handshake steps
    setTimeout(() => setHandshakeStep(1), 800);
    setTimeout(() => setHandshakeStep(2), 1600);
    setTimeout(() => {
      setIsHandshaking(false);
      setIsSubmitted(true);
    }, 2400);

    // Reset after success animation
    setTimeout(() => {
      setIsSubmitted(false);
      setHandshakeStep(0);
      setEmail('');
    }, 10000);
  };

  return (
    <section className="relative bg-[#020202] pt-32 pb-12 overflow-hidden border-t border-white/[0.05]">
      {/* Blueprint Grid Background - Extremely Faint */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: `radial-gradient(circle at 1px 1px, ${COLORS.brand.blue} 1px, transparent 0)`, backgroundSize: '40px 40px' }} />

      {/* Background radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] blur-[140px] rounded-full pointer-events-none"
        style={{ backgroundColor: COLORS.brand.blueDim }}
      />

      <div className="max-w-[1400px] mx-auto px-8 md:px-12 relative z-10">


        {/* ── UNTOUCHED HEADING ── */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl md:text-8xl lg:text-[10rem] font-black tracking-tightest text-white leading-[0.85]"
          >
            THE PATH TO<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-800">
              390B STARTS HERE.
            </span>
          </motion.h2>
        </div>

        {/* REFINED MISSION COPY */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-gray-500 font-bold text-lg md:text-2xl leading-relaxed tracking-tight underline-offset-8 decoration-white/5">
            Join the <span className="text-white">internal tier of producers</span>. Early access to the XT-Class backbone starts soon. Secure your <span style={{ color: COLORS.brand.blue }}>authentication vector</span> today.
          </p>
        </div>

        {/* ── AUTHENTICATION TERMINAL ── */}
        <div className="max-w-2xl mx-auto relative mb-12">

          <AnimatePresence mode="wait">
            {!isSubmitted && !isHandshaking ? (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.8 }}
                onSubmit={handleSubmit}
                className="relative"
              >
                {/* Modern Glass Pill Box */}
                <div
                  className="relative flex items-center p-1.5 sm:p-2 rounded-full backdrop-blur-md transition-all duration-500 overflow-hidden"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: `1px solid ${isFocused ? COLORS.brand.blue : 'rgba(255,255,255,0.1)'}`,
                    boxShadow: isFocused ? `0 0 40px ${COLORS.brand.blueDim}` : 'none'
                  }}
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Enter your email address..."
                    required
                    className="bg-transparent border-none focus:ring-0 text-sm md:text-base lg:text-lg text-white placeholder-gray-500 font-medium w-full py-3 sm:py-4 px-4 sm:px-8 selection:bg-[#00a3ff]/30 outline-none min-w-0"
                  />

                  {/* Icon button on mobile, text button on sm+ */}
                  <button
                    type="submit"
                    disabled={!email}
                    className={`relative shrink-0 rounded-full font-bold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2 group overflow-hidden ${email ? 'text-white cursor-pointer hover:scale-[1.02]' : 'text-gray-500 cursor-default opacity-50'}`}
                    style={{
                      backgroundColor: email ? COLORS.brand.blue : 'rgba(255, 255, 255, 0.05)',
                      boxShadow: email ? `0 0 20px ${COLORS.brand.blueDim}` : 'none',
                      padding: undefined
                    }}
                  >
                    {/* Icon only on mobile */}
                    <span className="flex sm:hidden w-10 h-10 items-center justify-center">
                      <ArrowRight className="w-4 h-4" />
                    </span>
                    {/* Text + icon on sm+ */}
                    <span className="hidden sm:flex items-center gap-2 px-6 py-3.5">
                      Request Access
                    </span>
                    {email && (
                      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    )}
                  </button>
                </div>

              </motion.form>
            ) : isHandshaking ? (
              <motion.div
                key="handshake"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="relative py-16 px-10 border backdrop-blur-sm"
                style={{ borderColor: `${COLORS.brand.blue}33`, backgroundColor: COLORS.brand.blueDim }}
              >
                <div className="flex flex-col items-center gap-8">
                  <div className="flex items-center gap-4">
                    <Terminal className="w-5 h-5 animate-pulse" style={{ color: COLORS.brand.blue }} />
                    <span className="text-[10px] font-black font-mono tracking-[0.4em] uppercase" style={{ color: COLORS.brand.blue }}>Uplink Encryption In Progress</span>
                  </div>

                  <div className="w-full max-w-sm space-y-4">
                    <div className="flex justify-between items-end">
                      <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest animate-pulse">
                        {handshakeSteps[handshakeStep]}
                      </span>
                      <span className="text-[9px] font-mono" style={{ color: COLORS.brand.blue }}>
                        {Math.round(((handshakeStep + 1) / handshakeSteps.length) * 100)}%
                      </span>
                    </div>
                    <div className="w-full h-1 bg-white/5 relative overflow-hidden">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: `${((handshakeStep + 1) / handshakeSteps.length) * 100}%` }}
                        className="absolute h-full"
                        style={{ backgroundColor: COLORS.brand.blue }}
                      />
                    </div>
                  </div>

                  <div className="text-[8px] font-mono text-gray-700 uppercase tracking-widest">
                    HANDSHAKE_VECTOR_{handshakeVector} {"// PARALLEL_STREAM_ACTIVE"}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative py-12 px-10 border backdrop-blur-md text-center group overflow-hidden"
                style={{ borderColor: `${COLORS.brand.blue}66`, backgroundColor: COLORS.brand.blueDim }}
              >
                {/* Success Scanning Corners */}
                <motion.div
                  animate={{ opacity: [0.1, 0.4, 0.1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 border"
                  style={{ borderColor: `${COLORS.brand.blue}33` }}
                />

                <div className="flex flex-col items-center gap-6 relative z-10">
                  <div className="p-4 rounded-full border shadow-[0_0_30px_rgba(0,163,255,0.2)]" style={{ backgroundColor: COLORS.brand.blueDim, borderColor: `${COLORS.brand.blue}4d` }}>
                    <ShieldCheck className="w-10 h-10" style={{ color: COLORS.brand.blue }} />
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-black tracking-[0.3em] uppercase text-sm" style={{ color: COLORS.brand.blue }}>Authentication Established</h4>
                    <p className="text-white/60 font-mono text-xs tracking-[0.2em] uppercase">
                      Vector Secured // Encryption Handshake Complete.
                    </p>
                    <div className="pt-4 flex justify-center items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                      <span className="text-[9px] font-mono text-emerald-500 tracking-[0.2em]">INTERNAL_TIER_READY // STANDBY FOR DISPATCH</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>



      </div>
    </section>
  );
}
