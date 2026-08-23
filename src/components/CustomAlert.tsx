"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

interface CustomAlertProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  type?: 'info' | 'success' | 'error';
}

export default function CustomAlert({
  isOpen,
  onClose,
  title = "System Notification",
  message,
  type = "info"
}: CustomAlertProps) {
  
  // Lock body scroll when modal is open
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

  const icons = {
    info: <Info className="w-5 h-5 text-[#00a3ff]" />,
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
  };

  const glowColors = {
    info: 'shadow-[0_0_30px_rgba(0,163,255,0.15)] border-[#00a3ff]/20',
    success: 'shadow-[0_0_30px_rgba(16,185,129,0.15)] border-emerald-500/20',
    error: 'shadow-[0_0_30px_rgba(239,68,68,0.15)] border-red-500/20',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md cursor-pointer"
          />

          {/* Alert Content Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.5, ease: [0.16, 1, 0.3, 1] as any }}
            className={`relative bg-[#070709] border p-6 rounded-2xl max-w-sm w-full overflow-hidden text-left z-50 ${glowColors[type]}`}
          >
            {/* Top Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-md text-gray-500 hover:text-white hover:bg-white/5 transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Icon + Title */}
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
                {icons[type]}
              </div>
              <h3 className="text-base font-black text-white uppercase tracking-wider">
                {title}
              </h3>
            </div>

            {/* Message Body */}
            <p className="text-gray-400 text-xs md:text-sm leading-relaxed font-medium mb-6">
              {message}
            </p>

            {/* Action Confirm Button */}
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-white text-black font-black text-xs hover:bg-white/90 active:scale-95 transition-all text-center tracking-widest uppercase"
            >
              Acknowledge
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
