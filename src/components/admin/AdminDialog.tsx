"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle2, Info, AlertCircle, X } from "lucide-react";

interface AdminDialogProps {
  isOpen: boolean;
  onClose: () => void;
  type: "alert" | "confirm";
  title: string;
  message: string;
  onConfirm?: () => void;
  severity?: "info" | "success" | "error" | "warning";
}

export default function AdminDialog({
  isOpen,
  onClose,
  type,
  title,
  message,
  onConfirm,
  severity = "info",
}: AdminDialogProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const icons = {
    info: <Info className="w-5 h-5 text-[#00a3ff]" />,
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
  };

  const glowColors = {
    info: "shadow-[0_0_50px_rgba(0,163,255,0.12)] border-[#00a3ff]/20",
    success: "shadow-[0_0_50px_rgba(16,185,129,0.12)] border-emerald-500/20",
    error: "shadow-[0_0_50px_rgba(239,68,68,0.12)] border-red-500/20",
    warning: "shadow-[0_0_50px_rgba(245,158,11,0.12)] border-amber-500/20",
  };

  const handleConfirmClick = () => {
    if (onConfirm) onConfirm();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: "spring", duration: 0.4, ease: [0.16, 1, 0.3, 1] as any }}
            className={`relative bg-[#050505] border p-6 rounded-2xl max-w-sm w-full overflow-hidden text-left z-[310] ${glowColors[severity]}`}
          >
            {/* Top Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-white/[0.02] border border-white/5 shrink-0">
                {icons[severity]}
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                {title}
              </h3>
            </div>

            {/* Message */}
            <p className="text-gray-400 text-xs leading-relaxed font-sans mb-6">
              {message}
            </p>

            {/* Buttons */}
            {type === "confirm" ? (
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl border border-white/5 hover:border-white/10 hover:bg-white/5 text-gray-400 hover:text-white text-xs font-bold transition-all text-center uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmClick}
                  className="flex-1 py-2.5 rounded-xl bg-white text-black hover:bg-white/90 active:scale-98 text-xs font-bold transition-all text-center uppercase tracking-wider shadow-lg"
                >
                  Confirm
                </button>
              </div>
            ) : (
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-white text-black hover:bg-white/90 active:scale-98 text-xs font-bold transition-all text-center uppercase tracking-wider shadow-lg"
              >
                Acknowledge
              </button>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
