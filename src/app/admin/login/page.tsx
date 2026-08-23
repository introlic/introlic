"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  Loader2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  ShieldAlert
} from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  // Caps Lock detection
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.getModifierState("CapsLock")) {
      setCapsLockActive(true);
    } else {
      setCapsLockActive(false);
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (!e.getModifierState("CapsLock")) {
      setCapsLockActive(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password) return;

    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Invalid credentials");
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center p-6 font-sans selection:bg-white selection:text-black">
      
      {/* Top Left Back Button */}
      <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-20">
        <Link 
          href="/" 
          className="group inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Introlic</span>
        </Link>
      </div>

      {/* Centered Auth Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative w-full max-w-[420px] bg-[#050505] rounded-[24px] border border-white/5 shadow-2xl p-8 sm:p-10 z-10"
      >
        {/* Header matching Sign In modal design */}
        <div className="mb-6">
          <h3 className="text-2xl font-medium text-white tracking-tight leading-none flex items-center gap-3">
            <img 
              src="/icon.png" 
              alt="Introlic Logo" 
              className="w-10 h-10 object-contain filter brightness-0 invert opacity-95 shrink-0" 
            />
            <span>Admin Portal</span>
          </h3>
          <p className="text-gray-500 text-[13px] mt-2.5">
            Enter your credentials to access the control panel.
          </p>
        </div>

        {/* Error Alert */}
        <AnimatePresence mode="wait">
          {errorMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -6, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -6, height: 0 }}
              className="mb-5 p-3.5 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-2.5 text-red-400 text-[13px] leading-relaxed"
            >
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Caps Lock Alert */}
        <AnimatePresence>
          {capsLockActive && (
            <motion.div
              initial={{ opacity: 0, y: -4, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -4, height: 0 }}
              className="mb-4 px-3.5 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center gap-2 text-amber-300 text-xs font-mono"
            >
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              <span>Caps Lock is ON</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form 
          onSubmit={handleLoginSubmit} 
          className="space-y-4"
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
        >
          {/* Username / Email */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-gray-400">
              Email or Username
            </label>
            <input
              type="text"
              required
              autoFocus
              disabled={isLoading}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Enter username or email"
              className="w-full h-[46px] bg-[#111111] border border-white/5 rounded-lg px-4 text-white text-[14px] focus:outline-none focus:border-white/20 focus:bg-[#161616] transition-colors placeholder:text-gray-600 disabled:opacity-50"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-gray-400">
              Password
            </label>
            <div className="relative h-[46px]">
              <input
                type={showPassword ? "text" : "password"}
                required
                disabled={isLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full h-full bg-[#111111] border border-white/5 rounded-lg px-4 pr-11 text-white text-[14px] focus:outline-none focus:border-white/20 focus:bg-[#161616] transition-colors placeholder:text-gray-600 disabled:opacity-50"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors cursor-pointer"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              disabled={isLoading || !identifier.trim() || !password}
              type="submit"
              className="w-full h-[46px] bg-white hover:bg-gray-200 text-black text-[14px] font-medium rounded-lg transition-colors flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Minimal Footer Info */}
        <div className="mt-6 pt-5 border-t border-white/5 text-center">
          <p className="text-[11px] text-gray-600 font-mono tracking-tight">
            Encrypted Session · Dual Rate Limited
          </p>
        </div>
      </motion.div>

      {/* Bottom Footer */}
      <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 text-center z-10 pointer-events-none">
        <p className="text-[11px] text-gray-700 font-mono">
          © {new Date().getFullYear()} Introlic. All rights reserved.
        </p>
      </div>
    </div>
  );
}
