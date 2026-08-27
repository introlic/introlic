"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/constants/animations';
import { 
  XIcon, 
  LinkedinIcon, 
  GithubIcon, 
  InstagramIcon, 
  YouTubeIcon, 
  DiscordIcon 
} from './SocialIcons';

type SocialLink = {
  url: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  label: string;
  hoverClass: string;
};

type Member = {
  id: string;
  name: string;
  role: string;
  subRole: string;
  bio: string;
  links: SocialLink[];
};

const teamMembers: Member[] = [
  {
    id: "faiz-shah",
    name: "Faiz Shah",
    role: "Founder",
    subRole: "Systems Architect",
    bio: "Leading Introlic's core vision, product direction, and software systems from first principles. Focused on building high-performance digital tools and lean architecture stacks.",
    links: [
      { 
        url: "https://x.com/MrUniqers", 
        icon: XIcon, 
        label: "X / Twitter",
        hoverClass: "hover:border-[#1DA1F2]/60 hover:bg-[#1DA1F2]/15 hover:text-[#1DA1F2] hover:shadow-[0_0_15px_rgba(29,161,242,0.35)]"
      },
      { 
        url: "https://www.linkedin.com/in/iamrealshahfaiz/", 
        icon: LinkedinIcon, 
        label: "LinkedIn",
        hoverClass: "hover:border-[#0A66C2]/60 hover:bg-[#0A66C2]/15 hover:text-[#0A66C2] hover:shadow-[0_0_15px_rgba(10,102,194,0.35)]"
      },
      { 
        url: "https://github.com/mruniqers", 
        icon: GithubIcon, 
        label: "GitHub",
        hoverClass: "hover:border-white/70 hover:bg-white/15 hover:text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.35)]"
      },
      { 
        url: "https://www.instagram.com/mr.uniqers/", 
        icon: InstagramIcon, 
        label: "Instagram",
        hoverClass: "hover:border-[#E4405F]/60 hover:bg-[#E4405F]/15 hover:text-[#E4405F] hover:shadow-[0_0_15px_rgba(228,64,95,0.35)]"
      },
      { 
        url: "https://youtube.com/@channel", 
        icon: YouTubeIcon, 
        label: "YouTube",
        hoverClass: "hover:border-[#FF0000]/60 hover:bg-[#FF0000]/15 hover:text-[#FF0000] hover:shadow-[0_0_15px_rgba(255,0,0,0.35)]"
      },
      { 
        url: "https://discord.com/invite/introlic", 
        icon: DiscordIcon, 
        label: "Discord",
        hoverClass: "hover:border-[#5865F2]/60 hover:bg-[#5865F2]/15 hover:text-[#5865F2] hover:shadow-[0_0_15px_rgba(88,101,242,0.35)]"
      },
    ],
  },
  {
    id: "mr-faiz",
    name: "SHAH  FAIZ",
    role: "Founder",
    subRole: "Systems Architect",
    bio: "Founder & systems builder. Engineering sovereign digital systems from first principles, built without institutional backing or venture safety nets.",
    links: [
      { 
        url: "https://x.com/MrUniqers", 
        icon: XIcon, 
        label: "X / Twitter",
        hoverClass: "hover:border-[#1DA1F2]/60 hover:bg-[#1DA1F2]/15 hover:text-[#1DA1F2] hover:shadow-[0_0_15px_rgba(29,161,242,0.35)]"
      },
      { 
        url: "https://www.linkedin.com/in/iamrealshahfaiz/", 
        icon: LinkedinIcon, 
        label: "LinkedIn",
        hoverClass: "hover:border-[#0A66C2]/60 hover:bg-[#0A66C2]/15 hover:text-[#0A66C2] hover:shadow-[0_0_15px_rgba(10,102,194,0.35)]"
      },
      { 
        url: "https://github.com/mruniqers", 
        icon: GithubIcon, 
        label: "GitHub",
        hoverClass: "hover:border-white/70 hover:bg-white/15 hover:text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.35)]"
      },
      { 
        url: "https://www.instagram.com/mr.uniqers/", 
        icon: InstagramIcon, 
        label: "Instagram",
        hoverClass: "hover:border-[#E4405F]/60 hover:bg-[#E4405F]/15 hover:text-[#E4405F] hover:shadow-[0_0_15px_rgba(228,64,95,0.35)]"
      },
      { 
        url: "https://youtube.com/@channel", 
        icon: YouTubeIcon, 
        label: "YouTube",
        hoverClass: "hover:border-[#FF0000]/60 hover:bg-[#FF0000]/15 hover:text-[#FF0000] hover:shadow-[0_0_15px_rgba(255,0,0,0.35)]"
      },
      { 
        url: "https://discord.com/invite/introlic", 
        icon: DiscordIcon, 
        label: "Discord",
        hoverClass: "hover:border-[#5865F2]/60 hover:bg-[#5865F2]/15 hover:text-[#5865F2] hover:shadow-[0_0_15px_rgba(88,101,242,0.35)]"
      },
    ],
  },
  {
    id: "shaurya",
    name: "Shaurya Fatania",
    role: "CEO",
    subRole: "Chief Executive Officer",
    bio: "Directing operations, computational pipelines, and deployment infrastructure to maintain peak velocity and scalability across core product ecosystems.",
    links: [
      { 
        url: "https://github.com/editelligence/", 
        icon: GithubIcon, 
        label: "GitHub",
        hoverClass: "hover:border-white/70 hover:bg-white/15 hover:text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.35)]"
      },
      { 
        url: "https://www.instagram.com/edit.elligence/", 
        icon: InstagramIcon, 
        label: "Instagram",
        hoverClass: "hover:border-[#E4405F]/60 hover:bg-[#E4405F]/15 hover:text-[#E4405F] hover:shadow-[0_0_15px_rgba(228,64,95,0.35)]"
      },
      { 
        url: "https://discord.com/invite/introlic", 
        icon: DiscordIcon, 
        label: "Discord",
        hoverClass: "hover:border-[#5865F2]/60 hover:bg-[#5865F2]/15 hover:text-[#5865F2] hover:shadow-[0_0_15px_rgba(88,101,242,0.35)]"
      },
    ],
  },
];

