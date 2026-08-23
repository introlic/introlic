"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Users, Cpu, Globe, BookOpen, Mail, LogIn, UserPlus, Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { COLORS } from '@/constants/branding';
import AuthModal from './auth/AuthModal';

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  if (pathname.startsWith('/admin') || pathname.startsWith('/docs') || pathname.startsWith('/ppt')) return null;

  const navLinks = [
    { name: 'Home', href: '/', icon: Home, active: pathname === '/' },
    { name: 'About', href: '/about', icon: Users, active: pathname === '/about' },
    { name: 'Projects', href: '/projects', icon: Cpu, active: pathname === '/projects' },
    { name: 'Research', href: '/research', icon: Globe, active: pathname === '/research' },
    { name: 'Blogs', href: '/blog', icon: BookOpen, active: pathname === '/blog' },
    { name: 'Contact', href: '/contact', icon: Mail, active: pathname === '/contact' },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-700 ${isScrolled
          ? 'py-3 bg-black/95 backdrop-blur-3xl border-b border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.8)]'
          : 'py-5 md:py-6 bg-transparent border-b border-transparent'
          }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex justify-between items-center">
          {/* Logo Section */}
          <div className="flex items-center gap-6 lg:gap-12">
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="text-2xl md:text-3xl font-black tracking-tighter flex items-center gap-3 group active:opacity-80 transition-transform hover:scale-105"
            >
              <img
                src="/icon.png"
                alt="Introlic Logo"
                className="w-10 h-10 md:w-12 md:h-12 object-contain group-hover:rotate-[60deg] transition-transform duration-700 ease-out"
              />
              <span style={{ color: COLORS.brand.blue }}>INTROLIC</span>
            </Link>

            {/* Nav Links - Primary (Desktop) */}
            <div className="hidden xl:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`group flex items-center gap-2 px-4 py-2 text-[14px] font-black tracking-wide transition-all rounded-full hover:bg-white hover:text-black active:bg-white active:scale-95 whitespace-nowrap ${link.active ? 'border-b' : 'text-gray-300 hover:text-black'
                    }`}
                  style={{
                    color: link.active ? COLORS.brand.blue : undefined,
                    borderColor: link.active ? COLORS.brand.blue : 'transparent'
                  }}
                >
                  <link.icon className={`w-3.5 h-3.5 transition-transform group-hover:scale-110 group-hover:text-black ${link.active ? '' : 'text-gray-500 group-hover:text-black group-active:text-black'}`} style={{ color: link.active ? COLORS.brand.blue : undefined }} />
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {!pathname.startsWith('/admin') && (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => { setAuthView('login'); setIsAuthModalOpen(true); }}
                  className="flex items-center gap-2 px-4 md:px-6 py-2 text-[14px] font-black text-gray-300 hover:bg-white hover:text-black transition-all rounded-full active:scale-95 group whitespace-nowrap"
                >
                  <LogIn className="w-4 h-4 group-hover:text-black transition-colors" />
                  Sign In
                </button>
                <button
                  onClick={() => { setAuthView('register'); setIsAuthModalOpen(true); }}
                  className="text-white hover:bg-white px-5 md:px-7 py-2.5 rounded-full text-[14px] font-black transition-all transform hover:scale-[1.05] active:scale-95 flex items-center gap-2 group whitespace-nowrap"
                  style={{ backgroundColor: COLORS.brand.blue, boxShadow: `0 0 30px ${COLORS.brand.blue}33` }}
                >
                  Sign Up
                  <UserPlus className="w-4 h-4 group-hover:text-black transition-colors" />
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`xl:hidden p-2 text-white transition-all duration-300 relative z-[110] ${
                isMenuOpen ? "opacity-0 scale-75 pointer-events-none" : "opacity-100 scale-100"
              }`}
              aria-label="Toggle Menu"
            >
              <motion.div
                animate={{ rotate: isMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <Menu className="w-8 h-8" />
              </motion.div>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black z-[90] cursor-pointer"
            />
            {/* Slide-over Drawer Panel */}
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 w-[280px] sm:w-[320px] bg-[#050505] border-l border-white/10 z-[95] shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col px-6 overflow-y-auto"
            >
              {/* Background Blueprint Mesh */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '20px 20px' }} />

              {/* Drawer Top Header with White Icon */}
              <div className="relative z-10 flex items-center justify-between py-6 border-b border-white/10 mb-8">
                <Link
                  href="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 group"
                >
                  <img
                    src="/icon.png"
                    alt="Introlic Logo"
                    className="w-8 h-8 object-contain filter brightness-0 invert opacity-95 shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <span className="text-xl font-black tracking-tight text-white">INTROLIC</span>
                </Link>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                  title="Close Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative z-10 flex flex-col gap-6 mb-12">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-4 text-xl sm:text-2xl font-black tracking-wide transition-all`}
                      style={{ color: link.active ? COLORS.brand.blue : 'rgba(255,255,255,0.6)' }}
                    >
                      <link.icon className={`w-5 h-5 ${link.active ? '' : 'text-white/20'}`} style={{ color: link.active ? COLORS.brand.blue : undefined }} />
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="relative z-10 mt-auto pb-10 flex flex-col gap-4 border-t border-white/5 pt-8">
                {!pathname.startsWith('/admin') && (
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => { setIsMenuOpen(false); setAuthView('login'); setIsAuthModalOpen(true); }}
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white/5 text-white font-black text-sm tracking-widest border border-white/10"
                    >
                      <LogIn className="w-4 h-4" />
                      SIGN IN
                    </button>
                    <button
                      onClick={() => { setIsMenuOpen(false); setAuthView('register'); setIsAuthModalOpen(true); }}
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white font-black text-sm tracking-widest shadow-xl"
                      style={{ backgroundColor: COLORS.brand.blue, boxShadow: `0 0 30px ${COLORS.brand.blue}4D` }}
                    >
                      SIGN UP
                      <UserPlus className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        initialView={authView} 
      />
    </>
  );
}
