import React from 'react';

// ── CSS Art Covers (no images needed, pure SVG/CSS) ──

export const CoverIntrolicDWaves = () => (
  <div className="relative w-full h-full bg-[#000] overflow-hidden">
    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
      {[...Array(12)].map((_, i) => (
        <line
          key={i}
          x1="0" y1={`${50 + (i - 6) * 6}%`}
          x2="100%" y2={`${50 + (i - 6) * 2}%`}
          stroke="#00a3ff"
          strokeWidth={i === 6 ? "1.5" : "0.4"}
          strokeOpacity={i === 6 ? 0.9 : 0.15 - Math.abs(i - 6) * 0.015}
        />
      ))}
      <line x1="60%" y1="50%" x2="100%" y2="50%" stroke="#00a3ff" strokeWidth="2" strokeOpacity="0.8" />
      {[...Array(8)].map((_, i) => (
        <line
          key={`c${i}`}
          x1="0" y1={`${20 + i * 9}%`}
          x2="60%" y2="50%"
          stroke="#00a3ff"
          strokeWidth="0.5"
          strokeOpacity={0.08 + (i === 3 || i === 4 ? 0.1 : 0)}
        />
      ))}
    </svg>
    <div className="absolute left-[60%] top-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="w-3 h-3 rounded-full bg-[#00a3ff] shadow-[0_0_30px_rgba(0,163,255,0.9)]" />
      <div className="absolute inset-0 w-3 h-3 rounded-full bg-[#00a3ff] animate-ping opacity-40" />
    </div>
    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,163,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,163,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
  </div>
);

export const CoverIntrolicKMemory = () => (
  <div className="relative w-full h-full bg-[#000] overflow-hidden">
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="grid grid-cols-10 gap-1 p-6 w-full">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className={`aspect-square rounded-xs transition-all ${
              i < 8
                ? 'bg-[#00a3ff] shadow-[0_0_8px_rgba(0,163,255,0.6)]'
                : i < 10
                ? 'bg-[#00a3ff]/30'
                : 'bg-white/[0.04] border border-white/[0.05]'
            }`}
          />
        ))}
      </div>
    </div>
    <div className="absolute bottom-6 left-6 right-6 flex items-center gap-2">
      <div className="flex-1 h-px bg-gray-800" />
      <span className="text-[8px] font-mono text-gray-600 tracking-widest">VRAM FOOTPRINT FUSED</span>
      <div className="flex-1 h-px bg-[#00a3ff]/30" />
    </div>
  </div>
);

export const CoverXTStrategy = () => (
  <div className="relative w-full h-full bg-[#000] overflow-hidden flex items-center justify-center">
    <svg className="absolute inset-0 w-full h-full opacity-60" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet">
      {[
        { x: 60, y: 250, label: "7.2M", size: 4 },
        { x: 120, y: 210, label: "220M", size: 5 },
        { x: 185, y: 170, label: "500M", size: 5 },
        { x: 250, y: 130, label: "1B", size: 6 },
        { x: 315, y: 90, label: "3B", size: 6 },
        { x: 375, y: 55, label: "7B", size: 7 },
      ].map((n, i) => (
        <g key={i}>
          {i > 0 && (
            <line
              x1={[60,120,185,250,315][i-1]} y1={[250,210,170,130,90][i-1]}
              x2={n.x} y2={n.y}
              stroke="#00a3ff" strokeWidth="0.8" strokeOpacity="0.3"
              strokeDasharray="4 4"
            />
          )}
          <circle cx={n.x} cy={n.y} r={n.size} fill="#00a3ff" fillOpacity={0.5 + i * 0.07} />
          <circle cx={n.x} cy={n.y} r={n.size + 4} fill="none" stroke="#00a3ff" strokeWidth="0.5" strokeOpacity="0.2" />
        </g>
      ))}
      <circle cx={400} cy={20} r={20} fill="#00a3ff" fillOpacity="0.03" />
      <circle cx={400} cy={20} r={12} fill="#00a3ff" fillOpacity="0.08" />
      <line x1="375" y1="55" x2="400" y2="20" stroke="#00a3ff" strokeWidth="1" strokeOpacity="0.5" strokeDasharray="3 3" />
      <text x="370" y="18" fill="#00a3ff" fontSize="8" fontFamily="monospace" opacity="0.6" textAnchor="middle">390B</text>
    </svg>
    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,163,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,163,255,0.015)_1px,transparent_1px)] bg-[size:30px_30px]" />
  </div>
);

export const CoverEdgeInference = () => (
  <div className="relative w-full h-full bg-[#000] overflow-hidden flex items-center justify-center">
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300">
      {/* Concentric hexagons */}
      {[80, 60, 40, 20].map((r, i) => (
        <polygon
          key={i}
          points={`200,${150 - r} ${200 + r * 0.87},${150 - r * 0.5} ${200 + r * 0.87},${150 + r * 0.5} 200,${150 + r} ${200 - r * 0.87},${150 + r * 0.5} ${200 - r * 0.87},${150 - r * 0.5}`}
          fill="none"
          stroke="#00a3ff"
          strokeWidth="0.6"
          strokeOpacity={0.1 + i * 0.1}
        />
      ))}
      {/* Core node */}
      <circle cx="200" cy="150" r="6" fill="#00a3ff" fillOpacity="0.8" />
      {/* Radiating data lines */}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        return (
          <line
            key={i}
            x1="200" y1="150"
            x2={200 + Math.cos(rad) * 120} y2={150 + Math.sin(rad) * 120}
            stroke="#00a3ff" strokeWidth="0.4" strokeOpacity="0.2"
            strokeDasharray="3 6"
          />
        );
      })}
    </svg>
    <div className="absolute bottom-5 left-5 text-[8px] font-mono text-gray-700 tracking-[0.3em] uppercase">
      Edge Perimeter // Zero Egress
    </div>
  </div>
);

export const CoverKernelFusion = () => (
  <div className="relative w-full h-full bg-[#000] overflow-hidden">
    <div className="absolute inset-0 grid grid-cols-3 gap-px p-6 opacity-60">
      {['Python Layer', 'CUDA Runtime', 'Metal'].map((label, col) => (
        <div key={label} className="flex flex-col gap-1.5">
          {[...Array(7)].map((_, row) => (
            <div
              key={row}
              className={`h-4 rounded-sm ${
                col === 2 && row < 3 ? 'bg-[#00a3ff] shadow-[0_0_10px_rgba(0,163,255,0.5)]'
                : col === 0 ? 'bg-white/5'
                : col === 1 && row > 2 ? 'bg-white/5'
                : 'bg-white/[0.08]'
              }`}
            />
          ))}
          <span className={`text-[7px] font-mono tracking-widest uppercase mt-1 ${col === 2 ? 'text-[#00a3ff]' : 'text-gray-800'}`}>
            {label}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export interface BlogPost {
  id: string;
  slug: string;
  category: string;
  tag: string;
  date: string;
  readTime: string;
  title: string;
  excerpt: string;
  cover: React.FC;
  hero?: boolean;
  body: string;
  author?: string;
  thumbnailUrl?: string;
  thumbnail_url?: string;
  showContributors?: boolean;
  contributors?: { name: string; role?: string }[];
}

export const allPosts: BlogPost[] = [];

export const categories = ['All', 'Architecture', 'Engineering', 'Strategy', 'Privacy', 'AI Research'];