export default function Team({ showFounder = true }: { showFounder?: boolean }) {
  const membersToDisplay = showFounder ? teamMembers : teamMembers.filter(m => m.id !== "faiz-shah");

  return (
    <section id="team" className="relative bg-[#020202] py-20 md:py-28 selection:bg-[#00a3ff]/30 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00a3ff]/05 blur-[160px] pointer-events-none rounded-full" />

      {/* ── Section Header ── */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 mb-14 relative z-10">
        <motion.div
          variants={staggerContainer(0.1, 0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-4"
        >
          <motion.div variants={staggerItem} className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#00a3ff] shadow-[0_0_8px_#00a3ff]" />
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] uppercase text-gray-400">
              Leadership & Architecture
            </span>
          </motion.div>

          <motion.h2 
            variants={staggerItem} 
            className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tightest leading-tight"
          >
            The{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00a3ff] via-[#00c8ff] to-[#00e1ff]">
              Builders.
            </span>
          </motion.h2>

          <motion.p variants={staggerItem} className="text-sm sm:text-base text-gray-400 font-medium leading-relaxed max-w-2xl">
            Introlic is engineered by a dedicated leadership team of systems architects, researchers, and operators building next-generation AI and software systems from first principles.
          </motion.p>
        </motion.div>
      </div>

      {/* ── Leadership Grid ── */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {membersToDisplay.map((member) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative p-6 sm:p-8 rounded-2xl backdrop-blur-md overflow-hidden group flex flex-col justify-between transition-all duration-300 border border-white/[0.08] bg-[#07070a]/80 hover:border-[#00a3ff]/40 hover:bg-[#09090f]/90 hover:-translate-y-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.6)] hover:shadow-[0_25px_60px_rgba(0,163,255,0.1)]"
            >
              {/* Subtle top accent line */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00a3ff]/40 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />

              <div className="space-y-5">
                {/* Role Pill & Status Beacon */}
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[#00a3ff]/10 text-[#00a3ff] border border-[#00a3ff]/20">
                    <span>{member.role}</span>
                    <span className="text-[#00a3ff]/40">·</span>
                    <span className="text-gray-300">{member.subRole}</span>
                  </span>

                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 bg-[#00a3ff]" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00a3ff]" />
                  </span>
                </div>

                {/* Member Name */}
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight group-hover:text-[#00a3ff] transition-colors duration-200">
                    {member.name}
                  </h3>
                </div>

                {/* Biography */}
                <p className="text-[13px] sm:text-sm text-gray-400 leading-relaxed font-medium">
                  {member.bio}
                </p>
              </div>

              {/* Social Links */}
              <div className="pt-6 mt-6 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-500">
                  Connect
                </span>
                <div className="flex flex-wrap gap-2">
                  {member.links.map((link) => {
                    const LinkIcon = link.icon;
                    return (
                      <a
                        key={link.label}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-8 h-8 rounded-lg flex items-center justify-center border border-white/[0.08] bg-white/[0.02] text-gray-400 transition-all duration-200 hover:scale-110 active:scale-95 shrink-0 ${link.hoverClass}`}
                        title={link.label}
                      >
                        <LinkIcon className="w-3.5 h-3.5 transition-colors duration-200" />
                      </a>
                    );
                  })}
                </div>
              </div>

            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
