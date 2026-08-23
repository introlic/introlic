"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, CheckCircle2, X, Globe, Cpu, Database, ShieldCheck, Zap, Server } from 'lucide-react';

interface SystemStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const services = [
  {
    name: "Web Platform & Global Edge CDN",
    status: "Operational",
    uptime: "100.0%",
    latency: "12ms",
    icon: Globe,
  },
  {
    name: "REST & Streaming API Gateway",
    status: "Operational",
    uptime: "99.99%",
    latency: "24ms",
    icon: Zap,
  },
  {
    name: "Core Inference Router",
    status: "Operational",
    uptime: "99.95%",
    latency: "38ms",
    icon: Cpu,
  },
  {
    name: "Telemetry & Analytics Cluster",
    status: "Operational",
    uptime: "100.0%",
    latency: "15ms",
    icon: Activity,
  },
  {
    name: "Database & Persistence Layer",
    status: "Operational",
    uptime: "99.99%",
    latency: "8ms",
    icon: Database,
  },
  {
    name: "Authentication & Security Protocols",
    status: "Operational",
    uptime: "100.0%",
    latency: "10ms",
    icon: ShieldCheck,
  },
];

export default function SystemStatusModal({ isOpen, onClose }: SystemStatusModalProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 selection:bg-[#00a3ff]/30">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-[#070709] border border-white/[0.1] p-6 sm:p-8 rounded-3xl max-w-2xl w-full overflow-hidden text-left z-50 shadow-[0_25px_60px_rgba(0,0,0,0.8)]"
          >
            {/* Ambient top glowing line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-80" />

            {/* Header Strip */}
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-mono font-bold tracking-[0.25em] uppercase text-emerald-400 flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-emerald-400" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                    </span>
                    Live Telemetry // Global
                  </span>
                </div>
                <h3 className="text-2xl font-black text-white tracking-tight">
                  All Systems Operational
                </h3>
              </div>

              {/* Close Icon Button */}
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.06] transition-all border border-transparent hover:border-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Metrics Quick Strip */}
            <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] mb-6">
              <div>
                <div className="text-[9px] font-mono uppercase tracking-wider text-gray-500">Global Uptime</div>
                <div className="text-sm sm:text-base font-black text-emerald-400 font-mono">99.98%</div>
              </div>
              <div>
                <div className="text-[9px] font-mono uppercase tracking-wider text-gray-500">Avg Latency</div>
                <div className="text-sm sm:text-base font-black text-[#00a3ff] font-mono">18ms</div>
              </div>
              <div>
                <div className="text-[9px] font-mono uppercase tracking-wider text-gray-500">Incident Rate</div>
                <div className="text-sm sm:text-base font-black text-gray-300 font-mono">0.00%</div>
              </div>
            </div>

            {/* Services Status List */}
            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {services.map((srv) => {
                const IconComponent = srv.icon;
                return (
                  <div
                    key={srv.name}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-gray-300">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-semibold text-white">
                          {srv.name}
                        </div>
                        <div className="text-[10px] font-mono text-gray-500">
                          Latency: {srv.latency}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold text-emerald-400 hidden sm:inline">
                        {srv.status}
                      </span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="mt-6 pt-5 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                Updated live · Region: Global Edge
              </span>
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-white text-black font-black text-xs hover:bg-white/90 active:scale-95 transition-all uppercase tracking-wider"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
