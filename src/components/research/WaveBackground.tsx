"use client";

import React, { useEffect, useRef } from 'react';

export default function WaveBackground() {
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

    // Wave definitions — layered oscilloscope signals
    const waves = [
      { amp: 70,  freq: 0.010, speed: 0.012, phase: 0.0,  opacity: 0.04, width: 1.5, blue: false },
      { amp: 45,  freq: 0.018, speed: 0.020, phase: 1.8,  opacity: 0.06, width: 1.0, blue: false },
      { amp: 90,  freq: 0.006, speed: 0.007, phase: 3.5,  opacity: 0.03, width: 2.0, blue: false },
      { amp: 30,  freq: 0.026, speed: 0.030, phase: 0.9,  opacity: 0.05, width: 0.7, blue: false },
      // Primary signal — blue, sharp
      { amp: 50,  freq: 0.014, speed: 0.018, phase: 0.4,  opacity: 0.55, width: 1.5, blue: true  },
    ];

    let frame = 0;
    let animId: number;

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      waves.forEach(wave => {
        ctx.beginPath();
        ctx.lineWidth = wave.width;
        ctx.strokeStyle = wave.blue
          ? `rgba(0, 163, 255, ${wave.opacity})`
          : `rgba(255, 255, 255, ${wave.opacity})`;

        for (let x = 0; x <= W; x += 2) {
          const y =
            H / 2 +
            Math.sin(x * wave.freq + frame * wave.speed + wave.phase) * wave.amp +
            Math.sin(x * wave.freq * 2.1 + frame * wave.speed * 0.6) * (wave.amp * 0.25);

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });

      // Slow horizontal scan line
      const scanX = ((frame * 0.9) % (W + 200)) - 100;
      const grad = ctx.createLinearGradient(scanX - 120, 0, scanX + 40, 0);
      grad.addColorStop(0, 'rgba(0, 163, 255, 0)');
      grad.addColorStop(0.7, 'rgba(0, 163, 255, 0.05)');
      grad.addColorStop(1, 'rgba(0, 163, 255, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(scanX - 120, 0, 160, H);

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
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    />
  );
}
