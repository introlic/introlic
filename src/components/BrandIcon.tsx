import React from 'react';

interface BrandIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

export function IntrolicIcon({ size = 32, className = '', ...props }: BrandIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none ${className}`}
      {...props}
    >
      <defs>
        <linearGradient id="introlic-logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00d1ff" />
          <stop offset="50%" stopColor="#00a3ff" />
          <stop offset="100%" stopColor="#0044ff" />
        </linearGradient>
        <radialGradient id="core-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00d1ff" stopOpacity="0.6" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      {/* Central Glow */}
      <circle cx="50" cy="50" r="18" fill="url(#core-glow)" />

      {/* Outer Hexagon Border Segments */}
      <path d="M 50,12 L 83,31" stroke="url(#introlic-logo-gradient)" strokeWidth="5" strokeLinecap="round" />
      <path d="M 85,34 L 85,72" stroke="url(#introlic-logo-gradient)" strokeWidth="5" strokeLinecap="round" />
      <path d="M 83,75 L 50,94" stroke="url(#introlic-logo-gradient)" strokeWidth="5" strokeLinecap="round" />
      <path d="M 47,94 L 14,75" stroke="url(#introlic-logo-gradient)" strokeWidth="5" strokeLinecap="round" />
      <path d="M 12,72 L 12,34" stroke="url(#introlic-logo-gradient)" strokeWidth="5" strokeLinecap="round" />
      <path d="M 14,31 L 47,12" stroke="url(#introlic-logo-gradient)" strokeWidth="5" strokeLinecap="round" />

      {/* 6 Outer Vertex Nodes */}
      <circle cx="50" cy="10" r="4.5" fill="#00d1ff" />
      <circle cx="84.6" cy="30" r="4.5" fill="#00d1ff" />
      <circle cx="84.6" cy="70" r="4.5" fill="#00d1ff" />
      <circle cx="50" cy="90" r="4.5" fill="#00d1ff" />
      <circle cx="15.4" cy="70" r="4.5" fill="#00d1ff" />
      <circle cx="15.4" cy="30" r="4.5" fill="#00d1ff" />

      {/* Inner Lattice Web (Curved arcs connecting vertices) */}
      <path d="M 50,22 Q 57,34 74,35" stroke="url(#introlic-logo-gradient)" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M 76,43 Q 78,57 74,65" stroke="url(#introlic-logo-gradient)" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M 74,68 Q 63,77 50,78" stroke="url(#introlic-logo-gradient)" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M 50,78 Q 37,77 26,68" stroke="url(#introlic-logo-gradient)" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M 26,65 Q 22,57 24,43" stroke="url(#introlic-logo-gradient)" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M 26,35 Q 43,34 50,22" stroke="url(#introlic-logo-gradient)" strokeWidth="3" strokeLinecap="round" fill="none" />

      {/* 6 Spokes from center out */}
      <line x1="50" y1="36" x2="50" y2="22" stroke="url(#introlic-logo-gradient)" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="62" y1="43" x2="74" y2="35" stroke="url(#introlic-logo-gradient)" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="62" y1="57" x2="74" y2="65" stroke="url(#introlic-logo-gradient)" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="50" y1="64" x2="50" y2="78" stroke="url(#introlic-logo-gradient)" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="38" y1="57" x2="26" y2="68" stroke="url(#introlic-logo-gradient)" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="38" y1="43" x2="26" y2="35" stroke="url(#introlic-logo-gradient)" strokeWidth="3.5" strokeLinecap="round" />

      {/* Central Core Circle */}
      <circle cx="50" cy="50" r="8" fill="url(#introlic-logo-gradient)" />
      <circle cx="50" cy="50" r="4.5" fill="#ffffff" />
    </svg>
  );
}
