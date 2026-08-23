"use client";

import React, { useEffect, useRef } from 'react';

// Ink-blot / editorial typography background unique to the Blog page
export default function InkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Horizontal text-like lines flowing across — "words on a page"
    let frame = 0;
    let animId: number;

    const lines: { y: number; len: number; speed: number; opacity: number; delay: number }[] = [];
    for (let i = 0; i < 28; i++) {
      lines.push({
        y: 40 + i * 28,
        len: 0.3 + Math.random() * 0.55,
        speed: 0.0003 + Math.random() * 0.0005,
        opacity: 0.03 + Math.random() * 0.05,
        delay: Math.random() * 200,
      });
    }

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      lines.forEach(line => {
        const t = Math.max(0, frame - line.delay);
        const alpha = Math.min(line.opacity, (t / 120) * line.opacity);
        const pulse = alpha + Math.sin(frame * line.speed * 20) * 0.015;
        ctx.fillStyle = `rgba(255, 255, 255, ${pulse})`;
        // Draw a "text line" as a rounded rect
        const w = W * line.len;
        const x = (W - w) * 0.07;
        ctx.beginPath();
        ctx.roundRect(x, line.y, w, 2.5, 1.5);
        ctx.fill();
      });

      frame++;
      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-[1]"
      aria-hidden="true"
    />
  );
}
