"use client";

import React, { useRef, useEffect, useState } from 'react';

/**
 * LiquidLetter: A single character that maintains its own physics for displacement.
 * This allows "all letters" to react independently rather than the whole word as one block.
 */
function LiquidLetter({ char, index }: { char: string; index: number }) {
  const filterRef = useRef<SVGFEDisplacementMapElement>(null);
  const [targetScale, setTargetScale] = useState(0);
  const currentScale = useRef(0);
  const filterId = `liquid-filter-${index}`;

  useEffect(() => {
    let animationFrameId: number;

    const updatePhysics = () => {
      // Smooth lerp for the liquid "bounce"
      currentScale.current += (targetScale - currentScale.current) * 0.12;
      
      if (filterRef.current) {
        filterRef.current.scale.baseVal = currentScale.current;
      }
      
      animationFrameId = requestAnimationFrame(updatePhysics);
    };
    
    updatePhysics();
    return () => cancelAnimationFrame(animationFrameId);
  }, [targetScale]);

  return (
    <span 
      className="relative transition-transform duration-500 hover:scale-110"
      onMouseEnter={() => setTargetScale(70)}
      onMouseLeave={() => setTargetScale(0)}
    >
      <svg className="absolute w-0 h-0 invisible">
        <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.015" 
            numOctaves="2" 
            result="warp" 
          />
          <feDisplacementMap 
            ref={filterRef}
            xChannelSelector="R" 
            yChannelSelector="G" 
            scale="0" 
            in="SourceGraphic" 
            in2="warp" 
          />
        </filter>
      </svg>
      <span 
        style={{ filter: `url(#${filterId})` }}
        className="inline-block pointer-events-auto cursor-none transition-colors duration-500 hover:text-white/[0.08]"
      >
        {char}
      </span>
    </span>
  );
}

export default function LiquidBackground() {
  const brandName = "INTROLIC";

  return (
    <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden pointer-events-none px-10">
      <div className="flex select-none tracking-tighter leading-none whitespace-nowrap">
        {brandName.split('').map((char, i) => (
          <div key={i} className="text-[16vw] md:text-[22vw] lg:text-[18vw] font-black text-white/[0.04]">
            <LiquidLetter char={char} index={i} />
          </div>
        ))}
      </div>
    </div>
  );
}
