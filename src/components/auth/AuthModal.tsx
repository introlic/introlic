"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, ArrowRight, Eye, EyeOff, Check, ShieldAlert } from "lucide-react";
import { validatePasswordStrength } from "@/lib/security";

type AuthView = "login" | "register" | "forgot";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: AuthView;
}

// Custom Dropdown Component
interface DropdownOption {
  value: string;
  label: string;
}

const CustomDropdown = ({ 
  options, 
  value, 
  onChange, 
  placeholder,
  className = "",
  direction = "down"
}: { 
  options: DropdownOption[], 
  value: string, 
  onChange: (val: string) => void, 
  placeholder: string,
  className?: string,
  direction?: "up" | "down"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-[46px] bg-[#111111] border border-white/5 rounded-lg px-3.5 text-white cursor-pointer transition-colors hover:bg-[#161616] flex justify-between items-center"
      >
        <span className={value ? "text-white text-[13px] sm:text-[14px] truncate" : "text-gray-500 text-[13px] sm:text-[14px] truncate"}>
          {value ? options.find(o => o.value === value)?.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-500 shrink-0 ml-1 transition-transform duration-200 ${isOpen ? 'rotate-180 text-white' : ''}`} />
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: direction === "up" ? 4 : -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: direction === "up" ? 4 : -4 }}
            transition={{ duration: 0.12 }}
            className={`absolute left-0 w-full bg-[#141414] border border-[#262626] rounded-lg overflow-hidden z-[100] max-h-56 overflow-y-auto shadow-2xl custom-scrollbar ${
              direction === "up" ? "bottom-[calc(100%+6px)]" : "top-[calc(100%+6px)]"
            }`}
          >
            {options.map((o) => (
               <div 
                 key={o.value}
                 onClick={() => { onChange(o.value); setIsOpen(false); }} 
                 className={`px-3.5 py-2.5 cursor-pointer text-[13px] sm:text-[14px] transition-colors ${value === o.value ? 'bg-white text-black font-medium' : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'}`}
               >
                 {o.label}
               </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function AuthModal({ isOpen, onClose, initialView = "login" }: AuthModalProps) {
  const [view, setView] = useState<AuthView>(initialView);
  const [capacity, setCapacity] = useState<{ count: number; limit: number } | null>(null);
  const [showClosedModal, setShowClosedModal] = useState(false);

  // General Form States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Login States
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register States
  const [regName, setRegName] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regPhone, setRegPhone] = useState("");
  const [regSocial, setRegSocial] = useState("");
  const [socialPlatform, setSocialPlatform] = useState("skip");
  const [socialUsername, setSocialUsername] = useState("");
  const [isSocialDropdownOpen, setIsSocialDropdownOpen] = useState(false);
  const socialDropdownRef = useRef<HTMLDivElement>(null);

  const [gender, setGender] = useState("");
  const [dobDay, setDobDay] = useState("");
  const [dobMonth, setDobMonth] = useState("");
  const [dobYear, setDobYear] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (socialDropdownRef.current && !socialDropdownRef.current.contains(event.target as Node)) {
        setIsSocialDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (socialPlatform && socialPlatform !== "skip") {
      setRegSocial(`${socialPlatform}: ${socialUsername}`);
    } else {
      setRegSocial("");
    }
  }, [socialPlatform, socialUsername]);

  useEffect(() => {
    if (isOpen) {
      setView(initialView);
      setErrorMsg("");
      setShowClosedModal(false);
      setRegName("");
      setRegUsername("");
      setRegEmail("");
      setRegPassword("");
      setRegPhone("");
      setRegSocial("");
      setSocialPlatform("skip");
      setSocialUsername("");
      setIsSocialDropdownOpen(false);
      setGender("");
      setDobDay("");
      setDobMonth("");
      setDobYear("");
      setTermsAccepted(false);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen, initialView]);

  useEffect(() => {
    if (isOpen && view === "register") {
      fetch("/api/auth/register")
        .then((res) => res.json())
        .then((data) => {
          if (data && typeof data.count === "number") {
            setCapacity({ count: data.count, limit: data.limit || 50 });
          }
        })
        .catch((err) => console.error("Error fetching capacity:", err));
    }
  }, [isOpen, view]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const switchView = (newView: AuthView) => {
    setErrorMsg("");
    setView(newView);
  };

  const variants = {
    enter: (direction: number) => ({ opacity: 0, x: direction > 0 ? 10 : -10 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (direction: number) => ({ zIndex: 0, x: direction < 0 ? 10 : -10, opacity: 0 }),
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: loginIdentifier, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      
      if (data.redirect) {
        window.location.href = data.redirect;
      } else {
        window.location.reload();
      } 
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowClosedModal(true);
  };

  const validateField = async (field: "username" | "email" | "phone" | "socialHandle", value: string) => {
    if (!value) return;
    try {
      const res = await fetch("/api/auth/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field, value }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Validation failed");
      } else if (data.valid === false) {
        setErrorMsg(data.error);
      } else {
        setErrorMsg((prev) => {
          const possibleErrors = [
            "Username must be 50 characters or less",
            "Username must be between 3 and 50 characters and contain only alphanumeric characters, periods, or underscores",
            "Username is already taken",
            "Email must be 255 characters or less",
            "Invalid email address format",
            "Disposable email addresses are not allowed",
            "Email is already registered",
            "Invalid Indian mobile number. Must be a valid 10-digit number optionally prefixed with +91.",
            "Mobile number is already registered",
            "Social link must be 255 characters or less",
            "Social platform link/username is already registered"
          ];
          if (possibleErrors.includes(prev)) {
            return "";
          }
          return prev;
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePasswordBlur = () => {
    if (!regPassword) return;
    if (regPassword.length < 8 || regPassword.length > 32) {
      setErrorMsg("Password must be between 8 and 32 characters long");
    } else if (!validatePasswordStrength(regPassword)) {
      setErrorMsg("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character");
    } else {
      setErrorMsg((prev) => {
        if (prev === "Password must be between 8 and 32 characters long" || prev === "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character") {
          return "";
        }
        return prev;
      });
    }
  };

  // Dropdown Options
  const days = Array.from({ length: 31 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) }));
  const months = [
    { value: "01", label: "Jan" }, { value: "02", label: "Feb" }, { value: "03", label: "Mar" },
    { value: "04", label: "Apr" }, { value: "05", label: "May" }, { value: "06", label: "Jun" },
    { value: "07", label: "Jul" }, { value: "08", label: "Aug" }, { value: "09", label: "Sep" },
    { value: "10", label: "Oct" }, { value: "11", label: "Nov" }, { value: "12", label: "Dec" }
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => ({ value: String(currentYear - i), label: String(currentYear - i) }));
  
  const genderOptions = [
    { value: "male", label: "Male" }, 
    { value: "female", label: "Female" }, 
    { value: "other", label: "Other" }, 
    { value: "prefer-not", label: "Prefer not to say" }
  ];

  const socialOptions = [
    { value: "skip", label: "Skip / None", placeholder: "" },
    { value: "github", label: "GitHub", placeholder: "GitHub username" },
    { value: "twitter", label: "X / Twitter", placeholder: "@handle" },
    { value: "linkedin", label: "LinkedIn", placeholder: "LinkedIn username" },
    { value: "instagram", label: "Instagram", placeholder: "@username" },
    { value: "discord", label: "Discord", placeholder: "Discord tag" },
    { value: "telegram", label: "Telegram", placeholder: "@username" },
    { value: "youtube", label: "YouTube", placeholder: "@channel" },
    { value: "reddit", label: "Reddit", placeholder: "u/username" },
    { value: "website", label: "Website", placeholder: "https://yourwebsite.com" }
  ];

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md" 
        onClick={handleBackdropClick}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 10 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className={`relative w-full bg-[#080808] rounded-[22px] overflow-hidden flex flex-col shadow-[0_25px_70px_rgba(0,0,0,0.85)] border border-white/10 transition-all duration-300 ${
            view === "register" ? "max-w-[720px]" : "max-w-[420px]"
          } max-h-[92vh]`}
        >
          {/* Registration Suspended Popup */}
          <AnimatePresence>
            {showClosedModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/95 backdrop-blur-md z-[100] flex flex-col items-center justify-center p-6 text-center"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#00a3ff]/5 rounded-full blur-3xl pointer-events-none" />
                
                <div className="relative z-10 space-y-6 max-w-sm">
                  <div className="w-14 h-14 rounded-2xl bg-[#00a3ff]/10 border border-[#00a3ff]/20 flex items-center justify-center mx-auto text-[#00a3ff]">
                    <ShieldAlert className="w-7 h-7" />
                  </div>
                  
                  <div className="space-y-2.5">
                    <h4 className="text-lg font-black text-white uppercase tracking-tight animate-pulse">Registration Suspended</h4>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      Right now we have stopped accepting new user registration requests.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setShowClosedModal(false);
                      onClose();
                    }}
                    className="w-full py-3 rounded-xl bg-white hover:bg-gray-200 text-black text-xs font-black uppercase tracking-widest transition-all duration-300 active:scale-[0.98]"
                  >
                    Acknowledge
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Top minimal close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 z-50 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar">
            <AnimatePresence mode="wait" custom={view === "register" ? 1 : -1}>
              
              {/* SIGN IN */}
              {view === "login" && (
                <motion.div 
                  key="login" 
                  custom={-1} 
                  variants={variants} 
                  initial="enter" 
                  animate="center" 
                  exit="exit" 
                  transition={{ duration: 0.25 }} 
                  className="space-y-5"
                >
                  <div className="mb-5">
                    <h3 className="text-2xl font-medium text-white tracking-tight leading-none flex items-center gap-3">
                      <img 
                        src="/icon.png" 
                        alt="Introlic Logo" 
                        className="w-10 h-10 object-contain filter brightness-0 invert opacity-95 shrink-0" 
                      />
                      <span>Sign In</span>
                    </h3>
                    <p className="text-gray-500 text-[13px] mt-2.5">Enter your credentials to continue.</p>
                  </div>

                  {errorMsg && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[13px] px-4 py-3 rounded-lg">
                      {errorMsg}
                    </div>
                  )}

                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[13px] font-medium text-gray-400">Email or Username</label>
                      <input
                        type="text"
                        required
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        placeholder="johndoe@example.com"
                        className="w-full h-[46px] bg-[#111111] border border-white/5 rounded-lg px-4 text-white text-[14px] focus:outline-none focus:border-white/20 focus:bg-[#161616] transition-colors placeholder:text-gray-600"
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[13px] font-medium text-gray-400">Password</label>
                        <button type="button" onClick={() => switchView("forgot")} className="text-[13px] font-medium text-gray-500 hover:text-white transition-colors">
                          Forgot Password?
                        </button>
                      </div>
                      <div className="relative h-[46px]">
                        <input
                          type={showLoginPassword ? "text" : "password"}
                          required
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full h-full bg-[#111111] border border-white/5 rounded-lg pl-4 pr-10 text-white text-[14px] focus:outline-none focus:border-white/20 focus:bg-[#161616] transition-colors placeholder:text-gray-600"
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                        >
                          {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button 
                      disabled={isLoading} 
                      type="submit" 
                      className="w-full h-[46px] mt-1 rounded-lg font-medium text-black bg-white text-[14px] transition-all hover:bg-gray-200 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isLoading ? "Signing in..." : "Sign In"}
                      {!isLoading && <ArrowRight className="w-4 h-4" />}
                    </button>
                  </form>

                  <div className="text-center pt-2">
                    <span className="text-[14px] text-gray-500">Don&apos;t have an account? </span>
                    <button onClick={() => switchView("register")} className="text-[14px] font-medium text-white hover:text-gray-300 transition-colors ml-1">
                      Sign Up
                    </button>
                  </div>
                </motion.div>
              )}

              {/* SIGN UP */}
              {view === "register" && (
                <motion.div 
                  key="register" 
                  custom={1} 
                  variants={variants} 
                  initial="enter" 
                  animate="center" 
                  exit="exit" 
                  transition={{ duration: 0.25 }} 
                  className="space-y-5"
                >
                  <div className="mb-4">
                    <h3 className="text-2xl font-medium text-white tracking-tight leading-none flex items-center gap-3">
                      <img 
                        src="/icon.png" 
                        alt="Introlic Logo" 
                        className="w-10 h-10 object-contain filter brightness-0 invert opacity-95 shrink-0" 
                      />
                      <span>Create Account</span>
                    </h3>
                    <p className="text-gray-500 text-[13px] mt-2">Join the platform today.</p>
                  </div>

                  {errorMsg && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[13px] px-4 py-3 rounded-lg">
                      {errorMsg}
                    </div>
                  )}

                  <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    {/* Synchronized 2-Column Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                      
                      {/* Left Row 1: Full Name */}
                      <div className="space-y-1.5">
                        <label className="text-[13px] font-medium text-gray-400 block">Full Name</label>
                        <input 
                          type="text" 
                          required 
                          value={regName} 
                          onChange={(e) => setRegName(e.target.value)} 
                          placeholder="John Doe" 
                          className="w-full h-[46px] bg-[#111111] border border-white/5 rounded-lg px-4 text-white text-[14px] focus:outline-none focus:border-white/20 focus:bg-[#161616] transition-colors placeholder:text-gray-600" 
                        />
                      </div>

                      {/* Right Row 1: Gender */}
                      <div className="space-y-1.5">
                        <label className="text-[13px] font-medium text-gray-400 block">Gender</label>
                        <CustomDropdown 
                          options={genderOptions} 
                          value={gender} 
                          onChange={setGender} 
                          placeholder="Select gender" 
                          direction="down"
                        />
                      </div>

                      {/* Left Row 2: Username */}
                      <div className="space-y-1.5">
                        <label className="text-[13px] font-medium text-gray-400 block">Username</label>
                        <input 
                          type="text" 
                          required 
                          value={regUsername} 
                          onChange={(e) => setRegUsername(e.target.value)} 
                          onBlur={() => validateField("username", regUsername)}
                          placeholder="@johndoe" 
                          className="w-full h-[46px] bg-[#111111] border border-white/5 rounded-lg px-4 text-white text-[14px] focus:outline-none focus:border-white/20 focus:bg-[#161616] transition-colors placeholder:text-gray-600" 
                        />
                      </div>

                      {/* Right Row 2: Date of Birth */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <label className="text-[13px] font-medium text-gray-400">
                            Date of Birth <span className="text-[11px] text-gray-500 font-normal italic">(optional)</span>
                          </label>
                          {(dobDay || dobMonth || dobYear) && (
                            <button
                              type="button"
                              onClick={() => {
                                setDobDay("");
                                setDobMonth("");
                                setDobYear("");
                              }}
                              className="text-[11px] text-red-400 hover:text-red-300 hover:underline cursor-pointer"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-3 gap-2 w-full">
                          <CustomDropdown options={days} value={dobDay} onChange={setDobDay} placeholder="DD" direction="down" />
                          <CustomDropdown options={months} value={dobMonth} onChange={setDobMonth} placeholder="MM" direction="down" />
                          <CustomDropdown options={years} value={dobYear} onChange={setDobYear} placeholder="YYYY" direction="down" />
                        </div>
                      </div>

                      {/* Left Row 3: Email Address */}
                      <div className="space-y-1.5">
                        <label className="text-[13px] font-medium text-gray-400 block">Email Address</label>
                        <input 
                          type="email" 
                          required 
                          value={regEmail} 
                          onChange={(e) => setRegEmail(e.target.value)} 
                          onBlur={() => validateField("email", regEmail)}
                          placeholder="john@gmail.com" 
                          className="w-full h-[46px] bg-[#111111] border border-white/5 rounded-lg px-4 text-white text-[14px] focus:outline-none focus:border-white/20 focus:bg-[#161616] transition-colors placeholder:text-gray-600" 
                        />
                      </div>

                      {/* Right Row 3: Mobile Number */}
                      <div className="space-y-1.5">
                        <label className="text-[13px] font-medium text-gray-400 block">
                          Mobile Number <span className="text-[11px] text-gray-500 font-normal italic">(optional)</span>
                        </label>
                        <input 
                          type="tel" 
                          value={regPhone} 
                          onChange={(e) => setRegPhone(e.target.value)} 
                          onBlur={() => validateField("phone", regPhone)}
                          placeholder="+91 XXXXX XXXXX" 
                          className="w-full h-[46px] bg-[#111111] border border-white/5 rounded-lg px-4 text-white text-[14px] focus:outline-none focus:border-white/20 focus:bg-[#161616] transition-colors placeholder:text-gray-600" 
                        />
                      </div>

                      {/* Left Row 4: Password */}
                      <div className="space-y-1.5">
                        <label className="text-[13px] font-medium text-gray-400 block">Password</label>
                        <div className="relative h-[46px] w-full">
                          <input 
                            type={showRegPassword ? "text" : "password"} 
                            required 
                            value={regPassword} 
                            onChange={(e) => setRegPassword(e.target.value)} 
                            onBlur={handlePasswordBlur}
                            placeholder="Create password" 
                            className="w-full h-full bg-[#111111] border border-white/5 rounded-lg pl-4 pr-10 text-white text-[14px] focus:outline-none focus:border-white/20 focus:bg-[#161616] transition-colors placeholder:text-gray-600" 
                          />
                          <button 
                            type="button" 
                            onClick={() => setShowRegPassword(!showRegPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                          >
                            {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-white" />}
                          </button>
                        </div>
                      </div>

                      {/* Right Row 4: Integrated Social Platform - Opens Upwards */}
                      <div className="space-y-1.5 relative">
                        <label className="text-[13px] font-medium text-gray-400 block">
                          Social Platform <span className="text-[11px] text-gray-500 font-normal italic">(optional)</span>
                        </label>

                        {socialPlatform === "skip" ? (
                          <CustomDropdown 
                            options={socialOptions} 
                            value={socialPlatform} 
                            onChange={(val) => {
                              setSocialPlatform(val);
                              if (val === "skip") setSocialUsername("");
                            }} 
                            placeholder="Skip / None" 
                            direction="up"
                          />
                        ) : (
                          <div 
                            className="relative flex items-center bg-[#111111] border border-white/5 focus-within:border-white/20 rounded-lg h-[46px] transition-colors w-full"
                            ref={socialDropdownRef}
                          >
                            {/* Embedded Platform Badge & Selector */}
                            <button
                              type="button"
                              onClick={() => setIsSocialDropdownOpen(!isSocialDropdownOpen)}
                              className="h-full px-3 bg-[#181818] hover:bg-[#222222] text-white text-[13px] font-medium rounded-l-lg border-r border-white/10 flex items-center gap-1.5 transition-colors shrink-0"
                            >
                              <span>{socialOptions.find((o) => o.value === socialPlatform)?.label}</span>
                              <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${isSocialDropdownOpen ? 'rotate-180 text-white' : ''}`} />
                            </button>

                            {/* Handle / Link input */}
                            <input
                              type="text"
                              value={socialUsername}
                              onChange={(e) => setSocialUsername(e.target.value)}
                              onBlur={() => validateField("socialHandle", regSocial)}
                              placeholder={socialOptions.find((o) => o.value === socialPlatform)?.placeholder || "username"}
                              className="flex-1 min-w-0 bg-transparent px-3 text-white text-[14px] focus:outline-none placeholder:text-gray-600 h-full"
                            />

                            {/* Reset / Clear Button */}
                            <button
                              type="button"
                              onClick={() => {
                                if (socialUsername) {
                                  setSocialUsername("");
                                } else {
                                  setSocialPlatform("skip");
                                }
                              }}
                              className="px-3 text-gray-500 hover:text-white transition-colors shrink-0"
                              title={socialUsername ? "Clear text" : "Reset to Skip"}
                            >
                              <X className="w-4 h-4" />
                            </button>

                            {/* Dropdown Menu when changing platform - Opens Upwards */}
                            <AnimatePresence>
                              {isSocialDropdownOpen && (
                                <motion.div
                                  initial={{ opacity: 0, y: 4 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: 4 }}
                                  transition={{ duration: 0.12 }}
                                  className="absolute left-0 bottom-[calc(100%+6px)] w-52 bg-[#141414] border border-[#262626] rounded-lg overflow-hidden z-[100] max-h-56 overflow-y-auto shadow-2xl custom-scrollbar"
                                >
                                  {socialOptions.map((o) => (
                                    <div
                                      key={o.value}
                                      onClick={() => {
                                        setSocialPlatform(o.value);
                                        setIsSocialDropdownOpen(false);
                                        if (o.value === "skip") setSocialUsername("");
                                      }}
                                      className={`px-4 py-2.5 cursor-pointer text-[13px] transition-colors ${
                                        socialPlatform === o.value
                                          ? "bg-white text-black font-medium"
                                          : "text-gray-300 hover:text-white hover:bg-[#222]"
                                      }`}
                                    >
                                      {o.label}
                                    </div>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )}
                      </div>

                    </div>

                    {/* Password Strength Indicator */}
                    {regPassword.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <div className="flex gap-2">
                          {[...Array(4)].map((_, i) => {
                            let strength = 0;
                            if (regPassword.length >= 8) strength++;
                            if (/[A-Z]/.test(regPassword) && /[a-z]/.test(regPassword)) strength++;
                            if (/[0-9]/.test(regPassword)) strength++;
                            if (/[\W_]/.test(regPassword)) strength++;
                            
                            let color = "bg-gray-700";
                            if (strength > i) {
                              if (strength <= 1) color = "bg-red-500";
                              else if (strength === 2) color = "bg-yellow-500";
                              else if (strength === 3) color = "bg-blue-500";
                              else color = "bg-green-500";
                            }
                            return <div key={i} className={`h-1.5 flex-1 rounded-full ${color} transition-colors duration-300`} />;
                          })}
                        </div>
                        {!validatePasswordStrength(regPassword) && (
                          <p className="text-[12px] text-gray-500">Requires 8-32 chars, uppercase, lowercase, number, and special character.</p>
                        )}
                      </div>
                    )}

                    {/* Terms & Conditions Checkbox */}
                    <div className="pt-1.5">
                      <label className="flex items-center gap-3 cursor-pointer group select-none">
                        <div className={`w-4.5 h-4.5 rounded-[5px] border flex items-center justify-center transition-all shrink-0 ${termsAccepted ? 'bg-white border-white' : 'border-[#333] bg-[#111] group-hover:border-[#555]'}`}>
                          {termsAccepted && <Check className="w-3.5 h-3.5 text-black" strokeWidth={3} />}
                        </div>
                        <input 
                          type="checkbox" 
                          className="hidden" 
                          checked={termsAccepted} 
                          onChange={(e) => setTermsAccepted(e.target.checked)} 
                        />
                        <span className="text-[13px] text-gray-400">
                          I accept the <Link href="/terms" target="_blank" className="text-white hover:underline">Terms of Service</Link> and <Link href="/privacy" target="_blank" className="text-white hover:underline">Privacy Policy</Link>.
                        </span>
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button 
                      disabled={isLoading || (capacity !== null && capacity.count >= capacity.limit)} 
                      type="submit" 
                      className="w-full h-[48px] mt-1 rounded-lg font-semibold text-black bg-white text-[14px] transition-all hover:bg-gray-200 active:scale-[0.98] disabled:opacity-50 disabled:bg-[#111] disabled:text-gray-600 disabled:cursor-not-allowed"
                    >
                      {isLoading 
                        ? "Creating Account..." 
                        : capacity && capacity.count >= capacity.limit 
                          ? "Registration Full" 
                          : "Create Account"
                      }
                    </button>
                  </form>

                  <div className="text-center pt-1">
                    <span className="text-[14px] text-gray-500">Already have an account? </span>
                    <button onClick={() => switchView("login")} className="text-[14px] font-medium text-white hover:text-gray-300 transition-colors ml-1">
                      Sign In
                    </button>
                  </div>
                </motion.div>
              )}

              {/* FORGOT PASSWORD */}
              {view === "forgot" && (
                <motion.div 
                  key="forgot" 
                  custom={1} 
                  variants={variants} 
                  initial="enter" 
                  animate="center" 
                  exit="exit" 
                  transition={{ duration: 0.25 }} 
                  className="space-y-5"
                >
                  <div className="mb-5">
                    <h3 className="text-2xl font-medium text-white tracking-tight leading-none flex items-center gap-3">
                      <img 
                        src="/icon.png" 
                        alt="Introlic Logo" 
                        className="w-10 h-10 object-contain filter brightness-0 invert opacity-95 shrink-0" 
                      />
                      <span>Reset Password</span>
                    </h3>
                    <p className="text-gray-500 text-[13px] mt-2.5">Enter your email to receive a reset link.</p>
                  </div>

                  <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[13px] font-medium text-gray-400">Email Address</label>
                      <input 
                        type="email" 
                        required 
                        placeholder="john@gmail.com" 
                        className="w-full h-[46px] bg-[#111111] border border-white/5 rounded-lg px-4 text-white text-[14px] focus:outline-none focus:border-white/20 focus:bg-[#161616] transition-colors placeholder:text-gray-600" 
                      />
                    </div>

                    <button 
                      type="submit" 
                      className="w-full h-[46px] mt-1 rounded-lg font-medium text-black bg-white text-[14px] transition-all hover:bg-gray-200 active:scale-[0.98]"
                    >
                      Send Reset Link
                    </button>
                  </form>

                  <div className="text-center pt-2">
                    <button onClick={() => switchView("login")} className="text-[13px] font-medium text-gray-500 hover:text-white transition-colors">
                      Back to Sign In
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
